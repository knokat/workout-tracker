// plans.js – Trainingsplan-Daten, Bänder, Fun-Vergleiche

export const BANDS=[
  {id:"none",label:"Kein Band",color:"#666",lbs:"0",kg:0},
  {id:"gelb",label:"🟡 Gelb (5-15 lbs)",color:"#f0d000",lbs:"5-15",kg:4.5},
  {id:"rot",label:"🔴 Rot (15-35 lbs)",color:"#e03030",lbs:"15-35",kg:11},
  {id:"schwarz",label:"⚫ Schwarz (30-60 lbs)",color:"#333",lbs:"30-60",kg:20},
  {id:"lila",label:"🟣 Lila (40-80 lbs)",color:"#8040c0",lbs:"40-80",kg:27},
  {id:"blau",label:"🔵 Blau (80-170 lbs)",color:"#2060c0",lbs:"80-170",kg:57},
  {id:"gruen",label:"🟢 Grün (50-125 lbs)",color:"#30a030",lbs:"50-125",kg:40},
];

// Plan version cutoff: workouts before this date used a different plan structure
// Used to show correct labels and compare only within same plan version
export const PLAN_V2_DATE='2026-04-01'; // v2 starts April 2026
export const PLAN_V4_DATE='2026-04-14'; // v4 starts 14 April 2026
export const PLAN_V5_DATE='2026-04-24'; // v5 starts 24 April 2026 – Schulter-Upgrade + Neg. Klimmzüge
export const PLAN_V6_DATE='2026-04-27'; // v6 starts 27 April 2026 – Figure-Level Schultern, TRX Leg Curl, Hammer Curls, Adduction→Warmup
export const PLAN_V7_DATE='2026-05-12'; // v7 starts 12 May 2026 – Physio & Lower-Body Fokus, OB Maintenance
export const PLAN_VERSION='v7';
export const PLAN_V1_LABELS={1:"Lower Body",2:"Upper Body",3:"Full Body"};
export const PLAN_V2_LABELS={1:"Hinge + Pull",2:"Squat + Push",3:"Heavy Compounds"};
export const PLAN_V6_LABELS={1:"Hinge + Pull",2:"Squat + Push",3:"Heavy Compounds + Shoulders"};
export const PLAN_V7_LABELS={1:"H1: SL RDL + Abduction",2:"H2: Split Squat + Hip Thrust + SLDL",3:"G3: LH Squat + SL Ext"};

export const PLANS={1:{name:"Tag 1",label:"H1: SL RDL + Abduction",icon:"🦵",loc:"HomeGym",
wu:[
  {id:"w1",n:"90/90 Transitions",r:"10"},
  {id:"w2",n:"Hip Flexor Lunges",r:"10/S"},
  {id:"w3",n:"HG IR/AR Übung",r:"3×10/Seite",nt:"Physio – Box sitzen, Loop-Band Knöchel, Faszienrolle zw. Knie, Fuß nach außen",sets:"3 Sets × 10 Reps/Seite"},
  {id:"w4",n:"Cook Glute Bridge",r:"3×10",nt:"Physio – Glute-Aktivierung",sets:"3 Sets × 10 Reps"},
  {id:"w5",n:"Patella-Dehnung links",r:"1-2×60-120s",nt:"Physio – Kniescheibe nach unten",sets:"1-2 Sets × 60-120 Sek",timer:90},
  {id:"w6",n:"Cable Hip Adduction",r:"1×12-15",nt:"Leicht, Aktivierung"},
  {id:"w7",n:"Scapular Pull-Ups",r:"10"},
],
ex:[
  {id:"sl-rdl",n:"SL RDL",s:3,rp:"5",tp:"2-1-1-0",rs:0,ss:1,m:"Glutes, Hüftstabilität",w:"Physio. Bei linkem Standbein etwas nach rechts eindrehen. Superset mit DB Pullovers",u:1},
  {id:"db-pullover",n:"DB Pullovers",s:3,rp:"10-12",tp:"2-1-1-0",rs:75,m:"Lats, Brust, Serratus",w:"Halten. DB über Flachbank",u:0},
  {id:"cable-hip-abd",n:"Cable Abduction",s:5,rp:"12-15",tp:"1-1-1-0",rs:0,ss:1,m:"Glute Med/Min",w:"Physio: Kapazität. Hüfte aufrichten, Ferse zuerst, eher Schlittschuh. Set 1-3 SS mit OHP, Set 4-5 solo",u:1},
  {id:"db-ohp",n:"Seated LH OHP",s:3,rp:"8-10",tp:"2-0-1-0",rs:75,m:"Schultern, Trizeps",w:"Halten. SS mit Abduction Set 1-3",u:0},
  {id:"neg-pull-up",n:"Negative Klimmzüge (Neutral Grip)",s:3,rp:"3-5",tp:"0-0-5-0",rs:90,m:"Lats, Bizeps, Core",w:"Steigern – langsam runterlassen (5s exzentrisch)",u:0,noKg:1},
]},
2:{name:"Tag 2",label:"H2: Split Squat + Hip Thrust + SLDL",icon:"💪",loc:"HomeGym",wu:[
  {id:"w1",n:"90/90 Transitions",r:"10"},
  {id:"w2",n:"Hip Flexor Lunges",r:"10/S"},
  {id:"w3",n:"Banded Clamshells",r:"3×10/S",nt:"Physio – schweres Band!",sets:"3 Sets × 10 Reps/Seite"},
  {id:"w4",n:"Cook Glute Bridge",r:"3×10",nt:"Physio – Glute-Aktivierung",sets:"3 Sets × 10 Reps"},
  {id:"w5",n:"Patella-Dehnung links",r:"1-2×60-120s",nt:"Physio – Kniescheibe nach unten",sets:"1-2 Sets × 60-120 Sek",timer:90},
  {id:"w6",n:"Shoulder Dislocates",r:"10",nt:"Band"}],
ex:[
  {id:"split-squat",n:"Split Squat (Quad-Bias)",s:6,rp:"8-10",tp:"2-1-1-0",rs:0,ss:1,m:"Quads (Vastus Medialis), Glutes",w:"Physio. Set 1–3 SS mit Face Pull, Set 4–6 solo",u:1,h:"① Hinterer Fuß breiter nach außen (nicht in line)\n② Oberkörper aufrecht\n③ Vorderes Knie nach außen drücken (anti-Valgus)\n④ Heel Elevation vorne bei Bedarf\n⑤ Schmerzfreies Fenster respektieren (Goldilocks)"},
  {id:"face-pull",n:"Face Pull",s:3,rp:"12-15",tp:"2-0-1-2",rs:60,m:"Hinterer+Seitl. Delt",w:"Halten (Rear Delts). SS mit Split Squat Set 1-3",u:0},
  {id:"sl-hip-thrust",n:"SL Hip Thrust",s:3,rp:"10-12",tp:"2-1-1-0",rs:0,ss:1,m:"Glutes",w:"Physio. LH im Rack. Superset mit Tri Pushdown",u:1},
  {id:"cable-tri",n:"Cable Tri Pushdown",s:3,rp:"10-12",tp:"2-1-1-0",rs:60,m:"Trizeps",w:"Halten. SS mit SL Hip Thrust",u:0},
  {id:"rdl",n:"❤️ Stiff-Leg Deadlift (LH)",s:3,rp:"6-8",tp:"2-1-1-0",rs:0,ss:1,m:"Hamstrings, Glutes",w:"Hamstrings, schwer. Superset mit Hammer Curls",u:0},
  {id:"bicep-curl",n:"❤️ Hammer Curls",s:3,rp:"12",tp:"2-1-1-0",rs:60,m:"Bizeps, Brachialis",w:"Halten. Brachialis + Brachioradialis. Neutral Grip (Daumen oben)",u:0},
]},
3:{name:"Tag 3",label:"G3: LH Squat + SL Ext",icon:"🏋️",loc:"Gym (FitInn)",wu:[
  {id:"w1",n:"90/90 Transitions",r:"10"},
  {id:"w2",n:"Hip Flexor Lunges",r:"10/S"},
  {id:"w3",n:"HG IR/AR Übung",r:"3×10/Seite",nt:"Physio",sets:"3 Sets × 10 Reps/Seite"},
  {id:"w4",n:"Banded Clamshells",r:"3×10/S",nt:"Physio – schweres Band!",sets:"3 Sets × 10 Reps/Seite"},
  {id:"w5",n:"Patella-Dehnung links",r:"1-2×60-120s",nt:"Physio – Kniescheibe nach unten",sets:"1-2 Sets × 60-120 Sek",timer:90},
  {id:"w6",n:"Banded External Rotations",r:"12-15/S"},
  {id:"w7",n:"Cable Hip Adduction",r:"1×12-15",nt:"Leicht, Aktivierung"},
  {id:"w8",n:"Scapular Pull-Ups",r:"10",nt:"MULTI 7"}],
ex:[
  {id:"banded-barbell-back-squat",n:"LH Squat (Banded, Box)",s:4,rp:"10-12",tp:"2-1-1-0",rs:90,m:"Quads, Glutes, Core",w:"Physio. Langhantel + Band um Knie, auf Box. Heel Elevation",u:0,g:"MULTI 5",h:"Langer Femur: Heel Elevation, breiterer Stand"},
  {id:"pull-up-mach",n:"❤️ Klimmzug-Progr.",s:4,rp:"6-8",tp:"1-0-1-0",rs:90,m:"Lats, Bizeps, Core",w:"Steigern. Maschine-Assisted",u:0,ast:1,g:"MULTI 7"},
  {id:"sl-leg-ext",n:"SL Leg Extension",s:3,rp:"10-12",tp:"3-1-1-0",rs:30,m:"Quads, Patella",w:"Physio: Knie-Rehab",u:1,g:"BEINE 1A 🏷️"},
  {id:"rdl",n:"⭐ ❤️ Stiff-Leg Deadlift (LH)",s:3,rp:"6-8",tp:"2-1-1-0",rs:75,m:"Hamstrings, Glutes",w:"Optional – Hamstrings, schwer",u:0,opt:1,g:"GEWICHTE"},
  {id:"hip-thrust",n:"⭐ ❤️ Barbell Hip Thrust",s:3,rp:"10-12",tp:"2-1-1-0",rs:75,m:"Glutes, Hamstrings",w:"Optional – Beidbeinig, schwer",u:0,opt:1,g:"GESÄSS 3F 🏷️"},
  {id:"machine-lat-raise",n:"Machine Lateral Raise",s:3,rp:"12-15",tp:"2-0-1-0",rs:60,m:"Seitl. Schulter",w:"Halten. Side Delts – Schultern deprimiert halten, bis knapp über parallel",u:0,g:"SCHULTERN 3 🏷️",h:"① Sitz so einstellen, dass Schultern mit Drehachse der Maschine aligned sind\n② Körper aufrecht/leicht zurück, NICHT nach vorne lehnen\n③ Bis knapp über parallel heben, Pause oben optional\n④ Langsam runter – Side Delts aktiv die ganze Zeit\n⑤ Schultern UNTEN halten (nicht shrugging → sonst Traps)\n⑥ Drop Sets möglich (Selectorized)"},
]}};

// Legacy ID mapping: old positional IDs → new stable IDs
// Used to look up historical data saved with old IDs
export const LEGACY_ID_MAP={
  // Tag 1 old IDs (pre-stable)
  '1:e1':'rdl','1:e2':'hip-thrust','1:e3':'bw-squat','1:e4':'sb-leg-curl',
  '1:e5':'tempo-split-squat','1:e6':'standing-hip-flex','1:e7':'sl-calf-raise','1:e8':'copenhagen-plank',
  // Tag 1 v5→v6 renames
  '1:sb-leg-curl':'trx-leg-curl',
  '1:db-lat-raise':'cross-body-lat-raise',
  // Tag 2 v3→v4 renames
  '2:banded-box-squat':'banded-barbell-back-squat',
  '2:db-lat-raise':'cable-lat-raise-bb-t2',
  '2:e1':'pull-up-band','2:e2':'inverted-row','2:e3':'db-ohp','2:e4':'db-lat-raise',
  '2:e5':'db-hammer','2:e6':'db-tri-ext','2:e7':'serratus-raise','2:e8':'bar-hang',
  // Tag 3 old IDs (pre-reorder)
  '3:e1':'pull-up-mach','3:e2':'chest-press','3:e3':'cable-row','3:e4':'hip-thrust',
  '3:e5':'rdl','3:e6':'cable-bicep','3:e7':'cable-tri','3:e8':'sl-leg-ext',
  '3:e9':'cable-hip-abd','3:e10':'cable-hip-add','3:e11':'sl-calf-raise','3:e12':'mach-lat-raise',
  // v7: exercises moved between days (IDs stay stable, no mapping needed)
  // db-ohp: renamed from "Seated DB OHP" to "Seated LH OHP" (same ID, progression continuity)
  // db-pullover: new exercise (no legacy data)
};

export const COMPS=[{n:"Kühe",e:"🐄",k:700},{n:"Pferde",e:"🐴",k:500},{n:"Katzen",e:"🐱",k:4.5},{n:"Pinguine",e:"🐧",k:30},{n:"Hühner",e:"🐔",k:2.5},{n:"Goldhamster",e:"🐹",k:.03},{n:"VW Golfs",e:"🚗",k:1400},{n:"Fahrräder",e:"🚲",k:12},{n:"E-Scooter",e:"🛴",k:14},{n:"Döner",e:"🥙",k:.35},{n:"Pizzen",e:"🍕",k:.8},{n:"Schnitzel",e:"🥩",k:.25},{n:"Maß Bier",e:"🍺",k:2.3},{n:"Waschmaschinen",e:"🫧",k:70},{n:"Goldbarren",e:"🥇",k:12.4},{n:"Einhörner",e:"🦄",k:450},{n:"Bowlingkugeln",e:"🎳",k:6.3},{n:"Bernhardiner",e:"🐕",k:80}];

export const rndC=(kg)=>{
  // Pick 4-6 random items, find combination that sums to exact volume
  const n=4+Math.floor(Math.random()*3); // 4, 5 or 6 items
  const shuffled=[...COMPS].sort(()=>Math.random()-.5);
  const picked=shuffled.slice(0,n).sort((a,b)=>b.k-a.k); // heaviest first
  const result=[];
  let remaining=kg;
  for(let i=0;i<picked.length;i++){
    const item=picked[i];
    if(i===picked.length-1){
      // Last item: use whatever is left (even fractional)
      const amt=remaining/item.k;
      if(amt>=0.1)result.push({...item,a:amt<10?amt.toFixed(1):Math.round(amt)});
      else if(remaining>0)result.push({...item,a:amt.toFixed(1)});
    } else {
      // Take random portion: 1 to max that fits, leave enough for remaining items
      const maxFit=Math.floor(remaining/item.k);
      if(maxFit<1){result.push({...item,a:0});continue}
      // Take 1 to maxFit, but leave at least a little for remaining items
      const minLeave=picked.slice(i+1).reduce((s,p)=>s+p.k*0.1,0);
      const maxTake=Math.max(1,Math.min(maxFit,Math.floor((remaining-minLeave)/item.k)));
      const take=Math.max(1,Math.ceil(Math.random()*maxTake));
      result.push({...item,a:take});
      remaining-=take*item.k;
      if(remaining<=0)break;
    }
  }
  // Filter out zeros, compute actual total
  const filtered=result.filter(r=>r.a>0&&parseFloat(r.a)>0);
  const total=filtered.reduce((s,r)=>s+parseFloat(r.a)*r.k,0);
  return{items:filtered,total:Math.round(total)};
};
