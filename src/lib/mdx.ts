const MERMAID_FENCE_RE = /```mermaid\r?\n([\s\S]*?)```/g;

/** Replace ```mermaid fences with `<Diagram chart={...} />` before MDXRemote. */
export function prepareMdxSource(source: string): string {
  return source.replace(MERMAID_FENCE_RE, (_match, chart: string) => {
    return `<Diagram chart={${JSON.stringify(chart.trimEnd())}} />`;
  });
}
