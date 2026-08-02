# SDGallery v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the SDGallery nonprofit learning site with all seven product surfaces, Mermaid diagrams, and a thin sample corpus (Netflix, YouTube, Uber, Cloudflare + six patterns).

**Architecture:** Next.js App Router reads MDX from `content/` at build time via gray-matter + filesystem loaders; typed indexes power Home, Directory, Search, and Compare; MDX bodies render on detail pages through `next-mdx-remote/rsc`; Mermaid renders inside a pluggable `Diagram` component.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, gray-matter, next-mdx-remote, mermaid, Vitest (unit tests).

**Spec:** [`docs/superpowers/specs/2026-08-01-sdgallery-design.md`](../specs/2026-08-01-sdgallery-design.md)

## Global Constraints

- Audience copy stays beginner-friendly; cite public sources only (no insider claims).
- No auth, CMS, database, analytics backend, or Excalidraw in v1.
- Case studies live at `/case-studies/[slug]`; companies at `/companies`; patterns at `/patterns` and `/patterns/[slug]`.
- Brand: light cool-gray/slate atmosphere, deep teal accent (`#0F766E`), expressive fonts — **not** Inter/Roboto/Arial/system as brand faces; **not** purple-glow or dark cyber dashboard.
- Cards only for interactive units (directory, featured, search results).
- Diagram API must accept Mermaid now and remain swappable for Excalidraw later.
- Prefer extending the existing scaffold (`package.json` already has `gray-matter`, `next-mdx-remote`); remove leftover default create-next-app marketing UI and any obsolete exhibit naming as you touch those files.
- Ignore and do not commit log artifacts (`*.log`, `build-ok.txt`, `vercel-*.txt`, `.npm-cache/`).

---

## File structure (target)

```
content/
  companies/{netflix,youtube,uber,cloudflare}.mdx
  patterns/{caching,cdn,load-balancing,rate-limiting,queues,sharding}.mdx
  case-studies/{netflix-video-streaming,youtube-video-delivery,uber-ride-matching,cloudflare-edge}.mdx
  contributors.json
src/
  app/
    layout.tsx
    page.tsx                          # Home
    globals.css
    not-found.tsx
    companies/page.tsx
    case-studies/[slug]/page.tsx
    patterns/page.tsx
    patterns/[slug]/page.tsx
    compare/page.tsx
    about/page.tsx
    search/page.tsx
  components/
    layout/SiteHeader.tsx
    layout/SiteFooter.tsx
    search/SearchBox.tsx
    cards/CompanyCard.tsx
    cards/CaseStudyCard.tsx
    cards/PatternPill.tsx
    cards/ResultCard.tsx
    directory/FilterSidebar.tsx
    directory/SortSelect.tsx
    directory/Pagination.tsx
    case-study/StatBar.tsx
    case-study/SectionNav.tsx
    case-study/DeepDiveAccordion.tsx
    case-study/RelatedSidebar.tsx
    case-study/SourcesList.tsx
    diagram/Diagram.tsx
    compare/CompareControls.tsx
    compare/CompareColumns.tsx
    about/ContributeSteps.tsx
    about/ContributorGrid.tsx
    mdx/MdxBody.tsx
  lib/
    types.ts
    content.ts                        # filesystem loaders
    search.ts                         # filter/rank helpers
    sections.ts                       # extract ## / ### from MDX source
    constants.ts                      # nav links, github url, accent tokens
src/__tests__/
  content.test.ts
  search.test.ts
  sections.test.ts
CONTRIBUTING.md
vitest.config.ts
```

Delete or stop using when encountered: `src/components/exhibit/*`, `src/components/gallery/*`, `src/app/exhibits/*`, `src/app/companies/[slug]/*` exhibit routes, nested `content/companies/*/`, and create-next-app default home markup.

---

### Task 1: Foundation — tokens, fonts, chrome, Vitest

**Files:**
- Modify: `package.json`, `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx` (temporary stub), `.gitignore`
- Create: `src/lib/constants.ts`, `src/components/layout/SiteHeader.tsx`, `src/components/layout/SiteFooter.tsx`, `vitest.config.ts`
- Delete when present: default marketing blocks only from `page.tsx`; leave a minimal placeholder home until Task 5

**Interfaces:**
- Produces: `NAV_LINKS`, `GITHUB_REPO_URL`, `SITE_NAME` from `src/lib/constants.ts`
- Produces: `SiteHeader`, `SiteFooter` used by root layout

- [ ] **Step 1: Add Vitest and Mermaid dependencies**

```bash
npm install mermaid
npm install -D vitest @vitejs/plugin-react jsdom
```

Update `package.json` scripts:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 2: Add `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/__tests__/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

- [ ] **Step 3: Create `src/lib/constants.ts`**

```ts
export const SITE_NAME = "SDGallery";
export const SITE_TAGLINE = "System Design Gallery";
export const GITHUB_REPO_URL = "https://github.com/008993368-yaz/SDGallery";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/companies", label: "Companies" },
  { href: "/patterns", label: "Patterns" },
  { href: "/compare", label: "Compare" },
  { href: "/about", label: "About" },
] as const;
```

- [ ] **Step 4: Create `SiteHeader` and `SiteFooter`**

`src/components/layout/SiteHeader.tsx`:

```tsx
import Link from "next/link";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200/80 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4">
        <Link href="/" className="font-display text-xl tracking-tight text-slate-900">
          {SITE_NAME}
        </Link>
        <nav className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-teal-700">
              {link.label}
            </Link>
          ))}
          <Link
            href="/search"
            className="rounded-md bg-teal-700 px-3 py-1.5 text-white hover:bg-teal-800"
          >
            Search
          </Link>
        </nav>
      </div>
    </header>
  );
}
```

`src/components/layout/SiteFooter.tsx`:

```tsx
import Link from "next/link";
import { GITHUB_REPO_URL, SITE_NAME } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-slate-600 sm:flex-row sm:justify-between">
        <p>
          {SITE_NAME} — free, open system design education.
        </p>
        <Link href={GITHUB_REPO_URL} className="text-teal-700 hover:underline">
          View on GitHub
        </Link>
      </div>
    </footer>
  );
}
```

- [ ] **Step 5: Update `globals.css` and `layout.tsx`**

Replace `globals.css` theme with teal accent + subtle atmosphere (no dark-mode default flip for v1 brand):

```css
@import "tailwindcss";

:root {
  --background: #f4f7f8;
  --foreground: #0f172a;
  --accent: #0f766e;
  --panel: #ffffff;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-accent: var(--accent);
  --color-panel: var(--panel);
  --font-sans: var(--font-sans);
  --font-display: var(--font-display);
}

body {
  background:
    radial-gradient(ellipse 80% 50% at 50% -20%, #dbeafe 0%, transparent 55%),
    linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  color: var(--foreground);
  font-family: var(--font-sans), ui-sans-serif, sans-serif;
}

.font-display {
  font-family: var(--font-display), ui-serif, Georgia, serif;
}
```

In `layout.tsx`, use `Source_Serif_4` (display) + `DM_Sans` (UI) from `next/font/google`, wire `SiteHeader`/`SiteFooter`, set metadata title/description to SDGallery.

- [ ] **Step 6: Ensure `.gitignore` ignores logs and caches**

Add if missing:

```
*.log
build-ok.txt
vercel-*.txt
.npm-cache/
```

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vitest.config.ts src/lib/constants.ts src/components/layout src/app/layout.tsx src/app/globals.css .gitignore
git commit -m "chore: foundation layout, fonts, and vitest"
```

---

### Task 2: Types, section parser, content loaders (TDD)

**Files:**
- Create: `src/lib/types.ts`, `src/lib/sections.ts`, `src/lib/content.ts`, `src/lib/search.ts`
- Create: `src/__tests__/sections.test.ts`, `src/__tests__/search.test.ts`, `src/__tests__/content.test.ts`
- Create fixture MDX under `content/` as needed for loader tests (minimal), replaced by full corpus in Task 3

**Interfaces:**
- Produces types: `Company`, `Pattern`, `CaseStudy`, `SearchHit`, `ContentSection`
- Produces: `extractSections(markdown: string): ContentSection[]`
- Produces: `getCompanies()`, `getCompany(slug)`, `getPatterns()`, `getPattern(slug)`, `getCaseStudies()`, `getCaseStudy(slug)`, `getFeaturedCaseStudies()`, `getRecentCaseStudies(limit)`, `getCaseStudiesByPattern(patternSlug)`, `getPrimaryCaseStudyForCompany(companySlug)`, `getSearchIndex()`
- Produces: `filterSearchIndex(index, { q, types?, industry? }): SearchHit[]`

- [ ] **Step 1: Write failing section parser tests**

`src/__tests__/sections.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { extractSections } from "@/lib/sections";

describe("extractSections", () => {
  it("extracts h2 and nested h3 under Deep Dives", () => {
    const md = `## Problem & Requirements
Need X.

## Deep Dives
### Caching
Redis.

### CDN
Edge.
`;
    const sections = extractSections(md);
    expect(sections.map((s) => s.title)).toEqual([
      "Problem & Requirements",
      "Deep Dives",
      "Caching",
      "CDN",
    ]);
    const deep = sections.find((s) => s.title === "Deep Dives");
    expect(deep?.children?.map((c) => c.title)).toEqual(["Caching", "CDN"]);
  });

  it("slugifies ids stably", () => {
    const [section] = extractSections("## High-Level Design\nHi");
    expect(section.id).toBe("high-level-design");
  });
});
```

- [ ] **Step 2: Run test — expect fail**

```bash
npm test -- src/__tests__/sections.test.ts
```

Expected: FAIL (module not found or function missing).

- [ ] **Step 3: Implement `src/lib/types.ts` and `src/lib/sections.ts`**

```ts
// src/lib/types.ts
export type Company = {
  name: string;
  slug: string;
  logo: string;
  industry: string;
  scale: string;
  techStack: string[];
  summary: string;
  popularity: number;
  updatedAt: string;
  body: string;
};

export type Pattern = {
  name: string;
  slug: string;
  icon: string;
  definition: string;
  relatedPatterns: string[];
  publishedAt: string;
  body: string;
};

export type CaseStudyStats = {
  users: string;
  rps: string;
  dataVolume: string;
  regions: string;
};

export type CaseStudy = {
  title: string;
  slug: string;
  company: string;
  patterns: string[];
  stats: CaseStudyStats;
  featured: boolean;
  publishedAt: string;
  updatedAt: string;
  relatedCompanies: string[];
  hook: string;
  body: string;
};

export type SearchHitType = "company" | "pattern" | "case-study";

export type SearchHit = {
  type: SearchHitType;
  slug: string;
  title: string;
  industry?: string;
  snippet: string;
  href: string;
};

export type ContentSection = {
  id: string;
  title: string;
  content: string;
  children?: ContentSection[];
};
```

```ts
// src/lib/sections.ts
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
```

- [ ] **Step 4: Re-run section tests — expect pass**

```bash
npm test -- src/__tests__/sections.test.ts
```

- [ ] **Step 5: Write search helper tests + implement `src/lib/search.ts`**

```ts
// src/__tests__/search.test.ts
import { describe, expect, it } from "vitest";
import { filterSearchIndex } from "@/lib/search";
import type { SearchHit } from "@/lib/types";

const index: SearchHit[] = [
  {
    type: "pattern",
    slug: "caching",
    title: "Caching",
    snippet: "Store hot data closer to users",
    href: "/patterns/caching",
  },
  {
    type: "company",
    slug: "netflix",
    title: "Netflix",
    industry: "Media",
    snippet: "Streaming at global scale",
    href: "/companies",
  },
  {
    type: "case-study",
    slug: "netflix-video-streaming",
    title: "How Netflix Streams to 200M+ Users",
    industry: "Media",
    snippet: "CDN and caching for video delivery",
    href: "/case-studies/netflix-video-streaming",
  },
];

describe("filterSearchIndex", () => {
  it("matches query in title and snippet case-insensitively", () => {
    const hits = filterSearchIndex(index, { q: "caching" });
    expect(hits.map((h) => h.slug)).toEqual(["caching", "netflix-video-streaming"]);
  });

  it("filters by type and industry", () => {
    const hits = filterSearchIndex(index, {
      q: "",
      types: ["company"],
      industry: "Media",
    });
    expect(hits).toHaveLength(1);
    expect(hits[0].slug).toBe("netflix");
  });

  it("returns empty array when nothing matches", () => {
    expect(filterSearchIndex(index, { q: "zzzz" })).toEqual([]);
  });
});
```

```ts
// src/lib/search.ts
import type { SearchHit, SearchHitType } from "./types";

export function filterSearchIndex(
  index: SearchHit[],
  opts: { q: string; types?: SearchHitType[]; industry?: string },
): SearchHit[] {
  const q = opts.q.trim().toLowerCase();
  return index.filter((hit) => {
    if (opts.types?.length && !opts.types.includes(hit.type)) return false;
    if (opts.industry && hit.industry !== opts.industry) return false;
    if (!q) return true;
    const hay = `${hit.title} ${hit.snippet}`.toLowerCase();
    return hay.includes(q);
  });
}

export function highlightSnippet(snippet: string, q: string): string {
  const query = q.trim();
  if (!query) return snippet;
  const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig");
  return snippet.replace(re, "<mark>$1</mark>");
}
```

- [ ] **Step 6: Implement `src/lib/content.ts` loaders**

Use `fs`, `path`, `gray-matter`. Content roots:

- `content/companies/*.mdx`
- `content/patterns/*.mdx`
- `content/case-studies/*.mdx`

Parse frontmatter into typed objects; attach `body: matter.content`. Sort helpers as needed (`popularity`, `publishedAt`, `updatedAt`).

`getSearchIndex()` flattens:

- company → type `company`, href `/companies` (or future `/companies#slug`; for v1 use `/companies` and rely on directory filter via `?q=` later — prefer href `/case-studies/{primary}` when a primary study exists, else `/companies`)
- pattern → `/patterns/{slug}`
- case study → `/case-studies/{slug}`, industry from linked company

Also export `getContributors()` reading `content/contributors.json`.

- [ ] **Step 7: Write `src/__tests__/content.test.ts` against Task 3 corpus**

After Task 3 content exists, assert:

```ts
import { describe, expect, it } from "vitest";
import {
  getCaseStudy,
  getCompanies,
  getPatterns,
  getPrimaryCaseStudyForCompany,
  getSearchIndex,
} from "@/lib/content";

describe("content loaders", () => {
  it("loads four companies and six patterns", () => {
    expect(getCompanies()).toHaveLength(4);
    expect(getPatterns()).toHaveLength(6);
  });

  it("resolves netflix primary case study", () => {
    const study = getPrimaryCaseStudyForCompany("netflix");
    expect(study?.slug).toBe("netflix-video-streaming");
  });

  it("builds a non-empty search index", () => {
    expect(getSearchIndex().length).toBeGreaterThan(8);
  });

  it("loads case study body with required headings", () => {
    const study = getCaseStudy("netflix-video-streaming");
    expect(study?.body).toContain("## Problem & Requirements");
    expect(study?.body).toContain("## Key Components");
  });
});
```

If this task is implemented before full corpus, create the Netflix files first so tests pass, then expand in Task 3.

- [ ] **Step 8: Run all unit tests**

```bash
npm test
```

Expected: PASS

- [ ] **Step 9: Commit**

```bash
git add src/lib src/__tests__ vitest.config.ts
git commit -m "feat: content types, section parser, and loaders"
```

---

### Task 3: Sample MDX corpus + contributors

**Files:**
- Create all files under `content/companies/`, `content/patterns/`, `content/case-studies/`, `content/contributors.json`
- Create: `public/logos/{netflix,youtube,uber,cloudflare}.svg` (simple monogram SVGs OK for v1)

**Interfaces:**
- Consumes: frontmatter shapes from Task 2
- Produces: corpus A ready for all pages

Each **company** MDX frontmatter must include: `name`, `slug`, `logo`, `industry`, `scale`, `techStack`, `summary`, `popularity`, `updatedAt`. Body can be a short about paragraph.

Each **pattern** MDX must include: `name`, `slug`, `icon`, `definition`, `relatedPatterns`, `publishedAt`, plus a `mermaid` fence in the body (what/why/when prose).

Each **case study** MDX must include required frontmatter and these exact `##` headings in order:

1. Problem & Requirements  
2. High-Level Design (include one `mermaid` fence)  
3. Key Components  
4. Deep Dives (with `###` subsections e.g. Caching, CDN)  
5. Trade-offs  
6. Evolution  
7. Sources  

Slugs:

| Kind | Slugs |
|------|-------|
| Companies | `netflix`, `youtube`, `uber`, `cloudflare` |
| Patterns | `caching`, `cdn`, `load-balancing`, `rate-limiting`, `queues`, `sharding` |
| Case studies | `netflix-video-streaming`, `youtube-video-delivery`, `uber-ride-matching`, `cloudflare-edge` |

Wire `patterns` arrays and `relatedCompanies` so Netflix/YouTube share video patterns; Uber emphasizes queues/sharding; Cloudflare emphasizes CDN/rate-limiting.

`content/contributors.json`:

```json
[
  {
    "name": "SDGallery Maintainers",
    "avatar": "/logos/netflix.svg",
    "github": "https://github.com/008993368-yaz/SDGallery"
  }
]
```

- [ ] **Step 1: Add logo SVGs and all MDX files** (full beginner-friendly prose, cited sources in Sources sections — eng blogs only).

Example case study frontmatter (Netflix):

```yaml
---
title: "How Netflix Streams to 200M+ Users"
slug: netflix-video-streaming
company: netflix
patterns: [caching, cdn, load-balancing, queues]
stats:
  users: "200M+"
  rps: "millions"
  dataVolume: "petabytes"
  regions: "190+"
featured: true
publishedAt: "2026-07-01"
updatedAt: "2026-08-01"
relatedCompanies: [youtube, cloudflare]
hook: "Open Connect, encoding, and caching at internet scale"
---
```

- [ ] **Step 2: Run content tests**

```bash
npm test -- src/__tests__/content.test.ts
```

Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add content public/logos
git commit -m "content: add v1 companies, patterns, and case studies"
```

---

### Task 4: Diagram + MDX body components

**Files:**
- Create: `src/components/diagram/Diagram.tsx`, `src/components/mdx/MdxBody.tsx`
- Create: `src/components/case-study/DeepDiveAccordion.tsx`
- Delete obsolete: `src/components/exhibit/ExhibitBody.tsx` (replace usages)

**Interfaces:**
- Produces: `Diagram({ chart, title? })` — client component; on Mermaid failure shows placeholder panel
- Produces: `MdxBody({ source })` — RSC wrapper around `MDXRemote` with heading components that set `id={slugifyHeading(...)}`
- Future-facing: `Diagram` props type allows `kind?: "mermaid" | "excalidraw"` defaulting to `"mermaid"` (excalidraw branch renders “Coming in v2” placeholder)

- [ ] **Step 1: Implement `Diagram.tsx` (client)**

```tsx
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
        mermaid.initialize({ startOnLoad: false, securityLevel: "loose", theme: "neutral" });
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

  if (error || !chart.trim()) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
        Diagram unavailable. The rest of this page still works.
      </div>
    );
  }

  return (
    <figure className="overflow-x-auto rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      {title ? <figcaption className="mb-3 text-sm font-medium text-slate-600">{title}</figcaption> : null}
      {svg ? (
        <div dangerouslySetInnerHTML={{ __html: svg }} />
      ) : (
        <p className="text-sm text-slate-400">Rendering diagram…</p>
      )}
    </figure>
  );
}
```

- [ ] **Step 2: Implement `MdxBody` mapping fenced mermaid via remark/rehype OR pre-process:** for v1 simplicity, parse ` ```mermaid ` blocks in `MdxBody` parent pages using `extractSections` / custom split — **preferred:** pass `components={{ mermaid: ... }}` is not standard; instead add a small preprocessor in `src/lib/mdx.ts` that replaces mermaid fences with `<Diagram chart={...} />` MDX JSX before `MDXRemote`, and register `Diagram` in components.

- [ ] **Step 3: Implement `DeepDiveAccordion`** taking `ContentSection[]` children of Deep Dives; each item is `<details>`/`<summary>` with markdown rendered simply (paragraphs) or nested `MdxBody` for that slice.

- [ ] **Step 4: Manual check** — temporarily render `<Diagram chart={"graph TD; A-->B"} />` on home; run `npm run dev`, confirm SVG appears; remove temp usage.

- [ ] **Step 5: Commit**

```bash
git add src/components/diagram src/components/mdx src/components/case-study/DeepDiveAccordion.tsx src/lib/mdx.ts
git commit -m "feat: Mermaid Diagram and MDX body renderer"
```

---

### Task 5: Home page

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/components/search/SearchBox.tsx`, `src/components/cards/CaseStudyCard.tsx`, `src/components/cards/PatternPill.tsx`

**Interfaces:**
- Consumes: `getFeaturedCaseStudies`, `getRecentCaseStudies`, `getPatterns`
- Produces: Home matching spec §5.1

- [ ] **Step 1: Implement `SearchBox`**

Client or server form: `method="get"` `action="/search"` with input `name="q"` placeholder `Search a company or pattern`.

- [ ] **Step 2: Implement cards/pills**

`CaseStudyCard`: logo, company name (resolve via `getCompany`), hook, one scale stat.  
`PatternPill`: link to `/patterns/[slug]`.

- [ ] **Step 3: Build Home**

Hero headline exactly: `Learn how the world's best engineering teams build at scale`.  
Subhead one sentence for beginners.  
Featured row (featured flag).  
Browse by Pattern pills.  
Recently Added horizontal scroll (`overflow-x-auto`).

- [ ] **Step 4: Verify**

```bash
npm run dev
```

Open `/` — hero, 3–4 featured cards, 6 pills, recent strip.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx src/components/search src/components/cards
git commit -m "feat: home page with featured studies and patterns"
```

---

### Task 6: Pattern index + pattern detail

**Files:**
- Create: `src/app/patterns/page.tsx`, `src/app/patterns/[slug]/page.tsx`
- Create: related UI pieces as needed (`RelatedSidebar` can be shared)

**Interfaces:**
- Consumes: `getPatterns`, `getPattern`, `getCaseStudiesByPattern`, `getCompany`

- [ ] **Step 1: Pattern index** — grid of pattern names/icons/definitions linking to detail.

- [ ] **Step 2: Pattern detail** — header (name, icon, definition), `Diagram` from first mermaid in body or dedicated frontmatter later; “Companies Using This Pattern” cards linking to `/case-studies/{slug}#...`; related patterns; further reading from Sources-like list in body.

- [ ] **Step 3: `generateStaticParams`** for all pattern slugs; soft handling via `notFound()` for unknown.

- [ ] **Step 4: Verify `/patterns` and `/patterns/rate-limiting`.

- [ ] **Step 5: Commit**

```bash
git add src/app/patterns src/components
git commit -m "feat: pattern index and pattern detail pages"
```

---

### Task 7: Case study page

**Files:**
- Create: `src/app/case-studies/[slug]/page.tsx`
- Create: `src/components/case-study/StatBar.tsx`, `SectionNav.tsx`, `RelatedSidebar.tsx`, `SourcesList.tsx`

**Interfaces:**
- Consumes: `getCaseStudy`, `extractSections`, `getCompany`, `getPattern`, company/pattern related lookups

Layout:

```
[Header + StatBar]
[Diagram from High-Level Design mermaid]
[Left SectionNav | Main sections | Right RelatedSidebar]
[SourcesList]
```

- SectionNav sticky; links `#problem-requirements`, `#high-level-design`, `#key-components`, `#deep-dives`, `#trade-offs`, `#evolution`, `#sources` (ids from `slugifyHeading`).
- Deep Dives render via `DeepDiveAccordion`.
- Unknown slug → `notFound()`.

- [ ] **Step 1: Implement StatBar, SectionNav, RelatedSidebar, SourcesList**

- [ ] **Step 2: Assemble case study page with `generateStaticParams`**

- [ ] **Step 3: Verify** `/case-studies/netflix-video-streaming` — jump nav works, accordions open, related links resolve.

- [ ] **Step 4: Commit**

```bash
git add src/app/case-studies src/components/case-study
git commit -m "feat: case study learning page"
```

---

### Task 8: Company directory

**Files:**
- Create: `src/app/companies/page.tsx`
- Create: `src/components/cards/CompanyCard.tsx`, `src/components/directory/FilterSidebar.tsx`, `SortSelect.tsx`, `Pagination.tsx`
- Create: `src/components/directory/CompanyDirectory.tsx` (client wrapper for filter/sort/page state)

**Interfaces:**
- Consumes: `getCompanies`, `getCaseStudies` (for counts)
- Client state: industry, scale, techStack filters; sort mode; page number (page size 6)

- [ ] **Step 1: Write a small unit test for pure sort/filter helpers** in `src/lib/directory.ts`:

```ts
export type CompanySort = "alpha" | "popular" | "updated";

export function sortCompanies<T extends { name: string; popularity: number; updatedAt: string }>(
  items: T[],
  sort: CompanySort,
): T[] {
  const copy = [...items];
  if (sort === "alpha") return copy.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === "popular") return copy.sort((a, b) => b.popularity - a.popularity);
  return copy.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
```

- [ ] **Step 2: Build directory UI** — title “Explore Companies”, subtitle, sidebar filters, sort dropdown, responsive grid, pagination.

- [ ] **Step 3: Company cards link to primary case study via `getPrimaryCaseStudyForCompany`.**

- [ ] **Step 4: Verify filters/sort/pagination on `/companies`.**

- [ ] **Step 5: Commit**

```bash
git add src/app/companies src/components/directory src/components/cards/CompanyCard.tsx src/lib/directory.ts src/__tests__
git commit -m "feat: company directory with filters and sort"
```

---

### Task 9: Search page

**Files:**
- Create: `src/app/search/page.tsx`, `src/components/cards/ResultCard.tsx`, `src/components/search/SearchResults.tsx`

**Interfaces:**
- Consumes: `getSearchIndex`, `filterSearchIndex`, `highlightSnippet`
- Reads `searchParams`: `q`, `type`, `industry`

- [ ] **Step 1: Server page loads index; client or server filters from query string.**

Prefer server component:

```tsx
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; industry?: string }>;
}) {
  const params = await searchParams;
  // filter + render
}
```

- [ ] **Step 2: Result cards with category label; snippet uses `dangerouslySetInnerHTML` only after `highlightSnippet` escaping of regex; keep snippet text plain except `<mark>`.**

- [ ] **Step 3: Empty state** — “No results for …” + link to clear filters (`/search`).

- [ ] **Step 4: Verify** `/search?q=caching` returns pattern + case study hits.

- [ ] **Step 5: Commit**

```bash
git add src/app/search src/components/search src/components/cards/ResultCard.tsx
git commit -m "feat: search results with filters and empty state"
```

---

### Task 10: Compare page

**Files:**
- Create: `src/app/compare/page.tsx`, `src/components/compare/CompareControls.tsx`, `CompareColumns.tsx`
- Extend: `src/lib/sections.ts` usage to pull compare section titles

**Interfaces:**
- Compare section titles (exact): `Problem & Requirements`, `High-Level Design`, `Key Components`, `Trade-offs`
- Controls: two company selects + Compare button (disabled until both selected and distinct)
- If company has no case study: inline message

- [ ] **Step 1: Implement controls (client)** writing to URL `?a=netflix&b=youtube` on Compare click.

- [ ] **Step 2: Server reads `a`/`b`, loads primary case studies, `extractSections`, picks the four sections, renders `CompareColumns` two-column synced rows with vertical divider; mobile stacks.

- [ ] **Step 3: Default example framing heading when `a=netflix&b=youtube`: “Netflix vs YouTube: Video Delivery” (generic `{A} vs {B}` otherwise).

- [ ] **Step 4: Verify** `/compare?a=netflix&b=youtube`.

- [ ] **Step 5: Commit**

```bash
git add src/app/compare src/components/compare
git commit -m "feat: side-by-side company compare"
```

---

### Task 11: About / Contribute + CONTRIBUTING.md

**Files:**
- Create: `src/app/about/page.tsx`, `src/components/about/ContributeSteps.tsx`, `ContributorGrid.tsx`
- Create: `CONTRIBUTING.md`
- Modify: `README.md` to describe SDGallery (replace create-next-app boilerplate)

**Interfaces:**
- Consumes: `getContributors`, `GITHUB_REPO_URL`

- [ ] **Step 1: About page** — mission hero exactly: `Free, open, community-built system design education`; sourcing section (text + logo row); contribute steps; GitHub button; contributor grid.

- [ ] **Step 2: Write `CONTRIBUTING.md`** with MDX templates for company/pattern/case study, required headings list, PR checklist (frontmatter, Mermaid, sources).

- [ ] **Step 3: Update README with purpose, local dev, content folder map, link to design spec + CONTRIBUTING.

- [ ] **Step 4: Verify `/about`.**

- [ ] **Step 5: Commit**

```bash
git add src/app/about src/components/about CONTRIBUTING.md README.md
git commit -m "feat: about page and contributor docs"
```

---

### Task 12: Soft 404, polish, smoke build

**Files:**
- Create/Modify: `src/app/not-found.tsx`
- Remove dead exhibit/gallery routes and empty nested content dirs if still present
- Ensure production build passes

- [ ] **Step 1: `not-found.tsx`** — friendly message + links to `/companies` and `/patterns`.

- [ ] **Step 2: Run tests and build**

```bash
npm test
npm run lint
npm run build
```

Expected: tests pass; build succeeds; routes listed for home, companies, patterns, case-studies, compare, about, search.

- [ ] **Step 3: Manual smoke checklist**

- `/` hero + search + featured + pills + recent  
- `/companies` filter/sort  
- `/case-studies/netflix-video-streaming` nav + accordion + diagram  
- `/patterns/rate-limiting` companies grid  
- `/compare?a=netflix&b=youtube`  
- `/search?q=caching` and `/search?q=zzzz` empty state  
- `/about` GitHub CTA  
- `/case-studies/does-not-exist` → soft 404  

- [ ] **Step 4: Commit**

```bash
git add src/app/not-found.tsx src
git commit -m "fix: soft 404 and production build polish"
```

---

## Spec coverage checklist

| Spec requirement | Task |
|------------------|------|
| Home | 5 |
| Companies directory | 8 |
| Case study page | 7 |
| Pattern pages | 6 |
| Compare | 10 |
| About / Contribute | 11 |
| Search | 9 |
| Corpus A | 3 |
| Mermaid Diagram + Excalidraw-ready API | 4 |
| Loaders / search index | 2 |
| Visual tokens / chrome | 1 |
| Edge cases / 404 / empty search | 9, 10, 12 |
| CONTRIBUTING + GitHub CTA | 11 |
| Unit tests loaders/search | 2, 8 |
| Smoke / build | 12 |

---

## Self-review notes (author)

- No TBD left for compare section mapping: fixed four heading titles.
- Content path is flat `content/companies/{slug}.mdx` per spec (not nested exhibit folders).
- Existing scaffold deps (`gray-matter`, `next-mdx-remote`) reused; Mermaid + Vitest added in Task 1.
- Section parser matches `###` before `##` so deep-dive subsections nest correctly under Deep Dives.
