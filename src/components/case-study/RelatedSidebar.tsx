import Link from "next/link";
import { PatternIcon } from "@/components/patterns/PatternIcon";
import type { Pattern } from "@/lib/types";

type RelatedLink = {
  href: string;
  label: string;
  description?: string;
};

type RelatedSidebarProps = {
  patterns?: Pattern[];
  companies?: RelatedLink[];
  title?: string;
};

export function RelatedSidebar({
  patterns = [],
  companies = [],
  title = "Related",
}: RelatedSidebarProps) {
  if (patterns.length === 0 && companies.length === 0) return null;

  return (
    <aside className="space-y-8">
      <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
        {title}
      </p>
      {patterns.length > 0 ? (
        <div>
          <h2 className="font-display text-lg tracking-tight text-slate-900">
            Related Patterns
          </h2>
          <ul className="mt-3 space-y-2">
            {patterns.map((pattern) => (
              <li key={pattern.slug}>
                <Link
                  href={`/patterns/${pattern.slug}`}
                  className="flex items-start gap-3 rounded-lg border border-transparent px-2 py-2 transition hover:border-slate-200 hover:bg-white"
                >
                  <PatternIcon
                    icon={pattern.icon}
                    className="h-8 w-8 [&_span]:h-4 [&_span]:w-4"
                  />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-slate-900">
                      {pattern.name}
                    </span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-slate-600">
                      {pattern.definition}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {companies.length > 0 ? (
        <div>
          <h2 className="font-display text-lg tracking-tight text-slate-900">
            Related Companies
          </h2>
          <ul className="mt-3 space-y-2">
            {companies.map((company) => (
              <li key={company.href}>
                <Link
                  href={company.href}
                  className="block rounded-lg border border-transparent px-2 py-2 transition hover:border-slate-200 hover:bg-white"
                >
                  <span className="block text-sm font-medium text-slate-900">
                    {company.label}
                  </span>
                  {company.description ? (
                    <span className="mt-0.5 block text-xs leading-relaxed text-slate-600">
                      {company.description}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </aside>
  );
}
