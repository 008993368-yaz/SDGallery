export type Company = {
  name: string;
  slug: string;
  logo: string;
  industry: string;
  scale: string;
  techStack: string[];
  summary: string;
  popularity: number;
  updatedAt: string;
  body: string;
};

export type Pattern = {
  name: string;
  slug: string;
  icon: string;
  definition: string;
  relatedPatterns: string[];
  publishedAt: string;
  body: string;
};

export type CaseStudyStats = {
  users: string;
  rps: string;
  dataVolume: string;
  regions: string;
};

export type CaseStudy = {
  title: string;
  slug: string;
  company: string;
  patterns: string[];
  stats: CaseStudyStats;
  featured: boolean;
  publishedAt: string;
  updatedAt: string;
  relatedCompanies: string[];
  hook: string;
  body: string;
};

export type SearchHitType = "company" | "pattern" | "case-study";

export type SearchHit = {
  type: SearchHitType;
  slug: string;
  title: string;
  industry?: string;
  snippet: string;
  href: string;
};

export type ContentSection = {
  id: string;
  title: string;
  content: string;
  children?: ContentSection[];
};

export type Contributor = {
  name: string;
  avatar: string;
  github: string;
};
