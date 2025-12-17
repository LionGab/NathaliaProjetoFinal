# 📊 Relatório de Auditoria de Design System
**Data**: 2025-01-17  
**Escopo**: src/screens, src/components, src/hooks, src/services, src/state

---

## 📋 Resumo Executivo

| Métrica | Status | Quantidade |
|---------|--------|------------|
| **Cores Hex Hardcoded** | ⚠️ CRÍTICO | 492 linhas (fora de design-system.ts) |
| **RGBA Hardcoded** | ⚠️ ALTO | 154 linhas |
| **Tipografia Hardcoded** | ⚠️ MÉDIO | 303 linhas |
| **Dark Mode** | ✅ BOM | Maioria usa useTheme() |
| **TypeScript** | ✅ OK | 0 erros |
| **ESLint** | ⚠️ WARNINGS | 18 avisos (0 erros) |

---

## ❌ 1. CORES HARDCODED (CRÍTICO)

### 1.1 Cores Hex (#RRGGBB)

**Total**: 492 ocorrências encontradas (muitas em design-system.ts - válidas)

**Fora de design-system.ts/colors.ts:**

#### Arquivos Críticos (Precisam Migração Urgente):

1. **src/hooks/useNotifications.ts:406**
   ```typescript
   lightColor: "#f4258c"
   ```
   **Token Correto**: `COLORS.accent[500]` ou `COLORS.primary[500]`

2. **src/services/notifications.ts:60**
   ```typescript
   const NOTIFICATION_LIGHT_COLOR = "#F43F5E";
   ```
   **Token Correto**: `COLORS.accent[500]`

3. **src/state/store.ts** (múltiplas linhas: 464, 476, 488, 500, 512, 524, 536, 548)
   ```typescript
   color: "#60A5FA",  // azul
   color: "#F472B6",  // rosa
   color: "#F59E0B",  // âmbar
   color: "#FBBF24",  // amarelo
   color: "#EC4899",  // pink
   color: "#6BAD78",  // verde
   color: "#A78BFA",  // roxo
   color: "#14B8A6",  // teal
   ```
   **Token Correto**: Usar `COLORS.*` apropriados do design-system

4. **src/components/ui/Avatar.tsx:23**
   ```typescript
   fallbackColor = "#9E7269"
   ```
   **Token Correto**: `COLORS.neutral[600]` ou criar token semântico

5. **src/screens/ProfileScreen.tsx:736, 823**
   ```typescript
   color: "#FFF"  // branco hardcoded
   ```
   **Token Correto**: `colors.text.inverse` ou `COLORS.text.inverse`

### 1.2 RGBA Hardcoded (154 ocorrências)

**Problema**: Muitos `rgba()` hardcoded em overlays, backgrounds transparentes

**Arquivos Principais:**

1. **src/components/DailyCheckIn.tsx** (linhas 45, 46, 51, 52, 59)
   ```typescript
   completeBg: isDark ? "rgba(20, 184, 166, 0.15)" : DS_COLORS.semantic.successLight,
   completeBorder: isDark ? "rgba(20, 184, 166, 0.3)" : "#D1FAE5",
   modalOverlay: "rgba(0, 0, 0, 0.5)",
   ```
   **Solução**: Usar `COLORS.overlay.*` e `COLORS.semantic.successLight`

2. **src/components/CommunityComposer.tsx:306**
   ```typescript
   backgroundColor: "rgba(0, 0, 0, 0.5)",
   ```
   **Token Correto**: `COLORS.overlay.medium` ou `Tokens.overlay.medium`

3. **src/screens/HomeScreen.tsx:281, 315**
   ```typescript
   colors={["transparent", "rgba(0,0,0,0.6)"]}
   color: "rgba(255,255,255,0.9)",
   ```
   **Token Correto**: `COLORS.overlay.*` e `colors.text.inverse` com opacidade

4. **src/screens/MyCareScreen.tsx** (múltiplas linhas: 24, 27, 30, 33, 36, 38, 39, 40, 616)
   ```typescript
   lilacSoft: isDark ? "rgba(92, 163, 219, 0.15)" : DS_COLORS.secondary[50],
   borderLilac: isDark ? "rgba(92, 163, 219, 0.3)" : DS_COLORS.surface.lilacBorder,
   ```
   **Solução**: Criar tokens semânticos ou usar `COLORS.secondary[50]` com opacidade via função helper

5. **src/screens/AffirmationsScreen.tsx** (múltiplas linhas com rgba branco)
   ```typescript
   backgroundColor: "rgba(255, 255, 255, 0.03)",
   backgroundColor: "rgba(255, 255, 255, 0.15)",
   ```
   **Token Correto**: `COLORS.surface.glass` ou criar tokens de overlay específicos

6. **src/components/home/BelongingCard.tsx:49, 50, 108**
   ```typescript
   const cardBg = isDark ? "rgba(244, 37, 140, 0.08)" : COLORS.primary[50];
   backgroundColor: "rgba(255, 255, 255, 0.5)",
   ```
   **Token Correto**: Usar `COLORS.accent[50]` e `COLORS.surface.glass`

### 1.3 Cores Nominais (white/black)

**Não encontradas** - Bom sinal! Não há `color: "white"` ou `backgroundColor: "black"` hardcoded.

---

## ⚠️ 2. TIPOGRAFIA HARDCODED (MÉDIO)

**Total**: 303 ocorrências de `fontSize:` hardcoded

**Arquivos Principais:**

1. **src/screens/ProfileScreen.tsx** (30, 24, 16, 14, 20, 12)
2. **src/screens/NotificationPreferencesScreen.tsx** (18, 20, 16, 14, 15, 13)
3. **src/screens/MyCareScreen.tsx** (28, 15, 12, 18, 13, 16, 14, 17, 14, 24)
4. **src/screens/MundoDaNathScreen.tsx** (22, 10, 14, 12, 10, 16, 17, 20, 13, 12, 15)

**Token Correto**: Usar `TYPOGRAPHY.sizes.*` de `design-system.ts`

**Exemplo de Migração:**
```typescript
// ANTES
fontSize: 24

// DEPOIS
fontSize: TYPOGRAPHY.sizes.xl  // ou TYPOGRAPHY.sizes.h2
```

---

## ✅ 3. DARK MODE (BOM)

**Status**: Maioria das telas usa `useTheme()` corretamente

**Telas que usam useTheme():**
- ✅ AssistantScreen.tsx
- ✅ MyCareScreen.tsx
- ✅ LoginScreen.tsx
- ✅ RestSoundsScreen.tsx
- ✅ ProfileScreen.tsx (usa `const { colors, isDark } = useTheme();`)

**Verificar manualmente** se todas as telas têm suporte completo a dark mode.

---

## 🔧 4. QUALITY GATE

### TypeScript
✅ **0 erros** - Tudo OK!

### ESLint
⚠️ **18 warnings** (0 erros) - Não bloqueiam build, mas devem ser corrigidos:

**Principais Warnings:**
1. `react-hooks/exhaustive-deps` - Dependências faltando em hooks
2. `import/no-duplicates` - Imports duplicados
3. `import/first` - Imports fora de ordem

**Ação**: Executar `bun run lint --fix` para corrigir automaticamente alguns.

---

## 📊 5. PRIORIZAÇÃO DE CORREÇÕES

### 🔴 CRÍTICO (Fazer Agora)

1. **Migrar cores hardcoded em:**
   - `src/hooks/useNotifications.ts`
   - `src/services/notifications.ts`
   - `src/state/store.ts`
   - `src/components/ui/Avatar.tsx`
   - `src/screens/ProfileScreen.tsx` (#FFF)

2. **Criar tokens de overlay** para substituir `rgba(0, 0, 0, 0.5)` padrão

### 🟡 ALTO (Esta Semana)

1. **Migrar RGBA hardcoded** para tokens:
   - `src/components/DailyCheckIn.tsx`
   - `src/components/CommunityComposer.tsx`
   - `src/screens/HomeScreen.tsx`
   - `src/screens/MyCareScreen.tsx`
   - `src/components/home/BelongingCard.tsx`

2. **Criar helper function** para cores com opacidade:
   ```typescript
   // Exemplo
   const withOpacity = (color: string, opacity: number) => {
     // Converter hex para rgba
   };
   ```

### 🟢 MÉDIO (Próxima Sprint)

1. **Padronizar tipografia** em:
   - ProfileScreen.tsx
   - NotificationPreferencesScreen.tsx
   - MyCareScreen.tsx
   - MundoDaNathScreen.tsx

2. **Corrigir ESLint warnings**

---

## 🎯 6. RECOMENDAÇÕES

### 6.1 Criar Tokens Faltantes

Adicionar em `src/theme/design-system.ts`:

```typescript
overlay: {
  light: "rgba(0, 0, 0, 0.3)",
  medium: "rgba(0, 0, 0, 0.5)",  // Padrão para modais
  dark: "rgba(0, 0, 0, 0.7)",
  heavy: "rgba(0, 0, 0, 0.9)",
  backdrop: "rgba(0, 0, 0, 0.6)", // Para overlays de fundo
}
```

### 6.2 Helper para Opacidade

Criar `src/utils/color-helpers.ts`:

```typescript
/**
 * Adiciona opacidade a uma cor hex
 */
export function withOpacity(hex: string, opacity: number): string {
  // Implementação
}
```

### 6.3 Script de Migração Automática

Criar script que:
1. Identifica padrões comuns de cores hardcoded
2. Sugere tokens corretos
3. Gera relatório de migração

---

## ✅ 7. PRÓXIMOS PASSOS

1. ✅ **AUDITORIA COMPLETA** (FEITO - este relatório)
2. 🔄 **CRIAR TOKENS FALTANTES** (overlay, opacidade)
3. 🔄 **MIGRAR CORES CRÍTICAS** (hooks, services, state)
4. 🔄 **MIGRAR RGBA HARDCODED** (componentes principais)
5. 🔄 **PADRONIZAR TIPOGRAFIA** (telas principais)
6. 🔄 **CORRIGIR ESLINT WARNINGS**

---

## 📝 NOTAS

- **design-system.ts** e **colors.ts** têm muitas cores hex - isso é **válido** (definições de tokens)
- Foco em migrar **uso** de cores hardcoded, não definições
- Priorizar arquivos críticos (hooks, services, componentes base)
- Dark mode está bem implementado - manter padrão atual

---

**Gerado automaticamente**: 2025-01-17  
**Próxima auditoria recomendada**: Após migração de itens críticos

