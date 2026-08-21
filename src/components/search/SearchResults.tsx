import type { ReactNode } from "react";
import Link from "next/link";
import { ResultCard } from "@/components/cards/ResultCard";
import type { Difficulty, SearchHit, SearchHitType } from "@/lib/types";

const TYPE_OPTIONS: { value: SearchHitType; label: string }[] = [
  { value: "company", label: "Company" },
  { value: "pattern", label: "Pattern" },
  { value: "case-study", label: "Case study" },
];

const DIFFICULTY_OPTIONS: { value: Difficulty; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

type SearchResultsProps = {
  hits: SearchHit[];
  q: string;
  type?: string;
  industry?: string;
  difficulty?: Difficulty;
  industries: string[];
};

function searchHref(opts: {
  q?: string;
  type?: string;
  industry?: string;
  difficulty?: string;
}): string {
  const params = new URLSearchParams();
  if (opts.q?.trim()) params.set("q", opts.q.trim());
  if (opts.type) params.set("type", opts.type);
  if (opts.industry) params.set("industry", opts.industry);
  if (opts.difficulty) params.set("difficulty", opts.difficulty);
  const qs = params.toString();
  return qs ? `/search?${qs}` : "/search";
}

function FilterLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`block rounded-md px-2 py-1 text-sm transition ${
        active
          ? "bg-teal-50 font-medium text-teal-800"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      {children}
    </Link>
  );
}

export function SearchResults({
  hits,
  q,
  type,
  industry,
  difficulty,
  industries,
}: SearchResultsProps) {
  const emptyLabel = q.trim()
    ? `No results for “${q.trim()}”`
    : "No results for the selected filters";

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[14rem_1fr]">
      <aside className="h-fit space-y-6 rounded-3xl border border-white/70 bg-white/80 p-5 shadow-sm ring-1 ring-slate-900/5 backdrop-blur">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-lg tracking-tight text-slate-900">
            Filters
          </h2>
          {(type || industry || difficulty) && (
            <Link
              href={searchHref({ q })}
              className="text-xs font-medium text-teal-700 hover:text-teal-900"
            >
              Clear
            </Link>
          )}
        </div>

        <fieldset className="space-y-1">
          <legend className="mb-2 text-sm font-semibold text-slate-800">
            Type
          </legend>
          <FilterLink
            href={searchHref({ q, industry, difficulty })}
            active={!type}
          >
            All
          </FilterLink>
          {TYPE_OPTIONS.map((option) => (
            <FilterLink
              key={option.value}
              href={searchHref({
                q,
                type: option.value,
                industry,
                difficulty,
              })}
              active={type === option.value}
            >
              {option.label}
            </FilterLink>
          ))}
        </fieldset>

        <fieldset className="space-y-1">
          <legend className="mb-2 text-sm font-semibold text-slate-800">
            Difficulty
          </legend>
          <FilterLink
            href={searchHref({ q, type, industry })}
            active={!difficulty}
          >
            All
          </FilterLink>
          {DIFFICULTY_OPTIONS.map((option) => (
            <FilterLink
              key={option.value}
              href={searchHref({
                q,
                type,
                industry,
                difficulty: option.value,
              })}
              active={difficulty === option.value}
            >
              {option.label}
            </FilterLink>
          ))}
        </fieldset>

        <fieldset className="space-y-1">
          <legend className="mb-2 text-sm font-semibold text-slate-800">
            Industry
          </legend>
          <FilterLink
            href={searchHref({ q, type, difficulty })}
            active={!industry}
          >
            All
          </FilterLink>
          {industries.map((name) => (
            <FilterLink
              key={name}
              href={searchHref({ q, type, industry: name, difficulty })}
              active={industry === name}
            >
              {name}
            </FilterLink>
          ))}
        </fieldset>
      </aside>

      <section>
        <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-slate-600">
          <span className="rounded-full bg-white/80 px-3 py-1 font-medium text-slate-700 ring-1 ring-slate-900/5">
            {hits.length} {hits.length === 1 ? "result" : "results"}
          </span>
          {q.trim() ? (
            <span>
              for <span className="font-medium text-slate-800">“{q.trim()}”</span>
            </span>
          ) : null}
        </div>

        {hits.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white/60 px-6 py-12 text-center backdrop-blur">
            <p className="font-display text-xl tracking-tight text-slate-900">
              {emptyLabel}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Try a different query or clear filters to browse everything.
            </p>
            <Link
              href="/search"
              className="mt-5 inline-flex rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-800"
            >
              Clear filters
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {hits.map((hit) => (
              <li key={`${hit.type}:${hit.slug}`}>
                <ResultCard hit={hit} q={q} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
