# @workspace/ui

Shared design system for the monorepo: Tailwind 4 design tokens (warm furniture-shop palette in
oklch, light + `[data-theme="dark"]`), the `cn` helper and a set of shadcn-style React components.

There is no build step. The `exports` map points straight at `src/`, so consumers import
TypeScript source and their own bundler (Next.js) compiles it.

## Consuming from an app

Add the dependency:

```json
{
  "dependencies": {
    "@workspace/ui": "workspace:*"
  }
}
```

Import the stylesheet once in the app's global CSS, before any app-level `@theme` / `@plugin`
additions:

```css
@import "@workspace/ui/globals.css";

@plugin "@tailwindcss/typography";
```

Set the font CSS variables the tokens expect (`--font-inter`, `--font-playfair`) via `next/font`
on the `<html>` element; `font-sans` / `font-serif` map to them.

Import components per file (preferred) or from the root:

```tsx
import { Heading, Section } from "@workspace/ui";
import { Button } from "@workspace/ui/components/button";
import { Card, CardGrid } from "@workspace/ui/composites/card";
import { cn } from "@workspace/ui/lib/utils";
```

## Layers: composites over primitives

The package has two layers:

- `src/components/*` — shadcn-style primitives (`Card`, `CardHeader`, `CardTitle`, `Input`,
  `Label`, `Select*`, …). Thin, unopinionated, one HTML element or Radix part each.
- `src/composites/*` — the internal syntax the app speaks: `Card`, `Section`, `PageHeader`,
  `Stack`/`Grid`, `FormField`/`FormMessage`, `EmptyState`, `KeyValueList`, `Stat`. Each composite
  assembles primitives into one component with slot props (`title`, `description`, `media`,
  `footer`, `actions`, …). See [src/composites/README.md](./src/composites/README.md).

Rules for app code:

1. Import composites first: `@workspace/ui/composites/card`, `@workspace/ui/composites/section`.
2. Reach for primitives (`@workspace/ui/components/*`) only when no composite fits — e.g. a bare
   `Button`, `Input`, `Badge`, or a one-off `Heading`.
3. Never build shadcn part-trees in app code (`<Card><CardHeader><CardTitle/>…`). If a composite
   lacks a slot you need, extend the composite here instead.
4. The root barrel exports composites under their plain names (`Card`, `Section`); the primitives
   that share a name are exported as `CardPrimitive` / `SectionPrimitive`.
5. Composites never depend on `next` or app code — links are passed in as `ReactNode`
   (`<Button asChild><Link/></Button>`), the same `asChild` pattern shadcn uses.

Use `@workspace/ui/postcss.config` as the app's PostCSS config if it does not need anything
beyond `@tailwindcss/postcss`.

## Notes

- `transpilePackages` is not required: Next.js compiles the imported `.tsx` source directly.
- `globals.css` declares `@source "../components"`, `@source "../composites"` and
  `@source "../shared"` relative to itself, so Tailwind scans this package's components when the
  app imports the stylesheet. The app's own
  files are scanned automatically from the app's CSS entry location; if the app keeps its CSS
  somewhere unusual, add its own `@source` directives after the import.
- Dark mode is driven by `[data-theme="dark"]` on an ancestor (usually `<html>`), not by
  `prefers-color-scheme`.
