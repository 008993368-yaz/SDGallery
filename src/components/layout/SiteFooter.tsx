import Link from "next/link";
import { GITHUB_REPO_URL, SITE_NAME } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-slate-600 sm:flex-row sm:justify-between">
        <p>
          {SITE_NAME} — free, open system design education.
        </p>
        <Link href={GITHUB_REPO_URL} className="text-teal-700 hover:underline">
          View on GitHub
        </Link>
      </div>
    </footer>
  );
}
