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

export type V2ScopeMetric = {
  name: string;
  description: string;
  target: string;
};

export type V2TaxonomyTopic = {
  slug: string;
  title: string;
  description: string;
};

export type V2TaxonomyPillar = {
  slug: string;
  title: string;
  summary: string;
  order: number;
  topics: V2TaxonomyTopic[];
  recommendedEntryPoints: string[];
};

export type V2ContentReference = {
  type: "company" | "pattern" | "case-study";
  slug: string;
  title: string;
};

export type V2LearningPath = {
  slug: string;
  title: string;
  audience: string;
  difficulty: string;
  summary: string;
  pillars: string[];
  prerequisites: string[];
  contentRefs: V2ContentReference[];
};

export type V2Taxonomy = {
  pillars: V2TaxonomyPillar[];
  learningPaths: V2LearningPath[];
};

export type V2ProductScope = {
  objective: string;
  successMetrics: V2ScopeMetric[];
  guidingPrinciples: string[];
  nonGoals: string[];
};

export type V2ScopeDocument = {
  version: string;
  productScope: V2ProductScope;
  taxonomy: V2Taxonomy;
};
