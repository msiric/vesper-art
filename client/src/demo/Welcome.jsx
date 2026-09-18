import React from 'react';
export default function DemoWelcome(){return <section style={{maxWidth:520,margin:'64px auto',padding:24,textAlign:'center',color:'#eee',fontFamily:'system-ui'}}>
  <h1>Try the Vesper marketplace</h1><p>Start a temporary demo account to favourite artwork, leave sample comments, upload a small test image and try simulated licensing.</p>
  <p>No email, password or payment card is needed. Do not enter personal information. Demo content expires after 24 hours.</p>
  <button onClick={()=>window.dispatchEvent(new Event('vesper-demo-start'))} style={{padding:'12px 22px',background:'#d68024',color:'white',border:0,borderRadius:5,fontSize:16}}>Start live demo</button>
</section>;}
