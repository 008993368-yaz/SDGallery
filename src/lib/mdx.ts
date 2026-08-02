const MERMAID_FENCE_RE = /```mermaid\r?\n([\s\S]*?)```/g;

/** Replace ```mermaid fences with `<Diagram chart={...} />` before MDXRemote. */
export function prepareMdxSource(source: string): string {
  return source.replace(MERMAID_FENCE_RE, (_match, chart: string) => {
    return `<Diagram chart={${JSON.stringify(chart.trimEnd())}} />`;
  });
}

/** First ```mermaid fence chart body, if any. */
export function extractFirstMermaid(source: string): string | null {
  const match = /```mermaid\r?\n([\s\S]*?)```/.exec(source);
  return match ? match[1].trimEnd() : null;
}

/** Remove mermaid fences (e.g. when Diagram is rendered separately). */
export function stripMermaidFences(source: string): string {
  return source.replace(MERMAID_FENCE_RE, "").replace(/\n{3,}/g, "\n\n").trim();
}

export type ReadingLink = { href: string; label: string };

/** Links from a Sources / Further reading section, or all markdown links in body. */
export function extractFurtherReading(source: string): ReadingLink[] {
  const sections = source.replace(/\r\n/g, "\n").split("\n");
  let inReading = false;
  const readingLines: string[] = [];
  for (const line of sections) {
    const h2 = /^##\s+(.+)$/.exec(line);
    if (h2) {
      const title = h2[1].trim().toLowerCase();
      inReading = title === "sources" || title === "further reading";
      continue;
    }
    if (inReading) readingLines.push(line);
  }

  const pool =
    readingLines.length > 0 ? readingLines.join("\n") : source;
  const links: ReadingLink[] = [];
  const seen = new Set<string>();
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(pool)) !== null) {
    const label = m[1].trim();
    const href = m[2].trim();
    if (!href || seen.has(href)) continue;
    seen.add(href);
    links.push({ href, label });
  }
  return links;
}
