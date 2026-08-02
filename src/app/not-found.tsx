import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-start gap-4 px-4 py-24">
      <p className="text-sm font-medium uppercase tracking-wide text-teal-700">404</p>
      <h1 className="font-display text-3xl text-slate-900">Page not found</h1>
      <p className="text-slate-600">
        That company, pattern, or case study is not in the gallery yet. Try browsing
        the directory instead.
      </p>
      <div className="flex flex-wrap gap-3 pt-2">
        <Link
          href="/companies"
          className="rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
        >
          Explore Companies
        </Link>
        <Link
          href="/patterns"
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Browse Patterns
        </Link>
      </div>
    </div>
  );
}
