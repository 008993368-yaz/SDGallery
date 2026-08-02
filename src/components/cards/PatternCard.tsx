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
      className="group flex flex-col gap-3 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-600/40 hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <PatternIcon icon={pattern.icon} />
        <h2 className="font-display text-lg tracking-tight text-slate-900 group-hover:text-teal-800">
          {pattern.name}
        </h2>
      </div>
      <p className="text-sm leading-relaxed text-slate-600">
        {pattern.definition}
      </p>
    </Link>
  );
}
