import type { ReactNode } from "react";
import Link from "next/link";
import { ResultCard } from "@/components/cards/ResultCard";
import type { SearchHit, SearchHitType } from "@/lib/types";

const TYPE_OPTIONS: { value: SearchHitType; label: string }[] = [
  { value: "company", label: "Company" },
  { value: "pattern", label: "Pattern" },
  { value: "case-study", label: "Case study" },
];

type SearchResultsProps = {
  hits: SearchHit[];
  q: string;
  type?: string;
  industry?: string;
  industries: string[];
};

function searchHref(opts: {
  q?: string;
  type?: string;
  industry?: string;
}): string {
  const params = new URLSearchParams();
  if (opts.q?.trim()) params.set("q", opts.q.trim());
  if (opts.type) params.set("type", opts.type);
  if (opts.industry) params.set("industry", opts.industry);
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
  industries,
}: SearchResultsProps) {
  const emptyLabel = q.trim()
    ? `No results for “${q.trim()}”`
    : "No results for the selected filters";

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[14rem_1fr]">
      <aside className="space-y-6 rounded-xl border border-slate-200/80 bg-white/80 p-5 h-fit">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-lg tracking-tight text-slate-900">
            Filters
          </h2>
          {(type || industry) && (
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
          <FilterLink href={searchHref({ q, industry })} active={!type}>
            All
          </FilterLink>
          {TYPE_OPTIONS.map((option) => (
            <FilterLink
              key={option.value}
              href={searchHref({ q, type: option.value, industry })}
              active={type === option.value}
            >
              {option.label}
            </FilterLink>
          ))}
        </fieldset>

        <fieldset className="space-y-1">
          <legend className="mb-2 text-sm font-semibold text-slate-800">
            Industry
          </legend>
          <FilterLink href={searchHref({ q, type })} active={!industry}>
            All
          </FilterLink>
          {industries.map((name) => (
            <FilterLink
              key={name}
              href={searchHref({ q, type, industry: name })}
              active={industry === name}
            >
              {name}
            </FilterLink>
          ))}
        </fieldset>
      </aside>

      <section>
        <p className="mb-4 text-sm text-slate-600">
          {hits.length} {hits.length === 1 ? "result" : "results"}
          {q.trim() ? (
            <>
              {" "}
              for <span className="font-medium text-slate-800">“{q.trim()}”</span>
            </>
          ) : null}
        </p>

        {hits.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white/60 px-6 py-12 text-center">
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
