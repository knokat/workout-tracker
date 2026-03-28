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

export const PLANS={1:{name:"Tag 1",label:"Lower Body",icon:"🦵",loc:"HomeGym",
wu:[
  {id:"w1",n:"90/90 Transitions",r:"10"},
  {id:"w2",n:"Hip Flexor Lunges",r:"10/S"},
  {id:"w3",n:"Deep Squats",r:"10",nt:"⚠️ knieschmerzfrei"},
  {id:"w4",n:"Cook Glute Bridge",r:"3×10",nt:"Physio – Glute-Aktivierung",sets:"3 Sets × 10 Reps"},
  {id:"w5",n:"Banded Clamshells",r:"3×12-15",nt:"Physio – schweres Band!",sets:"3 Sets × 12-15 Reps"},
  {id:"w6",n:"Patella-Dehnung links",r:"1-2×60-120s",nt:"Physio – Kniescheibe nach unten",sets:"1-2 Sets × 60-120 Sek",timer:90},
],
wuT:[
  {id:"wt1",n:"Side Plank",sec:45,nt:"Short→Full→Hip Abd., pro Seite"},
  {id:"wt2",n:"Wall Sit",sec:35,nt:"Knie-Prep, isometrisch"},
],
ex:[
  {id:"rdl",n:"❤️ RDL",s:3,rp:"10-12",tp:"2-1-1-0",rs:0,ss:1,m:"Hamstrings, Glutes",w:"Liebling!",u:0},
  {id:"banded-box-squat",n:"Banded Box Squat (LH)",s:3,rp:"10-12",tp:"2-1-1-0",rs:75,m:"Quads, Glutes, Core",w:"Langhantel + Band um Knie, auf Box",u:0},
  {id:"hip-thrust",n:"⭐ ❤️ Hip Thrust",s:3,rp:"10-12",tp:"2-1-1-0",rs:75,m:"Glutes, Hamstrings",w:"Optional – Tag 3 hat 4 Sets",u:0,opt:1},
  {id:"sb-leg-curl",n:"Swiss Ball Leg Curl",s:3,rp:"10-12",tp:"2-1-1-0",rs:75,m:"Hamstrings",w:"Anderer Winkel",u:0},
  {id:"deep-box-split-squat",n:"Deep Box Split Squat",s:5,rp:"8-10",tp:"3-1-1-0",rs:75,m:"Quads (Vastus Medialis), Glutes",w:"Physio: 4-6 Sets, innere Oberschenkel",u:1},
  {id:"banded-hip-flex",n:"Banded Standing Hip Flexion",s:2,rp:"12-15",tp:"1-1-1-0",rs:0,ss:1,m:"Hip Flexoren",w:"E3 Hip Resilience – Progression",u:1,demo:"vimeo:647978267"},
  {id:"sl-calf-raise",n:"SL Calf Raise",s:2,rp:"12-15",tp:"2-1-1-0",rs:0,ss:1,m:"Gastrocnemius",w:"Fußsohlen",u:1},
  {id:"copenhagen-plank",n:"Copenhagen Plank",s:2,rp:"—",tp:"iso",rs:60,m:"Adduktoren, Core",w:"Hüftstabilität",u:1,iso:1,iS:30}
]},
2:{name:"Tag 2",label:"Upper Body",icon:"💪",loc:"HomeGym",wu:[
  {id:"w1",n:"Shoulder Dislocates",r:"10",nt:"Band"},{id:"w2",n:"Around the Worlds",r:"10/S"},
  {id:"w3",n:"Band Pull Aparts",r:"10"},{id:"w4",n:"Forward Windmills",r:"10"},
  {id:"w5",n:"Backward Windmills",r:"10"},{id:"w6",n:"Arm Swings Crisscross",r:"10"},
  {id:"w7",n:"Banded External Rotations",r:"12-15/S"},{id:"w8",n:"Banded Face Pulls",r:"12-15"}],
ex:[
  {id:"pull-up-band",n:"❤️ Klimm. Neutral Grip",s:3,rp:"6-8",tp:"1-0-1-0",rs:0,ss:1,m:"Lats, Bizeps, Core",w:"Liebling!",u:0,band:1},
  {id:"inverted-row",n:"Inverted Row",s:3,rp:"8-10",tp:"2-1-1-0",rs:90,m:"Ob. Rücken, Bizeps",w:"Horiz. Pull",u:0,noKg:1},
  {id:"db-ohp",n:"DB Overhead Press",s:3,rp:"8-10",tp:"2-0-1-0",rs:0,ss:1,m:"Schultern, Trizeps",w:"Compound Push",u:0},
  {id:"db-lat-raise",n:"❤️ DB Lateral Raise",s:3,rp:"12-15",tp:"3-0-1-0",rs:75,m:"Seitl. Schulter",w:"Liebling!",u:0},
  {id:"db-hammer",n:"❤️ DB Hammer/Zottman",s:3,rp:"10-12",tp:"2-0-1-0",rs:0,ss:1,m:"Bizeps",w:"Liebling!",u:0},
  {id:"db-tri-ext",n:"DB Lying Tri Ext.",s:3,rp:"10-12",tp:"2-0-1-0",rs:60,m:"Trizeps",w:"Ausgleich Bizeps",u:0},
  {id:"serratus-raise",n:"Serratus Front Raise",s:2,rp:"12-15/S",tp:"2-0-1-0",rs:0,ss:1,m:"Serratus Anterior",w:"Schulterblatt",u:0},
  {id:"bar-hang",n:"Bar Hang",s:2,rp:"—",tp:"—",rs:60,m:"Unterarme, Lats",w:"Grip",u:0,iso:1,iS:25}
]},
3:{name:"Tag 3",label:"Full Body",icon:"🏋️",loc:"Gym (FitInn)",wu:[
  {id:"w1",n:"90/90 Transitions",r:"10",nt:"HG IR/AR"},
  {id:"w2",n:"Hip Flexor Lunges",r:"10/S"},
  {id:"w3",n:"Shoulder Dislocates",r:"10",nt:"Flex. Bar"},
  {id:"w4",n:"Band Pull Aparts",r:"10"},
  {id:"w5",n:"Banded Ext. Rotations",r:"12-15/S",nt:"Theraband, Ellbogen an Hüfte"},
  {id:"w6",n:"Scapular Pull-Ups",r:"8-10",nt:"MULTI 7"},
  {id:"w7",n:"Cook Glute Bridge",r:"3×10",nt:"Physio – Glute-Aktivierung",sets:"3 Sets × 10 Reps"},
  {id:"w8",n:"Banded Clamshells",r:"3×12-15",nt:"Physio – schweres Band!",sets:"3 Sets × 12-15 Reps"},
  {id:"w9",n:"Patella-Dehnung links",r:"1-2×60-120s",nt:"Physio – Kniescheibe nach unten",sets:"1-2 Sets × 60-120 Sek",timer:90}],
ex:[
  {id:"hip-thrust",n:"❤️ Hip Thrust",s:4,rp:"10-12",tp:"2-1-1-0",rs:75,m:"Glutes, Hamstrings",w:"Liebling! Priorität #1",u:0,g:"GESÄSS 3F 🏷️"},
  {id:"pull-up-mach",n:"❤️ Klimmzug-Progr.",s:3,rp:"6-8",tp:"1-0-1-0",rs:90,m:"Lats, Bizeps, Core",w:"Liebling!",u:0,ast:1,g:"MULTI 7"},
  {id:"rdl",n:"⭐ ❤️ RDL (LH)",s:3,rp:"10-12",tp:"2-1-1-0",rs:75,m:"Hamstrings, Glutes",w:"1x/Wo reicht, Tag 1 hat RDL",u:0,opt:1,g:"Half Rack 🏷️"},
  {id:"chest-press",n:"Chest Press",s:3,rp:"10-12",tp:"2-0-1-0",rs:75,m:"Brust, Schulter, Tri",w:"Push-Ausgleich",u:0,g:"BRUST 2A"},
  {id:"cable-row",n:"Cable Row",s:3,rp:"8-10",tp:"3-0-1-2",rs:75,m:"Ob. Rücken, Lats",w:"Horiz. Pull",u:0,g:"RÜCKEN 1D 🏷️",h:"Grip: Wo1 Pronated→Wo2 Neutral→Wo3 Supinated"},
  {id:"cable-hip-abd",n:"Cable Hip Abduction",s:5,rp:"12-15",tp:"1-1-1-0",rs:0,ss:1,m:"Glute Med/Min",w:"Physio: 4-6 Sets!",u:1,g:"MULTI 1 🏷️"},
  {id:"cable-hip-add",n:"Cable Hip Adduction",s:5,rp:"12-15",tp:"1-1-1-0",rs:30,m:"Adduktoren",w:"Physio: 4-6 Sets!",u:1,g:"MULTI 1 🏷️",demo:"vimeo:832809720"},
  {id:"sl-calf-raise",n:"SL Calf Raise",s:2,rp:"12-15",tp:"2-1-1-0",rs:30,m:"Gastrocnemius",w:"2. Einheit/Wo",u:1,g:"BEINE 4D"},
  {id:"cable-bicep",n:"❤️ Cable Biceps Curl",s:3,rp:"10-12",tp:"2-1-1-0",rs:0,ss:1,m:"Bizeps",w:"Liebling!",u:1,g:"MULTI 1 🏷️"},
  {id:"cable-tri",n:"Cable Tri Pushdown",s:3,rp:"10-12",tp:"2-1-1-0",rs:60,m:"Trizeps",w:"Ausgleich",u:0,g:"MULTI 1 🏷️"},
  {id:"mach-lat-raise",n:"❤️ Lateral Raise",s:2,rp:"12-15",tp:"2-0-1-0",rs:30,m:"Seitl. Schulter",w:"Liebling!",u:0,g:"SCHULTERN 3"},
  {id:"sl-leg-ext",n:"SL Leg Extension",s:2,rp:"10-12",tp:"3-1-1-0",rs:30,m:"Quads, Patella",w:"Knie-Rehab! Physio: am Ende!",u:1,g:"BEINE 1A 🏷️"}
]}};

// Legacy ID mapping: old positional IDs → new stable IDs
// Used to look up historical data saved with old IDs
export const LEGACY_ID_MAP={
  // Tag 1 old IDs (pre-stable)
  '1:e1':'rdl','1:e2':'hip-thrust','1:e3':'bw-squat','1:e4':'sb-leg-curl',
  '1:e5':'tempo-split-squat','1:e6':'standing-hip-flex','1:e7':'sl-calf-raise','1:e8':'copenhagen-plank',
  // Tag 2 old IDs
  '2:e1':'pull-up-band','2:e2':'inverted-row','2:e3':'db-ohp','2:e4':'db-lat-raise',
  '2:e5':'db-hammer','2:e6':'db-tri-ext','2:e7':'serratus-raise','2:e8':'bar-hang',
  // Tag 3 old IDs (pre-reorder)
  '3:e1':'pull-up-mach','3:e2':'chest-press','3:e3':'cable-row','3:e4':'hip-thrust',
  '3:e5':'rdl','3:e6':'cable-bicep','3:e7':'cable-tri','3:e8':'sl-leg-ext',
  '3:e9':'cable-hip-abd','3:e10':'cable-hip-add','3:e11':'sl-calf-raise','3:e12':'mach-lat-raise'
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
