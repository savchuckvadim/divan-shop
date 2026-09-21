---
name: seo-research
description: Competitor SEO research for the sofa shop. Crawls competitor sites and SERPs per locale, writes a dated report and keyword map into research/seo/, and turns findings into draft tasks in tasks/TASKS.md. Run weekly by the scheduler or via /seo-research.
---

# /seo-research

Goal: know what the top competitors do for search and turn the gap into concrete tasks. Output is files, not chat.

## Inputs

- `research/seo/competitors.md` — market, regions, locales, competitor URLs, seed keywords. If the Competitors section is empty, discover 5–8 competitors per primary locale with `WebSearch` on the seed keywords (commercial intent: "купить диван", "угловой диван цена", local modifiers) and write them into the file before continuing.
- Previous reports in `research/seo/` — read the latest one and only add what changed or is new. Do not repeat.
- `CLAUDE.md` — what the site can already do (blocks, collections, SEO pipeline), so tasks fit the architecture.

## Procedure

1. **SERP snapshot** (per primary locale, top 10 seed keywords): `WebSearch`, record which domains rank, what page type ranks (category, product, guide, marketplace), title patterns. Save to `research/seo/serp/YYYY-MM-DD-<locale>.md`.
2. **Competitor audit** (each competitor, use `WebFetch` on home, one category, one product, one guide/blog page if present). Capture:
   - URL structure and locale strategy (subfolder / subdomain / none, hreflang present?)
   - Title / description / H1 patterns and length
   - Category taxonomy (how they slice sofas: by shape, mechanism, material, room, price)
   - Filters and facets exposed as indexable pages
   - Structured data types (Product, Offer, BreadcrumbList, FAQPage, AggregateRating, Organization)
   - Content blocks on category/product pages (FAQ, size guides, care guides, reviews, "how to choose")
   - Internal linking (related products, categories in footer, blog → catalog)
   - Performance hints you can see (image formats, lazy loading) — do not run Lighthouse.
     Save to `research/seo/competitors/<domain>.md` (overwrite; it is a living profile).
3. **Keyword map**: update `research/seo/keywords.md` — table `keyword | locale | intent | our target URL (ROUTES) | competitor ranking | status`. Cluster by category / mechanism / material / room. Mark clusters we have no landing page for.
4. **Gap analysis** → `research/seo/YYYY-MM-DD-report.md`: 5–10 findings, each with evidence (which competitor, which URL), impact (high/medium/low), effort (S/M/L), and the proposed task.
5. **Tasks**: for every finding with impact ≥ medium, append a task to **Queue** in `tasks/TASKS.md` following `tasks/README.md`: `status: draft`, `source: seo-research`, link to the report section, verifiable acceptance (e.g. "category X exists with localized title/description in 4 locales", "FAQ block on catalog page", "sitemap includes …"). Tasks stay `draft` until a human flips them to `ready`.
6. Commit: `docs(seo): research YYYY-MM-DD` and notify:
   ```
   node scripts/telegram-notify.mjs --text "SEO research YYYY-MM-DD: N findings, M draft tasks. См. research/seo/YYYY-MM-DD-report.md"
   ```

## Rules

- Evidence over opinion: every claim about a competitor links to the URL you fetched.
- Respect robots: fetch a handful of pages per site, never crawl exhaustively.
- Keep the report in Russian, keywords in their locale.
- Never create tasks that require buying tools, ads, or link building — only on-site work the runner can do.
