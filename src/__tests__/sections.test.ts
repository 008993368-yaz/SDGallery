import { describe, expect, it } from "vitest";
import { extractSections } from "@/lib/sections";

describe("extractSections", () => {
  it("extracts h2 and nested h3 under Deep Dives", () => {
    const md = `## Problem & Requirements
Need X.

## Deep Dives
### Caching
Redis.

### CDN
Edge.
`;
    const sections = extractSections(md);
    expect(sections.map((s) => s.title)).toEqual([
      "Problem & Requirements",
      "Deep Dives",
      "Caching",
      "CDN",
    ]);
    const deep = sections.find((s) => s.title === "Deep Dives");
    expect(deep?.children?.map((c) => c.title)).toEqual(["Caching", "CDN"]);
  });

  it("slugifies ids stably", () => {
    const [section] = extractSections("## High-Level Design\nHi");
    expect(section.id).toBe("high-level-design");
  });
});
