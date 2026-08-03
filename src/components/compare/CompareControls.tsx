"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export type CompareCompanyOption = {
  slug: string;
  name: string;
};

type CompareControlsProps = {
  companies: CompareCompanyOption[];
  initialA?: string;
  initialB?: string;
};

export function CompareControls({
  companies,
  initialA = "",
  initialB = "",
}: CompareControlsProps) {
  const router = useRouter();
  const [a, setA] = useState(initialA);
  const [b, setB] = useState(initialB);
  const canCompare = Boolean(a && b && a !== b);

  function onCompare() {
    if (!canCompare) return;
    const params = new URLSearchParams({ a, b });
    router.push(`/compare?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-white/70 bg-white/80 p-4 shadow-sm ring-1 ring-slate-900/5 sm:flex-row sm:flex-wrap sm:items-end">
      <label className="flex min-w-[10rem] flex-1 flex-col gap-1.5 text-sm text-slate-600">
        <span>Company A</span>
        <select
          value={a}
          onChange={(event) => setA(event.target.value)}
          className="rounded-2xl border border-white/70 bg-white px-3 py-2.5 text-slate-800 outline-none ring-1 ring-slate-900/5 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
        >
          <option value="">Select a company</option>
          {companies.map((company) => (
            <option key={company.slug} value={company.slug}>
              {company.name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex min-w-[10rem] flex-1 flex-col gap-1.5 text-sm text-slate-600">
        <span>Company B</span>
        <select
          value={b}
          onChange={(event) => setB(event.target.value)}
          className="rounded-2xl border border-white/70 bg-white px-3 py-2.5 text-slate-800 outline-none ring-1 ring-slate-900/5 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
        >
          <option value="">Select a company</option>
          {companies.map((company) => (
            <option key={company.slug} value={company.slug}>
              {company.name}
            </option>
          ))}
        </select>
      </label>

      <button
        type="button"
        onClick={onCompare}
        disabled={!canCompare}
        className="h-[46px] rounded-full bg-slate-900 px-5 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:hover:bg-slate-300"
      >
        Compare
      </button>
    </div>
  );
}
