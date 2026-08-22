import type { Metadata } from "next";
import Link from "next/link";
import { PatternCard } from "@/components/cards/PatternCard";
import { getPatterns } from "@/lib/content";
import { SITE_NAME } from "@/lib/constants";
import type { Difficulty } from "@/lib/types";

export const metadata: Metadata = {
  title: `Patterns · ${SITE_NAME}`,
  description:
    "Browse core system design patterns—caching, CDNs, load balancing, and more.",
};

const DIFFICULTY_OPTIONS: { value: Difficulty; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const VALID_DIFFICULTIES = new Set<Difficulty>([
  "beginner",
  "intermediate",
  "advanced",
]);

function parseDifficulty(value?: string): Difficulty | undefined {
  if (!value || !VALID_DIFFICULTIES.has(value as Difficulty)) return undefined;
  return value as Difficulty;
}

function patternsHref(difficulty?: Difficulty): string {
  if (!difficulty) return "/patterns";
  return `/patterns?difficulty=${difficulty}`;
}

export default async function PatternsPage({
  searchParams,
}: {
  searchParams: Promise<{ difficulty?: string }>;
}) {
  const params = await searchParams;
  const difficulty = parseDifficulty(params.difficulty);
  const patterns = getPatterns().filter((pattern) =>
    difficulty ? pattern.difficulty === difficulty : true,
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14 lg:py-16">
      <section className="max-w-2xl rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-sm ring-1 ring-slate-900/5 backdrop-blur sm:p-8">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-teal-700">
          Core concepts
        </p>
        <h1 className="mt-3 font-display text-4xl tracking-tight text-slate-900">
          Patterns
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-slate-600">
          Building blocks that show up across large-scale systems. Start with a
          definition, then follow links into company case studies.
        </p>
      </section>

      <div className="mt-8 flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-slate-600">Difficulty:</span>
        <Link
          href={patternsHref()}
          className={`rounded-full px-3 py-1.5 text-sm transition ${
            !difficulty
              ? "bg-teal-50 font-medium text-teal-800 ring-1 ring-teal-200"
              : "bg-white/80 text-slate-600 ring-1 ring-slate-900/5 hover:text-teal-800"
          }`}
        >
          All
        </Link>
        {DIFFICULTY_OPTIONS.map((option) => (
          <Link
            key={option.value}
            href={patternsHref(option.value)}
            className={`rounded-full px-3 py-1.5 text-sm capitalize transition ${
              difficulty === option.value
                ? "bg-teal-50 font-medium text-teal-800 ring-1 ring-teal-200"
                : "bg-white/80 text-slate-600 ring-1 ring-slate-900/5 hover:text-teal-800"
            }`}
          >
            {option.label}
          </Link>
        ))}
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {patterns.map((pattern) => (
          <PatternCard key={pattern.slug} pattern={pattern} />
        ))}
      </section>

      {patterns.length === 0 ? (
        <p className="mt-8 text-sm text-slate-500">
          No patterns match this difficulty filter.
        </p>
      ) : null}
    </div>
  );
}
