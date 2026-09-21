# Daily autonomous run: one task from tasks/TASKS.md, report to Telegram.
# Registered in Windows Task Scheduler by scripts/install-schedule.ps1.
# Usage: pwsh scripts/daily-agent.ps1 [-Skill task-run|seo-research] [-MaxTurns 200]
param(
    [ValidateSet("task-run", "seo-research", "project-checkin")]
    [string]$Skill = "task-run",
    [int]$MaxTurns = 200
)

$ErrorActionPreference = "Continue"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

$logDir = Join-Path $root "logs"
New-Item -ItemType Directory -Force $logDir | Out-Null
$stamp = Get-Date -Format "yyyy-MM-dd_HHmm"
$log = Join-Path $logDir "$Skill-$stamp.log"

# .env.automation -> process env (Telegram creds, optional ANTHROPIC_* overrides)
$envFile = Join-Path $root ".env.automation"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$' -and -not $_.Trim().StartsWith("#")) {
            [Environment]::SetEnvironmentVariable($matches[1], $matches[2].Trim('"', "'"), "Process")
        }
    }
}

$prompt = "/$Skill`n`nТы запущен планировщиком без человека. Следуй .claude/skills/$Skill/SKILL.md от начала до конца, включая отчёт и отправку в Telegram."

"[$(Get-Date -Format s)] start $Skill" | Tee-Object -FilePath $log -Append

& claude -p $prompt `
    --permission-mode acceptEdits `
    --max-turns $MaxTurns `
    --output-format text 2>&1 | Tee-Object -FilePath $log -Append

$exit = $LASTEXITCODE
"[$(Get-Date -Format s)] exit $exit" | Tee-Object -FilePath $log -Append

if ($exit -ne 0) {
    & node scripts/telegram-notify.mjs --text "⚠️ $Skill упал (exit $exit). Лог: logs/$Skill-$stamp.log"
}

exit $exit
