import type { ContentSection } from "./types";

export function slugifyHeading(title: string): string {
  return title
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function extractSections(markdown: string): ContentSection[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const root: ContentSection[] = [];
  let currentH2: ContentSection | null = null;
  let currentH3: ContentSection | null = null;
  let buffer: string[] = [];

  const flush = () => {
    const text = buffer.join("\n").trim();
    buffer = [];
    if (currentH3) currentH3.content = text;
    else if (currentH2) currentH2.content = text;
  };

  for (const line of lines) {
    const h3 = /^###\s+(.+)$/.exec(line);
    if (h3) {
      flush();
      const title = h3[1].trim();
      currentH3 = { id: slugifyHeading(title), title, content: "" };
      currentH2?.children?.push(currentH3);
      // Also include h3s in the flat root list (TOC / nav consumers)
      root.push(currentH3);
      continue;
    }
    const h2 = /^##\s+(.+)$/.exec(line);
    if (h2) {
      flush();
      currentH3 = null;
      const title = h2[1].trim();
      currentH2 = { id: slugifyHeading(title), title, content: "", children: [] };
      root.push(currentH2);
      continue;
    }
    buffer.push(line);
  }
  flush();
  return root;
}
