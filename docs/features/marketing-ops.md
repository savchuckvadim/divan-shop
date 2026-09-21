# Marketing ops: документы маркетинга, ресёрч, кроны, контент-операции

Здесь «реализовано» означает «документ существует и используется скиллами», а не код. Стратегия — [docs/strategy/operating-model.md](../strategy/operating-model.md); цели — [targets.md](../strategy/targets.md) (гипотеза «сможем ли продавать»: минимум 1 продажа, средний 5, хорошо 1–2/мес, супер 5/мес).

## Implemented (проверено по коду 2026-09-21)

### Документы

- `docs/strategy/`: `operating-model.md` (цель, North Star, KPI-дерево, две петли роста, ритм и роли, обратная связь, карта документов), `targets.md` (уровни продаж, модель без оплаты по ADR-0007, обратный расчёт лидов, бюджет 90 дней, пороги `targets.json`), `okr-2026-Q4.md`.
- `docs/marketing/`: `audience.md`, `query-portfolio.md` (кластеры запросов es/en/ru/uk — источник для категорий T-008 и городских страниц), `channels.md`, `calendar.md`, `local-seo.md` (список городов для areaServed), `google-stack.md` (GSC/GA4/GBP/Merchant, схема `data/`), `leads-and-crm.md` (поток лида, SLA, воронка B24, телефония, согласия), `launch-checklist.md` (нейминг, юр., бюджет).
- `docs/decisions/` ADR-0001…0008 (дефолтная локаль es, городские страницы, контент-каденция, лиды в Payload + B24, гейт рекламы, схема отзывов, лидген без чекаута, слои автоматизации).
- `docs/ops/crons.md` — реестр всех кронов с типом (node/claude/b24/ext), временем, входом/выходом и статусом (`on` / `phase0/1/2` / `later`); `docs/ops/capacity.md` — ручные часы.
- `research/market/2026-09-21/` — 7 тем + критик, ~300 источников; `research/seo/competitors.md` (конкуренты предзаполнены, секция Market пустая — T-001), `research/seo/keywords.md`, каталоги `research/seo/serp/`, `research/seo/competitors/` для `/seo-research`.

### Работающие процессы

- `/seo-research` (пн 08:00, зарегистрирован в `install-schedule.ps1`): SERP-снимки, профили конкурентов, keyword map, отчёт, draft-задачи.
- Очередь задач с 21 задачей из ресёрча и чата (`tasks/TASKS.md`), приоритизация по ICE (поле `ice:`), выполнение через `/task-run`.
- Уведомления в Telegram по каждому прогону.

## Planned

- **T-001** · владелец: секция Market в `competitors.md`, hero-модели и цифры в `targets.md`.
- **T-010** · нейминг-спринт: скилл `/naming`, `scripts/check-name.mjs`, `research/naming/candidates.md` (50 кандидатов, шортлист 5).
- **T-016** · `docs/content/content-plan.md` (12 недель кластера F), `docs/content/editorial-policy.md` (E-E-A-T, llms.txt), `content/briefs/_template.md`, скилл `/content-brief`, первая статья «cómo elegir sofá» draft на es; решение articles vs pages закрыто: коллекция `articles` и `/blog` реализованы в T-023 (см. cms-pages.md).
- **T-019** · `research/feedback/README.md`, плейбуки `docs/playbooks/{weekly-growth-review,usability-test,jtbd-interview,review-reply}.md`, `docs/experiments/log.md`.
- **T-013** · `/weekly-growth-review` → `reports/weekly/`, `docs/kpi/dashboard.md`.
- **T-012** · метрики `data/metrics/*` + `config/metrics/targets.json` (пороги из `targets.md`).
- **T-020** · `/social-pack` + Pinterest (фаза 1, ждёт фото и бренд).
- **T-021** · партнёрская программа (draft, ждёт решения о комиссии).
- **T-009** · фиды для Merchant Center / Meta Commerce; URL фида в `google-stack.md`.
- Кроны из `crons.md` со статусом `phase0/1/2` без задач: `daily-ops` (T-015), `content-brief-and-draft` (T-016), `publish-gate`, `tech-seo-audit`, `partner-outreach`, `community-monitor`, `local-rank-grid`, `monthly-retro`, `quarterly-strategy` — заводятся через `/idea` → `/task-add` по мере фаз.
- `docs/strategy/roadmap.md` (RICE квартальных инициатив) упоминается в operating-model, файла нет.

## Договорённости

- Ресёрч пишется в `research/`, выводы — в `docs/`; каждая цифра в docs ссылается на источник в research.
- Черновик контента без владельца-ревьюера не публикуется (правило 14 дней в `publish-gate`).
- Платная реклама только после гейта ADR-0005.
