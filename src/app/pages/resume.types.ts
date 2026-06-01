export interface JobEntry {
  title: string;
  meta: string;
  bullets: string[];
}

export interface EducationEntry {
  degree: string;
  school: string;
}

export interface ResumeData {
  workExperience: JobEntry[];
  software: string;
  skills: string;
  languages: string;
  additional: string[];
  education: EducationEntry[];
  downloadUrl?: string;
}
