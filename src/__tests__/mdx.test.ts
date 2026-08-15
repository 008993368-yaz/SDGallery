import { describe, expect, it } from "vitest";
import {
  extractFirstDiagram,
  extractFirstMermaid,
  extractFurtherReading,
  parseFenceMeta,
  prepareMdxSource,
  stripMermaidFences,
} from "@/lib/mdx";

describe("parseFenceMeta", () => {
  it("parses key=\"value\" tokens", () => {
    expect(
      parseFenceMeta(
        ' caption="High-level architecture" explanation="Edge then origin."',
      ),
    ).toEqual({
      caption: "High-level architecture",
      explanation: "Edge then origin.",
    });
  });

  it("parses kind and src for diagram fences", () => {
    expect(
      parseFenceMeta(' kind="image" src="/diagrams/netflix-hld.svg" caption="N"'),
    ).toEqual({
      kind: "image",
      src: "/diagrams/netflix-hld.svg",
      caption: "N",
    });
  });
});

describe("prepareMdxSource", () => {
  it("replaces mermaid fences with DiagramBlock JSX", () => {
    const source = `Intro

\`\`\`mermaid
flowchart LR
  A-->B
\`\`\`

## Next
`;
    const prepared = prepareMdxSource(source);
    expect(prepared).toContain("<DiagramBlock");
    expect(prepared).toContain('kind={"mermaid"}');
    expect(prepared).toContain("flowchart LR");
    expect(prepared).not.toContain("```mermaid");
    expect(prepared).toContain("## Next");
  });

  it("passes caption and explanation meta through", () => {
    const source = `\`\`\`mermaid caption="HLD" explanation="Client to edge."
flowchart LR
  A-->B
\`\`\``;
    const prepared = prepareMdxSource(source);
    expect(prepared).toContain('caption={"HLD"}');
    expect(prepared).toContain('explanation={"Client to edge."}');
  });

  it("emits DiagramBlock for static image diagram fences", () => {
    const source = `\`\`\`diagram kind="image" src="/diagrams/netflix-hld.svg" caption="Netflix HLD"
\`\`\``;
    const prepared = prepareMdxSource(source);
    expect(prepared).toContain('kind={"image"}');
    expect(prepared).toContain('src={"/diagrams/netflix-hld.svg"}');
    expect(prepared).toContain('caption={"Netflix HLD"}');
  });

  it("leaves non-diagram fences alone", () => {
    const source = "```ts\nconst x = 1;\n```";
    expect(prepareMdxSource(source)).toBe(source);
  });
});

describe("diagram helpers", () => {
  const source = `## What

Body

\`\`\`mermaid caption="Overview" explanation="A flows to B."
flowchart LR
  A-->B
\`\`\`

See [CDN](/patterns/cdn) and [caching](/patterns/caching).
`;

  it("extracts the first mermaid chart body for validation", () => {
    expect(extractFirstMermaid(source)).toContain("flowchart LR");
  });

  it("extracts structured diagram metadata", () => {
    expect(extractFirstDiagram(source)).toEqual({
      kind: "mermaid",
      chart: "flowchart LR\n  A-->B",
      src: undefined,
      caption: "Overview",
      explanation: "A flows to B.",
    });
  });

  it("extracts image diagram fences", () => {
    const imageSource = `\`\`\`diagram kind="image" src="/diagrams/x.svg" caption="X" explanation="Note"
\`\`\``;
    expect(extractFirstDiagram(imageSource)).toEqual({
      kind: "image",
      chart: undefined,
      src: "/diagrams/x.svg",
      caption: "X",
      explanation: "Note",
    });
  });

  it("strips mermaid and diagram fences from body", () => {
    const withBoth = `${source}

\`\`\`diagram kind="image" src="/diagrams/x.svg" caption="X"
\`\`\`
`;
    const stripped = stripMermaidFences(withBoth);
    expect(stripped).not.toContain("```mermaid");
    expect(stripped).not.toContain("```diagram");
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
