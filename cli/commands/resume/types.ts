/** Subset of the JSON Resume schema (v1.0.0) used by resume.json. */

export interface ResumeLocation {
  city?: string;
  countryCode?: string;
  region?: string;
}

export interface ResumeProfile {
  network: string;
  username: string;
  url: string;
}

export interface ResumeBasics {
  name: string;
  label: string;
  email: string;
  url: string;
  summary: string;
  location?: ResumeLocation;
  profiles?: ResumeProfile[];
}

export interface ResumeWorkEntry {
  name: string;
  position: string;
  url?: string;
  startDate: string;
  endDate?: string;
  summary?: string;
  highlights?: string[];
}

export interface ResumeVolunteerEntry {
  organization: string;
  position: string;
  url?: string;
  startDate: string;
  endDate?: string;
  summary?: string;
}

export interface ResumeEducationEntry {
  institution: string;
  area: string;
  studyType: string;
  startDate: string;
  endDate?: string;
}

export interface ResumeSkill {
  name: string;
  keywords: string[];
}

export interface ResumeLanguageEntry {
  language: string;
  fluency: string;
}

export interface ResumeProjectEntry {
  name: string;
  description?: string;
  url?: string;
  type?: string;
  entity?: string;
  startDate?: string;
  location?: { name?: string; country?: string };
  slides?: string;
  recording?: string;
}

export interface Resume {
  basics: ResumeBasics;
  work: ResumeWorkEntry[];
  volunteer?: ResumeVolunteerEntry[];
  education?: ResumeEducationEntry[];
  skills?: ResumeSkill[];
  languages?: ResumeLanguageEntry[];
  projects?: ResumeProjectEntry[];
}
