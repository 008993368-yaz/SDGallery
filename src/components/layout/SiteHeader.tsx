import Link from "next/link";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200/80 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4">
        <Link href="/" className="font-display text-xl tracking-tight text-slate-900">
          {SITE_NAME}
        </Link>
        <nav className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-teal-700">
              {link.label}
            </Link>
          ))}
          <Link
            href="/search"
            className="rounded-md bg-teal-700 px-3 py-1.5 text-white hover:bg-teal-800"
          >
            Search
          </Link>
        </nav>
      </div>
    </header>
  );
}
