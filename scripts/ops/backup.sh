#!/usr/bin/env sh
# Nightly backup: postgres dump + media tarball into ./backups, keep 14 days.
# Cron on the server (crontab -e): 0 3 * * * cd /srv/divan-shop && sh scripts/ops/backup.sh >> logs/backup.log 2>&1
# Off-site copy (optional): rclone copy backups b2:divan-backups
set -eu
cd "$(dirname "$0")/../.."
mkdir -p backups logs
STAMP=$(date +%Y-%m-%d_%H%M)
docker compose --env-file deploy/.env.prod -f docker-compose.prod.yml exec -T postgres \
  pg_dump -U postgres -d divan --no-owner | gzip > "backups/db-$STAMP.sql.gz"
docker run --rm -v divan-shop_media:/media -v "$PWD/backups":/backups alpine \
  tar czf "/backups/media-$STAMP.tar.gz" -C /media .
find backups -name '*.gz' -mtime +14 -delete
echo "[$STAMP] backup ok: $(du -sh backups | cut -f1)"
