import Link from "next/link";
import { PatternIcon } from "@/components/patterns/PatternIcon";
import type { Pattern } from "@/lib/types";

type PatternCardProps = {
  pattern: Pattern;
};

export function PatternCard({ pattern }: PatternCardProps) {
  return (
    <Link
      href={`/patterns/${pattern.slug}`}
      className="group flex flex-col gap-3 rounded-3xl border border-white/70 bg-white/85 p-5 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.45)] ring-1 ring-slate-900/5 transition-all hover:-translate-y-1 hover:border-teal-500/30 hover:shadow-lg"
    >
      <div className="flex items-center gap-3">
        <PatternIcon icon={pattern.icon} />
        <h2 className="font-display text-lg tracking-tight text-slate-900 transition group-hover:text-teal-800">
          {pattern.name}
        </h2>
      </div>
      <p className="text-sm leading-relaxed text-slate-600">
        {pattern.definition}
      </p>
    </Link>
  );
}
