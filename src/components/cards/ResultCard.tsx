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
      className="group flex flex-col gap-2 rounded-3xl border border-white/70 bg-white/85 p-5 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.45)] ring-1 ring-slate-900/5 transition-all hover:-translate-y-1 hover:border-teal-500/30 hover:shadow-lg"
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-display text-lg tracking-tight text-slate-900 transition group-hover:text-teal-800">
          {hit.title}
        </h2>
        <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium tracking-[0.2em] text-slate-600 uppercase">
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
