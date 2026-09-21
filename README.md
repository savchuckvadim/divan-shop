# Divan Shop

Sofa store on **Next.js 16 + Payload CMS 3**, four languages (ru / en / es / uk), SEO-first.

## Quick start

```bash
pnpm install
cp apps/web/.env.example apps/web/.env    # adjust secrets
pnpm db:up                                 # PostgreSQL 16 in docker
pnpm dev                                   # http://localhost:3000, admin at /admin
```

On first visit to `/admin` create the first user. Then seed the starter content:

```bash
pnpm web seed    # site settings, 9 categories, home/about/contacts pages, contact form, 2 articles — in all 4 locales
```

The seed is idempotent: it skips anything that already exists (by slug / form title) and logs what it created. After that:

1. **Products** → title, price, gallery, specs, category. Publish.
2. **Site Settings** → replace the placeholder phone, email and address.
3. **Pages / Articles** → edit the seeded texts, add media.

## Scripts

| Command             | What it does                                                   |
| ------------------- | -------------------------------------------------------------- |
| `pnpm dev`          | run all apps via turbo                                         |
| `pnpm web dev`      | run only the web app                                           |
| `pnpm web generate` | regenerate Payload types + admin import map after schema edits |
| `pnpm web seed`     | create starter content in the CMS (idempotent)                 |
| `pnpm typecheck`    | `tsc --noEmit` in every package                                |
| `pnpm lint`         | eslint in every package                                        |
| `pnpm format`       | prettier                                                       |
| `pnpm build`        | production build                                               |

## Layout

- `apps/web` — the site + CMS. Frontend follows Feature-Sliced Design under `src/modules`, CMS schema under `src/payload`.
- `packages/ui` — design system (`@workspace/ui`): Tailwind 4 tokens and primitives.
- `packages/{eslint,prettier,typescript}-config` — shared tooling.

See [CLAUDE.md](./CLAUDE.md) for architecture rules, the content model, i18n and SEO details.
