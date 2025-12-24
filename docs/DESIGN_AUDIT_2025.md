# 🎨 Design System & UX Audit 2025 - Nossa Maternidade

**Data**: 24 de dezembro de 2024  
**Solicitação**: Design System & UI/UX Review - Product Designer Health Apps  
**Objetivo**: Transformar em app intuitivo, acolhedor e confiável para mães às 3 da manhã

---

## 📊 Executive Summary

### ✅ Pontos Fortes Identificados
1. **Design system sólido** - Calm FemTech preset bem estruturado
2. **Tokens centralizados** - `src/theme/tokens.ts` como fonte única de verdade
3. **Paleta coerente** - Azul (calm) + Rosa (warmth) bem definida
4. **Componentes base** - Button, Card, Input com variantes
5. **Hook useTheme** - Abstração para light/dark mode

### ⚠️ Gaps Críticos Identificados
1. **Dark mode não otimizado** - Não usa AMOLED blacks (#000)
2. **40 cores hardcoded** - Fora do sistema de tokens
3. **Falta de accessibility labels** - VoiceOver incompleto
4. **Tap targets inconsistentes** - Alguns abaixo de 44pt
5. **Thumb zone não otimizada** - Navegação para duas mãos
6. **Safe area parcial** - Notch/Dynamic Island não testado
7. **Estados de loading genéricos** - Falta feedback contextual
8. **Contraste não validado** - WCAG AAA não confirmado

---

## 🎯 Contexto Crítico do Design

### Usuária Principal
- **Quem**: Mulheres 18-34 anos (gestantes + mães 0-24 meses)
- **Estado**: Cansadas, ansiosas, atenção fragmentada
- **Contexto**: Noite (2-4am), um braço ocupado (amamentando)
- **Necessidade**: Confiança (Nathália Valente), não máquina fria

### Princípios Inegociáveis
1. 🤝 **Acolhimento emocional** > eficiência robótica
2. 👶 **Uma mão livre** - Thumb-friendly, zona de toque baixa
3. 🌙 **Modo noturno robusto** - AMOLED blacks, contraste ≥7:1
4. 📱 **iOS-first** - Notch awareness, safe area
5. ❌ **Zero ansiedade** - "Estou analisando" → "Pensando com carinho"

---

## 1️⃣ Fundação Visual

### ✅ Paleta de Cores (APROVADO)
```typescript
// src/theme/tokens.ts - Bem estruturado
brand.primary   // #7DB9D5 - Azul calmo
brand.accent    // #F4258C - Rosa CTA
brand.secondary // #A855F7 - Lilás
brand.teal      // #14B8A6 - Saúde
```

**Status**: ✅ Paleta excelente, bem documentada

### ⚠️ Dark Mode (PRECISA AJUSTE)
```typescript
// ATUAL (src/theme/tokens.ts)
surface.dark.base: "#0F1419"  // ❌ Azul escuro, não AMOLED

// RECOMENDADO
surface.dark.base: "#000000"  // ✅ True black (economiza bateria)
// OU
surface.dark.base: "#111111"  // ✅ Quase-black (menos harsh)
```

**Impacto**: ALTO  
**Esforço**: BAIXO  
**Ação**: Testar às 2am com brilho mínimo, validar conforto visual

### ⚠️ Tipografia (PRECISA VALIDAÇÃO)
```typescript
// ATUAL
typography.fontFamily.base: "Manrope_400Regular"  // ✅ Excelente escolha
typography.bodyMedium: { fontSize: 15, lineHeight: 22 }  // ✅ Legível
```

**Gaps**:
1. Line height poderia ser 1.6+ para noite (atual: ~1.46)
2. Falta validação de Dynamic Type (iOS accessibility)
3. Sem fallback se Manrope falhar

**Ação**:
- Aumentar lineHeight para 24 (ratio 1.6)
- Testar com "Texto Grande" ativado (iOS Settings)
- Adicionar `-apple-system` como fallback

### ⚠️ Espaçamento (BOM, MAS INCONSISTENTE)
```typescript
// ATUAL
spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, 2xl: 24 }  // ✅ 8pt grid
```

**Gaps**:
- Alguns componentes ainda usam valores mágicos (18px, 22px)
- Padding inconsistente em cards

**Ação**: Audit de todos os arquivos, migrar para tokens

### ⚠️ Componentes Base (FALTA ESTADOS)
```typescript
// Button - Falta pressed/disabled visual claro
// Card - Elevação não consistente
// Input - Focus state pouco visível
// Modal - Dismiss não intuitivo
```

**Ação**: Criar variantes explícitas para todos os estados

---

## 2️⃣ Jornadas Específicas

### Journey 1: ONBOARDING (9 Etapas)

**Análise de `OnboardingScreen.tsx`**:
```typescript
// ✅ Pontos Fortes
- Paginação visual
- Animações smooth (FadeInUp)
- Progress bar clara

// ❌ Gaps
- Falta presença visual da Nathália (foto/avatar)
- Sem "skip" option (respeitar autonomia)
- Não salva rascunho se usuária sair
- Modo dark não testado visualmente
```

**Recomendações**:
1. Adicionar foto/avatar Nathália na tela 1 ("Bem-vinda ao Mundo MãesValentes")
2. Botão "Pular" discreto (não obrigatório)
3. Salvar progresso em AsyncStorage a cada etapa
4. Testar modo dark com brilho mínimo

**Mockup sugerido (Tela 1)**:
```
┌─────────────────────────┐
│  [Avatar Nathália 80pt] │
│                         │
│  "Bem-vinda ao Mundo    │
│   MãesValentes 💗"      │
│                         │
│  "Aqui você não está    │
│   sozinha. Vou te       │
│   acompanhar em cada    │
│   passo dessa jornada." │
│                         │
│  [CTA: "Começar" 44pt]  │
│  [Link: "Pular"]        │
└─────────────────────────┘
```

---

### Journey 2: CHAT (NathIA)

**Análise de `AssistantScreen.tsx`**:
```typescript
// ✅ Pontos Fortes
- Sidebar com histórico
- Empty state com sugestões
- Input pill moderno
- VoiceMessagePlayer

// ❌ Gaps Críticos
- Avatar Nathália não consistente (às vezes genérico)
- Bubble design: texto pode ser pequeno (15px)
- Typing indicator genérico ("...")
- Erro handling mostra "Error 500" (ansiedade!)
- Falta emoji support visual
- Input não sticky no bottom (keyboard issues)
```

**Recomendações**:
1. **Avatar**: Usar foto real Nathália SEMPRE (gera confiança)
2. **Bubbles**:
   - User: direita, `brand.accent[400]` (rosa)
   - Nathália: esquerda, `surface.light.card` (branco/azul claro)
   - Texto: mínimo 16pt (não 15pt)
   - Emoji picker nativo (flag: 🇧🇷 context)
3. **Typing indicator**: "Nathália está pensando com carinho..." (não "...")
4. **Error handling**:
   ```typescript
   // ❌ Atual
   "Error 500: Failed to fetch"
   
   // ✅ Proposto
   "Deixa eu pensar melhor nisso... 💭"
   + [Retry button] "Tentar novamente"
   ```
5. **Input safety**:
   - Character limit: "0/500" visual
   - Send button: rosa quando ativo, gray quando vazio
   - Anexar imagem: ícone visível (gallery icon)
6. **Keyboard aware**: Usar `KeyboardAvoidingView` + `useSafeAreaInsets()`

**Mockup Chat Bubble**:
```
Nathália:
┌──────────────────────────┐
│ [Avatar] Oi querida! 😊  │
│                          │
│ Como você está se        │
│ sentindo hoje?           │
│                          │
│ 10:30                    │
└──────────────────────────┘

Você:
        ┌──────────────────┐
        │ Cansada, mas bem │
        │                  │
        │            10:32 │
        └──────────────────┘
```

---

### Journey 3: COMMUNITY (Feed)

**Análise de `CommunityScreen.tsx`**:
```typescript
// ✅ Pontos Fortes
- Card-based layout
- PostCard component bem estruturado
- useCommunity hook centraliza lógica

// ❌ Gaps
- Load state genérico (spinner)
- Falta skeleton loader
- Pull-to-refresh não testado
- Infinite scroll não implementado
- Report/moderation pouco visível
- Conteúdo flagged mostra "REMOVED" (harsh)
```

**Recomendações**:
1. **Feed Structure**:
   - Skeleton loader (não spinner genérico)
   - Pull-to-refresh com animação suave
   - Infinite scroll com "Carregar mais" explícito
2. **Post Card**:
   - Avatar + nome pseudônimo seguro
   - Timestamp relativo ("2h atrás")
   - Tag de contexto ("Recém-nascido", "Amamentação")
   - Engagement (❤️ count, 💬 count)
3. **Interações**:
   - Like: animação heart (Haptics.impactAsync)
   - Comment: modal fullscreen (não inline)
   - Share: Native share intent (iOS/Android)
4. **Moderation**:
   ```typescript
   // ❌ Atual
   "CONTEÚDO REMOVIDO"
   
   // ✅ Proposto
   "Conteúdo em revisão pela nossa equipe 💗"
   ```
5. **Safety tone**: Acolhimento > punição

---

### Journey 4: PAYWALL (Conversão)

**Análise de `PaywallScreen.tsx`**:
```typescript
// ✅ Pontos Fortes
- Linear gradient hero
- SparkleIcon animado
- PREMIUM_FEATURES list

// ❌ Gaps Críticos
- Foca em features, não benefício emocional
- Sem social proof (quantas mães assinaram?)
- Falta vídeo/testimonial Nathália
- CTA genérico ("Assinar")
- Escape hatch agressivo ("Talvez depois" escondido)
```

**Recomendações**:
1. **Headline emocional**:
   ```typescript
   // ❌ Atual
   "Desbloqueie recursos premium"
   
   // ✅ Proposto
   "Paz de espírito quando você mais precisa 🌙"
   // Subheadline: "Nathália sempre ao seu lado, 24/7"
   ```
2. **Benefícios vs Features**:
   ```typescript
   // ❌ Feature-based
   "Chat ilimitado com IA"
   
   // ✅ Benefit-based
   "Respostas na madrugada quando ninguém mais está acordado"
   ```
3. **Social Proof**:
   - "+12.000 mães confiam na Nossa Maternidade Premium"
   - Testimonial em card: "Salvou minha saúde mental" - Maria, mãe de 2
   - Mini vídeo Nathália (10s): "Oi, sou a Nath..."
4. **Trust Signals**:
   - "7 dias grátis" (se aplicável)
   - "Cancele quando quiser" (visível)
   - Selos: Apple Pay, RevenueCat, LGPD compliance
5. **CTA**:
   ```typescript
   // ❌ Genérico
   <Button>Assinar Agora</Button>
   
   // ✅ Emocional
   <Button variant="accent" size="large">
     Começar meus 7 dias grátis 💗
   </Button>
   ```
6. **Escape hatch**: Botão "Continuar grátis" (não "Talvez depois")

---

### Journey 5: HÁBITOS/TRACKING

**Análise de `HabitsEnhancedScreen.tsx` + `DailyLogScreen.tsx`**:
```typescript
// ✅ Pontos Fortes
- Progress ring visual
- 8 hábitos bem categorizados
- Daily check-in simples

// ❌ Gaps
- Tracking pode ser stressante (não calmo)
- Gráficos tipo "analytics dashboard" (muito data)
- Cores de alerta (vermelho) geram ansiedade
- Falta insights textuais ("Vejo que dormiu pouco, cuide-se")
```

**Recomendações**:
1. **Sleep Tracker**:
   - Entrada: 2 taps (hora dormi, hora acordei)
   - Visual: Gráfico MINIMALISTA (não chart completo)
   - Cor:
     ```typescript
     // ✅ Suave, não alarmista
     8h+ → semantic.success (verde)
     6-8h → brand.teal (teal)
     <6h → semantic.warning (amarelo suave, não vermelho)
     ```
   - Insight: "Vejo que dormiu pouco ontem. Que tal uma meditação guiada?"
2. **Respiração/Wellness**:
   - Entrada: "Preciso relaxar agora" (grande botão)
   - Seleção: 3-5 técnicas (não 10+)
   - Execução:
     - Animação respiratória (círculo que expande/contrai)
     - Áudio opcional + haptic feedback (vibra no ritmo)
     - Timer: 5-10min default (não forçar 20min)
   - Pós-sessão: "Como se sente? 😌😐😟" (emoji apenas)
3. **Design Principle**: Tracking = suporte, NÃO vigilância

---

## 3️⃣ Validações Específicas

### A. DARK MODE (CRÍTICO)

**Status Atual**:
```typescript
// src/theme/tokens.ts
surface.dark.base: "#0F1419"  // ❌ Azul escuro (não AMOLED)
```

**Checklist**:
- [ ] Background: Trocar para `#000000` ou `#111111`
- [ ] Text: Contraste ≥7:1 (WCAG AAA)
  - Primary: `#F3F5F7` vs `#000000` = 18.56:1 ✅
  - Secondary: `#9DA8B4` vs `#000000` = 8.92:1 ✅
  - Tertiary: `#7D8B99` vs `#000000` = 6.18:1 ❌ (precisa ser mais claro)
- [ ] Cards: Shadow visível em fundo preto?
  - Adicionar border sutil (`#1A2027` - 1px) para separação
- [ ] Buttons:
  - Rosa accent vs texto navy: contraste OK
  - Outline azul vs fundo preto: aumentar stroke para 1.5px
- [ ] Icons: Testar visibilidade (não usar gray[500] em dark)
- [ ] Links: Azul claro `#96C7DE` testado vs preto

**Teste Manual**:
1. Abrir app às 2am
2. Brilho ao mínimo (10-20%)
3. Navegar todas as telas
4. Validar: olhos não doem, texto legível, CTAs claros

---

### B. THUMB ZONE (UMA MÃO LIVRE)

**Conceito**: Desenhar círculo ~150pt no bottom-center (alcance do polegar)

**Checklist**:
- [ ] **Tab bar**: Bottom (não top) ✅ Já implementado
- [ ] **Botões frequentes**:
  - Chat send button: ✅ Bottom right
  - Sleep log CTA: ❌ No meio da tela (mover para bottom)
  - Respiração CTA: ❌ Top (mover para bottom ou floating button)
- [ ] **Navegação**:
  - Altura tab bar: ≥44pt ✅
  - Ícones + label: ✅ Ambos presentes
- [ ] **Modais**:
  - Dismiss (X): Top-right OU bottom ✅/❌ (validar)
  - CTA principal: Bottom (thumb zone) ❌ (alguns no meio)
- [ ] **Keyboard**:
  - Input field: Mantém visível acima do teclado ✅
  - Send button: Acessível quando teclado aparece ✅
  - Dismiss keyboard: Tap outside funciona ✅

**Teste Manual**:
1. Segurar iPhone com mão ESQUERDA apenas
2. Navegar todas as telas
3. Marcar botões que não alcança com polegar
4. Redesenhar layout para thumb zone

---

### C. SAFE AREA & NOTCH

**Status**:
```typescript
// App.tsx
<SafeAreaProvider>  // ✅ Configurado
```

**Checklist**:
- [ ] **iOS Notch/Dynamic Island**:
  - Status bar não esconde conteúdo ✅
  - Testar iPhone 14 Pro (Dynamic Island) ❓
  - Testar iPhone SE (notch menor) ❓
- [ ] **Bottom inset** (Home Indicator):
  - Tab bar: Padding bottom ✅
  - Input send button: Não sobrepõe indicator ✅
  - Modal full-screen: usa `useSafeAreaInsets()` ❓
- [ ] **Custom headers**:
  - Top inset aplicado ✅
  - Botão voltar: 44x44pt tap target ✅

**Teste Manual**:
1. Xcode Simulator: iPhone 14 Pro
2. Rodar app full-screen
3. Navegar todas as telas
4. Validar: nada escondido por notch/indicator

---

### D. ACESSIBILIDADE SEMÂNTICA

**VoiceOver (iOS Accessibility)**:

**Checklist**:
- [ ] **Buttons**: Têm `accessibilityLabel`
  ```tsx
  // ❌ Atual (muitos buttons)
  <Pressable onPress={handlePress}>
    <Ionicons name="heart" />
  </Pressable>
  
  // ✅ Proposto
  <Pressable
    onPress={handlePress}
    accessibilityLabel="Favoritar este post"
    accessibilityRole="button"
  >
    <Ionicons name="heart" />
  </Pressable>
  ```
- [ ] **Imagens**: Têm `alt` text
  ```tsx
  // ❌ Genérico
  <Image source={uri} />
  
  // ✅ Descritivo
  <Image
    source={uri}
    accessibilityLabel="Nathália Valente sorrindo"
  />
  ```
- [ ] **Ordem de leitura**: Lógica (top-to-bottom, não zigzag)
- [ ] **Contraste**: ≥WCAG AA (4.5:1 para texto)
  - Validar com ferramentas: https://webaim.org/resources/contrastchecker/

**Customizações do Usuário**:
- [ ] **Text size**: App adapta (não quebra layout)
  - Testar: iOS Settings > Display > Text Size > Largest
- [ ] **Bold text**: Funciona em títulos
  - Testar: iOS Settings > Accessibility > Bold Text
- [ ] **Reduce motion**: Animations desabilitadas
  ```tsx
  import { useReducedMotion } from 'react-native-reanimated';
  const reducedMotion = useReducedMotion();
  ```
- [ ] **Color invert**: Teste visual (não quebrar cores)

**Teste Manual**:
1. Ativar VoiceOver (Settings > Accessibility)
2. Navegar app SEM olhar na tela
3. Verificar: todas as ações são anunciadas claramente

---

## 4️⃣ Matriz de Prioridades

### IMPACTO ALTO | ESFORÇO BAIXO (FAÇA HOJE)
1. ✅ **Dark mode AMOLED** - Trocar `#0F1419` → `#000000`
2. ✅ **Tipografia lineHeight** - 22 → 24 (ratio 1.6)
3. ✅ **Migrar 5 console.log** → `logger.*`
4. ✅ **Migrar 40 cores hardcoded** → `Tokens.*`
5. ✅ **Chatbot avatar** - Usar foto Nathália sempre
6. ✅ **Error handling** - "Deixa eu pensar..." (não "Error 500")

### IMPACTO ALTO | ESFORÇO MÉDIO (SEMANA 1-2)
1. ⏳ **Community feed polish** - Skeleton, pull-to-refresh
2. ⏳ **Sleep tracker viz** - Gráfico minimalista
3. ⏳ **Onboarding progressivo** - Avatar Nathália, skip, save draft
4. ⏳ **Paywall emocional** - Benefícios > features, social proof
5. ⏳ **Accessibility labels** - VoiceOver em todos os buttons
6. ⏳ **Thumb zone** - Mover CTAs para bottom

### IMPACTO MÉDIO | ESFORÇO BAIXO (DEPOIS)
1. ⏳ **Animations** - Micro-interactions (heart like, etc)
2. ⏳ **Sound design** - Feedback auditivo opcional
3. ⏳ **Haptics** - Vibração em interações chave
4. ⏳ **Loading states** - Skeletons contextuais

### IMPACTO BAIXO | ESFORÇO ALTO (SKIP)
1. ❌ **Dark theme customization** - User escolhe cores
2. ❌ **Web version** - App é mobile-first
3. ❌ **Themes adicionais** - Calm FemTech é suficiente

---

## 5️⃣ Benchmark Competitors

### Babybump
- ✅ **Onboarding simples** (3 telas, não 9)
- ✅ **Progress visual** (círculo, não barra)
- ❌ **Sem personalização** (genérico)

### The Bump
- ✅ **Community cards** (feed bonito)
- ✅ **Timestamps relativos** ("2h atrás")
- ❌ **Muito cluttered** (muita informação)

### Ooh Baby
- ✅ **Design acolhedor** (cores pastéis, ícones soft)
- ✅ **Ilustrações** (não só texto)
- ❌ **Falta inteligência** (sem AI)

### Peanut (Social para mães)
- ✅ **Design warm** (rosa + lilás)
- ✅ **Moderation safety** (UI clara)
- ✅ **Thumb-friendly** (botões no bottom)
- ❌ **Sem saúde tracking** (só social)

### 💡 O que trazer para Nossa Maternidade:
1. **Babybump**: Onboarding mais curto (considerar merge de etapas)
2. **The Bump**: Feed cards com visual consistente
3. **Ooh Baby**: Ilustrações emotivas (adicionar em empty states)
4. **Peanut**: Thumb zone + safety UI

---

## 6️⃣ Questões a Responder

### 1. Nathália aparece onde no design?
- **✅ Atual**: Chat avatar (genérico), Paywall hero
- **❌ Falta**: Onboarding tela 1, Home hero, About screen
- **Proposta**: Foto real em TODAS as primeiras interações

### 2. Qual é a emoção do app?
- **Target**: Calma, confiança, acolhimento
- **Atual**: ✅ Azul calm, ❌ Rosa muito vibrante (pode ser ansioso)
- **Ajuste**: Rosa mais suave em dark mode (`#FFB3C4` em vez de `#F4258C`)

### 3. Paleta reflete emoção?
- **Azul**: ✅ Calm, trust, health (perfeito)
- **Rosa**: ⚠️ Energia, joy (pode ser muito em noite)
- **Lilás**: ✅ Serenity, meditation (ótimo)
- **Teal**: ✅ Health, nature (adequado)
- **Ajuste**: Reduzir saturação do rosa em dark mode

### 4. Community se sente segura?
- **❌ Gaps**: Report pouco visível, moderation harsh ("REMOVED")
- **✅ Proposta**: Ícone discreto "•••", texto acolhedor ("em revisão")

### 5. Paywall vende emoção ou features?
- **❌ Atual**: Features ("Chat ilimitado", "Sem anúncios")
- **✅ Proposta**: Emoção ("Paz às 3am", "Respostas quando precisa")

### 6. Noite é testada?
- **❌ Atual**: Apenas light mode testado visualmente
- **✅ Ação**: Testar dark mode às 2am, brilho mínimo, TODAS as telas

---

## 7️⃣ Entregáveis

### ✅ Design System (Código)
- [x] Token documentation (`src/theme/tokens.ts`)
- [x] Component library (Button, Card, Input variants)
- [ ] Dark mode variants (validar AMOLED)
- [ ] Accessibility documentation (WCAG AAA)
- [ ] Safe area annotations (notch guide)

### 📄 Recomendações Visuais (Este Doc)
- [x] Top 3 mudanças de UI (dark mode, thumb zone, chat warmth)
- [x] Prioridade por impacto
- [x] Matriz de esforço vs impacto
- [ ] Mockups (criados acima em ASCII, Figma opcional)

### 🔬 Validação com Usuárias
- [ ] Teste com 3-5 mães reais
- [ ] Perguntas-chave:
  - "Consegue usar à noite sem incomodar?"
  - "Se sente segura/acolhida?"
  - "Confia na NathIA como Nathália?"
  - "Consegue fazer tudo com uma mão?"
- [ ] Teste A/B: Paywall emocional vs features

---

## 🚀 Próximos Passos Imediatos

### Fase 1: Quick Wins (Esta Sessão)
1. Migrar `console.log` → `logger.*` (5 instâncias)
2. Criar checklist de accessibility
3. Documentar dark mode issues
4. Criar PR com este audit document

### Fase 2: Dark Mode (Dia 1)
1. Trocar `surface.dark.base` → `#000000`
2. Testar contraste de TODOS os textos
3. Adicionar border em cards dark
4. Validar às 2am

### Fase 3: Accessibility (Dia 2-3)
1. Adicionar `accessibilityLabel` em buttons
2. Validar tap targets (44pt minimum)
3. Testar VoiceOver
4. Documentar áreas críticas

### Fase 4: UX Polish (Semana 1)
1. Chat warmth (avatar, typing, errors)
2. Onboarding presence (Nathália foto)
3. Paywall emocional (benefícios)
4. Thumb zone optimization

---

## 📊 Métricas de Sucesso

### Objetivos
1. **Retenção D7**: +15% (app mais acolhedor = mais uso)
2. **Conversão Paywall**: +25% (benefícios > features)
3. **Uso noturno (2-4am)**: +30% (dark mode otimizado)
4. **Acessibilidade**: 100% VoiceOver navegável
5. **NPS**: +10 pontos (confiança + warmth)

### Validação Técnica
- [ ] Quality gate passa (typecheck + lint + build)
- [ ] Zero `console.log` (apenas `logger.*`)
- [ ] Zero cores hardcoded fora de `theme/`
- [ ] 100% componentes com accessibility labels
- [ ] Dark mode ≥7:1 contrast em TODOS os textos

---

**Próxima Ação**: Começar implementação dos Quick Wins (Fase 1)
