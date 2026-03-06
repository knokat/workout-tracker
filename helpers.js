// helpers.js – Set-Factories und Volumen-Berechnung

export const eS=()=>({reps:"",kg:"",secs:"",isW:false});
export const eU=()=>({rR:"",kR:"",rL:"",kL:"",sR:"",sL:"",isW:false});
export const iSets=ex=>Array.from({length:ex.s},()=>ex.u?eU():eS());

export function calcVol(d){
  let t=0;
  Object.values(d).forEach(sets=>{
    if(!Array.isArray(sets))return;
    sets.forEach(s=>{
      if(s.isW)return;
      if(s.kg!==undefined)t+=(parseFloat(s.kg)||0)*(parseInt(s.reps)||parseInt(s.secs)||0);
      else{t+=(parseFloat(s.kR)||0)*(parseInt(s.rR)||parseInt(s.sR)||0);t+=(parseFloat(s.kL)||0)*(parseInt(s.rL)||parseInt(s.sL)||0)}
    });
  });
  return Math.round(t);
}
