# Design system: `packages/ui` (`@workspace/ui`)

## Implemented (проверено по коду 2026-09-21)

- Пакет без сборки: `exports` указывают на `src/` (`.` → `src/index.ts`, `./globals.css`, `./postcss.config`, `./lib/*`, `./components/*`, `./hooks/*`); Next компилирует `.tsx` напрямую, `transpilePackages` не нужен (`packages/ui/README.md`).
- Токены `src/styles/globals.css`: Tailwind 4 (`@import "tailwindcss"`, `tw-animate-css`), `@custom-variant dark` по `[data-theme="dark"]` на предке (не `prefers-color-scheme`), брейкпоинты `sm 40rem / md 48rem / lg 64rem / xl 80rem`, шрифты `--font-sans` ← `--font-inter`, `--font-serif` ← `--font-playfair` (переменные задаёт приложение через `next/font`). Тёплая мебельная палитра в oklch: `background`, `foreground`, `card`, `popover`, `primary` (терракота 46% 0.105 42°), `secondary`, `muted`, `accent` (оливковый), `destructive`, `border`, `input`, `ring`, `sidebar-*`, статусные `success` / `warning` / `error`, `--radius: 0.75rem`; тёмная тема переопределяет те же токены; `@theme inline` мапит их в utility-классы. `@source "../components"`, `@source "../shared"` — сканирование пакета при импорте CSS из приложения.
- `src/lib/utils.ts`: `cn()` (`clsx` + `tailwind-merge`).
- Примитивы shadcn-стиля (`src/components`, `data-slot` атрибуты, `class-variance-authority`): `Badge` (variants), `Button` (`variant` default/…/link, `size` default/sm/lg/icon/clear, `asChild` через `@radix-ui/react-slot`, `buttonVariants`), `Card` + `CardHeader` / `CardTitle` / `CardDescription` / `CardContent` / `CardFooter`, `Checkbox` (`@radix-ui/react-checkbox`), `Container` (max-width + горизонтальные отступы), `Heading` (`as`, `size` варианты, serif), `Input`, `Label` (`@radix-ui/react-label`), `Pagination`, `Section` (`sectionVariants` вертикальные отступы), `Select` (`@radix-ui/react-select`), `Separator`, `Skeleton`, `Text` (`textVariants`: размер/тон), `Textarea`. Иконки `lucide-react`.
- Корневой баррель `src/index.ts` реэкспортирует все компоненты и `cn`; в приложении принято импортировать по файлам `@workspace/ui/components/<name>` (CLAUDE.md).
- Потребитель: `apps/web/src/app/(frontend)/globals.css` импортирует `@workspace/ui/globals.css` и `@plugin "@tailwindcss/typography"`; `postcss.config.js` приложения → `@tailwindcss/postcss`.
- Линт/типы: `eslint.config.js` на `@workspace/eslint-config`, `tsconfig.json` на `react-library`; `pnpm lint` / `pnpm typecheck` через turbo.

## Planned

- Слой **композитов** — обёртка над shadcn с внутренним синтаксисом приложения (например, `Card` с `title` / `description` / `footer` пропсами вместо ручной сборки `CardHeader` + `CardTitle` + …; `Section` с `heading` + `subtitle`; `PageHeader`; `EmptyState`; `PriceTag`; `Field` = `Label` + `Input` + ошибка) в `packages/ui/src/composites/` (или `src/shared/`), экспорт `./composites/*`, документация примеров в `packages/ui/README.md` — **в работе, пакет A**. После — T-ID здесь.
- Компоненты, которых потребуют ближайшие задачи: `Accordion`/`details`-обёртка для FAQ (T-003), `Dialog`/`Sheet` для мобильного меню и формы заявки (T-002), `Toast` для подтверждений формы, `Tabs` для характеристик, `Table` для размеров, `Tooltip` — заводить по мере задач, каждый как примитив + при необходимости композит.
- Тёмная тема: переключатель в UI не реализован; токены готовы. Задачи нет.
- `hooks/` и `shared/` в пакете пустые (`.gitkeep`) — место для `useMediaQuery`, `useTheme`, общих типов.
- Storybook / витрина компонентов — не планируется до появления второго потребителя; вместо этого примеры в README пакета.

## Договорённости

- Цвета только из токенов `globals.css`; в приложении нет hard-coded цветов.
- Новый примитив = файл `src/components/<name>.tsx` с `data-slot`, `cn`, экспорт `{ Name, nameVariants }` + строка в `src/index.ts`.
- Композит не дублирует стили примитива — только собирает примитивы и задаёт API пропсов; ломать shadcn-совместимость примитивов нельзя (обновляем через `shadcn add`).
- Приложение импортирует `@workspace/ui/components/<name>` (и позже `@workspace/ui/composites/<name>`), а не корневой баррель, чтобы не тянуть лишнее в клиентские бандлы.
