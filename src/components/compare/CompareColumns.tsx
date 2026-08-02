import Image from "next/image";
import { MdxBody } from "@/components/mdx/MdxBody";

export type CompareSide = {
  name: string;
  logo: string;
  hasCaseStudy: boolean;
  sections: Record<string, string>;
};

type CompareColumnsProps = {
  left: CompareSide;
  right: CompareSide;
  sectionTitles: readonly string[];
};

function SideHeader({ name, logo }: { name: string; logo: string }) {
  return (
    <div className="flex items-center gap-3">
      {logo ? (
        <Image
          src={logo}
          alt=""
          width={44}
          height={44}
          className="h-11 w-11 rounded-lg border border-slate-100 bg-white object-contain p-1"
        />
      ) : (
        <div
          aria-hidden
          className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-500"
        >
          {name.slice(0, 1)}
        </div>
      )}
      <h2 className="font-display text-xl tracking-tight text-slate-900">
        {name}
      </h2>
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
      <div className="grid gap-8 md:grid-cols-[1fr_auto_1fr] md:gap-0">
        <div className="md:pr-8">
          <SideHeader name={left.name} logo={left.logo} />
        </div>
        <div
          aria-hidden
          className="hidden w-px bg-slate-200 md:block"
        />
        <div className="md:pl-8">
          <SideHeader name={right.name} logo={right.logo} />
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
                className="mt-10 border-t border-slate-200 pt-8"
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
