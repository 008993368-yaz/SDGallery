import type { Metadata } from "next";
import {
  CompareColumns,
  type CompareSide,
} from "@/components/compare/CompareColumns";
import { CompareControls } from "@/components/compare/CompareControls";
import {
  getCompanies,
  getCompany,
  getPrimaryCaseStudyForCompany,
} from "@/lib/content";
import { SITE_NAME } from "@/lib/constants";
import { stripMermaidFences } from "@/lib/mdx";
import { extractSections } from "@/lib/sections";

export const metadata: Metadata = {
  title: `Compare · ${SITE_NAME}`,
  description:
    "Compare how different companies approach system design side by side.",
};

const COMPARE_SECTION_TITLES = [
  "Problem & Requirements",
  "High-Level Design",
  "Key Components",
  "Trade-offs",
] as const;

function buildSide(slug: string): CompareSide | null {
  const company = getCompany(slug);
  if (!company) return null;

  const study = getPrimaryCaseStudyForCompany(slug);
  if (!study) {
    return {
      name: company.name,
      logo: company.logo,
      hasCaseStudy: false,
      sections: {},
    };
  }

  const sections = extractSections(study.body).filter((s) =>
    (COMPARE_SECTION_TITLES as readonly string[]).includes(s.title),
  );
  const byTitle: Record<string, string> = {};
  for (const section of sections) {
    byTitle[section.title] =
      section.title === "High-Level Design"
        ? stripMermaidFences(section.content)
        : section.content;
  }

  return {
    name: company.name,
    logo: company.logo,
    hasCaseStudy: true,
    sections: byTitle,
  };
}

function framingHeading(
  aSlug: string,
  bSlug: string,
  aName: string,
  bName: string,
): string {
  const pair = new Set([aSlug, bSlug]);
  if (pair.has("netflix") && pair.has("youtube") && pair.size === 2) {
    return "Netflix vs YouTube: Video Delivery";
  }
  return `${aName} vs ${bName}`;
}

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ a?: string; b?: string }>;
}) {
  const params = await searchParams;
  const aSlug = params.a?.trim() || "";
  const bSlug = params.b?.trim() || "";

  const companies = getCompanies()
    .map((c) => ({ slug: c.slug, name: c.name }))
    .sort((x, y) => x.name.localeCompare(y.name));

  const left = aSlug ? buildSide(aSlug) : null;
  const right = bSlug ? buildSide(bSlug) : null;
  const ready = Boolean(left && right && aSlug !== bSlug);

  const heading =
    ready && left && right
      ? framingHeading(aSlug, bSlug, left.name, right.name)
      : "Compare companies";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14 lg:py-16">
      <section className="max-w-2xl rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-sm ring-1 ring-slate-900/5 backdrop-blur sm:p-8">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-teal-700">
          Side by side
        </p>
        <h1 className="mt-3 font-display text-4xl tracking-tight text-slate-900">
          {heading}
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-slate-600">
          Pick two companies and compare how they approach the same system
          design problems.
        </p>
      </section>

      <div className="mt-8">
        <CompareControls
          companies={companies}
          initialA={aSlug}
          initialB={bSlug}
        />
      </div>

      {ready && left && right ? (
        <CompareColumns
          left={left}
          right={right}
          sectionTitles={COMPARE_SECTION_TITLES}
        />
      ) : (
        <p className="mt-10 text-sm text-slate-500">
          Select two different companies, then press Compare.
        </p>
      )}
    </div>
  );
}
