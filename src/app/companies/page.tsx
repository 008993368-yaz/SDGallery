import type { Metadata } from "next";
import {
  CompanyDirectory,
  type DirectoryCompany,
} from "@/components/directory/CompanyDirectory";
import {
  getCaseStudies,
  getCompanies,
  getPrimaryCaseStudyForCompany,
} from "@/lib/content";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Companies · ${SITE_NAME}`,
  description:
    "Explore companies behind large-scale systems—filter by industry, scale, and tech stack.",
};

export default function CompaniesPage() {
  const studies = getCaseStudies();
  const companies: DirectoryCompany[] = getCompanies().map((company) => {
    const primary = getPrimaryCaseStudyForCompany(company.slug);
    const caseStudyCount = studies.filter(
      (study) => study.company === company.slug,
    ).length;

    return {
      name: company.name,
      slug: company.slug,
      logo: company.logo,
      industry: company.industry,
      scale: company.scale,
      techStack: company.techStack,
      summary: company.summary,
      popularity: company.popularity,
      updatedAt: company.updatedAt,
      caseStudyCount,
      href: primary ? `/case-studies/${primary.slug}` : "/companies",
    };
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14 lg:py-16">
      <section className="max-w-2xl rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-sm ring-1 ring-slate-900/5 backdrop-blur sm:p-8">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-teal-700">
          Company directory
        </p>
        <h1 className="mt-3 font-display text-4xl tracking-tight text-slate-900">
          Explore Companies
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-slate-600">
          Browse the systems behind familiar products. Filter by industry,
          scale, or stack, then open a primary case study to learn how it works.
        </p>
      </section>

      <CompanyDirectory companies={companies} />
    </div>
  );
}
