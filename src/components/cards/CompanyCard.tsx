import Image from "next/image";
import Link from "next/link";

export type CompanyCardData = {
  name: string;
  slug: string;
  logo: string;
  industry: string;
  summary: string;
  caseStudyCount: number;
  href: string;
};

type CompanyCardProps = {
  company: CompanyCardData;
  className?: string;
};

export function CompanyCard({ company, className = "" }: CompanyCardProps) {
  const countLabel =
    company.caseStudyCount === 1
      ? "1 case study"
      : `${company.caseStudyCount} case studies`;

  return (
    <Link
      href={company.href}
      className={`group flex flex-col gap-3 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-600/40 hover:shadow-md ${className}`}
    >
      <div className="flex items-start gap-3">
        {company.logo ? (
          <Image
            src={company.logo}
            alt=""
            width={44}
            height={44}
            className="h-11 w-11 shrink-0 rounded-lg border border-slate-100 bg-slate-50 object-contain p-1"
          />
        ) : (
          <div
            aria-hidden
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-500"
          >
            {company.name.slice(0, 1)}
          </div>
        )}
        <div className="min-w-0">
          <h2 className="font-display text-lg tracking-tight text-slate-900 group-hover:text-teal-800">
            {company.name}
          </h2>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-md bg-teal-50 px-2 py-0.5 font-medium text-teal-800">
              {company.industry}
            </span>
            <span className="text-slate-500">{countLabel}</span>
          </div>
        </div>
      </div>
      <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">
        {company.summary}
      </p>
    </Link>
  );
}
