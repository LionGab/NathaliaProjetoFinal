# CONTEXTO.md - Estado Atual do Projeto

**Última atualização**: 16 de dezembro de 2025  
**Ambiente**: Windows (principal) + MacBook M1 8GB RAM (iOS/testes)  
**Branch**: `main`

---

## 📊 Métricas (fonte = comandos)

> Regra: nenhum número entra aqui sem "como medir".

| Métrica                | Como medir                                                                | Último valor (data) |                     Meta |
| ---------------------- | ------------------------------------------------------------------------- | ------------------: | -----------------------: |
| TypeScript errors      | `npm run typecheck`                                                       |     \_**\_ (\_\_**) |                        0 |
| ESLint errors/warnings | `npm run lint`                                                            |     \_**\_ (\_\_**) |                  0 / <50 |
| Test coverage          | `npm test -- --coverage`                                                  |     \_**\_ (\_\_**) | 60% (curto) / 80% (meta) |
| Diagnóstico produção   | `npm run diagnose:production`                                             |     \_**\_ (\_\_**) |               sem falhas |
| Validação total        | `npm run validate`                                                        |     \_**\_ (\_\_**) |                    green |
| console.log restantes  | `grep -r "console\.log" src/ --include="*.ts" --include="*.tsx"`          |     \_**\_ (\_\_**) |     0 (exceto logger.ts) |
| Arquivos > 250 LOC     | `find src -name "*.tsx" -o -name "*.ts" \| xargs wc -l \| awk '$1 > 250'` |     \_**\_ (\_\_**) |                refatorar |

---

## 💻 Ambiente de Desenvolvimento

### Setup Dual

- **Windows**: Ambiente principal
- **MacBook M1**: iOS builds, testes
- **Gerenciador**: `bun` (preferido) ou `npm` (fallback)
- **Scripts**: `.sh` via Git Bash/WSL no Windows

### Comandos Cross-Platform

```bash
# Quality (funciona em ambos)
bun run typecheck      # ou: npm run typecheck
bun run lint           # ou: npm run lint
bun run validate       # ou: npm run validate
bun run quality-gate   # ou: npm run quality-gate

# Windows (scripts .sh)
git bash scripts/quality-gate.sh
```

---

## 🎯 Prioridades

### 🔴 Crítico

1. Finalizar migração Design System (`colors.ts` → `tokens.ts`)
2. Implementar testes automatizados (coverage mínimo 60%)

### 🟡 Alta

3. Performance: otimizar listas (FlashList onde justificado)
4. Acessibilidade: audit WCAG AAA completo

### 🟢 Média

5. Documentação: README, padrões de código
6. UX Polish: empty states, loading skeletons

---

## 🚧 Em Progresso

### Migrações

- **Design System**: `colors.ts` → `tokens.ts` (Fase 3 completa, Fase 4-5 pendentes)
- **Logger**: Migração `console.log` → `logger.*` (verificar status com grep)

### Features

- **Community Feed**: Refatoração (feed único, sistema de revisão)
- **Mundo da Nath**: UI polish aplicado

---

## ✅ Concluído Recentemente

### Sessão UI Polish (16/12/2025)

- HomeScreen, MundoDaNathScreen, CommunityScreen refatorados
- 23 navegações "ComingSoon" removidas
- Design System Calm FemTech aplicado

### Melhorias (10/10)

- Sistema de Logging, Toasts, Estados (Loading/Empty/Error)
- Acessibilidade, Retry Logic, Deep Linking
- Error Handling, Otimização Selectors, Componentes UI

### Premium/IAP

- RevenueCat integrado, PaywallScreen, PremiumGate
- Restore purchases, Manage subscriptions

### Compliance

- AIConsentModal, DeleteAccountScreen, Links legais, Privacy Manifest

---

## 🔧 Decisões Técnicas

### Design System (16/12/2025)

- **Calm FemTech**: Azul (base) + Rosa (CTAs, máx 10-15% da tela)
- **Fonte única**: `src/theme/tokens.ts`
- **Hook**: `useThemeColors()` OU `Tokens.*` OU `useTheme().preset` (ver `.cursorrules` linha 26-31)

### Listas

- **Padrão**: `FlatList` + `memo()` (regra do repo)
- **Exceção**: `FlashList` somente onde já existir e houver justificativa de performance (listas grandes/chat)

### Community Feed

- Feed único estilo Instagram (removido tabs Feed/Grupos)
- Posts com `status: "pending"` (sistema de revisão)

### Premium/IAP

- RevenueCat (não Stripe)
- Gerenciamento unificado iOS + Android

### Cross-Platform

- `bun` preferido, `npm` fallback
- Scripts `.sh` via Git Bash/WSL no Windows

---

## ⚠️ Bloqueadores

Nenhum bloqueador crítico no momento.

---

## 📋 Próximos Passos

### Esta Semana

1. Rodar `npm run quality-gate` antes de PRs
2. Continuar migração Design System (Fase 4-5)
3. Implementar testes básicos

### Próxima Semana

4. Audit performance (React DevTools Profiler)
5. Audit acessibilidade (WCAG AAA)

---

## 🔗 Referências

### Arquivos

- **Design System**: `src/theme/tokens.ts` (fonte única)
- **Preset**: `src/theme/presets/calmFemtech.ts`
- **Hook Theme**: `src/hooks/useTheme.ts`
- **Logger**: `src/utils/logger.ts`
- **Stores**: `src/state/store.ts`

### Documentação

- **Arquitetura**: `CLAUDE.md`
- **Regras**: `.cursorrules`
- **Design System**: `docs/DESIGN_SYSTEM_CALM_FEMTECH.md`
- **Migração**: `docs/DESIGN_SYSTEM_MIGRATION.md`
- **Setup Windows**: `docs/SYNC_WINDOWS_TO_MAC.md`
- **Setup Mac**: `docs/INTEGRACAO_MAC.md`

---

## 📝 Notas para Claude Code

### Padrões Obrigatórios (`.cursorrules`)

- **Cores**: `useThemeColors()` OU `Tokens.*` de `tokens.ts` (nunca hardcoded)
- **Logging**: `logger.*` (nunca `console.log`)
- **TypeScript**: Zero `any`, usar `unknown` + type guards
- **Listas**: `FlatList` (padrão) ou `FlashList` (exceção justificada)
- **Services**: Padrão `{ data, error }`
- **Zustand**: Selectores individuais (não objetos)

### Comandos Corretos

- `npm run typecheck` (não `type-check`)
- `npm run lint`
- `npm run validate`
- `npm run diagnose:production`
- `npm run quality-gate`

---

**Status**: ✅ Projeto estável, migrações em progresso
