import { ServiceItem } from '../types';

export const ALL_SERVICES: ServiceItem[] = [
  {
    id: 'health-safety-training',
    title: 'Health & Safety Training',
    shortDesc: 'Comprehensive HSE curricula covering occupational hazards, safety leadership, and statutory compliance across industrial sectors.',
    fullDesc: 'We provide structured health and safety training programs tailored to operational needs. From foundational workforce inductions to advanced supervisory diplomas, our modules instill safety culture and compliance with occupational health regulations.',
    benefits: [
      'Structured learning pathways from Level 1 to Level 4',
      'Hands-on practical risk assessment assignments',
      'Delivered by qualified safety practitioners',
      'Official verification-ready certificate issuance'
    ],
    iconName: 'ShieldCheck'
  },
  {
    id: 'corporate-safety-training',
    title: 'Corporate Safety Training',
    shortDesc: 'Customized on-site and blended training solutions engineered for corporate clients, multinationals, and enterprise workforces.',
    fullDesc: 'Partnering with corporate health, safety, and environment directors to audit organizational skills gaps, design bespoke corporate safety curricula, and train entire teams on company-specific standard operating procedures.',
    benefits: [
      'Tailored to your specific industry risk profile',
      'Flexible scheduling: on-site, off-site, or live digital',
      'Bulk candidate verification and compliance dashboard',
      'Post-training impact assessments and performance metrics'
    ],
    iconName: 'Building2'
  },
  {
    id: 'workplace-safety-awareness',
    title: 'Workplace Safety Awareness',
    shortDesc: 'Practical campaigns and micro-workshops focused on proactive hazard spotting, ergonomics, slip/trip prevention, and mental wellbeing.',
    fullDesc: 'Empowering frontline workers to adopt safety as a personal value. Our interactive awareness workshops cover daily toolbox talk methodologies, near-miss reporting habits, and dynamic workplace hazard spotting.',
    benefits: [
      'Enhances safety reporting and near-miss culture',
      'Reduces lost-time injury (LTI) rates',
      'Focuses on behavioral safety and human factors',
      'Accessible to diverse multilingual workforces'
    ],
    iconName: 'Eye'
  },
  {
    id: 'risk-assessment-training',
    title: 'Risk Assessment Training',
    shortDesc: 'Systematic methodology training to identify hazards, quantify risk with 5x5 matrices, and implement the hierarchy of controls.',
    fullDesc: 'Equipping team leads and safety reps with practical skills to conduct comprehensive workplace risk assessments, develop safe systems of work (SSOW), and audit existing control measures.',
    benefits: [
      'Application of standard 5-step risk assessment models',
      'Customized risk matrices for your specific operational hazards',
      'Hierarchy of control application from elimination to PPE',
      'Defensible documentation for compliance and insurance audits'
    ],
    iconName: 'ClipboardList'
  },
  {
    id: 'fire-safety-training',
    title: 'Fire Safety Training',
    shortDesc: 'Theoretical and practical fire warden instruction, evacuation management, and hands-on extinguisher operation.',
    fullDesc: 'Preparing appointed fire wardens, marshals, and staff to respond calmly and decisively in fire emergencies. Includes fire triangle science, evacuation strategies, and fire extinguisher handling.',
    benefits: [
      'Designated Fire Warden certification and duties',
      'Extinguisher classification and hands-on handling',
      'Evacuation drill planning and disabled assistance (PEEP)',
      'Liaison protocols with emergency rescue services'
    ],
    iconName: 'Flame'
  },
  {
    id: 'first-aid-training',
    title: 'First Aid Training',
    shortDesc: 'Life-saving CPR, AED operation, trauma wound dressing, and critical casualty triage training for appointed workplace first aiders.',
    fullDesc: 'Delivering vital emergency first aid skills aligned with modern resuscitation guidelines. Candidates practice CPR chest compressions, AED placement, fracture splinting, and acute medical crisis stabilization.',
    benefits: [
      'Hands-on CPR manikin practice with feedback',
      'Automated External Defibrillator (AED) operation',
      'Emergency trauma, burns, and fracture immobilization',
      'Clear protocols for managing workplace medical emergencies'
    ],
    iconName: 'HeartPulse'
  },
  {
    id: 'construction-safety-training',
    title: 'Construction Safety Training',
    shortDesc: 'Specialized training for civil sites, covering excavations, heavy lifting, work at height, scaffolding, and temporary works.',
    fullDesc: 'Targeting high-risk construction activities. We instruct engineers, foremen, and contractors on site layout safety, crane lift planning, fall prevention systems, and subcontractor HSE management.',
    benefits: [
      'Work at height and scaffold inspection fundamentals',
      'Excavation, trenching, and underground service detection',
      'Heavy machinery safety and banksman signals',
      'Daily site hazard management and toolbox talks'
    ],
    iconName: 'HardHat'
  },
  {
    id: 'professional-hse-development',
    title: 'Professional HSE Development',
    shortDesc: 'Career mentoring, continuous professional development (CPD), and advanced certifications for aspiring safety managers.',
    fullDesc: 'Guiding safety practitioners through structured professional development pathways. We provide technical masterclasses, interview preparation for safety officer roles, and safety audit methodology coaching.',
    benefits: [
      'Structured career roadmap for safety professionals',
      'Masterclasses on auditing and incident investigation',
      'Preparation for international HSE examinations',
      'Access to technical safety knowledge networks'
    ],
    iconName: 'GraduationCap'
  },
  {
    id: 'certificate-verification-service',
    title: 'Online Certificate Verification',
    shortDesc: 'Instant, secure, 24/7 digital verification portal enabling employers and authorities worldwide to authenticate official credentials.',
    fullDesc: 'Our core verification infrastructure provides employers, project clients, and government compliance officers immediate cryptographic confirmation of student awards, ensuring 100% transparency and authenticity.',
    benefits: [
      'Instant 24/7 global online verification by certificate number',
      'Scannable secure QR code validation on all physical credentials',
      'Direct Supabase database query with zero mock dependency',
      'Full traceability of issue dates, student names, and award levels'
    ],
    iconName: 'QrCode'
  }
];
