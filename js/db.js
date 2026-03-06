// db.js – Supabase Client und alle Datenbank-Funktionen

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { PLANS } from './plans.js';

export const sb = createClient('https://zkqfeqtnoxgoepmykupd.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprcWZlcXRub3hnb2VwbXlrdXBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzMDU3NzcsImV4cCI6MjA4Nzg4MTc3N30.Uz4VTfFd76SNiP8HxOr_NFl-O1GuTPMNpQ9cZXig89E');

export async function dbLoad(uid){
  const{data:ws}=await sb.from('workouts').select('*').eq('user_id',uid).order('date',{ascending:true});
  const out=[];for(const w of(ws||[])){
    const{data:els}=await sb.from('exercise_logs').select('*').eq('workout_id',w.id);
    const exs={},nts={};for(const el of(els||[])){
      const{data:sl}=await sb.from('set_logs').select('*').eq('exercise_log_id',el.id).order('set_number');
      exs[el.exercise_id]=(sl||[]).map(s=>s.is_unilateral?{rR:s.reps_r||"",kR:String(s.kg_r||""),rL:s.reps_l||"",kL:String(s.kg_l||""),sR:s.secs_r||"",sL:s.secs_l||"",isW:s.is_warmup}:{reps:s.reps||"",kg:String(s.kg||""),secs:s.secs||"",isW:s.is_warmup,mvKg:s.moved_kg||0});
      if(el.note)nts[el.exercise_id]=el.note;}
    out.push({id:w.id,day:w.day,date:w.date,vol:Number(w.volume),dur:w.duration,exs,nts});}return out;}

export async function dbSave(uid,day,exD,nts,astD,vol,dur){
  const{data:w,error}=await sb.from('workouts').insert({user_id:uid,day,volume:vol,duration:dur}).select().single();
  if(error){console.error(error);return null;}
  for(const[eid,sets]of Object.entries(exD)){
    if(!Array.isArray(sets)||!sets.length)continue;
    const{data:el}=await sb.from('exercise_logs').insert({workout_id:w.id,exercise_id:eid,note:nts[eid]||''}).select().single();
    if(!el)continue;const pl=Object.values(PLANS).flatMap(p=>p.ex).find(e=>e.id===eid);
    const rows=sets.map((s,i)=>{
      const ad=pl?.ast&&astD[eid]?astD[eid]:{};const bnd=pl?.band&&astD[eid]?astD[eid]:{};
      const bw=parseFloat(ad.bw||bnd.bw||0),as=parseFloat(ad.as||0),bk=parseFloat(bnd.bandKg||0);
      const moved=pl?.ast?Math.max(0,bw-as):pl?.band?Math.max(0,bw-bk):0;
      return{exercise_log_id:el.id,set_number:i+1,is_warmup:!!s.isW,is_unilateral:!!pl?.u,
        reps:parseInt(s.reps)||0,kg:parseFloat(s.kg)||0,secs:parseInt(s.secs)||0,
        reps_r:parseInt(s.rR)||0,kg_r:parseFloat(s.kR)||0,secs_r:parseInt(s.sR)||0,
        reps_l:parseInt(s.rL)||0,kg_l:parseFloat(s.kL)||0,secs_l:parseInt(s.sL)||0,
        bodyweight:bw,assistance:as||bk,moved_kg:moved};});
    await sb.from('set_logs').insert(rows);}return w;}

export async function dbSvAct(uid,day,d,n,a,o,st){
  const p={user_id:uid,day,data:{d,n,a,o,st},saved_at:new Date().toISOString()};
  const{data:ex}=await sb.from('active_workouts').select('id').eq('user_id',uid).maybeSingle();
  if(ex)await sb.from('active_workouts').update(p).eq('user_id',uid);else await sb.from('active_workouts').insert(p);}

export async function dbLdAct(uid){const{data}=await sb.from('active_workouts').select('*').eq('user_id',uid).maybeSingle();return data}

export async function dbDlAct(uid){await sb.from('active_workouts').delete().eq('user_id',uid)}
