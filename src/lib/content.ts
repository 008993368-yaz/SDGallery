import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { z } from "zod";
import {
  caseStudyFrontmatterSchema,
  companyFrontmatterSchema,
  parseFrontmatter,
  patternFrontmatterSchema,
} from "./content-schema";
import type {
  CaseStudy,
  Company,
  Contributor,
  Pattern,
  PrerequisiteRef,
  SearchHit,
  V2LearningPath,
  V2ScopeDocument,
  V2TaxonomyPillar,
} from "./types";

const contentRoot = path.join(process.cwd(), "content");

function readMdxFiles(subdir: string): string[] {
  const dir = path.join(contentRoot, subdir);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".mdx"))
    .map((name) => path.join(dir, name));
}

function loadMdx<T>(
  filePath: string,
  schema: z.ZodType<T, z.ZodTypeDef, unknown>,
): T & { body: string } {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const parsed = parseFrontmatter(schema, data, filePath);
  return { ...parsed, body: content };
}

function getV2ScopeFilePath(): string {
  return path.join(contentRoot, "v2", "scope-and-taxonomy.json");
}

export function getV2ScopeDocument(): V2ScopeDocument {
  const filePath = getV2ScopeFilePath();
  if (!fs.existsSync(filePath)) {
    return {
      version: "0.0.0",
      productScope: {
        objective: "",
        successMetrics: [],
        guidingPrinciples: [],
        nonGoals: [],
      },
      taxonomy: {
        pillars: [],
        learningPaths: [],
      },
    };
  }

  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw) as V2ScopeDocument;
}

export function getV2TaxonomyPillars(): V2TaxonomyPillar[] {
  return getV2ScopeDocument().taxonomy.pillars;
}

export function getV2LearningPaths(): V2LearningPath[] {
  return getV2ScopeDocument().taxonomy.learningPaths;
}

export function getV2LearningPath(slug: string): V2LearningPath | undefined {
  return getV2LearningPaths().find((pathEntry) => pathEntry.slug === slug);
}

export function getCompanies(): Company[] {
  return readMdxFiles("companies")
    .map((file) => loadMdx(file, companyFrontmatterSchema))
    .sort((a, b) => b.popularity - a.popularity || a.name.localeCompare(b.name));
}

export function getCompany(slug: string): Company | undefined {
  return getCompanies().find((c) => c.slug === slug);
}

export function getPatterns(): Pattern[] {
  return readMdxFiles("patterns")
    .map((file) => loadMdx(file, patternFrontmatterSchema))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getPattern(slug: string): Pattern | undefined {
  return getPatterns().find((p) => p.slug === slug);
}

export function getCaseStudies(): CaseStudy[] {
  return readMdxFiles("case-studies")
    .map((file) => loadMdx(file, caseStudyFrontmatterSchema))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return getCaseStudies().find((s) => s.slug === slug);
}

export function getFeaturedCaseStudies(): CaseStudy[] {
  return getCaseStudies().filter((s) => s.featured);
}

export function getRecentCaseStudies(limit: number): CaseStudy[] {
  return getCaseStudies().slice(0, limit);
}

export function getCaseStudiesByPattern(patternSlug: string): CaseStudy[] {
  return getCaseStudies().filter((s) => s.patterns.includes(patternSlug));
}

export function getPrimaryCaseStudyForCompany(
  companySlug: string,
): CaseStudy | undefined {
  const studies = getCaseStudies().filter((s) => s.company === companySlug);
  if (studies.length === 0) return undefined;
  const featured = studies.find((s) => s.featured);
  if (featured) return featured;
  return [...studies].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))[0];
}

export function getSearchIndex(): SearchHit[] {
  const companies = getCompanies();
  const patterns = getPatterns();
  const caseStudies = getCaseStudies();
  const companyBySlug = new Map(companies.map((c) => [c.slug, c]));

  const hits: SearchHit[] = [];

  for (const company of companies) {
    const primary = getPrimaryCaseStudyForCompany(company.slug);
    hits.push({
      type: "company",
      slug: company.slug,
      title: company.name,
      industry: company.industry,
      snippet: company.summary,
      href: primary ? `/case-studies/${primary.slug}` : "/companies",
    });
  }

  for (const pattern of patterns) {
    hits.push({
      type: "pattern",
      slug: pattern.slug,
      title: pattern.name,
      snippet: pattern.definition,
      href: `/patterns/${pattern.slug}`,
      difficulty: pattern.difficulty,
      estimatedReadingMinutes: pattern.estimatedReadingMinutes,
      learningObjectives: pattern.learningObjectives,
    });
  }

  for (const study of caseStudies) {
    hits.push({
      type: "case-study",
      slug: study.slug,
      title: study.title,
      industry: companyBySlug.get(study.company)?.industry,
      snippet: study.hook,
      href: `/case-studies/${study.slug}`,
      difficulty: study.difficulty,
      estimatedReadingMinutes: study.estimatedReadingMinutes,
      learningObjectives: study.learningObjectives,
    });
  }

  return hits;
}

export function getPrerequisiteLinks(
  refs: PrerequisiteRef[],
): { href: string; label: string }[] {
  return refs.map((ref) => {
    if (ref.type === "pattern") {
      const pattern = getPattern(ref.slug);
      return {
        href: `/patterns/${ref.slug}`,
        label: pattern?.name ?? ref.slug,
      };
    }
    const study = getCaseStudy(ref.slug);
    return {
      href: `/case-studies/${ref.slug}`,
      label: study?.title ?? ref.slug,
    };
  });
}

export function getContributors(): Contributor[] {
  const filePath = path.join(contentRoot, "contributors.json");
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw) as Contributor[];
}
