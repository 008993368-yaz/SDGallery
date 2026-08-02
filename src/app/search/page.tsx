import type { Metadata } from "next";
import { SearchBox } from "@/components/search/SearchBox";
import { SearchResults } from "@/components/search/SearchResults";
import { getSearchIndex } from "@/lib/content";
import { SITE_NAME } from "@/lib/constants";
import { filterSearchIndex } from "@/lib/search";
import type { SearchHitType } from "@/lib/types";

export const metadata: Metadata = {
  title: `Search · ${SITE_NAME}`,
  description: "Search companies, patterns, and case studies across SDGallery.",
};

const VALID_TYPES = new Set<SearchHitType>([
  "company",
  "pattern",
  "case-study",
]);

function parseType(value?: string): SearchHitType | undefined {
  if (!value || !VALID_TYPES.has(value as SearchHitType)) return undefined;
  return value as SearchHitType;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; industry?: string }>;
}) {
  const params = await searchParams;
  const q = params.q ?? "";
  const type = parseType(params.type);
  const industry = params.industry?.trim() || undefined;

  const index = getSearchIndex();
  const hits = filterSearchIndex(index, {
    q,
    types: type ? [type] : undefined,
    industry,
  });

  const industries = [
    ...new Set(
      index
        .map((hit) => hit.industry)
        .filter((value): value is string => Boolean(value)),
    ),
  ].sort((a, b) => a.localeCompare(b));

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <section className="max-w-2xl">
        <h1 className="font-display text-4xl tracking-tight text-slate-900">
          Search
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-slate-600">
          Find companies, patterns, and case studies across the gallery.
        </p>
        <SearchBox className="mt-6" defaultValue={q} />
      </section>

      <SearchResults
        hits={hits}
        q={q}
        type={type}
        industry={industry}
        industries={industries}
      />
    </div>
  );
}
