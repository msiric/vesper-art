import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import openSocket from 'socket.io-client';
import App from '../../App';
import { useUserStore } from '../../contexts/global/user';
import { useEventsStore } from '../../contexts/global/events';
import { useAppStore } from '../../contexts/global/app';
import { sampleAdapter } from '../../demo/sample';
import history from '../../utils/history';

const raw=axios.create({timeout:85000,withCredentials:true});
const httpAdapter=axios.getAdapter(axios.defaults.adapter);
let live=false;
export const ax=axios.create({timeout:85000,withCredentials:true,adapter:config=>live ? httpAdapter(config) : sampleAdapter(config)});
export const socket={instance:null};
let refreshing;
function applySession(data) {
  const {user,accessToken}=data;
  live=true;sessionStorage.setItem('vesper-demo-live','true');
  useUserStore.getState().setUser({...user,authenticated:true,token:accessToken,favorites:Object.fromEntries((user.favorites || []).map(f=>[f.artworkId,true]))});
  useEventsStore.getState().setEvents({notifications:{count:user.notifications || 0}});
}
function resetDemo(message='') {
  live=false;sessionStorage.removeItem('vesper-demo-live');socket.instance?.disconnect();
  useUserStore.getState().resetUser();useEventsStore.getState().resetEvents();
  window.dispatchEvent(new CustomEvent('vesper-demo-reset',{detail:message}));
}
ax.interceptors.request.use(config=>{
  const token=useUserStore.getState().token;
  if (live && token) config.headers.Authorization=`Bearer ${token}`;
  return config;
});
ax.interceptors.response.use(response=>{
  if (response.config.url==='/api/auth/logout') resetDemo();
  return response;
}, async error=>{
  const config=error.config;
  if (live && error.response?.status===401 && config && !config._retry && !config.url.includes('/auth/')) {
    config._retry=true;
    try {
      if (!refreshing) refreshing=raw.post('/api/auth/refresh_token').then(({data})=>{applySession(data);return data.accessToken;}).finally(()=>{refreshing=null;});
      config.headers.Authorization=`Bearer ${await refreshing}`;
      return ax(config);
    } catch { resetDemo('Your temporary session ended. The sample gallery is available; you can start again.'); }
  }
  return Promise.reject(error);
});

export default function Interceptor() {
  const [initialPath]=useState(()=>window.location.pathname+window.location.search);
  const [mode,setMode]=useState('sample');const [busy,setBusy]=useState(false);const [message,setMessage]=useState('');
  const userId=useUserStore(state=>state.id);const token=useUserStore(state=>state.token);
  const {enqueueSnackbar}=useSnackbar();
  useEffect(()=>{
    useAppStore.getState().setApp({loading:false,error:false});
    let mounted=true;let starting=false;
    async function start(refresh=false) {
      if(starting)return;starting=true;
      setBusy(true);setMessage('Starting the free demo server. This can take about a minute.');
      try {
        const {data}=await raw.post(refresh ? '/api/auth/refresh_token' : '/api/demo/session');
        if (!mounted) return;applySession(data);setMode('live');setMessage('');
        if (refresh) history.replace(initialPath);
        else if (['/login','/signup'].includes(window.location.pathname)) history.push('/');
      } catch(error) {
        if (mounted) {resetDemo();setMode('sample');setMessage(error.response?.data?.message || 'The live server is unavailable right now. You can still browse the sample gallery.');}
      } finally {starting=false;if(mounted)setBusy(false);}
    }
    const startEvent=()=>{if(!live)start(false);};
    const resetEvent=event=>{setMode('sample');setMessage(event.detail || '');};
    window.addEventListener('vesper-demo-start',startEvent);window.addEventListener('vesper-demo-reset',resetEvent);
    if (sessionStorage.getItem('vesper-demo-live')) start(true);
    return()=>{mounted=false;window.removeEventListener('vesper-demo-start',startEvent);window.removeEventListener('vesper-demo-reset',resetEvent);};
  },[]);
  useEffect(()=>{
    const id=ax.interceptors.response.use(response=>response,error=>{
      if (error.response?.data?.expose) enqueueSnackbar(error.response.data.message,{variant:'error'});
      return Promise.reject(error);
    });return()=>ax.interceptors.response.eject(id);
  },[enqueueSnackbar]);
  useEffect(()=>{
    if (!token || !live) return;
    const connection=openSocket({path:'/api/socket.io',transports:['polling'],auth:{token},autoConnect:false,reconnection:false});
    socket.instance=connection;
    connection.on('sendNotification',()=>{
      const events=useEventsStore.getState();
      events.invalidateNotifications();
      if (events.notifications.opened) useEventsStore.getState().fetchNotifications({userId,shouldFetch:true});
    });
    let last=0;
    const activate=()=>{if(!document.hidden && !connection.connected && Date.now()-last>30000){last=Date.now();connection.connect();}};
    const visibility=()=>{if(document.hidden)connection.disconnect();else activate();};
    document.addEventListener('visibilitychange',visibility);document.addEventListener('pointerdown',activate);activate();
    return()=>{connection.disconnect();document.removeEventListener('visibilitychange',visibility);document.removeEventListener('pointerdown',activate);};
  },[token]);
  async function end() {setBusy(true);try{await ax.post('/api/auth/logout');history.push('/');}catch{setMessage('Could not end the server session. Try again.');}finally{setBusy(false);}}
  return <>
    <aside aria-label="Demo status" style={{background:'#171b20',color:'#fff',padding:'12px 20px',borderBottom:'1px solid #d68024',position:'relative',zIndex:1300,font:'14px/1.5 system-ui',display:'flex',gap:12,flexWrap:'wrap',alignItems:'center'}}>
      <div style={{flex:'1 1 340px'}}><strong>{mode==='live' ? 'Live demo · temporary account' : 'Read-only sample gallery'}</strong><br/>
      Fictional marketplace. Licenses and payments are simulated. Use sample content only; accounts expire after 24 hours.
      {message && <div role="status" style={{marginTop:5,color:'#ffd49d'}}>{message}</div>}</div>
      <button disabled={busy} onClick={mode==='live' ? end : ()=>window.dispatchEvent(new Event('vesper-demo-start'))} style={{padding:'10px 16px',border:0,borderRadius:5,background:'#d68024',color:'#fff',cursor:'pointer',fontWeight:600}}>{busy?'Please wait…':mode==='live'?'End demo session':'Start live demo'}</button>
    </aside>
    <App key={`${mode}:${userId || 'sample'}`} />
  </>;
}
