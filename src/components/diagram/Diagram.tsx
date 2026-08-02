"use client";

import { useEffect, useId, useState } from "react";

type DiagramProps = {
  chart: string;
  title?: string;
  kind?: "mermaid" | "excalidraw";
};

export function Diagram({ chart, title, kind = "mermaid" }: DiagramProps) {
  const id = useId().replace(/:/g, "");
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (kind !== "mermaid") return;
    let cancelled = false;
    (async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "loose",
          theme: "neutral",
        });
        const { svg } = await mermaid.render(`mmd-${id}`, chart);
        if (!cancelled) setSvg(svg);
      } catch {
        if (!cancelled) setError(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [chart, id, kind]);

  if (kind === "excalidraw") {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
        Excalidraw diagrams arrive in v2.
      </div>
    );
  }

  if (error || !chart?.trim()) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
        Diagram unavailable. The rest of this page still works.
      </div>
    );
  }

  return (
    <figure className="overflow-x-auto rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      {title ? (
        <figcaption className="mb-3 text-sm font-medium text-slate-600">
          {title}
        </figcaption>
      ) : null}
      {svg ? (
        <div dangerouslySetInnerHTML={{ __html: svg }} />
      ) : (
        <p className="text-sm text-slate-400">Rendering diagram…</p>
      )}
    </figure>
  );
}
