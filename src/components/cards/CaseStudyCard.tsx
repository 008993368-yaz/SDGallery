import Image from "next/image";
import Link from "next/link";
import { getCompany } from "@/lib/content";
import type { CaseStudy } from "@/lib/types";

type CaseStudyCardProps = {
  study: CaseStudy;
  className?: string;
  /** Override default `/case-studies/{slug}` (e.g. deep-link with hash). */
  href?: string;
};

export function CaseStudyCard({
  study,
  className = "",
  href,
}: CaseStudyCardProps) {
  const company = getCompany(study.company);
  const companyName = company?.name ?? study.company;
  const logo = company?.logo;
  const scaleStat = study.stats.users;

  return (
    <Link
      href={href ?? `/case-studies/${study.slug}`}
      className={`group relative flex min-w-[16rem] flex-col gap-3 overflow-hidden rounded-3xl border border-white/70 bg-white/85 p-5 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.45)] ring-1 ring-slate-900/5 transition-all hover:-translate-y-1 hover:border-teal-500/30 hover:shadow-lg ${className}`}
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-500 via-cyan-400 to-sky-400"
      />
      <div className="flex items-center gap-3">
        {logo ? (
          <Image
            src={logo}
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 rounded-2xl border border-slate-100 bg-slate-50 object-contain p-1"
          />
        ) : (
          <div
            aria-hidden
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-sm font-semibold text-slate-500"
          >
            {companyName.slice(0, 1)}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate font-medium text-slate-900 transition group-hover:text-teal-800">
            {companyName}
          </p>
          <p className="text-xs font-medium tracking-[0.24em] text-teal-700 uppercase">
            {scaleStat}
          </p>
        </div>
      </div>
      <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">
        {study.hook}
      </p>
    </Link>
  );
}
