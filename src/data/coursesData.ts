import { Course } from '../types';

export const ALL_COURSES: Course[] = [
  {
    id: 'nebosh-igc',
    title: 'NEBOSH IGC - International General Certificate',
    code: 'NEB-IGC-01',
    level: 'Level 3',
    category: 'core',
    duration: '10 Days (80 Hours) / Blended',
    description: 'Comprehensive occupational health and safety principles, risk evaluation, hazard management, and international workplace standards.',
    keyModules: [
      'Why we should manage workplace health and safety',
      'How health and safety management systems work and what they look like',
      'Managing risk — understanding people and processes',
      'Physical and psychological hazards and risk control',
      'Practical workplace risk assessment project'
    ],
    targetAudience: 'Safety Officers, HSE Supervisors, Engineers, and aspiring Safety Professionals.',
    assessmentType: 'Open Book Examination (OBE) + Practical Risk Assessment',
    iconName: 'Award',
    popular: true
  },
  {
    id: 'iosh-managing-safely',
    title: 'IOSH Managing Safely',
    code: 'IOSH-MS-02',
    level: 'Level 2',
    category: 'core',
    duration: '3 Days (22 Hours)',
    description: 'Practical guidance for managers and supervisors on handling health and safety in their teams according to UK and international best practices.',
    keyModules: [
      'Introducing Managing Safely',
      'Assessing and controlling risks',
      'Understanding your responsibilities',
      'Identifying common workplace hazards',
      'Investigating accidents and incidents',
      'Measuring performance'
    ],
    targetAudience: 'Team Leaders, Supervisors, Managers, and Department Heads in all industries.',
    assessmentType: 'Multiple Choice Assessment + Practical Workplace Project',
    iconName: 'ShieldCheck',
    popular: true
  },
  {
    id: 'osha-30-hours',
    title: 'OSHA 30 Hours General & Construction',
    code: 'OSHA-30-03',
    level: 'Level 2',
    category: 'technical',
    duration: '4 Days (30 Hours)',
    description: 'In-depth workplace safety standards covering construction, manufacturing, hazard communication, PPE, fall protection, and electrical safety.',
    keyModules: [
      'Introduction to OSHA Standards & Policies',
      'Managing Safety and Health Programs',
      'Fall Protection, Scaffolding & Ladders',
      'Electrical Hazards & Lockout/Tagout (LOTO)',
      'Excavation & Trenching Safety',
      'Materials Handling, Storage, Use and Disposal'
    ],
    targetAudience: 'Site Supervisors, Safety Foremen, Project Engineers, and Field Coordinators.',
    assessmentType: 'Comprehensive Modular Examinations',
    iconName: 'HardHat',
    popular: true
  },
  {
    id: 'first-aid-work',
    title: 'First Aid at Work & CPR',
    code: 'FAW-04',
    level: 'Level 2',
    category: 'emergency',
    duration: '1-2 Days (16 Hours)',
    description: 'Life-saving first aid techniques, CPR, automated external defibrillator (AED) operation, trauma response, burns, fractures, and emergency triage.',
    keyModules: [
      'Primary survey and unconscious casualty management',
      'Cardiopulmonary Resuscitation (CPR) & AED usage',
      'Choking, shock, bleeding, and wound dressing',
      'Burns, scalds, bone fractures, and spinal safety',
      'Medical emergencies: Heart attack, stroke, asthma, anaphylaxis'
    ],
    targetAudience: 'Appointed First Aiders, HSE Representatives, and Workplace Staff.',
    assessmentType: 'Continuous Practical Skills Assessment',
    iconName: 'HeartPulse',
    popular: true
  },
  {
    id: 'fire-safety',
    title: 'Fire Safety & Fire Warden Training',
    code: 'FS-05',
    level: 'Level 2',
    category: 'emergency',
    duration: '1 Day (8 Hours)',
    description: 'Fire dynamics, prevention mechanisms, fire risk assessment, evacuation protocols, extinguisher handling, and Warden duties.',
    keyModules: [
      'Chemistry of fire and combustion triangle',
      'Fire hazard identification and prevention protocols',
      'Fire warden duties and evacuation management',
      'Hands-on live fire extinguisher simulation and selection',
      'Emergency response coordination with fire services'
    ],
    targetAudience: 'Designated Fire Wardens, Security Officers, Facility Managers.',
    assessmentType: 'Written Quiz & Practical Evacuation Drill Simulation',
    iconName: 'Flame'
  },
  {
    id: 'permit-to-work',
    title: 'Permit to Work (PTW) System Safety',
    code: 'PTW-06',
    level: 'Level 2',
    category: 'technical',
    duration: '1 Day (8 Hours)',
    description: 'Operating and issuing formal safety permits for high-hazard activities including hot work, cold work, isolations, and hazardous entries.',
    keyModules: [
      'Principles of Safe Systems of Work (SSOW)',
      'Permit types: Hot Work, Confined Space, Electrical, Excavation',
      'Roles and responsibilities of Issuers, Receivers, and Authorizers',
      'Hazard identification and energy isolation verification',
      'Handback, permit cancellation, and auditing protocols'
    ],
    targetAudience: 'Permit Controllers, Plant Engineers, HSE Coordinators, Shift Leads.',
    assessmentType: 'Scenario-based Permit Preparation & Validation Exam',
    iconName: 'FileCheck'
  },
  {
    id: 'construction-safety',
    title: 'Construction Site Safety Management',
    code: 'CS-07',
    level: 'Level 3',
    category: 'technical',
    duration: '3 Days (24 Hours)',
    description: 'Comprehensive safety supervision for civil, infrastructure, and building projects focusing on site logistics, heavy equipment, and worker welfare.',
    keyModules: [
      'Construction Design and Management principles',
      'Excavations, piling, and groundworks safety',
      'Heavy plant, cranes, and lifting operations',
      'Dust, noise, vibration, and hazardous substances on site',
      'Subcontractor safety coordination and toolbox talks'
    ],
    targetAudience: 'Site Managers, Civil Safety Inspectors, Project Managers.',
    assessmentType: 'Site Inspection Report & Safety Case Analysis',
    iconName: 'Construction'
  },
  {
    id: 'h2s-safety',
    title: 'H2S Safety & Breathing Apparatus (BA)',
    code: 'H2S-08',
    level: 'Level 2',
    category: 'technical',
    duration: '1 Day (8 Hours)',
    description: 'Properties of Hydrogen Sulfide gas, detection equipment, escape hoods, self-contained breathing apparatus (SCBA), and emergency rescue.',
    keyModules: [
      'Physical and chemical properties and toxicity of H2S',
      'Gas monitoring devices and alarm limits',
      'Personal detection equipment and calibration checks',
      'SCBA & EEBA donning, inspection, and cylinder checks',
      'Emergency muster, search, and rescue drills'
    ],
    targetAudience: 'Oil & Gas Personnel, Chemical Plant Operators, Petrochemical Engineers.',
    assessmentType: 'Practical Breathing Apparatus Testing & Written Exam',
    iconName: 'AlertTriangle'
  },
  {
    id: 'confined-space-safety',
    title: 'Confined Space Safety & Entry Entry Warden',
    code: 'CSS-09',
    level: 'Level 2',
    category: 'technical',
    duration: '2 Days (16 Hours)',
    description: 'Atmospheric testing, safe entry procedures, ventilation, standby person duties, rescue planning, and tripod retrieval systems.',
    keyModules: [
      'Definition and hazards of confined spaces',
      'Gas testing protocols (Oxygen, Flammables, Toxic)',
      'Mechanical and natural ventilation calculations',
      'Entry attendant duties and communication systems',
      'Non-entry and entry rescue techniques with tripods & winches'
    ],
    targetAudience: 'Vessel Inspectors, Tank Cleaners, Utility Maintenance Crews, HSE Staff.',
    assessmentType: 'Simulated Confined Space Entry & Retrieval Exercise',
    iconName: 'Box'
  },
  {
    id: 'risk-assessment',
    title: 'Workplace Risk Assessment & Hazard Identification',
    code: 'RA-10',
    level: 'Level 2',
    category: 'core',
    duration: '1 Day (8 Hours)',
    description: 'Step-by-step risk assessment methodology: 5 Steps to Risk Assessment, risk matrices, hierarchy of controls, and continuous monitoring.',
    keyModules: [
      'Identifying workplace physical, chemical, biological, and psychosocial hazards',
      'Evaluating who might be harmed and how',
      'Calculating Risk Severity vs Likelihood with 5x5 Matrix',
      'Implementing Hierarchy of Controls (Elimination to PPE)',
      'Recording findings and establishing review cycles'
    ],
    targetAudience: 'HSE Committee Members, Safety Representatives, Department Supervisors.',
    assessmentType: 'Live Workplace Risk Assessment Submission',
    iconName: 'ClipboardCheck'
  },
  {
    id: 'iso-45001',
    title: 'ISO 45001:2018 Occupational Health & Safety Management',
    code: 'ISO-45001-11',
    level: 'Lead Auditor / Implementer',
    category: 'iso',
    duration: '3-5 Days (24-40 Hours)',
    description: 'High-level structure, leadership commitment, risk-based thinking, internal auditing techniques, non-conformance management, and certification prep.',
    keyModules: [
      'High-Level Structure (HLS) and Annex SL framework',
      'Context of the organization and worker participation',
      'Operational planning and emergency preparedness',
      'Audit planning, execution, interviewing, and report writing',
      'Corrective action tracking and management review'
    ],
    targetAudience: 'Quality & HSE Managers, Internal Auditors, Compliance Officers.',
    assessmentType: 'Lead Auditor Audit Simulation & Written Examination',
    iconName: 'CheckCheck'
  },
  {
    id: 'iso-14001',
    title: 'ISO 14001:2015 Environmental Management Systems',
    code: 'ISO-14001-12',
    level: 'Internal Auditor',
    category: 'iso',
    duration: '3 Days (24 Hours)',
    description: 'Environmental aspect & impact assessment, legal compliance registers, pollution prevention, waste hierarchy, and environmental audit techniques.',
    keyModules: [
      'Understanding environmental aspects vs impacts',
      'Life cycle perspective and sustainable resource use',
      'Environmental compliance obligations',
      'Waste management and spill response planning',
      'Conducting internal environmental audits'
    ],
    targetAudience: 'Environmental Officers, Sustainability Managers, Operations Leads.',
    assessmentType: 'Audit Scenario Case Study & Final Test',
    iconName: 'Leaf'
  },
  {
    id: 'iso-27001',
    title: 'ISO 27001 Information Security Management (HSE Infrastructure)',
    code: 'ISO-27001-13',
    level: 'Foundation & Auditor',
    category: 'iso',
    duration: '3 Days (24 Hours)',
    description: 'Information security governance, critical infrastructure safety data protection, cyber-physical safety systems, and compliance audits.',
    keyModules: [
      'ISMS principles and Annex A control categories',
      'Risk assessment of sensitive safety data and operational assets',
      'Access control, incident management, and business continuity',
      'Auditing information security controls'
    ],
    targetAudience: 'IT Safety Officers, Compliance Leads, Industrial Control Technicians.',
    assessmentType: 'Written Knowledge Exam',
    iconName: 'Lock'
  },
  {
    id: 'emergency-response',
    title: 'Emergency Response Planning & Incident Command',
    code: 'ERP-14',
    level: 'Level 3',
    category: 'emergency',
    duration: '2 Days (16 Hours)',
    description: 'Structuring incident command, crisis communications, major accident hazard response, multi-agency coordination, and tabletop exercises.',
    keyModules: [
      'Emergency response team structures and Incident Commander roles',
      'Developing site-specific Emergency Response Plans (ERP)',
      'Crisis communication and family liaison procedures',
      'Desktop simulations for explosion, toxic release, and structural collapse',
      'Post-incident debriefing and continuous improvement'
    ],
    targetAudience: 'Crisis Managers, Plant Superintendents, Senior HSE Executives.',
    assessmentType: 'Tabletop Emergency Simulation Evaluation',
    iconName: 'PhoneCall'
  },
  {
    id: 'work-at-height',
    title: 'Work at Height & Fall Protection Systems',
    code: 'WAH-15',
    level: 'Level 2',
    category: 'technical',
    duration: '1 Day (8 Hours)',
    description: 'Working at Height Regulations, harness inspection, fall arrest vs fall restraint systems, anchor points, rescue after fall, and safe access.',
    keyModules: [
      'Hierarchy of control for working at height (Avoid, Prevent, Mitigate)',
      'Full body harness inspection, fitting, and rejection criteria',
      'Lanyards, inertia reels, rope grabs, and anchor strength',
      'Suspension trauma and rapid casualty retrieval',
      'Ladders, mobile elevated work platforms (MEWPs), and podiums'
    ],
    targetAudience: 'Roofers, Telecom Riggers, Maintenance Engineers, Scaffolding Crews.',
    assessmentType: 'Practical Harness Inspection & Fitting Test',
    iconName: 'ArrowUpCircle'
  },
  {
    id: 'scaffolding-safety',
    title: 'Scaffolding Safety Inspection & Erection',
    code: 'SS-16',
    level: 'Level 2/3',
    category: 'technical',
    duration: '2 Days (16 Hours)',
    description: 'Tube and fitting / system scaffolding standards, scaffold tagging (SCAFFTAG), load calculations, guardrails, bracing, and daily inspection criteria.',
    keyModules: [
      'Scaffold components: Standards, ledgers, transoms, couplers',
      'Foundations, baseplates, and sole boards on varied ground',
      'Ties, bracing, and stability calculations',
      'Scafftag green/red inspection system protocols',
      'Dismantling sequences and edge protection'
    ],
    targetAudience: 'Scaffold Inspectors, Riggers, Site Safety Supervisors.',
    assessmentType: 'Physical Scaffold Defect Inspection & Tagging Exam',
    iconName: 'Layers'
  },
  {
    id: 'electrical-safety',
    title: 'Electrical Safety & Lockout/Tagout (LOTO)',
    code: 'ES-17',
    level: 'Level 2',
    category: 'technical',
    duration: '1-2 Days (12 Hours)',
    description: 'Electrical hazards, shock, arc flash boundaries, circuit breaker isolation, zero energy verification, padlocking systems, and high-voltage awareness.',
    keyModules: [
      'Fundamentals of electrical safety and physiological effects of shock',
      'Arc flash hazards and PPE category ratings',
      'Standard 8-step Lockout/Tagout (LOTO) procedure',
      'Testing instruments and proving dead with test-before-touch',
      'Temporary power distribution and RCD/GFCI protection on site'
    ],
    targetAudience: 'Electricians, Maintenance Technicians, HSE Inspectors.',
    assessmentType: 'Hands-on LOTO Board Simulation & Knowledge Exam',
    iconName: 'Zap'
  }
];
