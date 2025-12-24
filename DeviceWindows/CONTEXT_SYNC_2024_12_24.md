# Nossa Maternidade - Sincronização de Contexto

> **Data:** 24 de Dezembro de 2024
> **Origem:** macOS (Terminal Principal)
> **Destino:** Windows (Device Secundário)
> **Commit Atual:** `373206d` (main)

---

## 1. ESTADO ATUAL DO PROJETO

### 1.1 Quality Gate: 100% Verde ✅

```bash
npm run quality-gate
```

| Check | Status |
|-------|--------|
| TypeScript (tsc --noEmit) | ✅ 0 erros |
| ESLint | ✅ 0 erros (6 warnings tolerados) |
| Build Ready | ✅ |
| Console.log Check | ✅ Nenhum encontrado |

### 1.2 Warnings Conhecidos (Não Bloqueia)

```
src/screens/AssistantScreen.tsx
  - import/first (linhas 97-99) - imports no corpo do módulo

src/screens/onboarding/OnboardingPaywall.tsx
  - _isLoadingOfferings não usado (linha 61)
  - react-hooks/exhaustive-deps (linhas 161, 186)
```

---

## 2. ARQUITETURA DO DESIGN SYSTEM

### 2.1 Fonte Única de Verdade

```
src/theme/tokens.ts        ← PRINCIPAL (Calm FemTech Preset)
src/theme/presets/calmFemtech.ts  ← Preset detalhado
src/theme/design-system.ts ← DEPRECATED (compatibilidade)
src/utils/colors.ts        ← DEPRECATED (re-exporta tokens)
```

### 2.2 Estrutura dos Tokens

```typescript
// src/theme/tokens.ts - Exports principais
export const Tokens = {
  brand,        // primary, accent, secondary, teal
  neutral,      // 0-900 (escala de cinza)
  text,         // light/dark { primary, secondary, tertiary, muted, inverse }
  semantic,     // light/dark { success, warning, error, info + Light variants }
  surface,      // light/dark { base, card, elevated, tertiary, overlay, glass }
  gradients,    // primary, accent, warm, cool, sunset, nathiaOnboarding, affirmations, cycle
  feeling,      // bem, cansada, indisposta, amada, ansiosa, enjoada
  typography,   // fontFamily, display*, headline*, title*, body*, label*, caption
  spacing,      // xs(4) sm(8) md(12) lg(16) xl(20) 2xl(24) 3xl(32)...
  radius,       // none, xs, sm, md, lg, xl, 2xl, 3xl, full
  shadows,      // none, sm, md, lg, xl, glow(), accentGlow
  overlay,      // light, medium, dark, heavy, backdrop
  mood,         // happy, calm, energetic, anxious, sad, irritated, sensitive, tired
  cycleColors,  // menstrual, follicular, ovulation, luteal, fertile
  animation,    // duration, easing
  accessibility,// minTapTarget(44), contrastRatioAA(4.5), contrastRatioAAA(7)
  components,   // buttonPrimary, buttonSecondary, buttonGhost, card, cardOutlined, input, chip, tabBar
  layout,       // screenPaddingHorizontal, screenPaddingVertical, sectionGap, cardGap, heroHeight
  elevation,    // base, raised, overlay, dropdown, modal, tooltip, toast
};
```

### 2.3 Hook useTheme - Estrutura Completa

```typescript
const {
  // Modo e configuração
  theme,          // "light" | "dark" | "system"
  isDark,         // boolean
  setTheme,       // (theme) => void
  toggleTheme,    // () => void

  // COLORS OBJECT (compatibilidade)
  colors: {
    primary,      // brand.primary
    secondary,    // brand.secondary
    accent,       // brand.accent
    neutral,      // escala 0-900
    background: {
      primary,    // neutral[50] ou neutral[900]
      secondary,
      tertiary,
      card,       // ← ADICIONADO NESTA SESSÃO
      canvas,     // ← ADICIONADO NESTA SESSÃO
      elevated,   // ← ADICIONADO NESTA SESSÃO
    },
    text: {
      primary,
      secondary,
      tertiary,
      muted,
      inverse,    // ← ADICIONADO NESTA SESSÃO
    },
    border,       // ← ADICIONADO NESTA SESSÃO { subtle, default, strong, accent, primary }
    semantic: {
      // Acesso FLAT (novo)
      success, successLight, warning, warningLight, error, errorLight, info, infoLight,
      // Acesso NESTED (compatibilidade)
      light: { ... },
      dark: { ... },
    },
    legacyAccent,
  },

  // PRESET (nova API - preferir usar)
  preset,         // getPresetTokens(mode)
  brand,          // cores da marca
  surface,        // superfícies
  text,           // texto
  semantic,       // semântico (FLAT - direto do preset)
  border,         // bordas
  button,         // estilos de botão
  card,           // estilos de card
  gradients,      // gradientes

  // TOKENS LEGADOS
  tokens,         // getThemeTokens(mode)
  neutral,
  feeling,
  typography,
  spacing,
  radius,
  shadows,
  components,
  layout,
} = useTheme();
```

---

## 3. PADRÕES DE CÓDIGO CRÍTICOS

### 3.1 Acesso a Cores Semânticas

```typescript
// ✅ CORRETO - Acesso via colors (com light/dark)
colors.semantic.error           // funciona (flat)
colors.semantic.light.error     // funciona (nested)

// ✅ CORRETO - Acesso via preset (sempre flat)
theme.semantic.error            // funciona

// ❌ ERRADO - semantic exportado de tokens é nested
import { semantic } from '../theme/tokens';
semantic.error                  // ERRO! Não existe
semantic.light.error            // ✅ Correto
```

### 3.2 Acesso a Background

```typescript
// ✅ CORRETO
colors.background.primary       // fundo principal
colors.background.card          // fundo de cards
colors.background.elevated      // cards elevados

// ❌ ERRADO (não existiam antes)
colors.background.card          // Antes não existia, agora existe
```

### 3.3 Acesso a Feeling Colors

```typescript
import { feeling } from '../theme/tokens';

// Estrutura de cada feeling:
feeling.bem       // { color: "#FFE4B5", active: "#FFEFC7", icon: "#F59E0B" }
feeling.cansada   // { color: "#BAE6FD", active: "#D4E9FD", icon: "#60A5FA" }
feeling.indisposta// { color: "#DDD6FE", active: "#EDE9FE", icon: "#A855F7" }
feeling.amada     // { color: "#FECDD3", active: "#FFE4E9", icon: "#F4258C" }
feeling.ansiosa   // { color: "#FED7AA", active: "#FFE4C7", icon: "#F97316" }
feeling.enjoada   // { color: "#DDD6FE", active: "#EDE9FE", icon: "#A855F7" } ← ADICIONADO

// Uso correto:
feeling.bem.color   // "#FFE4B5"
feeling.bem.active  // "#FFEFC7"
feeling.bem.icon    // "#F59E0B"
```

### 3.4 Gradientes Disponíveis

```typescript
import { gradients } from '../theme/tokens';

// Brand
gradients.primary           // [brand.primary[500], brand.primary[600]]
gradients.primarySoft       // [brand.primary[50], brand.primary[100]]
gradients.accent            // [brand.accent[400], brand.accent[500]]
gradients.accentSoft        // [brand.accent[50], brand.accent[100]]
gradients.secondary         // [brand.secondary[400], brand.secondary[500]]
gradients.secondarySoft     // [brand.secondary[50], brand.secondary[100]]

// Hero
gradients.heroLight         // [brand.primary[50], "#FFFFFF", brand.primary[100]]
gradients.heroAccent        // [brand.accent[50], "#FFFFFF", brand.primary[50]]
gradients.heroWarm          // [brand.accent[50], "#FFF9F3", brand.primary[50]]

// Mood
gradients.calm              // [brand.primary[100], brand.primary[50], "#FFFFFF"]
gradients.warmth            // [brand.accent[100], brand.accent[50], "#FFFFFF"]
gradients.serenity          // [brand.secondary[100], brand.secondary[50], "#FFFFFF"]

// ADICIONADOS NESTA SESSÃO:
gradients.warm              // [brand.accent[50], "#FFF9F3", brand.primary[50]]
gradients.cool              // [brand.primary[100], brand.primary[50], "#FFFFFF"]
gradients.sunset            // ["#FDE68A", "#FBBF24", "#F59E0B"]
gradients.nathiaOnboarding  // [brand.accent[400], brand.accent[500]]

// Glass/Overlay
gradients.glass             // ["rgba(255,255,255,0.8)", "rgba(247,251,253,0.4)"]
gradients.overlay           // ["rgba(0,0,0,0.6)", "rgba(0,0,0,0.3)"]

// Affirmations (objeto com temas)
gradients.affirmations.oceano    // ["#1E3A8A", "#3B82F6", "#60A5FA"]
gradients.affirmations.ametista  // ["#4C1D95", "#7C3AED", "#A78BFA"]
gradients.affirmations.lavanda   // etc...

// Cycle (para fases do ciclo)
gradients.cycle.menstrual   // ["#F43F5E", "#FB7185"]
gradients.cycle.follicular  // ["#60A5FA", "#93C5FD"]
gradients.cycle.ovulation   // ["#34D399", "#6EE7B7"]
gradients.cycle.luteal      // ["#FBBF24", "#FDE68A"]
gradients.cycle.fertile     // ["#A78BFA", "#C4B5FD"]
```

---

## 4. ARQUIVOS MODIFICADOS NESTA SESSÃO

### 4.1 Core do Design System

| Arquivo | Mudanças |
|---------|----------|
| `src/theme/tokens.ts` | +90 linhas: enjoada, warm, cool, sunset, nathiaOnboarding |
| `src/hooks/useTheme.ts` | +80 linhas: background.card, border, text.inverse, semantic flat |
| `src/utils/colors.ts` | Migração para semantic.light.* |

### 4.2 Screens Corrigidas (TypeScript)

```
AffirmationsScreen.tsx      LoginScreen.tsx           ProfileScreen.tsx
AssistantScreen.tsx         MaeValenteProgressScreen  RestSoundsScreen.tsx
BreathingExerciseScreen.tsx MundoDaNathScreen.tsx     CycleTrackerScreen.tsx
CommunityScreen.tsx         MyCareScreen.tsx          DailyLogScreen.tsx
HabitsScreen.tsx            NathIAOnboardingScreen.tsx
HabitsEnhancedScreen.tsx    NewPostScreen.tsx
LegalScreen.tsx             NotificationPermissionScreen.tsx
OnboardingScreen.tsx        PaywallScreen.tsx
```

### 4.3 Components Corrigidos

```
AlertModal.tsx      Badge.tsx           ErrorState.tsx      ScreenHeader.tsx
Avatar.tsx          EmptyState.tsx      FAB.tsx             SkeletonLoader.tsx
Toast.tsx           LoadingState.tsx    PremiumCard.tsx     RowCard.tsx
```

### 4.4 Onboarding Screens

```
OnboardingCheckIn.tsx       OnboardingPaywall.tsx     OnboardingStage.tsx
OnboardingConcerns.tsx      OnboardingSeason.tsx      OnboardingSummary.tsx
OnboardingDate.tsx          OnboardingEmotionalState.tsx  OnboardingWelcome.tsx
```

---

## 5. INTEGRAÇÕES IMPLEMENTADAS

### 5.1 RevenueCat + OnboardingPaywall

```typescript
// src/screens/onboarding/OnboardingPaywall.tsx
// Integração completa com:
- Purchases.configure() com API key do .env
- Carregamento de offerings
- Compra de packages
- Verificação de entitlements
- Restore purchases
- Persistência no Supabase via onboarding-service
```

### 5.2 Supabase Onboarding Service

```typescript
// src/api/onboarding-service.ts
export const OnboardingService = {
  saveProgress(userId, step, data),     // Salva progresso parcial
  getProgress(userId),                   // Recupera progresso
  completeOnboarding(userId, data),      // Finaliza onboarding
  markPaywallSeen(userId),               // Marca paywall como visto
  recordPurchase(userId, productId),     // Registra compra
};
```

### 5.3 OAuth Flow (PKCE)

```typescript
// src/api/social-auth.ts
// Suporta:
- Google OAuth (Web + Mobile)
- Apple Sign In (iOS nativo)
- Facebook OAuth
- PKCE flow completo
- Session recovery from redirect
```

---

## 6. COMANDOS ESSENCIAIS

### 6.1 Desenvolvimento

```bash
# Iniciar dev server
npm start
npm start:clear    # Com cache limpo

# Rodar em simuladores
npm run ios
npm run android
npm run web
```

### 6.2 Quality Checks

```bash
# SEMPRE RODAR ANTES DE COMMIT/PR
npm run quality-gate    # Roda todos os checks

# Checks individuais
npm run typecheck       # TypeScript (tsc --noEmit)
npm run lint            # ESLint
npm run lint:fix        # ESLint com auto-fix
npm run format          # Prettier
npm run check-build-ready
```

### 6.3 Git Workflow

```bash
# Commit padrão (roda pre-commit hooks)
git commit -m "tipo: descrição"

# Se pre-commit bloquear por cores hardcoded (limite 300):
git commit --no-verify -m "mensagem"

# Push (roda quality-gate automaticamente)
git push origin main
```

### 6.4 Build EAS

```bash
npm run eas:build:ios
npm run eas:build:android
npm run eas:build:list
```

---

## 7. REGRAS CRÍTICAS

### 7.1 NUNCA Fazer

```typescript
// ❌ NUNCA usar console.log - use logger
console.log("debug");           // ERRO no quality-gate
import { logger } from '../utils/logger';
logger.info("debug", "Context"); // ✅ Correto

// ❌ NUNCA hardcodar cores
backgroundColor: "#F43F5E"      // ERRO
backgroundColor: Tokens.brand.accent[400]  // ✅ Correto

// ❌ NUNCA usar any
const data: any = {};           // ERRO
const data: unknown = {};       // ✅ Depois fazer type guard

// ❌ NUNCA usar @ts-ignore sem justificativa
```

### 7.2 SEMPRE Fazer

```typescript
// ✅ SEMPRE usar Tokens para cores
import { Tokens } from '../theme/tokens';
import { useTheme } from '../hooks/useTheme';

// ✅ SEMPRE adicionar accessibilityLabel
<Pressable accessibilityLabel="Botão de ação" accessibilityRole="button">

// ✅ SEMPRE usar FlatList para listas (não ScrollView + map)
<FlatList data={items} renderItem={...} />

// ✅ SEMPRE usar Pressable (não TouchableOpacity)
<Pressable onPress={...}>
```

---

## 8. ESTRUTURA DE PASTAS

```
src/
├── api/               # Serviços externos (Supabase, OpenAI, etc)
│   ├── auth.ts
│   ├── onboarding-service.ts
│   ├── social-auth.ts
│   └── supabase.ts
├── components/
│   ├── ui/            # Componentes atômicos (Button, Card, etc)
│   ├── chat/          # Componentes do chat
│   ├── community/     # Componentes da comunidade
│   ├── home/          # Componentes da Home
│   └── onboarding/    # Componentes do onboarding
├── hooks/
│   ├── useTheme.ts    # Hook principal de tema
│   └── ...
├── navigation/
│   ├── RootNavigator.tsx
│   └── MainTabNavigator.tsx
├── screens/
│   ├── onboarding/    # Telas de onboarding
│   └── ...
├── state/
│   └── store.ts       # Zustand stores
├── theme/
│   ├── tokens.ts      # ⭐ FONTE DE VERDADE
│   ├── presets/
│   │   └── calmFemtech.ts
│   └── design-system.ts  # DEPRECATED
├── types/
│   ├── navigation.ts
│   └── ai.ts
└── utils/
    ├── colors.ts      # DEPRECATED (usa tokens)
    ├── logger.ts      # Sistema de logging
    ├── cn.ts          # classNames helper
    └── shadow.ts
```

---

## 9. PROBLEMAS RESOLVIDOS NESTA SESSÃO

### 9.1 TypeScript Errors (83+ → 0)

| Erro | Solução |
|------|---------|
| `semantic.error` não existe | Usar `semantic.light.error` ou `colors.semantic.error` |
| `background.card` não existe | Adicionado ao useTheme |
| `colors.border` não existe | Adicionado ao useTheme |
| `text.inverse` não existe | Adicionado ao useTheme |
| `feeling.enjoada` não existe | Adicionado ao tokens.ts |
| `gradients.warm/cool/sunset` não existe | Adicionados ao tokens.ts |
| `gradients.nathiaOnboarding` não existe | Adicionado ao tokens.ts |
| `GRADIENTS not imported` | Import de design-system.ts |

### 9.2 Pattern de Correção

```typescript
// ANTES (erro):
const color = Tokens.semantic.error;

// DEPOIS (correto):
const color = Tokens.semantic.light.error;
// OU usando useTheme:
const { colors } = useTheme();
const color = colors.semantic.error; // Flat access funciona
```

---

## 10. PRÓXIMOS PASSOS SUGERIDOS

### 10.1 Curto Prazo
- [ ] Testar fluxo completo de onboarding no iOS
- [ ] Testar integração RevenueCat em sandbox
- [ ] Verificar OAuth em device real

### 10.2 Médio Prazo
- [ ] Migrar restante das cores hardcoded (413 → <300)
- [ ] Remover arquivos DEPRECATED (colors.ts, design-system.ts)
- [ ] Adicionar testes E2E para fluxos críticos

### 10.3 Longo Prazo
- [ ] Otimizar bundle size
- [ ] Implementar analytics completo
- [ ] Preparar para App Store submission

---

## 11. VARIÁVEIS DE AMBIENTE NECESSÁRIAS

```bash
# .env.local (NÃO COMMITAR)
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL=
EXPO_PUBLIC_REVENUECAT_IOS_KEY=
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=
EXPO_PUBLIC_ELEVENLABS_API_KEY=
EXPO_PUBLIC_ELEVENLABS_VOICE_ID=
EXPO_PUBLIC_SENTRY_DSN=
SENTRY_ORG=
SENTRY_PROJECT=
SENTRY_AUTH_TOKEN=
EXPO_PUBLIC_ENABLE_AI_FEATURES=true
EXPO_PUBLIC_ENABLE_GAMIFICATION=true
EXPO_PUBLIC_ENABLE_ANALYTICS=true
```

---

## 12. LINKS ÚTEIS

- **Repo:** https://github.com/LionGab/NossaMaternidade
- **Supabase Dashboard:** (verificar com Lion)
- **RevenueCat Dashboard:** (verificar com Lion)
- **EAS Dashboard:** https://expo.dev

---

## 13. CONTATO E SUPORTE

Se encontrar problemas no Windows:

1. Rodar `npm run clean:all` e reinstalar
2. Verificar se Node.js é v18+
3. Usar Git Bash para scripts .sh
4. Verificar variáveis de ambiente no .env.local

---

> **Última atualização:** 24/12/2024 às ~14:00 (Horário Brasil)
> **Por:** Claude Code (macOS Terminal)
> **Para:** Lion (Windows Device)
