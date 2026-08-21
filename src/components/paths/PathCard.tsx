import Link from "next/link";
import type { V2LearningPath } from "@/lib/types";

type PathCardProps = {
  path: V2LearningPath;
  stepCount?: number;
};

export function PathCard({ path, stepCount }: PathCardProps) {
  const count = stepCount ?? path.contentRefs.length;

  return (
    <Link
      href={`/paths/${path.slug}`}
      className="group flex flex-col gap-3 rounded-3xl border border-white/70 bg-white/85 p-5 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.45)] ring-1 ring-slate-900/5 transition-all hover:-translate-y-1 hover:border-teal-500/30 hover:shadow-lg"
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-display text-lg tracking-tight text-slate-900 transition group-hover:text-teal-800">
          {path.title}
        </h2>
        <span className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium tracking-[0.18em] text-slate-600 uppercase">
          {path.difficulty}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-slate-600">{path.summary}</p>
      <p className="text-xs font-medium text-slate-500">
        {path.audience}
        <span aria-hidden="true"> · </span>
        {count} {count === 1 ? "step" : "steps"}
      </p>
    </Link>
  );
}
