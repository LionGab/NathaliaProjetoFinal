# Design System Calm FemTech 2025 - Nossa Maternidade

**Data**: 16 de dezembro de 2025
**Status**: Implementado - Fase 1-3 Completas

---

## Visão Geral

Sistema de design híbrido **Azul (base calm) + Rosa (accent CTAs)** implementado para o app Nossa Maternidade.

### Princípios Fundamentais

1. **Baixo estímulo visual** - Reduz sobrecarga/ansiedade
2. **Azul domina superfícies** - Calma, confiança, estrutura
3. **Rosa aparece pontualmente** - CTAs, warmth, "momentos de alegria" (máx 10-15% da tela)
4. **Accessibility-first** - WCAG AAA, 44pt tap targets, contraste 4.5:1+

---

## Arquitetura de Arquivos

```
src/theme/
├── tokens.ts          # FONTE ÚNICA DE VERDADE (novo)
├── design-system.ts   # Exports compat para código legado
└── (colors.ts)        # DEPRECATED - re-exports

src/hooks/
└── useTheme.ts        # Hook atualizado com novos tokens

tailwind.config.js     # Sincronizado com tokens.ts
```

---

## Paleta de Cores

### Brand Tokens

| Token | Cor | Hex | Uso |
|-------|-----|-----|-----|
| `brand.primary` | Azul Pastel | `#7DB9D5` | Superfícies, navegação, estrutura |
| `brand.accent` | Rosa Vibrante | `#F4258C` | CTAs principais, destaques, alegria |
| `brand.secondary` | Lilás | `#A855F7` | Meditação, introspecção, apoio |
| `brand.teal` | Teal | `#14B8A6` | Saúde, bem-estar físico |

### Hierarquia de Uso

```
1. CTA Principal      → brand.accent[500] (#F4258C) - Rosa
2. Ação Primária      → brand.primary[500] (#7DB9D5) - Azul
3. Ação Secundária    → brand.primary[400] outline
4. Ação Terciária     → Ghost (transparente)
```

### Surface Tokens

```typescript
surface.light = {
  base: "#F7FBFD",      // Background principal (azul clarinho)
  card: "#FFFFFF",       // Cards
  tertiary: "#EDF4F8",   // Separadores
}

surface.dark = {
  base: "#0F1419",       // Azul muito escuro (não preto)
  card: "#1A2027",       // Cards
  tertiary: "#242D36",   // Separadores
}
```

### Feeling Tokens (Check-in Emocional)

| Estado | Cor | Hex |
|--------|-----|-----|
| Bem | Amarelo pastel | `#FFE4B5` |
| Cansada | Azul pastel | `#BAE6FD` |
| Indisposta | Lavanda | `#DDD6FE` |
| Amada | Rosa pastel | `#FECDD3` |
| Ansiosa | Coral pastel | `#FED7AA` |

---

## Componentes Atualizados

### Button

Novas variantes:

```tsx
// Rosa CTA - Destaque máximo
<Button variant="accent" onPress={handleSave}>Salvar</Button>

// Azul pastel - Ação primária calma
<Button variant="primary" onPress={handleNext}>Próximo</Button>

// Outline azul - Secundário
<Button variant="secondary" icon="heart">Favoritar</Button>

// Sem fundo - Terciário
<Button variant="ghost" onPress={handleCancel}>Cancelar</Button>
```

### Card

Novas variantes:

```tsx
<Card variant="default" />     // Fundo branco
<Card variant="elevated" />    // Com sombra
<Card variant="outlined" />    // Borda sutil
<Card variant="soft" />        // Fundo azul suave
<Card variant="accent" />      // Borda rosa (destaques)
```

---

## useTheme Hook

```typescript
const {
  // Compat legado
  colors,           // COLORS ou COLORS_DARK
  isDark,

  // Novos tokens semânticos
  brand,            // { primary, accent, secondary, teal }
  surface,          // { base, card, elevated, ... }
  text,             // { primary, secondary, accent, link }
  semantic,         // { success, warning, error, info }
  neutral,          // { 0-900 }
  feeling,          // { bem, cansada, indisposta, amada, ansiosa }

  // Layout/Style
  spacing,          // { xs, sm, md, lg, xl, 2xl, ... }
  radius,           // { none, xs, sm, md, lg, xl, 2xl, full }
  shadows,          // { none, sm, md, lg, xl, accentGlow }
  gradients,        // { primary, accent, heroLight, ... }
  typography,       // { displayLarge, bodyMedium, ... }
} = useTheme();
```

---

## Tailwind Config

Sincronizado com tokens.ts:

```javascript
colors: {
  primary: { 500: "#7DB9D5" },   // Azul
  accent: { 500: "#F4258C" },    // Rosa
  secondary: { 500: "#A855F7" }, // Lilás
  teal: { 500: "#14B8A6" },      // Teal
  // ...
}
```

---

## Arquivos Modificados

### Fase 1 - Tokens Canônicos
- [x] `src/theme/tokens.ts` - CRIADO
- [x] `src/hooks/useTheme.ts` - Atualizado
- [x] `tailwind.config.js` - Sincronizado

### Fase 2 - Componentes Base
- [x] `src/components/ui/Button.tsx` - Nova variante accent
- [x] `src/components/ui/Card.tsx` - Nova variante accent

### Fase 3 - Telas Flagship
- [x] `src/screens/HomeScreen.tsx` - Migrada para novos tokens
  - "Mundo da Nath" agora usa gradiente rosa (accent)

### Migrações Anteriores (sessão anterior)
- [x] `src/components/DailyCheckIn.tsx`
- [x] `src/components/CommunityComposer.tsx`
- [x] `src/screens/LegalScreen.tsx`
- [x] `src/screens/RestSoundsScreen.tsx`

---

## Próximos Passos (Fase 4-5)

### Fase 4 - Escala Controlada
- [ ] Migrar MyCareScreen
- [ ] Migrar AssistantScreen
- [ ] Migrar PaywallScreen
- [ ] Migrar NathIAOnboardingScreen

### Fase 5 - Unificação Tailwind
- [ ] Garantir que todas as classes Tailwind usem as cores corretas
- [ ] Remover cores hardcoded restantes (~190)

---

## Validação

```bash
bun run typecheck  # ✅ Passa
bun run lint       # ✅ Passa
```

---

## Regras de Ouro

1. **CTAs rosa apenas quando for ação PRINCIPAL de destaque**
2. **Superfícies sempre azul pastel (nunca branco puro)**
3. **Dark mode usa azul escuro (#0F1419), não preto**
4. **Máximo 10-15% de rosa por tela**
5. **Sempre usar tokens do useTheme(), não cores hardcoded**
