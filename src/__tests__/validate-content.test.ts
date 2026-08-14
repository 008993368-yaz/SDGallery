import { describe, expect, it } from "vitest";
import {
  extractH2Titles,
  sourcesSectionHasLink,
  validateAllContent,
  validateMdxSource,
  type ContentCatalog,
} from "@/lib/validate-content";

const catalog: ContentCatalog = {
  companies: new Set(["example", "netflix"]),
  patterns: new Set(["caching", "cdn"]),
  caseStudies: new Set(["example-at-scale", "netflix-video-streaming"]),
};

const mermaidFence = `\`\`\`mermaid
flowchart LR
  A --> B
\`\`\``;

const requiredHeadings = `## Problem & Requirements

Need X.

## High-Level Design

${mermaidFence}

## Key Components

Parts.

## Deep Dives

### Caching

Redis.

## Trade-offs

Costs.

## Evolution

Grew.

## Sources

- [Public post](https://example.com)
`;

function caseStudySource(overrides?: {
  frontmatter?: string;
  body?: string;
  slug?: string;
}): string {
  const slug = overrides?.slug ?? "example-at-scale";
  const frontmatter =
    overrides?.frontmatter ??
    `title: "How Example Serves Users at Scale"
slug: ${slug}
company: example
patterns: [caching]
stats:
  users: "100M+"
  rps: "millions"
  dataVolume: "petabytes"
  regions: "50+"
featured: false
publishedAt: "2026-08-01"
updatedAt: "2026-08-01"
relatedCompanies: []
hook: "One-line card hook"
difficulty: intermediate
prerequisites:
  - type: pattern
    slug: caching
estimatedReadingMinutes: 4
learningObjectives:
  - Map the high-level design to the patterns in play
  - Identify the main trade-offs in the write-up`;

  return `---
${frontmatter}
---

${overrides?.body ?? requiredHeadings}`;
}

describe("validateAllContent", () => {
  it("returns zero issues for the current corpus", () => {
    expect(validateAllContent()).toEqual([]);
  });
});

describe("validateMdxSource", () => {
  it("accepts a valid case study fixture", () => {
    const issues = validateMdxSource(
      "case-study",
      "content/case-studies/example-at-scale.mdx",
      caseStudySource(),
      catalog,
    );
    expect(issues).toEqual([]);
  });

  it("reports heading-order failures", () => {
    const issues = validateMdxSource(
      "case-study",
      "content/case-studies/example-at-scale.mdx",
      caseStudySource({
        body: `## High-Level Design

${mermaidFence}

## Problem & Requirements

Need X.

## Sources

- [Public post](https://example.com)
`,
      }),
      catalog,
    );
    expect(issues.some((issue) => issue.path === "headings")).toBe(true);
  });

  it("reports unresolved prerequisite cross-refs", () => {
    const issues = validateMdxSource(
      "case-study",
      "content/case-studies/example-at-scale.mdx",
      caseStudySource({
        frontmatter: `title: "How Example Serves Users at Scale"
slug: example-at-scale
company: example
patterns: [caching]
stats:
  users: "100M+"
  rps: "millions"
  dataVolume: "petabytes"
  regions: "50+"
featured: false
publishedAt: "2026-08-01"
updatedAt: "2026-08-01"
relatedCompanies: []
hook: "One-line card hook"
difficulty: intermediate
prerequisites:
  - type: pattern
    slug: missing-pattern
estimatedReadingMinutes: 4
learningObjectives:
  - Map the high-level design to the patterns in play
  - Identify the main trade-offs in the write-up`,
      }),
      catalog,
    );
    expect(
      issues.some(
        (issue) =>
          issue.path.startsWith("prerequisites") &&
          issue.message.includes("missing-pattern"),
      ),
    ).toBe(true);
  });

  it("reports a slug that does not match the filename", () => {
    const issues = validateMdxSource(
      "pattern",
      "content/patterns/caching.mdx",
      `---
name: Caching
slug: not-caching
icon: cache
definition: Store hot data closer to users
relatedPatterns: []
publishedAt: "2026-08-01"
difficulty: beginner
prerequisites: []
estimatedReadingMinutes: 2
learningObjectives:
  - Explain the idea
  - Identify when it applies
---

## What it is

Body.

${mermaidFence}
`,
      catalog,
    );
    expect(issues.some((issue) => issue.path === "slug")).toBe(true);
  });

  it("reports a missing Mermaid fence on patterns", () => {
    const issues = validateMdxSource(
      "pattern",
      "content/patterns/caching.mdx",
      `---
name: Caching
slug: caching
icon: cache
definition: Store hot data closer to users
relatedPatterns: []
publishedAt: "2026-08-01"
difficulty: beginner
prerequisites: []
estimatedReadingMinutes: 2
learningObjectives:
  - Explain the idea
  - Identify when it applies
---

## What it is

No diagram here.
`,
      catalog,
    );
    expect(issues.some((issue) => issue.path === "body")).toBe(true);
  });
});

describe("heading and sources helpers", () => {
  it("extracts H2 titles in order", () => {
    expect(extractH2Titles(requiredHeadings)).toEqual([
      "Problem & Requirements",
      "High-Level Design",
      "Key Components",
      "Deep Dives",
      "Trade-offs",
      "Evolution",
      "Sources",
    ]);
  });

  it("detects a Sources link", () => {
    expect(sourcesSectionHasLink(requiredHeadings)).toBe(true);
    expect(sourcesSectionHasLink("## Sources\n\nNo links yet.\n")).toBe(false);
  });
});
