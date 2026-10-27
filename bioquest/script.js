/* ---------- helpers ---------- */
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
let lastFocus=null;
function openModal(html){lastFocus=document.activeElement;$('#mbox').innerHTML=html+'<p><button class="btn alt" data-close>Close</button></p>';$('#modal').hidden=false;$('#mbox').querySelector('button').focus()}
function closeModal(){$('#modal').hidden=true;lastFocus&&lastFocus.focus()}
$('#modal').addEventListener('click',e=>{if(e.target.id==='modal'||e.target.closest('[data-close]'))closeModal()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#modal').hidden)closeModal()});

/* ---------- tabs & persistent navigation ---------- */
function showTab(t){
  ['home','game','map'].forEach(id=>$('#'+id).hidden=id!==t);
  $$('.tab').forEach(b=>{
    if(b.dataset.tab===t){
      b.setAttribute('aria-current','page');
    } else {
      b.removeAttribute('aria-current');
    }
  });

  // Toggle persistent navigation header visibility
  const pNav = $('#persistent-nav');
  if (pNav) {
    pNav.hidden = (t === 'home');
  }

  window.scrollTo(0,0);
}

document.addEventListener('click',e=>{
  const b=e.target.closest('[data-tab]');
  if(b) showTab(b.dataset.tab);
});

/* Smooth scroll for Get Started button */
const startBtn = $('#start');
if (startBtn) {
  startBtn.onclick=()=>{
    const homeScreen = $('#home-screen');
    if (homeScreen) {
      homeScreen.scrollIntoView({behavior:'smooth'});
    }
  };
}

showTab('home');

/* ================= GAME ================= */
const TRAITS=['Innovation / Curiosity','Decision-Making','Teamwork / Problem-Solving','Communication / Ethics','Patience / Research'];
const MAJORS=[
 ['Biotechnology, Molecular Biology, Biochemistry'],
 ['Bioengineering, Biostatistics, Data Science'],
 ['Biomedical Engineering, Public Health, Business of Science'],
 ['Regulatory Science, Bioethics, Science Communication'],
 ['Chemistry, Microbiology, Medical Laboratory Science']];

const R=s=>{const p=s.split('|');return{n:p[0],d:p[1],k:p[2],e:p[3],t:[+p[4][0],+p[4][1]]}};
const Q=(q,...a)=>({q,a});

const SECT=[
{n:'Pharma / Healthcare',th:'th-pharma',m:'Dr. Lena Ruiz',c:'#38bdf8',ic:['dna','flask'],
 d:'Our cleanroom team turns discoveries into safe, effective medicines and treatments, from first molecule to patient.',
 path:'Intern or lab associate, then scientist or specialist, then senior scientist or manager, then director.',
 prog:['Rutgers Ernest Mario School of Pharmacy (PharmD)','RAPS Regulatory Affairs Certification (RAC)','Biotechnology and clinical research certificates at NJ colleges'],
 roles:['Medicinal Chemist|Designs and improves drug molecules.|Organic chemistry, analysis|B.S. or Ph.D. in chemistry|04','Pharmacologist|Tests how drugs act in the body.|Assay design, dose-response|Ph.D. in pharmacology|40','Clinical Research Associate|Monitors trial sites for quality and safety.|Monitoring, GCP rules|B.S. in a life science|43','Clinical Trial Manager|Leads studies on time and on budget.|Planning, leadership|B.S. plus PMP or M.S.|12','Regulatory Affairs Specialist|Guides products through FDA approval.|Technical writing, regulations|B.S. plus RAC certificate|34','Pharmacovigilance Scientist|Tracks drug safety after launch.|Data review, medical writing|PharmD or B.S./M.S.|41','Biostatistician|Analyzes clinical trial data.|Statistics, R/SAS|M.S. in biostatistics|14','Process Development Scientist|Scales recipes into manufacturing.|Bioprocess, optimization|B.S./M.S. in chemical engineering|01','Quality Assurance Specialist|Keeps manufacturing GMP-compliant.|Auditing, documentation|B.S. in a life science|43','Formulation Scientist|Turns drugs into tablets and injections.|Chemistry, stability testing|B.S./Ph.D. in pharmaceutical science|04','Medical Science Liaison|Explains new science to physicians.|Presenting, clinical knowledge|PharmD or Ph.D.|32','Pharmacist|Dispenses medicine and counsels patients.|Pharmacology, counseling|PharmD|34','Bioinformatics Scientist|Mines genomic data for drug targets.|Python, genomics|B.S./M.S. in bioinformatics|10','Biomedical Engineer|Builds devices and delivery systems.|Design, prototyping|B.S. in biomedical engineering|02','Genetic Counselor|Guides patients through genetic results.|Empathy, genetics|M.S. in genetic counseling|34','Medical Writer|Writes clinical and regulatory documents.|Writing, scientific accuracy|B.S./M.S. in life science|34'].map(R),
 qs:[]},
{n:'Agricultural & Environmental',th:'th-agri',m:'Ms. Hana Green',c:'#15803d',ic:['leaf','drop'],
 d:'Step into our hydroponics greenhouse, where biotechnology helps crops grow stronger, safer and more sustainably.',
 path:'Lab or field technician, then crop or plant scientist, then project lead, then research director or consultant.',
 prog:['Rutgers School of Environmental and Biological Sciences (plant and food science)','Rutgers Cooperative Extension programs','Controlled-environment agriculture certificates'],
 roles:['Agricultural Biotechnologist|Engineers crops for resilience.|Genomics, lab methods|M.S. or Ph.D. in plant biotechnology|04','Crop Scientist|Runs field trials to improve yield.|Agronomy, statistics|B.S./M.S. in crop science|41','Soil Scientist|Studies soil health and nutrients.|Sampling, chemistry|B.S. in soil science|40','Hydroponics Specialist|Optimizes soil-free growing systems.|Nutrient control, automation|B.S. in horticulture|02','Plant Pathologist|Diagnoses and prevents crop disease.|Microscopy, diagnostics|M.S./Ph.D. in plant pathology|41','Agricultural Engineer|Designs irrigation and farm machinery.|Engineering, sensors|B.S. in agricultural engineering|02','Food Scientist|Develops safe, nutritious foods.|Chemistry, sensory testing|B.S. in food science|01','Entomologist|Studies pests and helpful insects.|Identification, ecology|B.S./M.S. in entomology|40','Tissue Culture Technician|Grows plants from cells in sterile labs.|Sterile technique, media prep|A.S./B.S. in biology|42','Agronomist|Advises growers on crops and soil.|Field analysis, communication|B.S. in agronomy|23','Precision Ag Analyst|Uses drones and data to guide farms.|GIS, data science|B.S. in ag plus data skills|10','Seed Technologist|Tests seed quality and purity.|Lab testing, standards|B.S. in plant science|41','Biosafety Officer|Keeps crop biotech safe and compliant.|Regulations, ethics|B.S./M.S. plus policy training|31','Extension Educator|Teaches growers new practices.|Teaching, outreach|M.S. in agriculture|32','Sustainable Farm Manager|Runs operations with eco-friendly methods.|Leadership, budgeting|B.S. in agriculture or business|12','Plant Breeder|Selects and crosses plants for better traits.|Genetics, patience|M.S./Ph.D. in plant breeding|40'].map(R),
 qs:[]},
{n:'Regulatory Science',th:'th-env',m:'Dr. Sam Okafor',c:'#0f766e',ic:['globe','bars'],
 d:'Ensure compliance, ethics, safety standards, and global approvals across biotech products.',
 path:'Regulatory Associate, then Regulatory Affairs Specialist, then Regulatory Manager, then Director of Regulatory Affairs.',
 prog:['RAPS Regulatory Affairs Certification (RAC)','Rutgers Bioethics and Regulatory Certificate','NJIT Healthcare Regulations Course'],
 roles:['Regulatory Affairs Specialist|Guides products through FDA approval.|Technical writing, regulations|B.S. plus RAC certificate|34','Quality Assurance Specialist|Keeps manufacturing GMP-compliant.|Auditing, documentation|B.S. in a life science|43','Biosafety Officer|Keeps biotech safe and compliant.|Regulations, ethics|B.S./M.S. plus policy training|31','Compliance Officer|Makes sure projects follow regulations.|Regulations, auditing|B.S. in environmental science|31','Medical Writer|Writes clinical and regulatory documents.|Writing, scientific accuracy|B.S./M.S. in life science|34','Biostatistician|Analyzes trial data for compliance.|Statistics, SAS/R|M.S. in biostatistics|14'].map(R),
 qs:[]},
{n:'Detection',th:'th-detect',m:'Dr. Jun Park',c:'#6d28d9',ic:['bars','dna'],
 d:'Our high-throughput bio-analytics lab reads DNA, proteins and signals to detect disease, pathogens and evidence.',
 path:'Lab technician or analyst, then scientist or specialist, then senior scientist or lab manager, then director.',
 prog:['Rutgers and NJIT biomedical engineering and biochemistry programs','Medical laboratory science programs with ASCP certification','Bioinformatics certificate programs'],
 roles:['Molecular Diagnostics Scientist|Develops DNA and RNA tests.|PCR, assay design|B.S./M.S. in molecular biology|04','Forensic DNA Analyst|Analyzes DNA evidence for cases.|PCR, chain of custody|B.S. in forensic science|43','Clinical Lab Scientist|Runs patient lab tests.|Instruments, accuracy|B.S. in medical laboratory science|41','Assay Development Scientist|Builds new detection assays.|Immunoassays, validation|M.S. in biochemistry|01','Sequencing Specialist|Runs genome sequencers.|NGS, library prep|B.S. in genetics|42','Bioinformatics Analyst|Interprets sequence data.|Python, statistics|B.S./M.S. in bioinformatics|14','Biosensor Engineer|Designs devices that detect biomarkers.|Electronics, biochemistry|B.S./M.S. in biomedical engineering|02','Mass Spectrometry Specialist|Identifies molecules by mass.|Instrument tuning, analysis|B.S./Ph.D. in analytical chemistry|40','Quality Control Analyst|Verifies test quality and consistency.|SOPs, documentation|B.S. in chemistry or biology|43','Public Health Lab Scientist|Detects outbreaks and pathogens.|Microbiology, surveillance|M.S. in public health or microbiology|42','Flow Cytometry Specialist|Analyzes cells by their markers.|Cell analysis, software|B.S. in biology or immunology|41','Lab Automation Engineer|Builds robotics for high-throughput screening.|Robotics, coding|B.S. in engineering|10','Pathogen Detection Specialist|Tests food and water for pathogens.|Culturing, PCR|B.S. in microbiology|41','Diagnostics Product Manager|Guides tests from idea to market.|Strategy, communication|B.S. plus MBA|13','Cytogenetic Technologist|Examines chromosomes under the microscope.|Microscopy, patience|B.S. in genetics|42','Toxicology Analyst|Detects drugs and toxins in samples.|Chromatography, validation|B.S. in chemistry|41'].map(R),
 qs:[]},
{n:'Marine',th:'th-marine',m:'Capt. Maria Reyes',c:'#0369a1',ic:['fish','drop'],
 d:'Dive into our deep-sea aquaculture facility, where ocean organisms inspire new medicines, foods and conservation tools.',
 path:'Research or aquaculture technician, then marine scientist, then project lead, then program director.',
 prog:['Rutgers Institute of Marine and Coastal Sciences','Stockton University marine science','Scientific diving training'],
 roles:['Marine Biologist|Studies ocean life and ecosystems.|Fieldwork, species ID|B.S./M.S. in marine biology|40','Marine Natural Products Chemist|Finds medicines in sea organisms.|Chromatography, NMR|Ph.D. in chemistry|04','Aquaculture Technician|Raises fish and shellfish sustainably.|Water chemistry, husbandry|A.S./B.S. in aquaculture|42','Fisheries Scientist|Assesses fish populations.|Statistics, sampling|M.S. in fisheries science|41','Oceanographer|Studies currents and ocean chemistry.|Instruments, modeling|B.S./Ph.D. in oceanography|04','Marine Microbiologist|Studies microbes of the sea.|Sequencing, culturing|Ph.D. in microbiology|40','Coral Restoration Specialist|Grows and restores reefs.|Diving, propagation|B.S. in marine science|20','Marine Biotechnologist|Applies marine organisms to products.|Genetics, bioprocess|M.S. in marine biotechnology|01','Ocean Engineer|Operates underwater robots (ROVs).|Robotics, navigation|B.S. in ocean engineering|12','Shellfish Health Specialist|Monitors oyster and clam disease.|Histology, diagnostics|M.S. in aquatic health|41','Marine Policy Analyst|Shapes ocean conservation rules.|Policy, writing|M.S. in marine policy|31','Marine Mammal Scientist|Studies whales and dolphins.|Observation, data analysis|M.S./Ph.D. in marine mammal science|40','Marine Data Scientist|Analyzes ocean sensor data.|Python, statistics|B.S./M.S. in data science|10','Seafood Safety Inspector|Checks seafood for contaminants.|Testing, regulations|B.S. in food or marine science|43','Ocean Educator|Teaches the public about the sea.|Teaching, outreach|B.S. plus education training|32','Algal Biotechnologist|Grows algae for foods and fuels.|Cultivation, biochemistry|M.S. in biotechnology|01'].map(R),
 qs:[]}
];

const IC={dna:'M8 2c0 9 16 11 16 28M24 2c0 9-16 11-16 28M10 9h12M10 23h12',flask:'M12 3h8M14 3v10L5 28h22L18 13V3M9 22h14',leaf:'M4 28C4 12 14 4 28 4c0 14-8 24-24 24zM4 28 18 14',drop:'M16 3C10 12 7 16 7 20a9 9 0 0 0 18 0c0-4-3-8-9-17z',fish:'M3 16c6-9 15-9 20 0-5 9-14 9-20 0zM23 16l6-6v12z',bars:'M5 28V14M12 28V6M19 28V18M26 28V10',globe:'M16 4a12 12 0 1 0 0 24 12 12 0 0 0 0-24zM4 16h24M16 4c-6 8-6 16 0 24M16 4c6 8 6 16 0 24'};
const icon=(k,cls='fl',st='')=>`<svg class="${cls}" style="${st}" viewBox="0 0 32 32" aria-hidden="true"><path d="${IC[k]}"/></svg>`;
const decor=s=>`<div class="decor" aria-hidden="true">${Array.from({length:8},(_,i)=>icon(s.ic[i%2],'fl',`left:${(i*13+4)%92}%;top:${(i*29+8)%78}%;animation-duration:${6+i%4}s;animation-delay:-${i*1.3}s`)).join('')}</div>`;

const spr = (src, l) => `<img class="spr sprite-placeholder" src="${src}" alt="${l}" draggable="false">`;

const NATALIE     = spr('assets/sprites/director.png', 'Natalie, facility director');
const PLAYER      = spr('assets/sprites/character-placeholder.svg', 'You');
const MANAGER     = spr('assets/sprites/manager.png', 'Manager');

const say = (sp, who, txt, extra = '') => `<div class="scene">${sp}<div class="bubble glass"><b>${who}</b><p>${txt}</p>${extra}</div></div>`;

const G={sec:0,team:[],tr:[0,0,0,0,0],sourceTraitScores:{},q:0,res:{}};
const stage=$('#stage');
let raf=0;
function draw(theme,html,sec){
  cancelAnimationFrame(raf);
  stage.className='stage '+theme;
  stage.innerHTML=(sec?decor(sec):'')+html;
  const f=stage.querySelector('button');f&&f.focus({preventScroll:true});
}

/* ---- 1. facility entry ---- */
const K={},NPC={x:57,y:66},P={x:12,y:88,f:1};
function entry(){
  P.x=12;P.y=88;
  const wins=[0,1,2,3,4,5,6,7].map(i=>[92,132].map(y=>`<rect x="${48+i*42}" y="${y}" width="28" height="26" fill="#bae6fd" stroke="#334155" stroke-width="2"/>`).join('')).join('')+[0,1,2,5,6,7].map(i=>`<rect x="${48+i*42}" y="172" width="28" height="26" fill="#bae6fd" stroke="#334155" stroke-width="2"/>`).join('');
  draw('th-entry',`
  <div class="dpad"><button class="btn alt" data-g="hub">Skip walking</button><span class="note">Use the arrow keys or WASD to walk to the entrance, or use the buttons:</span>
   ${[['ArrowLeft','◀'],['ArrowUp','▲'],['ArrowDown','▼'],['ArrowRight','▶']].map(([k,s])=>`<button class="btn alt" data-pad="${k}" aria-label="Move ${k.slice(5).toLowerCase()}">${s}</button>`).join('')}</div>
  <div class="world" id="world" style="margin-top:.7rem">
   <div class="bldg"><svg viewBox="0 0 400 250" role="img" aria-label="Bioquest Labs facility"><rect x="30" y="50" width="340" height="200" rx="6" fill="#f8fafc" stroke="#0f172a" stroke-width="3"/><rect x="30" y="50" width="340" height="28" fill="#0f172a"/><text x="200" y="70" text-anchor="middle" font-family="Cinzel Decorative,serif" font-size="16" font-weight="700" fill="#fff">BIOQUEST LABS</text>${wins}<rect x="172" y="190" width="56" height="60" fill="#38bdf8" stroke="#0f172a" stroke-width="3"/><path d="M200 190v60" stroke="#0f172a" stroke-width="2"/><rect x="60" y="20" width="14" height="30" fill="#94a3b8" stroke="#0f172a" stroke-width="2"/></svg></div>
   <div class="ground"></div>
   <div class="npc" style="left:${NPC.x}%;top:${NPC.y}%">${NATALIE}</div>
   <div class="glass hint" id="hint">Walk up to Natalie at the entrance.</div>
   <div class="glass say" id="say" hidden><b>Natalie, Director</b><p>Welcome to Bioquest Labs! I run this facility. We have five research sectors, from cleanrooms to deep-sea tanks, and I will help you find where you fit. Ready to come inside?</p><button class="btn" data-g="hub" id="playbtn">Play</button> <span class="note">or press Enter</span></div>
   <div class="pl" id="pl" style="left:${P.x}%;top:${P.y}%">${PLAYER}</div></div>`);
  let t0=performance.now(),near=false;
  const loop=t=>{
    const pl=$('#pl');if(!pl)return;
    const dt=Math.min(.05,(t-t0)/1000);t0=t;
    const dx=(K.ArrowRight||K.d?1:0)-(K.ArrowLeft||K.a?1:0),dy=(K.ArrowDown||K.s?1:0)-(K.ArrowUp||K.w?1:0);
    if(!$('#game').hidden&&(dx||dy)){
      P.x=Math.max(4,Math.min(96,P.x+dx*30*dt));P.y=Math.max(66,Math.min(96,P.y+dy*22*dt));
      if(dx)P.f=dx;pl.style.left=P.x+'%';pl.style.top=P.y+'%';
    }
    pl.classList.toggle('walk',!!(dx||dy));pl.firstChild.style.transform=`scaleX(${P.f})`;
    const n=Math.abs(P.x-NPC.x)<15&&Math.abs(P.y-NPC.y)<12;
    if(n!==near){near=n;$('#say').hidden=!n;$('#hint').hidden=n;if(n)$('#playbtn').focus({preventScroll:true})}
    raf=requestAnimationFrame(loop);
  };
  raf=requestAnimationFrame(loop);
}
const gameKey=e=>$('#game').hidden||(!$('#pl')&&!$('#campus-player'))||!$('#modal').hidden;
document.addEventListener('keydown',e=>{
  if(gameKey(e))return;const k=e.key.length===1?e.key.toLowerCase():e.key;
  if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','w','a','s','d'].includes(k)){K[k]=1;e.preventDefault()}
  else if((k==='e'||k==='Enter')&&$('#campus-player')&&G.nearCampus>=0){enterCampus(G.nearCampus);return} else if(k==='Enter'&&$('#say')&&!$('#say').hidden&&e.target.tagName!=='BUTTON')hub();
});
document.addEventListener('keyup',e=>{const k=e.key.length===1?e.key.toLowerCase():e.key;delete K[k]});
stage.addEventListener('pointerdown',e=>{const b=e.target.closest('[data-pad]');if(b)K[b.dataset.pad]=1});
['pointerup','pointerleave','pointercancel'].forEach(ev=>stage.addEventListener(ev,e=>{const b=e.target.closest&&e.target.closest('[data-pad]');if(b)delete K[b.dataset.pad]},true));

/* ---- 2. walkable top-down research campus ---- */
let campusRAF=0,campusLast=0;const CP={x:50,y:81,speed:24};

function hub(){
  cancelAnimationFrame(campusRAF);
  draw('th-hub',`<div class="hud"><h3>Bioquest Research Campus</h3><span class="count">WASD / ARROWS · E TO ENTER</span></div>
  <p>Explore the campus. Walk to a building and press E to enter its separate Team Builder and quiz screens.</p>
  <div class="campus-hud"><span id="campus-msg" aria-live="polite">Explore the campus and approach a research building.</span><button class="btn alt" data-g="entry">Return to entrance</button></div>
  <div class="campus" id="campus" tabindex="0" aria-label="Fixed walkable campus. Use arrow keys or WASD, then E to enter a nearby building.">
    ${SECT.map((s,i)=>`<button class="campus-building" data-campus="${i}" data-room="${i}" aria-label="Approach ${s.n} building">${s.n}</button>`).join('')}
    <div class="campus-player" id="campus-player" style="left:${CP.x}%;top:${CP.y}%"><img src="assets/sprites/character-placeholder.svg" alt="Player character placeholder"></div>
  </div>
  <div class="dpad" aria-label="Movement controls">${[['ArrowLeft','◀'],['ArrowUp','▲'],['ArrowDown','▼'],['ArrowRight','▶']].map(([k,v])=>`<button class="btn alt" data-campus-pad="${k}" aria-label="Walk ${k.slice(5).toLowerCase()}">${v}</button>`).join('')}<button class="btn" data-campus-enter>Enter nearby building</button></div>`);
  
  CP.x=50;CP.y=61;campusLast=performance.now();
  const canvas=$('#campus'),player=$('#campus-player');
  
  // Coordinates corresponding to SECT array order: 
  // [0: Pharma, 1: Agri, 2: Regulatory, 3: Detection, 4: Marine]
  const hotspots=[
    {x:19,y:29}, // 0: Pharma / Healthcare
    {x:81,y:28}, // 1: Agricultural & Environmental
    {x:26,y:55}, // 2: Regulatory Science
    {x:80,y:56}, // 3: Detection (Middle Right)
    {x:59,y:80}  // 4: Marine (Bottom Right)
  ];
  
  const updateNear=()=>{
    let near=-1,best=1e9;
    hotspots.forEach((p,i)=>{const px=canvas.clientWidth*CP.x/100,py=canvas.clientHeight*CP.y/100,d=Math.hypot(px-canvas.clientWidth*p.x/100,py-canvas.clientHeight*p.y/100);if(d<best){best=d;near=i}});
    G.nearCampus=best<Math.min(canvas.clientWidth,canvas.clientHeight)*.105?near:-1;
    $('#campus-msg').textContent=G.nearCampus>=0?`Nearby: ${SECT[G.nearCampus].n} — press E to enter.`:'Walk toward a highlighted building.';
    canvas.querySelectorAll('[data-campus]').forEach(b=>b.classList.toggle('near',+b.dataset.campus===G.nearCampus));
  };
  const loop=t=>{
    if(!$('#campus-player'))return;
    const dt=Math.min(.04,(t-campusLast)/1000);campusLast=t;
    const dx=(K.ArrowRight||K.d?1:0)-(K.ArrowLeft||K.a?1:0),dy=(K.ArrowDown||K.s?1:0)-(K.ArrowUp||K.w?1:0);
    if(dx||dy){const norm=(dx&&dy)?Math.SQRT1_2:1;CP.x=Math.max(3,Math.min(97,CP.x+dx*CP.speed*dt*norm));CP.y=Math.max(4,Math.min(96,CP.y+dy*CP.speed*dt*norm));player.style.left=CP.x+'%';player.style.top=CP.y+'%';player.classList.add('walking');player.style.transform=`translate(-50%,-50%) scaleX(${dx<0?-1:1})`}
    else player.classList.remove('walking');
    updateNear();campusRAF=requestAnimationFrame(loop);
  };
  canvas.focus({preventScroll:true});campusRAF=requestAnimationFrame(loop);
}

function enterCampus(i){cancelAnimationFrame(campusRAF);G.sec=i;G.team=[];G.tr=[0,0,0,0,0];G.sourceTraitScores={};G.q=0;team()}

/* ---- 3. team selection ---- */
function team(){
  const s=SECT[G.sec],n=G.team.length;
  draw(s.th,`<div class="hud"><h3>Build Your Team: ${s.n}</h3><span class="count" id="cnt">YOUR TEAM: ${n}/6</span></div>
  <p>Select a role to read about it, then add it to your team.</p>
  <div class="roles">${s.roles.map((r,i)=>`<button class="role ${G.team.includes(i)?'in':''}" data-role="${i}" aria-pressed="${G.team.includes(i)}">${r.n}</button>`).join('')}</div>
  <button class="btn" data-g="quiz" ${n<6?'disabled':''}>Continue to scenarios</button> <button class="btn alt" data-g="hub">Back to facility</button>`,s);
}
function roleModal(i){
  const r=SECT[G.sec].roles[i],has=G.team.includes(i);
  openModal(`<h3>${r.n}</h3><p>${r.d}</p><p><b>Key skills:</b> ${r.k}</p><p><b>Education:</b> ${r.e}</p><button class="btn" data-toggle="${i}" ${!has&&G.team.length>=6?'disabled':''}>${has?'Remove from team':'Add to Team'}</button>`);
}

const QUIZ_AREAS = [
  {
    name: 'Pharma, Med, and Drug',
    scenarios: [
      {
        title: 'R&D finance',
        dialogue: '"We have been struggling to find investors for our product. We reached out to many investors, and venture capitalists. Although we already have a few, we do not have enough funding to continue in our product development." "The company officials informed us that their satisfactory requirements have tightened, and it needs to be worth investing in the long-run. We tried so many times, what should we do?"',
        answers: [
          ['Re-enter the lab, and collect stronger data in order to prove to investors through numbers its long-term efficacy', 'Scientific Curiosity', 'Precision'],
          ['We need to rethink what we have, sharpen our ideas, take a look at our pitch deck and make the model targeted to these corporate partners.', 'Strategic Thinking', 'Communication'],
          ['Decide to scratch your teams whole idea and start again', 'Innovation', 'Risk Taking'],
          ['Bring the research, business, and development team into one big meeting together and find a solution that addresses many concerns', 'Collaboration', 'Risk Taking']
        ]
      },
      {
        title: 'Testing',
        dialogue: `"Your startup has been testing a potential drug. Your team has collected weeks of data, however something doesn\'t add up: the drug works extremely well in one group of cells but barely works in the other". Quality Control Analyst: "We didn\'t expect this, we know our numbers are right, but we don\'t know what\'s causing this"`,
        answers: [
          ['Run another set of experiments to see if the same pattern happens again', 'Precision', 'Scientific Curiosity'],
          ['Go back to the results and scope for a pattern that would explain why the response are different', 'Analytical Thinking', 'Scientific Curiosity'],
          ['Take a step back, analyse whether this difference could be something useful about who the drug might be best for.', 'Impact Orientation', 'Clinical Thinking'],
          ['Closely investigate the two groups of cells for differences', 'Scientific Curiosity', 'Analytical Thinking']
        ]
      },
      {
        title: 'Manufacturing: inconsistency in batches',
        dialogue: `"We have been preparing for large-scale production. We have made so many batches of drugs but something's wrong: when we were storing the batches, we realized that the cell competency lost 55% of its viability!"`,
        answers: [
          ['Repeat stability tests under controlled storage conditions to confirm the 55% viability loss and document when it begins', 'Precision', 'Scientific Curiosity'],
          ['Investigate the storage conditions and biological mechanisms that may be causing the loss of viability', 'Scientific Curiosity', 'Analytical Thinking'],
          ['Redesign the formulation or storage process, then test whether the change improves viability', 'Innovation', 'Precision'],
          ['Bring quality control, manufacturing, and research together to identify the cause before scaling production', 'Collaboration', 'Analytical Thinking']
        ]
      },
      {
        title: 'FDA approval',
        dialogue: '"A product you and your team have been working on developing for the past few months finally makes it to the stage of getting FDA approval. The reviewers request additional documentation before making an official decision."',
        answers: [
          ['Review the request line by line and prepare a complete, well-organized response using the existing evidence', 'Precision', 'Analytical Thinking'],
          ['Run additional studies to address the evidence gaps identified by the reviewers', 'Scientific Curiosity', 'Precision'],
          ['Meet with the regulatory team to clarify the request and coordinate a response across departments', 'Communication', 'Collaboration'],
          ['Reassess the submission timeline and prioritize the missing documentation that is most important to the decision', 'Strategic Thinking', 'Impact Orientation']
        ]
      }
    ]
  },
  {
    name: 'Agricultural and Environmental',
    scenarios: [
      {
        title: 'Scenario #1: Drought-resistant corn',
        dialogue: 'We are trying to genetically engineer a corn line so it is drought-resistant. It turns out that the plant is able to grow under dry weather, but it produces 35% less seeds than expected because something malfunctioned with the edited gene.',
        answers: [
          ['Consider whether the trade-off could be useful in other environmental conditions and re-shape the purpose of the product', 'Impact Orientation', 'Innovation'],
          ['Redesign the experiment and test a different version of the genetic modification', 'Innovation', 'Scientific Curiosity'],
          ['Analyze the growth data to determine when the plants began performing differently to make connections', 'Analytical Thinking', 'Precision'],
          ['Closely examine what happened to the edited gene and determine why it affected seed production', 'Scientific Curiosity', 'Analytical Thinking']
        ]
      },
      {
        title: 'Scenario 2: Biofertilizer storage',
        dialogue: 'To help the drought-resilient corn to grow under these conditions, the team has developed a biofertilizer that can help absorb the soil. While we were trying to store the product, we learned it loses 65% of its viability when it is left for 30 days. How will we be able to prepare for large-scale production?',
        answers: [
          ['Monitor and Track storage temperature, moisture, and time metrics to find the exact point where the biofertilizer starts to degrade rapidly', 'Precision', 'Analytical Thinking'],
          ['Work with the supply chain logistics team to move the product quickly from production facility to farms', 'Impact Orientation', 'Innovation'],
          ['Redesign the formula or delivery systems so the biofertilizer stays stable in storing for longer periods of time', 'Innovation', 'Precision'],
          ['Investigate the chemical breakdown process in the lab to identify why the components derided after 30 days and what could be prevented', 'Scientific Curiosity', 'Analytical Thinking']
        ]
      },
      {
        title: 'Regulatory Block',
        dialogue: 'Midway through the regulation process, the agency changed their standards for gene-edited traits, demanding that our product needs stronger research to back up our idea.',
        answers: [
          ['Collect more evidence to proof long-term safety through analysing biological mechanisms', 'Scientific Curiosity', 'Precision'],
          ['Review the new regulatory criteria, comparing it to our dataset to identify any gaps', 'Precision', 'Analytical Thinking'],
          ['Outline new field trials to gather more evidence as needed for approval', 'Analytical Thinking', 'Impact Orientation'],
          ['Use the existing evidence into alternative regulatory frameworks or change the focus towards different markets with existing approvals', 'Impact Orientation', 'Innovation']
        ]
      },
      {
        title: 'Marketing',
        dialogue: 'Our drought-resistant corn is now ready to go into the market, but because production costs were so high, the seeds are priced 15% higher than the average hybrid crop. Thus, farmers are reluctant to buy the product.',
        answers: [
          ['Fix the manufacturing pipeline and see where we can cut costs per unit and lower the wholesale seed price', 'Precision', 'Innovation'],
          ['Calculate the long-term saving during drought years to demonstrate the return on investment (ROI) to farmers and hopefully convince them to buy the product', 'Analytical Thinking', 'Impact Orientation'],
          ['Survey farmers to understand their economic concerts and compare this behavior across regions to tailor our product back to their wants and needs', 'Scientific Curiosity', 'Precision'],
          ['Partner with insurance providers or create a money-back guarantee model tied to severe climate change effects', 'Innovation', 'Impact Orientation']
        ]
      },
      {
        title: 'Consumer brand backlash / sales',
        dialogue: 'We received results from our surveys from the people, and most farmers and consumers responded that they did not feel comfortable purchasing or consuming the product because it was genetically engineered.',
        answers: [
          ['Survey demographics and data to target specific regions or groups most open to biotechnology to focus marketing efforts on them', 'Analytical Thinking', 'Precision'],
          ['Launch a transparent campaign explaining the science and safety testing behind the gene editing to alleviate any concerns', 'Precision', 'Scientific Curiosity'],
          ['To build trust, host Q&A sessions and interactive workshops to hear concerns from the communities directly', 'Scientific Curiosity', 'Impact Orientation'],
          ['Re-evaluate the product strategy to focus on non-food applications', 'Impact Orientation', 'Innovation']
        ]
      }
    ]
  },
  {
    name: 'Regulatory',
    scenarios: [
      {
        title: 'R&D: Selecting target training database',
        dialogue: 'The team wants to develop an AI monitoring platform that tracks gene-edited organisms in environmental and industrial settings to ensure they align with global regulatory standards. Before writing the code for the AI platform, we need to define what it needs to look for? Project Manager: How do we select our target training database?',
        answers: [
          ['Build a more advanced AI model that predicts many possible artificial gene edits, even if that takes extra years so code', 'Scientific Curiosity', 'Innovation'],
          ['Stick strictly to official government databases that list known high-risk pathogens and GMOs to ensure legal alignment', 'Precision', 'Analytical Thinking'],
          ['Use an open-source DNA library to build a working prototype and launch the software onto the market faster', 'Impact Orientation', 'Innovation'],
          ['Partner with universities and organizations to create a free, crowdsourced genetic database open to all researchers', 'Innovation', 'Scientific Curiosity']
        ]
      },
      {
        title: 'Scenario 2: False alerts in field tests',
        dialogue: 'During early field tests around the lab, the model misinterprets harmless soil bacteria that is naturally occurring as an invasive gene-edited crop, triggering a false alert and panic system. How can we fix the system?',
        answers: [
          ['Rewrite the core algorithm using another DNA verification filter to eliminate this problem', 'Innovation', 'Analytical Thinking'],
          ['Add a mandatory manual review step where a human biosafety officer must verify alerts before notifying authorities', 'Precision', 'Impact Orientation'],
          ['Lower the sensitivity setting so the software only flags exact matches, avoiding costly false alarms', 'Impact Orientation', 'Precision'],
          ['Look into the genomic data of the bacteria in the soil to identify specific base pairs causing this', 'Analytical Thinking', 'Scientific Curiosity']
        ]
      },
      {
        title: 'Scenario 3: DNA privacy vs inspection',
        dialogue: 'Biotech companies voice that if they use our platform demand that their valuable DNA sequences must be encrypted. However, government inspectors say they would need full visibility into their DNA feeds to verify safety.',
        answers: [
          ['Make a secure, high-clearance workflow where only third-party inspectors can view decrypted data', 'Analytical Thinking', 'Precision'],
          ['Host a roundtable between tech executives and regulators to draft a data privacy standard', 'Impact Orientation', 'Scientific Curiosity'],
          ['Implement cryptographic proofs so regulators can verify compliance without viewing the raw sequence data', 'Innovation', 'Precision'],
          ['Design a standard, anonymized data summary that satisfies regulatory requirements while hiding proprietary code', 'Precision', 'Analytical Thinking']
        ]
      },
      {
        title: 'Scenario 4: Different regulatory classifications',
        dialogue: 'European regulators claim our product as a heavy-duty "biosecurity device" requiring 3 more years of testing before anyone can use it. US regulators treat it as an software "Data Analytics tool" and it can be put into the market. Market person: We really want to prioritize market expansion, what can we do?',
        answers: [
          ['Create two distinct softwares, one biosecurity version for Europe and an analytics version for the US', 'Innovation', 'Analytical Thinking'],
          ['Work directly with European regulators to change testing protocols and get approval through targeted safety data', 'Precision', 'Scientific Curiosity'],
          ['Conduct a detailed regulatory impact assessment to evaluable long-term brand positioning and legal risks across both markets if we release the product now or wait.', 'Analytical Thinking', 'Precision'],
          ['Launch immediately into the US to quickly gain revenue and feedback while running European trials at the same time', 'Impact Orientation', 'Innovation']
        ]
      },
      {
        title: 'Scenario 5: Pricing for smaller labs',
        dialogue: 'Smaller university labs and startups complain that the subscription fees are too expensive, but bigger companies can afford the software. How can we handle pricing?',
        answers: [
          ['Analyze user usage data across tier sizes to make a flexible plan where they pay per scan, so they don\'t have to buy a full subscription', 'Analytical Thinking', 'Precision'],
          ['Partner with agencies for grants to subsidize software licenses', 'Scientific Curiosity', 'Impact Orientation'],
          ['Introduce a tiered pricing model that offers free tools to academic labs while charging higher prices for more advanced features', 'Impact Orientation', 'Innovation'],
          ['Reduce the amount of features and introduce software packages to tailor to smaller labs and project', 'Innovation', 'Precision']
        ]
      }
    ]
  },
  {
    name: 'Detection',
    scenarios: [
      {
        title: 'Scenario 1: Sequencer accuracy in blood samples',
        dialogue: 'Manager: We will engineer a portable DNA sequencer to identify unknown bacterial pathogens in clinical samples efficiently and in a timely manner. It turned out that while the sequencing chemistry works well on pure bacterial cultures, the instrument misidentifies sequences 35% of the time when processing complex human blood samples. Bioinformatic: What do we do?',
        answers: [
          ['Fix and correct the lab sample extraction protocols to clean and isolate the bacterial DNA before it enters the channel', 'Precision', 'Analytical Thinking'],
          ['Investigate the chemical binding behavior in the blood components to understand why the reading accuracy is lower than expected', 'Scientific Curiosity', 'Innovation'],
          ['Train a new bioinformatics model to filter out human DNA contamination before analyzing the bacterial sequences', 'Innovation', 'Precision'],
          ['Examine the error logs to pinpoint which genomic regions are most misidentified in blood matches', 'Analytical Thinking', 'Scientific Curiosity']
        ]
      },
      {
        title: 'Scenario 2: Silicon chip supply setback',
        dialogue: 'In our sequencer it needs specialized sensors and our factory relied on pure, high-grade silicon chips. While scaling up, our primary supplier experienced a major production setback, resulting in a 58% supply drop. How will we be able to prepare for large-scale production',
        answers: [
          ['Run more precise stress tests on lower-grade chips to identity which quality standard we need for reliable performance', 'Analytical Thinking', 'Precision'],
          ['Negotiate priority contracts with different global foundries and adjust assembly timelines to match supply rates', 'Impact Orientation', 'Precision'],
          ['Research alternate semiconductor materials to see if it can replace our silicon sensors', 'Scientific Curiosity', 'Innovation'],
          ['Redesign the sensor so it can use widely available, standard grade silicon to cut costs without sacrificing performance.', 'Innovation', 'Impact Orientation']
        ]
      },
      {
        title: 'Scenario 3: Rare mutation accuracy standards',
        dialogue: 'Midway through the process, the regulatory agency updated its standards for sequencing platforms, demanding that our instrument needs to have a higher accuracy rate on rare genomic mutation before getting official approval.',
        answers: [
          ['Engage with regulatory officers to petition for a phased approval process based on primary clinical use cases', 'Impact Orientation', 'Innovation'],
          ['Research biochemical mechanisms behind the mutation miscalls to improve base accuracy', 'Scientific Curiosity', 'Analytical Thinking'],
          ['Design targeted studies focused on low-frequency, rare genomic mutations to satisfy agency demands', 'Precision', 'Impact Orientation'],
          ['Re-analyze existing sequencing validation data using stricter statistical standards to prove current accuracy limits', 'Analytical Thinking', 'Precision']
        ]
      },
      {
        title: 'Scenario 4: Sequencer launch price',
        dialogue: 'Our DNA sequencer is now ready to be launched into the market. However, that supply setback and using those high-grade chips made the manufacturing cost super high. The instrument is now priced 20% more than traditional competitors. How do we fix this',
        answers: [
          ['Re-engineer the device body and storing components to cut total manufacturing costs by 15%', 'Precision', 'Innovation'],
          ['Launch a trade-in program of leasing equipment model to reduce upfront costs', 'Impact Orientation', 'Innovation'],
          ['Build a Return on Investment projection models to show how effective and faster diagnosis speeds reduce overall hospital stay costs to justify', 'Analytical Thinking', 'Impact Orientation'],
          ['Conduct market research to determine which diagnostic features clinicians value most and tailor our product to that', 'Scientific Curiosity', 'Precision']
        ]
      },
      {
        title: 'Scenario 5: Pricing for smaller labs',
        dialogue: 'Smaller companies, startups, and universities are reluctant to purchase our product because of the costs and deem it unfair because it seems only bigger companies can afford it. We really prioritize market expansion, and we know the impact it can have, how can we fix this.',
        answers: [
          ['Track costs per run across different lab sizes to make a tiered pay per sample pricing', 'Analytical Thinking', 'Precision'],
          ['Create grant partnerships and academic discount programs for resource-constrained research centers to increase market expansion', 'Impact Orientation', 'Precision'],
          ['Survey startup labs to understand their operational limits beyond the purchase price', 'Scientific Curiosity', 'Analytical Thinking'],
          ['Make a model where smaller labs can rent processing capacity on demand rather than buying a subscription or units', 'Innovation', 'Impact Orientation']
        ]
      }
    ]
  },
  {
    name: 'Marine',
    scenarios: [
      {
        title: 'Scenario 1: Deep-sea kelp enzyme extraction',
        dialogue: 'Manager: "We are trying to extract and synthesize a growth enzyme from deep-sea kelp to create a biostimulant that maximizes ocean crop growth. It turns out that while the enzyme yields plant growth significantly, the current process to extract the kelp damages 40% of active proteins, making the yield far less than expected"',
        answers: [
          ['Refine temperature and pH controls step-by-step during processing to preserve protein stability', 'Precision', 'Analytical Thinking'],
          ['Study the structural properties of the deep-sea enzymes to understand why pressure changes disrupt their viability', 'Scientific Curiosity', 'Innovation'],
          ['Develop a low-shear extraction method that protects protein structure during harvest', 'Innovation', 'Precision'],
          ['Map protein points throughout the extraction pipeline to identify where damage occurs', 'Analytical Thinking', 'Scientific Curiosity']
        ]
      },
      {
        title: 'Scenario 2: Biostimulant storage',
        dialogue: 'For storing our biostimulant, technicians from our team used large outdoor tanks to cultivate the algae host. However, while storing the batches, we learned that the product loses 50% of its viability within 20 days. How will we be able to prepare large-scale production',
        answers: [
          ['Redesign the storage containers with automated climate controls and bio-preservative formulations to maximize shelf life', 'Innovation', 'Precision'],
          ['Change the cultivation model so the product is grown closer to local ocean farmers, cutting storage times', 'Impact Orientation', 'Innovation'],
          ['Perform daily degradation assays to model when the batch\'s viability starts to decline under different storage conditions', 'Precision', 'Analytical Thinking'],
          ['Investigate the metabolic pathways of the algae host to know why active compounds break down rapidly in storage', 'Scientific Curiosity', 'Analytical Thinking']
        ]
      },
      {
        title: 'Scenario 3: Coastal runoff safety',
        dialogue: 'Through our environmental safety review, the regulatory agency informed us that they have updated their rules regarding ocean-harvested materials. They explicitly told us that our product needs more proof that it leaves less than 10% of residues in coastal runoff before approval. Regulatory person: "With this updated policy, this would slow us down by several years, maybe even 4!"',
        answers: [
          ['Design precise runoff simulation models and environmental assays to gather residue evidence required', 'Precision', 'Analytical Thinking'],
          ['Reformulate the compound so it binds more tightly to ocean crops and naturally breaks down in water faster', 'Innovation', 'Precision'],
          ['Work with environmental regulators to establish a real-time coastal monitoring program in place of long delays', 'Impact Orientation', 'Innovation'],
          ['Research the biological degradation rates of the residue in natural marine environments to demonstrate ecological safety', 'Scientific Curiosity', 'Analytical Thinking']
        ]
      },
      {
        title: 'Scenario 4: Biostimulant market price',
        dialogue: 'Our product is finally ready to enter the market after long periods of testing. Since the research and development phase, testing, processing, and harvesting was very costly, our final product is priced 20% higher than traditional chemical alternatives. Marketing Analyst: Now people are reluctant to buy it, and we need more buyers to get profit to recuperate from the costs!',
        answers: [
          ['Conduct controlled field trials to calculate crop yield improvements and demonstrate long-term ROI to ocean farmers.', 'Analytical Thinking', 'Impact Orientation'],
          ['Create a risk-sharing trial program where farmers pay a reduced rate until harvest goals are successfully met.', 'Impact Orientation', 'Innovation'],
          ['Streamline processing steps to reduce total production overhead and bring retail pricing down toward chemical alternatives.', 'Precision', 'Innovation'],
          ['Analyze farm purchasing habits to target high-yield aquaculture sectors that are less price-sensitive.', 'Scientific Curiosity', 'Precision']
        ]
      },
      {
        title: 'Scenario 5: Concerns about kelp harvesting',
        dialogue: 'From our marketing surveys, results show that many responded that they were uncomfortable with using the product because they believe harvesting deep-sea kelp harms coral reefs and ocean ecosystems. How do we change the perspective?',
        answers: [
          ['Launch a public transparency campaign demonstrating sustainable off-shore aquaculture harvesting methods.', 'Precision', 'Impact Orientation'],
          ['Shift primary sourcing to land-based bioreactors that synthesize the enzyme without harvesting wild kelp beds.', 'Innovation', 'Impact Orientation'],
          ['Publish independent ecological impact data showing zero harm to nearby reef systems during harvest operations.', 'Analytical Thinking', 'Precision'],
          ['Host community panels with ocean conservation groups to gather feedback and co-design sustainable harvesting guidelines.', 'Scientific Curiosity', 'Impact Orientation']
        ]
      }
    ]
  }
];

const QUIZ_TRAIT_MAP = {
  'Innovation': 0, 'Risk Taking': 0,
  'Analytical Thinking': 1, 'Strategic Thinking': 1, 'Impact Orientation': 1, 'Clinical Thinking': 1,
  'Collaboration': 2,
  'Communication': 3,
  'Scientific Curiosity': 4, 'Precision': 4, 'Quality': 4
};

const quizAreaIndex = sector => ({
  0: 0, // Pharma
  1: 1, // Agri / Env
  2: 2, // Regulatory
  3: 3, // Detection -> QUIZ_AREAS[3] (Detection)
  4: 4  // Marine -> QUIZ_AREAS[4] (Marine)
})[sector] ?? 0;

/* ---- 4. scenario quiz ---- */
function quiz(){
  const area=QUIZ_AREAS[quizAreaIndex(G.sec)]||QUIZ_AREAS[0],q=area.scenarios[G.q]||area.scenarios[0];
  draw(SECT[G.sec].th,`<div class="hud"><h3>${area.name}</h3><span class="count">Scenario ${G.q+1}/${area.scenarios.length}</span></div>
  ${say(MANAGER,SECT[G.sec].m,q.title,`<p>${q.dialogue}</p><div class="ans">${q.answers.map((a,i)=>`<button data-ans="${i}">${String.fromCharCode(65+i)}. ${a[0]}</button>`).join('')}</div>`)}`,SECT[G.sec]);
}

/* ---- 5. results ---- */
function compat(i,tr,tm){
  const s=SECT[i],t=tr.slice();tm.forEach(k=>t[s.roles[k].t[0]]+=1);
  const o=[...t].sort((a,b)=>b-a),den=2*o[0]+o[1]||1;
  return{t,list:s.roles.map(r=>({r,p:Math.min(100,Math.round(100*(2*t[r.t[0]]+t[r.t[1]])/den))})).sort((a,b)=>b.p-a.p)};
}
function result(i){
  const s=SECT[i],{t,list}=G.res[i]||compat(i,G.tr,G.team),best=list[0],top=t.map((v,k)=>[v,k]).sort((a,b)=>b[0]-a[0]),mx=top[0][0]||1;
  draw(s.th,`<div class="prof glass"><p class="note">${s.n} · your best-fit career match</p>
  <div class="best">${best.r.n} · ${best.p}%</div><p>${best.r.d} Typical education: ${best.r.e}.</p>
  <h4>Compatibility across ${s.n} roles</h4>
  ${list.slice(0,6).map(x=>`<div class="pct"><span>${x.r.n}</span><div class="bar2"><i style="width:${x.p}%"></i></div><b>${x.p}%</b></div>`).join('')}
  <h4>Career pathway</h4><p>${s.path}</p>
  <h4>Training &amp; education programs to explore</h4><ul>${s.prog.map(p=>`<li>${p}</li>`).join('')}</ul></div>
  <p style="text-align:center"><button class="btn" data-g="hub">Explore another sector</button> <button class="btn alt" data-g="restart">Play again</button></p>`,s);
}

/* ---- events ---- */
stage.addEventListener('click',e=>{
  const t=e.target.closest('button');if(!t)return;const d=t.dataset;
  if(d.campus!==undefined){enterCampus(+d.campus);return}
  if(d.campusEnter!==undefined){if(G.nearCampus>=0)enterCampus(G.nearCampus);else $('#campus-msg').textContent='Move closer to a building first.';return}
  if(d.campusPad){K[d.campusPad]=1;setTimeout(()=>delete K[d.campusPad],220);return}
  if(d.role!==undefined)roleModal(+d.role);
  else if(d.ans!==undefined){
    const area=QUIZ_AREAS[quizAreaIndex(G.sec)]||QUIZ_AREAS[0],a=(area.scenarios[G.q]||area.scenarios[0]).answers[+d.ans];
    G.sourceTraitScores[a[1]]=(G.sourceTraitScores[a[1]]||0)+3;G.sourceTraitScores[a[2]]=(G.sourceTraitScores[a[2]]||0)+1;
    G.tr[QUIZ_TRAIT_MAP[a[1]]??0]+=3;G.tr[QUIZ_TRAIT_MAP[a[2]]??4]+=1;
    if(++G.q<area.scenarios.length)quiz();else{G.res[G.sec]=compat(G.sec,G.tr,G.team);result(G.sec)}}
  else if(d.g){({hub,quiz,entry,restart:()=>{G.res={};entry()}})[d.g]()}
});
$('#modal').addEventListener('click',e=>{
  const t=e.target.closest('[data-toggle]');if(!t)return;
  const i=+t.dataset.toggle,k=G.team.indexOf(i);
  k>=0?G.team.splice(k,1):G.team.length<6&&G.team.push(i);
  closeModal();team();
});
entry();

/* ================= MAP ================= */
const COUNTIES={"Sussex":{"cx":263,"cy":84},"Warren":{"cx":171,"cy":195},"Passaic":{"cx":379,"cy":125},"Bergen":{"cx":447,"cy":154},"Morris":{"cx":307,"cy":193},"Essex":{"cx":395,"cy":223},"Hudson":{"cx":446,"cy":246},"Union":{"cx":377,"cy":273},"Hunterdon":{"cx":196,"cy":309},"Somerset":{"cx":285,"cy":310},"Middlesex":{"cx":347,"cy":358},"Mercer":{"cx":258,"cy":420},"Monmouth":{"cx":405,"cy":427},"Ocean":{"cx":387,"cy":576},"Burlington":{"cx":269,"cy":577},"Camden":{"cx":181,"cy":606},"Gloucester":{"cx":126,"cy":639},"Salem":{"cx":62,"cy":690},"Atlantic":{"cx":272,"cy":734},"Cumberland":{"cx":134,"cy":776},"Cape May":{"cx":229,"cy":863}};
const TYPES = ['Internships', 'Volunteering', 'Programs', 'Entry-Level Jobs', 'Mid/High-Level Jobs'];
const SECTORS = ['Pharma / Healthcare', 'Agricultural & Environmental', 'Regulatory Science', 'Detection', 'Marine'];

const OPPS = [
  {"org":"Walgreens","loc":"Atlantic County, NJ","county":"Atlantic","type":"Internships","sector":"Pharma / Healthcare","url":"https://www.walgreens.com/careers","jobs":["Pharmacy Intern"],"lat":39.47,"lng":-74.55},
  {"org":"Rowan RISER Program","loc":"Atlantic County, NJ","county":"Atlantic","type":"Internships","sector":"Pharma / Healthcare","url":"https://www.rowan.edu","jobs":["Biomedical Research Fellow"],"lat":39.47,"lng":-74.55},
  {"org":"Atlantic Cape Community College","loc":"Mays Landing, NJ","county":"Atlantic","type":"Entry-Level Jobs","sector":"Pharma / Healthcare","url":"https://www.atlantic.edu","jobs":["Lab Assistant"],"lat":39.47,"lng":-74.55},
  {"org":"CVS Health","loc":"Lumberton, NJ","county":"Burlington","type":"Internships","sector":"Pharma / Healthcare","url":"https://jobs.cvshealth.com","jobs":["Supply Chain & Logistics Summer Intern","Pharmacy Intern"],"lat":39.88,"lng":-74.67},
  {"org":"Burlington County Health Dept","loc":"Mount Holly, NJ","county":"Burlington","type":"Internships","sector":"Regulatory","url":"https://www.co.burlington.nj.us","jobs":["Public Health Student Intern"],"lat":39.88,"lng":-74.67},
  {"org":"EMSL Analytical","loc":"Cinnaminson, NJ","county":"Burlington","type":"Internships","sector":"Detection","url":"https://www.emsl.com","jobs":["Laboratory Intern / Tech"],"lat":39.88,"lng":-74.67},
  {"org":"Coriell Institute for Medical Research","loc":"Camden, NJ","county":"Camden","type":"Internships","sector":"Pharma / Healthcare","url":"https://www.coriell.org","jobs":["Lab Research Intern","Bioinformatics Intern","QA & Safety Intern","Business Development Intern"],"lat":39.8,"lng":-74.96},
  {"org":"Rowan University","loc":"Camden, NJ","county":"Camden","type":"Programs","sector":"Pharma / Healthcare","url":"https://www.rowan.edu","jobs":["Research Immersion in Biomedical Science & Engineering"],"lat":39.8,"lng":-74.96},
  {"org":"Cape May County Health Dept","loc":"Cape May Court House, NJ","county":"Cape May","type":"Internships","sector":"Regulatory","url":"https://capemaycountynj.gov","jobs":["Public Health Lab Intern"],"lat":39.08,"lng":-74.86},
  {"org":"Cape Regional Medical Center","loc":"Cape May Court House, NJ","county":"Cape May","type":"Internships","sector":"Pharma / Healthcare","url":"https://www.caperegional.com","jobs":["Clinical / Health Intern"],"lat":39.08,"lng":-74.86},
  {"org":"Wetlands Institute","loc":"Stone Harbor, NJ","county":"Cape May","type":"Volunteering","sector":"Agricultural / Environmental","url":"https://wetlandsinstitute.org","jobs":["Coastal & Marine Conservation Volunteer"],"lat":39.08,"lng":-74.86},
  {"org":"Cape May Shellfish Hatchery & Aquaculture","loc":"Cape May, NJ","county":"Cape May","type":"Entry-Level Jobs","sector":"Marine","url":"https://capemaycountynj.gov","jobs":["Aquaculture & Shellfish Hatchery Tech"],"lat":39.08,"lng":-74.86},
  {"org":"Rutgers Agricultural Research & Extension Center (RAREC)","loc":"Bridgeton, NJ","county":"Cumberland","type":"Internships","sector":"Agricultural / Environmental","url":"https://rarec.rutgers.edu","jobs":["Agricultural Biotech Research Intern"],"lat":39.33,"lng":-75.13},
  {"org":"Inspira Health System","loc":"Vineland, NJ","county":"Cumberland","type":"Internships","sector":"Pharma / Healthcare","url":"https://www.inspirahealthnetwork.org","jobs":["Clinical / Healthcare Intern","Hospital Volunteer"],"lat":39.33,"lng":-75.13},
  {"org":"NJIT / BioNJ Innovation Center","loc":"Newark, NJ","county":"Essex","type":"Internships","sector":"Pharma / Healthcare","url":"https://www.njit.edu","jobs":["Biomedical Engineering & Biotech Innovation Intern"],"lat":40.78,"lng":-74.24},
  {"org":"Rutgers Biomedical and Health Sciences (RBHS)","loc":"Newark, NJ","county":"Essex","type":"Internships","sector":"Pharma / Healthcare","url":"https://rbhs.rutgers.edu","jobs":["Biomedical Research Intern"],"lat":40.78,"lng":-74.24},
  {"org":"ON3 Life Science Campus","loc":"Nutley, NJ","county":"Essex","type":"Mid/High-Level Jobs","sector":"Pharma / Healthcare","url":"https://on3nj.com","jobs":["Biotech Scientist","Biomanufacturing Specialist"],"lat":40.78,"lng":-74.24},
  {"org":"Sanofi","loc":"Bridgewater, NJ","county":"Somerset","type":"Internships","sector":"Pharma / Healthcare","url":"https://www.sanofi.com","jobs":["Pharma R&D Summer Intern","Bioprocess Intern"],"lat":40.56,"lng":-74.61},
  {"org":"Johnson & Johnson / Janssen","loc":"Raritan, NJ","county":"Somerset","type":"Internships","sector":"Pharma / Healthcare","url":"https://www.jnj.com","jobs":["HFE Human Factors Engineering Intern","Pharmaceutical Sciences Intern"],"lat":40.56,"lng":-74.61},
  {"org":"Gloucester R&D Labs","loc":"Glassboro, NJ","county":"Gloucester","type":"Internships","sector":"Pharma / Healthcare","url":"#","jobs":["Chemist R&D Intern (Summer 2027)"],"lat":39.71,"lng":-75.14},
  {"org":"Stevens Institute of Technology","loc":"Hoboken, NJ","county":"Hudson","type":"Programs","sector":"Detection","url":"https://www.stevens.edu","jobs":["Bioengineering & Sensing Technology Research Program"],"lat":40.73,"lng":-74.07},
  {"org":"Roche Diagnostics","loc":"Hunterdon County, NJ","county":"Hunterdon","type":"Mid/High-Level Jobs","sector":"Detection","url":"https://careers.roche.com/global/en","jobs":["Diagnostic Systems Specialist","R&D Scientist"],"lat":40.56,"lng":-74.9},
  {"org":"NJ Public Health & Environmental Laboratories (PHEL)","loc":"Trenton, NJ","county":"Mercer","type":"Internships","sector":"Regulatory","url":"https://www.nj.gov/health/phel/student-outreach/","jobs":["Public Health Student Outreach / Lab Intern"],"lat":40.28,"lng":-74.7},
  {"org":"Evotec","loc":"Princeton, NJ","county":"Mercer","type":"Mid/High-Level Jobs","sector":"Pharma / Healthcare","url":"https://careers.evotec.com","jobs":["Drug Discovery Scientist","Research Associate"],"lat":40.28,"lng":-74.7},
  {"org":"Rocket Pharmaceuticals","loc":"Cranbury, NJ","county":"Mercer","type":"Mid/High-Level Jobs","sector":"Pharma / Healthcare","url":"https://rocketpharma.com/join-us/careers/","jobs":["Gene Therapy Specialist","QA Engineer"],"lat":40.28,"lng":-74.7},
  {"org":"Waksman Institute of Microbiology","loc":"Piscataway, NJ","county":"Middlesex","type":"Programs","sector":"Pharma / Healthcare","url":"https://waksman.rutgers.edu/","jobs":["Waksman Student Research Program"],"lat":40.44,"lng":-74.43},
  {"org":"Center for Advanced Biotechnology and Medicine (CABM)","loc":"Piscataway, NJ","county":"Middlesex","type":"Internships","sector":"Pharma / Healthcare","url":"https://cabm.rutgers.edu/","jobs":["Molecular Biology Research Intern"],"lat":40.44,"lng":-74.43},
  {"org":"Biotechnology High School","loc":"Freehold, NJ","county":"Monmouth","type":"Programs","sector":"Agricultural / Environmental","url":"https://www.bths.mcvsd.org","jobs":["Biotechnology Career Academy Program"],"lat":40.27,"lng":-74.16},
  {"org":"Legend Biotech","loc":"Somerset / Monmouth Hub, NJ","county":"Monmouth","type":"Internships","sector":"Pharma / Healthcare","url":"https://www.monmouth.edu","jobs":["Cell Therapy Summer Intern 2027"],"lat":40.27,"lng":-74.16},
  {"org":"Hackensack Meridian Health","loc":"Hackensack, NJ","county":"Bergen","type":"Internships","sector":"Pharma / Healthcare","url":"https://www.hackensackmeridianhealth.org/en/research","jobs":["Biomedical Engineering Intern (Summer 2027)","Clinical Affairs Intern (Summer 2027)"],"lat":40.96,"lng":-74.07},
  {"org":"Minaris Advanced Therapies","loc":"Allendale, NJ","county":"Bergen","type":"Mid/High-Level Jobs","sector":"Pharma / Healthcare","url":"#","jobs":["Senior Supply Chain Director - Biotech"],"lat":40.96,"lng":-74.07},
  {"org":"Fusion Medical Staffing / Clinical Labs","loc":"Englewood / Clifton, NJ","county":"Bergen","type":"Entry-Level Jobs","sector":"Detection","url":"#","jobs":["Lab Technician","Medical Laboratory Scientist"],"lat":40.96,"lng":-74.07},
  {"org":"Sanofi US Headquarters","loc":"Morristown, NJ","county":"Morris","type":"Internships","sector":"Pharma / Healthcare","url":"https://www.sanofi.com","jobs":["Sales Analyst Intern","Vaccines Marketing & Sales Associate","Supply Chain Management Intern"],"lat":40.86,"lng":-74.54},
  {"org":"Biomedical Research Institute of NJ (BRInj)","loc":"Cedar Knolls, NJ","county":"Morris","type":"Volunteering","sector":"Pharma / Healthcare","url":"#","jobs":["Biomedical Research Volunteer"],"lat":40.86,"lng":-74.54},
  {"org":"Ocean County College / Kean Ocean","loc":"Toms River, NJ","county":"Ocean","type":"Internships","sector":"Agricultural / Environmental","url":"#","jobs":["Science Research Intern","Biotechnology Degree Pathway Student"],"lat":39.87,"lng":-74.26},
  {"org":"Hackensack Meridian Ocean University Medical Center","loc":"Brick, NJ","county":"Ocean","type":"Volunteering","sector":"Pharma / Healthcare","url":"#","jobs":["Clinical Lab & Hospital Volunteer"],"lat":39.87,"lng":-74.26},
  {"org":"William Paterson University","loc":"Wayne, NJ","county":"Passaic","type":"Internships","sector":"Agricultural / Environmental","url":"#","jobs":["STEM Research Fellow"],"lat":41.04,"lng":-74.3},
  {"org":"Passaic County Technical Institute & PCCC","loc":"Paterson, NJ","county":"Passaic","type":"Programs","sector":"Detection","url":"#","jobs":["Bio-Science Academy","STEM Academy Program"],"lat":41.04,"lng":-74.3},
  {"org":"Salem Community College Glass Center","loc":"Carneys Point, NJ","county":"Salem","type":"Programs","sector":"Detection","url":"#","jobs":["Scientific Glass Technology Program"],"lat":39.58,"lng":-75.35},
  {"org":"South Jersey Agricultural Biotech Enterprises","loc":"Salem County, NJ","county":"Salem","type":"Internships","sector":"Agricultural / Environmental","url":"#","jobs":["Agricultural Biotech Intern"],"lat":39.58,"lng":-75.35},
  {"org":"EMSL Analytical","loc":"Sparta, NJ","county":"Sussex","type":"Internships","sector":"Detection","url":"https://www.emsl.com","jobs":["Environmental Lab Analyst Intern","Lab Technician"],"lat":41.14,"lng":-74.69},
  {"org":"Sussex County Dept of Health","loc":"Newton, NJ","county":"Sussex","type":"Volunteering","sector":"Regulatory","url":"#","jobs":["Public Health & Environmental Volunteer"],"lat":41.14,"lng":-74.69},
  {"org":"Merck & Co. World Headquarters","loc":"Rahway, NJ","county":"Union","type":"Internships","sector":"Pharma / Healthcare","url":"https://jobs.merck.com","jobs":["Pharmaceutical R&D Intern","Biomanufacturing Co-op"],"lat":40.66,"lng":-74.31},
  {"org":"Kean University Center for STEM Studies","loc":"Union, NJ","county":"Union","type":"Programs","sector":"Pharma / Healthcare","url":"https://www.kean.edu","jobs":["Biotechnology Certificate & STEM Research"],"lat":40.66,"lng":-74.31},
  {"org":"Warren County Community College","loc":"Washington, NJ","county":"Warren","type":"Programs","sector":"Agricultural / Environmental","url":"#","jobs":["Drone & Precision Agriculture Certification"],"lat":40.86,"lng":-74.99},
  {"org":"Musconetcong Watershed Association","loc":"Asbury, NJ","county":"Warren","type":"Volunteering","sector":"Agricultural / Environmental","url":"#","jobs":["Water Quality Monitoring Volunteer"],"lat":40.86,"lng":-74.99},
  {"org":"New Jersey Academy of Science (NJAS)","loc":"Statewide, NJ","county":"Middlesex","type":"Programs","sector":"Pharma / Healthcare","url":"https://www.njas.org/Biotechnology-Research-Fellowship-Program","jobs":["Biotechnology Research Fellowship"],"lat":40.44,"lng":-74.43},
  {"org":"NJ Office of Higher Education","loc":"Trenton, NJ","county":"Mercer","type":"Programs","sector":"Regulatory","url":"https://www.nj.gov/highereducation/caigp-students.shtml","jobs":["Community Innovation & Biotech Grant Student Program"],"lat":40.28,"lng":-74.7}
];

const box = (id, list) => {
  const el = $(id);
  if (el) el.innerHTML = list.map(v => `<label><input type="checkbox" value="${v}"> ${v}</label>`).join('');
};

function renderMapPins(filteredOpps) {
  const svg = $('#nj');
  if (!svg) return;
  if (!svg.querySelector('#nj-map-image')) {
    const mapImage = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    mapImage.setAttribute('id', 'nj-map-image');
    mapImage.setAttribute('href', 'nj_counties.png');
    mapImage.setAttribute('x', '0'); mapImage.setAttribute('y', '0');
    mapImage.setAttribute('width', '980'); mapImage.setAttribute('height', '980');
    mapImage.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.appendChild(mapImage);
  }
  let pinLayer = svg.querySelector('#nj-pin-layer');
  if (!pinLayer) { pinLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g'); pinLayer.setAttribute('id', 'nj-pin-layer'); svg.appendChild(pinLayer); }
  const existingPins = svg.querySelectorAll('.pin-group');
  existingPins.forEach(p => p.remove());

  const countyGroups = {};
  filteredOpps.forEach(o => {
    if (!countyGroups[o.county]) countyGroups[o.county] = [];
    countyGroups[o.county].push(o);
  });

  Object.entries(countyGroups).forEach(([county, oppList]) => {
    const coords = COUNTIES[county];
    if (!coords) return;

    oppList.forEach((opp, idx) => {
      const angle = (idx / oppList.length) * 2 * Math.PI;
      const radius = oppList.length > 1 ? 14 : 0;
      const px = 250 + coords.cx * 0.95 + Math.cos(angle) * radius;
      const py = 25 + coords.cy * 0.95 + Math.sin(angle) * radius;

      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'pin-group');
      g.style.cursor = 'pointer';

      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', px);
      circle.setAttribute('cy', py);
      circle.setAttribute('r', 8);
      circle.setAttribute('fill', '#557692');
      circle.setAttribute('stroke', '#FFFFFF');
      circle.setAttribute('stroke-width', '2');

      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', px);
      text.setAttribute('y', py + 3);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', '#FFFFFF');
      text.setAttribute('font-size', '8px');
      text.setAttribute('font-weight', 'bold');
      text.textContent = opp.org[0];

      g.appendChild(circle);
      g.appendChild(text);

      g.onclick = () => {
        openModal(`
          <h3>${opp.org}</h3>
          <p><b>Location:</b> ${opp.loc} (${opp.county} County)</p>
          <p><b>Sector:</b> ${opp.sector}</p>
          <p><b>Type:</b> ${opp.type}</p>
          <p><b>Available Opportunities:</b></p>
          <ul>${opp.jobs.map(j => `<li>${j}</li>`).join('')}</ul>
          ${opp.url && opp.url !== '#' ? `<p><a href="${opp.url}" target="_blank" rel="noopener">Visit Website / Apply</a></p>` : ''}
        `);
      };

      pinLayer.appendChild(g);
    });
  });
}

const sel = id => new Set($$(id + ' input:checked').map(i => i.value));

function filterMap() {
  const T = sel('#f-type');
  const S = sel('#f-sector');
  const C = sel('#f-county');

  const ok = o => {
    const matchType = !T.size || T.has(o.type);
    const matchSector = !S.size || S.has(o.sector);
    const matchCounty = !C.size || C.has(o.county);
    return matchType && matchSector && matchCounty;
  };

  const hit = OPPS.filter(ok);

  const statusEl = $('#status');
  if (statusEl) {
    statusEl.textContent = `${hit.length} location${hit.length === 1 ? '' : 's'} shown of ${OPPS.length} opportunities across New Jersey`;
  }

  renderMapPins(hit);
}

document.addEventListener('DOMContentLoaded', () => {
  box('#f-type', TYPES);
  box('#f-sector', SECTORS);
  box('#f-county', Object.keys(COUNTIES).sort());

  const mapAside = $('#map aside');
  if (mapAside) {
    mapAside.addEventListener('change', filterMap);
  }

  const clearBtn = $('#clear');
  if (clearBtn) {
    clearBtn.onclick = () => {
      $$('#map input').forEach(i => i.checked = false);
      filterMap();
    };
  }

  filterMap();
});
