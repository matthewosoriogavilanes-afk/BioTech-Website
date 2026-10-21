/* ---------- helpers ---------- */
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
let lastFocus=null;
function openModal(html){lastFocus=document.activeElement;$('#mbox').innerHTML=html+'<p><button class="btn alt" data-close>Close</button></p>';$('#modal').hidden=false;$('#mbox').querySelector('button').focus()}
function closeModal(){$('#modal').hidden=true;lastFocus&&lastFocus.focus()}
$('#modal').addEventListener('click',e=>{if(e.target.id==='modal'||e.target.closest('[data-close]'))closeModal()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#modal').hidden)closeModal()});

/* ---------- tabs ---------- */
function showTab(t){
  ['home','game','map'].forEach(id=>$('#'+id).hidden=id!==t);
  $$('.tab').forEach(b=>b.toggleAttribute('aria-current',b.dataset.tab===t)||(b.dataset.tab===t&&b.setAttribute('aria-current','page')));
  $$('.tab').forEach(b=>{b.dataset.tab===t?b.setAttribute('aria-current','page'):b.removeAttribute('aria-current')});
  window.scrollTo(0,0);
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-tab]');if(b)showTab(b.dataset.tab)});
$('#start').onclick=()=>{const n=$('#nav');n.scrollIntoView({behavior:'smooth'});n.focus({preventScroll:true})};
showTab('home');

/* ================= GAME ================= */
const TRAITS=['Innovation / Curiosity','Decision-Making','Teamwork / Problem-Solving','Communication / Ethics','Patience / Research'];
const MAJORS=[
 ['Biotechnology, Molecular Biology, Biochemistry'],
 ['Bioengineering, Biostatistics, Data Science'],
 ['Biomedical Engineering, Public Health, Business of Science'],
 ['Regulatory Science, Bioethics, Science Communication'],
 ['Chemistry, Microbiology, Medical Laboratory Science']];
/* Role string: Name|Description|Key skills|Education|primaryTrait,secondaryTrait */
const R=s=>{const p=s.split('|');return{n:p[0],d:p[1],k:p[2],e:p[3],t:[+p[4][0],+p[4][1]]}};
const Q=(q,...a)=>({q,a});
const SECT=[
{n:'Pharma / Healthcare',th:'th-pharma',m:'Dr. Lena Ruiz',c:'#38bdf8',ic:['dna','flask'],
 d:'Our cleanroom team turns discoveries into safe, effective medicines and treatments, from first molecule to patient.',
 path:'Intern or lab associate, then scientist or specialist, then senior scientist or manager, then director.',
 prog:['Rutgers Ernest Mario School of Pharmacy (PharmD)','RAPS Regulatory Affairs Certification (RAC)','Biotechnology and clinical research certificates at NJ colleges'],
 roles:['Medicinal Chemist|Designs and improves drug molecules.|Organic chemistry, analysis|B.S. or Ph.D. in chemistry|04','Pharmacologist|Tests how drugs act in the body.|Assay design, dose-response|Ph.D. in pharmacology|40','Clinical Research Associate|Monitors trial sites for quality and safety.|Monitoring, GCP rules|B.S. in a life science|43','Clinical Trial Manager|Leads studies on time and on budget.|Planning, leadership|B.S. plus PMP or M.S.|12','Regulatory Affairs Specialist|Guides products through FDA approval.|Technical writing, regulations|B.S. plus RAC certificate|34','Pharmacovigilance Scientist|Tracks drug safety after launch.|Data review, medical writing|PharmD or B.S./M.S.|41','Biostatistician|Analyzes clinical trial data.|Statistics, R/SAS|M.S. in biostatistics|14','Process Development Scientist|Scales recipes into manufacturing.|Bioprocess, optimization|B.S./M.S. in chemical engineering|01','Quality Assurance Specialist|Keeps manufacturing GMP-compliant.|Auditing, documentation|B.S. in a life science|43','Formulation Scientist|Turns drugs into tablets and injections.|Chemistry, stability testing|B.S./Ph.D. in pharmaceutical science|04','Medical Science Liaison|Explains new science to physicians.|Presenting, clinical knowledge|PharmD or Ph.D.|32','Pharmacist|Dispenses medicine and counsels patients.|Pharmacology, counseling|PharmD|34','Bioinformatics Scientist|Mines genomic data for drug targets.|Python, genomics|B.S./M.S. in bioinformatics|10','Biomedical Engineer|Builds devices and delivery systems.|Design, prototyping|B.S. in biomedical engineering|02','Genetic Counselor|Guides patients through genetic results.|Empathy, genetics|M.S. in genetic counseling|34','Medical Writer|Writes clinical and regulatory documents.|Writing, scientific accuracy|B.S./M.S. in life science|34'].map(R),
 qs:[
  Q('A promising drug candidate shows mild side effects in early tests. First move?',['Design a tweaked molecule without the side effect',0],['Review the full data with the safety team',4],['Make a go/no-go call using risk and timeline',1],['Explain the findings openly to the clinical team',3]),
  Q('Two teammates disagree about the trial design. You…',['Mediate and combine their best ideas',2],['Propose a design neither considered',0],['Review the literature to settle it',4],['Pick an approach and set a deadline',1]),
  Q('Patients ask why trials take years.',['Explain honestly, including the risks',3],['Show how each phase builds evidence',4],['Invite patients to give input on the design',2],['Find the fastest ethical path',1]),
  Q('A key instrument fails the night before an experiment.',['Improvise a clever workaround',0],['Troubleshoot step by step',4],['Reassign tasks across the team',2],['Notify stakeholders and reschedule',3]),
  Q('A label claim is not fully backed by data.',['Hold the claim until evidence is complete',4],['Rewrite it honestly and clearly',3],['Quickly decide which claims to cut',1],['Look for a new study to support it',0])]},
{n:'Agricultural',th:'th-agri',m:'Ms. Hana Green',c:'#15803d',ic:['leaf','drop'],
 d:'Step into our hydroponics greenhouse, where biotechnology helps crops grow stronger, safer and more sustainably.',
 path:'Lab or field technician, then crop or plant scientist, then project lead, then research director or consultant.',
 prog:['Rutgers School of Environmental and Biological Sciences (plant and food science)','Rutgers Cooperative Extension programs','Controlled-environment agriculture certificates'],
 roles:['Agricultural Biotechnologist|Engineers crops for resilience.|Genomics, lab methods|M.S. or Ph.D. in plant biotechnology|04','Crop Scientist|Runs field trials to improve yield.|Agronomy, statistics|B.S./M.S. in crop science|41','Soil Scientist|Studies soil health and nutrients.|Sampling, chemistry|B.S. in soil science|40','Hydroponics Specialist|Optimizes soil-free growing systems.|Nutrient control, automation|B.S. in horticulture|02','Plant Pathologist|Diagnoses and prevents crop disease.|Microscopy, diagnostics|M.S./Ph.D. in plant pathology|41','Agricultural Engineer|Designs irrigation and farm machinery.|Engineering, sensors|B.S. in agricultural engineering|02','Food Scientist|Develops safe, nutritious foods.|Chemistry, sensory testing|B.S. in food science|01','Entomologist|Studies pests and helpful insects.|Identification, ecology|B.S./M.S. in entomology|40','Tissue Culture Technician|Grows plants from cells in sterile labs.|Sterile technique, media prep|A.S./B.S. in biology|42','Agronomist|Advises growers on crops and soil.|Field analysis, communication|B.S. in agronomy|23','Precision Ag Analyst|Uses drones and data to guide farms.|GIS, data science|B.S. in ag plus data skills|10','Seed Technologist|Tests seed quality and purity.|Lab testing, standards|B.S. in plant science|41','Biosafety Officer|Keeps crop biotech safe and compliant.|Regulations, ethics|B.S./M.S. plus policy training|31','Extension Educator|Teaches growers new practices.|Teaching, outreach|M.S. in agriculture|32','Sustainable Farm Manager|Runs operations with eco-friendly methods.|Leadership, budgeting|B.S. in agriculture or business|12','Plant Breeder|Selects and crosses plants for better traits.|Genetics, patience|M.S./Ph.D. in plant breeding|40'].map(R),
 qs:[
  Q('A crop is hit by drought.',['Explore drought-tolerant gene ideas',0],['Choose which fields to replant',1],['Work with farmers on solutions',2],['Run multi-season trials',4]),
  Q('Neighbors worry about gene-edited crops.',['Hold an open Q&A',3],['Share safety data patiently',4],['Invite them to tour the lab',2],['Decide on a labeling approach',1]),
  Q('Pests resist your biopesticide.',['Engineer a new pest-control approach',0],['Track resistance over several seasons',4],['Coordinate growers on crop rotation',2],['Explain the changes clearly to growers',3]),
  Q('Greenhouse sensors disagree with each other.',['Calibrate and compare patiently',4],['Automate a smarter control loop',0],['Pick the sensors to trust and act',1],['Inspect them together as a team',2]),
  Q('Budget cut: only one project continues.',['Weigh impact and cost, then choose',1],['Pitch a cheaper creative design',0],['Ask the team to vote',2],['Explain the decision honestly',3])]},
{n:'Environmental',th:'th-env',m:'Dr. Sam Okafor',c:'#0f766e',ic:['globe','bars'],
 d:'Our ecological monitoring lab tracks carbon, water and soil, using biology to protect and restore ecosystems.',
 path:'Field or lab technician, then analyst or scientist, then project lead, then policy or program director.',
 prog:['Rutgers environmental science and bioenvironmental engineering majors','GIS certificate programs','HAZWOPER hazardous-waste safety training'],
 roles:['Environmental Microbiologist|Studies microbes that clean pollution.|Culturing, sequencing|B.S./Ph.D. in microbiology|40','Ecologist|Studies ecosystems and species.|Fieldwork, statistics|B.S./M.S. in ecology|40','Environmental Engineer|Designs cleanup and treatment systems.|Engineering, modeling|B.S. in environmental engineering|12','Bioremediation Specialist|Uses organisms to clean polluted sites.|Site assessment, microbes|M.S. in environmental science|02','Water Quality Analyst|Tests water for contaminants.|Sampling, instruments|B.S. in chemistry or environmental science|41','Climate Data Scientist|Models carbon and climate data.|Python, modeling|B.S./M.S. in data or earth science|10','GIS Analyst|Maps environmental change.|GIS, remote sensing|B.S. in geography or environmental science|14','Environmental Toxicologist|Studies how chemicals affect living things.|Assays, risk assessment|M.S./Ph.D. in toxicology|43','Conservation Biologist|Protects endangered species.|Field biology, policy|B.S./M.S. in conservation biology|42','Compliance Officer|Makes sure projects follow regulations.|Regulations, auditing|B.S. in environmental science|31','Sustainability Consultant|Helps firms shrink their footprint.|Analysis, communication|B.S. plus sustainability training|32','Field Technician|Collects samples and runs monitors.|Sampling, equipment|A.S./B.S. in environmental science|42','Environmental Educator|Teaches communities about ecology.|Teaching, outreach|B.S. in science or education|32','Biofuel Researcher|Develops fuels from biomass.|Fermentation, chemistry|M.S./Ph.D. in chemistry or biotech|01','Environmental Health Specialist|Protects communities from hazards.|Inspection, epidemiology|B.S. or M.P.H. in environmental health|34','Waste-to-Energy Engineer|Turns waste into usable energy.|Process design, safety|B.S. in chemical engineering|10'].map(R),
 qs:[
  Q('Soil microbes in a river sample look new.',['Culture and study them',4],['Wonder if they could clean pollution',0],['Share findings with ecologists',2],['Publish with ethical sourcing notes',3]),
  Q('A factory leak threatens a nearby creek.',['Decide containment steps right now',1],['Test water samples repeatedly',4],['Coordinate responders and residents',2],['Inform the public honestly',3]),
  Q('Carbon data conflicts with your model.',['Dig into the data patiently',4],['Propose a brand-new model',0],['Decide what to report',1],['Present the uncertainty honestly',3]),
  Q('A community wants a wetland restored.',['Invent a low-cost restoration method',0],['Gather everyone’s needs into one plan',2],['Explain the tradeoffs openly',3],['Survey the site for months first',4]),
  Q('Two field teams need the same equipment.',['Decide by project urgency',1],['Design a shared sensor kit',0],['Build a schedule with both teams',2],['Document usage so it is fair',3])]},
{n:'Marine',th:'th-marine',m:'Capt. Maria Reyes',c:'#0369a1',ic:['fish','drop'],
 d:'Dive into our deep-sea aquaculture facility, where ocean organisms inspire new medicines, foods and conservation tools.',
 path:'Research or aquaculture technician, then marine scientist, then project lead, then program director.',
 prog:['Rutgers Institute of Marine and Coastal Sciences','Stockton University marine science','Scientific diving training'],
 roles:['Marine Biologist|Studies ocean life and ecosystems.|Fieldwork, species ID|B.S./M.S. in marine biology|40','Marine Natural Products Chemist|Finds medicines in sea organisms.|Chromatography, NMR|Ph.D. in chemistry|04','Aquaculture Technician|Raises fish and shellfish sustainably.|Water chemistry, husbandry|A.S./B.S. in aquaculture|42','Fisheries Scientist|Assesses fish populations.|Statistics, sampling|M.S. in fisheries science|41','Oceanographer|Studies currents and ocean chemistry.|Instruments, modeling|B.S./Ph.D. in oceanography|04','Marine Microbiologist|Studies microbes of the sea.|Sequencing, culturing|Ph.D. in microbiology|40','Coral Restoration Specialist|Grows and restores reefs.|Diving, propagation|B.S. in marine science|20','Marine Biotechnologist|Applies marine organisms to products.|Genetics, bioprocess|M.S. in marine biotechnology|01','Ocean Engineer|Operates underwater robots (ROVs).|Robotics, navigation|B.S. in ocean engineering|12','Shellfish Health Specialist|Monitors oyster and clam disease.|Histology, diagnostics|M.S. in aquatic health|41','Marine Policy Analyst|Shapes ocean conservation rules.|Policy, writing|M.S. in marine policy|31','Marine Mammal Scientist|Studies whales and dolphins.|Observation, data analysis|M.S./Ph.D. in marine mammal science|40','Marine Data Scientist|Analyzes ocean sensor data.|Python, statistics|B.S./M.S. in data science|10','Seafood Safety Inspector|Checks seafood for contaminants.|Testing, regulations|B.S. in food or marine science|43','Ocean Educator|Teaches the public about the sea.|Teaching, outreach|B.S. plus education training|32','Algal Biotechnologist|Grows algae for foods and fuels.|Cultivation, biochemistry|M.S. in biotechnology|01'].map(R),
 qs:[
  Q('Coral near your lab is bleaching. First step?',['Test a heat-tolerant algae idea',0],['Collect long-term water samples',4],['Coordinate divers and scientists',2],['Alert the community and explain why',3]),
  Q('A storm threatens your sample tanks.',['Choose which samples to save first',1],['Build a quick backup rig',0],['Organize the crew into rescue teams',2],['Log everything so research can resume',4]),
  Q('A fishing company worries about new rules.',['Listen and explain the science fairly',3],['Propose sustainable-harvest tech',0],['Set clear limits from the data',1],['Form a joint working group',2]),
  Q('Deep-sea sensor data looks odd.',['Repeat measurements to confirm',4],['Ask what new process explains it',0],['Decide whether to send a new probe',1],['Compare with a partner lab',2]),
  Q('A cheaper aquaculture feed is untested.',['Prototype a trial batch',0],['Decide using a cost and risk table',1],['Test on a small group for months',4],['Consult farmers and regulators',3])]},
{n:'Detection',th:'th-detect',m:'Dr. Jun Park',c:'#6d28d9',ic:['bars','dna'],
 d:'Our high-throughput bio-analytics lab reads DNA, proteins and signals to detect disease, pathogens and evidence.',
 path:'Lab technician or analyst, then scientist or specialist, then senior scientist or lab manager, then director.',
 prog:['Rutgers and NJIT biomedical engineering and biochemistry programs','Medical laboratory science programs with ASCP certification','Bioinformatics certificate programs'],
 roles:['Molecular Diagnostics Scientist|Develops DNA and RNA tests.|PCR, assay design|B.S./M.S. in molecular biology|04','Forensic DNA Analyst|Analyzes DNA evidence for cases.|PCR, chain of custody|B.S. in forensic science|43','Clinical Lab Scientist|Runs patient lab tests.|Instruments, accuracy|B.S. in medical laboratory science|41','Assay Development Scientist|Builds new detection assays.|Immunoassays, validation|M.S. in biochemistry|01','Sequencing Specialist|Runs genome sequencers.|NGS, library prep|B.S. in genetics|42','Bioinformatics Analyst|Interprets sequence data.|Python, statistics|B.S./M.S. in bioinformatics|14','Biosensor Engineer|Designs devices that detect biomarkers.|Electronics, biochemistry|B.S./M.S. in biomedical engineering|02','Mass Spectrometry Specialist|Identifies molecules by mass.|Instrument tuning, analysis|B.S./Ph.D. in analytical chemistry|40','Quality Control Analyst|Verifies test quality and consistency.|SOPs, documentation|B.S. in chemistry or biology|43','Public Health Lab Scientist|Detects outbreaks and pathogens.|Microbiology, surveillance|M.S. in public health or microbiology|42','Flow Cytometry Specialist|Analyzes cells by their markers.|Cell analysis, software|B.S. in biology or immunology|41','Lab Automation Engineer|Builds robotics for high-throughput screening.|Robotics, coding|B.S. in engineering|10','Pathogen Detection Specialist|Tests food and water for pathogens.|Culturing, PCR|B.S. in microbiology|41','Diagnostics Product Manager|Guides tests from idea to market.|Strategy, communication|B.S. plus MBA|13','Cytogenetic Technologist|Examines chromosomes under the microscope.|Microscopy, patience|B.S. in genetics|42','Toxicology Analyst|Detects drugs and toxins in samples.|Chromatography, validation|B.S. in chemistry|41'].map(R),
 qs:[
  Q('A gel shows an unexpected band.',['Re-run it carefully with controls',4],['Hypothesize a new variant',0],['Ask a teammate to double-check',2],['Report it honestly with caveats',3]),
  Q('A rapid test gives a few false positives.',['Decide whether to pull the batch',1],['Redesign the probe',0],['Patiently analyze sample prep',4],['Explain the limits to users clearly',3]),
  Q('A hospital needs results in one hour.',['Streamline the workflow with the team',2],['Prioritize the urgent samples',1],['Invent a faster assay step',0],['Be transparent about accuracy tradeoffs',3]),
  Q('Evidence in a case sample is very limited.',['Work slowly to avoid contamination',4],['Try a newer amplification method',0],['Coordinate with investigators',2],['Document the chain of custody',3]),
  Q('Two labs report different results for one sample.',['Compare both methods side by side',4],['Propose a new reference method',0],['Hold a meeting to align the labs',2],['Decide which result to trust',1])]}];
const FLOORS=[['F3',[0,4]],['F2',[1,2]],['F1',[3]]];

/* vector icons (32x32, stroked) */
const IC={dna:'M8 2c0 9 16 11 16 28M24 2c0 9-16 11-16 28M10 9h12M10 23h12',flask:'M12 3h8M14 3v10L5 28h22L18 13V3M9 22h14',leaf:'M4 28C4 12 14 4 28 4c0 14-8 24-24 24zM4 28 18 14',drop:'M16 3C10 12 7 16 7 20a9 9 0 0 0 18 0c0-4-3-8-9-17z',fish:'M3 16c6-9 15-9 20 0-5 9-14 9-20 0zM23 16l6-6v12z',bars:'M5 28V14M12 28V6M19 28V18M26 28V10',globe:'M16 4a12 12 0 1 0 0 24 12 12 0 0 0 0-24zM4 16h24M16 4c-6 8-6 16 0 24M16 4c6 8 6 16 0 24'};
const icon=(k,cls='fl',st='')=>`<svg class="${cls}" style="${st}" viewBox="0 0 32 32" aria-hidden="true"><path d="${IC[k]}"/></svg>`;
const decor=s=>`<div class="decor" aria-hidden="true">${Array.from({length:8},(_,i)=>icon(s.ic[i%2],'fl',`left:${(i*13+4)%92}%;top:${(i*29+8)%78}%;animation-duration:${6+i%4}s;animation-delay:-${i*1.3}s`)).join('')}</div>`;

/* sprites: flat vector characters */
/* ART SLOT: replace assets/sprites/character-placeholder.svg with your own pixel sprite.
   Add separate files for NPCs later and change the src path here if desired. */
const spr=(c,l,hair='#0f172a')=>`<img class="spr sprite-placeholder" src="assets/sprites/character-placeholder.svg" alt="${l} — placeholder sprite; replace in assets/sprites/" draggable="false">`;
const NATALIE=spr('#0f172a','Natalie, facility director','#64748b'), PLAYER=spr('#38bdf8','You');
const say=(sp,who,txt,extra='')=>`<div class="scene">${sp}<div class="bubble glass"><b>${who}</b><p>${txt}</p>${extra}</div></div>`;

const G={sec:0,team:[],tr:[0,0,0,0,0],sourceTraitScores:{},q:0,res:{}};
const stage=$('#stage');
let raf=0;
function draw(theme,html,sec){
  cancelAnimationFrame(raf);
  stage.className='stage '+theme;
  stage.innerHTML=(sec?decor(sec):'')+html;
  const f=stage.querySelector('button');f&&f.focus({preventScroll:true});
}

/* ---- 1. facility entry: walk with arrow keys ---- */
const K={},NPC={x:57,y:66},P={x:12,y:88,f:1};
function entry(){
  P.x=12;P.y=88;
  const wins=[0,1,2,3,4,5,6,7].map(i=>[92,132].map(y=>`<rect x="${48+i*42}" y="${y}" width="28" height="26" fill="#bae6fd" stroke="#334155" stroke-width="2"/>`).join('')).join('')+[0,1,2,5,6,7].map(i=>`<rect x="${48+i*42}" y="172" width="28" height="26" fill="#bae6fd" stroke="#334155" stroke-width="2"/>`).join('');
  draw('th-entry',`
  <div class="dpad"><button class="btn alt" data-g="hub">Skip walking</button><span class="note">Use the arrow keys or WASD to walk to the entrance, or use the buttons:</span>
   ${[['ArrowLeft','◀'],['ArrowUp','▲'],['ArrowDown','▼'],['ArrowRight','▶']].map(([k,s])=>`<button class="btn alt" data-pad="${k}" aria-label="Move ${k.slice(5).toLowerCase()}">${s}</button>`).join('')}</div>
  <div class="art-slot-note">PIXEL ART SLOT: replace <code>assets/sprites/character-placeholder.svg</code> with your character art. The world is playable before custom art is added.</div>
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

/* ---- 2. walkable top-down research campus ----
   ART SLOTS: replace assets/sprites/character-placeholder.svg and add campus background/building art in assets/sprites/.
   Team Builder intentionally remains a separate screen. */
let campusRAF=0,campusLast=0;const CP={x:50,y:81,speed:24};
function hub(){
  cancelAnimationFrame(campusRAF);
  draw('th-hub',`<div class="hud"><h3>Bioquest Research Campus</h3><span class="count">WASD / ARROWS · E TO ENTER</span></div>
  <p>Explore the campus. Walk to a building and press E to enter its separate Team Builder and quiz screens. The quiz content is organized into five areas; Agricultural and Environmental share one quiz.</p>
  <div class="art-slot-note"><b>ART SLOT:</b> Background: <code>assets/backgrounds/biotech-campus-background.png</code>. Player: <code>assets/sprites/character-placeholder.svg</code>. Your pixel font goes in <code>assets/fonts/</code>; update the <code>@font-face</code> URL in the style block.</div>
  <div class="campus-hud"><span id="campus-msg" aria-live="polite">Explore the campus and approach a research building.</span><button class="btn alt" data-g="entry">Return to entrance</button></div>
  <div class="campus" id="campus" tabindex="0" aria-label="Fixed walkable campus. Use arrow keys or WASD, then E to enter a nearby building.">
    ${SECT.map((s,i)=>`<button class="campus-building" data-campus="${i}" data-room="${i}" aria-label="Approach ${s.n} building">${s.n}</button>`).join('')}
    <div class="campus-player" id="campus-player" style="left:${CP.x}%;top:${CP.y}%"><img src="assets/sprites/character-placeholder.svg" alt="Player character placeholder"></div>
  </div>
  <p class="note">The campus stays visible while you walk. Move with WASD or arrow keys; press E near a highlighted building.</p>
  <div class="dpad" aria-label="Movement controls">${[['ArrowLeft','◀'],['ArrowUp','▲'],['ArrowDown','▼'],['ArrowRight','▶']].map(([k,v])=>`<button class="btn alt" data-campus-pad="${k}" aria-label="Walk ${k.slice(5).toLowerCase()}">${v}</button>`).join('')}<button class="btn" data-campus-enter>Enter nearby building</button></div>`);
  CP.x=50;CP.y=61;campusLast=performance.now();
  const canvas=$('#campus'),player=$('#campus-player');
  const hotspots=[{x:19,y:29},{x:81,y:28},{x:26,y:55},{x:80,y:56},{x:59,y:80},{x:27,y:80}];
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
  <p>Select a role to read about it, then add it to your team.</p><p class="art-slot-note">ART SLOT: character sprites are loaded from <code>assets/sprites/</code>. Keep gameplay logic in this HTML; swap art files independently.</p>
  <div class="roles">${s.roles.map((r,i)=>`<button class="role ${G.team.includes(i)?'in':''}" data-role="${i}" aria-pressed="${G.team.includes(i)}">${r.n}</button>`).join('')}</div>
  <button class="btn" data-g="quiz" ${n<6?'disabled':''}>Continue to scenarios</button> <button class="btn alt" data-g="hub">Back to facility</button>`,s);
}
function roleModal(i){
  const r=SECT[G.sec].roles[i],has=G.team.includes(i);
  openModal(`<h3>${r.n}</h3><p>${r.d}</p><p><b>Key skills:</b> ${r.k}</p><p><b>Education:</b> ${r.e}</p><button class="btn" data-toggle="${i}" ${!has&&G.team.length>=6?'disabled':''}>${has?'Remove from team':'Add to Team'}</button>`);
}


/* SOURCE QUIZ CONTENT: based on the user's Pasted text.txt. Missing choices/scoring are authored to complete playable scenarios. */
const QUIZ_AREAS = [
 {name:'Pharma/Medical', scenarios:[
  {title:'R&D finance',dialogue:'“We have been struggling to find investors for our product. We reached out to many investors, and venture capitalists. Although we already have a few, we do not have enough funding to continue in our product development.” “The company officials informed us that their satisfactory requirements have tightened, and it needs to be worth investing in the long-run. We tried so many times, what should we do?”',answers:[
   ['Re-enter the lab, and collect stronger data in order to prove to investors through numbers its long-term efficacy','Scientific Curiosity','Precision'],
   ['We need to rethink what we have, sharpen our ideas, take a look at our pitch deck and make the model targeted to these corporate partners.','Strategic Thinking','Communication'],
   ['Decide to scratch your teams whole idea and start again','Innovation','Risk Taking'],
   ['Bring the research, business, and development team into one big meeting together and find a solution that addresses many concerns','Collaboration','Risk Taking']]},
  {title:'Testing',dialogue:'“Your startup has been testing a potential drug.Your team has collected weeks of data, however something doesn’t add up: the drug works extremely well in one group of cells but barely works in the other”. Quality Control Analyst: “We didn’t expect this, we know our numbers are right, but we don’t know what’s causing this”',answers:[
   ['Run another set of experiments to see if the same pattern happens again','Precision','Scientific Curiosity'],
   ['Go back to the results and scope for a pattern that would explain why the response are different','Analytical Thinking','Scientific Curiosity'],
   ['Take a step back, analyse whether this difference could be something useful about who the drug might be best for.','Impact Orientation','Clinical Thinking'],
   ['Closely investigate the two groups of cells for differences','Scientific Curiosity','Analytical Thinking']]},
  {title:'Manufacturing: inconsistency in batches',dialogue:'“We have been preparing for large-scale production. We have made so many batches of drugs but something’s wrong: when we were storing the batches, we realized that the cell competency lost 55% of its viability!”',authored:true,answers:[
   ['Repeat stability tests under controlled storage conditions to confirm the 55% viability loss and document when it begins.','Precision','Scientific Curiosity'],
   ['Investigate the storage conditions and biological mechanisms that may be causing the loss of viability.','Scientific Curiosity','Analytical Thinking'],
   ['Redesign the formulation or storage process, then test whether the change improves viability.','Innovation','Precision'],
   ['Bring quality control, manufacturing, and research together to identify the cause before scaling production.','Collaboration','Analytical Thinking']]},
  {title:'FDA approval',dialogue:'“A product you and your team have been working on developing for the past few months finally makes it to the stage of getting FDA approval. The reviewers request additional documentation before making an official decision.”',authored:true,answers:[
   ['Review the request line by line and prepare a complete, well-organized response using the existing evidence.','Precision','Analytical Thinking'],
   ['Run additional studies to address the evidence gaps identified by the reviewers.','Scientific Curiosity','Precision'],
   ['Meet with the regulatory team to clarify the request and coordinate a response across departments.','Communication','Collaboration'],
   ['Reassess the submission timeline and prioritize the missing documentation that is most important to the decision.','Strategic Thinking','Impact Orientation']]}
 ]},
 {name:'Agricultural and Environmental',scenarios:[
  {title:'Drought-resistant corn',dialogue:'We are trying to genetically engineer a corn line so it is drought-resistant. It turns out that the plant is able to grow under dry weather, but it produces 35% less seeds than expected because something malfunctioned with the edited gene.',answers:[
   ['Consider whether the trade-off could be useful in other environmental conditions and re-shape the purpose of the product','Impact Orientation','Innovation'],
   ['Redesign the experiment and test a different version of the genetic modification','Innovation','Scientific Curiosity'],
   ['Analyze the growth data to determine when the plants began performing differently to make connections','Analytical Thinking','Precision'],
   ['Closely examine what happened to the edited gene and determine why it affected seed production','Scientific Curiosity','Analytical Thinking']]},
  {title:'Biofertilizer storage',dialogue:'To help the drought-resilient corn to grow under these conditions, the team has developed a biofertilizer that can help absorb the soil. While we were trying to store the product, we learned it loses 65% of its viability when it’s left for 30 days. How will we be able to prepare for large-scale production?',answers:[
   ['Monitor and Track storage temperature, moisture, and time metrics to find the exact point where the biofertilizer starts to degrade rapidly','Precision','Analytical Thinking'],
   ['Work with the supply chain logistics team to move the product quickly from production facility to farms','Impact Orientation','Innovation'],
   ['Redesign the formula or delivery systems so the biofertilizer stays stable in storing for longer periods of time','Innovation','Precision'],
   ['Investigate the chemical breakdown process in the lab to identify why the components derided after 30 days and what could be prevented','Scientific Curiosity','Analytical Thinking']]},
  {title:'Regulatory standards for gene-edited traits',dialogue:'Midway through the regulation process, the agency changed their standards for gene-edited traits, demanding that our product needs stronger research to back up our idea.',answers:[
   ['Collect more evidence to proof long-term safety through analysing biological mechanisms','Scientific Curiosity','Precision'],
   ['Review the new regulatory criteria, comparing it to our dataset to identify any gaps','Precision','Analytical Thinking'],
   ['Outline new field trials to gather more evidence as needed for approval','Analytical Thinking','Impact Orientation'],
   ['Use the existing evidence into alternative regulatory frameworks or change the focus towards different markets with existing approvals','Impact Orientation','Innovation']]},
  {title:'Marketing',dialogue:'Our drought-resistant corn is now ready to go into the market, but because production costs were so high, the seeds are priced 15% higher than the average hybrid crop. Thus, farmers are reluctant to buy the product.',answers:[
   ['Fix the manufacturing pipeline and see where we can cut costs per unit and lower the wholesale seed price','Precision','Innovation'],
   ['Calculate the long-term saving during drought years to demonstrate the return on investment (ROI) to farmers and hopefully convince them to buy the product','Analytical Thinking','Impact Orientation'],
   ['Survey farmers to understand their economic concerts and compare this behavior across regions to tailor our product back to their wants and needs','Scientific Curiosity','Precision'],
   ['Partner with insurance providers or create a money-back guarantee model tied to severe climate change effects','Innovation','Impact Orientation']]},
  {title:'Consumer brand backlash / sales',dialogue:'We received results from our surveys from the people, and most farmers and consumers responded that they did not feel comfortable purchasing or consuming the product because it was genetically engineered.',answers:[
   ['Survey demographics and data to target specific regions or groups most open to biotechnology to focus marketing efforts on them','Analytical Thinking','Precision'],
   ['Launch a transparent campaign explaining the science and safety testing behind the gene editing to alleviate any concerns','Precision','Scientific Curiosity'],
   ['To build trust, host Q&A sessions and interactive workshops to hear concerns from the communities directly','Scientific Curiosity','Impact Orientation'],
   ['Re-evaluate the product strategy to focus on non-food applications','Impact Orientation','Innovation']]}
 ]},
 {name:'Regulatory',scenarios:[
  {title:'R&D: choosing the training database',dialogue:'The team wants to develop an AI monitoring platform that tracks gene-edited organisms in environmental and industrial settings to ensure they align with global regulatory standards. Before writing the code for the AI platform, we need to define what it needs to look for? Project Manager: How do we select our target training database?',answers:[
   ['Build a more advanced AI model that predicts many possible artificial gene edits, even if that takes extra years so code','Scientific Curiosity','Innovation'],
   ['Stick strictly to official government databases that list known high-risk pathogens and GMOs to ensure legal alignment','Precision','Analytical Thinking'],
   ['Use an open-source DNA library to build a working prototype and launch the software onto the market faster','Impact Orientation','Innovation'],
   ['Partner with universities and organizations to create a free, crowdsourced genetic database open to all researchers','Innovation','Scientific Curiosity']]},
  {title:'False alerts in field tests',dialogue:'During early field tests around the lab, the model misinterprets harmless soil bacteria that is naturally occurring as an invasive gene-edited crop, triggering a false alert and panic system. How can we fix the system?',answers:[
   ['Rewrite the core algorithm using another DNA verification filter to eliminate this problem','Innovation','Analytical Thinking'],
   ['Add a mandatory manual review step where a human biosafety officer must verify alerts before notifying authorities','Precision','Impact Orientation'],
   ['Lower the sensitivity setting so the software only flags exact matches, avoiding costly false alarms','Impact Orientation','Precision'],
   ['Look into the genomic data of the bacteria in the soil to identify specific base pairs causing this','Analytical Thinking','Scientific Curiosity']]},
  {title:'DNA privacy versus inspection',dialogue:'Biotech companies voice that if they use our platform demand that their valuable DNA sequences must be encrypted. However, government inspectors say they would need full visibility into their DNA feeds to verify safety.',answers:[
   ['Make a secure, high-clearance workflow where only third-party inspectors can view decrypted data','Analytical Thinking','Precision'],
   ['Host a roundtable between tech executives and regulators to draft a data privacy standard','Impact Orientation','Scientific Curiosity'],
   ['Implement cryptographic proofs so regulators can verify compliance without viewing the raw sequence data','Innovation','Precision'],
   ['Design a standard, anonymized data summary that satisfies regulatory requirements while hiding proprietary code','Precision','Analytical Thinking']]},
  {title:'Different regulatory classifications',dialogue:'European regulators claim our product as a heavy-duty “biosecurity device” requiring 3 more years of testing before anyone can use it. US regulators treat it as an software “Data Analytics tool” and it can be put into the market. Market person: We really want to prioritize market expansion, what can we do?',answers:[
   ['Create two distinct softwares, one biosecurity version for Europe and an analytics version for the US','Innovation','Analytical Thinking'],
   ['Work directly with European regulators to change testing protocols and get approval through targeted safety data','Precision','Scientific Curiosity'],
   ['Conduct a detailed regulatory impact assessment to evaluable long-term brand positioning and legal risks across both markets if we release the product now or wait.','Analytical Thinking','Precision'],
   ['Launch immediately into the US to quickly gain revenue and feedback while running European trials at the same time','Impact Orientation','Innovation']]},
  {title:'Pricing for smaller labs',dialogue:'Smaller university labs and startups complain that the subscription fees are too expensive, but bigger companies can afford the software. How can we handle pricing?',answers:[
   ['Analyze user usage data across tier sizes to make a flexible plan where they pay per scan, so they don’t have to buy a full subscription','Analytical Thinking','Precision'],
   ['Partner with agencies for grants to subsidize software licenses','Scientific Curiosity','Impact Orientation'],
   ['Introduce a tiered pricing model that offers free tools to academic labs while charging higher prices for more advanced features','Impact Orientation','Innovation'],
   ['Reduce the amount of features and introduce software packages to tailor to smaller labs and project','Innovation','Precision']]}
 ]},
 {name:'Detection',scenarios:[
  {title:'Sequencer accuracy in blood samples',dialogue:'Manager: We will engineer a portable DNA sequencer to identify unknown bacterial pathogens in clinical samples efficiently and in a timely manner. It turned out that while the sequencing chemistry works well on pure bacterial cultures, the instrument misidentifies sequences 35% of the time when processing complex human blood samples. Bioinformatic: What do we do?',answers:[
   ['Fix and correct the lab sample extraction protocols to clean and isolate the bacterial DNA before it enters the channel','Precision','Analytical Thinking'],
   ['Investigate the chemical binding behavior in the blood components to understand why the reading accuracy is lower than expected','Scientific Curiosity','Innovation'],
   ['Train a new bioinformatics model to filter out human DNA contamination before analyzing the bacterial sequences','Innovation','Precision'],
   ['Examine the error logs to pinpoint which genomic regions are most misidentified in blood matches','Analytical Thinking','Scientific Curiosity']]},
  {title:'Silicon chip supply setback',dialogue:'In our sequencer it needs specialized sensors and our factory relied on pure, high-grade silicon chips. While scaling up, our primary supplier experienced a major production setback, resulting in a 58% supply drop. How will we be able to prepare for large-scale production',answers:[
   ['Run more precise stress tests on lower-grade chips to identity which quality standard we need for reliable performance','Analytical Thinking','Precision'],
   ['Negotiate priority contracts with different global foundries and adjust assembly timelines to match supply rates','Impact Orientation','Precision'],
   ['Research alternate semiconductor materials to see if it can replace our silicon sensors','Scientific Curiosity','Innovation'],
   ['Redesign the sensor so it can use widely available, standard grade silicon to cut costs without sacrificing performance.','Innovation','Impact Orientation']]},
  {title:'Rare mutation accuracy standards',dialogue:'Midway through the process, the regulatory agency updated its standards for sequencing platforms, demanding that our instrument needs to have a higher accuracy rate on rare genomic mutation before getting official approval.',answers:[
   ['Engage with regulatory officers to petition for a phased approval process based on primary clinical use cases','Impact Orientation','Innovation'],
   ['Research biochemical mechanisms behind the mutation miscalls to improve base accuracy','Scientific Curiosity','Analytical Thinking'],
   ['Design targeted studies focused on low-frequency, rare genomic mutations to satisfy agency demands','Precision','Impact Orientation'],
   ['Re-analyze existing sequencing validation data using stricter statistical standards to prove current accuracy limits','Analytical Thinking','Precision']]},
  {title:'Sequencer launch price',dialogue:'Our DNA sequencer is now ready to be launched into the market. However, that supply setback and using those high-grade chips made the manufacturing cost super high. The instrument is now priced 20% more than traditional competitors. How do we fix this',answers:[
   ['Re-engineer the device body and storing components to cut total manufacturing costs by 15%','Precision','Innovation'],
   ['Launch a trade-in program of leasing equipment model to reduce upfront costs','Impact Orientation','Innovation'],
   ['Build a Return on Investment projection models to show how effective and faster diagnosis speeds reduce overall hospital stay costs to justify','Analytical Thinking','Impact Orientation'],
   ['Conduct market research to determine which diagnostic features clinicians value most and tailor our product to that','Scientific Curiosity','Precision']]},
  {title:'Pricing for smaller labs',dialogue:'Smaller companies, startups, and universities are reluctant to purchase our product because of the costs and deem it unfair because it seems only bigger companies can afford it. We really prioritize market expansion, and we know the impact it can have, how can we fix this.',answers:[
   ['Track costs per run across different lab sizes to make a tiered pay per sample pricing','Analytical Thinking','Precision'],
   ['Create grant partnerships and academic discount programs for resource-constrained research centers to increase market expansion','Impact Orientation','Precision'],
   ['Survey startup labs to understand their operational limits beyond the purchase price','Scientific Curiosity','Analytical Thinking'],
   ['Make a model where smaller labs can rent processing capacity on demand rather than buying a subscription or units','Innovation','Impact Orientation']]}
 ]},
 {name:'Marine',scenarios:[
  {title:'Deep-sea kelp enzyme extraction',dialogue:'Manager: “We are trying to extract and synthesize a growth enzyme from deep-sea kelp to create a biostimulant that maximizes ocean crop growth. It turns out that while the enzyme yields plant growth significantly, the current process to extract the kelp damages 40% of active proteins, making the yield far less than expected',answers:[
   ['Refine temperature and pH controls step-by-step during processing to preserve protein stability','Precision','Analytical Thinking'],
   ['Study the structural properties of the deep-sea enzymes to understand why pressure changes disrupt their viability','Scientific Curiosity','Innovation'],
   ['Develop a low-shear extraction method that protects protein structure during harvest','Innovation','Precision'],
   ['Map protein points throughout the extraction pipeline to identify where damage occurs','Analytical Thinking','Scientific Curiosity']]},
  {title:'Biostimulant storage',dialogue:'For storing our biostimulant, technicians from our team used large outdoor tanks to cultivate the algae host. However, while storing the batches, we learned that the product loses 50% of its viability within 20 days. How will we be able to prepare large-scale production',answers:[
   ['Redesign the storage containers with automated climate controls and bio-preservative formulations to maximize shelf life','Innovation','Precision'],
   ['Change the cultivation model so the product is grown closer to local ocean farmers, cutting storage times','Impact Orientation','Innovation'],
   ["Perform daily degradation assays to model the when the batch's viability start to decline under different storage conditions",'Precision','Analytical Thinking'],
   ['Investigate the metabolic pathways of the algae host to know why active compounds break down rapidly in storage','Scientific Curiosity','Analytical Thinking']]},
  {title:'Coastal runoff safety',dialogue:'Through our environmental safety review, the regulatory agency informed us that they have updated their rules regarding ocean-harvested materials. They explicitly told us that our product needs more proof that it leaves less than 10% of residues in coastal runoff before approval. Regulatory person: “With this updated policy, this would slow us down by several years, maybe even 4!”',answers:[
   ['Design precise runoff simulation models and environmental assays to gather residue evidence required','Precision','Analytical Thinking'],
   ['Reformulate the compound so it binds more tightly to ocean crops and naturally breaks down in water faster','Innovation','Precision'],
   ['Work with environmental regulators to establish a real-time coastal monitoring program in place of long delays','Impact Orientation','Innovation'],
   ['Research the biological degradation rates of the residue in natural marine environments to demonstrate ecological safety','Scientific Curiosity','Analytical Thinking']]},
  {title:'Biostimulant market price',dialogue:'Our product is finally ready to enter the market after long periods of testing. Since the research and development phase, testing, processing, and harvesting was very costly, our final product is priced 20% higher than traditional chemical alternatives. Marketing Analyst: Now people are reluctant to buy it, and we need more buyers to get profit to recuperate from the costs!',answers:[
   ['Conduct controlled field trials to calculate crop yield improvements and demonstrate long-term ROI to ocean farmers.','Analytical Thinking','Impact Orientation'],
   ['Create a risk-sharing trial program where farmers pay a reduced rate until harvest goals are successfully met.','Impact Orientation','Innovation'],
   ['Streamline processing steps to reduce total production overhead and bring retail pricing down toward chemical alternatives.','Precision','Innovation'],
   ['Analyze farm purchasing habits to target high-yield aquaculture sectors that are less price-sensitive.','Scientific Curiosity','Precision']]},
  {title:'Concerns about kelp harvesting',dialogue:'From our marketing surveys, results show that many responded that they were uncomfortable with using the product because they believe harvesting deep-sea kelp harms coral reefs and ocean ecosystems. How do we change the perspective?',answers:[
   ['Launch a public transparency campaign demonstrating sustainable off-shore aquaculture harvesting methods.','Precision','Impact Orientation'],
   ['Shift primary sourcing to land-based bioreactors that synthesize the enzyme without harvesting wild kelp beds.','Innovation','Impact Orientation'],
   ['Publish independent ecological impact data showing zero harm to nearby reef systems during harvest operations.','Analytical Thinking','Precision'],
   ['Host community panels with ocean conservation groups to gather feedback and co-design sustainable harvesting guidelines.','Scientific Curiosity','Impact Orientation']]}
 ]}
];
const QUIZ_TRAIT_MAP = {
 'Innovation':0,'Risk Taking':0,'Scientific Curiosity':4,'Precision':4,'Quality':4,
 'Analytical Thinking':1,'Strategic Thinking':1,'Impact Orientation':1,'Clinical Thinking':1,
 'Collaboration':2,'Communication':3
};
const quizAreaIndex = sector => ({0:0,1:1,2:1,3:2,4:4,5:3})[sector] ?? 0;

/* ---- 4. scenario quiz ---- */
function quiz(){
  const area=QUIZ_AREAS[quizAreaIndex(G.sec)],q=area.scenarios[G.q];
  draw(SECT[G.sec].th,`<div class="hud"><h3>${area.name}</h3><span class="count">Scenario ${G.q+1}/${area.scenarios.length}</span></div>
  ${say(spr(SECT[G.sec].c,SECT[G.sec].m),q.title,q.dialogue,`<div class="ans">${q.answers.map((a,i)=>`<button data-ans="${i}">${String.fromCharCode(65+i)}. ${a[0]}</button>`).join('')}</div>${q.authored?'<p class="note">Added content: these answer choices and scoring were drafted to complete the source scenario.</p>':''}`)}`,SECT[G.sec]);
}
/* ---- 5. results ---- */
function compat(i,tr,tm){
  const s=SECT[i],t=tr.slice();tm.forEach(k=>t[s.roles[k].t[0]]+=1);
  const o=[...t].sort((a,b)=>b-a),den=2*o[0]+o[1]||1;
  return{t,list:s.roles.map(r=>({r,p:Math.min(100,Math.round(100*(2*t[r.t[0]]+t[r.t[1]])/den))})).sort((a,b)=>b.p-a.p)};
}
function result(i){
  const s=SECT[i],{t,list}=G.res[i],best=list[0],top=t.map((v,k)=>[v,k]).sort((a,b)=>b[0]-a[0]),mx=top[0][0]||1;
  draw(s.th,`<div class="prof glass"><p class="note">${s.n} · your best-fit career match</p>
  <div class="best">${best.r.n} · ${best.p}%</div><p>${best.r.d} Typical education: ${best.r.e}.</p>
  <h4>Compatibility across ${s.n} roles</h4>
  ${list.slice(0,6).map(x=>`<div class="pct"><span>${x.r.n}</span><div class="bar2"><i style="width:${x.p}%"></i></div><b>${x.p}%</b></div>`).join('')}
  <h4>Score breakdown from your choices</h4>
  ${top.map(([v,k])=>`<div class="pct"><span>${TRAITS[k]}</span><div class="bar2"><i style="width:${Math.round(v/mx*100)}%"></i></div><b>${v}</b></div>`).join('')}
  <h4>Personality traits from your quiz choices</h4>${Object.entries(G.sourceTraitScores).sort((a,b)=>b[1]-a[1]).map(([name,score])=>`<div class="pct"><span>${name}</span><div class="bar2"><i style="width:${Math.round(score/(Math.max(1,...Object.values(G.sourceTraitScores))*1)*100)}%"></i></div><b>${score}</b></div>`).join('')}
  <h4>Recommended majors</h4><ul><li>${MAJORS[top[0][1]][0]}</li><li>${MAJORS[top[1][1]][0]}</li></ul>
  <h4>Career pathway</h4><p>${s.path}</p>
  <h4>Training &amp; education programs to explore</h4><ul>${s.prog.map(p=>`<li>${p}</li>`).join('')}</ul>
  <p class="note">Results are exploratory guidance tools based on choices made in the game.</p></div>
  <p style="text-align:center"><button class="btn" data-g="hub">Explore another sector</button> <button class="btn alt" data-g="restart">Play again</button></p>`,s);
}

/* ---- events ---- */
stage.addEventListener('mouseover',e=>{const r=e.target.closest('[data-room]');if(r)showMgr(+r.dataset.room)});
stage.addEventListener('focusin',e=>{const r=e.target.closest('[data-room]');if(r)showMgr(+r.dataset.room)});
stage.addEventListener('click',e=>{
  const t=e.target.closest('button');if(!t)return;const d=t.dataset;
  if(d.campus!==undefined){enterCampus(+d.campus);return}
  if(d.campusEnter!==undefined){if(G.nearCampus>=0)enterCampus(G.nearCampus);else $('#campus-msg').textContent='Move closer to a building first.';return}
  if(d.campusPad){K[d.campusPad]=1;setTimeout(()=>delete K[d.campusPad],220);return}
  if(d.room!==undefined)showMgr(+d.room);
  else if(d.enter!==undefined){G.sec=+d.enter;G.team=[];G.tr=[0,0,0,0,0];G.sourceTraitScores={};G.q=0;team()}
  else if(d.view!==undefined)result(+d.view);
  else if(d.role!==undefined)roleModal(+d.role);
  else if(d.ans!==undefined){
    const area=QUIZ_AREAS[quizAreaIndex(G.sec)],a=area.scenarios[G.q].answers[+d.ans];
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
  stage.querySelector(`[data-role="${i}"]`).focus();
});
entry();

/* ================= MAP ================= */
/* County outlines traced from the supplied NJ map (viewBox 0 0 500 949) */
const COUNTIES={"Sussex":{"d":"M245,2L238,11L234,11L231,14L231,17L218,31L209,50L212,54L205,69L191,86L175,97L172,104L176,107L182,103L189,110L240,173L251,170L259,178L274,169L280,160L278,156L279,151L360,59L270,2Z","cx":263,"cy":84},"Warren":{"d":"M182,103L168,111L159,125L145,131L131,142L130,150L134,154L140,167L147,174L147,180L154,189L154,193L151,196L143,196L141,198L144,209L137,219L130,225L121,223L111,235L115,244L110,253L109,261L115,268L109,276L112,279L113,284L109,290L114,299L127,284L136,281L156,264L179,252L200,226L217,214L225,202L224,199L230,192L229,186L240,174Z","cx":171,"cy":195},"Passaic":{"d":"M361,59L320,105L324,110L320,123L322,125L326,121L335,119L350,133L358,135L363,134L371,139L378,139L386,150L386,160L382,168L389,175L389,182L392,185L399,187L430,209L432,207L432,195L435,191L428,179L429,171L424,162L426,153L419,147L409,148L396,144L387,132L405,86Z","cx":379,"cy":125},"Bergen":{"d":"M406,86L387,132L400,146L411,148L418,146L426,153L424,161L427,165L426,167L430,171L429,183L436,193L432,197L432,207L427,212L427,219L425,222L433,229L436,226L440,227L450,215L456,214L463,208L473,219L482,205L493,177L497,161L497,138Z","cx":447,"cy":154},"Morris":{"d":"M319,106L279,152L278,155L280,161L274,169L264,177L262,176L259,178L251,171L247,171L238,176L229,185L230,194L224,200L225,203L220,211L206,223L224,240L240,242L251,249L302,234L316,256L316,259L311,264L311,270L314,276L321,271L329,269L358,241L360,236L357,233L359,220L369,210L370,198L373,194L367,187L368,178L373,175L381,176L385,179L388,174L382,169L386,157L385,150L378,140L370,139L362,134L353,135L346,129L343,130L335,119L327,121L323,125L320,122L323,110Z","cx":307,"cy":193},"Essex":{"d":"M372,176L368,182L368,188L373,194L370,203L371,205L369,207L370,209L360,219L358,232L362,236L359,240L370,249L379,251L382,248L385,248L393,252L402,253L408,261L420,260L428,265L435,255L432,249L433,242L428,240L425,243L422,243L419,240L420,232L427,218L428,209L398,187L393,186L387,180Z","cx":395,"cy":223},"Hudson":{"d":"M468,213L463,210L458,214L451,215L445,220L439,229L436,226L432,229L426,224L423,227L419,240L422,243L430,240L433,243L433,252L435,256L420,279L422,281L452,277L455,274L463,256L466,234L474,220Z","cx":446,"cy":246},"Union":{"d":"M332,268L335,274L340,270L343,272L346,271L349,274L343,287L334,295L336,297L375,292L381,298L398,294L401,296L404,294L409,299L411,297L409,292L410,284L415,279L419,280L427,266L420,261L409,262L401,253L384,248L380,251L374,249L371,250L359,242L343,255Z","cx":377,"cy":273},"Hunterdon":{"d":"M205,223L200,226L188,243L170,259L165,259L150,269L137,281L130,283L111,301L112,306L116,310L123,311L128,307L135,307L140,309L149,319L150,343L148,345L150,365L153,369L162,374L172,371L180,377L187,397L211,395L213,392L210,385L213,382L227,380L229,378L228,370L231,367L243,365L245,363L234,336L239,331L247,314L254,307L256,303L253,300L254,294L259,288L252,281L254,275L251,270L255,264L253,262L255,257L254,251L239,242L222,239Z","cx":196,"cy":309},"Somerset":{"d":"M302,234L257,247L254,250L256,256L254,258L255,264L252,270L255,275L253,281L259,287L253,299L256,303L234,336L251,378L255,383L273,377L282,379L286,383L294,375L294,368L310,358L332,337L315,318L312,308L318,301L323,301L340,290L345,283L349,272L347,270L344,273L339,271L336,274L330,268L315,276L310,269L312,267L311,263L316,257L310,249L311,246L305,241Z","cx":285,"cy":310},"Middlesex":{"d":"M404,295L393,295L382,299L376,293L368,293L342,297L328,297L324,301L318,302L313,307L312,311L332,337L308,360L294,368L294,376L282,389L281,397L283,401L304,416L308,417L312,415L319,421L322,421L325,424L325,429L329,432L351,421L354,413L395,371L395,361L403,353L391,345L391,340L394,337L394,331L398,326L396,317L399,314L404,314L408,308L409,300Z","cx":347,"cy":358},"Mercer":{"d":"M187,399L208,415L215,432L219,436L231,442L238,448L241,457L250,465L253,473L258,467L256,461L260,458L285,475L290,476L292,472L286,460L289,457L293,459L299,457L310,443L325,434L325,424L323,422L318,421L311,416L308,418L306,416L304,417L283,401L281,398L281,392L284,382L281,379L274,377L255,383L245,365L230,367L228,369L229,377L226,380L212,382L210,385L213,392L210,395L189,397Z","cx":258,"cy":420},"Monmouth":{"d":"M473,347L465,341L462,344L466,350L466,355L469,358L469,362L465,366L455,364L429,350L421,353L415,349L409,356L405,352L395,362L396,368L392,375L359,408L350,422L332,432L327,432L321,438L309,444L299,457L292,460L289,458L287,460L302,495L305,498L311,495L348,462L389,464L396,475L397,484L400,487L416,486L425,490L438,477L441,480L443,490L447,494L456,488L460,490L462,488L474,437L479,406L480,384L478,358Z","cx":405,"cy":427},"Ocean":{"d":"M348,463L304,500L353,617L353,688L351,695L345,700L345,705L349,709L354,722L357,725L369,722L376,726L387,722L401,703L426,659L442,625L452,541L461,492L458,489L455,489L448,495L442,489L441,481L437,477L425,491L413,486L400,487L396,483L397,479L390,464Z","cx":387,"cy":576},"Burlington":{"d":"M153,526L150,531L152,533L156,531L162,532L167,537L164,542L165,549L168,552L173,553L176,556L175,558L183,564L184,568L190,574L198,610L202,615L217,611L227,614L240,629L270,654L272,660L272,673L276,676L284,676L298,687L302,687L311,698L316,697L328,705L335,702L338,704L343,704L351,695L353,688L353,618L332,570L312,517L296,481L292,476L289,477L284,475L265,461L259,459L257,461L259,465L253,473L251,472L248,475L243,475L235,481L223,478L218,487L209,496L199,500L189,501L176,509L167,519L160,521Z","cx":269,"cy":577},"Camden":{"d":"M150,532L146,536L136,539L127,547L127,560L129,565L126,571L144,591L145,595L143,601L147,606L147,610L144,613L147,616L150,613L154,617L156,622L163,629L163,635L173,644L186,647L194,655L198,673L206,682L248,635L241,630L227,614L218,611L202,615L198,611L190,575L184,569L183,564L174,557L175,555L165,549L165,536L158,531L155,533Z","cx":181,"cy":606},"Gloucester":{"d":"M42,606L43,608L41,610L49,615L50,618L48,621L56,629L56,635L62,641L83,654L90,653L97,661L109,659L173,719L205,683L197,671L196,660L191,652L185,647L174,645L162,634L162,629L156,623L152,614L147,617L143,614L147,607L142,602L144,591L132,581L126,572L114,573L104,581L88,586L72,585L65,587Z","cx":126,"cy":639},"Salem":{"d":"M30,618L27,622L23,636L13,648L11,659L2,667L2,686L12,695L10,702L5,707L7,710L6,723L17,746L40,770L44,762L41,758L44,754L42,751L44,745L43,742L46,739L56,741L66,728L70,729L96,702L142,740L146,732L146,707L150,698L109,660L96,661L89,653L82,654L76,650L72,650L55,635L55,629L47,621L49,616L47,614L40,613Z","cx":62,"cy":690},"Atlantic":{"d":"M249,636L174,719L212,754L213,775L209,788L212,796L217,797L222,801L234,800L240,804L253,804L260,807L266,804L271,804L274,807L276,805L284,806L293,799L300,804L306,802L309,805L316,798L330,789L346,782L349,779L350,774L370,755L382,733L378,726L373,723L357,725L348,708L343,704L338,709L330,704L327,705L315,697L311,698L303,688L297,687L287,678L275,677L272,674L270,655Z","cx":272,"cy":734},"Cumberland":{"d":"M44,742L45,754L43,758L46,761L44,771L47,778L59,789L63,785L67,789L71,799L80,808L88,803L92,808L92,812L102,818L115,830L115,841L126,852L136,839L141,841L154,839L161,847L180,848L190,852L194,850L190,843L190,836L200,826L203,802L210,793L209,787L213,774L211,766L213,758L204,747L151,699L147,706L145,722L146,733L141,740L96,702L72,728L66,729L55,742L48,739Z","cx":134,"cy":776},"Cape May":{"d":"M306,803L299,804L292,800L284,806L277,805L274,808L270,804L267,807L257,807L250,804L238,804L233,800L221,801L217,797L210,795L204,801L200,827L191,835L191,842L195,849L194,852L199,857L199,874L196,884L180,916L174,942L175,946L209,945L224,929L234,922L233,915L250,890L260,879L257,874L269,851L275,845L277,838L287,825L305,810L308,805Z","cx":229,"cy":863}};
const TYPES=['Internships','Volunteering','Programs','Entry-Level Jobs','Mid/High-Level Jobs'];
const SECTORS=['Pharma / Healthcare','Regulatory','Marine','Detection','Agricultural / Environmental'];
/* Opportunity listings. Add rows here (lat/lng place the pin). */
const OPPS=[
 {org:'Sanofi',loc:'Morristown, NJ',county:'Morris',lat:40.797,lng:-74.48,type:'Internships',sector:'Pharma / Healthcare',url:'#',
  jobs:['2027 Spring Co-op, Quantitative Pharmacology','2027 Summer Intern, Commercial Graduate Program Associate, General Medicines','2027 Summer Intern, Commercial Graduate Program Associate, Vaccines','2027 Summer Internship Opportunities','2027 Summer Intern, Marketing and Sales Associate, Vaccines','2027 Spring Co-Op Opportunities']},
 {org:'Johnson & Johnson',loc:'Raritan, NJ',county:'Somerset',lat:40.57,lng:-74.634,type:'Internships',sector:'Pharma / Healthcare',url:'#',
  jobs:['HFE Intern Raritan Spring 2027']}];
const proj=(lng,lat)=>[(lng+75.56)/1.67*500,(41.36-lat)/2.43*949];
const NS='http://www.w3.org/2000/svg',svg=$('#nj');
const mk=(n,a,p)=>{const e=document.createElementNS(NS,n);for(const k in a)e.setAttribute(k,a[k]);p&&p.append(e);return e};
const gC=mk('g',{},svg),gL=mk('g',{},svg),gP=mk('g',{},svg),cEls={};
Object.entries(COUNTIES).forEach(([n,c])=>{
  const p=mk('path',{d:c.d,class:'c'},gC);mk('title',{},p).textContent=n+' County';cEls[n]=p;
  mk('text',{x:c.cx,y:c.cy,class:'cl'},gL).textContent=n;});
OPPS.forEach(o=>{
  const[x,y]=proj(o.lng,o.lat);
  const g=mk('g',{class:'pin',transform:`translate(${x} ${y}) scale(1.15)`,tabindex:0,role:'button','aria-label':`${o.org}, ${o.loc}`},gP);
  mk('path',{d:'M0 0C-7-10-10-14-10-19a10 10 0 1 1 20 0c0 5-3 9-10 19z',fill:'#dc2626',stroke:'#fff','stroke-width':1.5},g);
  mk('circle',{cx:0,cy:-19,r:4,fill:'#fff'},g);
  const open=()=>openModal(`<h3>${o.org}</h3><p>${o.loc} · ${o.county} County</p><p><b>${o.type}</b> · ${o.sector}</p><ul>${o.jobs.map(j=>`<li>${j}</li>`).join('')}</ul><p><a href="${o.url}" target="_blank" rel="noopener">Visit ${o.org} careers site</a></p>`);
  g.onclick=open;g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}};o.el=g;});
const box=(id,list)=>$(id).innerHTML=list.map(v=>`<label><input type="checkbox" value="${v}"> ${v}</label>`).join('');
box('#f-type',TYPES);box('#f-sector',SECTORS);box('#f-county',Object.keys(COUNTIES).sort());
const sel=id=>new Set($$(id+' input:checked').map(i=>i.value));
function filter(){
  const T=sel('#f-type'),S=sel('#f-sector'),C=sel('#f-county');
  const ok=o=>(!T.size||T.has(o.type))&&(!S.size||S.has(o.sector))&&(!C.size||C.has(o.county));
  const hit=OPPS.filter(ok),hl=new Set(C);
  if(T.size||S.size)hit.forEach(o=>hl.add(o.county));
  Object.entries(cEls).forEach(([n,p])=>p.classList.toggle('on',hl.has(n)));
  OPPS.forEach(o=>o.el.style.display=ok(o)?'':'none');
  $('#status').textContent=`${hit.length} location${hit.length===1?'':'s'} shown`+(hit.length===OPPS.length?'':` of ${OPPS.length}`);
}
$('#map aside').addEventListener('change',filter);
$('#clear').onclick=()=>{$$('#map input').forEach(i=>i.checked=false);filter()};
filter();