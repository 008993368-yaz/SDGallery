import { CaseStudyCard } from "@/components/cards/CaseStudyCard";
import { PatternPill } from "@/components/cards/PatternPill";
import { SearchBox } from "@/components/search/SearchBox";
import {
  getFeaturedCaseStudies,
  getPatterns,
  getRecentCaseStudies,
} from "@/lib/content";

export default function Home() {
  const featured = getFeaturedCaseStudies();
  const patterns = getPatterns();
  const recent = getRecentCaseStudies(6);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <section className="max-w-3xl">
        <h1 className="font-display text-4xl tracking-tight text-slate-900 sm:text-5xl">
          Learn how the world&apos;s best engineering teams build at scale
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">
          Start with real company case studies and core patterns—plain language
          for beginners, grounded in public engineering writeups.
        </p>
        <SearchBox size="large" className="mt-8 max-w-2xl" />
      </section>

      <section className="mt-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl tracking-tight text-slate-900">
              Featured Case Studies
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Flagship walkthroughs from the sample corpus.
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((study) => (
            <CaseStudyCard key={study.slug} study={study} />
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-2xl tracking-tight text-slate-900">
          Browse by Pattern
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Jump into a building block used across these systems.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {patterns.map((pattern) => (
            <PatternPill key={pattern.slug} pattern={pattern} />
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-2xl tracking-tight text-slate-900">
          Recently Added
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Newest studies by publish date.
        </p>
        <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
          {recent.map((study) => (
            <CaseStudyCard
              key={study.slug}
              study={study}
              className="w-72 shrink-0"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
