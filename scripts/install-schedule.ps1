# Registers two Windows Scheduled Tasks (run once, from an elevated or normal PowerShell):
#   DivanShop Daily Agent   — every day at 09:00, /task-run
#   DivanShop SEO Research  — every Monday at 08:00, /seo-research
# Usage: pwsh scripts/install-schedule.ps1 [-DailyAt "09:00"] [-Remove]
param(
    [string]$DailyAt = "09:00",
    [string]$WeeklyAt = "08:00",
    [switch]$Remove
)

$root = Split-Path -Parent $PSScriptRoot
$script = Join-Path $root "scripts\daily-agent.ps1"
$pwsh = (Get-Command pwsh -ErrorAction SilentlyContinue).Source
if (-not $pwsh) { $pwsh = (Get-Command powershell).Source }

$tasks = @(
    @{ Name = "DivanShop Daily Agent";  Args = "-Skill task-run";     Trigger = New-ScheduledTaskTrigger -Daily -At $DailyAt },
    @{ Name = "DivanShop SEO Research"; Args = "-Skill seo-research"; Trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Monday -At $WeeklyAt },
    @{ Name = "DivanShop Project Checkin"; Args = "-Skill project-checkin"; Trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Friday -At $WeeklyAt }
)

foreach ($task in $tasks) {
    if (Get-ScheduledTask -TaskName $task.Name -ErrorAction SilentlyContinue) {
        Unregister-ScheduledTask -TaskName $task.Name -Confirm:$false
        Write-Host "removed: $($task.Name)"
    }
    if ($Remove) { continue }

    $action = New-ScheduledTaskAction -Execute $pwsh `
        -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$script`" $($task.Args)" `
        -WorkingDirectory $root
    $settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -WakeToRun `
        -ExecutionTimeLimit (New-TimeSpan -Hours 3) -MultipleInstances IgnoreNew

    Register-ScheduledTask -TaskName $task.Name -Action $action -Trigger $task.Trigger `
        -Settings $settings -Description "Claude Code autonomous run for divan-shop" | Out-Null
    Write-Host "registered: $($task.Name)"
}
