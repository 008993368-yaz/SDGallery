import type { CaseStudyStats } from "@/lib/types";

type StatBarProps = {
  stats: CaseStudyStats;
};

const STAT_ITEMS: { key: keyof CaseStudyStats; label: string }[] = [
  { key: "users", label: "Users" },
  { key: "rps", label: "Requests/sec" },
  { key: "dataVolume", label: "Data volume" },
  { key: "regions", label: "Regions" },
];

export function StatBar({ stats }: StatBarProps) {
  return (
    <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {STAT_ITEMS.map(({ key, label }) => (
        <div
          key={key}
          className="rounded-lg border border-slate-200/80 bg-white/80 px-4 py-3"
        >
          <dt className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
            {label}
          </dt>
          <dd className="mt-1 font-display text-xl tracking-tight text-slate-900">
            {stats[key]}
          </dd>
        </div>
      ))}
    </dl>
  );
}
