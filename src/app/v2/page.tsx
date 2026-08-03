import Link from "next/link";
import {
  getV2LearningPaths,
  getV2ScopeDocument,
  getV2TaxonomyPillars,
} from "@/lib/content";

function getContentHref(type: string, slug: string) {
  switch (type) {
    case "company":
      return `/companies/${slug}`;
    case "pattern":
      return `/patterns/${slug}`;
    case "case-study":
      return `/case-studies/${slug}`;
    default:
      return "/";
  }
}

export default function ScopeAndTaxonomyPage() {
  const scope = getV2ScopeDocument();
  const pillars = getV2TaxonomyPillars();
  const learningPaths = getV2LearningPaths();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:py-14 lg:py-16">
      <section className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-sm ring-1 ring-slate-900/5 backdrop-blur">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-teal-700">
          SDGallery V2 Phase 1
        </p>
        <h1 className="mt-3 font-display text-3xl tracking-tight text-slate-900 sm:text-4xl">
          Scope + taxonomy
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600">
          {scope.productScope.objective}
        </p>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-sm ring-1 ring-slate-900/5 backdrop-blur">
          <h2 className="font-display text-2xl tracking-tight text-slate-900">
            Product scope
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            The V2 scope stays focused on product clarity, contributor workflows, and
            learning guidance. It avoids the broader platform features that would
            distract from the core content experience.
          </p>
          <div className="mt-6 space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              Success metrics
            </h3>
            <ul className="space-y-3">
              {scope.productScope.successMetrics.map((metric) => (
                <li key={metric.name} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                  <p className="font-medium text-slate-900">{metric.name}</p>
                  <p className="mt-1 text-sm text-slate-600">{metric.description}</p>
                  <p className="mt-2 text-sm font-medium text-teal-700">{metric.target}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-slate-950 p-8 text-white shadow-sm">
          <h2 className="font-display text-2xl tracking-tight">Non-goals</h2>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
            {scope.productScope.nonGoals.map((goal) => (
              <li key={goal} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                {goal}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-sm ring-1 ring-slate-900/5 backdrop-blur">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-teal-700">
              Taxonomy
            </p>
            <h2 className="mt-2 font-display text-2xl tracking-tight text-slate-900">
              Learning pillars
            </h2>
          </div>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {pillars.map((pillar) => (
            <article key={pillar.slug} className="rounded-[1.5rem] border border-slate-200 bg-slate-50/70 p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-slate-900">{pillar.title}</h3>
                <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-teal-800">
                  {pillar.order}
                </span>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600">{pillar.summary}</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                {pillar.topics.map((topic) => (
                  <li key={topic.slug} className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2">
                    <p className="font-medium text-slate-800">{topic.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{topic.description}</p>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-sm ring-1 ring-slate-900/5 backdrop-blur">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-teal-700">
          Guided paths
        </p>
        <h2 className="mt-2 font-display text-2xl tracking-tight text-slate-900">
          Suggested learning paths
        </h2>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {learningPaths.map((path) => (
            <article key={path.slug} className="rounded-[1.5rem] border border-slate-200 bg-white/90 p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-slate-900">{path.title}</h3>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-600">
                  {path.difficulty}
                </span>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600">{path.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {path.pillars.map((pillar) => (
                  <span
                    key={`${path.slug}-${pillar}`}
                    className="rounded-full bg-teal-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-teal-800"
                  >
                    {pillar}
                  </span>
                ))}
              </div>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                {path.contentRefs.map((ref) => (
                  <li key={`${path.slug}-${ref.slug}`} className="rounded-xl border border-slate-200 px-3 py-2">
                    <Link href={getContentHref(ref.type, ref.slug)} className="font-medium text-slate-800 hover:text-teal-700">
                      {ref.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
