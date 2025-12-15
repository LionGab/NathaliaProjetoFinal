#!/bin/bash
# Script para limpar caches do projeto
# Uso: bun run clean-cache

set -e

echo "🧹 Limpando caches..."

# Limpar cache do Expo
if [ -d ".expo" ]; then
  echo "🗑️  Removendo .expo..."
  rm -rf .expo
fi

# Limpar cache do Metro
if [ -d ".metro-cache" ]; then
  echo "🗑️  Removendo .metro-cache..."
  rm -rf .metro-cache
fi

# Limpar cache do node_modules
if [ -d "node_modules/.cache" ]; then
  echo "🗑️  Removendo node_modules/.cache..."
  rm -rf node_modules/.cache
fi

# Limpar TypeScript build info
find . -name "*.tsbuildinfo" -type f -delete 2>/dev/null || true

echo "✅ Caches limpos!"
echo ""
echo "Execute: bun start --clear para reiniciar com cache limpo"
