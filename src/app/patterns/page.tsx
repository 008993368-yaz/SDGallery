import type { Metadata } from "next";
import { PatternCard } from "@/components/cards/PatternCard";
import { getPatterns } from "@/lib/content";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Patterns · ${SITE_NAME}`,
  description:
    "Browse core system design patterns—caching, CDNs, load balancing, and more.",
};

export default function PatternsPage() {
  const patterns = getPatterns();

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

      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {patterns.map((pattern) => (
          <PatternCard key={pattern.slug} pattern={pattern} />
        ))}
      </section>
    </div>
  );
}
