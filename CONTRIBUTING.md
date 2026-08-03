# Contributing to SDGallery

Thanks for helping build free, beginner-friendly system design education.

## How it works

Content is MDX in this repository. Open a PR—there is no CMS.

## Content locations

| Kind | Path |
|------|------|
| Company | `content/companies/{slug}.mdx` |
| Pattern | `content/patterns/{slug}.mdx` |
| Case study | `content/case-studies/{slug}.mdx` |
| Contributors | `content/contributors.json` |
| Logos | `public/logos/` |

## Case study headings (required)

Use these exact `##` headings in order:

1. Problem & Requirements
2. High-Level Design (include a Mermaid fence)
3. Key Components
4. Deep Dives (with `###` subsections)
5. Trade-offs
6. Evolution
7. Sources

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

### Pattern frontmatter

```yaml
---
name: Caching
slug: caching
icon: cache
definition: What / why / when in one or two sentences.
relatedPatterns: [cdn]
publishedAt: "2026-08-01"
---
```

Include a Mermaid diagram in the body.

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
---
```

## PR checklist

- [ ] Required frontmatter fields present and valid
- [ ] Case studies and patterns include Mermaid diagrams
- [ ] Sources cite public eng blogs / talks (no insider claims)
- [ ] Beginner-friendly language; jargon explained on first use
- [ ] `npm test` passes locally
