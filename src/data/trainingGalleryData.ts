import { TrainingPhotoItem } from '../types';

import classroomSessionImg from '../assets/images/classroom_hse_session_1787299784988.jpg';
import siteSafetyPpeImg from '../assets/images/site_safety_ppe_1787408528943.jpg';
import fireSafetyImg from '../assets/images/fire_safety_training_1787408392662.jpg';
import firstAidImg from '../assets/images/first_aid_training_1787408415166.jpg';
import scaffoldSafetyImg from '../assets/images/scaffold_height_safety_1787408438983.jpg';
import chemicalSpillImg from '../assets/images/chemical_spill_safety_1787408463052.jpg';
import confinedSpaceImg from '../assets/images/confined_space_training_1787408484381.jpg';
import lotoElectricalImg from '../assets/images/loto_electrical_safety_1787408508872.jpg';
import hsePrinciplesImg from '../assets/images/hse_principles_meeting_1787299809908.jpg';
import heroSphereImg from '../assets/images/hero_qualifi_sphere_1787299768063.jpg';

export const TRAINING_GALLERY_DATA: TrainingPhotoItem[] = [
  {
    id: 'general-safety-induction',
    title: 'General Safety Induction & Workplace Hazard Awareness',
    shortTitle: 'General Safety Induction',
    category: 'classroom',
    categoryLabel: 'Classroom & Induction',
    image: classroomSessionImg,
    tagline: 'Work Safe. Go Home Safe. Zero Harm Mindset.',
    description: 'Interactive classroom orientation introducing delegates to fundamental risk assessment, hazard identification, emergency notification protocols, and mandatory PPE regulations under UK-HSE guidelines.',
    keyOutcomes: [
      'Identification of physical, chemical, and ergonomic hazards',
      'Hierarchy of risk controls (Elimination to PPE)',
      'Incident and near-miss mandatory reporting workflows',
      'Individual legal responsibilities under Health & Safety Act'
    ],
    standards: ['UK-HSE 1974', 'ISO 45001:2018', 'IOSH Working Safely'],
    equipmentPPE: ['Safety Hard Hat', 'Hi-Vis Vest', 'Safety Glasses', 'Safety Footwear'],
    duration: '1-Day Intensive / 8 Hours',
    locationType: 'Qualifi Executive Training Suite & On-Site Client Hall',
    badgeColor: 'bg-blue-600',
    featuredAtFront: true
  },
  {
    id: 'fire-extinguisher-pass',
    title: 'Fire Extinguisher P.A.S.S. & Live Practical Suppression Drill',
    shortTitle: 'Live Fire Extinguisher Drill',
    category: 'emergency',
    categoryLabel: 'Emergency & Fire Safety',
    image: fireSafetyImg,
    tagline: 'Pull. Aim. Squeeze. Sweep. Rapid Emergency Reaction.',
    description: 'Hands-on practical fire safety training using real controlled live-fire pans. Delegates master extinguisher classifications (CO2, Foam, Dry Chemical Powder, Water) and evacuation routes.',
    keyOutcomes: [
      'Mastery of P.A.S.S. live fire extinguisher operation',
      'Classification of Class A, B, C, D, and electrical fires',
      'Fire warden duties, headcount roll-call, and safe egress',
      'Fire blanket and emergency shutdown valve isolation'
    ],
    standards: ['BS 5306-3', 'NFPA 10', 'Regulatory Reform (Fire Safety) Order'],
    equipmentPPE: ['Flame-Retardant Gloves', 'Full Face Visor', 'Safety Helmet', 'Hi-Vis Jacket'],
    duration: 'Half-Day Practical / 4 Hours',
    locationType: 'Designated Outdoor Fire Training Grounds',
    badgeColor: 'bg-rose-600',
    featuredAtFront: true
  },
  {
    id: 'first-aid-cpr-emergency',
    title: 'First Aid at Work & CPR Automated Emergency Response',
    shortTitle: 'First Aid & CPR Life Support',
    category: 'emergency',
    categoryLabel: 'Emergency & Medical Life Support',
    image: firstAidImg,
    tagline: 'Assess. Call. Provide First Aid. Monitor & Support.',
    description: 'Comprehensive medical first response workshop with advanced CPR manikins, automated external defibrillator (AED) trainers, trauma bandages, and stabilization protocols for workplace injuries.',
    keyOutcomes: [
      'Cardiopulmonary Resuscitation (CPR) & chest compression rhythm',
      'AED (Automated External Defibrillator) safe deployment',
      'Severe bleeding control, tourniquet application, and burn care',
      'Management of fractures, shock, and unconscious casualties'
    ],
    standards: ['UK Resuscitation Council', 'HSE First Aid at Work (FAW)', 'European Resuscitation Council'],
    equipmentPPE: ['Medical Nitrile Gloves', 'CPR Pocket Mask', 'First Aid Trauma Kit'],
    duration: '2-Day Full Certification / 16 Hours',
    locationType: 'Medical Simulation Lab & Corporate Facility',
    badgeColor: 'bg-emerald-600',
    featuredAtFront: true
  },
  {
    id: 'scaffolding-height-safety',
    title: 'Scaffolding Safety & Working at Height Fall Protection',
    shortTitle: 'Scaffolding & Height Fall Safety',
    category: 'field',
    categoryLabel: 'Field & Construction Safety',
    image: scaffoldSafetyImg,
    tagline: 'Plan. Prepare. Protect. 100% Tie-Off Commitment.',
    description: 'Rigorous outdoor height safety workshop covering full-body harness donning, double-lanyard anchoring, scaffolding tag systems (SCAFFTAG), guardrail checks, and rescue planning.',
    keyOutcomes: [
      'Pre-use inspection of harnesses, karabiners, and fall arresters',
      'Scaffold structure inspection: base plates, ledgers, and toe boards',
      'Fall clearance calculation and suspension trauma prevention',
      'Safe ladder climbing 3-point contact discipline'
    ],
    standards: ['BS EN 361', 'Work at Height Regs 2005', 'OSHA 1926 Subpart L'],
    equipmentPPE: ['Full Body Safety Harness', 'Double Shock-Absorbing Lanyard', 'Chinstrap Helmet', 'Steel Toe Boots'],
    duration: '1-Day Intensive / 8 Hours',
    locationType: 'Civil Construction Training Rig & Industrial Scaffold Facility',
    badgeColor: 'bg-amber-600',
    featuredAtFront: false
  },
  {
    id: 'confined-space-entry-gas',
    title: 'Confined Space Entry Awareness & Multi-Gas Detection',
    shortTitle: 'Confined Space & Gas Testing',
    category: 'industrial',
    categoryLabel: 'Industrial & Specialized Safety',
    image: confinedSpaceImg,
    tagline: 'Think Safe. Work Safe. Continuous Atmosphere Monitoring.',
    description: 'High-hazard industrial workshop focusing on permit-to-work issuance, multi-gas detector calibration (O2, LEL, CO, H2S), mechanical tripod rescue winch operation, and ventilation techniques.',
    keyOutcomes: [
      'Atmospheric testing at top, middle, and bottom strata',
      'Permit-To-Work (PTW) cross-authorization & standby duties',
      'Tripod retrieval hoist and escape breathing apparatus (ELSA)',
      'Forced air ventilation calculation and hazardous gas purge'
    ],
    standards: ['Confined Spaces Regs 1997', 'OSHA 1910.146 (PRCS)', 'EN 50104 Gas Detection'],
    equipmentPPE: ['Multi-Gas Detector 4-Gas', 'Safety Harness Tripod Winch', 'Hard Hat with Lamp', 'Overalls'],
    duration: '2-Day Practical & Theory / 16 Hours',
    locationType: 'Industrial Tank & Process Vessel Training Center',
    badgeColor: 'bg-indigo-600',
    featuredAtFront: false
  },
  {
    id: 'chemical-safety-spill-kit',
    title: 'Chemical Safety, SDS Labeling & Rapid Spill Response',
    shortTitle: 'Chemical Safety & Spill Kit Response',
    category: 'industrial',
    categoryLabel: 'Industrial & Chemical Safety',
    image: chemicalSpillImg,
    tagline: 'Safe Storage. GHS Hazard Labeling. Containment Control.',
    description: 'Practical hazardous material handling workshop. Delegates learn GHS chemical labeling, SDS (Safety Data Sheet) interpretation, corrosive storage segregation, and hands-on spill kit deployment.',
    keyOutcomes: [
      'GHS / COSHH hazard symbols and precautionary statements',
      'Deployment of absorbent socks, booms, and neutralization pads',
      'Secondary containment bund inspection and chemical drum handling',
      'Emergency eyewash and chemical shower rapid procedures'
    ],
    standards: ['COSHH 2002', 'CLP Regulation (EC No 1272/2008)', 'OSHA HazCom 1910.1200'],
    equipmentPPE: ['Chemical Splash Goggles', 'Heavy Duty Chemical Nitrile Gloves', 'Chemical Apron', 'Spill Kit'],
    duration: '1-Day Practical / 8 Hours',
    locationType: 'Chemical Warehouse Simulation Lab & Plant Site',
    badgeColor: 'bg-purple-600',
    featuredAtFront: false
  },
  {
    id: 'lockout-tagout-loto',
    title: 'Lockout-Tagout (LOTO) & Electrical Isolation Protocol',
    shortTitle: 'LOTO & Electrical Isolation',
    category: 'industrial',
    categoryLabel: 'Industrial & Electrical Safety',
    image: lotoElectricalImg,
    tagline: 'Zero Energy Verification. Padlock Station Security.',
    description: 'Critical machinery maintenance workshop covering the 6-step LOTO procedure (Prepare, Shut Down, Isolate, Lock Out, Tag Out, Verify Zero Energy) to eliminate fatal electrical and kinetic shock hazards.',
    keyOutcomes: [
      'Mastery of standardized 6-step zero-energy isolation sequence',
      'Padlock color coding, hasps, cable lockouts, and danger tags',
      'Stored residual energy bleeding (pneumatic, hydraulic, capacitor)',
      'Group lockout and complex handover permit systems'
    ],
    standards: ['OSHA 1910.147', 'Electricity at Work Regs 1989', 'NFPA 70E'],
    equipmentPPE: ['Dielectric Hard Hat', 'Arc Flash Safety Glasses', 'Insulated Voltage Gloves', 'Lockout Station Kit'],
    duration: '1-Day Hands-on Workshop / 8 Hours',
    locationType: 'Machinery Plant & Electrical Switchgear Training Facility',
    badgeColor: 'bg-cyan-700',
    featuredAtFront: false
  },
  {
    id: 'ppe-warehouse-logistics',
    title: 'Personal Protective Equipment (PPE) & Warehouse Safety',
    shortTitle: 'PPE Selection & Warehouse Safety',
    category: 'field',
    categoryLabel: 'Field & Warehouse Safety',
    image: siteSafetyPpeImg,
    tagline: 'Be Safe. Work Safe. Go Home Safe Every Single Day.',
    description: 'Live warehouse safety session inspecting personal protective equipment, forklift pedestrian separation pathways, high-visibility garment compliance, and eye/hearing conservation.',
    keyOutcomes: [
      'Proper fitting, cleaning, and replacement criteria for safety gear',
      'Warehouse pedestrian walkway segregation and blind-spot mirrors',
      'Hearing conservation and noise decibel (dB) exposure thresholds',
      'Ergonomic manual handling technique with load weight guidelines'
    ],
    standards: ['PPE at Work Regs 1992', 'BS EN ISO 20345', 'HSE Warehouse HSG76'],
    equipmentPPE: ['Hard Hat with Ratchet', 'Safety Spectacles EN166', 'Ear Defenders EN352', 'Class 2 Hi-Vis Vest'],
    duration: 'Half-Day Practical / 4 Hours',
    locationType: 'Logistics Distribution Warehouse & Training Yard',
    badgeColor: 'bg-emerald-700',
    featuredAtFront: false
  },
  {
    id: 'hse-management-principles',
    title: 'Executive HSE Governance, Risk Auditing & ISO Compliance',
    shortTitle: 'HSE Governance & Risk Auditing',
    category: 'classroom',
    categoryLabel: 'Classroom & Leadership',
    image: hsePrinciplesImg,
    tagline: 'Strategic Safety Leadership. Proactive Compliance Auditing.',
    description: 'Executive briefing designed for project directors, HSE managers, and site supervisors on strategic safety culture leadership, KPIs, root-cause investigation, and ISO 45001 / ISO 14001 governance.',
    keyOutcomes: [
      'Safety Management System (SMS) implementation framework',
      'Root-cause analysis using 5-Whys and Fishbone methodologies',
      'Lagging vs leading safety KPI dashboard monitoring',
      'Continuous improvement auditing and contractor oversight'
    ],
    standards: ['ISO 45001:2018', 'ISO 14001:2015', 'NEBOSH International Diploma'],
    equipmentPPE: ['Corporate Executive PPE Kit', 'Tablet Inspection Suite'],
    duration: '2-Day Executive Masterclass / 16 Hours',
    locationType: 'Corporate Boardroom & Executive Conference Centre',
    badgeColor: 'bg-slate-800',
    featuredAtFront: false
  },
  {
    id: 'global-qualifi-sphere',
    title: 'Qualifi Global Certification Standards & UK Accreditation',
    shortTitle: 'Qualifi Accreditation Framework',
    category: 'classroom',
    categoryLabel: 'Accreditation & Standards',
    image: heroSphereImg,
    tagline: 'Success Through Learning. Internationally Recognized Credentials.',
    description: 'In-depth overview of the Qualifi UK qualification framework, regulated awarding standards, QR-code cryptographic authenticity verification, and professional career progression routes.',
    keyOutcomes: [
      'Understanding UK Regulated Qualifications Framework (RQF)',
      'Digital authenticity, QR verification, and transcript security',
      'Global corporate recognition across oil & gas, construction, and logistics',
      'Lifelong learning pathways from Level 3 to Level 7 Diplomas'
    ],
    standards: ['Ofqual Regulated Quality Framework', 'UK QAA Benchmarks', 'ISO 9001:2015'],
    equipmentPPE: ['Digital Verification Device', 'Student Induction Pack'],
    duration: 'Orientation Briefing / 2 Hours',
    locationType: 'Qualifi Global Headquarters & Virtual Interactive Studio',
    badgeColor: 'bg-amber-700',
    featuredAtFront: false
  }
];
