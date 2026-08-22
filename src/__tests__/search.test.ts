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
    difficulty: "beginner",
    estimatedReadingMinutes: 2,
    learningObjectives: [
      "Explain cache hit ratio",
      "Identify when caching applies",
    ],
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
    difficulty: "beginner",
    estimatedReadingMinutes: 3,
    learningObjectives: ["Map edge delivery to CDN patterns"],
  },
  {
    type: "pattern",
    slug: "sharding",
    title: "Sharding",
    snippet: "Split data across nodes",
    href: "/patterns/sharding",
    difficulty: "advanced",
    estimatedReadingMinutes: 5,
    learningObjectives: ["Choose a shard key"],
  },
];

describe("filterSearchIndex", () => {
  it("matches query in title and snippet case-insensitively", () => {
    const hits = filterSearchIndex(index, { q: "caching" });
    expect(hits.map((h) => h.slug)).toEqual(["caching", "netflix-video-streaming"]);
  });

  it("matches learning objectives in the query haystack", () => {
    const hits = filterSearchIndex(index, { q: "shard key" });
    expect(hits.map((h) => h.slug)).toEqual(["sharding"]);
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

  it("filters by difficulty", () => {
    const hits = filterSearchIndex(index, {
      q: "",
      difficulty: "beginner",
    });
    expect(hits.map((h) => h.slug).sort()).toEqual([
      "caching",
      "netflix-video-streaming",
    ]);
  });

  it("returns empty array when nothing matches", () => {
    expect(filterSearchIndex(index, { q: "zzzz" })).toEqual([]);
  });
});
