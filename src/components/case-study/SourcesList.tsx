import type { ReadingLink } from "@/lib/mdx";

type SourcesListProps = {
  sources: ReadingLink[];
  id?: string;
};

export function SourcesList({
  sources,
  id = "sources",
}: SourcesListProps) {
  if (sources.length === 0) return null;

  return (
    <section id={id} className="scroll-mt-8">
      <h2 className="font-display text-2xl tracking-tight text-slate-900">
        Sources & Further Reading
      </h2>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700">
        {sources.map((source) => (
          <li key={source.href}>
            <a
              href={source.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-900 underline decoration-slate-300 underline-offset-2 hover:decoration-teal-700"
            >
              {source.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
