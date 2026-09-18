const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const ts=require('typescript');
function setup(){
 const calls=[];
 const source=ts.transpileModule(fs.readFileSync('client/src/contexts/local/homeArtwork.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText;
 const exports={};
 vm.runInNewContext(source,{exports,require(name){
  if(name==='zustand')return require('../client/node_modules/zustand');
  if(name.includes('services/artwork'))return {getArtwork:{request:args=>new Promise((resolve,reject)=>calls.push({args,resolve,reject}))}};
  if(name.includes('helpers'))return {resolvePaginationId:rows=>rows.at(-1)?.id||'',resolveAsyncError:()=>({refetch:true})};
  throw new Error(name);
 }});
 return {store:exports.useHomeArtwork,calls};
}
test('gallery ignores an old session response and suppresses duplicate page requests',async()=>{
 const {store,calls}=setup();const old=store.getState().fetchArtwork();
 await store.getState().fetchArtwork();assert.equal(calls.length,1);
 store.getState().resetArtwork();const current=store.getState().fetchArtwork();
 calls[1].resolve({data:{artwork:[{id:'live'}]}});await current;
 calls[0].resolve({data:{artwork:[{id:'sample'}]}});await old;
 assert.equal(store.getState().artwork.data.length,1);assert.equal(store.getState().artwork.data[0].id,'live');
 assert.equal(store.getState().artwork.cursor,'live');
});
test('an old failed request cannot replace the next session gallery state',async()=>{
 const {store,calls}=setup();const old=store.getState().fetchArtwork();store.getState().resetArtwork();
 const current=store.getState().fetchArtwork();calls[0].reject(new Error('Old request'));await old;
 assert.equal(store.getState().artwork.loading,true);assert.equal(store.getState().artwork.error.refetch,false);
 calls[1].resolve({data:{artwork:[{id:'current'}]}});await current;assert.equal(store.getState().artwork.loading,false);
});
