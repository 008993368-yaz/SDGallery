import Link from "next/link";
import { GITHUB_REPO_URL, SITE_NAME } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="relative mt-auto border-t border-white/70 bg-white/60 backdrop-blur">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-500/40 to-transparent"
      />
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md">
          {SITE_NAME} - free, open system design education, built from public engineering writeups.
        </p>
        <Link href={GITHUB_REPO_URL} className="font-medium text-teal-700 hover:text-teal-900">
          View on GitHub
        </Link>
      </div>
    </footer>
  );
}
