export type DRGrade = 0 | 1 | 2 | 3 | 4;

export type SitePage = 'home' | 'prediction' | 'grad-cam' | 'performance' | 'about' | 'contact';

export interface DRGradeInfo {
  grade: DRGrade;
  name: string;
  fullName: string;
  shortDescription: string;
  clinicalCriteria: string;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  color: string;
  badgeBg: string;
  badgeText: string;
  followUpRecommendation: string;
  icd10: string;
}

export interface LesionDetection {
  id: string;
  type: 'Microaneurysms' | 'Hemorrhages' | 'Hard Exudates' | 'Cotton Wool Spots' | 'Neovascularization';
  count: number;
  severityContribution: number; // percentage e.g. 42
  coordinates: { x: number; y: number; width: number; height: number }[];
  description: string;
  color: string;
  quadrant?: string;
}

export interface GradCamRegion {
  id: string;
  label: string;
  weight: number;
  quadrant: 'Superior Temporal' | 'Inferior Temporal' | 'Superior Nasal' | 'Inferior Nasal' | 'Macular Zone';
  significance: string;
}

export interface OphthalmologistSuggestion {
  ophthalmologistName: string;
  ophthalmologistTitle: string;
  licenseNumber: string;
  affiliation: string;
  clinicalAgreement: 'concur' | 'modified' | 'equivocal';
  finalGrade: DRGrade;
  clinicalImpressions: string;
  treatmentRecommendations: string[];
  followUpInterval: string;
  macularEdemaPresent: boolean;
  reviewedDate: string;
  signatureStamp: string;
}

export interface PredictionResult {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  eyeSide: 'OD (Right Eye)' | 'OS (Left Eye)';
  timestamp: string;
  imageUrl: string;
  predictedGrade: DRGrade;
  confidence: number; // 0.0 - 1.0
  probabilities: {
    noDR: number;
    mild: number;
    moderate: number;
    severe: number;
    proliferative: number;
  };
  qualityScore: number; // e.g. 98%
  qualityMetrics: {
    sharpness: number;
    illumination: number;
    contrast: number;
    maculaVisibility: number;
  };
  gradCamUrl?: string;
  gradCamRegions: GradCamRegion[];
  lesions: LesionDetection[];
  clinicalInterpretation: string;
  recommendedFollowUp: string;
  reviewedByDoctor?: boolean;
  reviewedAt?: string;
  doctorNotes?: string;
  ophthalmologistReview?: OphthalmologistSuggestion;
}

export interface PatientRecord {
  id: string;
  mrn: string; // Medical Record Number
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  diabetesType: 'Type 1' | 'Type 2' | 'Gestational';
  durationYears: number;
  hbA1c: number; // e.g. 7.8%
  lastExamDate: string;
  currentGrade: DRGrade;
  visualAcuityOD: string; // e.g. "20/25"
  visualAcuityOS: string; // e.g. "20/40"
  status: 'Routine Follow-up' | 'Review Required' | 'Urgent Referral' | 'Stable';
  phone: string;
  email: string;
  predictionsCount: number;
  notes?: string;
  fundusImages?: string[];
  lastDiagnosis?: {
    grade: DRGrade;
    date: string;
  };
}

export type Patient = PatientRecord;

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  contextSnippet?: string;
  source?: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  status: 'Success' | 'Warning' | 'Flagged';
  details: string;
}

export interface ClinicianUser {
  uid: string;
  name: string;
  email: string;
  role: string;
  affiliation?: string;
  licenseNumber?: string;
  photoURL?: string;
  isAnonymous?: boolean;
}
