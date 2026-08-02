import { describe, expect, it } from "vitest";
import {
  getCaseStudy,
  getCompanies,
  getPatterns,
  getPrimaryCaseStudyForCompany,
  getSearchIndex,
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
});
