export interface Certificate {
  id: string;
  certificate_number: string;
  student_name: string;
  father_name: string;
  course_name: string;
  course_level?: string;
  issue_date: string;
  date_of_birth?: string;
  completion_date?: string;
  instructor_name?: string;
  institute_name: string;
  training_provider?: string; // alias for institute_name
  status: 'VALID' | 'SUSPENDED' | 'REVOKED' | 'EXPIRED';
  certificate_status?: 'VALID' | 'SUSPENDED' | 'REVOKED' | 'EXPIRED'; // alias for status
  verification_status?: 'VERIFIED' | 'PENDING' | 'REJECTED';
  verification_url?: string;
  certificate_url?: string;
  qr_code_url?: string;
  remarks?: string;
  created_at: string;
  updated_at: string;
}

export type VerificationState = 'idle' | 'loading' | 'verified' | 'not_found' | 'error';

export interface VerificationResult {
  state: VerificationState;
  data: Certificate | null;
  errorMessage: string | null;
  searchedQuery: string;
  verifiedAt?: string;
  verificationHash?: string;
  dataSource: 'supabase' | 'local_store';
}

export interface Course {
  id: string;
  title: string;
  code: string;
  level: string;
  category: 'core' | 'technical' | 'iso' | 'emergency';
  duration: string;
  description: string;
  keyModules: string[];
  targetAudience: string;
  assessmentType: string;
  iconName: string;
  popular?: boolean;
}

export interface ServiceItem {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  benefits: string[];
  iconName: string;
}

export type ActivePage = 'home' | 'verify' | 'courses' | 'about' | 'services' | 'contact';
