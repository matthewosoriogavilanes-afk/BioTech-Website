/* ================= AUDIO SYNTHESIZER ENGINE ================= */
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function initAudio() {
  if (!audioCtx) audioCtx = new AudioCtx();
  if (audioCtx.state === 'suspended') audioCtx.resume();
}

document.addEventListener('click', initAudio, { once: true });
document.addEventListener('keydown', initAudio, { once: true });

const sfx = {
  click() {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + 0.04);
  },
  step() {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.015, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + 0.03);
  },
  elevator() {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    [220, 293.66, 369.99].forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = idx === 0 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.15);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.18, now + idx * 0.15 + 0.22);
      gain.gain.setValueAtTime(0.04, now + idx * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.15 + 0.22);
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.start(now + idx * 0.15); osc.stop(now + idx * 0.15 + 0.22);
    });
  },
  enter() {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    [523.25, 659.25, 783.99].forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);
      gain.gain.setValueAtTime(0.06, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.18);
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.start(now + idx * 0.07); osc.stop(now + idx * 0.07 + 0.18);
    });
  },
  select() {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
    osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + 0.12);
  }
};

/* ---------- helpers ---------- */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
let lastFocus = null;

function openModal(html) {
  sfx.click();
  lastFocus = document.activeElement;
  $('#mbox').innerHTML = html + '<p><button class="btn alt" data-close>Close</button></p>';
  $('#modal').hidden = false;
  $('#mbox').querySelector('button').focus();
}

function closeModal() {
  sfx.click();
  $('#modal').hidden = true;
  if (lastFocus) lastFocus.focus();
}

$('#modal').addEventListener('click', e => {
  if (e.target.id === 'modal' || e.target.closest('[data-close]')) closeModal();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !$('#modal').hidden) closeModal();
});

/* ---------- ambient background music ---------- */
// Music is synthesized locally, so no MP3 URL or extra audio file is needed.
// Browsers require a user gesture before audio can start; after the first click/key,
// music will automatically play when entering the game or map and pause on Home.
let ambientCtx = null;
let ambientMaster = null;
let ambientNodes = [];
let ambientStarted = false;
let ambientEnabled = true;
let ambientVolume = 0.16;
let ambientTimer = null;

function startAmbientMusic() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  if (!ambientCtx) {
    ambientCtx = new AC();
    ambientMaster = ambientCtx.createGain();
    ambientMaster.gain.value = ambientVolume;
    ambientMaster.connect(ambientCtx.destination);
    // Gentle, repeating ambient synth chord. All sound is generated in-browser.
    const notes = [130.81, 164.81, 196.00, 261.63];
    notes.forEach((freq, i) => {
      const osc = ambientCtx.createOscillator();
      const gain = ambientCtx.createGain();
      osc.type = i === 0 ? 'triangle' : 'sine';
      osc.frequency.value = freq;
      gain.gain.value = i === 0 ? 0.18 : 0.07;
      osc.connect(gain); gain.connect(ambientMaster);
      osc.start(); ambientNodes.push(osc, gain);
    });
    ambientStarted = true;
  }
  if (ambientCtx.state === 'suspended') ambientCtx.resume();
  if (ambientMaster) ambientMaster.gain.setTargetAtTime(ambientVolume, ambientCtx.currentTime, 0.3);
}

function stopAmbientMusic() {
  if (ambientCtx && ambientMaster) {
    ambientMaster.gain.setTargetAtTime(0, ambientCtx.currentTime, 0.15);
  }
}

function syncAmbientMusic(tab) {
  if (tab === 'game' || tab === 'map') {
    if (ambientEnabled && (ambientStarted || navigator.userActivation?.hasBeenActive)) startAmbientMusic();
  } else {
    stopAmbientMusic();
  }
}

// The first real user interaction unlocks audio in browsers that block autoplay.
document.addEventListener('pointerdown', () => {
  if (ambientEnabled && (document.querySelector('#game:not([hidden])') || document.querySelector('#map:not([hidden])'))) startAmbientMusic();
}, { once: true });
document.addEventListener('keydown', () => {
  if (ambientEnabled && (document.querySelector('#game:not([hidden])') || document.querySelector('#map:not([hidden])'))) startAmbientMusic();
}, { once: true });

/* ---------- tabs ---------- */
function showTab(t) {
  sfx.click();
  ['home', 'game', 'map'].forEach(id => {
    const el = $('#' + id);
    if (el) el.hidden = (id !== t);
  });
  $$('.tab').forEach(b => {
    if (b.dataset.tab === t) b.setAttribute('aria-current', 'page');
    else b.removeAttribute('aria-current');
  });
  syncAmbientMusic(t);
  window.scrollTo(0, 0);
}

document.addEventListener('click', e => {
  const b = e.target.closest('[data-tab]');
  if (b) showTab(b.dataset.tab);
});

const startBtn = $('#start');
if (startBtn) {
  startBtn.onclick = () => {
    sfx.click();
    const n = $('#nav');
    if (n) {
      n.scrollIntoView({ behavior: 'smooth' });
      n.focus({ preventScroll: true });
    }
  };
}

/* ================= STRICT PALETTE ENGINE ================= */
const PALETTE = ['#557692', '#BBD6EC', '#D5E3EF', '#EEEEEE', '#FFFFFF'];

const SPRITES = {
  player: [
    [null,null, 0, 0, 0, 0,null,null],
    [null, 0, 4, 3, 3, 4, 0,null],
    [null, 0, 3, 1, 1, 3, 0,null],
    [null, 0, 3, 3, 3, 3, 0,null],
    [null, 0, 0, 2, 2, 0, 0,null],
    [ 0, 1, 0, 2, 2, 0, 1, 0],
    [ 0, 1, 0, 0, 0, 0, 1, 0],
    [null, 0, 0, 0, 0, 0, 0,null],
    [null, 0, 1, 0, 0, 1, 0,null],
    [null, 0, 0,null,null, 0, 0,null]
  ],
  building: [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,4,4,4,4,4,4,4,4,4,4,4,4,4,4,0],
    [0,4,3,3,3,3,3,3,3,3,3,3,3,3,4,0],
    [0,4,3,2,2,2,2,2,2,2,2,2,2,3,4,0],
    [0,4,3,2,1,1,1,1,1,1,1,1,2,3,4,0],
    [0,4,3,2,1,3,3,3,3,3,3,1,2,3,4,0],
    [0,4,3,2,1,3,0,0,0,0,3,1,2,3,4,0],
    [0,0,0,0,0,3,0,0,0,0,3,0,0,0,0,0]
  ]
};

function drawIndexedSprite(ctx, pixelMatrix, startX, startY, pixelSize = 2) {
  for (let r = 0; r < pixelMatrix.length; r++) {
    for (let c = 0; c < pixelMatrix[r].length; c++) {
      const colorIndex = pixelMatrix[r][c];
      if (colorIndex !== null && colorIndex !== undefined) {
        ctx.fillStyle = PALETTE[colorIndex];
        ctx.fillRect(
          Math.floor(startX + c * pixelSize),
          Math.floor(startY + r * pixelSize),
          pixelSize,
          pixelSize
        );
      }
    }
  }
}

/* ================= DIRECTOR SPRITES ================= */
const DIRECTOR_IMAGES = [
  'director_female.png',
  'director_male.png'
];

/* ================= GAME LOGIC & SECTORS ================= */
const TRAITS = ['Innovation / Curiosity', 'Decision-Making', 'Teamwork / Problem-Solving', 'Communication / Ethics', 'Patience / Research'];

const R = s => {
  const p = s.split('|');
  return { n: p[0], d: p[1], k: p[2], e: p[3], t: [+p[4][0], +p[4][1]] };
};

const SECT = [
  {
    n: 'Pharma / Healthcare',
    m: 'Dr. Lena Ruiz',
    d: 'Our cleanroom team turns discoveries into safe, effective medicines and treatments.',
    path: 'Intern -> Scientist -> Manager -> Director',
    roles: [
      'Medicinal Chemist|Designs and improves drug molecules.|Organic chemistry|B.S./Ph.D.|04',
      'Pharmacologist|Tests how drugs act in the body.|Assay design|Ph.D.|40',
      'Clinical Research Associate|Monitors trial sites.|Monitoring|B.S.|43',
      'Clinical Trial Manager|Leads studies on budget.|Planning|B.S./M.S.|12',
      'Regulatory Specialist|Guides products through FDA.|Regulations|B.S.|34',
      'Pharmacovigilance Scientist|Tracks drug safety.|Data review|PharmD|41'
    ].map(R)
  },
  {
    n: 'Agricultural',
    m: 'Ms. Hana Green',
    d: 'Hydroponics greenhouse using biotechnology for resilient crops.',
    path: 'Technician -> Plant Scientist -> Project Lead',
    roles: [
      'Agricultural Biotechnologist|Engineers crops for resilience.|Genomics|M.S./Ph.D.|04',
      'Crop Scientist|Runs field trials.|Agronomy|B.S.|41',
      'Soil Scientist|Studies soil health.|Chemistry|B.S.|40',
      'Hydroponics Specialist|Optimizes soil-free growing.|Automation|B.S.|02'
    ].map(R)
  },
  {
    n: 'Environmental',
    m: 'Dr. Sam Okafor',
    d: 'Ecological monitoring lab tracking carbon, water, and soil.',
    path: 'Field Tech -> Analyst -> Program Director',
    roles: [
      'Environmental Microbiologist|Studies microbes cleaning pollution.|Culturing|Ph.D.|40',
      'Ecologist|Studies ecosystems.|Statistics|B.S./M.S.|40',
      'Bioremediation Specialist|Uses organisms for cleanups.|Assessment|M.S.|02'
    ].map(R)
  },
  {
    n: 'Marine',
    m: 'Capt. Maria Reyes',
    d: 'Deep-sea aquaculture facility driving marine bio-discoveries.',
    path: 'Research Tech -> Marine Scientist -> Director',
    roles: [
      'Marine Biologist|Studies ocean life.|Fieldwork|B.S.|40',
      'Aquaculture Technician|Raises fish sustainably.|Husbandry|A.S.|42',
      'Oceanographer|Studies ocean chemistry.|Modeling|Ph.D.|04'
    ].map(R)
  },
  {
    n: 'Detection',
    m: 'Dr. Jun Park',
    d: 'Bio-analytics lab detecting disease, pathogens, and evidence.',
    path: 'Lab Analyst -> Specialist -> Lab Director',
    roles: [
      'Molecular Diagnostics Scientist|Develops DNA/RNA tests.|PCR|M.S.|04',
      'Forensic DNA Analyst|Analyzes DNA evidence.|Chain of custody|B.S.|43',
      'Clinical Lab Scientist|Runs patient lab tests.|Accuracy|B.S.|41'
    ].map(R)
  }
];

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

const quizAreaIndex = sector => ({ 0: 0, 1: 1, 2: 1, 3: 4, 4: 3 })[sector] ?? 0;

/* ================= UNIFIED CANVAS ENGINE & IN-SCREEN OVERLAY ================= */
const G = { sec: 0, team: [], tr: [0, 0, 0, 0, 0], sourceTraitScores: {}, q: 0, res: {}, nearCampus: -1, overlayActive: false, directorImg: '' };
const keys = {};

window.addEventListener('keydown', e => {
  const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  keys[k] = true;
  if ((k === 'e' || k === ' ') && !G.overlayActive) handleCanvasInteraction();
});

window.addEventListener('keyup', e => {
  const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  delete keys[k];
});

const playerPos = {
  x: 320,
  y: 380,
  width: 20,
  height: 20,
  speed: 2.8,
  getHitbox() {
    return { x: this.x + 3, y: this.y + 12, width: 14, height: 8 };
  }
};

const campusBuildings = SECT.map((s, i) => ({
  id: i,
  name: s.n,
  x: [60, 480, 100, 480, 280][i],
  y: [60, 60, 220, 220, 320][i],
  width: 100,
  height: 70,
  hitbox: { x: [60, 480, 100, 480, 280][i], y: [60, 60, 220, 220, 320][i], width: 100, height: 50 },
  triggerZone: { x: [60, 480, 100, 480, 280][i] + 30, y: [60, 60, 220, 220, 320][i] + 50, width: 40, height: 30 }
}));

function checkAABB(r1, r2) {
  return r1.x < r2.x + r2.width && r1.x + r1.width > r2.x && r1.y < r2.y + r2.height && r1.y + r1.height > r2.y;
}

function checkCampusCollisions(newX, newY) {
  const testBox = { x: newX + 3, y: newY + 12, width: 14, height: 8 };
  if (newX < 10 || newX + playerPos.width > 630 || newY < 10 || newY + playerPos.height > 470) return true;
  for (let b of campusBuildings) {
    if (checkAABB(testBox, b.hitbox)) return true;
  }
  return false;
}

let stepTimer = 0;
function updateCanvasPlayerMovement() {
  if (G.overlayActive) return;

  let dx = 0, dy = 0;
  if (keys['w'] || keys['arrowup']) dy -= 1;
  if (keys['s'] || keys['arrowdown']) dy += 1;
  if (keys['a'] || keys['arrowleft']) dx -= 1;
  if (keys['d'] || keys['arrowright']) dx += 1;

  if (dx !== 0 || dy !== 0) {
    if (++stepTimer % 18 === 0) sfx.step();
  }

  if (dx !== 0 && dy !== 0) { dx *= 0.7071; dy *= 0.7071; }

  const stepX = dx * playerPos.speed;
  const stepY = dy * playerPos.speed;

  if (stepX !== 0 && !checkCampusCollisions(playerPos.x + stepX, playerPos.y)) playerPos.x += stepX;
  if (stepY !== 0 && !checkCampusCollisions(playerPos.x, playerPos.y + stepY)) playerPos.y += stepY;
}

function handleCanvasInteraction() {
  if (G.nearCampus >= 0 && !G.overlayActive) {
    sfx.elevator();
    sfx.enter();
    enterCampus(G.nearCampus);
  }
}

let gameLoopRAF = 0;

function startCanvasEngine() {
  const canvas = $('#gameCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  function renderLoop() {
    updateCanvasPlayerMovement();

    G.nearCampus = -1;
    const playerHitbox = playerPos.getHitbox();
    campusBuildings.forEach(b => {
      if (checkAABB(playerHitbox, b.triggerZone)) G.nearCampus = b.id;
    });

    const msg = $('#near-msg');
    if (msg) {
      msg.innerText = G.overlayActive 
        ? `Currently active inside ${SECT[G.sec].n} Facility`
        : (G.nearCampus >= 0 ? `Nearby: ${SECT[G.nearCampus].n} - Press [E] or Space to enter!` : 'Walk up to a sector facility to enter.');
    }

    ctx.fillStyle = PALETTE[2];
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = PALETTE[3];
    for (let i = 0; i < canvas.width; i += 40) ctx.fillRect(i, 0, 1, canvas.height);
    for (let j = 0; j < canvas.height; j += 40) ctx.fillRect(0, j, canvas.width, 1);

    campusBuildings.forEach(b => {
      drawIndexedSprite(ctx, SPRITES.building, b.x, b.y, 6);
      ctx.fillStyle = PALETTE[0];
      ctx.font = 'bold 11px monospace';
      ctx.fillText(b.name, b.x + 5, b.y - 8);
      ctx.fillStyle = PALETTE[1];
      ctx.fillRect(b.triggerZone.x, b.triggerZone.y, b.triggerZone.width, b.triggerZone.height);
    });

    drawIndexedSprite(ctx, SPRITES.player, playerPos.x, playerPos.y, 2.5);

    if (G.nearCampus >= 0 && !G.overlayActive) {
      ctx.fillStyle = PALETTE[4];
      ctx.fillRect(playerPos.x - 20, playerPos.y - 25, 70, 18);
      ctx.strokeStyle = PALETTE[0];
      ctx.strokeRect(playerPos.x - 20, playerPos.y - 25, 70, 18);
      ctx.fillStyle = PALETTE[0];
      ctx.font = 'bold 10px monospace';
      ctx.fillText('[E] Enter', playerPos.x - 14, playerPos.y - 13);
    }

    gameLoopRAF = requestAnimationFrame(renderLoop);
  }

  cancelAnimationFrame(gameLoopRAF);
  gameLoopRAF = requestAnimationFrame(renderLoop);
}

function showOverlay(htmlContent) {
  G.overlayActive = true;
  const overlay = $('#game-ui-overlay');
  if (!overlay) return;
  overlay.innerHTML = `<div class="overlay-card">${htmlContent}</div>`;
  overlay.hidden = false;
}

function hideOverlay() {
  sfx.click();
  sfx.elevator();
  G.overlayActive = false;
  const overlay = $('#game-ui-overlay');
  if (!overlay) return;
  overlay.hidden = true;
  overlay.innerHTML = '';
}

function enterCampus(i) {
  G.sec = i; 
  G.team = []; 
  G.tr = [0, 0, 0, 0, 0]; 
  G.sourceTraitScores = {}; 
  G.q = 0;
  G.directorImg = DIRECTOR_IMAGES[Math.floor(Math.random() * DIRECTOR_IMAGES.length)];
  team();
}

function team() {
  const s = SECT[G.sec], n = G.team.length;
  showOverlay(`
    <h3>Build Your Team: ${s.n}</h3>
    <p style="font-size:0.9rem;">${s.d}</p>
    <p><b>Select team members (${n}/6):</b></p>
    <div class="roles">${s.roles.map((r,i)=>`<button class="role ${G.team.includes(i)?'in':''}" data-role="${i}">${r.n}</button>`).join('')}</div>
    <div style="display:flex; gap:10px; justify-content:flex-end; margin-top:12px;">
      <button class="btn alt" data-action="exit">Exit to Campus</button>
      <button class="btn" data-action="quiz" ${n<1?'disabled':''}>Start Scenarios</button>
    </div>
  `);
}

function roleModal(i) {
  sfx.select();
  const r = SECT[G.sec].roles[i], has = G.team.includes(i);
  openModal(`<h3>${r.n}</h3><p>${r.d}</p><p><b>Key skills:</b> ${r.k}</p><p><b>Education:</b> ${r.e}</p><button class="btn" data-toggle="${i}">${has?'Remove from team':'Add to Team'}</button>`);
}

function quiz() {
  const area = QUIZ_AREAS[quizAreaIndex(G.sec)], q = area.scenarios[G.q];
  const directorImgSrc = G.directorImg || DIRECTOR_IMAGES[0];

  showOverlay(`
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <h3 style="margin:0;">${area.name}</h3>
      <span class="count">Scenario ${G.q + 1}/${area.scenarios.length}</span>
    </div>
    <div style="margin-top:12px; background:var(--p-light); border:2px solid var(--p-dark); padding:12px; border-radius:8px; display:flex; gap:14px; align-items:center;">
      <img src="${directorImgSrc}" alt="Facility Director" style="width:55px; height:110px; object-fit:contain; border:2px solid var(--p-dark); background:#fff; padding:4px; border-radius:6px; image-rendering:pixelated; flex-shrink:0;" />
      <div>
        <b style="color:var(--p-dark); font-size:1.05rem;">${SECT[G.sec].m} (Facility Lead):</b>
        <p style="margin:6px 0 0 0; line-height:1.4;">${q.dialogue}</p>
      </div>
    </div>
    <div class="ans">${q.answers.map((a, i) => `<button data-ans="${i}">${String.fromCharCode(65 + i)}. ${a[0]}</button>`).join('')}</div>
  `);
}

function compat(i, tr, tm) {
  const s = SECT[i], t = tr.slice(); tm.forEach(k => t[s.roles[k].t[0]] += 1);
  const o = [...t].sort((a,b)=>b-a), den = 2*o[0]+o[1]||1;
  return { t, list: s.roles.map(r => ({ r, p: Math.min(100, Math.round(100*(2*t[r.t[0]]+t[r.t[1]])/den)) })).sort((a,b)=>b.p-a.p) };
}

function result(i) {
  sfx.enter();
  const s = SECT[i], {t, list} = G.res[i], best = list[0];
  const sortedTraits = Object.entries(G.sourceTraitScores).sort((a,b)=>b[1]-a[1]);
  const maxScore = Math.max(1, ...Object.values(G.sourceTraitScores));

  showOverlay(`
    <div class="prof">
      <p style="font-size:0.8rem; margin:0; text-transform:uppercase; font-weight:bold;">${s.n} · Best-Fit Career Match</p>
      <div class="best">${best.r.n} · ${best.p}%</div>
      <p style="font-size:0.85rem; margin:6px 0;">${best.r.d}</p>
      
      <h4 style="margin:8px 0 4px 0;">Your Personality Traits Breakdown</h4>
      ${sortedTraits.map(([name,score])=>`<div class="pct"><span>${name}</span><div class="bar2"><i style="width:${Math.round(score/maxScore*100)}%"></i></div><b>${score} pt</b></div>`).join('')}

      <h4 style="margin:8px 0 4px 0;">Role Compatibility</h4>
      ${list.slice(0, 3).map(x => `<div class="pct"><span>${x.r.n}</span><div class="bar2"><i style="width:${x.p}%"></i></div><b>${x.p}%</b></div>`).join('')}
      
      <h4 style="margin:8px 0 4px 0;">Career Pathway</h4>
      <p style="font-size:0.85rem; margin:0;">${s.path}</p>
      
      <div style="text-align:right; margin-top:14px;">
        <button class="btn" data-action="exit">Return to Campus</button>
      </div>
    </div>
  `);
}

const stageEl = $('#stage');
if (stageEl) {
  stageEl.addEventListener('click', e => {
    const t = e.target.closest('button'); if (!t) return; const d = t.dataset;
    if (d.role !== undefined) roleModal(+d.role);
    else if (d.ans !== undefined) {
      sfx.select();
      const area = QUIZ_AREAS[quizAreaIndex(G.sec)], a = area.scenarios[G.q].answers[+d.ans];
      G.sourceTraitScores[a[1]] = (G.sourceTraitScores[a[1]]||0) + 3;
      G.sourceTraitScores[a[2]] = (G.sourceTraitScores[a[2]]||0) + 1;
      G.tr[QUIZ_TRAIT_MAP[a[1]]??0] += 3;
      G.tr[QUIZ_TRAIT_MAP[a[2]]??4] += 1;
      if (++G.q < area.scenarios.length) quiz();
      else { G.res[G.sec] = compat(G.sec, G.tr, G.team); result(G.sec); }
    }
    else if (d.action === 'quiz') { sfx.enter(); quiz(); }
    else if (d.action === 'exit') hideOverlay();
  });
}

const enterBtn = $('#enter-btn');
if (enterBtn) enterBtn.onclick = handleCanvasInteraction;

$('#modal').addEventListener('click', e => {
  const t = e.target.closest('[data-toggle]'); if (!t) return;
  const i = +t.dataset.toggle, k = G.team.indexOf(i);
  k >= 0 ? G.team.splice(k, 1) : G.team.length < 6 && G.team.push(i);
  closeModal(); team();
});

/* ================= MAP OF OPPORTUNITIES ================= */
const COUNTIES={"Sussex":{"cx":263,"cy":84},"Warren":{"cx":171,"cy":195},"Passaic":{"cx":379,"cy":125},"Bergen":{"cx":447,"cy":154},"Morris":{"cx":307,"cy":193},"Essex":{"cx":395,"cy":223},"Hudson":{"cx":446,"cy":246},"Union":{"cx":377,"cy":273},"Hunterdon":{"cx":196,"cy":309},"Somerset":{"cx":285,"cy":310},"Middlesex":{"cx":347,"cy":358},"Mercer":{"cx":258,"cy":420},"Monmouth":{"cx":405,"cy":427},"Ocean":{"cx":387,"cy":576},"Burlington":{"cx":269,"cy":577},"Camden":{"cx":181,"cy":606},"Gloucester":{"cx":126,"cy":639},"Salem":{"cx":62,"cy":690},"Atlantic":{"cx":272,"cy":734},"Cumberland":{"cx":134,"cy":776},"Cape May":{"cx":229,"cy":863}};
const TYPES=['Internships','Volunteering','Programs','Entry-Level Jobs','Mid/High-Level Jobs'];
const SECTORS=['Pharma / Healthcare','Regulatory','Marine','Detection','Agricultural / Environmental'];

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

const sel = id => new Set($$(id + ' input:checked').map(i => i.value));

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

function filterMap() {
  const T = sel('#f-type'), S = sel('#f-sector'), C = sel('#f-county');
  const ok = o => (!T.size || T.has(o.type)) && (!S.size || S.has(o.sector)) && (!C.size || C.has(o.county));
  const hit = OPPS.filter(ok);
  const statusEl = $('#status');
  if (statusEl) statusEl.textContent = `${hit.length} location${hit.length === 1 ? '' : 's'} shown of ${OPPS.length} opportunities across New Jersey`;
  renderMapPins(hit);
}

document.addEventListener('DOMContentLoaded', () => {
  box('#f-type', TYPES);
  box('#f-sector', SECTORS);
  box('#f-county', Object.keys(COUNTIES).sort());

  const mapAside = $('#map aside');
  if (mapAside) mapAside.addEventListener('change', () => { sfx.click(); filterMap(); });

  const clearBtn = $('#clear');
  if (clearBtn) clearBtn.onclick = () => { sfx.click(); $$('#map input').forEach(i => i.checked = false); filterMap(); };

  filterMap();
  showTab('home');
  startCanvasEngine();
});
