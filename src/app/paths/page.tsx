import type { Metadata } from "next";
import { PathCard } from "@/components/paths/PathCard";
import { getV2LearningPaths } from "@/lib/content";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Learning paths · ${SITE_NAME}`,
  description:
    "Guided pathways through system design patterns and company case studies.",
};

export default function PathsIndexPage() {
  const paths = getV2LearningPaths();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14 lg:py-16">
      <section className="max-w-2xl rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-sm ring-1 ring-slate-900/5 backdrop-blur sm:p-8">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-teal-700">
          Guided learning
        </p>
        <h1 className="mt-3 font-display text-4xl tracking-tight text-slate-900">
          Learning paths
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-slate-600">
          Follow a curated sequence of patterns and case studies. Start with
          foundations, then branch into streaming and edge delivery.
        </p>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        {paths.map((path) => (
          <PathCard key={path.slug} path={path} />
        ))}
      </section>
    </div>
  );
}
