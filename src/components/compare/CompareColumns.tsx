import Image from "next/image";
import Link from "next/link";
import { MdxBody } from "@/components/mdx/MdxBody";

export type CompareSide = {
  name: string;
  logo: string;
  hasCaseStudy: boolean;
  sections: Record<string, string>;
  learningPaths: { slug: string; title: string }[];
};

type CompareColumnsProps = {
  left: CompareSide;
  right: CompareSide;
  sectionTitles: readonly string[];
};

function SideHeader({
  name,
  logo,
  learningPaths,
}: {
  name: string;
  logo: string;
  learningPaths: { slug: string; title: string }[];
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        {logo ? (
          <Image
            src={logo}
            alt=""
            width={44}
            height={44}
            className="h-11 w-11 rounded-2xl border border-slate-100 bg-white object-contain p-1"
          />
        ) : (
          <div
            aria-hidden
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-sm font-semibold text-slate-500"
          >
            {name.slice(0, 1)}
          </div>
        )}
        <h2 className="font-display text-xl tracking-tight text-slate-900">
          {name}
        </h2>
      </div>
      {learningPaths.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {learningPaths.map((path) => (
            <Link
              key={path.slug}
              href={`/paths/${path.slug}`}
              className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-800 ring-1 ring-teal-100 transition hover:bg-teal-100"
            >
              {path.title}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function MissingStudy({ name }: { name: string }) {
  return (
    <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950">
      No case study yet for {name}. Pick another company to compare.
    </p>
  );
}

export function CompareColumns({
  left,
  right,
  sectionTitles,
}: CompareColumnsProps) {
  return (
    <div className="compare-columns mt-10">
      <div className="grid gap-8 rounded-3xl border border-white/70 bg-white/70 p-5 shadow-sm ring-1 ring-slate-900/5 md:grid-cols-[1fr_auto_1fr] md:gap-0">
        <div className="md:pr-8">
          <SideHeader
            name={left.name}
            logo={left.logo}
            learningPaths={left.learningPaths}
          />
        </div>
        <div
          aria-hidden
          className="hidden w-px bg-slate-200 md:block"
        />
        <div className="md:pl-8">
          <SideHeader
            name={right.name}
            logo={right.logo}
            learningPaths={right.learningPaths}
          />
        </div>
      </div>

      {!left.hasCaseStudy || !right.hasCaseStudy ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div>
            {!left.hasCaseStudy ? <MissingStudy name={left.name} /> : null}
          </div>
          <div>
            {!right.hasCaseStudy ? <MissingStudy name={right.name} /> : null}
          </div>
        </div>
      ) : null}

      {left.hasCaseStudy && right.hasCaseStudy
        ? sectionTitles.map((title) => {
            const leftContent = left.sections[title] ?? "";
            const rightContent = right.sections[title] ?? "";

            return (
              <section
                key={title}
                className="mt-10 rounded-3xl border border-white/70 bg-white/70 p-5 shadow-sm ring-1 ring-slate-900/5"
              >
                <h3 className="font-display text-lg tracking-tight text-slate-900 md:text-center">
                  {title}
                </h3>
                <div className="mt-6 grid gap-8 md:grid-cols-[1fr_auto_1fr] md:gap-0">
                  <div className="min-w-0 md:pr-8">
                    {leftContent.trim() ? (
                      <MdxBody source={leftContent} />
                    ) : (
                      <p className="text-sm text-slate-500">
                        No content for this section.
                      </p>
                    )}
                  </div>
                  <div
                    aria-hidden
                    className="hidden w-px bg-slate-200 md:block"
                  />
                  <div className="min-w-0 md:pl-8">
                    {rightContent.trim() ? (
                      <MdxBody source={rightContent} />
                    ) : (
                      <p className="text-sm text-slate-500">
                        No content for this section.
                      </p>
                    )}
                  </div>
                </div>
              </section>
            );
          })
        : null}
    </div>
  );
}
