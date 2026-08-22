import { describe, expect, it } from "vitest";
import {
  getLearningPathsForCompany,
  getPathGuidesForContent,
  getPathsContainingContent,
  getPathStepNeighbors,
  pathContentRefExists,
  resolvePathContentHref,
  resolvePathStep,
} from "@/lib/paths";
import { validateLearningPaths } from "@/lib/validate-content";

describe("learning path helpers", () => {
  it("resolves pattern and case-study refs to detail pages", () => {
    expect(
      resolvePathContentHref({
        type: "pattern",
        slug: "caching",
        title: "Caching",
      }),
    ).toBe("/patterns/caching");
    expect(
      resolvePathContentHref({
        type: "case-study",
        slug: "netflix-video-streaming",
        title: "Netflix",
      }),
    ).toBe("/case-studies/netflix-video-streaming");
  });

  it("resolves company refs to the primary case study (no dead ends)", () => {
    const step = resolvePathStep({
      type: "company",
      slug: "netflix",
      title: "Netflix",
    });
    expect(step?.href).toBe("/case-studies/netflix-video-streaming");
    expect(step?.resolvedType).toBe("case-study");
    expect(step?.resolvedSlug).toBe("netflix-video-streaming");
    expect(pathContentRefExists({ type: "company", slug: "netflix", title: "Netflix" })).toBe(
      true,
    );
  });

  it("finds paths that contain a pattern or case study", () => {
    const cachingPaths = getPathsContainingContent("pattern", "caching");
    expect(cachingPaths.map((p) => p.slug)).toContain(
      "beginner-systems-foundations",
    );

    const netflixPaths = getPathsContainingContent(
      "case-study",
      "netflix-video-streaming",
    );
    expect(netflixPaths.map((p) => p.slug)).toEqual(
      expect.arrayContaining([
        "beginner-systems-foundations",
        "video-streaming-journey",
      ]),
    );
  });

  it("returns prev/next neighbors along a path", () => {
    const neighbors = getPathStepNeighbors(
      "beginner-systems-foundations",
      "pattern",
      "caching",
    );
    expect(neighbors?.prev?.slug).toBe("load-balancing");
    expect(neighbors?.next?.slug).toBe("netflix-video-streaming");
    expect(neighbors?.stepIndex).toBe(1);
    expect(neighbors?.stepCount).toBe(3);
  });

  it("treats company steps as matching their primary case study page", () => {
    const guides = getPathGuidesForContent(
      "case-study",
      "netflix-video-streaming",
    );
    const video = guides.find((g) => g.path.slug === "video-streaming-journey");
    expect(video).toBeTruthy();
    // First matching step is the case-study ref (index 0), so next is CDN.
    expect(video?.next?.slug).toBe("cdn");
  });

  it("validates published learning path content refs", () => {
    expect(validateLearningPaths()).toEqual([]);
  });

  it("surfaces pathway context for a compared company", () => {
    const paths = getLearningPathsForCompany("netflix");
    expect(paths.map((p) => p.slug)).toEqual(
      expect.arrayContaining([
        "beginner-systems-foundations",
        "video-streaming-journey",
      ]),
    );
  });
});
