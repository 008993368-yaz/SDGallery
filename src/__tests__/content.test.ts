import { describe, expect, it } from "vitest";
import {
  getCaseStudy,
  getCompanies,
  getPatterns,
  getPrimaryCaseStudyForCompany,
  getSearchIndex,
  getV2LearningPath,
  getV2LearningPaths,
  getV2ScopeDocument,
} from "@/lib/content";

describe("content loaders", () => {
  it("loads four companies and six patterns", () => {
    expect(getCompanies()).toHaveLength(4);
    expect(getPatterns()).toHaveLength(6);
  });

  it("resolves netflix primary case study", () => {
    const study = getPrimaryCaseStudyForCompany("netflix");
    expect(study?.slug).toBe("netflix-video-streaming");
  });

  it("builds a non-empty search index", () => {
    expect(getSearchIndex().length).toBeGreaterThan(8);
  });

  it("loads case study body with required headings", () => {
    const study = getCaseStudy("netflix-video-streaming");
    expect(study?.body).toContain("## Problem & Requirements");
    expect(study?.body).toContain("## Key Components");
  });

  it("loads phase 2 learning metadata on Netflix", () => {
    const study = getCaseStudy("netflix-video-streaming");
    expect(study?.difficulty).toBe("beginner");
    expect(study?.estimatedReadingMinutes).toBe(3);
    expect(study?.learningObjectives.length).toBeGreaterThanOrEqual(2);
    expect(study?.prerequisites).toEqual([
      { type: "pattern", slug: "load-balancing" },
      { type: "pattern", slug: "caching" },
    ]);
  });

  it("includes difficulty on pattern and case-study search hits", () => {
    const index = getSearchIndex();
    const caching = index.find((hit) => hit.type === "pattern" && hit.slug === "caching");
    expect(caching?.difficulty).toBe("beginner");
    expect(caching?.estimatedReadingMinutes).toBe(2);
    const netflixCo = index.find((hit) => hit.type === "company" && hit.slug === "netflix");
    expect(netflixCo?.difficulty).toBeUndefined();
  });

  it("loads phase 1 scope and taxonomy definitions", () => {
    const scope = getV2ScopeDocument();
    expect(scope.productScope.objective).toContain("SDGallery V2");
    expect(scope.productScope.nonGoals).toContain("Authentication or user accounts");
    expect(scope.taxonomy.pillars.some((pillar) => pillar.slug === "fundamentals")).toBe(true);
    expect(getV2LearningPaths().length).toBeGreaterThan(0);
    expect(getV2LearningPath("beginner-systems-foundations")?.difficulty).toBe("beginner");
  });
});
