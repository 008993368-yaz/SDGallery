import Image from "next/image";
import Link from "next/link";
import { getCompany } from "@/lib/content";
import type { CaseStudy } from "@/lib/types";

type CaseStudyCardProps = {
  study: CaseStudy;
  className?: string;
};

export function CaseStudyCard({ study, className = "" }: CaseStudyCardProps) {
  const company = getCompany(study.company);
  const companyName = company?.name ?? study.company;
  const logo = company?.logo;
  const scaleStat = study.stats.users;

  return (
    <Link
      href={`/case-studies/${study.slug}`}
      className={`group flex min-w-[16rem] flex-col gap-3 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-600/40 hover:shadow-md ${className}`}
    >
      <div className="flex items-center gap-3">
        {logo ? (
          <Image
            src={logo}
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 rounded-lg border border-slate-100 bg-slate-50 object-contain p-1"
          />
        ) : (
          <div
            aria-hidden
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-500"
          >
            {companyName.slice(0, 1)}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate font-medium text-slate-900 group-hover:text-teal-800">
            {companyName}
          </p>
          <p className="text-xs font-medium tracking-wide text-teal-700 uppercase">
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
