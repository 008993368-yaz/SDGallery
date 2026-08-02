export type CompanySort = "alpha" | "popular" | "updated";

export type CompanyFilters = {
  industry?: string;
  scale?: string;
  techStack?: string;
};

export const DIRECTORY_PAGE_SIZE = 6;

export function sortCompanies<
  T extends { name: string; popularity: number; updatedAt: string },
>(items: T[], sort: CompanySort): T[] {
  const copy = [...items];
  if (sort === "alpha") return copy.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === "popular") return copy.sort((a, b) => b.popularity - a.popularity);
  return copy.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function filterCompanies<
  T extends { industry: string; scale: string; techStack: string[] },
>(items: T[], filters: CompanyFilters): T[] {
  return items.filter((item) => {
    if (filters.industry && item.industry !== filters.industry) return false;
    if (filters.scale && item.scale !== filters.scale) return false;
    if (filters.techStack && !item.techStack.includes(filters.techStack)) {
      return false;
    }
    return true;
  });
}

export function paginateItems<T>(
  items: T[],
  page: number,
  pageSize: number = DIRECTORY_PAGE_SIZE,
): T[] {
  const start = Math.max(0, page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

export function uniqueSorted(values: string[]): string[] {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}
