import { MdxBody } from "@/components/mdx/MdxBody";
import type { ContentSection } from "@/lib/types";

type DeepDiveAccordionProps = {
  sections: ContentSection[];
};

export function DeepDiveAccordion({ sections }: DeepDiveAccordionProps) {
  if (sections.length === 0) return null;

  return (
    <div className="space-y-3">
      {sections.map((section) => (
        <details
          key={section.id}
          id={section.id}
          className="group rounded-lg border border-slate-200 bg-white open:shadow-sm"
        >
          <summary className="cursor-pointer list-none px-4 py-3 font-medium text-slate-900 marker:content-none [&::-webkit-details-marker]:hidden">
            <span className="flex items-center justify-between gap-3">
              {section.title}
              <span
                aria-hidden
                className="text-slate-400 transition group-open:rotate-180"
              >
                ▾
              </span>
            </span>
          </summary>
          <div className="border-t border-slate-100 px-4 py-4">
            <MdxBody source={section.content} />
          </div>
        </details>
      ))}
    </div>
  );
}
