# Деплой

Тот же подход, что в April: один VPS, Docker Compose, образ собирается из монорепы. Первая версия собирает образ на сервере; переход на GHCR + GitHub Actions — когда появится удалённый репозиторий.

## Что нужно до первого деплоя

1. **Домен** (после нейминга, T-010) с A-записью на VPS; `www` → редирект в Caddyfile.
2. **VPS** 2 vCPU / 4 GB (Hetzner CX22 ~4 €/мес хватит): Ubuntu 24.04, Docker + compose plugin, `ufw` 22/80/443, пользователь без root.
3. **Бренд** задаётся переменной `NEXT_PUBLIC_BRAND_NAME` (build-arg, `BRAND_NAME` в `deploy/.env.prod`); после нейминга меняем значение и пересобираем образ, название в CMS Site Settings правится в админке.
4. **Секреты** на сервере, не в репо: `apps/web/.env` (из `.env.example`: `DATABASE_URL=postgres://postgres:<pw>@postgres:5432/divan`, `PAYLOAD_SECRET` 32+ символа, `NEXT_PUBLIC_SERVER_URL=https://домен`, `PREVIEW_SECRET`, `CRON_SECRET`) и `deploy/.env.prod` (`DOMAIN`, `POSTGRES_PASSWORD`).
5. **Миграции** вместо push-режима: в проде Payload не синхронизирует схему автоматически. Перед релизом локально `pnpm web payload migrate:create` (создаёт `apps/web/src/migrations/`), коммит; на сервере `run --rm tools pnpm payload migrate`. Для самого первого запуска можно временно поставить `PAYLOAD_DB_PUSH=true` в `apps/web/.env` (см. `payload.config.ts`), затем выключить и перейти на миграции.
6. **Медиа** живут в volume `media` (`/app/apps/web/public/media`). Позже — S3/Backblaze через `@payloadcms/storage-s3`, тогда volume не нужен.
7. **Email** (T-028): без адаптера письма пишутся в лог контейнера.

## Команды на сервере

```bash
git clone <repo> /srv/divan-shop && cd /srv/divan-shop
cp apps/web/.env.example apps/web/.env && nano apps/web/.env
cp deploy/.env.prod.example deploy/.env.prod && nano deploy/.env.prod
docker compose --env-file deploy/.env.prod -f docker-compose.prod.yml up -d --build
docker compose --env-file deploy/.env.prod -f docker-compose.prod.yml run --rm tools pnpm payload migrate
docker compose --env-file deploy/.env.prod -f docker-compose.prod.yml run --rm tools pnpm seed
docker compose --env-file deploy/.env.prod -f docker-compose.prod.yml logs -f web
```

Обновление: `git pull && docker compose … up -d --build web` (Caddy и Postgres не трогаются). Откат: `git checkout <hash>` и та же команда.

## Бэкапы и мониторинг

- `scripts/ops/backup.sh` в cron сервера 03:00: дамп БД + медиа в `backups/`, 14 дней; off-site через `rclone` в Backblaze B2 (~1 €/мес). Восстановление проверять раз в квартал (`gunzip -c … | docker compose exec -T postgres psql -U postgres divan`).
- UptimeRobot на `https://домен/robots.txt` и `/admin` (алерт в Telegram через webhook).
- Логи: `docker compose logs`; позже Loki/Promtail как в April.

## Проверка после деплоя

`/` → 307 на `/es`; `/es`, `/es/catalog`, `/es/blog`, `/es/contacts`, `/admin` → 200; `/sitemap.xml`, `/robots.txt`; Rich Results Test на товар; Lighthouse mobile ≥ 90 perf.

## Альтернативы

- **Vercel + Neon + Vercel Blob**: нулевой DevOps, но Payload-медиа и long-running задачи хуже; подходит, если не хочется VPS. Тогда `output: "standalone"` не нужен, storage-адаптер `@payloadcms/storage-vercel-blob`.
- **Dokploy на том же VPS** (как `DockployDockerfile` в April): UI поверх Docker, автодеплой из git, встроенные бэкапы БД. Хороший второй шаг после ручного compose.
