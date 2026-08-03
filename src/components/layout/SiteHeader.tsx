import Link from "next/link";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 overflow-hidden border-b border-white/70 bg-white/80 backdrop-blur-xl">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-500 via-cyan-400 to-sky-500"
      />
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-3 sm:py-4">
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 via-cyan-500 to-sky-500 text-sm font-semibold text-white shadow-lg shadow-teal-600/20 ring-1 ring-white/60 transition group-hover:scale-105">
            <span className="flex h-6 w-6 items-center justify-center rounded-xl bg-white/15 text-[0.7rem] tracking-[0.14em]">
              SD
            </span>
          </span>
          <span className="flex flex-col">
            <span className="font-display text-xl tracking-tight text-slate-900">
              {SITE_NAME}
            </span>
            <span className="text-xs uppercase tracking-[0.24em] text-slate-500">
              System design atlas
            </span>
          </span>
        </Link>
        <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-1.5 transition hover:bg-slate-100 hover:text-slate-900"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/search"
            className="rounded-full bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-1.5 font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:from-teal-700 hover:to-cyan-600"
          >
            Search
          </Link>
        </nav>
      </div>
    </header>
  );
}

