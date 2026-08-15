"use client";

import { useState, type ReactNode } from "react";
import {
  Diagram,
  DIAGRAM_LOADING,
  DIAGRAM_UNAVAILABLE,
} from "@/components/diagram/Diagram";

export type DiagramBlockKind = "mermaid" | "image";

export type DiagramBlockProps = {
  kind: DiagramBlockKind;
  chart?: string;
  src?: string;
  caption?: string;
  explanation?: string;
  alt?: string;
};

function UnavailableSurface() {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
      {DIAGRAM_UNAVAILABLE}
    </div>
  );
}

function ImageSurface({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (failed || !src.trim()) {
    return <UnavailableSurface />;
  }

  return (
    <div className="relative overflow-x-auto">
      {!loaded ? (
        <p className="text-sm text-slate-400">{DIAGRAM_LOADING}</p>
      ) : null}
      {/* eslint-disable-next-line @next/next/no-img-element -- local diagram assets; need onError for fallback */}
      <img
        src={src}
        alt={alt}
        className={loaded ? "mx-auto h-auto max-w-full" : "hidden"}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </div>
  );
}

export function DiagramBlock({
  kind,
  chart,
  src,
  caption = "",
  explanation,
  alt,
}: DiagramBlockProps) {
  const imageAlt = alt?.trim() || caption || "Diagram";

  let visual: ReactNode;
  if (kind === "image") {
    visual = src?.trim() ? (
      <ImageSurface src={src} alt={imageAlt} />
    ) : (
      <UnavailableSurface />
    );
  } else {
    visual = <Diagram chart={chart ?? ""} />;
  }

  return (
    <figure className="overflow-x-auto rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      {caption.trim() ? (
        <figcaption className="mb-3 text-sm font-medium text-slate-600">
          {caption}
        </figcaption>
      ) : null}
      {visual}
      {explanation?.trim() ? (
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          {explanation.trim()}
        </p>
      ) : null}
    </figure>
  );
}
