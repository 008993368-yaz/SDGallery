"use client";

import { useEffect, useId, useState } from "react";

export type DiagramProps = {
  chart: string;
  /** Optional caption when used without DiagramBlock (backward compatible). */
  title?: string;
};

/** Shared copy for empty / failed diagram surfaces. */
export const DIAGRAM_UNAVAILABLE =
  "Diagram unavailable. The rest of this page still works.";

export const DIAGRAM_LOADING = "Rendering diagram…";

/** Pure status helper for tests and callers. */
export function diagramSurfaceStatus(
  chart: string | undefined,
  error: boolean,
  hasSvg: boolean,
): "unavailable" | "loading" | "ready" {
  if (error || !chart?.trim()) return "unavailable";
  if (!hasSvg) return "loading";
  return "ready";
}

/**
 * Public Diagram: remount inner state when `chart` changes so loading/error
 * reset without synchronous setState at the top of an effect.
 */
export function Diagram({ chart, title }: DiagramProps) {
  return <DiagramChart key={chart} chart={chart} title={title} />;
}

function DiagramChart({ chart, title }: DiagramProps) {
  const id = useId().replace(/:/g, "");
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!chart?.trim()) return;
    (async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "loose",
          theme: "neutral",
        });
        const { svg: rendered } = await mermaid.render(`mmd-${id}`, chart);
        if (!cancelled) setSvg(rendered);
      } catch {
        if (!cancelled) setError(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  const status = diagramSurfaceStatus(chart, error, Boolean(svg));

  const surface =
    status === "unavailable" ? (
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
        {DIAGRAM_UNAVAILABLE}
      </div>
    ) : status === "ready" ? (
      <div dangerouslySetInnerHTML={{ __html: svg! }} />
    ) : (
      <p className="text-sm text-slate-400">{DIAGRAM_LOADING}</p>
    );

  if (!title) {
    return (
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        {surface}
      </div>
    );
  }

  return (
    <figure className="overflow-x-auto rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <figcaption className="mb-3 text-sm font-medium text-slate-600">
        {title}
      </figcaption>
      {surface}
    </figure>
  );
}
