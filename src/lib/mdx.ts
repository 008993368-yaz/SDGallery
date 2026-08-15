export type DiagramKind = "mermaid" | "image";

export type ExtractedDiagram = {
  kind: DiagramKind;
  chart?: string;
  src?: string;
  caption?: string;
  explanation?: string;
};

function diagramFenceRe(): RegExp {
  return /```(mermaid|diagram)([^\n]*)\r?\n([\s\S]*?)```/g;
}

/** Parse `key="value"` tokens from a fence info string. */
export function parseFenceMeta(info: string): Record<string, string> {
  const meta: Record<string, string> = {};
  const re = /(\w+)="([^"]*)"/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(info)) !== null) {
    meta[match[1]] = match[2];
  }
  return meta;
}

function normalizeKind(
  fenceType: "mermaid" | "diagram",
  meta: Record<string, string>,
): DiagramKind {
  if (meta.kind === "image") return "image";
  if (meta.kind === "mermaid") return "mermaid";
  return fenceType === "diagram" ? "image" : "mermaid";
}

function fenceToDiagram(
  fenceType: "mermaid" | "diagram",
  info: string,
  body: string,
): ExtractedDiagram {
  const meta = parseFenceMeta(info);
  const kind = normalizeKind(fenceType, meta);
  const chart = kind === "mermaid" ? body.trimEnd() : undefined;
  return {
    kind,
    chart,
    src: meta.src,
    caption: meta.caption,
    explanation: meta.explanation,
  };
}

function emitDiagramBlock(diagram: ExtractedDiagram): string {
  const parts = [`kind={${JSON.stringify(diagram.kind)}}`];
  if (diagram.chart != null) {
    parts.push(`chart={${JSON.stringify(diagram.chart)}}`);
  }
  if (diagram.src) {
    parts.push(`src={${JSON.stringify(diagram.src)}}`);
  }
  parts.push(`caption={${JSON.stringify(diagram.caption ?? "")}}`);
  if (diagram.explanation) {
    parts.push(`explanation={${JSON.stringify(diagram.explanation)}}`);
  }
  return `<DiagramBlock ${parts.join(" ")} />`;
}

/** Replace mermaid/diagram fences with `<DiagramBlock … />` before MDXRemote. */
export function prepareMdxSource(source: string): string {
  return source.replace(
    diagramFenceRe(),
    (_match, fenceType: "mermaid" | "diagram", info: string, body: string) => {
      return emitDiagramBlock(fenceToDiagram(fenceType, info, body));
    },
  );
}

/** First mermaid or diagram fence as a structured object. */
export function extractFirstDiagram(source: string): ExtractedDiagram | null {
  const match = /```(mermaid|diagram)([^\n]*)\r?\n([\s\S]*?)```/.exec(source);
  if (!match) return null;
  return fenceToDiagram(
    match[1] as "mermaid" | "diagram",
    match[2],
    match[3],
  );
}

/**
 * First ```mermaid fence chart body, if any.
 * Used by content validation (Mermaid remains required).
 */
export function extractFirstMermaid(source: string): string | null {
  const match = /```mermaid[^\n]*\r?\n([\s\S]*?)```/.exec(source);
  return match ? match[1].trimEnd() : null;
}

/** Remove mermaid and diagram fences (e.g. when DiagramBlock is rendered separately). */
export function stripMermaidFences(source: string): string {
  return source
    .replace(diagramFenceRe(), "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
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
