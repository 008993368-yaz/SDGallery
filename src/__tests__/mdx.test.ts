import { describe, expect, it } from "vitest";
import { prepareMdxSource } from "@/lib/mdx";

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
