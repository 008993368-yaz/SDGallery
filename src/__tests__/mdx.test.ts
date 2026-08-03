import { describe, expect, it } from "vitest";
import {
  extractFirstMermaid,
  extractFurtherReading,
  prepareMdxSource,
  stripMermaidFences,
} from "@/lib/mdx";

describe("prepareMdxSource", () => {
  it("replaces mermaid fences with Diagram JSX", () => {
    const source = `Intro

\`\`\`mermaid
flowchart LR
  A-->B
\`\`\`

## Next
`;
    const prepared = prepareMdxSource(source);
    expect(prepared).toContain("<Diagram chart=");
    expect(prepared).toContain("flowchart LR");
    expect(prepared).not.toContain("```mermaid");
    expect(prepared).toContain("## Next");
  });

  it("leaves non-mermaid fences alone", () => {
    const source = "```ts\nconst x = 1;\n```";
    expect(prepareMdxSource(source)).toBe(source);
  });
});

describe("mermaid helpers", () => {
  const source = `## What

Body

\`\`\`mermaid
flowchart LR
  A-->B
\`\`\`

See [CDN](/patterns/cdn) and [caching](/patterns/caching).
`;

  it("extracts the first mermaid chart", () => {
    expect(extractFirstMermaid(source)).toContain("flowchart LR");
  });

  it("strips mermaid fences from body", () => {
    const stripped = stripMermaidFences(source);
    expect(stripped).not.toContain("```mermaid");
    expect(stripped).toContain("## What");
  });

  it("collects further reading links from body", () => {
    const links = extractFurtherReading(source);
    expect(links).toEqual([
      { href: "/patterns/cdn", label: "CDN" },
      { href: "/patterns/caching", label: "caching" },
    ]);
  });
});
