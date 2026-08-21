import Link from "next/link";
import { CaseStudyCard } from "@/components/cards/CaseStudyCard";
import { PatternPill } from "@/components/cards/PatternPill";
import { PathCard } from "@/components/paths/PathCard";
import { SearchBox } from "@/components/search/SearchBox";
import {
  getCaseStudies,
  getCompanies,
  getFeaturedCaseStudies,
  getPatterns,
  getRecentCaseStudies,
  getV2LearningPath,
  getV2LearningPaths,
} from "@/lib/content";

const BEGINNER_PATH_SLUG = "beginner-systems-foundations";

export default function Home() {
  const allCaseStudies = getCaseStudies();
  const companies = getCompanies();
  const featured = getFeaturedCaseStudies();
  const patterns = getPatterns();
  const recent = getRecentCaseStudies(6);
  const learningPaths = getV2LearningPaths();
  const beginnerPath =
    getV2LearningPath(BEGINNER_PATH_SLUG) ?? learningPaths[0];
  const stats = [
    { label: "Case studies", value: allCaseStudies.length },
    { label: "Patterns", value: patterns.length },
    { label: "Companies", value: companies.length },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14 lg:py-16">
      <section className="relative grid gap-6 overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)] ring-1 ring-slate-900/5 backdrop-blur lg:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.8fr)] lg:p-8">
        <div
          aria-hidden
          className="absolute inset-y-0 right-0 w-1/3 bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,0.16),_transparent_55%),radial-gradient(circle_at_bottom_right,_rgba(20,184,166,0.12),_transparent_48%)]"
        />
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200/70 bg-teal-50/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-teal-800">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
            Public engineering atlas
          </div>
          <h1 className="mt-3 font-display text-4xl tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Learn how the world&apos;s best engineering teams build at scale
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
            Start with a guided path through core patterns and real company case
            studies - plain language for beginners, grounded in public engineering
            writeups.
          </p>
          <div className="mt-8 max-w-2xl">
            <SearchBox size="large" />
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {beginnerPath ? (
              <Link
                href={`/paths/${beginnerPath.slug}`}
                className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Start here
              </Link>
            ) : null}
            <Link
              href="/companies"
              className="rounded-full border border-white/70 bg-white/80 px-5 py-3 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-900/5 transition hover:-translate-y-0.5 hover:border-teal-500/30 hover:text-teal-800"
            >
              Explore companies
            </Link>
            <Link
              href="/patterns"
              className="rounded-full border border-white/70 bg-white/80 px-5 py-3 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-900/5 transition hover:-translate-y-0.5 hover:border-teal-500/30 hover:text-teal-800"
            >
              Browse patterns
            </Link>
          </div>
        </div>

        <aside className="relative overflow-hidden rounded-[1.5rem] border border-slate-200/70 bg-slate-950 p-6 text-white shadow-lg shadow-slate-900/10">
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
          />
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-cyan-200">
            Why it feels different
          </p>
          <ul className="mt-5 space-y-4 text-sm leading-relaxed text-slate-300">
            <li>Guided paths take you from foundations to flagship case studies.</li>
            <li>Pattern pills give you a quick path into the building blocks.</li>
            <li>Compare mode lets you line up two companies side by side.</li>
          </ul>
          <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur"
              >
                <p className="text-2xl font-semibold text-white">{stat.value}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </aside>
      </section>

      {learningPaths.length > 0 ? (
        <section className="mt-14">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-teal-700">
                Start here
              </p>
              <h2 className="mt-2 font-display text-2xl tracking-tight text-slate-900">
                Pathway highlights
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-slate-600">
                Follow a curated sequence instead of browsing from scratch.
              </p>
            </div>
            <Link
              href="/paths"
              className="text-sm font-medium text-teal-800 hover:text-teal-950"
            >
              All paths →
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {learningPaths.map((path) => (
              <PathCard key={path.slug} path={path} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-14 rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-sm ring-1 ring-slate-900/5 backdrop-blur">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-teal-700">
              Featured
            </p>
            <h2 className="mt-2 font-display text-2xl tracking-tight text-slate-900">
              Featured Case Studies
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Flagship walkthroughs from the sample corpus.
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {featured.map((study) => (
            <CaseStudyCard key={study.slug} study={study} />
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-sm ring-1 ring-slate-900/5 backdrop-blur">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-teal-700">
          Browse by pattern
        </p>
        <h2 className="mt-2 font-display text-2xl tracking-tight text-slate-900">
          Building blocks used across these systems
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Jump into a core pattern and see where it appears in the case studies.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {patterns.map((pattern) => (
            <PatternPill key={pattern.slug} pattern={pattern} />
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-sm ring-1 ring-slate-900/5 backdrop-blur">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-teal-700">
          Recently added
        </p>
        <h2 className="mt-2 font-display text-2xl tracking-tight text-slate-900">
          Newest studies by publish date
        </h2>
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
