"use client";

type PaginationProps = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
};

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Directory pagination"
      className="flex items-center justify-center gap-3"
    >
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="rounded-full border border-white/70 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm ring-1 ring-slate-900/5 transition enabled:hover:border-teal-500/30 enabled:hover:text-teal-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Previous
      </button>
      <span className="text-sm text-slate-600">
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        className="rounded-full border border-white/70 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm ring-1 ring-slate-900/5 transition enabled:hover:border-teal-500/30 enabled:hover:text-teal-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </nav>
  );
}
