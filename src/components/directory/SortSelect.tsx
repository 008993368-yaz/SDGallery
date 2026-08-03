"use client";

import type { CompanySort } from "@/lib/directory";

const SORT_OPTIONS: { value: CompanySort; label: string }[] = [
  { value: "alpha", label: "Alphabetical" },
  { value: "popular", label: "Most Popular" },
  { value: "updated", label: "Recently Updated" },
];

type SortSelectProps = {
  value: CompanySort;
  onChange: (value: CompanySort) => void;
};

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-600">
      <span className="whitespace-nowrap">Sort by</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as CompanySort)}
        className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-slate-800 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
