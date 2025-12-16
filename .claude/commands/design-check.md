# Design System Consistency Check

Analise o arquivo ou pasta especificada verificando consistência com o design-system.

## Checklist de Verificacao

### 1. Cores
- [ ] Todas as cores usam `COLORS` ou `COLORS_DARK` de `src/theme/design-system.ts`
- [ ] Nenhuma cor hardcoded (#xxx, rgb(), rgba() direto)
- [ ] Dark mode implementado via `useTheme()` hook
- [ ] Cores semanticas corretas (primary para CTAs, semantic para feedback)

### 2. Tipografia
- [ ] Usa `TYPOGRAPHY` tokens para fontSize/lineHeight
- [ ] Fontes DMSans (body) e DMSerifDisplay (headers)
- [ ] Hierarquia correta (display > headline > title > body > label)

### 3. Espacamento
- [ ] Usa `SPACING` tokens (xs=4, sm=8, md=12, lg=16, xl=20, 2xl=24...)
- [ ] Grid de 8pt respeitado
- [ ] Padding de tela consistente (24px horizontal)

### 4. Componentes
- [ ] Usa `COMPONENT_STYLES` para cards, buttons, inputs
- [ ] Usa `SHADOWS` para elevacao
- [ ] Usa `RADIUS` para bordas arredondadas
- [ ] Usa `GLASS` para glassmorphism

### 5. Acessibilidade
- [ ] Tap targets minimo 44pt (`ACCESSIBILITY.minTapTarget`)
- [ ] Contraste WCAG AA (4.5:1 para texto)
- [ ] Labels de acessibilidade em elementos interativos
- [ ] hitSlop em botoes pequenos

### 6. Animacoes
- [ ] Usa react-native-reanimated v3 (nao Animated de RN)
- [ ] Duracoes de `ANIMATION.duration`
- [ ] Springs com damping/stiffness de `ANIMATION.easing`

## Arquivos de Referencia

- Design System: `src/theme/design-system.ts`
- Hook de Tema: `src/hooks/useTheme.ts`
- Cores Legacy: `src/utils/colors.ts` (DEPRECATED)

## Formato de Saida

Para cada problema encontrado:
```
[ARQUIVO:LINHA] TIPO: Descricao
  Atual: valor_atual
  Correto: valor_correto
```

## Exemplo de Uso

```
/design-check src/screens/HomeScreen.tsx
/design-check src/components/
```
