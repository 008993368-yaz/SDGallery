import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { CASE_STUDY_H2_TITLES } from "./constants";
import {
  caseStudyFrontmatterSchema,
  companyFrontmatterSchema,
  patternFrontmatterSchema,
  zodErrorToIssues,
  type CaseStudyFrontmatter,
  type PatternFrontmatter,
  type ValidationIssue,
} from "./content-schema";
import { extractFirstMermaid } from "./mdx";
import { pathContentRefExists } from "./paths";
import type { V2ScopeDocument } from "./types";

const contentRoot = path.join(process.cwd(), "content");

export type ContentKind = "company" | "pattern" | "case-study";

export type ContentCatalog = {
  companies: Set<string>;
  patterns: Set<string>;
  caseStudies: Set<string>;
};

export type { ValidationIssue };

const KIND_TO_DIR: Record<ContentKind, string> = {
  company: "companies",
  pattern: "patterns",
  "case-study": "case-studies",
};

function toPosixPath(filePath: string): string {
  return filePath.split(path.sep).join("/");
}

function contentFileLabel(absPath: string): string {
  return toPosixPath(path.relative(process.cwd(), absPath));
}

function readMdxFiles(subdir: string): string[] {
  const dir = path.join(contentRoot, subdir);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".mdx"))
    .map((name) => path.join(dir, name));
}

export function extractH2Titles(markdown: string): string[] {
  const titles: string[] = [];
  for (const line of markdown.replace(/\r\n/g, "\n").split("\n")) {
    const h2 = /^## (?!#)(.+)$/.exec(line);
    if (h2) titles.push(h2[1].trim());
  }
  return titles;
}

export function sourcesSectionHasLink(markdown: string): boolean {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  let inSources = false;
  const collected: string[] = [];
  for (const line of lines) {
    const h2 = /^## (?!#)(.+)$/.exec(line);
    if (h2) {
      inSources = h2[1].trim() === "Sources";
      continue;
    }
    if (inSources) collected.push(line);
  }
  const text = collected.join("\n");
  return /\[[^\]]+\]\([^)]+\)/.test(text) || /https?:\/\/\S+/.test(text);
}

function schemaForKind(kind: ContentKind) {
  if (kind === "company") return companyFrontmatterSchema;
  if (kind === "pattern") return patternFrontmatterSchema;
  return caseStudyFrontmatterSchema;
}

function assertSlugExists(
  issues: ValidationIssue[],
  file: string,
  issuePath: string,
  kind: ContentKind,
  slug: string,
  catalog: ContentCatalog,
) {
  const set =
    kind === "company"
      ? catalog.companies
      : kind === "pattern"
        ? catalog.patterns
        : catalog.caseStudies;
  if (!set.has(slug)) {
    issues.push({
      file,
      path: issuePath,
      message: `${kind} "${slug}" does not exist`,
    });
  }
}

function validateCrossRefs(
  kind: ContentKind,
  file: string,
  data: unknown,
  catalog: ContentCatalog,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (kind === "pattern") {
    const pattern = data as PatternFrontmatter;
    pattern.relatedPatterns.forEach((slug, index) => {
      assertSlugExists(
        issues,
        file,
        `relatedPatterns.${index}`,
        "pattern",
        slug,
        catalog,
      );
    });
    pattern.prerequisites.forEach((ref, index) => {
      assertSlugExists(
        issues,
        file,
        `prerequisites.${index}`,
        ref.type,
        ref.slug,
        catalog,
      );
    });
  }

  if (kind === "case-study") {
    const study = data as CaseStudyFrontmatter;
    assertSlugExists(issues, file, "company", "company", study.company, catalog);
    study.patterns.forEach((slug, index) => {
      assertSlugExists(issues, file, `patterns.${index}`, "pattern", slug, catalog);
    });
    study.relatedCompanies.forEach((slug, index) => {
      assertSlugExists(
        issues,
        file,
        `relatedCompanies.${index}`,
        "company",
        slug,
        catalog,
      );
    });
    study.prerequisites.forEach((ref, index) => {
      assertSlugExists(
        issues,
        file,
        `prerequisites.${index}`,
        ref.type,
        ref.slug,
        catalog,
      );
    });
  }

  return issues;
}

export function buildContentCatalog(): ContentCatalog {
  const slugsFrom = (subdir: string) =>
    new Set(
      readMdxFiles(subdir).map((file) => path.basename(file, ".mdx")),
    );

  return {
    companies: slugsFrom("companies"),
    patterns: slugsFrom("patterns"),
    caseStudies: slugsFrom("case-studies"),
  };
}

export function validateMdxSource(
  kind: ContentKind,
  filePath: string,
  raw: string,
  catalog: ContentCatalog,
): ValidationIssue[] {
  const file = toPosixPath(filePath);
  const issues: ValidationIssue[] = [];

  let data: unknown;
  let body: string;
  try {
    const parsed = matter(raw);
    data = parsed.data;
    body = parsed.content;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to parse MDX";
    return [{ file, path: "frontmatter", message }];
  }

  const schemaResult = schemaForKind(kind).safeParse(data);
  if (!schemaResult.success) {
    issues.push(...zodErrorToIssues(file, schemaResult.error));
  }

  const expectedSlug = path.posix.basename(toPosixPath(filePath), ".mdx");
  const actualSlug =
    data && typeof data === "object" && "slug" in data
      ? (data as { slug?: unknown }).slug
      : undefined;
  if (typeof actualSlug === "string" && actualSlug !== expectedSlug) {
    issues.push({
      file,
      path: "slug",
      message: `Frontmatter slug "${actualSlug}" does not match filename "${expectedSlug}"`,
    });
  }

  if (kind === "pattern" || kind === "case-study") {
    if (!extractFirstMermaid(body)) {
      issues.push({
        file,
        path: "body",
        message: "Expected at least one Mermaid fence",
      });
    }
  }

  if (kind === "case-study") {
    const titles = extractH2Titles(body);
    const expected = [...CASE_STUDY_H2_TITLES];
    const matches =
      titles.length === expected.length &&
      titles.every((title, index) => title === expected[index]);
    if (!matches) {
      issues.push({
        file,
        path: "headings",
        message: `Expected H2 headings in order: ${expected.join(" → ")}. Found: ${titles.join(" → ") || "(none)"}`,
      });
    }
    if (!sourcesSectionHasLink(body)) {
      issues.push({
        file,
        path: "sources",
        message: "Sources section must contain at least one markdown or URL link",
      });
    }
  }

  if (schemaResult.success) {
    issues.push(...validateCrossRefs(kind, file, schemaResult.data, catalog));
  }

  return issues;
}

export function validateLearningPaths(
  catalog: ContentCatalog = buildContentCatalog(),
): ValidationIssue[] {
  const filePath = path.join(contentRoot, "v2", "scope-and-taxonomy.json");
  const file = contentFileLabel(filePath);
  if (!fs.existsSync(filePath)) {
    return [{ file, path: "taxonomy.learningPaths", message: "Missing V2 scope file" }];
  }

  let scope: V2ScopeDocument;
  try {
    scope = JSON.parse(fs.readFileSync(filePath, "utf8")) as V2ScopeDocument;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to parse V2 scope JSON";
    return [{ file, path: "taxonomy.learningPaths", message }];
  }

  const issues: ValidationIssue[] = [];
  const pathSlugs = new Set(scope.taxonomy.learningPaths.map((p) => p.slug));

  scope.taxonomy.learningPaths.forEach((learningPath, pathIndex) => {
    const base = `taxonomy.learningPaths.${pathIndex}`;

    learningPath.prerequisites.forEach((prereqSlug, prereqIndex) => {
      if (!pathSlugs.has(prereqSlug)) {
        issues.push({
          file,
          path: `${base}.prerequisites.${prereqIndex}`,
          message: `Learning path prerequisite "${prereqSlug}" does not exist`,
        });
      }
    });

    learningPath.contentRefs.forEach((ref, refIndex) => {
      const issuePath = `${base}.contentRefs.${refIndex}`;
      const set =
        ref.type === "company"
          ? catalog.companies
          : ref.type === "pattern"
            ? catalog.patterns
            : catalog.caseStudies;

      if (!set.has(ref.slug)) {
        issues.push({
          file,
          path: issuePath,
          message: `${ref.type} "${ref.slug}" does not exist`,
        });
        return;
      }

      if (!pathContentRefExists(ref)) {
        issues.push({
          file,
          path: issuePath,
          message:
            ref.type === "company"
              ? `company "${ref.slug}" has no primary case study to link`
              : `${ref.type} "${ref.slug}" does not resolve to a navigable page`,
        });
      }
    });
  });

  return issues;
}

export function validateAllContent(): ValidationIssue[] {
  const catalog = buildContentCatalog();
  const issues: ValidationIssue[] = [];

  (Object.keys(KIND_TO_DIR) as ContentKind[]).forEach((kind) => {
    for (const absPath of readMdxFiles(KIND_TO_DIR[kind])) {
      const raw = fs.readFileSync(absPath, "utf8");
      issues.push(
        ...validateMdxSource(kind, contentFileLabel(absPath), raw, catalog),
      );
    }
  });

  issues.push(...validateLearningPaths(catalog));

  return issues;
}
