import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  Diagram,
  DIAGRAM_LOADING,
  DIAGRAM_UNAVAILABLE,
  diagramSurfaceStatus,
} from "@/components/diagram/Diagram";
import { DiagramBlock } from "@/components/diagram/DiagramBlock";

describe("diagramSurfaceStatus", () => {
  it("treats empty chart as unavailable", () => {
    expect(diagramSurfaceStatus("", false, false)).toBe("unavailable");
    expect(diagramSurfaceStatus("   ", false, false)).toBe("unavailable");
    expect(diagramSurfaceStatus(undefined, false, false)).toBe("unavailable");
  });

  it("treats error as unavailable even with chart text", () => {
    expect(diagramSurfaceStatus("flowchart LR\nA-->B", true, false)).toBe(
      "unavailable",
    );
  });

  it("is loading while waiting for svg", () => {
    expect(diagramSurfaceStatus("flowchart LR\nA-->B", false, false)).toBe(
      "loading",
    );
  });

  it("is ready when svg is present", () => {
    expect(diagramSurfaceStatus("flowchart LR\nA-->B", false, true)).toBe(
      "ready",
    );
  });
});

describe("Diagram fallbacks", () => {
  it("renders unavailable copy for empty chart", () => {
    const html = renderToStaticMarkup(
      createElement(Diagram, { chart: "" }),
    );
    expect(html).toContain(DIAGRAM_UNAVAILABLE);
    expect(html).not.toContain(DIAGRAM_LOADING);
  });

  it("renders loading copy before mermaid finishes", () => {
    const html = renderToStaticMarkup(
      createElement(Diagram, { chart: "flowchart LR\n  A-->B" }),
    );
    expect(html).toContain(DIAGRAM_LOADING);
  });

  it("keeps optional title caption when provided", () => {
    const html = renderToStaticMarkup(
      createElement(Diagram, {
        chart: "flowchart LR\n  A-->B",
        title: "High-level architecture",
      }),
    );
    expect(html).toContain("High-level architecture");
    expect(html).toContain("<figcaption");
  });
});

describe("DiagramBlock prop wiring", () => {
  it("renders caption and explanation around a mermaid surface", () => {
    const html = renderToStaticMarkup(
      createElement(DiagramBlock, {
        kind: "mermaid",
        chart: "flowchart LR\n  A-->B",
        caption: "High-level architecture",
        explanation: "Client traffic hits the edge, then origin.",
      }),
    );
    expect(html).toContain("High-level architecture");
    expect(html).toContain("Client traffic hits the edge, then origin.");
    expect(html).toContain(DIAGRAM_LOADING);
  });

  it("shows unavailable when mermaid chart is missing", () => {
    const html = renderToStaticMarkup(
      createElement(DiagramBlock, {
        kind: "mermaid",
        caption: "Missing chart",
      }),
    );
    expect(html).toContain(DIAGRAM_UNAVAILABLE);
    expect(html).toContain("Missing chart");
  });

  it("shows unavailable when image src is missing", () => {
    const html = renderToStaticMarkup(
      createElement(DiagramBlock, {
        kind: "image",
        caption: "Static diagram",
        explanation: "Optional note",
      }),
    );
    expect(html).toContain(DIAGRAM_UNAVAILABLE);
    expect(html).toContain("Static diagram");
    expect(html).toContain("Optional note");
  });

  it("wires image src and alt from caption when alt omitted", () => {
    const html = renderToStaticMarkup(
      createElement(DiagramBlock, {
        kind: "image",
        src: "/diagrams/netflix-hld.svg",
        caption: "Netflix HLD",
      }),
    );
    expect(html).toContain('src="/diagrams/netflix-hld.svg"');
    expect(html).toContain('alt="Netflix HLD"');
    expect(html).toContain(DIAGRAM_LOADING);
  });
});
