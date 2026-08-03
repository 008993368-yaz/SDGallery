"use client";

import type { CompanyFilters } from "@/lib/directory";

export type FilterOptions = {
  industries: string[];
  scales: string[];
  techStacks: string[];
};

type FilterSidebarProps = {
  options: FilterOptions;
  filters: CompanyFilters;
  onChange: (next: CompanyFilters) => void;
};

function FilterGroup({
  label,
  value,
  options,
  onSelect,
}: {
  label: string;
  value?: string;
  options: string[];
  onSelect: (value: string | undefined) => void;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-semibold text-slate-800">{label}</legend>
      <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
        <input
          type="radio"
          name={label}
          checked={!value}
          onChange={() => onSelect(undefined)}
          className="accent-teal-700"
        />
        All
      </label>
      {options.map((option) => (
        <label
          key={option}
          className="flex cursor-pointer items-center gap-2 text-sm text-slate-600"
        >
          <input
            type="radio"
            name={label}
            checked={value === option}
            onChange={() => onSelect(option)}
            className="accent-teal-700"
          />
          <span className="truncate">{option}</span>
        </label>
      ))}
    </fieldset>
  );
}

export function FilterSidebar({
  options,
  filters,
  onChange,
}: FilterSidebarProps) {
  return (
    <aside className="space-y-6 rounded-3xl border border-white/70 bg-white/80 p-5 shadow-sm ring-1 ring-slate-900/5 backdrop-blur">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-display text-lg tracking-tight text-slate-900">
          Filters
        </h2>
        {(filters.industry || filters.scale || filters.techStack) && (
          <button
            type="button"
            onClick={() => onChange({})}
            className="text-xs font-medium text-teal-700 hover:text-teal-900"
          >
            Clear
          </button>
        )}
      </div>

      <FilterGroup
        label="Industry"
        value={filters.industry}
        options={options.industries}
        onSelect={(industry) => onChange({ ...filters, industry })}
      />
      <FilterGroup
        label="Scale"
        value={filters.scale}
        options={options.scales}
        onSelect={(scale) => onChange({ ...filters, scale })}
      />
      <FilterGroup
        label="Tech Stack"
        value={filters.techStack}
        options={options.techStacks}
        onSelect={(techStack) => onChange({ ...filters, techStack })}
      />
    </aside>
  );
}
