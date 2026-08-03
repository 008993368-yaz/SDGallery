import { describe, expect, it } from "vitest";
import {
  filterCompanies,
  paginateItems,
  sortCompanies,
} from "@/lib/directory";

const companies = [
  {
    name: "Uber",
    popularity: 90,
    updatedAt: "2026-07-10",
    industry: "Mobility",
    scale: "millions of trips/day",
    techStack: ["Go", "Kafka"],
  },
  {
    name: "Netflix",
    popularity: 100,
    updatedAt: "2026-08-01",
    industry: "Media",
    scale: "200M+ users",
    techStack: ["Java", "AWS"],
  },
  {
    name: "Cloudflare",
    popularity: 88,
    updatedAt: "2026-07-20",
    industry: "Infrastructure",
    scale: "global edge network",
    techStack: ["Rust", "Go"],
  },
];

describe("sortCompanies", () => {
  it("sorts alphabetically", () => {
    expect(sortCompanies(companies, "alpha").map((c) => c.name)).toEqual([
      "Cloudflare",
      "Netflix",
      "Uber",
    ]);
  });

  it("sorts by popularity descending", () => {
    expect(sortCompanies(companies, "popular").map((c) => c.name)).toEqual([
      "Netflix",
      "Uber",
      "Cloudflare",
    ]);
  });

  it("sorts by updatedAt descending", () => {
    expect(sortCompanies(companies, "updated").map((c) => c.name)).toEqual([
      "Netflix",
      "Cloudflare",
      "Uber",
    ]);
  });
});

describe("filterCompanies", () => {
  it("filters by industry", () => {
    expect(
      filterCompanies(companies, { industry: "Media" }).map((c) => c.name),
    ).toEqual(["Netflix"]);
  });

  it("filters by tech stack membership", () => {
    expect(
      filterCompanies(companies, { techStack: "Go" }).map((c) => c.name),
    ).toEqual(["Uber", "Cloudflare"]);
  });

  it("combines filters", () => {
    expect(
      filterCompanies(companies, {
        industry: "Mobility",
        techStack: "Kafka",
      }).map((c) => c.name),
    ).toEqual(["Uber"]);
  });
});

describe("paginateItems", () => {
  it("returns the requested page slice", () => {
    const items = [1, 2, 3, 4, 5, 6, 7];
    expect(paginateItems(items, 1, 3)).toEqual([1, 2, 3]);
    expect(paginateItems(items, 2, 3)).toEqual([4, 5, 6]);
    expect(paginateItems(items, 3, 3)).toEqual([7]);
  });
});
