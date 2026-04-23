// app.js – Hauptkomponente, Auth, Screens, State (Redesign v2)

import { html, render, useState, useEffect, useRef } from 'https://unpkg.com/htm/preact/standalone.module.js';
import { PLANS, LEGACY_ID_MAP, PLAN_V2_DATE, PLAN_V4_DATE, PLAN_V5_DATE, PLAN_V1_LABELS, PLAN_V2_LABELS } from './plans.js';
import { eS, eU, iSets, calcVol } from './helpers.js';
import { sb, dbLoad, dbSave, dbSvAct, dbLdAct, dbDlAct, dbDelWorkout } from './db.js';
import { Timer, EC, WU, WUT, FC, WorkoutTimer, BottomNav, VolumeChart, DonutChart, Calendar } from './components.js';

/* ── Day Icons (SVG) ── */
const DAY_ICONS={
  1:html`<svg width=24 height=24 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width=2.5 stroke-linecap="round"><path d="M8 4c0 0 0 4 0 6s2 4 4 4"/><path d="M16 4c0 0 0 4 0 6s-2 4-4 4"/><path d="M8 14v6"/><path d="M16 14v6"/></svg>`,
  2:html`<svg width=24 height=24 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width=2.5 stroke-linecap="round"><path d="M5 17c0-2 2-4 5-4"/><path d="M10 13V6c0-1.5 1.5-3 3-1.5L16 8"/><path d="M16 8v5c0 2-2 4-4 4"/></svg>`,
  3:html`<svg width=24 height=24 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width=2.5 stroke-linecap="round"><circle cx=12 cy=5 r=2/><path d="M10 22l-2-8 4-4 4 4-2 8"/><path d="M6 12l4-2"/><path d="M18 12l-4-2"/></svg>`
};
const DAY_COLORS={1:'#F59E0B',2:'#3B82F6',3:'#10B981'};

function App(){
  const[user,setUser]=useState(null);const[aLd,setALd]=useState(true);
  const[scr,setScr]=useState('home');const[day,setDay]=useState(null);
  const[wd,setWd]=useState({});const[nts,setNts]=useState({});const[ast,setAst]=useState({});
  const[optE,setOptE]=useState({});const[stT,setStT]=useState(null);const[wuCk,setWuCk]=useState({});
  const[wCmt,setWCmt]=useState('');
  const[all,setAll]=useState([]);const[ld,setLd]=useState(true);
  const[curW,setCurW]=useState(null);const[hasA,setHasA]=useState(false);const[actR,setActR]=useState(null);
  const[aErr,setAErr]=useState('');const[em,setEm]=useState('');const[pw,setPw]=useState('');const[isR,setIsR]=useState(false);
  const svT=useRef(null);const[saving,setSaving]=useState(false);const[aFilter,setAFilter]=useState('all');
  const[delConfirm,setDelConfirm]=useState(null);

  useEffect(()=>{sb.auth.getSession().then(({data})=>{if(data.session?.user)setUser(data.session.user);setALd(false)});
    const{data:l}=sb.auth.onAuthStateChange((_,s)=>setUser(s?.user||null));return()=>l.subscription.unsubscribe()},[]);
  useEffect(()=>{if(!user)return;
    dbLdAct(user.id).then(a=>{if(a){setHasA(true);setActR(a)}});
    dbLoad(user.id).then(w=>{setAll(w||[]);setLd(false)});
  },[user]);
  useEffect(()=>{if(scr!=='workout'||!day||!user)return;clearTimeout(svT.current);svT.current=setTimeout(()=>dbSvAct(user.id,day,wd,nts,ast,optE,stT,wuCk,wCmt),500);return()=>clearTimeout(svT.current)},[wd,nts,ast,optE,wuCk,wCmt]);

  const doAuth=async()=>{setAErr('');const{error}=isR?await sb.auth.signUp({email:em,password:pw}):await sb.auth.signInWithPassword({email:em,password:pw});if(error)setAErr(error.message)};
  const start=d=>{const p=PLANS[d];const dd={};p.ex.forEach(e=>{dd[e.id]=iSets(e)});setWd(dd);setNts({});setAst({});setOptE({});setWuCk({});setWCmt('');setDay(d);setStT(Date.now());setScr('workout');setHasA(false)};
  const resume=()=>{if(!actR)return;const d=actR.data;setDay(actR.day);setWd(d.d||{});setNts(d.n||{});setAst(d.a||{});setOptE(d.o||{});setWuCk(d.wuCk||{});setWCmt(d.wCmt||'');setStT(d.st||Date.now());setScr('workout');setHasA(false)};
  const discard=async()=>{if(user)await dbDlAct(user.id);setHasA(false);setActR(null)};
  const gL=d=>[...all].reverse().find(w=>w.day===d&&w.date>=PLAN_V5_DATE);
  const gLold=d=>[...all].reverse().find(w=>w.day===d&&w.date<PLAN_V5_DATE);
  const planLabel=(w)=>w.date<PLAN_V2_DATE?(PLAN_V1_LABELS[w.day]||PLANS[w.day]?.label):w.date<PLAN_V4_DATE?(PLAN_V2_LABELS[w.day]||PLANS[w.day]?.label):PLANS[w.day]?.label;

  // Resolve legacy ID: given a stable exercise ID and a workout's day, find the old e1/e2/etc ID
  const getLegacyId=(stableId,wDay)=>{
    for(const[k,v]of Object.entries(LEGACY_ID_MAP)){
      if(v!==stableId)continue;
      // k is like "1:e1" or "3:e5" – only match if the day prefix matches the workout's day
      const parts=k.split(':');
      if(parts.length===2&&parseInt(parts[0])===wDay)return parts[1];
    }
    return null;
  };

  // Find last exercise data across ALL workouts (cross-day), with legacy ID support
  const gLE=(day,id)=>{
    for(let i=all.length-1;i>=0;i--){
      const w=all[i];
      // 1. Try direct match with stable ID (works for new workouts saved with stable IDs)
      const sets=w.exs?.[id];
      if(sets&&sets.length>0&&sets.some(s=>s.reps||s.rR||s.secs||s.sR||s.kg||s.kR))return sets;
      // 2. Try legacy ID for THIS workout's day (old workouts saved with e1/e2/etc)
      const legId=getLegacyId(id,w.day);
      if(legId){
        const lsets=w.exs?.[legId];
        if(lsets&&lsets.length>0&&lsets.some(s=>s.reps||s.rR||s.secs||s.sR||s.kg||s.kR))return lsets;
      }
    }
    return null;
  };
  const gLN=(day,id)=>{
    for(let i=all.length-1;i>=0;i--){
      const w=all[i];
      if(w.nts?.[id])return w.nts[id];
      const legId=getLegacyId(id,w.day);
      if(legId&&w.nts?.[legId])return w.nts[legId];
    }
    return null;
  };
  const finish=async()=>{setSaving(true);const dur=stT?(Date.now()-stT)/60000:0;const vol=calcVol(wd);
    await dbSave(user.id,day,wd,nts,ast,vol,Math.round(dur));if(user)await dbDlAct(user.id);
    const w={id:Date.now().toString(),day,date:new Date().toISOString(),exs:wd,nts,vol,dur:Math.round(dur),cmt:wCmt};
    setAll(p=>[...p,w]);setCurW(w);setHasA(false);setActR(null);setSaving(false);setScr('summary')};
  const navTo=s=>{setScr(s);if(s==='history')setDay(null)};
  const deleteWorkout=async(wId)=>{await dbDelWorkout(wId);setAll(p=>p.filter(w=>w.id!==wId));setDelConfirm(null)};

  /* ── Loading ── */
  if(aLd)return html`<div style=${{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100dvh',color:'var(--acc)',fontSize:18,fontFamily:'var(--mono)'}}>Laden...</div>`;

  /* ══════════════════════════════════════════════
     LOGIN SCREEN
     ══════════════════════════════════════════════ */
  if(!user)return html`<div style=${{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'100dvh',padding:32,textAlign:'center'}}>
    <div style=${{marginBottom:48}}>
      <div style=${{display:'inline-flex',width:80,height:80,background:'var(--accA)',border:'1px solid var(--accB)',borderRadius:24,alignItems:'center',justifyContent:'center',color:'var(--acc)',marginBottom:24}}>
        <svg width=40 height=40 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width=2.5><path d="M6 15h12"/><path d="M6 9h12"/><path d="M9 22h6"/><path d="M9 2h6"/></svg>
      </div>
      <h1 style=${{fontSize:40,fontWeight:800,letterSpacing:'-2px',lineHeight:1,marginBottom:8}}>KATJAS TRACKER</h1>
      <p class=mono style=${{fontSize:11,color:'var(--t4)',textTransform:'uppercase',letterSpacing:3}}>${isR?'Account erstellen':'Einloggen'}</p>
    </div>
    ${aErr?html`<div style=${{color:'var(--dng)',fontSize:13,marginBottom:12}}>${aErr}</div>`:null}
    <div style=${{width:'100%',maxWidth:360}}>
      <div style=${{position:'relative',marginBottom:16}}>
        <svg style=${{position:'absolute',left:16,top:'50%',transform:'translateY(-50%)',color:'var(--t4)'}} width=18 height=18 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width=2><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        <input type=email placeholder="Email Address" value=${em} onInput=${e=>setEm(e.target.value)} style=${{paddingLeft:48,textAlign:'left',height:56,borderRadius:'var(--r)',fontSize:14,fontFamily:'var(--font)'}}/>
      </div>
      <div style=${{position:'relative',marginBottom:16}}>
        <svg style=${{position:'absolute',left:16,top:'50%',transform:'translateY(-50%)',color:'var(--t4)'}} width=18 height=18 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width=2><rect x=3 y=11 width=18 height=11 rx=2 ry=2/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        <input type=password placeholder="Password" value=${pw} onInput=${e=>setPw(e.target.value)} style=${{paddingLeft:48,textAlign:'left',height:56,borderRadius:'var(--r)',fontSize:14,fontFamily:'var(--font)'}}/>
      </div>
      <button onClick=${doAuth} style=${{width:'100%',height:56,background:'var(--acc)',color:'var(--accD)',borderRadius:'var(--r)',fontSize:16,fontWeight:700,marginTop:8}}>${isR?'Registrieren':'Sign In'}</button>
      <p style=${{marginTop:28,fontSize:14,color:'var(--t4)'}}>
        ${isR?'Bereits registriert? ':'Don\'t have an account? '}
        <span onClick=${()=>{setIsR(!isR);setAErr('')}} style=${{color:'var(--acc)',fontWeight:700,cursor:'pointer'}}>${isR?'Einloggen':'Register'}</span>
      </p>
    </div>
  </div>`;

  if(ld&&!hasA)return html`<div style=${{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100dvh',color:'var(--acc)',fontSize:18,fontFamily:'var(--mono)'}}>Workouts laden...</div>`;

  /* ══════════════════════════════════════════════
     HOME SCREEN
     ══════════════════════════════════════════════ */
  if(scr==='home'){const rec=[...all].reverse().slice(0,5);return html`<div style=${{paddingBottom:90}}>
    <header style=${{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'24px 20px 0',position:'relative',zIndex:10}}>
      <div>
        <h1 style=${{fontSize:28,fontWeight:700,letterSpacing:'-1px'}}>KATJAS TRACKER</h1>
        <p class=mono style=${{fontSize:12,color:'var(--t4)',textTransform:'uppercase',letterSpacing:2}}>Ready for the grind?</p>
      </div>
    </header>

    <div style=${{padding:'24px 20px 0'}}>
      ${hasA&&actR?html`<div class=glass style=${{padding:'16px 18px',marginBottom:16,borderColor:'var(--accB)',background:'rgba(16,185,129,0.05)'}}>
        <div style=${{fontSize:15,fontWeight:700,color:'var(--acc)',marginBottom:4}}>⏸ Unvollständiges Workout</div>
        <div class=mono style=${{fontSize:12,color:'var(--t3)'}}>${PLANS[actR.day]?.icon} ${PLANS[actR.day]?.name}: ${PLANS[actR.day]?.label}</div>
        <div style=${{display:'flex',gap:8,marginTop:10}}>
          <button onClick=${resume} style=${{background:'var(--acc)',color:'var(--accD)',borderRadius:'var(--rs)',padding:'12px',fontSize:15,fontWeight:700,flex:1}}>Fortsetzen</button>
          <button onClick=${discard} class=glass style=${{color:'var(--dng)',padding:'12px',fontSize:15,flex:1,borderColor:'var(--dngB)'}}>Verwerfen</button>
        </div>
      </div>`:null}

      <div class=label style=${{marginBottom:12}}>Active Routines</div>
      <div style=${{display:'flex',flexDirection:'column',gap:12}}>
        ${[1,2,3].map(d=>{const p=PLANS[d],l=gL(d);return html`<button key=${d} onClick=${()=>start(d)} class=glass style=${{padding:'16px 18px',display:'flex',alignItems:'center',textAlign:'left',width:'100%'}}>
          <div style=${{width:48,height:48,background:'var(--bg2)',borderRadius:'var(--rs)',display:'flex',alignItems:'center',justifyContent:'center',color:DAY_COLORS[d],marginRight:16,flexShrink:0}}>
            ${DAY_ICONS[d]}
          </div>
          <div style=${{flex:1}}>
            <div style=${{fontSize:17,fontWeight:700}}>${p.label}</div>
            <div class=mono style=${{fontSize:13,color:'var(--t3)',marginTop:2}}>${p.loc}</div>
            ${l?html`<div class=mono style=${{fontSize:11,color:'var(--t2)',marginTop:4,textTransform:'uppercase'}}>Last: ${new Date(l.date).toLocaleDateString('de-DE')} · ${l.vol?.toLocaleString('de-DE')} kg</div>`:null}
          </div>
          <svg width=20 height=20 viewBox="0 0 24 24" fill="none" stroke="var(--t5)" stroke-width=2><polyline points="9 18 15 12 9 6"/></svg>
        </button>`})}
      </div>

      <div style=${{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,margin:'24px 0'}}>
        <button onClick=${()=>navTo('analytics')} class=glass style=${{padding:'20px',display:'flex',flexDirection:'column',alignItems:'center',gap:10}}>
          <svg width=28 height=28 viewBox="0 0 24 24" fill="none" stroke="var(--acc)" stroke-width=2><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          <span class=mono style=${{fontSize:11,textTransform:'uppercase',letterSpacing:2,color:'var(--t2)'}}>Trends</span>
        </button>
        <button onClick=${()=>navTo('history')} class=glass style=${{padding:'20px',display:'flex',flexDirection:'column',alignItems:'center',gap:10}}>
          <svg width=28 height=28 viewBox="0 0 24 24" fill="none" stroke="var(--blu)" stroke-width=2><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/></svg>
          <span class=mono style=${{fontSize:11,textTransform:'uppercase',letterSpacing:2,color:'var(--t2)'}}>History</span>
        </button>
      </div>

      ${rec.length>0?html`<div>
        <div class=label style=${{marginBottom:12}}>Recent Performance</div>
        <div class=glass style=${{padding:'4px 16px'}}>
          ${rec.slice(0,3).map((w,i)=>{const p=PLANS[w.day];return html`<div key=${w.id} style=${{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 0',borderBottom:i<2?'1px solid rgba(255,255,255,0.05)':'none'}}>
            <span style=${{fontSize:14,fontWeight:500}}>${planLabel(w)||'Workout'}</span>
            <div>
              <span class=mono style=${{fontSize:12,color:'var(--t4)',marginRight:12}}>${new Date(w.date).toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit'})}</span>
              <span class=mono style=${{fontSize:14,fontWeight:700,color:'var(--acc)'}}>${w.vol?.toLocaleString('de-DE')} kg</span>
            </div>
          </div>`})}
        </div>
      </div>`:null}
    </div>
    <${BottomNav} active="home" onNav=${navTo}/>
  </div>`}

  /* ══════════════════════════════════════════════
     WORKOUT SESSION
     ══════════════════════════════════════════════ */
  if(scr==='workout'&&day){const plan=PLANS[day];return html`<div style=${{paddingBottom:40}}>
    <header class=glass style=${{position:'sticky',top:0,zIndex:50,borderRadius:0,borderTop:'none',borderLeft:'none',borderRight:'none',backdropFilter:'blur(12px)',WebkitBackdropFilter:'blur(12px)',padding:'16px 20px',display:'flex',justifyContent:'space-between',alignItems:'center',background:'rgba(10,10,11,0.85)'}}>
      <button onClick=${()=>setScr('home')} style=${{background:'none',color:'var(--t4)',padding:4}}>
        <svg width=20 height=20 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width=2><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
      </button>
      <div style=${{textAlign:'center'}}>
        <div class=mono style=${{fontSize:10,color:'var(--t4)',textTransform:'uppercase',letterSpacing:2}}>Session</div>
        <div style=${{fontSize:17,fontWeight:700}}>${plan.label}</div>
      </div>
      <button onClick=${finish} disabled=${saving} style=${{background:'var(--acc)',color:'var(--accD)',borderRadius:10,padding:'8px 18px',fontSize:13,fontWeight:700,opacity:saving?.5:1}}>Finish</button>
    </header>

    <div style=${{padding:'20px'}}>
      <div class=glass style=${{padding:'20px',marginBottom:20,borderColor:'var(--accB)',background:'rgba(16,185,129,0.03)'}}>
        <div style=${{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <div class=mono style=${{fontSize:10,color:'var(--acc)',textTransform:'uppercase',letterSpacing:2,marginBottom:4}}>Total Time</div>
            <div class=mono style=${{fontSize:38,fontWeight:700,color:'var(--acc)',letterSpacing:'-2px'}}><${WorkoutTimer} startTime=${stT}/></div>
          </div>
          <button onClick=${()=>{}} style=${{width:52,height:52,background:'rgba(16,185,129,0.15)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--acc)'}}>
            <svg width=24 height=24 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width=2><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </button>
        </div>
      </div>

      <div class=label style=${{marginBottom:12,display:'flex',alignItems:'center',gap:8}}>
        <span style=${{color:'var(--wrn)'}}>🔥</span> Warm-up
      </div>
      <${WU} items=${plan.wu} ck=${wuCk} onCk=${setWuCk}/>
      ${plan.wuT?html`<${WUT} items=${plan.wuT}/>`:null}

      <div class=label style=${{margin:'20px 0 12px'}}>Exercises</div>
      ${plan.ex.map(ex=>{
        if(ex.opt&&!optE[ex.id])return html`<div key=${ex.id} class=glass style=${{padding:'14px 18px',margin:'12px 0',borderStyle:'dashed'}}>
          <div style=${{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style=${{color:'var(--t4)',fontSize:14}}>${ex.n}</span>
            <button onClick=${()=>setOptE(o=>({...o,[ex.id]:true}))} style=${{borderRadius:'var(--rxs)',padding:'6px 14px',fontSize:12,fontWeight:600,background:'var(--accA)',color:'var(--acc)'}}>Heute machen</button>
          </div></div>`;
        return html`<${EC} key=${ex.id} ex=${ex} sets=${wd[ex.id]||[]}
          onSet=${(i,d)=>setWd(w=>({...w,[ex.id]:w[ex.id].map((s,j)=>j===i?d:s)}))}
          onAdd=${()=>setWd(w=>({...w,[ex.id]:[...(w[ex.id]||[]),ex.u?eU():eS()]}))}
          onRm=${()=>setWd(w=>({...w,[ex.id]:w[ex.id].slice(0,-1)}))}
          last=${gLE(day,ex.id)} lastN=${gLN(day,ex.id)}
          ast=${ast[ex.id]} onAst=${d=>setAst(a=>({...a,[ex.id]:d}))}
          note=${nts[ex.id]} onNote=${v=>setNts(n=>({...n,[ex.id]:v}))}/>`;
      })}

      <div class=glass style=${{padding:'16px 18px',margin:'20px 0 8px'}}>
        <div class=label style=${{marginBottom:8,display:'flex',alignItems:'center',gap:8}}>
          <span>💬</span> Workout-Kommentar
        </div>
        <input type=text placeholder="z.B. Nur Lower Body weil wenig Zeit..." value=${wCmt} onInput=${e=>setWCmt(e.target.value)} style=${{fontSize:13,textAlign:'left',padding:'10px 14px'}}/>
      </div>
    </div>
  </div>`}

  /* ══════════════════════════════════════════════
     SUMMARY SCREEN
     ══════════════════════════════════════════════ */
  if(scr==='summary'&&curW){const plan=PLANS[curW.day];
    // Fix: find previous workout of same day, sorted by date desc, skip current
    const prev=all.filter(w=>w.day===curW.day&&w.id!==curW.id).sort((a,b)=>b.date>a.date?1:-1)[0];
    const pv=prev&&prev.vol>0?prev.vol:null;
    const durH=Math.floor(curW.dur/60),durM=curW.dur%60;const durStr=durH>0?durH+'h '+durM+' Min':curW.dur+' Min';
    const volDiff=pv!=null?curW.vol-pv:null;const volPct=pv!=null?((volDiff/pv)*100).toFixed(0):null;
    // Exercise progressions – weighted (volume-based) and bodyweight separately
    const progs=[],regs=[];
    // BW reps: sum all reps across sets for noKg exercises
    const bwExIds=plan.ex.filter(e=>e.noKg||e.iso).map(e=>e.id);
    const curBwReps=bwExIds.reduce((sum,id)=>{const sets=curW.exs?.[id];if(!sets)return sum;return sum+sets.filter(s=>!s.isW).reduce((s2,s)=>s2+(parseInt(s.reps||s.rR||s.secs||s.sR||0)||0),0)},0);
    const prevBwReps=pv!=null?bwExIds.reduce((sum,id)=>{const sets=prev.exs?.[id];if(!sets)return sum;return sum+sets.filter(s=>!s.isW).reduce((s2,s)=>s2+(parseInt(s.reps||s.rR||s.secs||s.sR||0)||0),0)},0):null;
    const bwDiff=prevBwReps!=null?curBwReps-prevBwReps:null;
    if(prev?.exs){plan.ex.forEach(ex=>{
      if(ex.noKg||ex.iso)return;// BW handled separately
      const cur=curW.exs?.[ex.id],old=prev.exs?.[ex.id];if(!cur||!old)return;
      const cSets=cur.filter(s=>!s.isW),oSets=old.filter(s=>!s.isW);
      if(!cSets.length||!oSets.length)return;
      // Calculate per-exercise volume (sum of kg*reps across all sets)
      const cVol=cSets.reduce((s,set)=>(parseFloat(set.kg||set.kR||0)||0)*(parseInt(set.reps||set.rR||0)||0)+s,0);
      const oVol=oSets.reduce((s,set)=>(parseFloat(set.kg||set.kR||0)||0)*(parseInt(set.reps||set.rR||0)||0)+s,0);
      const cMax=Math.max(...cSets.map(s=>parseFloat(s.kg||s.kR||0)||0));
      const oMax=Math.max(...oSets.map(s=>parseFloat(s.kg||s.kR||0)||0));
      const cTotReps=cSets.reduce((s,set)=>s+(parseInt(set.reps||set.rR||0)||0),0);
      const oTotReps=oSets.reduce((s,set)=>s+(parseInt(set.reps||set.rR||0)||0),0);
      const cleanN=ex.n.replace(/^[❤️⭐\s]+/u,'');
      if(cVol>oVol){
        // Volume up – show volume increase
        progs.push({n:cleanN,t:'vol',v:+(cVol-oVol).toFixed(0)});
      } else if(cVol<oVol){
        // Volume down – show context: how kg and reps changed
        const kgDiff=+(cMax-oMax).toFixed(1);const repDiff=cTotReps-oTotReps;
        regs.push({n:cleanN,t:'vol',v:+(oVol-cVol).toFixed(0),kgDiff,repDiff});
      }
    })}
    return html`<div style=${{padding:'32px 20px',textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',minHeight:'100dvh'}}>
      <div style=${{marginBottom:24}}>
        <div style=${{display:'inline-flex',padding:16,background:'var(--accA)',border:'1px solid var(--accB)',borderRadius:24,marginBottom:20}}>
          <svg width=48 height=48 viewBox="0 0 24 24" fill="none" stroke="var(--acc)" stroke-width=2><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.5 4 6.5 2 2 3 3.5 3 5.5a6 6 0 1 1-12 0c0-2.345 1.5-4.5 3-6.5-.5 2.5 0 4.5 1.5 6.5Z"/></svg>
        </div>
        <h1 style=${{fontSize:28,fontWeight:700,letterSpacing:'-1.5px',marginBottom:4}}>WORKOUT COMPLETE</h1>
        <p class=mono style=${{fontSize:11,color:'var(--acc)',textTransform:'uppercase',letterSpacing:2}}>${plan.name}: ${plan.label}</p>
        <p class=mono style=${{fontSize:10,color:'var(--t5)',marginTop:4}}>${new Date(curW.date).toLocaleDateString('de-DE')} · ${durStr}</p>
      </div>

      <div class=glass style=${{width:'100%',padding:'20px',marginBottom:16,textAlign:'center'}}>
        <p style=${{fontSize:48,fontWeight:700,letterSpacing:'-2px',lineHeight:1,marginBottom:4}}>${curW.vol.toLocaleString('de-DE')} kg</p>
        <p class=mono style=${{fontSize:10,color:'var(--t4)',textTransform:'uppercase',letterSpacing:2,marginBottom:volDiff!=null?8:0}}>Gesamtvolumen bewegt</p>
        ${volDiff!=null?html`<div class=mono style=${{fontSize:15,fontWeight:700,color:volDiff>=0?'var(--acc)':'var(--dng)'}}>${volDiff>=0?'↗️':'↘️'} ${volDiff>=0?'+':''}${volDiff.toLocaleString('de-DE')} kg (${volDiff>=0?'+':''}${volPct}%) vs. letztes Mal</div>`:null}
      </div>

      ${curBwReps>0?html`<div class=glass style=${{width:'100%',padding:'16px 20px',marginBottom:16,textAlign:'center'}}>
        <p style=${{fontSize:32,fontWeight:700,letterSpacing:'-1px',lineHeight:1,marginBottom:4}}>${curBwReps} Reps</p>
        <p class=mono style=${{fontSize:10,color:'var(--t4)',textTransform:'uppercase',letterSpacing:2,marginBottom:bwDiff!=null?6:0}}>Bodyweight Exercises</p>
        ${bwDiff!=null?html`<div class=mono style=${{fontSize:14,fontWeight:700,color:bwDiff>=0?'var(--acc)':'var(--dng)'}}>${bwDiff>=0?'↗️':'↘️'} ${bwDiff>=0?'+':''}${bwDiff} Reps vs. letztes Mal</div>`:null}
      </div>`:null}

      ${progs.length>0?html`<div class=glass style=${{width:'100%',padding:'16px',marginBottom:12,textAlign:'left'}}>
        <div style=${{fontSize:13,fontWeight:700,color:'var(--acc)',marginBottom:8}}>💪 Volumen gesteigert bei ${progs.length} Übung${progs.length>1?'en':''}!</div>
        ${progs.map(p=>html`<div style=${{fontSize:13,color:'var(--t2)',padding:'3px 0'}}>↗️ ${p.n}: +${p.v} kg Volumen</div>`)}
      </div>`:null}

      ${regs.length>0?html`<div class=glass style=${{width:'100%',padding:'16px',marginBottom:12,textAlign:'left',borderColor:'var(--dngB)'}}>
        <div style=${{fontSize:13,fontWeight:700,color:'var(--dng)',marginBottom:8}}>📉 Weniger Volumen bei ${regs.length} Übung${regs.length>1?'en':''}:</div>
        ${regs.map(r=>html`<div style=${{fontSize:13,color:'var(--t3)',padding:'3px 0'}}>↘️ ${r.n}: −${r.v} kg Vol${r.kgDiff!==0?` (${r.kgDiff>0?'+':''}${r.kgDiff} kg${r.repDiff!==0?', ':''}${r.repDiff!==0?(r.repDiff>0?'+':'')+r.repDiff+' Reps':''})`:`${r.repDiff!==0?' ('+(r.repDiff>0?'+':'')+r.repDiff+' Reps)':''}`}</div>`)}
      </div>`:null}

      ${curW.cmt?html`<div class=glass style=${{width:'100%',padding:'14px 18px',marginBottom:12,textAlign:'left'}}>
        <div style=${{fontSize:13,color:'var(--t3)',fontStyle:'italic'}}>💬 ${curW.cmt}</div>
      </div>`:null}

      <div style=${{width:'100%',marginBottom:24}}><${FC} w=${curW} vol=${curW.vol} prev=${pv} bwReps=${curBwReps} bwDiff=${bwDiff} dur=${curW.dur} cmt=${curW.cmt}/></div>

      <div style=${{width:'100%',display:'flex',gap:10}}>
        <button onClick=${()=>{setScr('workout')}} class=glass style=${{color:'var(--wrn)',padding:'16px',fontSize:16,fontWeight:700,flex:1}}>← Korrigieren</button>
        <button onClick=${()=>{setScr('home');setDay(null)}} style=${{background:'var(--acc)',color:'var(--accD)',borderRadius:'var(--r)',padding:'16px',fontSize:16,fontWeight:700,flex:2}}>Back to Dashboard</button>
      </div>
    </div>`}

  /* ══════════════════════════════════════════════
     ANALYTICS SCREEN
     ══════════════════════════════════════════════ */
  if(scr==='analytics'){
    // Build exercise list from all plans
    const allExercises=[];Object.values(PLANS).forEach(p=>p.ex.forEach(e=>{if(!allExercises.find(x=>x.id===e.id))allExercises.push({id:e.id,n:e.n,day:p.name})}));
    // Build workout-name filter options (unique labels across all workouts)
    const labelSet=new Set();all.forEach(w=>{const lbl=planLabel(w);if(lbl)labelSet.add(lbl)});
    const labelFilters=[...labelSet].sort().map(l=>({id:'wn:'+l,label:l}));

    let chartData,muscleData;
    const wnMatch=aFilter.match(/^wn:(.+)$/);
    if(aFilter==='all'){
      chartData=all.map(w=>({date:w.date,vol:w.vol}));
      const mg={};all.forEach(w=>{const p=PLANS[w.day];if(!p)return;p.ex.forEach(ex=>{const ms=ex.m.split(',').map(m=>m.trim());ms.forEach(m=>{mg[m]=(mg[m]||0)+(w.exs?.[ex.id]?.length||0)})})});
      muscleData=Object.entries(mg).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([name,value])=>({name,value}));
    } else if(wnMatch){
      const wName=wnMatch[1];
      const wnWs=all.filter(w=>planLabel(w)===wName);
      chartData=wnWs.map(w=>({date:w.date,vol:w.vol}));
      const mg={};wnWs.forEach(w=>{const p=PLANS[w.day];if(!p)return;p.ex.forEach(ex=>{const ms=ex.m.split(',').map(m=>m.trim());ms.forEach(m=>{mg[m]=(mg[m]||0)+(w.exs?.[ex.id]?.length||0)})})});
      muscleData=Object.entries(mg).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([name,value])=>({name,value}));
    } else {
      // Single exercise filter
      const exDef=allExercises.find(e=>e.id===aFilter);
      chartData=[];
      all.forEach(w=>{const sets=w.exs?.[aFilter];if(!sets)return;
        const vol=sets.reduce((t,s)=>{if(s.isW)return t;if(s.kg!==undefined)return t+(parseFloat(s.kg)||0)*(parseInt(s.reps)||parseInt(s.secs)||0);return t+(parseFloat(s.kR)||0)*(parseInt(s.rR)||parseInt(s.sR)||0)+(parseFloat(s.kL)||0)*(parseInt(s.rL)||parseInt(s.sL)||0)},0);
        chartData.push({date:w.date,vol:Math.round(vol)})});
      muscleData=null;
    }

    // Stats — scoped to filter
    const filteredAll=wnMatch?all.filter(w=>planLabel(w)===wnMatch[1]):all;
    const avgDur=filteredAll.length?Math.round(filteredAll.reduce((t,w)=>t+w.dur,0)/filteredAll.length):0;
    const totalWorkouts=aFilter==='all'?all.length:wnMatch?filteredAll.length:chartData.length;

    return html`<div style=${{paddingBottom:90}}>
      <header style=${{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'24px 20px',position:'relative',zIndex:10}}>
        <div style=${{display:'flex',alignItems:'center',gap:14}}>
          <button onClick=${()=>navTo('home')} style=${{background:'none',color:'var(--t4)',padding:4}}>
            <svg width=20 height=20 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width=2><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          </button>
          <h1 style=${{fontSize:24,fontWeight:700}}>Analytics</h1>
        </div>
        <select value=${aFilter} onChange=${e=>setAFilter(e.target.value)} class=mono style=${{width:'auto',fontSize:12,padding:'8px 12px',borderRadius:'var(--rs)',textAlign:'left'}}>
          <option value="all">All Workouts</option>
          <optgroup label="Workout-Typ">
            ${labelFilters.map(d=>html`<option key=${d.id} value=${d.id}>${d.label}</option>`)}
          </optgroup>
          <optgroup label="Einzelne Übung">
            ${allExercises.map(e=>html`<option key=${e.id} value=${e.id}>${e.n}</option>`)}
          </optgroup>
        </select>
      </header>

      <div style=${{padding:'0 20px',display:'flex',flexDirection:'column',gap:20}}>
        <${VolumeChart} data=${chartData}/>

        ${muscleData&&muscleData.length>0?html`<${DonutChart} data=${muscleData}/>`:null}

        <div style=${{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          <div class=glass style=${{padding:'16px'}}>
            <div class=label style=${{marginBottom:4}}>Avg. Duration</div>
            <div style=${{fontSize:24,fontWeight:700,letterSpacing:'-1px'}}>${avgDur} Min</div>
          </div>
          <div class=glass style=${{padding:'16px'}}>
            <div class=label style=${{marginBottom:4}}>Total Workouts</div>
            <div style=${{fontSize:24,fontWeight:700,letterSpacing:'-1px'}}>${totalWorkouts}</div>
          </div>
        </div>

        ${aFilter==='all'||wnMatch?html`<div>
          <div class=label style=${{marginBottom:12}}>Per Exercise</div>
          <div class=mono style=${{fontSize:12,color:'var(--t4)',textAlign:'center',padding:10}}>Wähle eine Übung im Dropdown oben</div>
        </div>`:html`<div>
          <div style=${{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
            <div class=label>History: ${allExercises.find(e=>e.id===aFilter)?.n||''}</div>
            <button onClick=${()=>setAFilter('all')} class=mono style=${{fontSize:11,color:'var(--acc)',background:'var(--accA)',border:'none',borderRadius:'var(--rxs)',padding:'5px 12px'}}>← Alle Workouts</button>
          </div>
          ${(()=>{const hist=all.filter(w=>w.exs?.[aFilter]).map(w=>({dt:new Date(w.date).toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit'}),s:w.exs[aFilter],nt:w.nts?.[aFilter]||''}));
            const exDef=Object.values(PLANS).flatMap(p=>p.ex).find(e=>e.id===aFilter);
            if(!hist.length)return html`<div class=glass style=${{padding:16,textAlign:'center'}}><span class=mono style=${{fontSize:12,color:'var(--t4)'}}>Noch keine Daten</span></div>`;
            return hist.map((h,i)=>html`<div key=${i} class=glass style=${{padding:'12px 16px',marginBottom:8}}>
              <div style=${{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                <span class=mono style=${{fontSize:12,fontWeight:700,color:'var(--t2)'}}>${h.dt}</span>
                ${h.nt?html`<span style=${{fontSize:11,color:'var(--wrn)'}}>📝 ${h.nt}</span>`:null}
              </div>
              <div class=mono style=${{fontSize:11,color:'var(--t3)'}}>
                ${h.s.map(s=>s.rR!==undefined?'R:'+(s.rR||s.sR||0)+'×'+(s.kR||0)+' L:'+(s.rL||s.sL||0)+'×'+(s.kL||0):(s.reps||s.secs||0)+(exDef?.noKg?'':'×'+(s.kg||0)+'kg')).join(' | ')}
              </div>
            </div>`);
          })()}
        </div>`}
      </div>
      <${BottomNav} active="analytics" onNav=${navTo}/>
    </div>`}

  /* ══════════════════════════════════════════════
     HISTORY SCREEN
     ══════════════════════════════════════════════ */
  if(scr==='history'){const hist=[...all].reverse();return html`<div style=${{paddingBottom:90}}>
    <header style=${{display:'flex',alignItems:'center',gap:14,padding:'24px 20px'}}>
      <button onClick=${()=>navTo('home')} style=${{background:'none',color:'var(--t4)',padding:4}}>
        <svg width=20 height=20 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width=2><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
      </button>
      <h1 style=${{fontSize:24,fontWeight:700}}>Workout History</h1>
    </header>

    <div style=${{padding:'0 20px',display:'flex',flexDirection:'column',gap:12}}>
      ${hist.length===0?html`<div class=glass style=${{padding:20,textAlign:'center'}}><span class=mono style=${{color:'var(--t4)'}}>Noch keine Workouts</span></div>`:null}
      ${hist.map(w=>{const p=PLANS[w.day];const isDelTarget=delConfirm===w.id;return html`<div key=${w.id} class=glass style=${{padding:'16px 18px',display:'flex',alignItems:'center',gap:16,borderColor:isDelTarget?'var(--dngB)':'rgba(255,255,255,0.1)',transition:'border-color .2s'}}>
        <div style=${{width:48,height:48,background:'var(--bg2)',borderRadius:'var(--rs)',display:'flex',alignItems:'center',justifyContent:'center',color:DAY_COLORS[w.day]||'var(--acc)',flexShrink:0}}>
          ${DAY_ICONS[w.day]||''}
        </div>
        <div style=${{flex:1}}>
          <div style=${{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
            <span style=${{fontSize:17,fontWeight:700}}>${planLabel(w)||'Workout'}</span>
            <div style=${{display:'flex',alignItems:'center',gap:8}}>
              <span class=mono style=${{fontSize:10,color:'var(--t4)',letterSpacing:1}}>${new Date(w.date).toLocaleDateString('de-DE')}</span>
              <button onClick=${()=>setDelConfirm(isDelTarget?null:w.id)} style=${{background:'none',color:isDelTarget?'var(--dng)':'var(--t5)',padding:4}}>
                <svg width=16 height=16 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width=2><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          </div>
          <div style=${{marginTop:6,display:'flex',gap:16}}>
            <div style=${{display:'flex',alignItems:'center',gap:6}}>
              <svg width=12 height=12 viewBox="0 0 24 24" fill="none" stroke="var(--t4)" stroke-width=2><path d="M6 15h12"/><path d="M6 9h12"/></svg>
              <span class=mono style=${{fontSize:12,fontWeight:700,color:'var(--acc)'}}>${w.vol?.toLocaleString('de-DE')} kg</span>
            </div>
            <div style=${{display:'flex',alignItems:'center',gap:6}}>
              <svg width=12 height=12 viewBox="0 0 24 24" fill="none" stroke="var(--t4)" stroke-width=2><circle cx=12 cy=12 r=10/><polyline points="12 6 12 12 16 14"/></svg>
              <span class=mono style=${{fontSize:12,color:'var(--t3)'}}>${w.dur} Min</span>
            </div>
          </div>
          ${isDelTarget?html`<div style=${{marginTop:10,padding:'10px 0 2px',borderTop:'1px solid rgba(255,255,255,0.05)',display:'flex',alignItems:'center',gap:8}}>
            <span style=${{fontSize:13,color:'var(--dng)',flex:1}}>Dieses Workout wirklich löschen?</span>
            <button onClick=${()=>deleteWorkout(w.id)} style=${{background:'var(--dngA)',color:'var(--dng)',borderRadius:'var(--rxs)',padding:'6px 14px',fontSize:12,fontWeight:600}}>Löschen</button>
            <button onClick=${()=>setDelConfirm(null)} style=${{background:'var(--bg2)',color:'var(--t3)',borderRadius:'var(--rxs)',padding:'6px 14px',fontSize:12,fontWeight:600}}>Abbrechen</button>
          </div>`:null}
        </div>
      </div>`})}
    </div>
    <${BottomNav} active="history" onNav=${navTo}/>
  </div>`}

  /* ══════════════════════════════════════════════
     CALENDAR SCREEN
     ══════════════════════════════════════════════ */
  if(scr==='calendar'){return html`<div style=${{paddingBottom:90}}>
    <header style=${{display:'flex',alignItems:'center',gap:14,padding:'24px 20px'}}>
      <button onClick=${()=>navTo('home')} style=${{background:'none',color:'var(--t4)',padding:4}}>
        <svg width=20 height=20 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width=2><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
      </button>
      <h1 style=${{fontSize:24,fontWeight:700}}>Kalender</h1>
    </header>

    <div style=${{padding:'0 20px'}}>
      <div class=glass style=${{padding:'16px 12px'}}>
        <${Calendar} workouts=${all}/>
      </div>
    </div>
    <${BottomNav} active="calendar" onNav=${navTo}/>
  </div>`}

  /* ══════════════════════════════════════════════
     SETTINGS SCREEN
     ══════════════════════════════════════════════ */
  if(scr==='settings'){return html`<div style=${{paddingBottom:90}}>
    <header style=${{display:'flex',alignItems:'center',gap:14,padding:'24px 20px'}}>
      <button onClick=${()=>navTo('home')} style=${{background:'none',color:'var(--t4)',padding:4}}>
        <svg width=20 height=20 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width=2><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
      </button>
      <h1 style=${{fontSize:24,fontWeight:700}}>Settings</h1>
    </header>

    <div style=${{padding:'0 20px',display:'flex',flexDirection:'column',gap:28}}>
      <div>
        <div class=label style=${{marginBottom:12}}>Profile</div>
        <div class=glass style=${{padding:16,display:'flex',alignItems:'center',gap:16}}>
          <div style=${{width:64,height:64,background:'var(--accA)',border:'1px solid var(--accB)',borderRadius:'var(--r)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--acc)',fontSize:24,fontWeight:700,flexShrink:0}}>
            ${user?.email?user.email.substring(0,2).toUpperCase():'??'}
          </div>
          <div>
            <div style=${{fontSize:18,fontWeight:700}}>${user?.email?.split('@')[0]||'User'}</div>
            <div class=mono style=${{fontSize:12,color:'var(--t4)'}}>${user?.email||''}</div>
          </div>
        </div>
      </div>

      <div>
        <div class=label style=${{marginBottom:12}}>Workout Preferences</div>
        <div class=glass style=${{overflow:'hidden'}}>
          <div class=divider style=${{padding:16,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div style=${{display:'flex',alignItems:'center',gap:12}}>
              <svg width=18 height=18 viewBox="0 0 24 24" fill="none" stroke="var(--t4)" stroke-width=2><circle cx=12 cy=12 r=10/><polyline points="12 6 12 12 16 14"/></svg>
              <span style=${{fontSize:14}}>Default Rest Timer</span>
            </div>
            <span class=mono style=${{fontSize:12,color:'var(--acc)',fontWeight:700}}>90 SEC</span>
          </div>
          <div style=${{padding:16,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div style=${{display:'flex',alignItems:'center',gap:12}}>
              <svg width=18 height=18 viewBox="0 0 24 24" fill="none" stroke="var(--t4)" stroke-width=2><path d="M6 15h12"/><path d="M6 9h12"/><path d="M9 22h6"/><path d="M9 2h6"/></svg>
              <span style=${{fontSize:14}}>Unit System</span>
            </div>
            <span class=mono style=${{fontSize:12,color:'var(--t4)'}}>KILOGRAMS (KG)</span>
          </div>
        </div>
      </div>

      <div>
        <div class=label style=${{marginBottom:12}}>Appearance</div>
        <div class=glass style=${{padding:16,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style=${{display:'flex',alignItems:'center',gap:12}}>
            <div style=${{width:16,height:16,borderRadius:'50%',background:'var(--acc)',boxShadow:'0 0 10px rgba(16,185,129,0.5)'}}></div>
            <span style=${{fontSize:14}}>Accent Color</span>
          </div>
          <div style=${{display:'flex',gap:8}}>
            <div style=${{width:24,height:24,borderRadius:'50%',background:'#10B981',border:'2px solid white'}}></div>
            <div style=${{width:24,height:24,borderRadius:'50%',background:'#3B82F6'}}></div>
            <div style=${{width:24,height:24,borderRadius:'50%',background:'#F59E0B'}}></div>
          </div>
        </div>
      </div>

      <div>
        <div class=label style=${{marginBottom:12}}>App</div>
        <div style=${{display:'flex',flexDirection:'column',gap:10}}>
          <button onClick=${async()=>{try{const regs=await navigator.serviceWorker?.getRegistrations();for(const r of(regs||[]))await r.unregister();const keys=await caches.keys();for(const k of keys)await caches.delete(k)}catch(e){}location.reload(true)}} class=glass style=${{padding:16,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div style=${{display:'flex',alignItems:'center',gap:12}}>
              <svg width=18 height=18 viewBox="0 0 24 24" fill="none" stroke="var(--acc)" stroke-width=2><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
              <span style=${{fontSize:14}}>App aktualisieren</span>
            </div>
            <span class=mono style=${{fontSize:10,color:'var(--t5)'}}>Cache leeren & neu laden</span>
          </button>
        </div>
      </div>

      <div>
        <div class=label style=${{marginBottom:12}}>Data Management</div>
        <div style=${{display:'flex',flexDirection:'column',gap:10}}>
          <div class=glass style=${{padding:16,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style=${{fontSize:14}}>Export Workout Data (CSV)</span>
            <svg width=16 height=16 viewBox="0 0 24 24" fill="none" stroke="var(--t5)" stroke-width=2><polyline points="9 18 15 12 9 6"/></svg>
          </div>
          <button onClick=${()=>{if(confirm('Wirklich alle History löschen?')){}}} class=glass style=${{padding:16,textAlign:'left',borderColor:'var(--dngB)'}}>
            <span style=${{fontSize:14,color:'var(--dng)'}}>Clear All History</span>
          </button>
          <button onClick=${()=>sb.auth.signOut()} class=glass style=${{padding:16,textAlign:'center',marginTop:8}}>
            <span style=${{fontSize:14,color:'var(--dng)'}}>Logout</span>
          </button>
        </div>
      </div>
    </div>
    <${BottomNav} active="settings" onNav=${navTo}/>
  </div>`}

  return null;
}

render(html`<${App}/>`,document.getElementById('root'));
