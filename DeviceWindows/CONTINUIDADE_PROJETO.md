# Nossa Maternidade - Guia de Continuidade para Windows

> **Data:** 24/12/2024
> **Sessao Mac:** Migracao Design System Completa
> **Status:** Quality Gate PASSOU

---

## RESUMO EXECUTIVO

### O Que Foi Feito (Mac - 24/12/2024)

1. **Migracao completa de 16 arquivos** de `design-system.ts` para `tokens.ts`
2. **Quality Gate passou** - TypeScript OK, ESLint OK, Build Ready
3. **Zero arquivos** ainda importando de `design-system.ts`

### Estado Atual do Projeto

```
Quality Gate: PASSED
TypeScript:   0 errors
ESLint:       6 warnings, 0 errors
Build Ready:  YES
```

---

## ARQUITETURA DE TOKENS (CRITICO)

### Fonte Unica de Verdade

```
src/theme/tokens.ts  <-- USAR ESTE (Calm FemTech preset)
src/theme/design-system.ts  <-- DEPRECATED (nao usar)
```

### Como Importar Corretamente

```typescript
// Para componentes simples
import { brand, neutral, spacing, radius, shadows } from "../theme/tokens";

// Para acesso completo
import { Tokens } from "../theme/tokens";
// Uso: Tokens.brand.primary[500], Tokens.neutral[900], etc.

// Para hooks com tema
import { useTheme } from "../hooks/useTheme";
const { colors, isDark, brand, text, semantic } = useTheme();
```

### Padrao de Alias de Compatibilidade

Quando migrar arquivos antigos, use este padrao:

```typescript
// ANTES (antigo)
import { COLORS, SPACING, RADIUS } from "../theme/design-system";

// DEPOIS (novo) - com alias de compatibilidade
import { brand, neutral, spacing, radius } from "../theme/tokens";

// Aliases para nao quebrar codigo existente
const COLORS = {
  primary: brand.primary,
  accent: brand.accent,
  neutral: neutral
};
const SPACING = spacing;
const RADIUS = radius;
```

---

## PALETA CALM FEMTECH

### Cores de Marca

| Token | Uso | Proporcao |
|-------|-----|-----------|
| `brand.primary` | Azul - Calma, confianca | 70-80% |
| `brand.accent` | Rosa - CTAs, destaques | 10-15% |
| `brand.secondary` | Lilac - Secundarios | 10-15% |
| `brand.teal` | Verde - Saude | Pontual |

### Neutros

```typescript
Tokens.neutral[0]   // #FFFFFF (branco)
Tokens.neutral[50]  // Background claro
Tokens.neutral[100] // Background secundario
Tokens.neutral[400] // Texto muted
Tokens.neutral[600] // Texto secundario
Tokens.neutral[900] // Texto principal / sombras
```

### Semanticos

```typescript
Tokens.semantic.light.success   // #10B981
Tokens.semantic.light.warning   // #F59E0B
Tokens.semantic.light.error     // #EF4444
Tokens.semantic.light.info      // #3B82F6
```

### Gradientes Disponiveis

```typescript
Tokens.gradients.primary        // Azul principal
Tokens.gradients.accent         // Rosa accent
Tokens.gradients.heroAccent     // Hero com rosa
Tokens.gradients.nathiaOnboarding // Onboarding NathIA
Tokens.gradients.warm           // Quente
Tokens.gradients.cool           // Frio
```

---

## COMANDOS ESSENCIAIS

### Desenvolvimento

```bash
npm start            # Inicia Expo dev server
npm start:clear      # Inicia com cache limpo
npm run ios          # iOS simulator
npm run android      # Android emulator
npm run web          # Web browser
```

### Quality Checks (SEMPRE ANTES DE PR)

```bash
npm run quality-gate  # COMPLETO - roda todos abaixo
npm run typecheck     # TypeScript (tsc --noEmit)
npm run lint          # ESLint
npm run lint:fix      # Auto-fix ESLint
npm run format        # Prettier
```

### Build

```bash
npm run eas:build:ios     # Build iOS
npm run eas:build:android # Build Android
npm run eas:build:list    # Lista builds
```

### Limpeza

```bash
npm run clean        # Limpa cache Metro/Expo
npm run clean:all    # Nuclear clean (inclui node_modules)
```

### Windows Especifico

```bash
# Se .sh scripts nao funcionarem, use Git Bash ou:
bash scripts/quality-gate.sh

# Ou use os comandos npm equivalentes
npm run quality-gate
```

---

## REGRAS CRITICAS (CLAUDE.md)

### TypeScript
- **Strict mode** - ZERO `any` types
- **NUNCA** `@ts-ignore` sem justificativa explicita

### Logging
- **NUNCA** `console.log` - Quality gate falha
- **SEMPRE** usar `logger.*` de `src/utils/logger.ts`
- Pattern: `logger.info('message', 'context', metadata?)`

### Cores/Design
- **NUNCA** hardcode cores (`#xxx`, `rgba()`, `'white'`)
- **SEMPRE** usar `Tokens.*` ou `useTheme()`
- Overlays: `Tokens.overlay.light/medium/dark/heavy`

### Performance
- **NUNCA** `ScrollView + map()` - usar `FlatList`
- Memoizacao: `React.memo()` para listas
- Imagens: `expo-image` com blurhash

### Acessibilidade
- Tap targets minimo **44pt**
- **SEMPRE** `accessibilityLabel` e `accessibilityRole`
- Contraste WCAG AAA (7:1)

### Seguranca
- **NUNCA** expor API keys
- **NUNCA** modificar `.env*` files diretamente
- **SEMPRE** RLS habilitado no Supabase

---

## ESTRUTURA DE ARQUIVOS

```
src/
├── api/           # Clientes externos (OpenAI, Grok, Supabase)
│   ├── chat-service.ts    # AI Chat
│   ├── social-auth.ts     # OAuth providers
│   └── supabase.ts        # Cliente Supabase
│
├── components/    # UI reutilizavel
│   ├── ui/        # Atoms (Button, Card, Input)
│   ├── home/      # Componentes da Home
│   └── community/ # Componentes da Community
│
├── screens/       # Telas completas
│   ├── LoginScreen.tsx
│   ├── HomeScreen.tsx
│   ├── AssistantScreen.tsx
│   └── onboarding/
│
├── navigation/    # Navegacao
│   ├── RootNavigator.tsx
│   └── MainTabNavigator.tsx
│
├── state/         # Zustand stores
│   └── store.ts   # TODOS os stores centralizados
│
├── theme/         # Design System
│   ├── tokens.ts  # FONTE UNICA DE VERDADE
│   ├── design-system.ts  # DEPRECATED
│   └── presets/calmFemtech.ts
│
├── hooks/         # Custom hooks
│   ├── useTheme.ts
│   └── useCommunity.ts
│
├── types/         # TypeScript definitions
│   ├── navigation.ts
│   └── ai.ts
│
└── utils/         # Helpers
    ├── logger.ts  # USAR ESTE para logs
    ├── cn.ts      # classNames helper
    └── shadow.ts
```

---

## ZUSTAND STORES

### Stores Disponiveis

| Store | Persisted | Proposito |
|-------|-----------|-----------|
| `useAppStore` | Yes | User profile, onboarding |
| `useCommunityStore` | No | Posts, groups |
| `useChatStore` | Yes | AI conversation |
| `useCycleStore` | Yes | Ciclo menstrual |
| `useAffirmationsStore` | Yes | Afirmacoes |
| `useHabitsStore` | Yes | 8 habitos wellness |
| `useCheckInStore` | Yes | Daily check-ins |

### Padrao Selector (EVITAR LOOPS)

```typescript
// CORRETO: Selectors individuais
const user = useAppStore((s) => s.user);
const setUser = useAppStore((s) => s.setUser);

// ERRADO: Object selector cria nova ref cada render
const { user, setUser } = useAppStore((s) => ({
  user: s.user,
  setUser: s.setUser
}));
```

---

## ARQUIVOS MIGRADOS (16 TOTAL)

### Utilitarios
- [x] `src/hooks/useTheme.ts`
- [x] `src/utils/colors.ts`

### Screens
- [x] `src/screens/ProfileScreen.tsx`
- [x] `src/screens/PaywallScreen.tsx`
- [x] `src/screens/RestSoundsScreen.tsx`
- [x] `src/screens/NotificationPermissionScreen.tsx`
- [x] `src/screens/MyCareScreen.tsx`
- [x] `src/screens/MaeValenteProgressScreen.tsx`
- [x] `src/screens/HabitsEnhancedScreen.tsx`
- [x] `src/screens/BreathingExerciseScreen.tsx`
- [x] `src/screens/CommunityScreen.tsx`
- [x] `src/screens/MundoDaNathScreen.tsx`
- [x] `src/screens/NathIAOnboardingScreen.tsx`

### Components
- [x] `src/components/community/PostCard.tsx`
- [x] `src/components/community/ComposerCard.tsx`
- [x] `src/components/home/EmotionalCheckInPrimary.tsx`

---

## TAREFAS PENDENTES

### Prioridade Alta
- [ ] Resolver TODOs: RevenueCat paywall integration
- [ ] Video welcome assets reais
- [ ] Assets reais da Nathalia

### Ja Concluidos
- [x] Migracao design-system -> tokens (16 arquivos)
- [x] Quality gate passando
- [x] TypeScript sem erros
- [x] ESLint sem erros (apenas warnings)

---

## NAVEGACAO DO APP

```
RootNavigator (Native Stack)
├── 1. LoginScreen (if !isAuthenticated)
├── 2. NotificationPermissionScreen (if !notificationSetupDone)
├── 3. OnboardingScreen (6 steps)
├── 4. NathIAOnboardingScreen (5 steps AI)
└── 5. MainTabs (Bottom Tab Navigator)
    ├── Home         → HomeScreen
    ├── Ciclo        → CycleTrackerScreen
    ├── NathIA       → AssistantScreen (AI chat)
    ├── Comunidade   → CommunityScreen
    └── Meus Cuidados → MyCareScreen
```

---

## DICAS PARA WINDOWS

### Git Bash
Use Git Bash para rodar scripts `.sh`:
```bash
bash scripts/quality-gate.sh
```

### LightningCSS Fix
O `postinstall` ja corrige automaticamente issues com LightningCSS no Windows x64.

### Variáveis de Ambiente
- Variaveis publicas: `EXPO_PUBLIC_*` (expostas ao cliente)
- Variaveis privadas: Backend only (Supabase Edge Functions)

---

## CHECKLIST ANTES DE COMMIT

1. [ ] `npm run quality-gate` passou
2. [ ] Nenhum `console.log` no codigo
3. [ ] Nenhum `any` type
4. [ ] Cores usando `Tokens.*` ou `useTheme()`
5. [ ] `accessibilityLabel` em Pressables
6. [ ] Imports de `tokens.ts`, NAO de `design-system.ts`

---

## CONTATO/CONTEXTO

Este documento foi gerado automaticamente pela sessao Mac em 24/12/2024.
Para duvidas, consulte o `CLAUDE.md` na raiz do projeto.

**Ultimo commit relevante:** Migracao design-system completa
