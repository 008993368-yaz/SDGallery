import { describe, expect, it } from "vitest";
import { filterSearchIndex } from "@/lib/search";
import type { SearchHit } from "@/lib/types";

const index: SearchHit[] = [
  {
    type: "pattern",
    slug: "caching",
    title: "Caching",
    snippet: "Store hot data closer to users",
    href: "/patterns/caching",
  },
  {
    type: "company",
    slug: "netflix",
    title: "Netflix",
    industry: "Media",
    snippet: "Streaming at global scale",
    href: "/companies",
  },
  {
    type: "case-study",
    slug: "netflix-video-streaming",
    title: "How Netflix Streams to 200M+ Users",
    industry: "Media",
    snippet: "CDN and caching for video delivery",
    href: "/case-studies/netflix-video-streaming",
  },
];

describe("filterSearchIndex", () => {
  it("matches query in title and snippet case-insensitively", () => {
    const hits = filterSearchIndex(index, { q: "caching" });
    expect(hits.map((h) => h.slug)).toEqual(["caching", "netflix-video-streaming"]);
  });

  it("filters by type and industry", () => {
    const hits = filterSearchIndex(index, {
      q: "",
      types: ["company"],
      industry: "Media",
    });
    expect(hits).toHaveLength(1);
    expect(hits[0].slug).toBe("netflix");
  });

  it("returns empty array when nothing matches", () => {
    expect(filterSearchIndex(index, { q: "zzzz" })).toEqual([]);
  });
});
