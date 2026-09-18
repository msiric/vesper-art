const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const sharp = require('sharp');
require('dotenv').config();
const { connectToDatabase } = require('../dist/utils/database');
const { seedDemo, pruneExpiredSessions } = require('../dist/utils/demo');
const { User } = require('../dist/entities/User');
const { DemoUpload } = require('../dist/entities/DemoUpload');
const { sendEmail } = require('../dist/utils/email');
const jwt = require('jsonwebtoken');
const catalog = require('../common/demo/catalog.json');
let db, server, base, a, b;
const created = [];
const origin = 'http://127.0.0.1:5175';
async function request(path, { method='GET', user, body, cookie, headers={} } = {}) {
  const r = await fetch(base + path, { method, headers: {Origin:origin, ...(user ? {Authorization:`Bearer ${user.accessToken}`} : {}), ...(cookie ? {Cookie:cookie} : {}), ...(body && !(body instanceof FormData) ? {'Content-Type':'application/json'} : {}), ...headers}, body:body ? body instanceof FormData ? body : JSON.stringify(body) : undefined });
  const data = (r.headers.get('content-type') || '').includes('application/json') ? await r.json() : Buffer.from(await r.arrayBuffer());
  return { status:r.status, data, cookie:r.headers.get('set-cookie')?.split(';')[0], headers:r.headers };
}
async function session() {
  const r=await request('/api/demo/session',{method:'POST'});
  assert.equal(r.status,200,JSON.stringify(r.data));created.push(r.data.user.id);
  return {...r.data,cookie:r.cookie};
}
before(async () => {
  const target=new URL(process.env.PG_DB_URL);
  assert.equal(target.hostname,'127.0.0.1');assert.equal(target.pathname,'/vesper_demo');
  db=await connectToDatabase();await db.runMigrations();await seedDemo(db);
  server=http.createServer(require('../dist/app').default);
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));base=`http://127.0.0.1:${server.address().port}`;
  a=await session();b=await session();
});
after(async()=>{
  if(server)await new Promise(resolve=>server.close(resolve));
  if(db){await db.transaction(async manager=>{for(const id of created)await manager.delete(User,{id});await pruneExpiredSessions(manager);});await db.destroy();}
});
test('public gallery, detail and search work with bounded pagination',async()=>{
  const r=await request('/api/artwork?limit=40');assert.equal(r.status,200);assert.equal(r.data.artwork.length,28);assert.equal(typeof r.data.artwork[0].favorites,'number');
  const detail=await request(`/api/artwork/${catalog.artwork[0].data.id}`);assert.equal(detail.status,200);assert.ok(detail.data.artwork.current.cover.source.startsWith('/demo-assets/'));
  const search=await request('/api/search?q=Tree&t=artwork&limit=10');assert.equal(search.status,200);assert.ok(search.data.searchData.length);
  for(const limit of ['NaN','100000','-1','1x']) assert.equal((await request('/api/artwork?limit='+limit)).status,400);
});
test('sessions are distinct and body identity cannot redirect favourite ownership',async()=>{
  assert.notEqual(a.user.id,b.user.id);assert.match(a.user.email,/@example\.invalid$/);
  const id=catalog.artwork[4].data.id;
  const r=await request(`/api/artwork/${id}/favorites`,{method:'POST',user:a,body:{userId:b.user.id}});assert.equal(r.status,200,JSON.stringify(r.data));
  const rows=await db.query('SELECT "ownerId" FROM favorite WHERE "artworkId"=$1',[id]);assert.deepEqual(rows.map(r=>r.ownerId),[a.user.id]);
  assert.equal((await request(`/api/users/${a.user.id}/settings`,{user:b})).status,403);
});
test('comments persist and cannot be edited or deleted by another visitor',async()=>{
  const id=catalog.artwork[5].data.id;
  const r=await request(`/api/artwork/${id}/comments`,{method:'POST',user:a,body:{commentContent:'A synthetic integration-test comment.'}});assert.equal(r.status,200,JSON.stringify(r.data));
  const [comment]=await db.query('SELECT id FROM comment WHERE "ownerId"=$1 AND "artworkId"=$2',[a.user.id,id]);
  assert.ok(comment);
  assert.equal((await request(`/api/users/${a.user.id}/comments/${comment.id}`,{method:'DELETE',user:b})).status,403);
  const patch=await request(`/api/users/${a.user.id}/comments/${comment.id}`,{method:'PATCH',user:a,body:{commentContent:'Updated synthetic comment.'}});assert.equal(patch.status,200,JSON.stringify(patch.data));
});
test('simulated licensing creates one zero-cost receipt and rejects duplicates',async()=>{
  const version=catalog.artwork[6].version.data.id;
  const options={method:'POST',user:a,body:{licenseUsage:'individual',licenseCompany:'unavailable',licenseType:'personal'}};
  const r=await request('/api/download/'+version,options);assert.equal(r.status,200,JSON.stringify(r.data));
  const rows=await db.query('SELECT spent,earned,fee FROM "order" WHERE "buyerId"=$1 AND "versionId"=$2',[a.user.id,version]);assert.deepEqual(rows,[{spent:0,earned:0,fee:0}]);
  assert.notEqual((await request('/api/download/'+version,options)).status,200);
  assert.equal((await db.query('SELECT COUNT(*)::int AS count FROM "order" WHERE "buyerId"=$1 AND "versionId"=$2',[a.user.id,version]))[0].count,1);
});
test('bounded uploads persist in Postgres and malformed input rolls back',async()=>{
  const png=await sharp({create:{width:1200,height:1200,channels:3,background:'#64909b'}}).png().toBuffer();
  const form=new FormData();form.set('artworkMedia',new Blob([png],{type:'image/png'}),'demo.png');
  for(const [key,value] of Object.entries({artworkTitle:'Synthetic test artwork',artworkDescription:'A generated test square',artworkAvailability:'available',artworkType:'free',artworkLicense:'personal',artworkUse:'unavailable',artworkPersonal:'0',artworkCommercial:'0',artworkVisibility:'visible'}))form.set(key,value);
  const r=await request('/api/artwork',{method:'POST',user:a,body:form});assert.equal(r.status,200,JSON.stringify(r.data));
  const rows=await db.query('SELECT id,bytes FROM demo_upload WHERE "ownerId"=$1',[a.user.id]);assert.equal(rows.length,2);assert.ok(rows.every(r=>r.bytes>0));
  const image=await request('/api/demo/assets/'+rows[0].id);assert.equal(image.status,200);assert.equal(image.headers.get('content-type'),'image/jpeg');
  const malformed=new FormData();malformed.set('artworkMedia',new Blob(['not an image'],{type:'image/png'}),'bad.png');
  assert.notEqual((await request('/api/artwork',{method:'POST',user:a,body:malformed})).status,200);
  assert.equal((await db.query('SELECT COUNT(*)::int AS count FROM demo_upload WHERE "ownerId"=$1',[a.user.id]))[0].count,2);
});
test('account storage and action budgets reject excess work without partial writes',async()=>{
  const quotaId=require('node:crypto').randomUUID();
  await db.getRepository(DemoUpload).insert({id:quotaId,ownerId:b.user.id,mimeType:'image/jpeg',content:Buffer.alloc(2*1024*1024),bytes:2*1024*1024});
  const avatar=await sharp({create:{width:128,height:128,channels:3,background:'#888'}}).png().toBuffer();
  const form=new FormData();form.set('userMedia',new Blob([avatar],{type:'image/png'}),'avatar.png');form.set('userDescription','Synthetic profile');form.set('userCountry','HR');
  const full=await request(`/api/users/${b.user.id}`,{method:'PATCH',user:b,body:form});assert.equal(full.status,413,JSON.stringify(full.data));
  assert.equal(await db.getRepository(DemoUpload).countBy({ownerId:b.user.id}),1);
  await db.getRepository(User).update({id:b.user.id},{demoWrites:60});
  const r=await request(`/api/artwork/${catalog.artwork[7].data.id}/favorites`,{method:'POST',user:b});assert.equal(r.status,429,JSON.stringify(r.data));
  assert.equal((await db.query('SELECT COUNT(*)::int AS count FROM favorite WHERE "ownerId"=$1',[b.user.id]))[0].count,0);
});
test('origin checks, disabled real auth and simulated email prevent external side effects',async()=>{
  assert.equal((await request('/api/demo/session',{method:'POST',headers:{Origin:'https://untrusted.invalid'}})).status,403);
  assert.equal((await request('/api/auth/signup',{method:'POST',body:{userEmail:'real@example.com'}})).status,403);
  assert.equal((await sendEmail({emailReceiver:'nobody@example.invalid',emailSubject:'test',emailContent:'test'})).simulated,true);
});
test('refresh validates expiry; logout revokes both access and refresh tokens',async()=>{
  const refresh=await request('/api/auth/refresh_token',{method:'POST',cookie:a.cookie});assert.equal(refresh.status,200,JSON.stringify(refresh.data));
  const expired=jwt.sign({userId:a.user.id,jwtVersion:0},process.env.REFRESH_TOKEN_SECRET,{algorithm:'HS256',expiresIn:-1});
  assert.ok([401,403].includes((await request('/api/auth/refresh_token',{method:'POST',cookie:'jid='+expired})).status));
  await db.getRepository(User).update({id:a.user.id},{demoWrites:60});
  const logout=await request('/api/auth/logout',{method:'POST',user:a});assert.equal(logout.status,200,JSON.stringify(logout.data));
  assert.equal((await request(`/api/users/${a.user.id}/settings`,{user:a})).status,401);
  assert.ok([401,403].includes((await request('/api/auth/refresh_token',{method:'POST',cookie:a.cookie})).status));
});
test('expired accounts and their uploaded data are removed without touching catalog',async()=>{
  await db.getRepository(User).update({id:a.user.id},{demoExpiresAt:new Date(0)});
  await db.transaction(manager=>pruneExpiredSessions(manager));
  assert.equal(await db.getRepository(User).existsBy({id:a.user.id}),false);
  assert.equal(await db.getRepository(DemoUpload).countBy({ownerId:a.user.id}),0);
  assert.equal((await db.query('SELECT COUNT(*)::int AS count FROM artwork WHERE "ownerId"=$1',[catalog.data.id]))[0].count,28);
});
test('explicit migrations match entity metadata',async()=>{
  assert.equal((await db.driver.createSchemaBuilder().log()).upQueries.length,0);
});
