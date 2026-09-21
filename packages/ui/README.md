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

Import components either from the root or per file:

```tsx
import { Button, Heading } from "@workspace/ui";
import { Card } from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";
```

Use `@workspace/ui/postcss.config` as the app's PostCSS config if it does not need anything
beyond `@tailwindcss/postcss`.

## Notes

- `transpilePackages` is not required: Next.js compiles the imported `.tsx` source directly.
- `globals.css` declares `@source "../components"` and `@source "../shared"` relative to itself,
  so Tailwind scans this package's components when the app imports the stylesheet. The app's own
  files are scanned automatically from the app's CSS entry location; if the app keeps its CSS
  somewhere unusual, add its own `@source` directives after the import.
- Dark mode is driven by `[data-theme="dark"]` on an ancestor (usually `<html>`), not by
  `prefers-color-scheme`.
