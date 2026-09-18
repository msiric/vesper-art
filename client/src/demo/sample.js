import snapshot from '../../../common/demo/snapshot.json';
const failure = (config,status,message) => Promise.reject(Object.assign(new Error(message),{ config,response:{status,config,data:{message,expose:true}} }));
export async function sampleAdapter(config) {
  const url=new URL(config.url,'https://demo.invalid');
  const path=url.pathname;
  const respond=data=>({data:structuredClone(data),status:200,statusText:'OK',headers:{},config});
  if (path.endsWith('/analytics')) return respond({message:'Sample views are not tracked'});
  if (config.method !== 'get') return failure(config,403,'Start the live demo to try this action.');
  const paginate=items=>{
    const cursor=url.searchParams.get('cursor');
    const start=cursor ? items.findIndex(item=>item.id===cursor)+1 : 0;
    return items.slice(start,start+Math.min(Number(url.searchParams.get('limit')) || 20,40));
  };
  if (path==='/api/artwork' || path==='/api/users/sample_artist/artwork') return respond({artwork:paginate(snapshot.gallery.artwork)});
  if (path==='/api/users/sample_artist') return respond(snapshot.profile);
  if (path==='/api/users/sample_artist/favorites') return respond({favorites:[]});
  const detail=/^\/api\/artwork\/([^/]+)$/.exec(path);
  if (detail && snapshot.details[detail[1]]) return respond(snapshot.details[detail[1]]);
  if (/^\/api\/artwork\/[^/]+\/comments$/.test(path)) return respond({comments:[]});
  if (/^\/api\/artwork\/[^/]+\/favorites$/.test(path)) return respond({favorites:[]});
  if (path==='/api/search') {
    const query=(url.searchParams.get('q') || '').toLowerCase();const type=url.searchParams.get('t') || 'artwork';
    const items=type==='artwork' ? snapshot.gallery.artwork.filter(a=>a.current.title.toLowerCase().includes(query)) : [snapshot.profile.user].filter(u=>u.name.includes(query));
    return respond({searchData:paginate(items),searchDisplay:type});
  }
  return failure(config,404,'This item is not in the sample gallery. Start the live demo to explore it.');
}
