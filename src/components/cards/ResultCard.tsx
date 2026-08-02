import Link from "next/link";
import { highlightSnippet } from "@/lib/search";
import type { SearchHit, SearchHitType } from "@/lib/types";

const CATEGORY_LABEL: Record<SearchHitType, string> = {
  company: "Company",
  pattern: "Pattern",
  "case-study": "Case study",
};

type ResultCardProps = {
  hit: SearchHit;
  q: string;
};

export function ResultCard({ hit, q }: ResultCardProps) {
  const highlighted = highlightSnippet(hit.snippet, q);

  return (
    <Link
      href={hit.href}
      className="group flex flex-col gap-2 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-600/40 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-display text-lg tracking-tight text-slate-900 group-hover:text-teal-800">
          {hit.title}
        </h2>
        <span className="shrink-0 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium tracking-wide text-slate-600 uppercase">
          {CATEGORY_LABEL[hit.type]}
        </span>
      </div>
      <p
        className="text-sm leading-relaxed text-slate-600 [&_mark]:rounded-sm [&_mark]:bg-teal-100 [&_mark]:px-0.5 [&_mark]:text-teal-900"
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
      {hit.industry ? (
        <p className="text-xs font-medium text-slate-500">{hit.industry}</p>
      ) : null}
    </Link>
  );
}
