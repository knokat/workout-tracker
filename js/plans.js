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
  {id:"w1",n:"Hip Hurdles",r:"10"},{id:"w2",n:"90/90 Transitions",r:"10"},
  {id:"w3",n:"90/90 Hip Extension",r:"10/S"},{id:"w4",n:"Seated Straight Leg Raises",r:"10/S"},
  {id:"w5",n:"Hip Flexor Lunges",r:"10/S"},
  {id:"w6",n:"Deep Lateral Lunges",r:"10/S",nt:"⚠️ knieschmerzfrei"},
  {id:"w7",n:"Deep Squats",r:"10",nt:"⚠️ knieschmerzfrei"},
  {id:"w9",n:"Banded Lat./Crab Walks",r:"10-12/S",nt:"Band Knie→Knöchel"},
],
wuT:[
  {id:"wt1",n:"Side Plank",sec:45,nt:"Short→Full→Hip Abd., pro Seite"},
  {id:"wt2",n:"Wall Sit",sec:35,nt:"Knie-Prep, isometrisch"},
],
ex:[
  {id:"e1",n:"❤️ RDL",s:3,rp:"10-12",tp:"2-1-1-0",rs:0,ss:1,m:"Hamstrings, Glutes",w:"Liebling!",u:0},
  {id:"e2",n:"❤️ Hip Thrust",s:3,rp:"10-12",tp:"2-1-1-0",rs:75,m:"Glutes, Hamstrings",w:"Liebling!",u:0},
  {id:"e3",n:"BW Squat Full ROM",s:3,rp:"10-15",tp:"2-1-1-0",rs:0,ss:1,m:"Quads, Glutes, Core",w:"Alltagsziel! Assistance ok",u:0},
  {id:"e4",n:"Swiss Ball Leg Curl",s:3,rp:"10-12",tp:"2-1-1-0",rs:75,m:"Hamstrings",w:"Anderer Winkel",u:0},
  {id:"e5",n:"⭐ Tempo Split Squat",s:3,rp:"8-10",tp:"3-1-1-0",rs:75,m:"Quads, Glutes",w:"Wenn Squat 3×15 ok",u:1,opt:1},
  {id:"e6",n:"Standing Hip Flexion",s:2,rp:"12-15",tp:"1-1-1-0",rs:0,ss:1,m:"Hip Flexoren",w:"E3 Hip Resilience",u:1},
  {id:"e7",n:"SL Calf Raise",s:2,rp:"12-15",tp:"2-1-1-0",rs:0,ss:1,m:"Gastrocnemius",w:"Fußsohlen",u:1},
  {id:"e8",n:"Copenhagen Plank",s:2,rp:"—",tp:"iso",rs:60,m:"Adduktoren, Core",w:"Hüftstabilität",u:1,iso:1,iS:30}
]},
2:{name:"Tag 2",label:"Upper Body",icon:"💪",loc:"HomeGym",wu:[
  {id:"w1",n:"Shoulder Dislocates",r:"10",nt:"Band"},{id:"w2",n:"Around the Worlds",r:"10/S"},
  {id:"w3",n:"Band Pull Aparts",r:"10"},{id:"w4",n:"Forward Windmills",r:"10"},
  {id:"w5",n:"Backward Windmills",r:"10"},{id:"w6",n:"Arm Swings Crisscross",r:"10"},
  {id:"w7",n:"Banded External Rotations",r:"12-15/S"},{id:"w8",n:"Banded Face Pulls",r:"12-15"}],
ex:[
  {id:"e1",n:"❤️ Klimm. Neutral Grip",s:3,rp:"6-8",tp:"1-0-1-0",rs:0,ss:1,m:"Lats, Bizeps, Core",w:"Liebling!",u:0,band:1},
  {id:"e2",n:"Inverted Row",s:3,rp:"8-10",tp:"2-1-1-0",rs:90,m:"Ob. Rücken, Bizeps",w:"Horiz. Pull",u:0,noKg:1},
  {id:"e3",n:"DB Overhead Press",s:3,rp:"8-10",tp:"2-0-1-0",rs:0,ss:1,m:"Schultern, Trizeps",w:"Compound Push",u:0},
  {id:"e4",n:"❤️ DB Lateral Raise",s:3,rp:"12-15",tp:"3-0-1-0",rs:75,m:"Seitl. Schulter",w:"Liebling!",u:0},
  {id:"e5",n:"❤️ DB Hammer/Zottman",s:3,rp:"10-12",tp:"2-0-1-0",rs:0,ss:1,m:"Bizeps",w:"Liebling!",u:0},
  {id:"e6",n:"DB Lying Tri Ext.",s:3,rp:"10-12",tp:"2-0-1-0",rs:60,m:"Trizeps",w:"Ausgleich Bizeps",u:0},
  {id:"e7",n:"Serratus Front Raise",s:2,rp:"12-15/S",tp:"2-0-1-0",rs:0,ss:1,m:"Serratus Anterior",w:"Schulterblatt",u:0},
  {id:"e8",n:"Bar Hang",s:2,rp:"—",tp:"—",rs:60,m:"Unterarme, Lats",w:"Grip",u:0,iso:1,iS:25}
]},
3:{name:"Tag 3",label:"Full Body",icon:"🏋️",loc:"Gym (FitInn)",wu:[
  {id:"w1",n:"Cook Glute Bridge",r:"3×10",nt:"Physio – Glute-Aktivierung"},
  {id:"w2",n:"Banded Clamshells",r:"3×12-15",nt:"Physio – schweres Band!"},
  {id:"w3",n:"Patella-Dehnung links",r:"1-2×60-120s",nt:"Physio – Kniescheibe nach unten"},
  {id:"w4",n:"90/90 Transitions",r:"10",nt:"HG IR/AR"},
  {id:"w5",n:"Hip Flexor Lunges",r:"10/S"},
  {id:"w6",n:"Shoulder Dislocates",r:"10",nt:"Flex. Bar"},
  {id:"w7",n:"Band Pull Aparts",r:"10"},
  {id:"w8",n:"Banded Ext. Rotations",r:"12-15/S",nt:"Theraband, Ellbogen an Hüfte"},
  {id:"w9",n:"Scapular Pull-Ups",r:"8-10",nt:"MULTI 7"}],
ex:[
  {id:"e1",n:"❤️ Hip Thrust",s:4,rp:"10-12",tp:"2-1-1-0",rs:75,m:"Glutes, Hamstrings",w:"Liebling! Priorität #1",u:0,g:"GESÄSS 3F 🏷️"},
  {id:"e2",n:"❤️ Klimmzug-Progr.",s:3,rp:"6-8",tp:"1-0-1-0",rs:90,m:"Lats, Bizeps, Core",w:"Liebling!",u:0,ast:1,g:"MULTI 7"},
  {id:"e3",n:"⭐ ❤️ RDL (LH)",s:3,rp:"10-12",tp:"2-1-1-0",rs:75,m:"Hamstrings, Glutes",w:"1x/Wo reicht, Tag 1 hat RDL",u:0,opt:1,g:"Half Rack 🏷️"},
  {id:"e4",n:"Chest Press",s:3,rp:"10-12",tp:"2-0-1-0",rs:75,m:"Brust, Schulter, Tri",w:"Push-Ausgleich",u:0,g:"BRUST 2A"},
  {id:"e5",n:"Cable Row",s:3,rp:"8-10",tp:"3-0-1-2",rs:75,m:"Ob. Rücken, Lats",w:"Horiz. Pull",u:0,g:"RÜCKEN 1D 🏷️",h:"Grip: Wo1 Pronated→Wo2 Neutral→Wo3 Supinated"},
  {id:"e6",n:"Cable Hip Abduction",s:5,rp:"12-15",tp:"1-1-1-0",rs:0,ss:1,m:"Glute Med/Min",w:"Physio: 4-6 Sets!",u:1,g:"MULTI 1 🏷️"},
  {id:"e7",n:"Cable Hip Adduction",s:5,rp:"12-15",tp:"1-1-1-0",rs:30,m:"Adduktoren",w:"Physio: 4-6 Sets!",u:1,g:"MULTI 1 🏷️",demo:"vimeo:832809720"},
  {id:"e8",n:"Calf Raise",s:2,rp:"12-15",tp:"2-1-1-0",rs:30,m:"Gastrocnemius",w:"2. Einheit/Wo",u:0,g:"BEINE 4D"},
  {id:"e9",n:"❤️ Cable Biceps Curl",s:3,rp:"10-12",tp:"2-1-1-0",rs:0,ss:1,m:"Bizeps",w:"Liebling!",u:1,g:"MULTI 1 🏷️"},
  {id:"e10",n:"Cable Tri Pushdown",s:3,rp:"10-12",tp:"2-1-1-0",rs:60,m:"Trizeps",w:"Ausgleich",u:0,g:"MULTI 1 🏷️"},
  {id:"e11",n:"❤️ Lateral Raise",s:2,rp:"12-15",tp:"2-0-1-0",rs:30,m:"Seitl. Schulter",w:"Liebling!",u:0,g:"SCHULTERN 3"},
  {id:"e12",n:"SL Leg Extension",s:2,rp:"10-12",tp:"3-1-1-0",rs:30,m:"Quads, Patella",w:"Knie-Rehab! Physio: am Ende!",u:1,g:"BEINE 1A 🏷️"}
]}};

export const COMPS=[{n:"Kühe",e:"🐄",k:700},{n:"Pferde",e:"🐴",k:500},{n:"Katzen",e:"🐱",k:4.5},{n:"Pinguine",e:"🐧",k:30},{n:"Hühner",e:"🐔",k:2.5},{n:"Goldhamster",e:"🐹",k:.03},{n:"VW Golfs",e:"🚗",k:1400},{n:"Fahrräder",e:"🚲",k:12},{n:"E-Scooter",e:"🛴",k:14},{n:"Döner",e:"🥙",k:.35},{n:"Pizzen",e:"🍕",k:.8},{n:"Schnitzel",e:"🥩",k:.25},{n:"Maß Bier",e:"🍺",k:2.3},{n:"Waschmaschinen",e:"🫧",k:70},{n:"Goldbarren",e:"🥇",k:12.4},{n:"Einhörner",e:"🦄",k:450},{n:"Bowlingkugeln",e:"🎳",k:6.3},{n:"Bernhardiner",e:"🐕",k:80}];

export const rndC=(kg,n=5)=>[...COMPS].sort(()=>Math.random()-.5).slice(0,n).map(c=>({...c,a:(kg/c.k).toFixed(c.k<1?0:1)}));
