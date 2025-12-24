# Plano de Excelência de Código - Nossa Maternidade

## Guia Completo para Windows Device

**Data:** 2025-01-XX  
**Contexto:** Sessão de análise profunda do código para garantir excelência profissional antes do lançamento nas stores (App Store e Google Play Store)  
**Cliente:** Nathalia Valente - Top 1 do Brasil com 40 milhões de visualizações

---

## 📋 Índice

1. [Contexto do Projeto](#contexto-do-projeto)
2. [Diagnóstico Atual](#diagnóstico-atual)
3. [Plano de Ação Detalhado](#plano-de-ação-detalhado)
4. [Comandos Windows](#comandos-windows)
5. [Checklist de Execução](#checklist-de-execução)
6. [Referências Rápidas](#referências-rápidas)

---

## 🎯 Contexto do Projeto

### Sobre o App

**Nossa Maternidade** - App mobile-first iOS/Android para acompanhamento de saúde materna no Brasil, criado pela influenciadora Nathalia Valente. App React Native com Expo SDK 54+, integração com IA (Gemini 2.5 Flash, GPT-4o, Claude), Supabase backend, e design system "Calm FemTech".

### Stack Tecnológica

- **Expo SDK 54+** (managed workflow)
- **React Native 0.81+**
- **TypeScript 5.7+** (strict mode)
- **NativeWind 4+** (Tailwind para React Native)
- **React Navigation 7**
- **Zustand** (state management)
- **Supabase** (auth/DB/storage)
- **RevenueCat** (in-app purchases)
- **Reanimated v3** (animações)

### Regras Críticas (Não-Negociáveis)

1. **TypeScript strict** - Zero `any` types
2. **Logging** - Usar `logger.*` (NUNCA `console.log`)
3. **Design System** - Apenas `tokens.ts` (fonte única de verdade)
4. **Acessibilidade** - WCAG AAA (contraste 7:1, tap targets 44pt+)
5. **Performance** - FlatList/FlashList (NUNCA ScrollView + map())
6. **Arquitetura** - Arquivos máximo 250 LOC

---

## 🔍 Diagnóstico Atual

### ✅ Pontos Positivos Identificados

1. **Quality Gate Passa**
   - TypeScript compila sem erros
   - ESLint sem bloqueios críticos
   - Build readiness verificado

2. **Arquitetura Sólida**
   - Edge Functions configuradas (Supabase)
   - Design System bem definido (Calm FemTech)
   - Componentes reutilizáveis criados
   - Hooks utilitários prontos

3. **Componentes UI Disponíveis**
   - `LoadingState` - Estado de carregamento
   - `ErrorState` - Estado de erro com retry
   - `EmptyState` - Estado vazio elegante
   - `SkeletonLoader` - Placeholder animado
   - `OfflineBanner` - Banner de conexão offline

4. **Haptics Implementado**
   - 29 telas com haptics
   - 90 usos de feedback tátil

### ❌ Problemas Críticos Encontrados

#### 1. Inconsistência no Design System

**Problema:** 58 arquivos usando sistema LEGADO (`design-system.ts`) vs 26 usando sistema NOVO (`tokens.ts`)

**Arquivos Prioritários:**

- `src/screens/NathIAOnboardingScreen.tsx` (1461 LOC)
- `src/screens/MundoDaNathScreen.tsx` (1106 LOC)
- `src/screens/ProfileScreen.tsx` (849 LOC)
- `src/screens/MyCareScreen.tsx` (807 LOC)
- `src/screens/MaeValenteProgressScreen.tsx` (819 LOC)
- - 53 outros arquivos

**Impacto:** Inconsistência visual, manutenção difícil, possível quebra em dark mode

#### 2. Arquivos Gigantes (Violam Regra de 250 LOC)

| Arquivo                        | LOC  | Ação Necessária                              |
| ------------------------------ | ---- | -------------------------------------------- |
| `NathIAOnboardingScreen.tsx`   | 1461 | Extrair 5 componentes                        |
| `AssistantScreen.tsx`          | 1110 | Extrair MessageBubble, InputArea, QuickChips |
| `MundoDaNathScreen.tsx`        | 1106 | Extrair PostCard, StoryCard, AdminModal      |
| `OnboardingScreen.tsx`         | 946  | Já modularizado (OK)                         |
| `ProfileScreen.tsx`            | 849  | Extrair DeleteAccountModal, MenuSection      |
| `MaeValenteProgressScreen.tsx` | 819  | Extrair ProgressCard, MilestoneCard          |
| `MyCareScreen.tsx`             | 807  | Extrair CareSection, AffirmationCard         |
| `HomeScreen.tsx`               | 786  | Extrair HeroCard, ProgressSection            |

**Impacto:** Performance ruim, difícil manutenção, testes complexos

#### 3. Componentes UI Não Utilizados

**Problema:** Componentes prontos em `src/components/ui/` que NÃO estão sendo usados nas telas:

- `LoadingState` - Usado em 0 telas (deveria estar em todas com fetch)
- `ErrorState` - Usado em 0 telas (deveria ter fallback de erro)
- `SkeletonLoader` - Usado em 0 telas (deveria mostrar skeleton ao carregar)
- `OfflineBanner` - Usado em 0 telas (deveria estar em telas com rede)

**Impacto:** UX inconsistente, falta de feedback visual

#### 4. TODOs Pendentes em Código de Produção

```
src/screens/onboarding/OnboardingPaywall.tsx:64
  TODO: Implementar integração real com RevenueCat

src/screens/onboarding/OnboardingWelcome.tsx:23
  TODO: Substituir por require('@/assets/onboarding/videos/welcome.mp4')
  (Atualmente usando BigBuckBunny placeholder)

src/screens/onboarding/OnboardingSummary.tsx:26
  TODO: Substituir por assets reais

src/screens/ProfileScreen.tsx:203
  TODO: Export data feature - implementation available in /delete-account edge function
```

**Impacto:** Funcionalidades incompletas, experiência degradada

#### 5. ScrollView + map() em vez de FlatList

**Problema:** 60 usos de `.map()` em telas, apenas 7 usos de FlatList/FlashList

**Impacto:** Performance ruim em listas longas, scroll lag, consumo excessivo de memória

#### 6. Acessibilidade Incompleta

**Problema:** 319 Pressables mas apenas 83 com `accessibilityLabel` (74% sem acessibilidade)

**Impacto:** App inacessível para usuários com deficiência visual, violação de guidelines das stores

---

## 🚀 Plano de Ação Detalhado

### FASE 1: Arquitetura e Refatoração (Dia 1-2)

#### 1.1 Migrar Design System (Alta Prioridade)

**Objetivo:** Migrar todos os imports de `design-system.ts` para `tokens.ts`

**Padrão de Migração:**

```typescript
// ❌ ANTES (legado)
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from "../theme/design-system";

// ✅ DEPOIS (correto)
import { Tokens } from "../theme/tokens";
import { useTheme } from "../hooks/useTheme";

// Uso em componente
const { isDark, colors } = useTheme();
const bgColor = isDark ? Tokens.surface.dark.base : Tokens.surface.light.base;
const textColor = isDark ? Tokens.neutral[100] : Tokens.neutral[900];
```

**Arquivos Prioritários (Telas Mais Vistas):**

1. `src/screens/HomeScreen.tsx`
2. `src/screens/AssistantScreen.tsx`
3. `src/screens/MyCareScreen.tsx`
4. `src/screens/CommunityScreen.tsx`
5. `src/screens/MundoDaNathScreen.tsx`
6. `src/screens/NathIAOnboardingScreen.tsx`
7. `src/screens/ProfileScreen.tsx`
8. `src/screens/MaeValenteProgressScreen.tsx`

**Comando de Verificação:**

```bash
# Windows (PowerShell)
Get-ChildItem -Path src -Recurse -Include *.tsx,*.ts | Select-String "from.*design-system" | Measure-Object

# Deve retornar 0 após migração completa
```

#### 1.2 Refatorar Arquivos Gigantes

**NathIAOnboardingScreen.tsx (1461 LOC → ~200 LOC cada)**

Estrutura proposta:

```
src/components/nathia-onboarding/
├── OptionButton.tsx       # Botão de opção reutilizável (emoji + label + description)
├── StepPhase.tsx         # Tela de fase (tentando/grávida/pós-parto)
├── StepContext.tsx       # Tela de contexto (idade, rotina)
├── StepInterests.tsx     # Tela de interesses (múltipla seleção)
├── StepMood.tsx          # Tela de humor (emoções)
├── StepPreferences.tsx   # Tela de preferências (tom, notificações)
└── index.ts              # Barrel exports
```

**AssistantScreen.tsx (1110 LOC → ~300 LOC cada)**

Estrutura proposta:

```
src/components/chat/
├── MessageBubble.tsx     # Bola de mensagem (usuário/IA)
├── InputArea.tsx         # Área de input com mic/camera/emoji
├── QuickChips.tsx        # Chips de sugestão rápida
├── TypingIndicator.tsx   # Indicador de digitação (LoadingDots)
├── ChatHeader.tsx        # Header com toggle sidebar
└── index.ts
```

**MundoDaNathScreen.tsx (1106 LOC → ~300 LOC cada)**

Estrutura proposta:

```
src/components/mundo-da-nath/
├── NathPostCard.tsx      # Card de post da Nath
├── NathStoryCard.tsx     # Card de story/destaque
├── AdminModal.tsx        # Modal para criar posts (admin)
├── PostActions.tsx       # Ações (like, comment, share)
└── index.ts
```

**Comando de Verificação:**

```bash
# Windows (PowerShell)
Get-ChildItem -Path src/screens -Include *.tsx | ForEach-Object {
    $lines = (Get-Content $_.FullName | Measure-Object -Line).Lines
    if ($lines -gt 250) {
        Write-Host "$($_.Name): $lines LOC"
    }
}
```

---

### FASE 2: UX e Estados (Dia 2-3)

#### 2.1 Implementar Loading States Globais

**Padrão a Implementar em Cada Tela:**

```typescript
import { useNetworkStatus } from "../hooks/useNetworkStatus";
import { LoadingState, ErrorState, OfflineBanner } from "../components/ui";
import { SkeletonLoader } from "../components/ui/SkeletonLoader";

export default function MyScreen() {
  const { isOffline, retry, isChecking } = useNetworkStatus();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<DataType[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await fetchData();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  };

  // Estados de UI
  if (isOffline) {
    return (
      <>
        <OfflineBanner onRetry={retry} isRetrying={isChecking} />
        <View style={{ flex: 1 }}>
          {/* Conteúdo offline ou cache */}
        </View>
      </>
    );
  }

  if (isLoading) {
    return <LoadingState message="Carregando..." />;
    // OU para listas:
    // return <SkeletonLoader count={5} />;
  }

  if (error) {
    return <ErrorState onRetry={loadData} />;
  }

  // Conteúdo principal
  return <View>...</View>;
}
```

**Telas que Precisam:**

- `CommunityScreen.tsx` - Feed de posts
- `MundoDaNathScreen.tsx` - Conteúdo da Nath
- `AssistantScreen.tsx` - Histórico de chat
- `ProfileScreen.tsx` - Dados do usuário
- `MyCareScreen.tsx` - Seções de cuidados

#### 2.2 Substituir ScrollView + map() por FlatList

**Padrão de Migração:**

```typescript
// ❌ ANTES (performance ruim)
<ScrollView>
  {posts.map((post) => (
    <PostCard key={post.id} post={post} />
  ))}
</ScrollView>

// ✅ DEPOIS (performance otimizada)
<FlatList
  data={posts}
  keyExtractor={(item) => item.id}
  renderItem={({ item, index }) => (
    <PostCard post={item} index={index} />
  )}
  ListEmptyComponent={<EmptyState icon="document-outline" title="Nenhum post ainda" />}
  initialNumToRender={10}
  maxToRenderPerBatch={5}
  windowSize={10}
  removeClippedSubviews={true}
  onEndReached={loadMore}
  onEndReachedThreshold={0.5}
/>
```

**Arquivos Prioritários:**

- `MundoDaNathScreen.tsx` - Feed de posts
- `NathIAOnboardingScreen.tsx` - Lista de opções
- `MaeValenteProgressScreen.tsx` - Lista de marcos
- `MyCareScreen.tsx` - Lista de seções

---

### FASE 3: Acessibilidade Completa (Dia 3)

#### 3.1 Adicionar accessibilityLabel em Todos os Pressables

**Padrão Obrigatório:**

```typescript
<Pressable
  onPress={handlePress}
  accessibilityRole="button"
  accessibilityLabel="Enviar mensagem para NathIA"
  accessibilityHint="Abre o chat com a assistente virtual"
  accessibilityState={{ disabled: isLoading }}
  style={({ pressed }) => [
    styles.button,
    { opacity: pressed ? 0.8 : 1 }
  ]}
>
  <Text>Enviar</Text>
</Pressable>
```

**Verificação:**

```bash
# Windows (PowerShell)
Get-ChildItem -Path src/screens -Recurse -Include *.tsx | Select-String "Pressable" | Measure-Object
# Comparar com:
Get-ChildItem -Path src/screens -Recurse -Include *.tsx | Select-String "accessibilityLabel" | Measure-Object
```

#### 3.2 Garantir Tap Targets de 44pt

**Padrão Obrigatório:**

```typescript
// Mínimo obrigatório
style={{
  minHeight: 44,
  minWidth: 44,
  // OU se conteúdo for menor que 20px:
  padding: 12, // garante área de toque de 44pt
}}
```

**Verificação Manual:**

- Testar em dispositivo físico
- Usar React Native Debugger para inspecionar dimensões
- Verificar em diferentes tamanhos de tela

---

### FASE 4: TODOs e Integração (Dia 4)

#### 4.1 Resolver OnboardingPaywall TODO

**Arquivo:** `src/screens/onboarding/OnboardingPaywall.tsx:64`

**Implementação:**

```typescript
import { purchasePackage, getOfferings } from "../services/revenuecat";
import { usePremiumStore } from "../state/premium-store";

const handleStartTrial = async () => {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Se needsExtraCare, pular paywall e dar 7 dias grátis
    if (needsExtraCareFlag) {
      logger.info("Skipping paywall for extra care user", "OnboardingPaywall");
      await handleComplete();
      return;
    }

    // Integração real com RevenueCat
    const offerings = await getOfferings();
    if (!offerings?.current?.availablePackages[0]) {
      logger.error("No packages available", "OnboardingPaywall");
      await handleComplete(); // Fallback: continuar sem premium
      return;
    }

    const packageToPurchase = offerings.current.availablePackages[0];
    const result = await purchasePackage(packageToPurchase);

    if (result.customerInfo.entitlements.active["premium"]) {
      setPremium(true);
      logger.info("Premium activated", "OnboardingPaywall");
    }

    await handleComplete();
  } catch (error) {
    logger.error("Error starting trial", "OnboardingPaywall", error);
    // Continuar mesmo se falhar (graceful degradation)
    await handleComplete();
  }
};
```

#### 4.2 Substituir Video Placeholder

**Arquivo:** `src/screens/onboarding/OnboardingWelcome.tsx:23`

**Opções:**

**Opção 1: Video Real da Nath**

```typescript
const WELCOME_VIDEO = require("../../assets/onboarding/videos/welcome.mp4");
```

**Opção 2: Imagem com Animação (Mais Seguro para v1)**

```typescript
import { Image } from "expo-image";
import Animated, { FadeIn } from "react-native-reanimated";

<Animated.View entering={FadeIn.duration(1000)}>
  <Image
    source={require("../../assets/onboarding/images/nath-welcome.jpg")}
    style={StyleSheet.absoluteFill}
    contentFit="cover"
    transition={500}
  />
</Animated.View>
```

**Opção 3: Lottie Animation**

```typescript
import LottieView from "lottie-react-native";

<LottieView
  source={require("../../assets/onboarding/animations/welcome.json")}
  autoPlay
  loop={false}
  style={StyleSheet.absoluteFill}
/>
```

**Recomendação:** Opção 2 (imagem com animação) para v1, migrar para vídeo real depois.

---

### FASE 5: Performance e Polish (Dia 5)

#### 5.1 Memoização de Componentes

**Padrão:**

```typescript
import React from "react";

const PostCard = React.memo<PostCardProps>(
  ({ post, onLike, onComment }) => {
    // ...
  },
  (prevProps, nextProps) => {
    // Comparação customizada (opcional)
    return (
      prevProps.post.id === nextProps.post.id && prevProps.post.isLiked === nextProps.post.isLiked
    );
  }
);

PostCard.displayName = "PostCard";
```

**Componentes Prioritários:**

- `PostCard.tsx` (CommunityScreen)
- `MessageBubble` (AssistantScreen)
- `OptionButton` (NathIAOnboardingScreen)
- `NathPostCard` (MundoDaNathScreen)

#### 5.2 Lazy Loading de Telas Pesadas

**Implementação:**

```typescript
// Em RootNavigator.tsx
import React, { Suspense } from "react";
import { LoadingState } from "../components/ui";

const MundoDaNathScreen = React.lazy(
  () => import("../screens/MundoDaNathScreen")
);

// No navigator:
<Suspense fallback={<LoadingState fullScreen />}>
  <MundoDaNathScreen />
</Suspense>
```

#### 5.3 Otimizar Imagens

**Migração para expo-image:**

```typescript
// ❌ ANTES
import { Image } from "react-native";

<Image source={{ uri: imageUrl }} />

// ✅ DEPOIS
import { Image } from "expo-image";

<Image
  source={{ uri: imageUrl }}
  placeholder={blurhash} // Opcional: blurhash para placeholder
  contentFit="cover"
  transition={200}
  cachePolicy="memory-disk"
/>
```

---

## 💻 Comandos Windows

### Setup Inicial

```powershell
# 1. Clonar repositório
git clone https://github.com/seu-usuario/NossaMaternidade.git
cd NossaMaternidade

# 2. Instalar dependências (usar npm ou bun)
npm install
# OU
bun install

# 3. Verificar ambiente
npm run check-env

# 4. Verificar setup completo
npm run verify-setup
```

### Desenvolvimento

```powershell
# Iniciar Expo dev server
npm start
# OU com cache limpo
npm run start:clear

# Rodar no Android (requer Android Studio + emulador)
npm run android

# Rodar no iOS (NÃO suportado no Windows - usar EAS Build)
npm run dev:ios
# Retorna: "iOS local não suportado no Windows. Use: npm run build:dev:ios"

# Rodar no navegador (web)
npm run web
```

### Quality Checks

```powershell
# Quality gate completo (TypeScript + ESLint + Build check + console.log check)
npm run quality-gate

# Verificação individual
npm run typecheck    # TypeScript
npm run lint         # ESLint
npm run lint:fix     # Auto-fix ESLint
npm run format       # Prettier

# Diagnóstico de produção
npm run diagnose:production
```

### Builds (EAS)

```powershell
# Builds de desenvolvimento
npm run build:dev:android    # Android dev build
npm run build:dev:ios        # iOS dev build (cloud)

# Builds de preview
npm run build:preview:android
npm run build:preview:ios

# Builds de produção
npm run build:production:android
npm run build:production:ios

# Listar builds
npm run eas:build:list
```

### Utilitários

```powershell
# Limpar cache
npm run clean

# Limpar tudo (incluindo node_modules)
npm run clean:all

# Verificar variáveis de ambiente
npm run check-env

# Testar OAuth providers
npm run test:oauth

# Setup secrets do Supabase
npm run setup-secrets
```

### Scripts Específicos Windows

```powershell
# Usar Git Bash para scripts .sh
bash scripts/quality-gate.sh

# OU usar npm scripts (que chamam bash internamente)
npm run quality-gate

# PowerShell para buscar arquivos grandes
Get-ChildItem -Path src/screens -Include *.tsx | ForEach-Object {
    $lines = (Get-Content $_.FullName | Measure-Object -Line).Lines
    if ($lines -gt 250) {
        Write-Host "$($_.Name): $lines LOC"
    }
}

# Buscar imports do design-system legado
Get-ChildItem -Path src -Recurse -Include *.tsx,*.ts | Select-String "from.*design-system"

# Contar Pressables sem accessibilityLabel
Get-ChildItem -Path src/screens -Recurse -Include *.tsx | Select-String "Pressable" | Measure-Object
Get-ChildItem -Path src/screens -Recurse -Include *.tsx | Select-String "accessibilityLabel" | Measure-Object
```

---

## ✅ Checklist de Execução

### FASE 1: Arquitetura

- [ ] Migrar `HomeScreen.tsx` para `tokens.ts`
- [ ] Migrar `AssistantScreen.tsx` para `tokens.ts`
- [ ] Migrar `MyCareScreen.tsx` para `tokens.ts`
- [ ] Migrar `CommunityScreen.tsx` para `tokens.ts`
- [ ] Migrar `MundoDaNathScreen.tsx` para `tokens.ts`
- [ ] Migrar `NathIAOnboardingScreen.tsx` para `tokens.ts`
- [ ] Migrar `ProfileScreen.tsx` para `tokens.ts`
- [ ] Migrar `MaeValenteProgressScreen.tsx` para `tokens.ts`
- [ ] Verificar: `Get-ChildItem -Path src -Recurse -Include *.tsx,*.ts | Select-String "from.*design-system"` retorna 0
- [ ] Extrair componentes de `NathIAOnboardingScreen.tsx` (1461 LOC)
- [ ] Extrair componentes de `AssistantScreen.tsx` (1110 LOC)
- [ ] Extrair componentes de `MundoDaNathScreen.tsx` (1106 LOC)
- [ ] Extrair componentes de `ProfileScreen.tsx` (849 LOC)
- [ ] Extrair componentes de `MaeValenteProgressScreen.tsx` (819 LOC)
- [ ] Extrair componentes de `MyCareScreen.tsx` (807 LOC)
- [ ] Extrair componentes de `HomeScreen.tsx` (786 LOC)
- [ ] Verificar: Nenhum arquivo > 250 LOC

### FASE 2: UX e Estados

- [ ] Adicionar `LoadingState` em `CommunityScreen.tsx`
- [ ] Adicionar `LoadingState` em `MundoDaNathScreen.tsx`
- [ ] Adicionar `LoadingState` em `AssistantScreen.tsx`
- [ ] Adicionar `ErrorState` em todas as telas com fetch
- [ ] Adicionar `OfflineBanner` em todas as telas com rede
- [ ] Substituir ScrollView + map() por FlatList em `MundoDaNathScreen.tsx`
- [ ] Substituir ScrollView + map() por FlatList em `NathIAOnboardingScreen.tsx`
- [ ] Substituir ScrollView + map() por FlatList em `MaeValenteProgressScreen.tsx`
- [ ] Substituir ScrollView + map() por FlatList em `MyCareScreen.tsx`
- [ ] Verificar: `Get-ChildItem -Path src/screens -Recurse -Include *.tsx | Select-String "ScrollView.*map"` retorna 0

### FASE 3: Acessibilidade

- [ ] Adicionar `accessibilityLabel` em todos os Pressables de `HomeScreen.tsx`
- [ ] Adicionar `accessibilityLabel` em todos os Pressables de `AssistantScreen.tsx`
- [ ] Adicionar `accessibilityLabel` em todos os Pressables de `CommunityScreen.tsx`
- [ ] Adicionar `accessibilityLabel` em todos os Pressables de `MyCareScreen.tsx`
- [ ] Adicionar `accessibilityLabel` em todos os Pressables de `MundoDaNathScreen.tsx`
- [ ] Adicionar `accessibilityLabel` em todos os Pressables de `ProfileScreen.tsx`
- [ ] Adicionar `accessibilityLabel` em todos os Pressables de `NathIAOnboardingScreen.tsx`
- [ ] Verificar: 100% dos Pressables têm `accessibilityLabel`
- [ ] Verificar: Todos os botões têm `minHeight: 44` ou `padding: 12`

### FASE 4: TODOs

- [ ] Implementar RevenueCat em `OnboardingPaywall.tsx`
- [ ] Substituir vídeo placeholder em `OnboardingWelcome.tsx`
- [ ] Substituir assets placeholder em `OnboardingSummary.tsx`
- [ ] Implementar export data em `ProfileScreen.tsx`
- [ ] Verificar: `Get-ChildItem -Path src -Recurse -Include *.tsx,*.ts | Select-String "TODO|FIXME"` retorna 0

### FASE 5: Performance

- [ ] Adicionar `React.memo` em `PostCard.tsx`
- [ ] Adicionar `React.memo` em `MessageBubble` (AssistantScreen)
- [ ] Adicionar `React.memo` em `OptionButton` (NathIAOnboardingScreen)
- [ ] Implementar lazy loading em `MundoDaNathScreen.tsx`
- [ ] Migrar todas as imagens para `expo-image`
- [ ] Verificar performance com React DevTools Profiler

### Validação Final

- [ ] `npm run quality-gate` passa sem erros
- [ ] `npm run diagnose:production` passa sem erros
- [ ] Testar em dispositivo físico Android
- [ ] Testar acessibilidade com TalkBack (Android)
- [ ] Testar offline mode (modo avião)
- [ ] Verificar logs: zero `console.log` (apenas `logger.*`)

---

## 📚 Referências Rápidas

### Arquivos Importantes

| Arquivo                 | Propósito                              |
| ----------------------- | -------------------------------------- |
| `CLAUDE.md`             | Regras críticas do projeto             |
| `src/theme/tokens.ts`   | Design System (fonte única de verdade) |
| `src/utils/logger.ts`   | Sistema de logging centralizado        |
| `src/state/store.ts`    | Todos os stores Zustand                |
| `src/hooks/useTheme.ts` | Hook para tema (light/dark)            |
| `src/components/ui/`    | Componentes UI reutilizáveis           |
| `package.json`          | Scripts e dependências                 |

### Padrões de Código

**Import de Tokens:**

```typescript
import { Tokens } from "../theme/tokens";
import { useTheme } from "../hooks/useTheme";
```

**Logging:**

```typescript
import { logger } from "../utils/logger";

logger.info("Mensagem", "Contexto", { metadata });
logger.error("Erro", "Contexto", error);
```

**Zustand Selector:**

```typescript
// ✅ BOM
const user = useAppStore((s) => s.user);
const setUser = useAppStore((s) => s.setUser);

// ❌ RUIM
const { user, setUser } = useAppStore((s) => ({ user: s.user, setUser: s.setUser }));
```

**Acessibilidade:**

```typescript
<Pressable
  accessibilityRole="button"
  accessibilityLabel="Descrição clara"
  accessibilityHint="O que acontece ao pressionar"
  style={{ minHeight: 44 }}
>
```

### Comandos Úteis Windows

```powershell
# Buscar arquivos grandes
Get-ChildItem -Path src/screens -Include *.tsx | ForEach-Object {
    $lines = (Get-Content $_.FullName | Measure-Object -Line).Lines
    if ($lines -gt 250) { Write-Host "$($_.Name): $lines LOC" }
}

# Buscar imports legados
Get-ChildItem -Path src -Recurse -Include *.tsx,*.ts | Select-String "from.*design-system"

# Contar TODOs
Get-ChildItem -Path src -Recurse -Include *.tsx,*.ts | Select-String "TODO|FIXME" | Measure-Object

# Verificar console.log (deve retornar 0)
Get-ChildItem -Path src -Recurse -Include *.tsx,*.ts | Select-String "console\.log" | Measure-Object
```

---

## 🎯 Objetivo Final

Garantir que o app **Nossa Maternidade** esteja em nível de **excelência profissional** antes do lançamento nas stores, atendendo aos padrões de qualidade esperados para uma influenciadora top 1 do Brasil com 40 milhões de visualizações.

**Critérios de Sucesso:**

- ✅ Zero erros no quality gate
- ✅ Zero TODOs em código de produção
- ✅ 100% de acessibilidade (WCAG AAA)
- ✅ Performance otimizada (FlatList, memoização)
- ✅ UX consistente (LoadingState, ErrorState em todas as telas)
- ✅ Design System unificado (apenas tokens.ts)

---

**Última Atualização:** 2025-01-XX  
**Próxima Revisão:** Após conclusão de cada fase
