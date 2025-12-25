# Auditoria Técnica - Nossa Maternidade

**Data**: 25/12/2025
**Auditor**: Claude Code (Tech Lead)
**Versão do Repo**: main @ 5158a04

---

## Sumário Executivo

O repositório **Nossa Maternidade** apresenta **boa maturidade** em segurança, LGPD e observabilidade.
As principais áreas de melhoria são:

| Área | Status | Prioridade |
|------|--------|------------|
| Segurança/LGPD | ✅ Bom | - |
| Observabilidade | ✅ Bom | - |
| Design System | ⚠️ Parcial | P1 |
| Acessibilidade | ⚠️ Parcial | P1 |
| Performance (listas) | ⚠️ Parcial | P2 |
| Testabilidade | ❌ Crítico | P0 |
| Cores hardcoded | ❌ Crítico | P1 |

**Riscos principais**:
1. Zero testes unitários (regressões não detectadas)
2. ~100+ cores hardcoded (manutenção de tema impossível)
3. 25 arquivos com `ScrollView + map()` (performance em listas)

---

## Arquitetura Atual

### Navegação (5-stage auth flow)
```
RootNavigator (Native Stack)
├── 1. AuthLanding/EmailAuth/Login (if !isAuthenticated)
├── 2. NotificationPermission (if !notificationSetupDone)
├── 3. OnboardingStories (Nath Journey - NEW)
├── 4. Onboarding (legacy, 6 steps)
├── 5. NathIAOnboarding (AI personalization)
└── 6. MainTabs → Home, Ciclo, NathIA, Comunidade, Meus Cuidados
    └── Modals: PostDetail, DailyLog, Affirmations, Paywall, etc.
```

### State Management (Zustand + AsyncStorage)
| Store | Persisted | Propósito |
|-------|-----------|-----------|
| useAppStore | ✅ | User, auth, theme |
| useChatStore | ✅ | Conversas NathIA |
| useCycleStore | ✅ | Ciclo menstrual |
| useAffirmationsStore | ✅ | Afirmações favoritas |
| useHabitsStore | ✅ | 8 hábitos wellness |
| useCheckInStore | ✅ | Check-ins diários |
| usePremiumStore | ✅ | IAP/RevenueCat |
| useNathJourneyOnboardingStore | ✅ | Onboarding novo |
| useCommunityStore | ❌ | Posts (sempre fresh) |

### Edge Functions (10)
| Function | Propósito | Segurança |
|----------|-----------|-----------|
| `/ai` | NathIA chat | ✅ JWT, rate limit, circuit breaker |
| `/delete-account` | LGPD delete | ✅ JWT, audit log, soft/hard |
| `/export-data` | LGPD export | ✅ JWT |
| `/transcribe` | Whisper audio | ✅ JWT |
| `/upload-image` | Image upload | ✅ JWT |
| `/notifications` | Push | ✅ JWT |
| `/elevenlabs-tts` | TTS voz NathIA | ✅ JWT |
| `/analytics` | Analytics | ✅ JWT |
| `/moderate-content` | Moderação | ✅ JWT |
| `/webhook` | RevenueCat | ✅ Signature |

---

## Descobertas por Categoria

### 🔒 Segurança & LGPD (✅ BOM)

**Pontos positivos**:
- JWT validation em todas as Edge Functions
- API keys NÃO expostas no cliente (apenas `EXPO_PUBLIC_SUPABASE_*`)
- Rate limiting com Upstash Redis + fallback in-memory (20 req/min)
- Circuit breakers nos providers de IA (Gemini, Claude, OpenAI)
- Crisis detection para NathIA (palavras-chave suicídio/risco)
- CORS restrito (domínios específicos)
- RLS policies completas (27 migrations)
- Audit logging implementado
- LGPD compliance: delete-account (soft/hard), export-data

**Sem issues P0/P1 de segurança.**

---

### 📊 Observabilidade (✅ BOM)

**Pontos positivos**:
- Sentry inicializado em produção (`App.tsx:38-57`)
- ErrorBoundary implementado com fallback UI
- Logger centralizado (`src/utils/logger.ts`)
- Network status monitoring com banner offline
- Structured logging em Edge Functions

**Verificações**:
- ✅ Sentry: Inicializado apenas em produção (!__DEV__)
- ✅ ErrorBoundary: Envolve todo o App
- ✅ Logger: Usado em vez de console.log
- ✅ Offline handling: Banner + retry

---

### 🎨 Design System (⚠️ PARCIAL)

**Issue P1: ~100+ cores hardcoded**

Arquivos com cores hardcoded (amostra):

| Arquivo | Linhas | Severidade |
|---------|--------|------------|
| `OnboardingStoriesScreen.tsx` | 75-81, 139-144, 1082-1521 | Alta |
| `LoginScreen.tsx` | 64-99 | Alta |
| `LoginScreenRedesign.tsx` | 77-108 | Alta |
| `PaywallScreenRedesign.tsx` | 74-101 | Alta |
| `MyCareScreen.tsx` | 17-76 | Alta |
| `VoiceMessagePlayer.tsx` | 211, 272, 277, 290 | Média |
| `NotificationPermissionScreen.tsx` | 87-89 | Média |
| `HabitsEnhancedScreen.tsx` | 34-39 | Média |

**Padrão violado**: Cores devem vir de `Tokens.*` ou `useThemeColors()`.

**Impacto**:
- Dark mode impossível de implementar corretamente
- Manutenção de tema inconsistente
- Acessibilidade comprometida (contraste)

---

### ♿ Acessibilidade (⚠️ PARCIAL)

**Issue P1: Componentes sem accessibility props**

| Componentes UI | Com accessibilityLabel | Com minHeight: 44 |
|----------------|----------------------|-------------------|
| 16 Pressable/TouchableOpacity | 8 (50%) | 3 (19%) |

**Arquivos que precisam revisão**:
- `src/components/ui/Toast.tsx`
- `src/components/ui/Chip.tsx`
- `src/components/ui/Card.tsx`
- `src/components/ui/IconButton.tsx`
- `src/components/ui/SectionHeader.tsx`
- `src/components/ui/AppButton.tsx`
- `src/components/ui/AppCard.tsx`
- `src/components/ui/Input.tsx`

**Padrão**: Todos elementos interativos devem ter:
- `accessibilityLabel`
- `accessibilityRole`
- `minHeight: 44` (iOS HIG)

---

### ⚡ Performance (⚠️ PARCIAL)

**Issue P2: 25 arquivos com `ScrollView + .map()`**

Arquivos identificados:
```
src/screens/PaywallScreenRedesign.tsx
src/screens/PaywallScreen.tsx
src/screens/OnboardingStoriesScreen.tsx
src/screens/AssistantScreen.tsx
src/screens/NotificationPermissionScreen.tsx
src/screens/MyCareScreen.tsx
src/screens/MaeValenteProgressScreen.tsx
src/screens/HabitsEnhancedScreen.tsx
src/screens/RestSoundsScreen.tsx
src/screens/ProfileScreen.tsx
... (15 mais)
```

**Análise**:
- Muitos são listas curtas (< 10 itens) → aceitável
- Listas longas (posts, comentários) devem usar `FlatList`/`FlashList`
- Precisa análise individual por arquivo

---

### 🧪 Testabilidade (❌ CRÍTICO)

**Issue P0: ZERO testes unitários**

```bash
$ glob 'src/**/*.test.ts' → 0 arquivos
$ glob 'src/**/*.test.tsx' → 0 arquivos
```

**Jest configurado** mas não utilizado.

**Impacto**:
- Regressões não detectadas
- Refactoring arriscado
- CI/CD sem validação de lógica

**Recomendação**:
1. Começar com utils puros (`logger.ts`, `formatters.ts`, `cn.ts`)
2. Expandir para hooks críticos
3. Meta: 60% cobertura em 30 dias

---

## Tabela P0/P1/P2

| # | Prioridade | Issue | Impacto | Risco | Arquivos | Esforço |
|---|------------|-------|---------|-------|----------|---------|
| 1 | **P0** | Zero testes unitários | Regressões não detectadas | Alto | `src/utils/*.ts` | 2-3 dias |
| 2 | **P1** | ~100+ cores hardcoded | Dark mode impossível, a11y | Médio | 12+ screens | 3-5 dias |
| 3 | **P1** | Componentes sem a11y props | WCAG violado | Médio | 8 componentes UI | 1 dia |
| 4 | **P2** | ScrollView+map em listas longas | Performance | Baixo | 5-10 screens | 2 dias |
| 5 | **P2** | Tokens de feeling incorretos no prompt | Docs desatualizados | Baixo | CLAUDE.md | 1 hora |

---

## Plano de PRs (Sequência Sugerida)

### PR 1: Quick Wins - Correções de Tokens e Docs
**Escopo**: Corrigir uso de tokens, atualizar CLAUDE.md
**DoD**:
- [ ] Corrigir `Tokens.ACCESSIBILITY` → `Tokens.accessibility`
- [ ] Corrigir `Tokens.feeling.*` → `Tokens.feeling.*.color`
- [ ] Atualizar versões no CLAUDE.md (TS 5.9, Reanimated 4.1)
- [ ] Quality gate passando

### PR 2: Testes Unitários - Utils Puros
**Escopo**: Adicionar testes para utils sem dependências externas
**DoD**:
- [ ] `src/utils/logger.test.ts`
- [ ] `src/utils/cn.test.ts`
- [ ] `src/utils/formatters.test.ts` (se existir)
- [ ] Coverage > 80% nesses arquivos
- [ ] `npm test` passando

### PR 3: Acessibilidade - Componentes UI
**Escopo**: Adicionar a11y props em componentes base
**DoD**:
- [ ] Todos componentes em `src/components/ui/` com Pressable têm:
  - `accessibilityLabel` (ou prop para customizar)
  - `accessibilityRole`
  - `minHeight: 44` (ou `Tokens.accessibility.minTapTarget`)
- [ ] Quality gate passando

### PR 4: Design System - Migração de Cores (OnboardingStoriesScreen)
**Escopo**: Migrar maior violador de cores hardcoded
**DoD**:
- [ ] Todas cores em `OnboardingStoriesScreen.tsx` usando `Tokens.*`
- [ ] Criar constantes de cores em arquivo de config se necessário
- [ ] Sem regressão visual (testar manualmente)
- [ ] Quality gate passando

### PR 5: Design System - Migração de Cores (Login/Paywall)
**Escopo**: Migrar screens de auth/paywall
**DoD**:
- [ ] `LoginScreen.tsx`, `LoginScreenRedesign.tsx`, `PaywallScreenRedesign.tsx`
- [ ] Todas cores usando `Tokens.*` ou `useThemeColors()`
- [ ] Quality gate passando

### PR 6: Performance - FlatList em Listas Longas
**Escopo**: Substituir ScrollView+map por FlatList onde necessário
**DoD**:
- [ ] Identificar listas > 10 itens
- [ ] Substituir por FlatList com keyExtractor
- [ ] Performance profiling antes/depois
- [ ] Quality gate passando

---

## Quick Wins Selecionados (3)

Para implementação imediata (baixo risco, alto impacto):

1. **Atualizar CLAUDE.md** - Corrigir tokens e versões incorretas
2. **Adicionar testes para `cn.ts`** - Util puro, sem deps
3. **Adicionar a11y props em `Button.tsx`** - Componente mais usado

---

## Riscos e Mitigação

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Regressão visual ao migrar cores | Média | Alto | Testes manuais + screenshots |
| Quebra de FlatList em ScrollView nested | Média | Médio | Testar em device físico |
| Performance pior com FlatList em listas curtas | Baixa | Baixo | Manter ScrollView para < 10 itens |
| Conflitos de merge durante migração | Média | Baixo | PRs pequenos e atômicos |

---

## Conclusão

O repositório está em **boa forma** para segurança e observabilidade.
As principais ações são:

1. **Urgente (P0)**: Implementar testes unitários básicos
2. **Importante (P1)**: Migrar cores hardcoded para tokens
3. **Importante (P1)**: Adicionar acessibilidade aos componentes UI
4. **Desejável (P2)**: Otimizar listas longas com FlatList

**Recomendação**: Priorizar testes antes de grandes refactorings para ter rede de segurança.
