// components.js – Alle UI-Komponenten (Redesign v2)

import { html, useState, useEffect, useRef } from 'https://unpkg.com/htm/preact/standalone.module.js';
import { BANDS, PLANS, COMPS, rndC } from './plans.js';

/* ── WorkoutTimer (sticky header) ── */
export function WorkoutTimer({startTime}){
  const[el,setEl]=useState(0);
  useEffect(()=>{if(!startTime)return;const up=()=>setEl(Math.floor((Date.now()-startTime)/1000));up();const iv=setInterval(up,1000);return()=>clearInterval(iv)},[startTime]);
  if(!startTime)return null;
  const m=Math.floor(el/60),s=el%60;
  return html`<span class=mono style=${{fontSize:'inherit',color:'inherit',fontWeight:'inherit',letterSpacing:'inherit'}}>${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}</span>`;
}

/* ── Timer (Pausen/Übungs/Warmup) ── */
export function Timer({sec:initS,label}){
  const[s,setS]=useState(initS);const[run,setRun]=useState(false);const[adj,setAdj]=useState(initS);const ref=useRef(null);
  const beep=()=>{try{const ac=new(window.AudioContext||window.webkitAudioContext)();const g=ac.createGain();g.connect(ac.destination);g.gain.value=0.5;
    [880,0,880,0,1320].forEach((f,i)=>{if(f===0)return;const o=ac.createOscillator();o.type='square';o.frequency.value=f;o.connect(g);o.start(ac.currentTime+i*0.15);o.stop(ac.currentTime+i*0.15+0.12)});
    setTimeout(()=>ac.close(),2000)}catch(e){}try{navigator.vibrate&&navigator.vibrate([200,100,200,100,300])}catch(e){}};
  useEffect(()=>{if(run&&s>0)ref.current=setInterval(()=>setS(v=>{if(v-1<=0){beep();return 0}return v-1}),1000);else if(s<=0&&run)setRun(false);return()=>clearInterval(ref.current)},[run,s]);
  const pct=adj>0?(s/adj)*100:0,done=s<=0&&!run,mn=Math.floor(s/60),sc=s%60;
  const ad=d=>{const v=Math.max(5,adj+d);setAdj(v);if(!run)setS(v)};
  return html`<div class=glass style=${{padding:'10px 14px',margin:'8px 0'}}>
    <div class=mono style=${{fontSize:11,color:'var(--t4)',textTransform:'uppercase',letterSpacing:1,marginBottom:6}}>${label}</div>
    <div style=${{display:'flex',alignItems:'center',gap:10}}>
      <div style=${{position:'relative',width:52,height:52}}>
        <svg width=52 height=52 style="transform:rotate(-90deg)">
          <circle cx=26 cy=26 r=22 fill="none" stroke="rgba(255,255,255,0.1)" stroke-width=3.5/>
          <circle cx=26 cy=26 r=22 fill="none" stroke=${done?'var(--acc)':s<=5&&s>0?'var(--dng)':'var(--acc)'} stroke-width=3.5 stroke-dasharray=138.2 stroke-dashoffset=${138.2*(1-pct/100)} stroke-linecap="round" style="transition:stroke-dashoffset .3s"/>
        </svg>
        <div style=${{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,fontWeight:700,fontVariantNumeric:'tabular-nums',fontFamily:'var(--mono)',color:done?'var(--acc)':'#fff'}}>${done?'✓':`${mn}:${String(sc).padStart(2,'0')}`}</div>
      </div>
      <div style=${{display:'flex',gap:4}}>
        <button onClick=${()=>ad(-5)} class=glass style=${{color:'var(--t3)',padding:'6px 10px',fontSize:12,fontFamily:'var(--mono)',fontWeight:700}}>−5</button>
        <button onClick=${()=>ad(5)} class=glass style=${{color:'var(--t3)',padding:'6px 10px',fontSize:12,fontFamily:'var(--mono)',fontWeight:700}}>+5</button>
      </div>
      <div style=${{display:'flex',gap:4,marginLeft:'auto'}}>
        ${!run?html`<button onClick=${()=>{if(s<=0)setS(adj);setRun(true)}} style=${{background:'var(--acc)',color:'var(--accD)',borderRadius:10,width:40,height:40,fontSize:16,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center'}}>▶</button>`:
        html`<button onClick=${()=>setRun(false)} style=${{background:'var(--wrn)',color:'var(--bg)',borderRadius:10,width:40,height:40,fontSize:16,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center'}}>⏸</button>`}
      </div>
    </div>
  </div>`;
}

/* ── SR: Bilateral Set Row ── */
export function SR({num,d,onChange,isI,onTW,noKg}){
  return html`<div style=${{display:'flex',gap:8,alignItems:'center',padding:'6px 0',opacity:d.isW?.55:1}}>
    <button onClick=${onTW} class=mono style=${{width:28,height:44,borderRadius:'var(--rxs)',fontSize:12,fontWeight:700,background:d.isW?'var(--wrnA)':'transparent',color:d.isW?'var(--wrn)':'var(--t5)',border:'none'}}>${d.isW?'W':num}</button>
    <div style=${{flex:1,display:'flex',gap:8}}>
      ${isI?html`<input type=number inputMode=numeric placeholder=sek value=${d.secs||""} onInput=${e=>onChange({...d,secs:e.target.value})}/>`:
      html`<input type=number inputMode=numeric placeholder=reps value=${d.reps||""} onInput=${e=>onChange({...d,reps:e.target.value})}/>`}
      ${!noKg?html`<input type=number inputMode=decimal placeholder=kg value=${d.kg||""} onInput=${e=>onChange({...d,kg:e.target.value})}/>`:null}
    </div>
    <div style=${{width:44,height:44,background:'var(--bg2)',borderRadius:'var(--rs)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--t5)',border:'var(--glassBrd)'}}>
      <svg width=20 height=20 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width=2><path d="M20 6 9 17 4 12"/></svg>
    </div>
  </div>`;
}

/* ── UR: Unilateral Set Row ── */
export function UR({num,d,onChange,isI,onTW}){
  return html`<div style=${{padding:'6px 0',opacity:d.isW?.55:1}}>
    <div style=${{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
      <button onClick=${onTW} class=mono style=${{width:28,height:44,borderRadius:'var(--rxs)',fontSize:12,fontWeight:700,background:d.isW?'var(--wrnA)':'transparent',color:d.isW?'var(--wrn)':'var(--t5)',border:'none'}}>${d.isW?'W':num}</button>
      <span class=mono style=${{fontSize:12,fontWeight:700,color:'var(--acc)',width:16}}>R</span>
      <div style=${{flex:1,display:'flex',gap:8}}>
        ${isI?html`<input type=number placeholder=sek value=${d.sR||""} onInput=${e=>onChange({...d,sR:e.target.value})}/>`:
        html`<input type=number placeholder=reps value=${d.rR||""} onInput=${e=>onChange({...d,rR:e.target.value})}/>`}
        <input type=number placeholder=kg value=${d.kR||""} onInput=${e=>onChange({...d,kR:e.target.value})}/>
      </div>
    </div>
    <div style=${{display:'flex',alignItems:'center',gap:8,marginLeft:36}}>
      <span class=mono style=${{fontSize:12,fontWeight:700,color:'var(--wrn)',width:16}}>L</span>
      <div style=${{flex:1,display:'flex',gap:8}}>
        ${isI?html`<input type=number placeholder=sek value=${d.sL||""} onInput=${e=>onChange({...d,sL:e.target.value})}/>`:
        html`<input type=number placeholder=reps value=${d.rL||""} onInput=${e=>onChange({...d,rL:e.target.value})}/>`}
        <input type=number placeholder=kg value=${d.kL||""} onInput=${e=>onChange({...d,kL:e.target.value})}/>
      </div>
    </div>
  </div>`;
}

/* ── Assisted Pull-Up: Machine ── */
export function AstMach({d,onChange}){
  const bw=parseFloat(d.bw)||0,as=parseFloat(d.as)||0,mv=Math.max(0,bw-as);
  return html`<div class=glass style=${{padding:'12px 14px',margin:'8px 0'}}>
    <div class=mono style=${{fontSize:11,color:'var(--t4)',textTransform:'uppercase',letterSpacing:1,marginBottom:6}}>Assisted Pull-Up (Maschine)</div>
    <div style=${{display:'flex',gap:8,alignItems:'center'}}>
      <div style=${{flex:1}}><div class=mono style=${{fontSize:10,color:'var(--t5)',marginBottom:3}}>Körpergewicht</div><input type=number placeholder=kg value=${d.bw||""} onInput=${e=>onChange({...d,bw:e.target.value})}/></div>
      <div style=${{color:'var(--t5)',fontSize:18}}>−</div>
      <div style=${{flex:1}}><div class=mono style=${{fontSize:10,color:'var(--t5)',marginBottom:3}}>Unterstützung</div><input type=number placeholder=kg value=${d.as||""} onInput=${e=>onChange({...d,as:e.target.value})}/></div>
      <div style=${{color:'var(--t5)',fontSize:18}}>=</div>
      <div style=${{flex:1,textAlign:'center'}}><div class=mono style=${{fontSize:10,color:'var(--t5)',marginBottom:3}}>Bewegt</div><div class=mono style=${{fontSize:20,fontWeight:800,color:'var(--acc)'}}>${mv.toFixed(1)}</div></div>
    </div>
  </div>`;
}

/* ── Assisted Pull-Up: Band ── */
export function AstBand({d,onChange}){
  const band=BANDS.find(b=>b.id===d.bandId)||BANDS[0];
  const bw=parseFloat(d.bw)||0,mv=Math.max(0,bw-band.kg);
  return html`<div class=glass style=${{padding:'12px 14px',margin:'8px 0'}}>
    <div class=mono style=${{fontSize:11,color:'var(--t4)',textTransform:'uppercase',letterSpacing:1,marginBottom:6}}>Assisted Pull-Up (Band)</div>
    <select value=${d.bandId||"none"} onChange=${e=>{const b=BANDS.find(x=>x.id===e.target.value);onChange({...d,bandId:e.target.value,bandKg:b?.kg||0})}}>
      ${BANDS.map(b=>html`<option key=${b.id} value=${b.id}>${b.label}</option>`)}
    </select>
    <div style=${{display:'flex',gap:8,alignItems:'center',marginTop:8}}>
      <div style=${{flex:1}}><div class=mono style=${{fontSize:10,color:'var(--t5)',marginBottom:3}}>Körpergewicht</div><input type=number placeholder=kg value=${d.bw||""} onInput=${e=>onChange({...d,bw:e.target.value})}/></div>
      <div style=${{color:'var(--t5)',fontSize:18}}>−</div>
      <div style=${{flex:1,textAlign:'center'}}><div class=mono style=${{fontSize:10,color:'var(--t5)',marginBottom:3}}>Band (~)</div><div class=mono style=${{fontSize:16,fontWeight:700,color:'var(--wrn)'}}>${band.kg} kg</div></div>
      <div style=${{color:'var(--t5)',fontSize:18}}>=</div>
      <div style=${{flex:1,textAlign:'center'}}><div class=mono style=${{fontSize:10,color:'var(--t5)',marginBottom:3}}>Bewegt</div><div class=mono style=${{fontSize:20,fontWeight:800,color:'var(--acc)'}}>${mv.toFixed(1)}</div></div>
    </div>
  </div>`;
}

/* ── demoUrl: resolve demo field to full URL ── */
function demoUrl(d){if(!d)return null;if(d.startsWith('vimeo:'))return'https://vimeo.com/'+d.slice(6);if(d.startsWith('yt:'))return'https://youtu.be/'+d.slice(3);return d}

/* ── EC: Exercise Card ── */
export function EC({ex,sets,onSet,onAdd,onRm,last,lastN,ast,onAst,note,onNote}){
  const[col,setCol]=useState(false);const[skip,setSkip]=useState(false);const[shN,setShN]=useState(false);
  const mv=ex.ast&&ast?Math.max(0,(parseFloat(ast.bw)||0)-(parseFloat(ast.as)||0)):
    ex.band&&ast?Math.max(0,(parseFloat(ast.bw)||0)-(parseFloat(ast.bandKg)||0)):null;

  if(skip)return html`<div class=glass style=${{opacity:.35,padding:'14px 16px',margin:'12px 0'}}>
    <div style=${{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
      <span style=${{color:'var(--t3)',fontSize:14,textDecoration:'line-through'}}>${ex.n}</span>
      <button onClick=${()=>setSkip(false)} style=${{borderRadius:'var(--rxs)',padding:'6px 14px',fontSize:12,fontWeight:600,background:'var(--accA)',color:'var(--acc)'}}>Zurück</button>
    </div></div>`;

  return html`<div class=glass style=${{padding:'16px 18px',margin:'12px 0'}}>
    <div style=${{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:4}}>
      <div style=${{flex:1,cursor:'pointer'}} onClick=${()=>setCol(!col)}>
        <div style=${{display:'flex',alignItems:'center',gap:6}}>
          <span style=${{fontSize:18,fontWeight:700}}>${ex.n}</span>
          <span style=${{fontSize:12,color:'var(--t5)'}}>${col?'▸':'⋯'}</span>
        </div>
        <div style=${{fontSize:13,color:'var(--acc)',fontWeight:600,marginTop:2}}>${ex.m}</div>
        <div class=mono style=${{fontSize:11,color:'var(--t3)',marginTop:2}}>${ex.s}×${ex.rp}${ex.tp&&ex.tp!=='—'&&ex.tp!=='iso'?' · '+ex.tp:''}${ex.g?' · '+ex.g:''}</div>
      </div>
      <div style=${{display:'flex',gap:6,flexShrink:0,alignItems:'center'}}>
        ${ex.demo?html`<a href=${demoUrl(ex.demo)} target="_blank" rel="noopener" class=mono style=${{padding:'4px 10px',fontSize:10,fontWeight:700,letterSpacing:1,color:'var(--blu)',background:'var(--bluA)',borderRadius:'var(--rxs)',textTransform:'uppercase',textDecoration:'none'}}>Demo</a>`:null}
        <button onClick=${()=>setShN(!shN)} style=${{background:'none',color:note?'var(--wrn)':'var(--t5)',fontSize:15,padding:4}}>📝</button>
        <button onClick=${()=>setSkip(true)} class=mono style=${{padding:'4px 10px',fontSize:10,fontWeight:700,letterSpacing:1,color:'var(--t5)',background:'none',textTransform:'uppercase'}}>Skip</button>
      </div>
    </div>

    ${!col&&html`
      ${ex.w?html`<div style=${{fontSize:11,color:'var(--wrn)',marginBottom:4}}>${ex.w}</div>`:null}
      ${ex.h?html`<div style=${{fontSize:11,color:'var(--prp)',marginBottom:4}}>💡 ${ex.h}</div>`:null}

      ${last&&last.length>0?html`<div class=glass style=${{padding:'10px 12px',margin:'8px 0'}}>
        <div class=mono style=${{fontSize:10,color:'var(--t4)',textTransform:'uppercase',letterSpacing:1,marginBottom:4}}>⏱ Last Time</div>
        <div class=mono style=${{fontSize:12,color:'var(--t2)'}}>
          ${last.map(s=>s.rR!==undefined?'R:'+(s.rR||s.sR||0)+'×'+(s.kR||0)+' L:'+(s.rL||s.sL||0)+'×'+(s.kL||0):(s.reps||s.secs||0)+(ex.noKg?'':'×'+(s.kg||0)+'kg')).join(' | ')}
        </div>
        ${lastN?html`<div style=${{borderTop:'1px solid rgba(255,255,255,0.05)',marginTop:6,paddingTop:6,fontSize:12,color:'var(--wrn)',fontStyle:'italic'}}>📝 ${lastN}</div>`:null}
      </div>`:null}

      ${shN?html`<input type=text placeholder="Add note for this exercise..." value=${note||""} onInput=${e=>onNote(e.target.value)} style=${{fontSize:13,margin:'6px 0',textAlign:'left',padding:'10px 14px'}}/>`:null}

      ${ex.ast?html`<${AstMach} d=${ast||{}} onChange=${onAst}/>`:null}
      ${ex.band?html`<${AstBand} d=${ast||{}} onChange=${onAst}/>`:null}

      <div style=${{margin:'8px 0'}}>
        <div style=${{display:'flex',gap:8,padding:'0 36px 0 36px',marginBottom:4}}>
          <span class=mono style=${{flex:1,textAlign:'center',fontSize:10,color:'var(--t5)',textTransform:'uppercase',letterSpacing:1}}>${isI(ex)?'SECS':'REPS'}</span>
          ${!ex.noKg?html`<span class=mono style=${{flex:1,textAlign:'center',fontSize:10,color:'var(--t5)',textTransform:'uppercase',letterSpacing:1}}>WEIGHT</span>`:null}
          <div style=${{width:44}}></div>
        </div>
        ${sets.map((s,i)=>ex.u?
          html`<${UR} key=${i} num=${i+1} d=${s} onChange=${d=>onSet(i,d)} isI=${ex.iso} onTW=${()=>onSet(i,{...s,isW:!s.isW})}/>`:
          html`<${SR} key=${i} num=${i+1} d=${s} onChange=${d=>{const nd={...d};if(mv!==null)nd.kg=String(mv.toFixed(1));onSet(i,nd)}} isI=${ex.iso} noKg=${ex.noKg} onTW=${()=>onSet(i,{...s,isW:!s.isW})}/>`)}
      </div>

      <div style=${{display:'flex',gap:8,marginTop:6}}>
        <button onClick=${onAdd} class="mono glass" style=${{flex:1,padding:'10px',fontSize:10,fontWeight:700,letterSpacing:1,color:'var(--t3)',textTransform:'uppercase'}}>+ Set</button>
        ${sets.length>1?html`<button onClick=${onRm} class="mono glass" style=${{flex:1,padding:'10px',fontSize:10,fontWeight:700,letterSpacing:1,color:'var(--t3)',textTransform:'uppercase'}}>− Set</button>`:null}
      </div>
      ${ex.iso?html`<${Timer} sec=${ex.iS||30} label="Übungstimer"/>`:null}
      ${ex.rs>0?html`<${Timer} sec=${ex.rs} label="Pausentimer"/>`:null}
    `}
  </div>`;
}

function isI(ex){return ex.iso}

/* ── WU: Warm-up Checklist ── */
export function WU({items, ck, onCk}){
  const[nts,setNts]=useState({});const[nf,setNf]=useState(null);
  return html`<div class=glass style=${{padding:'16px',margin:'8px 0'}}>
    <div class=label style=${{marginBottom:12,display:'flex',alignItems:'center',gap:8}}>
      <span style=${{color:'var(--wrn)'}}>🔥</span> Warm-up
    </div>
    ${items.map(w=>html`<div key=${w.id} style=${{padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
      <div style=${{display:'flex',alignItems:'center',gap:10}}>
        <div onClick=${()=>onCk(c=>({...c,[w.id]:!c[w.id]}))} style=${{
          width:22,height:22,borderRadius:5,
          border:ck[w.id]?'2px solid var(--acc)':'2px solid var(--t5)',
          background:ck[w.id]?'var(--accA)':'transparent',
          display:'flex',alignItems:'center',justifyContent:'center',
          cursor:'pointer',fontSize:13,color:'var(--acc)',flexShrink:0,
          transition:'all .2s'
        }}>${ck[w.id]?'✓':''}</div>
        <div style=${{flex:1}}>
          <span style=${{fontSize:14,color:ck[w.id]?'var(--t5)':'var(--t2)',textDecoration:ck[w.id]?'line-through':'none',transition:'all .2s'}}>${w.n}</span>
          ${w.sets?html`<div class=mono style=${{fontSize:11,color:'var(--acc)',marginTop:2}}>${w.sets}</div>`:
          html`<span class=mono style=${{fontSize:11,color:'var(--t4)',marginLeft:6}}>${w.r}</span>`}
        </div>
        ${w.demo?html`<a href=${demoUrl(w.demo)} target="_blank" rel="noopener" class=mono style=${{padding:'3px 8px',fontSize:9,fontWeight:700,letterSpacing:1,color:'var(--blu)',background:'var(--bluA)',borderRadius:'var(--rxs)',textTransform:'uppercase',textDecoration:'none',flexShrink:0}}>Demo</a>`:null}
        <button onClick=${()=>setNf(nf===w.id?null:w.id)} style=${{background:'none',color:nts[w.id]?'var(--wrn)':'var(--t5)',fontSize:14,padding:4}}>📝</button>
      </div>
      ${w.nt?html`<div style=${{fontSize:11,color:'var(--wrn)',marginLeft:32,marginTop:2}}>${w.nt}</div>`:null}
      ${w.timer?html`<div style=${{marginLeft:32}}><${Timer} sec=${w.timer} label=${w.n}/></div>`:null}
      ${nf===w.id?html`<input type=text placeholder="Notiz..." value=${nts[w.id]||""} onInput=${e=>setNts(n=>({...n,[w.id]:e.target.value}))} style=${{fontSize:12,marginLeft:32,marginTop:4,width:'calc(100% - 32px)',textAlign:'left',padding:'8px 12px'}}/>`:null}
    </div>`)}
  </div>`;
}

/* ── WUT: Warm-up Timer Cards ── */
export function WUT({items}){
  if(!items||!items.length)return null;
  return html`<div class=glass style=${{padding:'16px',margin:'8px 0'}}>
    <div class=label style=${{marginBottom:12,display:'flex',alignItems:'center',gap:8}}>
      <span style=${{color:'var(--wrn)'}}>⏱</span> Aktivierung
    </div>
    ${items.map(w=>html`<div key=${w.id} style=${{marginBottom:10}}>
      <div style=${{fontSize:14,fontWeight:600,color:'var(--t2)'}}>${w.n}</div>
      ${w.nt?html`<div style=${{fontSize:11,color:'var(--wrn)',marginTop:2}}>${w.nt}</div>`:null}
      <${Timer} sec=${w.sec} label=${w.n}/>
    </div>`)}
  </div>`;
}

/* ── FC: Fun Card (Canvas) ── */
export function FC({w,vol,prev,dur,cmt}){
  const ref=useRef(null);const[comps]=useState(()=>rndC(vol));const p=PLANS[w.day];
  const diff=prev?vol-prev:null,pct=prev?((diff/prev)*100).toFixed(0):null;
  const hasCmt=cmt&&cmt.trim().length>0;
  const itemCount=comps.items.length;
  useEffect(()=>{
    const c=ref.current;if(!c)return;const ctx=c.getContext('2d');
    const W=400;
    // Dynamic height: base + items + equals + progression + comment + footer
    const itemsH=itemCount*35;
    const equalsH=30;
    const progH=diff!==null?45:0;
    const cmtH=hasCmt?40:0;
    const H=175+itemsH+equalsH+progH+cmtH+45;
    c.width=W*2;c.height=H*2;c.style.width=W+'px';c.style.height=H+'px';ctx.scale(2,2);
    // Background
    ctx.fillStyle='#0A0A0B';ctx.fillRect(0,0,W,H);
    // Subtle glows
    ctx.globalAlpha=.06;ctx.fillStyle='#10B981';ctx.beginPath();ctx.arc(340,70,110,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#3B82F6';ctx.beginPath();ctx.arc(60,H-60,70,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
    // Title
    ctx.fillStyle='#fff';ctx.font='bold 20px Inter,system-ui';ctx.textAlign='center';ctx.fillText(p.icon+' KATJAS WORKOUT',W/2,38);
    ctx.font='15px Inter,system-ui';ctx.fillStyle='#10B981';ctx.fillText(p.name+': '+p.label,W/2,60);
    // Divider
    ctx.strokeStyle='rgba(255,255,255,0.1)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(30,75);ctx.lineTo(W-30,75);ctx.stroke();
    // Volume
    ctx.font='bold 40px Inter,system-ui';ctx.fillStyle='#fff';ctx.fillText(vol.toLocaleString('de-DE')+' kg',W/2,120);
    ctx.font='13px Inter,system-ui';ctx.fillStyle='#94A3B8';ctx.fillText('Gesamtvolumen bewegt',W/2,142);
    // Comparisons header
    ctx.fillStyle='#64748B';ctx.fillText('Das entspricht ungefähr...',W/2,174);
    // Comparison items with + signs
    let curY=200;
    comps.items.forEach((co,i)=>{
      ctx.textAlign='left';
      // + sign (not on first item)
      if(i>0){ctx.font='bold 16px Inter,system-ui';ctx.fillStyle='var(--t5)';ctx.fillStyle='#64748B';ctx.fillText('+',35,curY+1)}
      ctx.font='22px system-ui';ctx.fillText(co.e,55,curY+5);
      ctx.font='bold 15px Inter,system-ui';ctx.fillStyle='#fff';
      const aStr=typeof co.a==='number'?co.a.toLocaleString('de-DE'):parseFloat(co.a).toLocaleString('de-DE');
      ctx.fillText(aStr,95,curY+1);
      const aW=ctx.measureText(aStr).width;
      ctx.font='13px Inter,system-ui';ctx.fillStyle='#94A3B8';ctx.fillText(co.n,95+aW+8,curY+1);
      ctx.fillStyle='#fff';
      curY+=35;
    });
    // Equals line
    curY+=5;
    ctx.strokeStyle='rgba(255,255,255,0.1)';ctx.beginPath();ctx.moveTo(55,curY);ctx.lineTo(W-55,curY);ctx.stroke();
    curY+=20;
    ctx.textAlign='center';ctx.font='bold 16px Inter,system-ui';ctx.fillStyle='#10B981';
    ctx.fillText('= '+vol.toLocaleString('de-DE')+' kg',W/2,curY);
    curY+=25;
    // Progression
    if(diff!==null){ctx.font='bold 15px Inter,system-ui';ctx.fillStyle=diff>=0?'#10B981':'#EF4444';ctx.fillText((diff>=0?'↗️':'↘️')+' '+(diff>=0?'+':'')+diff.toLocaleString('de-DE')+' kg ('+(diff>=0?'+':'')+pct+'%)',W/2,curY);ctx.font='11px Inter,system-ui';ctx.fillStyle='#64748B';ctx.fillText('vs. letztes Mal',W/2,curY+18);curY+=45}
    // Comment
    if(hasCmt){ctx.font='italic 13px Inter,system-ui';ctx.fillStyle='#94A3B8';ctx.textAlign='center';
      const words=cmt.trim().split(' ');let line='';let lines=[];
      for(const word of words){const test=line?line+' '+word:word;if(ctx.measureText(test).width>340&&line){lines.push(line);line=word}else line=test}
      if(line)lines.push(line);
      lines.slice(0,2).forEach((l,i)=>ctx.fillText(l,W/2,curY+i*18));
      curY+=lines.length*18+10;
    }
    // Footer
    ctx.textAlign='center';ctx.font='11px Inter,system-ui';ctx.fillStyle='#475569';ctx.fillText(new Date(w.date).toLocaleDateString('de-DE')+(dur?' · '+Math.round(dur)+' Min':'')+' · #NeverSkipLegDay',W/2,H-20);
    // Border
    ctx.strokeStyle='rgba(255,255,255,0.1)';ctx.strokeRect(8,8,W-16,H-16);
  },[vol,comps,cmt]);
  const save=()=>{const c=ref.current;const a=document.createElement('a');a.download='workout-'+new Date().toISOString().slice(0,10)+'.png';a.href=c.toDataURL('image/png');a.click()};
  return html`<div style=${{textAlign:'center'}}>
    <canvas ref=${ref} style=${{borderRadius:12,maxWidth:'100%'}}/>
    <button onClick=${save} style=${{background:'var(--acc)',color:'var(--accD)',borderRadius:'var(--r)',padding:'14px',fontSize:16,fontWeight:700,width:'100%',marginTop:12}}>📸 Bild speichern</button>
  </div>`;
}

/* ── BottomNav ── */
export function BottomNav({active,onNav}){
  const items=[
    {id:'home',icon:html`<svg width=24 height=24 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width=2><path d="M6.5 6.5h3v11h-3z"/><path d="M14.5 6.5h3v11h-3z"/><path d="M9.5 11h5"/><path d="M9.5 13h5"/><path d="M4 8.5h2.5v7H4z"/><path d="M17.5 8.5H20v7h-2.5z"/></svg>`},
    {id:'analytics',icon:html`<svg width=24 height=24 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width=2><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`},
    {id:'history',icon:html`<svg width=24 height=24 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width=2><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/></svg>`},
    {id:'calendar',icon:html`<svg width=24 height=24 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width=2><rect x=3 y=4 width=18 height=18 rx=2 ry=2/><line x1=16 y1=2 x2=16 y2=6/><line x1=8 y1=2 x2=8 y2=6/><line x1=3 y1=10 x2=21 y2=10/></svg>`},
    {id:'settings',icon:html`<svg width=24 height=24 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width=2><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`},
  ];
  return html`<nav style=${{
    position:'fixed',bottom:0,left:'50%',transform:'translateX(-50%)',
    width:'100%',maxWidth:480,
    background:'rgba(10,10,11,0.9)',borderTop:'1px solid rgba(255,255,255,0.1)',
    backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',
    padding:'16px 0 max(20px, env(safe-area-inset-bottom, 20px))',
    display:'flex',justifyContent:'space-around',
    borderRadius:'24px 24px 0 0',zIndex:100
  }}>
    ${items.map(it=>html`<button key=${it.id} onClick=${()=>onNav(it.id)} style=${{
      background:'none',color:active===it.id?'var(--acc)':'var(--t5)',
      padding:8,borderRadius:12,transition:'color .2s',
      display:'flex',alignItems:'center',justifyContent:'center'
    }}>${it.icon}</button>`)}
  </nav>`;
}

/* ── VolumeChart: SVG area chart ── */
export function VolumeChart({data}){
  if(!data||data.length<2)return html`<div class=mono style=${{fontSize:12,color:'var(--t4)',padding:'20px 0',textAlign:'center'}}>Noch nicht genug Daten für Chart</div>`;
  const maxV=Math.max(...data.map(d=>d.vol));const minV=Math.min(...data.map(d=>d.vol));
  const range=maxV-minV||1;const W=400,H=160,pad=10;
  const pts=data.map((d,i)=>{const x=pad+i*((W-2*pad)/(data.length-1));const y=H-pad-(d.vol-minV)/range*(H-2*pad);return{x,y}});
  const line=pts.map((p,i)=>`${i===0?'M':'L'}${p.x},${p.y}`).join(' ');
  const area=line+` L${pts[pts.length-1].x},${H} L${pts[0].x},${H} Z`;
  const first=data[0].vol,last=data[data.length-1].vol;
  const pctChange=first>0?((last-first)/first*100).toFixed(1):0;
  return html`<div class=glass style=${{padding:'20px'}}>
    <div style=${{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:16}}>
      <div>
        <div class=label style=${{marginBottom:4}}>Volume Progression</div>
        <div style=${{fontSize:18,fontWeight:700}}>Total Load (kg)</div>
      </div>
      <div class=mono style=${{background:pctChange>=0?'var(--accA)':'var(--dngA)',color:pctChange>=0?'var(--acc)':'var(--dng)',padding:'4px 10px',borderRadius:20,fontSize:10,fontWeight:700}}>${pctChange>=0?'+':''}${pctChange}%</div>
    </div>
    <div style=${{position:'relative',height:H+'px'}}>
      <svg width="100%" height="100%" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
        <defs><linearGradient id="vg" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#10B981" stop-opacity="0.3"/><stop offset="100%" stop-color="#10B981" stop-opacity="0"/></linearGradient></defs>
        <path d="${area}" fill="url(#vg)"/>
        <path d="${line}" fill="none" stroke="#10B981" stroke-width="2.5"/>
      </svg>
    </div>
    <div style=${{display:'flex',justifyContent:'space-between',marginTop:8}} class=mono>
      ${data.filter((_,i)=>i===0||i===Math.floor(data.length/2)||i===data.length-1).map(d=>html`<span style=${{fontSize:10,color:'var(--t5)'}}>${new Date(d.date).toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit'})}</span>`)}
    </div>
  </div>`;
}

/* ── DonutChart: Muscle Focus ── */
export function DonutChart({data}){
  if(!data||!data.length)return null;
  const colors=['#10B981','#3B82F6','#F59E0B','#EF4444','#c792ea','#06B6D4'];
  const total=data.reduce((s,d)=>s+d.value,0)||1;
  let offset=0;
  return html`<div class=glass style=${{padding:'20px'}}>
    <div class=label style=${{marginBottom:16}}>Muscle Focus</div>
    <div style=${{display:'flex',alignItems:'center',gap:24}}>
      <div style=${{width:100,height:100,position:'relative'}}>
        <svg width=100 height=100 viewBox="0 0 36 36">
          ${data.map((d,i)=>{const pct=d.value/total*100;const dash=pct;const o=offset;offset+=pct;
            return html`<path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke=${colors[i%colors.length]} stroke-width=4 stroke-dasharray="${dash}, 100" stroke-dashoffset=${-o}/>`})}
        </svg>
      </div>
      <div style=${{flex:1,display:'flex',flexDirection:'column',gap:8}}>
        ${data.map((d,i)=>html`<div key=${i} style=${{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style=${{display:'flex',alignItems:'center',gap:8}}>
            <div style=${{width:8,height:8,borderRadius:'50%',background:colors[i%colors.length]}}></div>
            <span style=${{fontSize:12}}>${d.name}</span>
          </div>
          <span class=mono style=${{fontSize:10,color:'var(--t4)'}}>${(d.value/total*100).toFixed(0)}%</span>
        </div>`)}
      </div>
    </div>
  </div>`;
}

/* ── Calendar ── */
const CAL_COLORS={1:'#F59E0B',2:'#3B82F6',3:'#10B981'};
const CAL_BG={1:'rgba(245,158,11,0.15)',2:'rgba(59,130,246,0.15)',3:'rgba(16,185,129,0.15)'};
export function Calendar({workouts}){
  const[mo,setMo]=useState(()=>{const n=new Date();return{y:n.getFullYear(),m:n.getMonth()}});
  const prev=()=>setMo(c=>c.m===0?{y:c.y-1,m:11}:{y:c.y,m:c.m-1});
  const next=()=>{const n=new Date();if(mo.y>n.getFullYear()||(mo.y===n.getFullYear()&&mo.m>=n.getMonth()))return;setMo(c=>c.m===11?{y:c.y+1,m:0}:{y:c.y,m:c.m+1})};
  const isNow=mo.y===new Date().getFullYear()&&mo.m===new Date().getMonth();

  const wMap={};(workouts||[]).forEach(w=>{
    const d=new Date(w.date);if(d.getFullYear()===mo.y&&d.getMonth()===mo.m){
      const key=d.getDate();wMap[key]={day:w.day,vol:w.vol};
    }
  });

  const firstDay=new Date(mo.y,mo.m,1).getDay();
  const startOff=firstDay===0?6:firstDay-1;
  const daysInMonth=new Date(mo.y,mo.m+1,0).getDate();
  const today=new Date();const todayDate=today.getDate();
  const moNames=['Jänner','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];

  const cells=[];
  for(let i=0;i<startOff;i++)cells.push(null);
  for(let d=1;d<=daysInMonth;d++)cells.push(d);

  // Monthly stats
  const moWorkouts=Object.values(wMap);
  const totalVol=moWorkouts.reduce((t,w)=>t+w.vol,0);

  return html`<div>
    <div style=${{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
      <button onClick=${prev} style=${{background:'none',color:'var(--t3)',padding:8,fontSize:22,fontWeight:500,lineHeight:1}}>‹</button>
      <span style=${{fontSize:17,fontWeight:700}}>${moNames[mo.m]} ${mo.y}</span>
      <button onClick=${next} style=${{background:'none',color:isNow?'var(--t5)':'var(--t3)',padding:8,fontSize:22,fontWeight:500,lineHeight:1,opacity:isNow?.3:1}}>›</button>
    </div>

    <div style=${{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:3,textAlign:'center'}}>
      ${['Mo','Di','Mi','Do','Fr','Sa','So'].map(d=>html`<div key=${d} class=mono style=${{fontSize:11,color:'var(--t5)',padding:'4px 0',fontWeight:500}}>${d}</div>`)}

      ${cells.map((d,i)=>{
        if(d===null)return html`<div key=${'e'+i} style=${{minHeight:52}}></div>`;
        const w=wMap[d];
        const isToday=isNow&&d===todayDate;
        return html`<div key=${d} style=${{
          minHeight:52,padding:'5px 2px',borderRadius:'var(--rxs)',
          background:w?CAL_BG[w.day]||'var(--bg2)':'transparent',
          border:isToday?'1.5px solid var(--t4)':'1.5px solid transparent',
          display:'flex',flexDirection:'column',alignItems:'center',gap:1
        }}>
          <div style=${{fontSize:13,fontWeight:w||isToday?500:400,color:w?'var(--t1)':'var(--t4)'}}>${d}</div>
          ${w?html`<div class=mono style=${{fontSize:9,fontWeight:500,color:CAL_COLORS[w.day]||'var(--acc)',marginTop:1}}>Tag ${w.day}</div>
            <div class=mono style=${{fontSize:8,color:'var(--t4)',marginTop:1}}>${w.vol?.toLocaleString('de-DE')} kg</div>`:null}
        </div>`;
      })}
    </div>

    <div style=${{display:'flex',justifyContent:'center',gap:16,marginTop:14,paddingTop:12,borderTop:'1px solid rgba(255,255,255,0.05)'}}>
      ${[1,2,3].map(d=>html`<div key=${d} style=${{display:'flex',alignItems:'center',gap:6}}>
        <div style=${{width:10,height:10,borderRadius:3,background:CAL_BG[d]}}></div>
        <span class=mono style=${{fontSize:11,color:'var(--t5)'}}>Tag ${d}</span>
      </div>`)}
    </div>

    ${moWorkouts.length>0?html`<div style=${{display:'flex',justifyContent:'space-around',marginTop:14,paddingTop:12,borderTop:'1px solid rgba(255,255,255,0.05)'}}>
      <div style=${{textAlign:'center'}}>
        <div class=mono style=${{fontSize:10,color:'var(--t5)',textTransform:'uppercase',letterSpacing:1}}>Workouts</div>
        <div class=mono style=${{fontSize:18,fontWeight:700,color:'var(--acc)',marginTop:2}}>${moWorkouts.length}</div>
      </div>
      <div style=${{textAlign:'center'}}>
        <div class=mono style=${{fontSize:10,color:'var(--t5)',textTransform:'uppercase',letterSpacing:1}}>Gesamt</div>
        <div class=mono style=${{fontSize:18,fontWeight:700,color:'var(--acc)',marginTop:2}}>${totalVol.toLocaleString('de-DE')} kg</div>
      </div>
    </div>`:null}
  </div>`;
}
