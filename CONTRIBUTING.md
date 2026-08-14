# Contributing to SDGallery

Thanks for helping build free, beginner-friendly system design education.

## How it works

Content is MDX in this repository. Open a PR—there is no CMS.

Copy a starter file from `content/_templates/` into the matching content directory. Templates are not published.

After editing, run `npm run validate` (and `npm test`) locally before you open a PR.

## Content locations

| Kind | Path |
|------|------|
| Company | `content/companies/{slug}.mdx` |
| Pattern | `content/patterns/{slug}.mdx` |
| Case study | `content/case-studies/{slug}.mdx` |
| Starters (not published) | `content/_templates/` |
| Contributors | `content/contributors.json` |
| Logos | `public/logos/` |

## Case study headings (required)

Use these exact `##` headings in order:

1. Problem & Requirements
2. High-Level Design
3. Key Components
4. Deep Dives (with `###` subsections)
5. Trade-offs
6. Evolution
7. Sources

Include at least one Mermaid fence in the body (typically under High-Level Design). Patterns also need a Mermaid fence. The Sources section must include at least one markdown or URL link.

`slug` in frontmatter must match the filename (`{slug}.mdx`). Cross-references (`company`, `patterns`, `relatedPatterns`, `relatedCompanies`, `prerequisites`) must point at real content.

## Templates

### Company frontmatter

```yaml
---
name: Example Co
slug: example
logo: /logos/example.svg
industry: Media
scale: Global
techStack: [CDN, Caching]
summary: One-line summary for directory cards.
popularity: 10
updatedAt: "2026-08-01"
---
```

Companies do not use learning metadata (`difficulty`, `prerequisites`, and so on).

### Pattern frontmatter

```yaml
---
name: Caching
slug: caching
icon: cache
definition: What / why / when in one or two sentences.
relatedPatterns: [cdn]
publishedAt: "2026-08-01"
difficulty: beginner
prerequisites: []
estimatedReadingMinutes: 2
learningObjectives:
  - Explain the idea in plain language
  - Identify when the pattern applies
---
```

`difficulty` is `beginner`, `intermediate`, or `advanced`. `prerequisites` is a list of `{ type: pattern | case-study, slug }` (empty is allowed). `learningObjectives` needs 2–6 concrete outcomes. Include a Mermaid diagram in the body.

### Case study frontmatter

```yaml
---
title: "How Example Serves Users at Scale"
slug: example-at-scale
company: example
patterns: [caching, cdn]
stats:
  users: "100M+"
  rps: "millions"
  dataVolume: "petabytes"
  regions: "50+"
featured: false
publishedAt: "2026-08-01"
updatedAt: "2026-08-01"
relatedCompanies: []
hook: "One-line card hook"
difficulty: intermediate
prerequisites:
  - type: pattern
    slug: caching
estimatedReadingMinutes: 4
learningObjectives:
  - Map the high-level design to the patterns in play
  - Identify the main trade-offs in the write-up
---
```

## PR checklist

- [ ] Required frontmatter fields present and valid (including learning metadata on patterns and case studies)
- [ ] Case studies use the required H2 headings in order
- [ ] Case studies and patterns include Mermaid diagrams
- [ ] Sources cite public eng blogs / talks (no insider claims)
- [ ] Beginner-friendly language; jargon explained on first use
- [ ] `npm run validate` and `npm test` pass locally
