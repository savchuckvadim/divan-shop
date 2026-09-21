# Divan Shop

Multilingual sofa e-commerce site. Next.js 16 (App Router) + Payload CMS 3 in one app, pnpm + Turborepo monorepo, FSD on the frontend, separate design-system package.

## Repository structure

```
apps/
  web/                    Next 16 + Payload 3 (site on /, admin on /admin, REST on /api)
    src/
      app/(frontend)/[locale]/   thin route files: read params, call a page from modules/pages
      app/(frontend)/sitemap.ts, robots.ts, next/preview
      app/(payload)/             generated admin routes, do not edit
      payload.config.ts          Payload entry (stays here: importMap + @payload-config alias)
      payload/                   CMS layer: collections, globals, blocks (configs), fields, access, hooks, plugins
      modules/                   FSD layers, each with an index.ts public API
        shared/   config (locales, routes, site), i18n (typed dictionaries), api (Payload Local API helpers),
                  lib, seo (metadata, hreflang, JSON-LD), ui (Media, RichText, CmsLink, AdminBar…)
        entities/ product, category, page, site-settings   (api + ui + lib + type)
        features/ locale-switcher, cms-form
        widgets/  header, footer, hero, page-blocks (block React components), product-grid, breadcrumbs
        pages/    cms-page, catalog-page, product-page, not-found-page (+ generate*Metadata)
      proxy.ts                   locale routing (Next 16 name for middleware)
packages/
  ui/                 @workspace/ui — design system: tokens (globals.css), shadcn-style primitives, cn()
  eslint-config/      @workspace/eslint-config (./base, ./next-js)
  prettier-config/    @workspace/prettier-config
  typescript-config/  @workspace/typescript-config (base, nextjs, react-library)
docker-compose.yml    PostgreSQL 16 for local dev
```

Import direction (FSD): `app → pages → widgets → features → entities → shared`. `payload/` may import from `modules/shared` only. Never import up the chain.

## Commands

```bash
pnpm db:up                      # postgres in docker
pnpm dev                        # turbo dev (web on :3000)
pnpm web dev                    # only the web app
pnpm web generate               # regenerate payload-types.ts + admin importMap (after changing payload/)
pnpm typecheck && pnpm lint     # gate before commit
pnpm format                     # prettier (4 spaces, double quotes, semi, width 100, sorted imports)
```

Env: copy `apps/web/.env.example` to `apps/web/.env`.

## Content model

- Collections: `products` (localized title/description/color, price, oldPrice, availability, gallery, specs, category, featured, SEO tab, drafts), `categories` (localized title/description, order, SEO), `pages` (hero + block layout, SEO tab, drafts, live preview), `media`, `users`.
- Globals: `header`, `footer` (nav links), `site-settings` (site name, currency, contacts, socials, OG image).
- Blocks in page layout: `content`, `cta`, `mediaBlock`, `productArchive`, `formBlock` (form-builder plugin). Block config lives in `src/payload/blocks/*`, React component in `modules/widgets/page-blocks/ui/*`. Add both when adding a block and register in `render-blocks.tsx`.
- Plugins: seo, redirects, form-builder.

## i18n

- Locales: `ru` (default), `en`, `es`, `uk` — single source of truth `modules/shared/config/locales.ts`. Payload localization reads the same tuple.
- CMS content: Payload `localized: true` fields, admin has a locale switcher. Slugs are NOT localized (one URL per doc per locale).
- UI strings: typed constants in `modules/shared/i18n/dictionaries/*.ts`, each `Record<Locale, XDictionary>`. Adding a key = TS error until every locale has it. Server components call `getDictionary(locale)`; client components use `useI18n()`.
- Routing: every URL is prefixed `/{locale}/…`; `proxy.ts` redirects bare paths using cookie → Accept-Language → default. Routes are built only through `ROUTES.*` from `modules/shared/config/routes.ts`.

## SEO

- `generateMeta()` in `modules/shared/seo` builds title/description/canonical/hreflang (`alternates.languages` + `x-default`) and OpenGraph for every page.
- JSON-LD: Organization (layout), BreadcrumbList (catalog/product), Product (product page).
- `app/(frontend)/sitemap.ts` and `robots.ts` are generated from Payload data with per-locale alternates.
- Pages/products/categories are statically generated (`generateStaticParams`) and revalidated by Payload hooks on publish (`payload/hooks/revalidate.ts`).

## Conventions

- TypeScript strict; no `any` without a reason; `// @ts-expect-error <reason>` instead of `@ts-ignore`.
- Named exports only. Files kebab-case. Suffixes: `*.api.ts`, `*.type.ts`.
- Import via `@workspace/ui/components/<name>` and `@/modules/<layer>`; never relative paths across layers.
- Design tokens only from `@workspace/ui/globals.css`; no hard-coded colors in the app.
- Data on the server via Payload Local API (`getPayloadClient()`), always passing `locale` and `fallbackLocale`. No client-side fetching for catalog pages.
- No comments unless the WHY is non-obvious.

## Task workflow & automation

- Queue: `tasks/TASKS.md` (format in `tasks/README.md`). Add tasks from chat with `/task-add`.
- Daily runner: `scripts/daily-agent.ps1` → `claude -p "/task-run"` (skill in `.claude/skills/task-run`). One `ready` task per run, branch `task/T-NNN-slug`, gates, ff-merge to `main`, report in `tasks/reports/`, Telegram via `scripts/telegram-notify.mjs`.
- Weekly SEO research: `/seo-research` (skill in `.claude/skills/seo-research`) writes `research/seo/*` and appends `draft` tasks to the queue; a human flips them to `ready`.
- Scheduling: `scripts/install-schedule.ps1` registers both Windows Scheduled Tasks. Secrets in `.env.automation` (git-ignored, see `.env.automation.example`).
- Headless permissions are the allowlist in `.claude/settings.json`; do not widen it from an autonomous run.

## Do NOT

- Edit `src/app/(payload)/**` or `src/payload-types.ts` by hand — run `pnpm web generate`.
- Put UI strings inline in components — add them to a dictionary.
- Build hrefs by string concatenation — use `ROUTES` / `hrefForDoc`.
- Add `next-intl` or another i18n lib; the typed-dictionary approach is intentional.
