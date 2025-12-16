# Script para limpar caches do projeto (PowerShell)
# Uso: bun run clean

Write-Host "🧹 Limpando caches..." -ForegroundColor Cyan

# Limpar cache do Expo
if (Test-Path ".expo") {
    Write-Host "🗑️  Removendo .expo..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force ".expo" -ErrorAction SilentlyContinue
}

# Limpar cache do Metro (local)
if (Test-Path ".metro-cache") {
    Write-Host "🗑️  Removendo .metro-cache (local)..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force ".metro-cache" -ErrorAction SilentlyContinue
}

# Limpar cache global do Metro (~/.metro-cache)
$metroCacheGlobal = Join-Path $env:USERPROFILE ".metro-cache"
if (Test-Path $metroCacheGlobal) {
    Write-Host "🗑️  Removendo ~/.metro-cache (global)..." -ForegroundColor Yellow
    try {
        Remove-Item -Recurse -Force $metroCacheGlobal -ErrorAction Stop
        Write-Host "✅ Cache global removido" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Não foi possível remover cache global (permissões insuficientes)" -ForegroundColor Yellow
        Write-Host "   Execute manualmente: Remove-Item -Recurse -Force $metroCacheGlobal" -ForegroundColor Gray
    }
}

# Limpar cache do node_modules
if (Test-Path "node_modules\.cache") {
    Write-Host "🗑️  Removendo node_modules\.cache..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "node_modules\.cache" -ErrorAction SilentlyContinue
}

# Limpar TypeScript build info
Get-ChildItem -Recurse -Filter "*.tsbuildinfo" -ErrorAction SilentlyContinue | Remove-Item -Force -ErrorAction SilentlyContinue

Write-Host "✅ Caches limpos!" -ForegroundColor Green
Write-Host ""
Write-Host "Execute: bun start --clear para reiniciar com cache limpo" -ForegroundColor Cyan

