import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { DeepDiveAccordion } from "@/components/case-study/DeepDiveAccordion";
import { RelatedSidebar } from "@/components/case-study/RelatedSidebar";
import { SectionNav } from "@/components/case-study/SectionNav";
import { SourcesList } from "@/components/case-study/SourcesList";
import { StatBar } from "@/components/case-study/StatBar";
import { LearningMeta } from "@/components/content/LearningMeta";
import { DiagramBlock } from "@/components/diagram/DiagramBlock";
import { MdxBody } from "@/components/mdx/MdxBody";
import {
  getCaseStudies,
  getCaseStudy,
  getCompany,
  getPattern,
  getPrerequisiteLinks,
  getPrimaryCaseStudyForCompany,
} from "@/lib/content";
import { CASE_STUDY_H2_TITLES, SITE_NAME } from "@/lib/constants";
import {
  extractFirstDiagram,
  extractFurtherReading,
  stripMermaidFences,
} from "@/lib/mdx";
import { extractSections } from "@/lib/sections";
import type { ContentSection } from "@/lib/types";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function topLevelSections(sections: ContentSection[]): ContentSection[] {
  return sections.filter((s) =>
    (CASE_STUDY_H2_TITLES as readonly string[]).includes(s.title),
  );
}

export function generateStaticParams() {
  return getCaseStudies().map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return { title: `Case study · ${SITE_NAME}` };
  return {
    title: `${study.title} · ${SITE_NAME}`,
    description: study.hook,
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const company = getCompany(study.company);
  const sections = topLevelSections(extractSections(study.body));
  const hld = sections.find((s) => s.title === "High-Level Design");
  const deepDives = sections.find((s) => s.title === "Deep Dives");
  const chart = hld ? extractFirstDiagram(hld.content) : null;
  const sources = extractFurtherReading(study.body);

  const relatedPatterns = study.patterns
    .map((patternSlug) => getPattern(patternSlug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const relatedCompanies = study.relatedCompanies
    .map((companySlug) => {
      const related = getCompany(companySlug);
      if (!related) return null;
      const primary = getPrimaryCaseStudyForCompany(companySlug);
      return {
        href: primary ? `/case-studies/${primary.slug}` : "/companies",
        label: related.name,
        description: related.summary,
      };
    })
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const prerequisites = getPrerequisiteLinks(study.prerequisites);

  const mainSections = sections.filter((s) => s.title !== "Sources");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <header className="max-w-3xl">
        <div className="flex items-start gap-4">
          {company?.logo ? (
            <Image
              src={company.logo}
              alt=""
              width={56}
              height={56}
              className="h-14 w-14 rounded-xl border border-slate-100 bg-white object-contain p-1.5"
            />
          ) : (
            <div
              aria-hidden
              className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-lg font-semibold text-slate-500"
            >
              {(company?.name ?? study.company).slice(0, 1)}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-wide text-teal-700 uppercase">
              {company?.name ?? study.company}
            </p>
            <h1 className="font-display text-4xl tracking-tight text-slate-900">
              {study.title}
            </h1>
          </div>
        </div>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">
          {study.hook}
        </p>
        <LearningMeta
          difficulty={study.difficulty}
          estimatedReadingMinutes={study.estimatedReadingMinutes}
          learningObjectives={study.learningObjectives}
          prerequisites={prerequisites}
        />
        <StatBar stats={study.stats} />
      </header>

      {chart ? (
        <section className="mt-10">
          <DiagramBlock
            kind={chart.kind}
            chart={chart.chart}
            src={chart.src}
            caption={chart.caption ?? "High-level architecture"}
            explanation={chart.explanation}
          />
        </section>
      ) : null}

      <div className="mt-12 grid gap-10 lg:grid-cols-[12rem_minmax(0,1fr)_16rem]">
        <div className="lg:sticky lg:top-8 lg:self-start">
          <SectionNav sections={sections} />
        </div>

        <div className="min-w-0 space-y-12">
          {mainSections.map((section) => {
            if (section.title === "Deep Dives") {
              return (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-8"
                >
                  <h2 className="font-display text-2xl tracking-tight text-slate-900">
                    {section.title}
                  </h2>
                  <div className="mt-4">
                    <DeepDiveAccordion sections={deepDives?.children ?? []} />
                  </div>
                </section>
              );
            }

            const content =
              section.title === "High-Level Design"
                ? stripMermaidFences(section.content)
                : section.content;

            return (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-8"
              >
                <h2 className="font-display text-2xl tracking-tight text-slate-900">
                  {section.title}
                </h2>
                {content.trim() ? (
                  <div className="mt-4">
                    <MdxBody source={content} />
                  </div>
                ) : null}
              </section>
            );
          })}
        </div>

        <div className="lg:sticky lg:top-8 lg:self-start">
          <RelatedSidebar
            patterns={relatedPatterns}
            companies={relatedCompanies}
            title="Related"
          />
        </div>
      </div>

      <div className="mt-16 border-t border-slate-200 pt-12">
        <SourcesList sources={sources} />
      </div>
    </div>
  );
}
