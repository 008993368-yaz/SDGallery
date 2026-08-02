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
    <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <section className="max-w-2xl">
        <h1 className="font-display text-4xl tracking-tight text-slate-900">
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
