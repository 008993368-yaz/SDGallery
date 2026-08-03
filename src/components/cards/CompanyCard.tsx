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
      className={`group flex flex-col gap-3 rounded-3xl border border-white/70 bg-white/85 p-5 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.45)] ring-1 ring-slate-900/5 transition-all hover:-translate-y-1 hover:border-teal-500/30 hover:shadow-lg ${className}`}
    >
      <div className="flex items-start gap-3">
        {company.logo ? (
          <Image
            src={company.logo}
            alt=""
            width={44}
            height={44}
            className="h-11 w-11 shrink-0 rounded-2xl border border-slate-100 bg-slate-50 object-contain p-1"
          />
        ) : (
          <div
            aria-hidden
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-sm font-semibold text-slate-500"
          >
            {company.name.slice(0, 1)}
          </div>
        )}
        <div className="min-w-0">
          <h2 className="font-display text-lg tracking-tight text-slate-900 transition group-hover:text-teal-800">
            {company.name}
          </h2>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full bg-teal-50 px-2.5 py-1 font-medium text-teal-800">
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
