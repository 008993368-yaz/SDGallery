import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseStudyCard } from "@/components/cards/CaseStudyCard";
import { RelatedSidebar } from "@/components/case-study/RelatedSidebar";
import { Diagram } from "@/components/diagram/Diagram";
import { MdxBody } from "@/components/mdx/MdxBody";
import { PatternIcon } from "@/components/patterns/PatternIcon";
import {
  getCaseStudiesByPattern,
  getPattern,
  getPatterns,
} from "@/lib/content";
import { SITE_NAME } from "@/lib/constants";
import {
  extractFirstMermaid,
  extractFurtherReading,
  stripMermaidFences,
} from "@/lib/mdx";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getPatterns().map((pattern) => ({ slug: pattern.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pattern = getPattern(slug);
  if (!pattern) return { title: `Pattern · ${SITE_NAME}` };
  return {
    title: `${pattern.name} · ${SITE_NAME}`,
    description: pattern.definition,
  };
}

export default async function PatternDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const pattern = getPattern(slug);
  if (!pattern) notFound();

  const chart = extractFirstMermaid(pattern.body);
  const bodyWithoutDiagram = stripMermaidFences(pattern.body);
  const studies = getCaseStudiesByPattern(pattern.slug);
  const relatedPatterns = pattern.relatedPatterns
    .map((relatedSlug) => getPattern(relatedSlug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const furtherReading = extractFurtherReading(pattern.body).filter(
    (link) => !link.href.startsWith(`/patterns/${pattern.slug}`),
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <header className="max-w-3xl">
        <div className="flex items-center gap-4">
          <PatternIcon icon={pattern.icon} className="h-12 w-12 [&_span]:h-6 [&_span]:w-6" />
          <div>
            <p className="text-xs font-semibold tracking-wide text-teal-700 uppercase">
              Pattern
            </p>
            <h1 className="font-display text-4xl tracking-tight text-slate-900">
              {pattern.name}
            </h1>
          </div>
        </div>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">
          {pattern.definition}
        </p>
      </header>

      {chart ? (
        <section className="mt-10">
          <Diagram chart={chart} title={`${pattern.name} overview`} />
        </section>
      ) : null}

      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="min-w-0 space-y-12">
          <section>
            <MdxBody source={bodyWithoutDiagram} />
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-tight text-slate-900">
              Companies Using This Pattern
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Case studies that apply {pattern.name.toLowerCase()} in production
              architectures.
            </p>
            {studies.length > 0 ? (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {studies.map((study) => (
                  <CaseStudyCard
                    key={study.slug}
                    study={study}
                    href={`/case-studies/${study.slug}#high-level-design`}
                  />
                ))}
              </div>
            ) : (
              <p className="mt-6 text-sm text-slate-500">
                No case studies reference this pattern yet.
              </p>
            )}
          </section>

          {furtherReading.length > 0 ? (
            <section>
              <h2 className="font-display text-2xl tracking-tight text-slate-900">
                Further reading
              </h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700">
                {furtherReading.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-slate-900 underline decoration-slate-300 underline-offset-2 hover:decoration-teal-700"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        <div className="lg:sticky lg:top-8 lg:self-start">
          <RelatedSidebar patterns={relatedPatterns} title="Explore next" />
        </div>
      </div>
    </div>
  );
}
