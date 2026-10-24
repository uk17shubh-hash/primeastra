// src/types/resume.ts
export interface ExperienceItem {
  id: number;
  role: string;
  company: string;
  duration: string;
  details: string;
}

export interface EducationItem {
  id: number;
  degree: string;
  institution: string;
  year: string;
}

export interface ResumeData {
  fullName: string;
  jobTitle: string;
  phone: string;
  email: string;
  location: string;
  summary: string;
  skills: string;
  languages: string;
  experience: ExperienceItem[];
  education: EducationItem[];
}