// components.js – Alle UI-Komponenten

import { html, useState, useEffect, useRef } from 'https://unpkg.com/htm/preact/standalone.module.js';
import { BANDS, PLANS, COMPS, rndC } from './plans.js';

export function Timer({sec:initS,label}){
  const[s,setS]=useState(initS);const[run,setRun]=useState(false);const[adj,setAdj]=useState(initS);const ref=useRef(null);
  useEffect(()=>{if(run&&s>0)ref.current=setInterval(()=>setS(v=>v-1),1000);else if(s<=0&&run)setRun(false);return()=>clearInterval(ref.current)},[run,s]);
  const pct=adj>0?(s/adj)*100:0,done=s<=0&&!run,mn=Math.floor(s/60),sc=s%60;
  const ad=d=>{const v=Math.max(5,adj+d);setAdj(v);if(!run)setS(v)};
  return html`<div style=${{background:'var(--bg3)',borderRadius:10,padding:'10px 14px',margin:'6px 0'}}>
    <div style=${{fontSize:12,color:'var(--t3)',marginBottom:4}}>${label}</div>
    <div style=${{display:'flex',alignItems:'center',gap:10}}>
      <div style=${{position:'relative',width:52,height:52}}>
        <svg width=52 height=52 style="transform:rotate(-90deg)"><circle cx=26 cy=26 r=22 fill="none" stroke="var(--brd)" stroke-width=3.5/>
        <circle cx=26 cy=26 r=22 fill="none" stroke=${done?'var(--acc)':s<=5&&s>0?'var(--dng)':'var(--acc)'} stroke-width=3.5 stroke-dasharray=138.2 stroke-dashoffset=${138.2*(1-pct/100)} stroke-linecap="round" style="transition:stroke-dashoffset .3s"/></svg>
        <div style=${{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,fontWeight:700,fontVariantNumeric:'tabular-nums',color:done?'var(--acc)':'#fff'}}>${done?'✓':`${mn}:${String(sc).padStart(2,'0')}`}</div>
      </div>
      <div style=${{display:'flex',gap:4}}>
        <button onClick=${()=>ad(-5)} style=${{background:'var(--brd)',color:'#aaa',borderRadius:5,padding:'4px 8px',fontSize:12}}>-5</button>
        <button onClick=${()=>ad(5)} style=${{background:'var(--brd)',color:'#aaa',borderRadius:5,padding:'4px 8px',fontSize:12}}>+5</button>
      </div>
      <div style=${{display:'flex',gap:4,marginLeft:'auto'}}>
        ${!run?html`<button onClick=${()=>{if(s<=0)setS(adj);setRun(true)}} style=${{background:'var(--acc)',color:'var(--bg)',borderRadius:7,width:36,height:36,fontSize:16,fontWeight:700}}>▶</button>`:
        html`<button onClick=${()=>setRun(false)} style=${{background:'var(--wrn)',color:'var(--bg)',borderRadius:7,width:36,height:36,fontSize:16,fontWeight:700}}>⏸</button>`}
        <button onClick=${()=>{setRun(false);setS(adj)}} style=${{background:'var(--brd2)',color:'#ccc',borderRadius:7,width:36,height:36,fontSize:16,fontWeight:700}}>↺</button>
      </div>
    </div>
  </div>`;
}

export function SR({num,d,onChange,isI,onTW,noKg}){
  return html`<div style=${{display:'flex',gap:6,alignItems:'center',padding:'5px 0',opacity:d.isW?.55:1}}>
    <button onClick=${onTW} style=${{width:26,height:26,borderRadius:5,fontSize:11,fontWeight:700,background:d.isW?'var(--wrnA)':'var(--bg4)',color:d.isW?'var(--wrn)':'var(--t4)'}}>${d.isW?'W':num}</button>
    <div style=${{flex:1,display:'flex',gap:6}}>
      ${isI?html`<input type=number inputMode=numeric placeholder=sek value=${d.secs||""} onInput=${e=>onChange({...d,secs:e.target.value})}/>`:
      html`<input type=number inputMode=numeric placeholder=reps value=${d.reps||""} onInput=${e=>onChange({...d,reps:e.target.value})}/>`}
      ${!noKg?html`<input type=number inputMode=decimal placeholder=kg value=${d.kg||""} onInput=${e=>onChange({...d,kg:e.target.value})}/>`:null}
    </div>
  </div>`;
}

export function UR({num,d,onChange,isI,onTW}){
  return html`<div style=${{padding:'5px 0',opacity:d.isW?.55:1}}>
    <div style=${{display:'flex',alignItems:'center',gap:6,marginBottom:3}}>
      <button onClick=${onTW} style=${{width:26,height:26,borderRadius:5,fontSize:11,fontWeight:700,background:d.isW?'var(--wrnA)':'var(--bg4)',color:d.isW?'var(--wrn)':'var(--t4)'}}>${d.isW?'W':num}</button>
      <span style=${{fontSize:12,fontWeight:600,color:'var(--acc)',width:16}}>R</span>
      <div style=${{flex:1,display:'flex',gap:6}}>
        ${isI?html`<input type=number placeholder=sek value=${d.sR||""} onInput=${e=>onChange({...d,sR:e.target.value})}/>`:
        html`<input type=number placeholder=reps value=${d.rR||""} onInput=${e=>onChange({...d,rR:e.target.value})}/>`}
        <input type=number placeholder=kg value=${d.kR||""} onInput=${e=>onChange({...d,kR:e.target.value})}/>
      </div>
    </div>
    <div style=${{display:'flex',alignItems:'center',gap:6,marginLeft:32}}>
      <span style=${{fontSize:12,fontWeight:600,color:'var(--wrn)',width:16}}>L</span>
      <div style=${{flex:1,display:'flex',gap:6}}>
        ${isI?html`<input type=number placeholder=sek value=${d.sL||""} onInput=${e=>onChange({...d,sL:e.target.value})}/>`:
        html`<input type=number placeholder=reps value=${d.rL||""} onInput=${e=>onChange({...d,rL:e.target.value})}/>`}
        <input type=number placeholder=kg value=${d.kL||""} onInput=${e=>onChange({...d,kL:e.target.value})}/>
      </div>
    </div>
  </div>`;
}

export function AstMach({d,onChange}){
  const bw=parseFloat(d.bw)||0,as=parseFloat(d.as)||0,mv=Math.max(0,bw-as);
  return html`<div style=${{background:'var(--bg3)',borderRadius:8,padding:'8px 10px',margin:'4px 0'}}>
    <div style=${{fontSize:12,color:'var(--t3)',marginBottom:4}}>Assisted Pull-Up (Maschine)</div>
    <div style=${{display:'flex',gap:6,alignItems:'center'}}>
      <div style=${{flex:1}}><div style=${{fontSize:11,color:'var(--t4)',marginBottom:2}}>Körpergewicht</div><input type=number placeholder=kg value=${d.bw||""} onInput=${e=>onChange({...d,bw:e.target.value})}/></div>
      <div style=${{color:'var(--t4)'}}>−</div>
      <div style=${{flex:1}}><div style=${{fontSize:11,color:'var(--t4)',marginBottom:2}}>Unterstützung</div><input type=number placeholder=kg value=${d.as||""} onInput=${e=>onChange({...d,as:e.target.value})}/></div>
      <div style=${{color:'var(--t4)'}}>=</div>
      <div style=${{flex:1,textAlign:'center'}}><div style=${{fontSize:11,color:'var(--t4)',marginBottom:2}}>Bewegt</div><div style=${{fontSize:18,fontWeight:800,color:'var(--acc)'}}>${mv.toFixed(1)}</div></div>
    </div>
  </div>`;
}

export function AstBand({d,onChange}){
  const band=BANDS.find(b=>b.id===d.bandId)||BANDS[0];
  const bw=parseFloat(d.bw)||0,mv=Math.max(0,bw-band.kg);
  return html`<div style=${{background:'var(--bg3)',borderRadius:8,padding:'8px 10px',margin:'4px 0'}}>
    <div style=${{fontSize:12,color:'var(--t3)',marginBottom:4}}>Assisted Pull-Up (Band)</div>
    <select value=${d.bandId||"none"} onChange=${e=>{const b=BANDS.find(x=>x.id===e.target.value);onChange({...d,bandId:e.target.value,bandKg:b?.kg||0})}}>
      ${BANDS.map(b=>html`<option key=${b.id} value=${b.id}>${b.label}</option>`)}
    </select>
    <div style=${{display:'flex',gap:6,alignItems:'center',marginTop:6}}>
      <div style=${{flex:1}}><div style=${{fontSize:11,color:'var(--t4)',marginBottom:2}}>Körpergewicht</div><input type=number placeholder=kg value=${d.bw||""} onInput=${e=>onChange({...d,bw:e.target.value})}/></div>
      <div style=${{color:'var(--t4)'}}>−</div>
      <div style=${{flex:1,textAlign:'center'}}><div style=${{fontSize:11,color:'var(--t4)',marginBottom:2}}>Band (~)</div><div style=${{fontSize:16,fontWeight:700,color:'var(--wrn)'}}>${band.kg} kg</div></div>
      <div style=${{color:'var(--t4)'}}>=</div>
      <div style=${{flex:1,textAlign:'center'}}><div style=${{fontSize:11,color:'var(--t4)',marginBottom:2}}>Bewegt</div><div style=${{fontSize:18,fontWeight:800,color:'var(--acc)'}}>${mv.toFixed(1)}</div></div>
    </div>
  </div>`;
}

export function EC({ex,sets,onSet,onAdd,onRm,last,lastN,ast,onAst,note,onNote}){
  const[col,setCol]=useState(false);const[skip,setSkip]=useState(false);const[shN,setShN]=useState(false);
  const mv=ex.ast&&ast?Math.max(0,(parseFloat(ast.bw)||0)-(parseFloat(ast.as)||0)):
    ex.band&&ast?Math.max(0,(parseFloat(ast.bw)||0)-(parseFloat(ast.bandKg)||0)):null;
  if(skip)return html`<div class=crd style=${{opacity:.35,padding:'10px 14px'}}>
    <div style=${{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
      <span style=${{color:'var(--t3)',fontSize:14,textDecoration:'line-through'}}>${ex.n}</span>
      <button onClick=${()=>setSkip(false)} style=${{borderRadius:5,padding:'4px 10px',fontSize:12,background:'var(--accA)',color:'var(--acc)'}}>Zurück</button>
    </div></div>`;
  return html`<div class=crd>
    <div style=${{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:2}}>
      <div style=${{flex:1,cursor:'pointer'}} onClick=${()=>setCol(!col)}>
        <div style=${{fontSize:15,fontWeight:700,lineHeight:1.3}}>${ex.n} <span style=${{fontSize:12,color:'var(--t4)'}}>${col?'▸':'▾'}</span></div>
        <div style=${{fontSize:12,color:'var(--acc)',marginTop:1}}>${ex.m}</div>
        <div style=${{fontSize:11,color:'var(--t4)'}}>${ex.s}×${ex.rp} · ${ex.tp}${ex.g?' · '+ex.g:''}</div>
        ${ex.w?html`<div style=${{fontSize:11,color:'var(--wrn)'}}>${ex.w}</div>`:null}
        ${ex.h?html`<div style=${{fontSize:11,color:'var(--prp)',marginTop:1}}>💡 ${ex.h}</div>`:null}
      </div>
      <div style=${{display:'flex',gap:4,flexShrink:0}}>
        <button onClick=${()=>setShN(!shN)} style=${{background:'none',color:note?'var(--wrn)':'var(--brd2)',fontSize:15}}>📝</button>
        <button onClick=${()=>setSkip(true)} style=${{borderRadius:5,padding:'4px 10px',fontSize:12,background:'var(--dngA)',color:'var(--dng)'}}>Skip</button>
      </div>
    </div>
    ${!col&&html`
      ${lastN?html`<div style=${{background:'#1a1520',borderRadius:6,padding:'5px 8px',margin:'4px 0',fontSize:12,color:'var(--prp)'}}>📝 ${lastN}</div>`:null}
      ${shN?html`<input type=text placeholder="Notiz..." value=${note||""} onInput=${e=>onNote(e.target.value)} style=${{fontSize:13,margin:'4px 0'}}/>`:null}
      ${last&&last.length>0?html`<div style=${{background:'var(--bg3)',borderRadius:6,padding:'5px 8px',margin:'4px 0',fontSize:12,color:'var(--t3)'}}>
        Letztes Mal: ${last.map(s=>s.rR!==undefined?'R:'+(s.rR||s.sR||0)+'×'+(s.kR||0)+' L:'+(s.rL||s.sL||0)+'×'+(s.kL||0):(s.reps||s.secs||0)+(ex.noKg?'':'×'+(s.kg||0)+'kg')).join(' | ')}
      </div>`:null}
      ${ex.ast?html`<${AstMach} d=${ast||{}} onChange=${onAst}/>`:null}
      ${ex.band?html`<${AstBand} d=${ast||{}} onChange=${onAst}/>`:null}
      ${sets.map((s,i)=>ex.u?
        html`<${UR} key=${i} num=${i+1} d=${s} onChange=${d=>onSet(i,d)} isI=${ex.iso} onTW=${()=>onSet(i,{...s,isW:!s.isW})}/>`:
        html`<${SR} key=${i} num=${i+1} d=${s} onChange=${d=>{const nd={...d};if(mv!==null)nd.kg=String(mv.toFixed(1));onSet(i,nd)}} isI=${ex.iso} noKg=${ex.noKg} onTW=${()=>onSet(i,{...s,isW:!s.isW})}/>`)}
      <div style=${{display:'flex',gap:6,marginTop:4}}>
        <button onClick=${onAdd} style=${{borderRadius:5,padding:'4px 12px',fontSize:12,background:'#1a3a2a',color:'var(--acc)'}}>+ Set</button>
        ${sets.length>1?html`<button onClick=${onRm} style=${{borderRadius:5,padding:'4px 12px',fontSize:12,background:'#3a1a1a',color:'var(--dng)'}}>− Set</button>`:null}
      </div>
      ${ex.iso?html`<${Timer} sec=${ex.iS||30} label="Übungstimer"/>`:null}
      ${ex.rs>0?html`<${Timer} sec=${ex.rs} label="Pausentimer"/>`:null}
    `}
  </div>`;
}

export function WU({items}){
  const[ck,setCk]=useState({});const[nts,setNts]=useState({});const[nf,setNf]=useState(null);
  return html`<div class=crd style=${{background:'#151520'}}>
    <div style=${{fontSize:14,fontWeight:700,color:'var(--wrn)',marginBottom:6}}>🔥 Warm-up</div>
    ${items.map(w=>html`<div key=${w.id} style=${{padding:'4px 0',borderBottom:'1px solid #1a1a30'}}>
      <div style=${{display:'flex',alignItems:'center',gap:8}}>
        <div onClick=${()=>setCk(c=>({...c,[w.id]:!c[w.id]}))} style=${{width:22,height:22,borderRadius:5,border:'2px solid '+(ck[w.id]?'var(--acc)':'var(--brd2)'),background:ck[w.id]?'var(--accA)':'transparent',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',fontSize:13,color:'var(--acc)'}}>${ck[w.id]?'✓':''}</div>
        <div style=${{flex:1}}>
          <span style=${{fontSize:13,color:ck[w.id]?'var(--t4)':'var(--t2)',textDecoration:ck[w.id]?'line-through':'none'}}>${w.n}</span>
          <span style=${{fontSize:11,color:'var(--t4)',marginLeft:5}}>${w.r}</span>
        </div>
        <button onClick=${()=>setNf(nf===w.id?null:w.id)} style=${{background:'none',color:nts[w.id]?'var(--wrn)':'var(--brd2)',fontSize:14}}>📝</button>
      </div>
      ${w.nt?html`<div style=${{fontSize:11,color:'var(--wrn)',marginLeft:30,marginTop:1}}>${w.nt}</div>`:null}
      ${nf===w.id?html`<input type=text placeholder="Notiz..." value=${nts[w.id]||""} onInput=${e=>setNts(n=>({...n,[w.id]:e.target.value}))} style=${{fontSize:12,marginLeft:30,marginTop:3,width:'calc(100% - 30px)'}}/>`:null}
    </div>`)}
  </div>`;
}

export function WUT({items}){
  if(!items||!items.length)return null;
  return html`<div class=crd style=${{background:'#151520'}}>
    <div style=${{fontSize:14,fontWeight:700,color:'var(--wrn)',marginBottom:6}}>⏱ Aktivierung</div>
    ${items.map(w=>html`<div key=${w.id} style=${{marginBottom:8}}>
      <div style=${{fontSize:13,fontWeight:600,color:'var(--t2)'}}>${w.n}</div>
      ${w.nt?html`<div style=${{fontSize:11,color:'var(--wrn)',marginTop:1}}>${w.nt}</div>`:null}
      <${Timer} sec=${w.sec} label=${w.n}/>
    </div>`)}
  </div>`;
}

export function FC({w,vol,prev,dur}){
  const ref=useRef(null);const[comps]=useState(()=>rndC(vol));const p=PLANS[w.day];
  const diff=prev?vol-prev:null,pct=prev?((diff/prev)*100).toFixed(0):null;
  useEffect(()=>{
    const c=ref.current;if(!c)return;const ctx=c.getContext('2d');const W=400,H=520;
    c.width=W*2;c.height=H*2;c.style.width=W+'px';c.style.height=H+'px';ctx.scale(2,2);
    const g=ctx.createLinearGradient(0,0,W,H);g.addColorStop(0,'#0d0d1a');g.addColorStop(.5,'#1a1030');g.addColorStop(1,'#0d1a1a');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    ctx.globalAlpha=.07;ctx.fillStyle='#00d4aa';ctx.beginPath();ctx.arc(340,70,110,0,Math.PI*2);ctx.fill();ctx.fillStyle='#ff9f43';ctx.beginPath();ctx.arc(60,460,70,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
    ctx.fillStyle='#fff';ctx.font='bold 20px system-ui';ctx.textAlign='center';ctx.fillText(p.icon+' KATJAS WORKOUT',W/2,38);
    ctx.font='15px system-ui';ctx.fillStyle='#00d4aa';ctx.fillText(p.name+': '+p.label,W/2,60);
    ctx.strokeStyle='#252545';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(30,75);ctx.lineTo(W-30,75);ctx.stroke();
    ctx.font='bold 40px system-ui';ctx.fillStyle='#fff';ctx.fillText(vol.toLocaleString('de-DE')+' kg',W/2,120);
    ctx.font='13px system-ui';ctx.fillStyle='#7a7e95';ctx.fillText('Gesamtvolumen bewegt',W/2,142);
    ctx.fillStyle='#5a5e75';ctx.fillText('Das entspricht ungefähr...',W/2,174);
    comps.forEach((co,i)=>{const y=200+i*35;ctx.textAlign='left';ctx.font='22px system-ui';ctx.fillText(co.e,55,y+5);ctx.font='bold 15px system-ui';ctx.fillStyle='#fff';ctx.fillText(co.a,95,y+1);ctx.font='13px system-ui';ctx.fillStyle='#7a7e95';ctx.fillText(co.n,148,y+1);ctx.fillStyle='#fff'});
    if(diff!==null){const y=395;ctx.textAlign='center';ctx.font='bold 15px system-ui';ctx.fillStyle=diff>=0?'#00d4aa':'#ff6b6b';ctx.fillText((diff>=0?'↗️':'↘️')+' '+(diff>=0?'+':'')+diff.toLocaleString('de-DE')+' kg ('+(diff>=0?'+':'')+pct+'%)',W/2,y);ctx.font='11px system-ui';ctx.fillStyle='#5a5e75';ctx.fillText('vs. letztes Mal',W/2,y+18)}
    ctx.textAlign='center';ctx.font='11px system-ui';ctx.fillStyle='#3a3a5c';ctx.fillText(new Date(w.date).toLocaleDateString('de-DE')+(dur?' · '+Math.round(dur)+' Min':'')+' · #NeverSkipLegDay',W/2,485);ctx.strokeStyle='#252545';ctx.strokeRect(8,8,W-16,H-16);
  },[vol,comps]);
  const save=()=>{const c=ref.current;const a=document.createElement('a');a.download='workout-'+new Date().toISOString().slice(0,10)+'.png';a.href=c.toDataURL('image/png');a.click()};
  return html`<div style=${{textAlign:'center'}}><canvas ref=${ref} style=${{borderRadius:12,maxWidth:'100%'}}/><button onClick=${save} style=${{background:'var(--acc)',color:'var(--bg)',borderRadius:10,padding:12,fontSize:16,fontWeight:700,width:'100%',marginTop:10}}>📸 Bild speichern</button></div>`;
}
