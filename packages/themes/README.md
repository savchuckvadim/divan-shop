# @workspace/themes

Темы витрин поверх токенов `@workspace/ui`. Пакет без сборки: CSS и TypeScript отдаются как есть.

## Как устроено

Тема = **направление × палитра × режим × форма**. Всё задаётся атрибутами на `<html>`, которые сервер
рендерит до первой отрисовки:

| Атрибут        | Значения                                    | Где описано          |
| -------------- | ------------------------------------------- | -------------------- |
| `data-concept` | `atelier` · `cinema` · `blueprint` · `neon` | `src/concepts/*.css` |
| `data-palette` | `p1`…`p4` (имена в `PALETTE_NAMES`)         | там же               |
| `data-theme`   | `light` · `dark`; нет атрибута = авто       | там же               |
| `data-shape`   | `round`; нет атрибута = строгие формы       | `src/shape.css`      |

Направление переопределяет контракт shadcn (`--background`, `--foreground`, `--primary`, `--border`,
`--radius`…) и добавляет свои токены: `--brand*` (акцент), `--partner`, `--stage` (фон под фото
товара), `--dv-font-*` (шрифты), `--display-*` (характер заголовков), `--label-*` (подписи),
`--page-margin` / `--container-max` (ширина до 3440 px), `--card-min` / `--grid-*` (плотность каталога).

Компоненты не знают про конкретную тему: они ставят хуки `data-slot`, а `src/themes.css` их стилизует:
`heading`, `kicker` (и `data-eyebrow`), `product-card`, `product-title`, `stage`, `product-grid`,
`price-club`, `cifra`, `button`, `chip`, `badge`. Правила `themes.css` без слоя намеренно: они перекрывают
утилиты Tailwind.

## Наборы витрин

`src/presets.ts` → `STOREFRONT_PRESETS` (решение владельца, ADR-0011):

- `group` (divan.group): Галерея, Эспарто, авто, скруглённые
- `boutique` (divan.boutique): Кино, Гранат, светлая, строгие
- `youth` (домен не выбран): Неон, Лайм, тёмная, скруглённые

Витрину выбирает сборка: `NEXT_PUBLIC_STOREFRONT=group|boutique|youth` (по умолчанию `group`). Шрифты
направления грузит приложение через `next/font` (`apps/web/src/modules/shared/ui/fonts/<витрина>.ts`,
алиас `@storefront/fonts` в `next.config.ts`), поэтому каждая витрина предзагружает только свои.

## Подключение

```css
/* apps/web/src/app/(frontend)/globals.css */
@import "@workspace/ui/globals.css";
@import "@workspace/themes/themes.css";
```

```tsx
import { STOREFRONT_PRESETS, themeAttributes } from "@workspace/themes/presets";

<html {...themeAttributes(STOREFRONT_PRESETS.group)}>
```

## Добавить палитру

1. В `src/concepts/<направление>.css` блок `:root[data-concept="X"][data-palette="pN"]` с теми же
   переменными, что у `p1` (`--acc-l`, `--acc-d`, `--wash-*`, …; у неона `--a`, `--b`, `--on-*`, `--a-ink`).
2. Имя в `PALETTE_NAMES`.
3. `pnpm --filter @workspace/themes check:contrast`: текст, кнопки, акцент и рамки полей проверяются
   по WCAG AA во всех палитрах и обоих режимах; ниже минимума = код выхода 1.

## Добавить направление

1. `src/concepts/<имя>.css` по образцу `atelier.css`: базовый блок, палитры, тёмный режим (и через
   `@media (prefers-color-scheme: dark)` для авто, и явный `[data-theme="dark"]`, который заодно
   красит вложенные тёмные секции), сигнатурные правила на `data-slot`.
2. `@import` в `src/themes.css`, имя в `CONCEPTS` и `PALETTE_NAMES`.
3. Шрифты: модуль в `apps/web/src/modules/shared/ui/fonts/`, переменные `--font-*`, на которые
   ссылаются `--dv-font-*`. В `subsets` только `latin`: кириллица догружается по `unicode-range`.
4. Проверка контраста, как выше.

## Правила

- Цвет товара не тонируем: акцент обрамляет фото, а не накладывается на него. `multiply` на `stage`
  допустим только на светлом фоне сцены, поэтому сцена остаётся светлой и в тёмном режиме.
- Общий хук в `src/themes.css` пишется под `:where([data-concept])`, правило направления — с `[data-concept="<имя>"]`: так направление всегда перекрывает общий хук, независимо от порядка импорта.
- Прототипы и обоснование направлений: `design/concepts/` (README, `briefs/`).
