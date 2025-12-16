# 🎨 Preview: Nova Tela de Onboarding "Qual é a sua fase atual?"

## Design Premium Implementado

### 📱 Estrutura Visual

```
┌─────────────────────────────────────────┐
│  ╭───────────────────────────────────╮  │
│  │  • • •                    (dots)  │  │
│  │                                   │  │
│  │  Qual é a sua fase atual,        │  │ ← Título grande, fonte serifada
│  │  amor? ✨                         │  │   (34px, DMSerifDisplay)
│  │                                   │  │
│  │  Vou personalizar toda a sua      │  │ ← Subtítulo acolhedor
│  │  experiência para este momento    │  │   (bodyLarge + 1)
│  │  tão especial da sua vida         │  │
│  ╰───────────────────────────────────╯  │
│         ↑ Card Glassmorphism              │
│         (fundo branco 70% opaco)          │
│                                           │
│  ╭───────────────────────────────────╮  │
│  │  💖  Como você quer que eu te     │  │ ← Input de nickname
│  │      chame?                       │  │   com ícone
│  │                                   │  │
│  │  ┌─────────────────────────────┐ │  │
│  │  │ Ex: Manu, Carol, Lu...      │ │  │ ← Placeholder amigável
│  │  └─────────────────────────────┘ │  │
│  │                                   │  │
│  │  Opcional - pode deixar em branco │  │ ← Texto em itálico
│  ╰───────────────────────────────────╯  │
│                                           │
│  Escolha sua fase atual                  │ ← Seção de opções
│                                           │
│  ┌──────────────────────────────────┐   │
│  │ ╭──╮  Tentando engravidar         │   │ ← Opção compacta
│  │ │🤰│  Planejando ou no processo   │   │   (emoji em container
│  │ ╰──╯                          ✓  │   │    48px, layout horizontal)
│  └──────────────────────────────────┘   │
│                                           │
│  ┌──────────────────────────────────┐   │
│  │ ╭──╮  Grávida                     │   │
│  │ │🤰│  Curtindo cada momento        │   │
│  │ ╰──╯                              │   │
│  └──────────────────────────────────┘   │
│                                           │
│  ┌──────────────────────────────────┐   │
│  │ ╭──╮  Pós-parto                   │   │
│  │ │👶│  Com bebê nos braços          │   │
│  │ ╰──╯                              │   │
│  └──────────────────────────────────┘   │
│                                           │
│  ┌──────────────────────────────────┐   │
│  │ ╭──╮  Cuidando da saúde           │   │
│  │ │💪│  Bem-estar e autocuidado      │   │
│  │ ╰──╯                              │   │
│  └──────────────────────────────────┘   │
│                                           │
│         ↓ Gradient fade to button         │
│  ╔════════════════════════════════╗     │
│  ║        Continuar               ║     │ ← Botão gradiente
│  ╚════════════════════════════════╝     │   (rosa primário)
└─────────────────────────────────────────┘
```

### 🎨 Paleta de Cores

**Card Hero (Glassmorphism)**
- Background: `rgba(255, 255, 255, 0.7)` (branco translúcido)
- Border: `rgba(244, 37, 140, 0.1)` (rosa suave)
- Shadow: Rosa primário com blur 24px

**Input de Nickname**
- **Estado Normal**:
  - Border: Cinza neutro (1.5px)
  - Shadow: Sutil (opacity 0.06)

- **Estado Focado**:
  - Border: Rosa primário (2px)
  - Shadow: Rosa com blur 12px (opacity 0.15)

**Opções de Fase**
- **Não selecionada**:
  - Background: Branco
  - Border: Cinza neutro 200
  - Emoji container: Cinza neutro 100

- **Selecionada**:
  - Background: Rosa primário 50
  - Border: Rosa primário 500 (2px)
  - Emoji container: Rosa primário 100
  - Checkmark: Rosa primário 500

### ✨ Animações

1. **Entrada da tela**: `FadeIn` 400ms
2. **Card Hero**: `FadeInDown` delay 100ms, 600ms
3. **Input**: `FadeInUp` delay 250ms, 600ms
4. **Título "Escolha sua fase"**: `FadeInUp` delay 400ms, 600ms
5. **Opções**: `FadeInUp` staggered (450ms + 80ms por item)
6. **Botão**: `FadeInUp` delay 600ms, 500ms

### 📐 Dimensões

**Card Hero**
- Border radius: 24px (3xl)
- Padding: 24px (2xl)
- Margin bottom: 32px (3xl)

**Input de Nickname**
- Container border radius: 20px (2xl)
- Container padding: 20px (xl)
- Ícone: 40x40px círculo
- Input altura mínima: 54px
- Input border radius: 16px (xl)

**Opções de Fase**
- Border radius: 16px (xl)
- Padding: 16px (lg)
- Altura mínima: 60px
- Emoji container: 48x48px
- Emoji tamanho: 24px
- Spacing entre opções: 12px (md)

**Botão Continuar**
- Border radius: 16px (xl)
- Altura mínima: 60px
- Gradiente: Rosa 400 → Rosa 600

### 🎯 Melhorias vs. Design Anterior

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **Hero Title** | Texto simples | Card glassmorphism premium |
| **Fonte do título** | Sans-serif | Serifada (DMSerifDisplay) |
| **Tamanho título** | ~28px | 34px |
| **Input nickname** | Simples | Card com ícone + estados visuais |
| **Emojis** | Soltos | Em containers coloridos |
| **Layout opções** | Vertical (grandes) | Horizontal compacto |
| **Tamanho opções** | Grande (padding xl) | Compacto (padding lg) |
| **Botão** | Estático | Floating com gradient fade |
| **Animações** | Básicas | Staggered sofisticadas |

### 💡 Destaques de UX

1. **Feedback visual no input**: Borda e sombra mudam quando focado
2. **Hierarquia clara**: Título → Input → Opções → Botão
3. **Espaçamento respirável**: Uso consistente do design system
4. **Micro-interações**: Haptic feedback + animações suaves
5. **Estados visuais**: Todos os elementos têm estado selected/focused
6. **Acessibilidade**:
   - Touch targets ≥ 44pt (Apple HIG)
   - Contraste WCAG AA
   - Labels semânticos

### 📱 Responsividade

Todos os valores usam o design system (`SPACING`, `RADIUS`, `TYPOGRAPHY`), garantindo consistência em diferentes tamanhos de tela.

## 🚀 Como Testar

**Opção 1: Web (Rápido)**
```bash
bun run web
# Abrir http://localhost:8081
```

**Opção 2: iOS (Requer setup)**
```bash
# Instalar dependências primeiro
brew install cocoapods
cd /Users/lion/NossaMaternidade
bun run ios
```

---

**Criado em**: 2025-12-16
**Arquivo fonte**: `src/screens/NathIAOnboardingScreen.tsx` (linhas 356-608)
