# Composites

One file per composite, one named export per component, built only from `../components/*`
primitives and design tokens. Every composite spreads the rest of its props onto its root element,
accepts `className` (merged with `cn()`), and sets `data-slot` attributes for styling hooks.

Import per file: `import { Card } from "@workspace/ui/composites/card"`.

| Composite      | When to use                                                              | Props                                                                                                                                                      |
| -------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Card`         | Any boxed item: product tile, info card, summary panel.                  | `title? description? eyebrow? media? (above header) actions? (header right) footer? padding="none\|sm\|md" interactive?` — `children` is the content slot. |
| `CardGrid`     | A responsive grid of `Card`s.                                            | `cols=2\|3\|4 gap="sm\|md\|lg" as="div\|ul\|ol"`                                                                                                           |
| `Section`      | A page band with an optional heading row; wraps the primitive `Section`. | `title? description? actions? as="h1\|h2\|h3" (default h2) padding="sm\|md\|lg" contained? (default true, wraps in Container) contentClassName?`           |
| `PageHeader`   | The one `h1` block at the top of a page (catalog, hero fallback).        | `title description? actions? (right) eyebrow?` — `children` render under the description (e.g. a hero CTA).                                                |
| `Stack`        | Flex row/column with spacing; replaces ad-hoc `flex gap-*` wrappers.     | `direction="row\|column" gap="none\|xs\|sm\|md\|lg\|xl" align justify wrap as`                                                                             |
| `Grid`         | Generic responsive grid for non-card content.                            | `cols=1\|2\|3\|4 gap as`                                                                                                                                   |
| `FormField`    | Label + control + hint/error for one input.                              | `label htmlFor hint? error? required? requiredLabel? (sr-only text) inline? (checkbox layout: control before label)`                                       |
| `FormMessage`  | A standalone message: submit error, success banner, note.                | `variant="error\|success\|info"` — `error` sets `role="alert"`.                                                                                            |
| `EmptyState`   | Nothing to show: empty list, 404, no results.                            | `title description? icon? action? as="h1\|h2\|h3"`                                                                                                         |
| `KeyValueList` | Label/value rows (`dl`): product specs, order summary.                   | `items=[{ label, value, key? }]` — returns `null` for an empty list.                                                                                       |
| `Stat`         | One KPI number with a caption.                                           | `label value hint?`                                                                                                                                        |

Links: composites never import `next/link`. Pass a link as a node — `media={<Link/>}`,
`title={<Link/>}`, `action={<Button asChild><Link/></Button>}`.

Adding a composite: create `src/composites/<name>.tsx`, re-export it from `src/index.ts` (alias a
primitive if the names clash), add a row here.
