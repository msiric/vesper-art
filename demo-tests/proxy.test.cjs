const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const source=fs.readFileSync('functions/api/[[path]].js','utf8');
const modulePromise=import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
const env={API_ORIGIN:'https://vesper-art-demo-api.onrender.com',DEMO_PROXY_SECRET:'generated-test-secret'};
test('proxy forwards bounded uploads, polling queries and cookies with trusted headers',async()=>{
 const {onRequest}=await modulePromise; const original=global.fetch;let seen;
 global.fetch=async(url,options)=>{seen={url,options};return new Response('ok',{headers:{'Set-Cookie':'jid=test; Secure; HttpOnly; SameSite=Lax; Path=/api/auth'}});};
 try {
  const r=await onRequest({env,request:new Request('https://vesper-art-demo.pages.dev/api/artwork',{method:'POST',headers:{Origin:'https://vesper-art-demo.pages.dev','Content-Type':'multipart/form-data; boundary=test','X-Demo-Proxy-Secret':'spoof','X-Demo-Client-IP':'spoof','CF-Connecting-IP':'192.0.2.1'},body:'--test--'})});
  assert.equal(r.status,200);assert.match(r.headers.get('set-cookie'),/HttpOnly/);assert.equal(seen.options.headers.get('x-demo-proxy-secret'),env.DEMO_PROXY_SECRET);assert.equal(seen.options.headers.get('x-demo-client-ip'),'192.0.2.1');assert.equal(new TextDecoder().decode(seen.options.body),'--test--');
  await onRequest({env,request:new Request('https://vesper-art-demo.pages.dev/api/socket.io/?EIO=4&transport=polling')});
  assert.equal(seen.url.search,'?EIO=4&transport=polling');assert.equal(seen.options.headers.get('origin'),'https://vesper-art-demo.pages.dev');
 } finally {global.fetch=original;}
});
test('proxy rejects foreign origins and overlarge streamed bodies without Content-Length',async()=>{
 const {onRequest}=await modulePromise;
 assert.equal((await onRequest({env,request:new Request('https://vesper-art-demo.pages.dev/api/artwork',{method:'POST',headers:{Origin:'https://foreign.invalid'}})})).status,403);
 assert.equal((await onRequest({env,request:new Request('https://vesper-art-demo.pages.dev/api/artwork',{method:'POST',headers:{Origin:'https://vesper-art-demo.pages.dev'},body:new Uint8Array(2200001)})})).status,413);
 assert.equal((await onRequest({env:{},request:new Request('https://vesper-art-demo.pages.dev/api/artwork')})).status,503);
});
