import Link from "next/link";
import type { Pattern } from "@/lib/types";

type PatternPillProps = {
  pattern: Pattern;
};

export function PatternPill({ pattern }: PatternPillProps) {
  return (
    <Link
      href={`/patterns/${pattern.slug}`}
      className="inline-flex items-center rounded-full border border-white/70 bg-white/85 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-900/5 transition hover:-translate-y-0.5 hover:border-teal-500/30 hover:bg-teal-50 hover:text-teal-800"
    >
      {pattern.name}
    </Link>
  );
}
