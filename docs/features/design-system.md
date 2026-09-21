# Design system: `packages/ui` (`@workspace/ui`)

## Implemented (проверено по коду 2026-09-21)

- Пакет без сборки: `exports` указывают на `src/` (`.` → `src/index.ts`, `./globals.css`, `./postcss.config`, `./lib/*`, `./components/*`, `./hooks/*`); Next компилирует `.tsx` напрямую, `transpilePackages` не нужен (`packages/ui/README.md`).
- Токены `src/styles/globals.css`: Tailwind 4 (`@import "tailwindcss"`, `tw-animate-css`), `@custom-variant dark` по `[data-theme="dark"]` на предке (не `prefers-color-scheme`), брейкпоинты `sm 40rem / md 48rem / lg 64rem / xl 80rem`, шрифты `--font-sans` ← `--font-inter`, `--font-serif` ← `--font-playfair` (переменные задаёт приложение через `next/font`). Тёплая мебельная палитра в oklch: `background`, `foreground`, `card`, `popover`, `primary` (терракота 46% 0.105 42°), `secondary`, `muted`, `accent` (оливковый), `destructive`, `border`, `input`, `ring`, `sidebar-*`, статусные `success` / `warning` / `error`, `--radius: 0.75rem`; тёмная тема переопределяет те же токены; `@theme inline` мапит их в utility-классы. `@source "../components"`, `@source "../shared"` — сканирование пакета при импорте CSS из приложения.
- `src/lib/utils.ts`: `cn()` (`clsx` + `tailwind-merge`).
- Примитивы shadcn-стиля (`src/components`, `data-slot` атрибуты, `class-variance-authority`): `Badge` (variants), `Button` (`variant` default/…/link, `size` default/sm/lg/icon/clear, `asChild` через `@radix-ui/react-slot`, `buttonVariants`), `Card` + `CardHeader` / `CardTitle` / `CardDescription` / `CardContent` / `CardFooter`, `Checkbox` (`@radix-ui/react-checkbox`), `Container` (max-width + горизонтальные отступы), `Heading` (`as`, `size` варианты, serif), `Input`, `Label` (`@radix-ui/react-label`), `Pagination`, `Section` (`sectionVariants` вертикальные отступы), `Select` (`@radix-ui/react-select`), `Separator`, `Skeleton`, `Text` (`textVariants`: размер/тон), `Textarea`. Иконки `lucide-react`.
- Корневой баррель `src/index.ts` реэкспортирует все компоненты и `cn`; в приложении принято импортировать по файлам `@workspace/ui/components/<name>` (CLAUDE.md).
- Потребитель: `apps/web/src/app/(frontend)/globals.css` импортирует `@workspace/ui/globals.css` и `@plugin "@tailwindcss/typography"`; `postcss.config.js` приложения → `@tailwindcss/postcss`.
- Линт/типы: `eslint.config.js` на `@workspace/eslint-config`, `tsconfig.json` на `react-library`; `pnpm lint` / `pnpm typecheck` через turbo.
- **Композиты** (T-022, 2026-09-21, 1a02a01) `src/composites/*`, экспорт `./composites/*` и из корневого барреля: `Card` (`title`/`description`/`media`/`actions`/`footer`/`padding`/`interactive`) + `CardGrid` (`cols` 2/3/4, `as`), `Section` (`title`/`description`/`actions`/`padding`/`contained`/`as`), `PageHeader` (h1, `eyebrow`), `Stack`/`Grid`, `FormField` (Label + child + hint/error + required-маркер) и `FormMessage` (`error`/`success`/`info`), `EmptyState` (`as` h1/h2/h3/p), `KeyValueList`, `Stat`. Правило «composites first» в `packages/ui/README.md`, таблица использования в `src/composites/README.md`, `@source "../composites"` в `globals.css`. В корневом барреле shadcn-примитивы `Card`/`Section` доступны как `CardPrimitive`/`SectionPrimitive`. Приложение переведено: `product-card`, `product-specs` (KeyValueList), `product-page`/`home-fallback` (Section, PageHeader), `catalog-page` (PageHeader), `not-found-page` и пустой каталог (EmptyState), `product-grid` (CardGrid), поля `cms-form` (FormField + `lib/use-field-state.ts`, компонент `Error` удалён в пользу FormMessage).

## Planned

- Композиты, которых пока нет: `PriceTag` (сейчас `ProductPrice` в entities), `Dialog`/`Sheet` для мобильного меню, `Toast` — по мере задач.
- Примитивы под будущие задачи: `Tabs` для характеристик, `Table` для размеров, `Tooltip` — заводить по мере задач, каждый как примитив + при необходимости композит.
- Тёмная тема: переключатель в UI не реализован; токены готовы. Задачи нет.
- `hooks/` и `shared/` в пакете пустые (`.gitkeep`) — место для `useMediaQuery`, `useTheme`, общих типов.
- Storybook / витрина компонентов — не планируется до появления второго потребителя; вместо этого примеры в README пакета.

## Договорённости

- Цвета только из токенов `globals.css`; в приложении нет hard-coded цветов.
- Новый примитив = файл `src/components/<name>.tsx` с `data-slot`, `cn`, экспорт `{ Name, nameVariants }` + строка в `src/index.ts`.
- Композит не дублирует стили примитива — только собирает примитивы и задаёт API пропсов; ломать shadcn-совместимость примитивов нельзя (обновляем через `shadcn add`).
- Приложение импортирует сначала `@workspace/ui/composites/<name>`, затем `@workspace/ui/components/<name>`; корневой баррель не используется, чтобы не тянуть лишнее в клиентские бандлы. Деревья `CardHeader`/`CardTitle`/… в коде приложения не собираются.
