// app.js – Hauptkomponente, Auth, Screens, State

import { html, render, useState, useEffect, useRef } from 'https://unpkg.com/htm/preact/standalone.module.js';
import { PLANS } from './plans.js';
import { eS, eU, iSets, calcVol } from './helpers.js';
import { sb, dbLoad, dbSave, dbSvAct, dbLdAct, dbDlAct } from './db.js';
import { Timer, EC, WU, WUT, FC } from './components.js';

function App(){
  const[user,setUser]=useState(null);const[aLd,setALd]=useState(true);
  const[scr,setScr]=useState('home');const[day,setDay]=useState(null);
  const[wd,setWd]=useState({});const[nts,setNts]=useState({});const[ast,setAst]=useState({});
  const[optE,setOptE]=useState({});const[stT,setStT]=useState(null);const[wuCk,setWuCk]=useState({});
  const[all,setAll]=useState([]);const[ld,setLd]=useState(true);
  const[curW,setCurW]=useState(null);const[hasA,setHasA]=useState(false);const[actR,setActR]=useState(null);
  const[aErr,setAErr]=useState('');const[em,setEm]=useState('');const[pw,setPw]=useState('');const[isR,setIsR]=useState(false);
  const svT=useRef(null);const[saving,setSaving]=useState(false);

  useEffect(()=>{sb.auth.getSession().then(({data})=>{if(data.session?.user)setUser(data.session.user);setALd(false)});
    const{data:l}=sb.auth.onAuthStateChange((_,s)=>setUser(s?.user||null));return()=>l.subscription.unsubscribe()},[]);
  useEffect(()=>{if(!user)return;
    // Erst aktives Workout laden (schnell, 1 Row) → sofort anzeigen
    dbLdAct(user.id).then(a=>{if(a){setHasA(true);setActR(a)}});
    // History im Hintergrund laden
    dbLoad(user.id).then(w=>{setAll(w||[]);setLd(false)});
  },[user]);
  useEffect(()=>{if(scr!=='workout'||!day||!user)return;clearTimeout(svT.current);svT.current=setTimeout(()=>dbSvAct(user.id,day,wd,nts,ast,optE,stT,wuCk),500);return()=>clearTimeout(svT.current)},[wd,nts,ast,optE,wuCk]);

  const doAuth=async()=>{setAErr('');const{error}=isR?await sb.auth.signUp({email:em,password:pw}):await sb.auth.signInWithPassword({email:em,password:pw});if(error)setAErr(error.message)};
  const start=d=>{const p=PLANS[d];const dd={};p.ex.forEach(e=>{dd[e.id]=iSets(e)});setWd(dd);setNts({});setAst({});setOptE({});setWuCk({});setDay(d);setStT(Date.now());setScr('workout');setHasA(false)};
  const resume=()=>{if(!actR)return;const d=actR.data;setDay(actR.day);setWd(d.d||{});setNts(d.n||{});setAst(d.a||{});setOptE(d.o||{});setWuCk(d.wuCk||{});setStT(d.st||Date.now());setScr('workout');setHasA(false)};
  const discard=async()=>{if(user)await dbDlAct(user.id);setHasA(false);setActR(null)};
  const gL=d=>[...all].reverse().find(w=>w.day===d);
  const gLE=(d,id)=>gL(d)?.exs?.[id]||null;
  const gLN=(d,id)=>gL(d)?.nts?.[id]||null;
  const finish=async()=>{setSaving(true);const dur=stT?(Date.now()-stT)/60000:0;const vol=calcVol(wd);
    await dbSave(user.id,day,wd,nts,ast,vol,Math.round(dur));if(user)await dbDlAct(user.id);
    const w={id:Date.now().toString(),day,date:new Date().toISOString(),exs:wd,nts,vol,dur:Math.round(dur)};
    setAll(p=>[...p,w]);setCurW(w);setSaving(false);setScr('summary')};

  if(aLd)return html`<div style=${{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100dvh',color:'var(--acc)',fontSize:18}}>Laden...</div>`;

  if(!user)return html`<div style=${{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'100dvh',padding:20}}>
    <div style=${{background:'var(--bg2)',border:'1px solid var(--brd)',borderRadius:16,padding:24,width:'100%',maxWidth:340}}>
      <div style=${{textAlign:'center',marginBottom:20}}><div style=${{fontSize:34}}>🏋️</div><div style=${{fontSize:22,fontWeight:800,marginTop:8}}>Katjas Tracker</div><div style=${{fontSize:14,color:'var(--t3)',marginTop:4}}>${isR?'Account erstellen':'Einloggen'}</div></div>
      ${aErr?html`<div style=${{color:'var(--dng)',fontSize:13,marginBottom:8,textAlign:'center'}}>${aErr}</div>`:null}
      <div style=${{marginBottom:12}}><input type=email placeholder=Email value=${em} onInput=${e=>setEm(e.target.value)}/></div>
      <div style=${{marginBottom:12}}><input type=password placeholder=Passwort value=${pw} onInput=${e=>setPw(e.target.value)}/></div>
      <button onClick=${doAuth} style=${{background:'var(--acc)',color:'var(--bg)',borderRadius:10,padding:14,fontSize:16,fontWeight:700,width:'100%'}}>${isR?'Registrieren':'Einloggen'}</button>
      <button onClick=${()=>{setIsR(!isR);setAErr('')}} style=${{background:'none',color:'var(--acc)',fontSize:14,marginTop:12,width:'100%',textAlign:'center'}}>${isR?'Bereits registriert? Einloggen':'Kein Account? Registrieren'}</button>
    </div></div>`;

  if(ld&&!hasA)return html`<div style=${{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100dvh',color:'var(--acc)',fontSize:18}}>Workouts laden...</div>`;

  if(scr==='home'){const rec=[...all].reverse().slice(0,5);return html`<div>
    <div style=${{textAlign:'center',padding:'20px 0 14px'}}><div style=${{fontSize:22,fontWeight:800}}>KATJAS TRACKER</div><div style=${{fontSize:13,color:'var(--t4)',marginTop:3}}>Workout starten</div></div>
    ${hasA&&actR?html`<div style=${{margin:'0 14px 12px',background:'linear-gradient(135deg,#1a2a1a,#0d1a1a)',border:'1px solid #2a4a3a',borderRadius:12,padding:'12px 14px'}}>
      <div style=${{fontSize:14,fontWeight:700,color:'var(--acc)'}}>⏸ Unvollständiges Workout</div>
      <div style=${{fontSize:12,color:'var(--t3)',marginTop:2}}>${PLANS[actR.day]?.icon} ${PLANS[actR.day]?.name}</div>
      <div style=${{display:'flex',gap:6,marginTop:8}}>
        <button onClick=${resume} style=${{background:'var(--acc)',color:'var(--bg)',borderRadius:10,padding:10,fontSize:15,fontWeight:700,flex:1}}>Fortsetzen</button>
        <button onClick=${discard} style=${{background:'var(--bg2)',color:'var(--dng)',border:'1px solid #4a2a2a',borderRadius:10,padding:10,fontSize:15,flex:1}}>Verwerfen</button>
      </div></div>`:null}
    <div style=${{display:'flex',flexDirection:'column',gap:8,padding:'0 14px'}}>
      ${[1,2,3].map(d=>{const p=PLANS[d],l=gL(d);return html`<button key=${d} onClick=${()=>start(d)} style=${{background:'linear-gradient(135deg,#151530,#12203a)',border:'1px solid var(--brd)',borderRadius:14,padding:'14px 16px',textAlign:'left',position:'relative',overflow:'hidden'}}>
        <div style=${{fontSize:30,position:'absolute',right:14,top:'50%',transform:'translateY(-50%)',opacity:.12}}>${p.icon}</div>
        <div style=${{fontSize:17,fontWeight:700}}>${p.icon} ${p.name}</div>
        <div style=${{fontSize:14,color:'var(--acc)',marginTop:1}}>${p.label} · ${p.loc}</div>
        ${l?html`<div style=${{fontSize:11,color:'var(--t4)',marginTop:3}}>Zuletzt: ${new Date(l.date).toLocaleDateString('de-DE')} · ${l.vol?.toLocaleString('de-DE')} kg · ${l.dur} Min</div>`:null}
      </button>`})}
    </div>
    ${rec.length>0?html`<div style=${{padding:'16px 14px'}}><div style=${{fontSize:15,fontWeight:700,marginBottom:8}}>Letzte Workouts</div>
      ${rec.map(w=>{const p=PLANS[w.day];return html`<div key=${w.id} style=${{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid #1a1a30',fontSize:13}}>
        <span style=${{color:'var(--t2)'}}>${p.icon} ${p.label}</span><span style=${{color:'var(--t4)'}}>${new Date(w.date).toLocaleDateString('de-DE')} · ${w.vol?.toLocaleString('de-DE')} kg</span></div>`})}</div>`:null}
    <div style=${{display:'flex',gap:8,padding:'0 14px 20px'}}>
      <button onClick=${()=>{setDay(1);setScr('history')}} style=${{background:'var(--bg2)',color:'var(--acc)',border:'1px solid var(--brd)',borderRadius:10,padding:12,fontSize:15,fontWeight:600,flex:1}}>📊 Trend</button>
      <button onClick=${()=>sb.auth.signOut()} style=${{background:'var(--bg2)',color:'var(--t3)',border:'1px solid var(--brd)',borderRadius:10,padding:'12px 16px',fontSize:15}}>Logout</button>
    </div></div>`}

  if(scr==='workout'&&day){const plan=PLANS[day];return html`<div>
    <div style=${{position:'sticky',top:0,zIndex:20,background:'rgba(13,13,26,.92)',backdropFilter:'blur(12px)',padding:'10px 14px',borderBottom:'1px solid var(--brd)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
      <button onClick=${()=>setScr('home')} style=${{background:'none',color:'var(--dng)',fontSize:14}}>← Zurück</button>
      <span style=${{fontWeight:700,fontSize:15}}>${plan.icon} ${plan.label}</span>
      <button onClick=${finish} disabled=${saving} style=${{background:'var(--acc)',color:'var(--bg)',borderRadius:7,padding:'7px 16px',fontSize:14,fontWeight:700,opacity:saving?.5:1}}>${saving?'...':'✓ Fertig'}</button>
    </div>
    <div style=${{padding:'12px 14px'}}>
      <${WU} items=${plan.wu} ck=${wuCk} onCk=${setWuCk}/>
      ${plan.wuT?html`<${WUT} items=${plan.wuT}/>`:null}
      <div style=${{fontSize:15,fontWeight:700,margin:'14px 0 8px'}}>💪 Übungen</div>
      ${plan.ex.map(ex=>{
        if(ex.opt&&!optE[ex.id])return html`<div key=${ex.id} class=crd style=${{background:'var(--bg)',border:'1px dashed var(--brd2)',padding:'12px 14px'}}>
          <div style=${{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style=${{color:'var(--t4)',fontSize:14}}>${ex.n}</span>
            <button onClick=${()=>setOptE(o=>({...o,[ex.id]:true}))} style=${{borderRadius:5,padding:'4px 12px',fontSize:12,background:'#1a3a2a',color:'var(--acc)'}}>Heute machen</button>
          </div></div>`;
        return html`<${EC} key=${ex.id} ex=${ex} sets=${wd[ex.id]||[]}
          onSet=${(i,d)=>setWd(w=>({...w,[ex.id]:w[ex.id].map((s,j)=>j===i?d:s)}))}
          onAdd=${()=>setWd(w=>({...w,[ex.id]:[...(w[ex.id]||[]),ex.u?eU():eS()]}))}
          onRm=${()=>setWd(w=>({...w,[ex.id]:w[ex.id].slice(0,-1)}))}
          last=${gLE(day,ex.id)} lastN=${gLN(day,ex.id)}
          ast=${ast[ex.id]} onAst=${d=>setAst(a=>({...a,[ex.id]:d}))}
          note=${nts[ex.id]} onNote=${v=>setNts(n=>({...n,[ex.id]:v}))}/>`;
      })}
    </div></div>`}

  if(scr==='summary'&&curW){const plan=PLANS[curW.day];const prev=all.filter(w=>w.day===curW.day&&w.id!==curW.id).slice(-1)[0];const pv=prev?.vol||0;
    return html`<div><div style=${{padding:'12px 14px'}}>
      <div style=${{textAlign:'center',marginBottom:20,paddingTop:10}}><div style=${{fontSize:42}}>🎉</div><div style=${{fontSize:22,fontWeight:800}}>Workout fertig!</div><div style=${{fontSize:15,color:'var(--acc)'}}>${plan.icon} ${plan.name} · ${curW.dur} Min</div></div>
      <div class=crd style=${{background:'linear-gradient(135deg,#1a1030,#0d1a1a)',textAlign:'center'}}>
        <div style=${{fontSize:38,fontWeight:800}}>${curW.vol.toLocaleString('de-DE')} kg</div><div style=${{fontSize:14,color:'var(--t3)'}}>Gesamtvolumen</div>
        ${pv>0?html`<div style=${{fontSize:16,fontWeight:700,marginTop:8,color:curW.vol>=pv?'var(--acc)':'var(--dng)'}}>${curW.vol>=pv?'↗️':'↘️'} ${curW.vol>=pv?'+':''}${(curW.vol-pv).toLocaleString('de-DE')} kg (${((curW.vol-pv)/pv*100).toFixed(0)}%)</div>`:null}
      </div>
      <div style=${{marginTop:16}}><${FC} w=${curW} vol=${curW.vol} prev=${pv} dur=${curW.dur}/></div>
      <button onClick=${()=>{setScr('home');setDay(null)}} style=${{background:'var(--acc)',color:'var(--bg)',borderRadius:10,padding:14,fontSize:16,fontWeight:700,width:'100%',marginTop:16}}>← Zurück</button>
    </div></div>`}

  if(scr==='history'){return html`<div>
    <div style=${{position:'sticky',top:0,zIndex:20,background:'rgba(13,13,26,.92)',backdropFilter:'blur(12px)',padding:'10px 14px',borderBottom:'1px solid var(--brd)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
      <button onClick=${()=>setScr('home')} style=${{background:'none',color:'var(--acc)',fontSize:14}}>← Zurück</button>
      <span style=${{fontWeight:700,fontSize:15}}>📊 Trend</span><div style=${{width:60}}/>
    </div>
    <div style=${{padding:'12px 14px'}}>
      ${[1,2,3].map(d=>{const data=all.filter(w=>w.day===d);const p=PLANS[d];if(!data.length)return null;return html`<div key=${d} class=crd style=${{marginBottom:14}}>
        <div style=${{fontSize:15,fontWeight:700,marginBottom:8}}>${p.icon} ${p.name}: ${p.label}</div>
        <div style=${{fontSize:13,color:'var(--t3)'}}>${data.map(w=>new Date(w.date).toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit'})+': '+w.vol+'kg').join(' → ')}</div>
      </div>`})}
      <div style=${{fontSize:15,fontWeight:700,margin:'14px 0 8px'}}>Übungs-Historie</div>
      <div style=${{display:'flex',gap:6,marginBottom:10,flexWrap:'wrap'}}>
        ${[1,2,3].map(d=>html`<button key=${d} onClick=${()=>setDay(d)} style=${{borderRadius:8,padding:'7px 16px',fontSize:13,background:day===d?'var(--accA)':'var(--bg2)',border:'1px solid '+(day===d?'var(--acc)':'var(--brd)'),color:day===d?'var(--acc)':'var(--t3)'}}>${PLANS[d].icon} ${PLANS[d].name}</button>`)}
      </div>
      ${day?PLANS[day].ex.map(ex=>{
        const hist=all.filter(w=>w.day===day&&w.exs[ex.id]).map(w=>({dt:new Date(w.date).toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit'}),s:w.exs[ex.id],nt:w.nts?.[ex.id]||''}));
        if(!hist.length)return null;
        return html`<div key=${ex.id} class=crd style=${{padding:'10px 14px',marginBottom:6}}>
          <div style=${{fontSize:14,fontWeight:700}}>${ex.n}</div>
          <div style=${{fontSize:12,color:'var(--t4)',marginTop:4}}>
            ${hist.map((h,i)=>html`<div key=${i} style=${{display:'flex',justifyContent:'space-between',padding:'2px 0'}}>
              <span>${h.dt}${h.nt?' 📝 '+h.nt:''}</span>
              <span>${h.s.map(s=>s.rR!==undefined?'R:'+(s.rR||s.sR||0)+'×'+(s.kR||0)+' L:'+(s.rL||s.sL||0)+'×'+(s.kL||0):(s.reps||s.secs||0)+(ex.noKg?'':'×'+(s.kg||0)+'kg')).join(' | ')}</span>
            </div>`)}
          </div></div>`;
      }):null}
    </div></div>`}
  return null;
}

render(html`<${App}/>`,document.getElementById('root'));
