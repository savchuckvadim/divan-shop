# Divan Shop

Sofa store on **Next.js 16 + Payload CMS 3**, four languages (ru / en / es / uk), SEO-first.

## Quick start

```bash
pnpm install
cp apps/web/.env.example apps/web/.env    # adjust secrets
pnpm db:up                                 # PostgreSQL 16 in docker
pnpm dev                                   # http://localhost:3000, admin at /admin
```

On first visit to `/admin` create the first user. Then:

1. **Site Settings** → site name, currency, phone, email.
2. **Categories** → e.g. "Straight sofas", "Corner sofas" (fill titles per locale with the switcher in the top right).
3. **Products** → title, price, gallery, specs, category. Publish.
4. **Pages** → create a page with slug `home`, add a hero and a _Product Archive_ block. Publish.
5. **Header / Footer** → nav links.

## Scripts

| Command             | What it does                                                   |
| ------------------- | -------------------------------------------------------------- |
| `pnpm dev`          | run all apps via turbo                                         |
| `pnpm web dev`      | run only the web app                                           |
| `pnpm web generate` | regenerate Payload types + admin import map after schema edits |
| `pnpm typecheck`    | `tsc --noEmit` in every package                                |
| `pnpm lint`         | eslint in every package                                        |
| `pnpm format`       | prettier                                                       |
| `pnpm build`        | production build                                               |

## Layout

- `apps/web` — the site + CMS. Frontend follows Feature-Sliced Design under `src/modules`, CMS schema under `src/payload`.
- `packages/ui` — design system (`@workspace/ui`): Tailwind 4 tokens and primitives.
- `packages/{eslint,prettier,typescript}-config` — shared tooling.

See [CLAUDE.md](./CLAUDE.md) for architecture rules, the content model, i18n and SEO details.
