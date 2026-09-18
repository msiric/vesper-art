// Creates and removes its own empty local database; refuses remote databases.
require('dotenv').config();
const assert=require('node:assert/strict');
const {Client}=require('pg');
const {DataSource}=require('typeorm');
const {databaseOptions}=require('../dist/config/database');
(async()=>{
 const original=new URL(process.env.PG_DB_URL);assert.equal(original.hostname,'127.0.0.1');assert.equal(original.pathname,'/vesper_demo');
 const name='vesper_migration_'+require('node:crypto').randomBytes(8).toString('hex');
 const admin=new Client({connectionString:original.toString()});await admin.connect();let db,created=false;
 try{
  await admin.query(`CREATE DATABASE "${name}"`);created=true;
  const target=new URL(original);target.pathname='/'+name;
  db=new DataSource({...databaseOptions(),url:target.toString()});await db.initialize();
  await db.runMigrations();assert.equal(await db.getRepository('User').count(),0);
  await db.undoLastMigration();assert.equal(await db.showMigrations(),true);
  await db.runMigrations();assert.equal(await db.showMigrations(),false);
  assert.equal((await db.driver.createSchemaBuilder().log()).upQueries.length,0);
  console.log('PASS: isolated local migration up/down/up; zero schema drift');
 }finally{
  if(db?.isInitialized)await db.destroy();
  if(created)await admin.query(`DROP DATABASE "${name}"`);
  await admin.end();
 }
})().catch(e=>{console.error(e.message);process.exitCode=1;});
