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
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
      <label className="flex min-w-[10rem] flex-1 flex-col gap-1.5 text-sm text-slate-600">
        <span>Company A</span>
        <select
          value={a}
          onChange={(event) => setA(event.target.value)}
          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-800 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
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
          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-800 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
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
        className="h-[42px] rounded-lg bg-teal-700 px-5 text-sm font-medium text-white transition hover:bg-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:hover:bg-slate-300"
      >
        Compare
      </button>
    </div>
  );
}
