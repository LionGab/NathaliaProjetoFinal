# Design System Audit

@Agent: DesignSystem+UI
@Phase: Auditoria completa de design system

## Objetivo

Auditar o projeto para identificar inconsistências com o design system oficial (`src/theme/design-system.ts`).

## Escopo

Analisar:
- ✅ Cores hardcoded (hex/rgb direto no código)
- ✅ Tipografia não padronizada
- ✅ Espaçamento fora do grid 8pt
- ✅ Componentes sem dark mode
- ✅ Falta de tokens semânticos

## Processo

### 1. Buscar Cores Hardcoded

```bash
# Buscar cores hex (#RRGGBB) fora de design-system.ts
grep -r "#[0-9A-Fa-f]{6}" src/ --include="*.tsx" --include="*.ts" --exclude="design-system.ts"
```

### 2. Verificar Imports de COLORS

```bash
# Verificar quais arquivos NÃO importam COLORS
grep -L "from.*design-system" src/screens/*.tsx src/components/**/*.tsx
```

### 3. Auditar Tipografia

```bash
# Buscar fontSize hardcoded
grep -r "fontSize:" src/ --include="*.tsx" --exclude="design-system.ts"
```

### 4. Auditar Espaçamento

```bash
# Buscar padding/margin com valores não múltiplos de 8
grep -rE "(padding|margin).*: [0-9]+" src/ --include="*.tsx"
```

## Resultado Esperado

Gerar relatório Markdown com:

1. **Cores Hardcoded**: Lista de arquivos + linhas
2. **Tipografia Inconsistente**: Arquivos sem TYPOGRAPHY
3. **Espaçamento Irregular**: Valores fora do grid 8pt
4. **Dark Mode Faltando**: Componentes sem useTheme()
5. **Prioridade de Fix**: Alto/Médio/Baixo

## Formato de Relatório

```markdown
# 📊 Design System Audit Report

**Data**: 2025-12-17
**Escopo**: src/screens/, src/components/

## ❌ Cores Hardcoded (12 encontradas)

| Arquivo | Linha | Código | Token Correto |
|---------|-------|--------|---------------|
| HomeScreen.tsx | 42 | #f4258c | COLORS.primary |
| ProfileScreen.tsx | 89 | #1C1917 | COLORS.text.dark |

## ⚠️ Tipografia Inconsistente (8 arquivos)

- CommunityScreen.tsx (linha 156): fontSize: 18 → TYPOGRAPHY.sizes.lg
- PostCard.tsx (linha 34): fontWeight: "600" → TYPOGRAPHY.weights.semibold

## 🔧 Ações Recomendadas

1. [Alto] Migrar 12 cores hardcoded → COLORS tokens
2. [Médio] Padronizar tipografia em 8 arquivos
3. [Baixo] Ajustar 3 espaçamentos fora do grid
```

## Validação

Após correções, rodar:
```bash
/design-audit
```

Deve retornar: **✅ Zero issues encontrados**

## Próximo Passo

Executar `/design-migrate` para corrigir automaticamente os problemas encontrados.
