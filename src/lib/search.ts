import type { Difficulty, SearchHit, SearchHitType } from "./types";

export function filterSearchIndex(
  index: SearchHit[],
  opts: {
    q: string;
    types?: SearchHitType[];
    industry?: string;
    difficulty?: Difficulty;
  },
): SearchHit[] {
  const q = opts.q.trim().toLowerCase();
  return index.filter((hit) => {
    if (opts.types?.length && !opts.types.includes(hit.type)) return false;
    if (opts.industry && hit.industry !== opts.industry) return false;
    if (opts.difficulty && hit.difficulty !== opts.difficulty) return false;
    if (!q) return true;
    const objectives = (hit.learningObjectives ?? []).join(" ");
    const hay = `${hit.title} ${hit.snippet} ${objectives}`.toLowerCase();
    return hay.includes(q);
  });
}

export function highlightSnippet(snippet: string, q: string): string {
  const query = q.trim();
  if (!query) return snippet;
  const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig");
  return snippet.replace(re, "<mark>$1</mark>");
}
