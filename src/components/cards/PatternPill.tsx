import Link from "next/link";
import type { Pattern } from "@/lib/types";

type PatternPillProps = {
  pattern: Pattern;
};

export function PatternPill({ pattern }: PatternPillProps) {
  return (
    <Link
      href={`/patterns/${pattern.slug}`}
      className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-teal-600 hover:bg-teal-50 hover:text-teal-800"
    >
      {pattern.name}
    </Link>
  );
}
