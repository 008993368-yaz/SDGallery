import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getV2LearningPath,
  getV2LearningPaths,
} from "@/lib/content";
import { SITE_NAME } from "@/lib/constants";
import { getResolvedPathSteps } from "@/lib/paths";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getV2LearningPaths().map((path) => ({ slug: path.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const path = getV2LearningPath(slug);
  if (!path) return { title: `Learning path · ${SITE_NAME}` };
  return {
    title: `${path.title} · ${SITE_NAME}`,
    description: path.summary,
  };
}

export default async function PathDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const path = getV2LearningPath(slug);
  if (!path) notFound();

  const steps = getResolvedPathSteps(path);
  const prerequisitePaths = path.prerequisites
    .map((prereqSlug) => getV2LearningPath(prereqSlug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const followOnPaths = getV2LearningPaths().filter((candidate) =>
    candidate.prerequisites.includes(path.slug),
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14 lg:py-16">
      <header className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-teal-700">
          Learning path
        </p>
        <h1 className="mt-3 font-display text-4xl tracking-tight text-slate-900">
          {path.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">
          {path.summary}
        </p>
        <p className="mt-3 text-sm text-slate-500">
          <span className="capitalize">{path.difficulty}</span>
          <span aria-hidden="true"> · </span>
          {path.audience}
          <span aria-hidden="true"> · </span>
          {steps.length} {steps.length === 1 ? "step" : "steps"}
        </p>
      </header>

      {prerequisitePaths.length > 0 ? (
        <section className="mt-8 rounded-2xl border border-amber-200/80 bg-amber-50/70 p-4 text-sm text-amber-950">
          <p className="font-medium">Recommended first</p>
          <ul className="mt-2 space-y-1">
            {prerequisitePaths.map((prereq) => (
              <li key={prereq.slug}>
                <Link
                  href={`/paths/${prereq.slug}`}
                  className="underline decoration-amber-300 underline-offset-2 hover:decoration-amber-700"
                >
                  {prereq.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-10">
        <h2 className="font-display text-2xl tracking-tight text-slate-900">
          Steps
        </h2>
        <ol className="mt-6 space-y-3">
          {steps.map((step, index) => (
            <li key={`${step.type}-${step.slug}-${index}`}>
              <Link
                href={step.href}
                className="flex items-start gap-4 rounded-2xl border border-white/70 bg-white/85 p-4 shadow-sm ring-1 ring-slate-900/5 transition hover:-translate-y-0.5 hover:border-teal-500/30"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-900">
                  {index + 1}
                </span>
                <span className="min-w-0">
                  <span className="block font-medium text-slate-900">
                    {step.title}
                  </span>
                  <span className="mt-0.5 block text-xs font-medium tracking-[0.18em] text-slate-500 uppercase">
                    {step.type === "case-study"
                      ? "Case study"
                      : step.type === "company"
                        ? "Company"
                        : "Pattern"}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {followOnPaths.length > 0 ? (
        <section className="mt-12 border-t border-slate-200 pt-10">
          <h2 className="font-display text-2xl tracking-tight text-slate-900">
            Continue with
          </h2>
          <ul className="mt-4 space-y-2">
            {followOnPaths.map((nextPath) => (
              <li key={nextPath.slug}>
                <Link
                  href={`/paths/${nextPath.slug}`}
                  className="text-teal-800 underline decoration-teal-200 underline-offset-2 hover:decoration-teal-700"
                >
                  {nextPath.title}
                </Link>
                <span className="mt-1 block text-sm text-slate-600">
                  {nextPath.summary}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="mt-10">
        <Link
          href="/paths"
          className="text-sm font-medium text-slate-600 hover:text-teal-800"
        >
          ← All learning paths
        </Link>
      </p>
    </div>
  );
}
