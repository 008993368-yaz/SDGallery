"use client";

import { useMemo, useState } from "react";
import {
  CompanyCard,
  type CompanyCardData,
} from "@/components/cards/CompanyCard";
import { FilterSidebar } from "@/components/directory/FilterSidebar";
import { Pagination } from "@/components/directory/Pagination";
import { SortSelect } from "@/components/directory/SortSelect";
import {
  DIRECTORY_PAGE_SIZE,
  filterCompanies,
  paginateItems,
  sortCompanies,
  uniqueSorted,
  type CompanyFilters,
  type CompanySort,
} from "@/lib/directory";

export type DirectoryCompany = CompanyCardData & {
  scale: string;
  techStack: string[];
  popularity: number;
  updatedAt: string;
};

type CompanyDirectoryProps = {
  companies: DirectoryCompany[];
};

export function CompanyDirectory({ companies }: CompanyDirectoryProps) {
  const [filters, setFilters] = useState<CompanyFilters>({});
  const [sort, setSort] = useState<CompanySort>("popular");
  const [page, setPage] = useState(1);

  const filterOptions = useMemo(
    () => ({
      industries: uniqueSorted(companies.map((c) => c.industry)),
      scales: uniqueSorted(companies.map((c) => c.scale)),
      techStacks: uniqueSorted(companies.flatMap((c) => c.techStack)),
    }),
    [companies],
  );

  const filtered = useMemo(
    () => filterCompanies(companies, filters),
    [companies, filters],
  );

  const sorted = useMemo(
    () => sortCompanies(filtered, sort),
    [filtered, sort],
  );

  const totalPages = Math.max(1, Math.ceil(sorted.length / DIRECTORY_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = paginateItems(sorted, currentPage);

  function handleFiltersChange(next: CompanyFilters) {
    setFilters(next);
    setPage(1);
  }

  function handleSortChange(next: CompanySort) {
    setSort(next);
    setPage(1);
  }

  return (
    <div className="mt-10 grid gap-8 rounded-3xl border border-white/70 bg-white/55 p-4 shadow-sm ring-1 ring-slate-900/5 backdrop-blur lg:grid-cols-[16rem_minmax(0,1fr)] lg:p-6">
      <FilterSidebar
        options={filterOptions}
        filters={filters}
        onChange={handleFiltersChange}
      />

      <div className="min-w-0 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-600">
            {sorted.length} {sorted.length === 1 ? "company" : "companies"}
          </p>
          <SortSelect value={sort} onChange={handleSortChange} />
        </div>

        {pageItems.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 bg-white/60 px-5 py-10 text-center text-sm text-slate-600">
            No companies match these filters. Try clearing one or more filters.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {pageItems.map((company) => (
              <CompanyCard key={company.slug} company={company} />
            ))}
          </div>
        )}

        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onChange={setPage}
        />
      </div>
    </div>
  );
}
