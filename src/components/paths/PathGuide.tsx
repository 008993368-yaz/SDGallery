import Link from "next/link";
import type { PathStepNeighbor } from "@/lib/paths";

type PathGuideProps = {
  guides: PathStepNeighbor[];
};

export function PathGuide({ guides }: PathGuideProps) {
  if (guides.length === 0) return null;

  return (
    <section className="mt-6 space-y-3">
      <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
        Learning paths
      </p>
      {guides.map((guide) => (
        <div
          key={guide.path.slug}
          className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm ring-1 ring-slate-900/5"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Link
              href={`/paths/${guide.path.slug}`}
              className="text-sm font-medium text-slate-900 underline decoration-slate-300 underline-offset-2 hover:decoration-teal-700"
            >
              {guide.path.title}
            </Link>
            <span className="text-xs font-medium text-slate-500">
              Step {guide.stepIndex + 1} of {guide.stepCount}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm">
            {guide.prev ? (
              <Link
                href={guide.prev.href}
                className="text-teal-800 hover:text-teal-950"
              >
                ← {guide.prev.title}
              </Link>
            ) : (
              <span className="text-slate-400">Start of path</span>
            )}
            {guide.next ? (
              <Link
                href={guide.next.href}
                className="ml-auto text-teal-800 hover:text-teal-950"
              >
                {guide.next.title} →
              </Link>
            ) : (
              <span className="ml-auto text-slate-400">End of path</span>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
