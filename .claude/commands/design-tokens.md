# Design Tokens Reference

Mostra todos os tokens disponiveis no design-system.

## Acao

Leia e exiba os tokens de `src/theme/design-system.ts` de forma organizada:

### COLORS (Paleta Azul Pastel Maternidade)

```
PRIMARY (Azul Pastel - CTAs, navegacao ativa)
├── 50:  #F7FBFD  (Background principal)
├── 100: #E8F3F9  (Highlights)
├── 200: #DCE9F1  (Borders)
├── 300: #B4D7E8  (Hover)
├── 400: #96C7DE  (Active)
├── 500: #7DB9D5  ⭐ Principal
├── 600: #5BA3C7  (CTA forte)
├── 700: #4488AB  (Links)
├── 800: #376E8C  (Texto escuro)
└── 900: #2B576D  (Headings)

SECONDARY (Azul Soft - elementos secundarios)
├── 400: #7BB8E8
└── 500: #5CA3DB ⭐

ACCENT (Teal - destaques de saude/bem-estar)
├── 400: #2DD4BF
└── 500: #14B8A6 ⭐

SEMANTIC
├── success: #10B981
├── warning: #F59E0B
├── error:   #EF4444
└── info:    #3B82F6

FEELING (Check-in emocional)
├── bem:       #FFE4B5 (amarelo pastel)
├── cansada:   #BAE6FD (azul pastel)
├── indisposta: #DDD6FE (lavanda)
└── amada:     #FECDD3 (rosa pastel)
```

### TYPOGRAPHY

```
Display:  57/45/36px (titulos grandes)
Headline: 32/28/24px (secoes)
Title:    22/18/14px (cards)
Body:     17/15/13px (texto corrido)
Label:    15/13/11px (botoes, tags)
```

### SPACING (8pt Grid)

```
xs=4  sm=8  md=12  lg=16  xl=20
2xl=24  3xl=32  4xl=40  5xl=48  6xl=64
```

### RADIUS

```
none=0  xs=4  sm=8  md=12  lg=16  xl=20  2xl=24  full=9999
```

### SHADOWS

```
none | sm | md | lg | xl | glow(color)
```

### GRADIENTS

```
primary, primarySoft, secondary, accent
heroLight, heroSoft, warm, cool
glass, shimmer
```

## Uso

Para usar em codigo:
```typescript
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS, GRADIENTS } from "../theme/design-system";

// Cor
backgroundColor: COLORS.primary[500]

// Tipografia
fontSize: TYPOGRAPHY.bodyLarge.fontSize

// Espacamento
padding: SPACING["2xl"]

// Borda
borderRadius: RADIUS.lg

// Sombra
...SHADOWS.md

// Gradiente
<LinearGradient colors={GRADIENTS.heroLight} />
```
