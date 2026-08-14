import { describe, expect, it } from "vitest";
import {
  caseStudyFrontmatterSchema,
  companyFrontmatterSchema,
  patternFrontmatterSchema,
} from "@/lib/content-schema";

const validPattern = {
  name: "Caching",
  slug: "caching",
  icon: "cache",
  definition: "Store hot data closer to users",
  relatedPatterns: ["cdn"],
  publishedAt: "2026-08-01",
  difficulty: "beginner",
  prerequisites: [],
  estimatedReadingMinutes: 2,
  learningObjectives: [
    "Explain what a cache hit means",
    "Identify when caching is appropriate",
  ],
};

const validCaseStudy = {
  title: "How Example Serves Users at Scale",
  slug: "example-at-scale",
  company: "example",
  patterns: ["caching"],
  stats: {
    users: "100M+",
    rps: "millions",
    dataVolume: "petabytes",
    regions: "50+",
  },
  featured: false,
  publishedAt: "2026-08-01",
  updatedAt: "2026-08-01",
  relatedCompanies: [],
  hook: "One-line card hook",
  difficulty: "intermediate",
  prerequisites: [{ type: "pattern", slug: "caching" }],
  estimatedReadingMinutes: 4,
  learningObjectives: [
    "Map the high-level design to the patterns in play",
    "Identify the main trade-offs in the write-up",
  ],
};

const validCompany = {
  name: "Example Co",
  slug: "example",
  logo: "/logos/example.svg",
  industry: "Media",
  scale: "Global",
  techStack: ["CDN", "Caching"],
  summary: "One-line summary for directory cards.",
  popularity: 10,
  updatedAt: "2026-08-01",
};

describe("patternFrontmatterSchema", () => {
  it("accepts valid learning metadata", () => {
    const result = patternFrontmatterSchema.safeParse(validPattern);
    expect(result.success).toBe(true);
  });

  it("rejects missing difficulty", () => {
    const { difficulty: _difficulty, ...rest } = validPattern;
    const result = patternFrontmatterSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects invalid difficulty", () => {
    const result = patternFrontmatterSchema.safeParse({
      ...validPattern,
      difficulty: "expert",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a non-positive reading time", () => {
    const result = patternFrontmatterSchema.safeParse({
      ...validPattern,
      estimatedReadingMinutes: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects learningObjectives outside 2–6 items", () => {
    expect(
      patternFrontmatterSchema.safeParse({
        ...validPattern,
        learningObjectives: ["Only one"],
      }).success,
    ).toBe(false);
    expect(
      patternFrontmatterSchema.safeParse({
        ...validPattern,
        learningObjectives: ["a", "b", "c", "d", "e", "f", "g"],
      }).success,
    ).toBe(false);
  });

  it("rejects a malformed slug", () => {
    const result = patternFrontmatterSchema.safeParse({
      ...validPattern,
      slug: "Load Balancing",
    });
    expect(result.success).toBe(false);
  });
});

describe("caseStudyFrontmatterSchema", () => {
  it("accepts valid learning metadata and stats", () => {
    const result = caseStudyFrontmatterSchema.safeParse(validCaseStudy);
    expect(result.success).toBe(true);
  });

  it("rejects missing prerequisites", () => {
    const { prerequisites: _prerequisites, ...rest } = validCaseStudy;
    const result = caseStudyFrontmatterSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects an invalid prerequisite type", () => {
    const result = caseStudyFrontmatterSchema.safeParse({
      ...validCaseStudy,
      prerequisites: [{ type: "company", slug: "netflix" }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects incomplete stats", () => {
    const result = caseStudyFrontmatterSchema.safeParse({
      ...validCaseStudy,
      stats: { users: "100M+", rps: "millions", dataVolume: "petabytes" },
    });
    expect(result.success).toBe(false);
  });
});

describe("companyFrontmatterSchema", () => {
  it("accepts existing company fields without learning metadata", () => {
    const result = companyFrontmatterSchema.safeParse(validCompany);
    expect(result.success).toBe(true);
  });

  it("rejects a missing summary", () => {
    const { summary: _summary, ...rest } = validCompany;
    const result = companyFrontmatterSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });
});
