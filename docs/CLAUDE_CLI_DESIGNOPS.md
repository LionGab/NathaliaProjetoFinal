# Claude Code CLI Setup (DesignOps)

@System:
Você está no ambiente Claude Code CLI com MCPs ativos.
Contexto do projeto: App Nossa Maternidade — React Native / Expo.

Objetivo: garantir consistência visual, acessibilidade e performance de UI.

Agentes MCP disponíveis:
- @DesignSystem+UI (tokens, dark mode, componentes)
- @QA+Performance (auditorias e otimizações)
- @Context7 (busca técnica Reanimated/NativeWind)
- @Figma (extração/validação visual)
- @Playwright (testes visuais automatizados)

---

## 📑 Índice de Módulos

1. [Design System — Tokens & Consistência](#1️⃣-design-system--tokens--consistência)
2. [Acessibilidade — WCAG & HIG](#2️⃣-acessibilidade--wcag--hig)
3. [Performance — 60fps & Otimização](#3️⃣-performance--60fps--otimização)
4. [Dark Mode — Tema Completo](#4️⃣-dark-mode--tema-completo)
5. [Componentes — Atoms & Molecules](#5️⃣-componentes--atoms--molecules)
6. [Animações — Reanimated v3](#6️⃣-animações--reanimated-v3)
7. [Quality Gates](#🔒-quality-gate--pré-merge)

---

## 1️⃣ DESIGN SYSTEM — Tokens & Consistência

@Phase: design-system
@Agent: @DesignSystem+UI

### Objetivo
Garantir consistência total com o design system (tokens, tipografia, espaçamento, dark mode).

### Fases
1. **Auditoria** (listar problemas)
2. **Correção** (migrar hardcoded → tokens)
3. **Validação** (executar /design-check)
4. **Dark Mode + WCAG**

### Uso Prático na CLI
```bash
claude run prompts/design-system/audit
claude run prompts/design-system/fix
claude run prompts/design-system/validate
```

---

### 🧩 Prompt: Migrar Cores Hardcoded

@Agent: @DesignSystem+UI
@Command: /design-migrate

**Ação:**
Migrar cores hardcoded em [ARQUIVO/PASTA] para tokens.

**Regras:**
- Usar `COLORS` do `design-system.ts`
- Dark Mode obrigatório
- Contraste WCAG AAA

**Validação:**
- Executar `/audit-colors`
- Executar `/audit-a11y`
- Teste visual

**Exemplo:**
```bash
claude run @DesignSystem+UI fix-colors src/screens/HomeScreen.tsx
```

---

### 🧩 Prompt: Auditar Tipografia

@Agent: @DesignSystem+UI
@Command: /audit-typography

**Ação:**
Verificar se toda tipografia usa `TYPOGRAPHY` tokens do `design-system.ts`.

**Regras:**
- Fonte: DMSans (body), DMSerifDisplay (headers)
- Tamanhos: usar `TYPOGRAPHY.sizes.*`
- Pesos: usar `TYPOGRAPHY.weights.*`

**Exemplo:**
```bash
claude run @DesignSystem+UI audit-typography src/screens/
```

---

### 🧩 Prompt: Auditar Espaçamento

@Agent: @DesignSystem+UI
@Command: /audit-spacing

**Ação:**
Verificar se todo espaçamento segue grid de 8pt (`SPACING` tokens).

**Regras:**
- Usar `SPACING.xs`, `SPACING.sm`, `SPACING.md`, etc.
- Evitar valores hardcoded como `padding: 12`
- Grid de 8pt: 0, 8, 16, 24, 32, 40, 48, 64

**Exemplo:**
```bash
claude run @DesignSystem+UI audit-spacing src/components/
```

---

## 2️⃣ ACESSIBILIDADE — WCAG & HIG

@Phase: accessibility
@Agent: @DesignSystem+UI

### Objetivo
Garantir conformidade com WCAG AA/AAA e Apple HIG.

### Fases
1. **Auditoria A11y** (contraste, tap targets, labels)
2. **Correção** (ajustar cores, tamanhos, semântica)
3. **Validação** (testes com screen readers)

---

### 🧩 Prompt: Auditar Contraste

@Agent: @DesignSystem+UI
@Command: /audit-contrast

**Ação:**
Verificar contraste de cores em todos os textos e botões.

**Regras:**
- WCAG AA: 4.5:1 (texto normal), 3:1 (texto grande)
- WCAG AAA: 7:1 (texto normal), 4.5:1 (texto grande)
- Usar `COLORS.semantic.*` para estados (error, warning, success)

**Exemplo:**
```bash
claude run @DesignSystem+UI audit-contrast src/screens/
```

---

### 🧩 Prompt: Auditar Tap Targets

@Agent: @DesignSystem+UI
@Command: /audit-tap-targets

**Ação:**
Verificar se todos os elementos interativos têm no mínimo 44pt (iOS HIG).

**Regras:**
- Usar `ACCESSIBILITY.minTapTarget` (44pt)
- Botões, ícones, links: min 44x44pt
- Espaçamento entre targets: min 8pt

**Exemplo:**
```bash
claude run @DesignSystem+UI audit-tap-targets src/components/
```

---

### 🧩 Prompt: Auditar Semântica

@Agent: @DesignSystem+UI
@Command: /audit-semantics

**Ação:**
Verificar se todos os componentes têm `accessibilityLabel` e `accessibilityRole`.

**Regras:**
- Botões: `accessibilityRole="button"`
- Imagens: `accessibilityLabel` descritivo
- Estados: `accessibilityState={{ disabled: true }}`

**Exemplo:**
```bash
claude run @DesignSystem+UI audit-semantics src/screens/
```

---

## 3️⃣ PERFORMANCE — 60fps & Otimização

@Phase: performance
@Agent: @QA+Performance

### Objetivo
Garantir 60fps em animações e otimização de renderização.

### Fases
1. **Auditoria** (identificar bottlenecks)
2. **Otimização** (memoização, virtualization)
3. **Validação** (profiler, Flipper)

---

### 🧩 Prompt: Auditar Re-renders

@Agent: @QA+Performance
@Command: /audit-rerenders

**Ação:**
Identificar componentes com re-renders desnecessários.

**Regras:**
- Usar `React.memo` para componentes pesados
- Usar `useMemo` e `useCallback` quando apropriado
- Evitar object/array em Zustand selectors

**Exemplo:**
```bash
claude run @QA+Performance audit-rerenders src/screens/
```

---

### 🧩 Prompt: Auditar Listas

@Agent: @QA+Performance
@Command: /audit-lists

**Ação:**
Verificar se listas longas usam `FlatList` com `getItemLayout` e `keyExtractor`.

**Regras:**
- Usar `FlatList` (não `ScrollView` para listas longas)
- Definir `getItemLayout` para lista de altura fixa
- `keyExtractor` obrigatório e estável

**Exemplo:**
```bash
claude run @QA+Performance audit-lists src/components/
```

---

### 🧩 Prompt: Auditar Imagens

@Agent: @QA+Performance
@Command: /audit-images

**Ação:**
Verificar se imagens usam `expo-image` com `blurhash` e cache.

**Regras:**
- Usar `<Image>` do `expo-image` (não `react-native`)
- Definir `placeholder` com blurhash
- Configurar `cachePolicy`

**Exemplo:**
```bash
claude run @QA+Performance audit-images src/screens/
```

---

## 4️⃣ DARK MODE — Tema Completo

@Phase: dark-mode
@Agent: @DesignSystem+UI

### Objetivo
Implementar dark mode completo e consistente.

### Fases
1. **Auditoria** (listar cores sem dark mode)
2. **Correção** (migrar para `useTheme()`)
3. **Validação** (testar transição)

---

### 🧩 Prompt: Auditar Dark Mode

@Agent: @DesignSystem+UI
@Command: /audit-dark-mode

**Ação:**
Verificar se todos os componentes suportam dark mode.

**Regras:**
- Usar `useTheme()` hook
- Usar `COLORS.dark.*` e `COLORS.light.*`
- Testar transição light ↔ dark

**Exemplo:**
```bash
claude run @DesignSystem+UI audit-dark-mode src/screens/
```

---

### 🧩 Prompt: Implementar Dark Mode

@Agent: @DesignSystem+UI
@Command: /implement-dark-mode

**Ação:**
Implementar dark mode em [ARQUIVO] usando `useTheme()`.

**Regras:**
```typescript
const { theme } = useTheme();
const bgColor = theme === 'dark' ? COLORS.dark.background : COLORS.light.background;
```

**Exemplo:**
```bash
claude run @DesignSystem+UI implement-dark-mode src/screens/ProfileScreen.tsx
```

---

## 5️⃣ COMPONENTES — Atoms & Molecules

@Phase: components
@Agent: @DesignSystem+UI

### Objetivo
Criar biblioteca de componentes reutilizáveis seguindo Atomic Design.

### Fases
1. **Auditoria** (listar duplicações)
2. **Extração** (criar atoms/molecules)
3. **Validação** (testes visuais)

---

### 🧩 Prompt: Extrair Componente

@Agent: @DesignSystem+UI
@Command: /extract-component

**Ação:**
Extrair componente reutilizável de [ARQUIVO] para `src/components/ui/`.

**Regras:**
- Props tipadas com TypeScript
- Variantes com `cva` (class-variance-authority)
- Storybook (se disponível)

**Exemplo:**
```bash
claude run @DesignSystem+UI extract-component src/screens/HomeScreen.tsx Button
```

---

### 🧩 Prompt: Refatorar para Variantes

@Agent: @DesignSystem+UI
@Command: /refactor-variants

**Ação:**
Refatorar componente para usar sistema de variantes.

**Regras:**
```typescript
const buttonVariants = cva("base-classes", {
  variants: {
    variant: {
      primary: "bg-primary",
      secondary: "bg-secondary"
    }
  }
});
```

**Exemplo:**
```bash
claude run @DesignSystem+UI refactor-variants src/components/ui/Button.tsx
```

---

## 6️⃣ ANIMAÇÕES — Reanimated v3

@Phase: animations
@Agent: @QA+Performance + @Context7

### Objetivo
Implementar animações fluidas (60fps) usando Reanimated v3.

### Fases
1. **Auditoria** (identificar Animated deprecated)
2. **Migração** (Animated → Reanimated)
3. **Validação** (testar performance)

---

### 🧩 Prompt: Migrar Animated → Reanimated

@Agent: @QA+Performance
@Command: /migrate-reanimated

**Ação:**
Migrar animações de `Animated` (react-native) para `Reanimated` v3.

**Regras:**
- Usar `useSharedValue`, `useAnimatedStyle`, `withSpring`
- Usar `Animated.View` do Reanimated (não react-native)
- Testar 60fps no Flipper

**Exemplo:**
```bash
claude run @QA+Performance migrate-reanimated src/screens/HomeScreen.tsx
```

---

### 🧩 Prompt: Implementar Gesture

@Agent: @QA+Performance
@Command: /implement-gesture

**Ação:**
Implementar gesto (swipe, pan, pinch) usando `react-native-gesture-handler`.

**Regras:**
- Usar `GestureDetector` + `Gesture.*`
- Combinar com `useAnimatedStyle`
- Testar responsividade

**Exemplo:**
```bash
claude run @QA+Performance implement-gesture src/screens/CommunityScreen.tsx swipe-to-delete
```

---

## 🔒 QUALITY GATE — Pré-Merge

@Agent: @QA+Performance + @DesignSystem+UI

### Rodar antes de qualquer PR

1. `/audit-colors`
2. `/audit-a11y`
3. `/design-check`
4. `/design-quality`

### Critérios

✅ Zero cores hardcoded
✅ Dark Mode completo
✅ Contraste WCAG AAA
✅ Tap targets ≥44pt
✅ Código <300 LOC por componente
✅ 60fps em animações

### Uso Prático

```bash
# Rodar todos os gates
claude run quality-gate

# Ou individualmente
claude run @DesignSystem+UI audit-colors
claude run @DesignSystem+UI audit-a11y
claude run @DesignSystem+UI design-check
claude run @DesignSystem+UI design-quality
```

---

## 🔧 Convenções Claude Code CLI

### Estrutura de Comando

```bash
claude run [@Agent] [Ação] [Arquivo]
```

### Exemplos

```bash
claude run @DesignSystem+UI audit src/screens/HomeScreen.tsx
claude run @DesignSystem+UI fix-colors src/screens/
claude run @QA+Performance audit src/components/
claude run @Figma validate-frame HomeScreen
```

### Agentes Disponíveis

- `@DesignSystem+UI` — Tokens, consistência visual, dark mode
- `@QA+Performance` — Auditorias, otimizações, profiling
- `@Context7` — Busca técnica (Reanimated, NativeWind, Expo)
- `@Figma` — Extração e validação de designs
- `@Playwright` — Testes visuais automatizados

### Comandos Comuns

| Comando | Descrição |
|---------|-----------|
| `/audit-colors` | Auditoria de cores hardcoded |
| `/audit-a11y` | Auditoria de acessibilidade |
| `/design-check` | Checagem de design system |
| `/design-quality` | Quality gate completo |
| `/migrate-reanimated` | Migrar para Reanimated v3 |
| `/implement-dark-mode` | Implementar dark mode |

---

## 📚 Recursos e Referências

### Documentação Oficial

- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [NativeWind](https://www.nativewind.dev/)
- [Expo](https://docs.expo.dev/)
- [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Arquivos do Projeto

- [src/theme/design-system.ts](../src/theme/design-system.ts) — Design tokens oficial
- [docs/DESIGN_SYSTEM_MIGRATION.md](./DESIGN_SYSTEM_MIGRATION.md) — Guia de migração
- [docs/COLOR_SYSTEM.md](./COLOR_SYSTEM.md) — Sistema de cores
- [CLAUDE.md](../CLAUDE.md) — Guia geral do projeto

---

📅 **Última atualização:** 2025-12-17
👤 **Curador:** Gabriel (Lion)
🧠 **Versão Claude Code CLI:** 1.7
🧩 **Compatível com MCP:** Context7, Figma, Playwright

---

## 🎯 Próximos Passos

1. **Configurar MCPs** — Ver [docs/MCP_SETUP.md](./MCP_SETUP.md)
2. **Rodar Quality Gate** — `claude run quality-gate`
3. **Auditar projeto atual** — `claude run @DesignSystem+UI audit src/`
4. **Implementar correções** — Seguir os prompts acima por módulo
