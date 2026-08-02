import type { ContentSection } from "@/lib/types";

type SectionNavProps = {
  sections: ContentSection[];
};

export function SectionNav({ sections }: SectionNavProps) {
  if (sections.length === 0) return null;

  return (
    <nav aria-label="On this page" className="space-y-3">
      <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
        On this page
      </p>
      <ul className="space-y-1 border-l border-slate-200">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="block border-l-2 border-transparent py-1.5 pl-3 text-sm text-slate-600 transition hover:border-teal-700 hover:text-teal-800"
            >
              {section.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
