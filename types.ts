export enum Tone {
  PROFESSIONAL = 'Professional',
  ENTHUSIASTIC = 'Enthusiastic',
  CONFIDENT = 'Confident',
  HUMBLE_CONFIDENT = 'Humble but Confident',
  CREATIVE = 'Creative',
  FORMAL = 'Formal'
}

export enum Language {
  US_ENGLISH = 'American English',
  UK_ENGLISH = 'British English (UK/Europe)',
  TRADITIONAL_CHINESE = 'Traditional Chinese (繁體中文)'
}

export interface CoverLetterData {
  resumeText: string;
  jobDescription: string;
  tone: Tone;
  language: Language;
  candidateName: string;
  companyName: string;
  writingSample: string;
  education: string;
  researchProjects: string;
  revisionInstructions?: string;
}

export interface Source {
  title: string;
  uri: string;
}

export interface AnalysisResult {
  score: number;
  pros: string[];
  cons: string[];
  verdict: string;
}

export interface GenerationResult {
  coverLetter: string;
  tailoredResume: string;
  sources?: Source[];
  error?: string;
}