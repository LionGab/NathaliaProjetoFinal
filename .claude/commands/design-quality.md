# Design Quality Gate

Verificacao completa de qualidade de design antes de PR/commit.

## Execucao

```bash
# Rodar todas as verificacoes
/design-quality

# Rodar em arquivo especifico
/design-quality src/screens/HomeScreen.tsx
```

## Checklist Completo

### 1. Consistencia Visual (Peso: CRITICO)

```bash
# Buscar cores hardcoded
grep -rn "#[0-9A-Fa-f]\{6\}" src/ --include="*.tsx" | grep -v design-system | grep -v colors.ts | wc -l
# Esperado: 0
```

### 2. Dark Mode (Peso: ALTO)

- [ ] Todas as telas usam `useTheme()`
- [ ] Cores vem de `colors` (dinamico) ou `COLORS`/`COLORS_DARK`
- [ ] LinearGradient usa cores do tema
- [ ] Imagens tem versao dark quando necessario

### 3. Tipografia (Peso: MEDIO)

- [ ] Tamanhos de fonte de `TYPOGRAPHY`
- [ ] Fontes DMSans/DMSerifDisplay
- [ ] Hierarquia correta (H1 > H2 > body)

### 4. Espacamento (Peso: MEDIO)

- [ ] Padding/margin de `SPACING`
- [ ] Grid de 8pt respeitado
- [ ] Consistencia entre telas similares

### 5. Acessibilidade (Peso: CRITICO)

- [ ] Tap targets >= 44pt
- [ ] Contraste WCAG AA
- [ ] Labels de acessibilidade
- [ ] Roles semanticos

### 6. Performance (Peso: ALTO)

- [ ] Componentes memoizados quando necessario
- [ ] FlatList com keyExtractor e getItemLayout
- [ ] Imagens otimizadas (expo-image)
- [ ] Animacoes a 60fps (useAnimatedStyle, nao style inline)

### 7. Responsividade (Peso: MEDIO)

- [ ] Layout flexivel (flex, %)
- [ ] Safe areas respeitadas
- [ ] Orientacao portrait suportada
- [ ] Diferentes tamanhos de tela

## Formato de Saida

```
╔══════════════════════════════════════════════════════════════╗
║              DESIGN QUALITY GATE - Nossa Maternidade         ║
╠══════════════════════════════════════════════════════════════╣
║ Data: 2025-12-16                                             ║
║ Arquivos analisados: XX                                      ║
╠══════════════════════════════════════════════════════════════╣

✅ PASSOU (Score: 95/100)

Detalhes:
├── Consistencia Visual:  ✅ OK (0 cores hardcoded)
├── Dark Mode:            ✅ OK (useTheme em todas as telas)
├── Tipografia:           ✅ OK (tokens consistentes)
├── Espacamento:          ⚠️  2 avisos (grid 8pt)
├── Acessibilidade:       ✅ OK (tap targets OK)
├── Performance:          ✅ OK (memoizacao correta)
└── Responsividade:       ✅ OK (safe areas OK)

Avisos (nao bloqueiam):
- src/screens/ProfileScreen.tsx:45 - padding: 10 (deveria ser 8 ou 12)
- src/screens/ProfileScreen.tsx:88 - margin: 6 (deveria ser 4 ou 8)

Recomendacoes:
- Considerar migrar ProfileScreen para grid de 8pt
- Adicionar getItemLayout na FlatList de CommunityScreen

╚══════════════════════════════════════════════════════════════╝
```

## Integracao com CI/CD

Adicionar ao `.github/workflows/quality.yml`:

```yaml
- name: Design Quality Check
  run: |
    # Cores hardcoded
    HARDCODED=$(grep -rn "#[0-9A-Fa-f]\{6\}" src/ --include="*.tsx" | grep -v design-system | grep -v colors.ts | wc -l)
    if [ "$HARDCODED" -gt 0 ]; then
      echo "❌ Encontradas $HARDCODED cores hardcoded"
      exit 1
    fi

    # Tap targets pequenos
    SMALL_TARGETS=$(grep -rn "width: [0-3][0-9]," src/ --include="*.tsx" | wc -l)
    if [ "$SMALL_TARGETS" -gt 0 ]; then
      echo "⚠️ Encontrados $SMALL_TARGETS possiveis tap targets pequenos"
    fi

    echo "✅ Design quality check passou"
```

## Thresholds

| Metrica | Minimo | Ideal |
|---------|--------|-------|
| Cores hardcoded | 0 | 0 |
| Cobertura dark mode | 100% | 100% |
| Tap targets < 44pt | 0 | 0 |
| Score geral | 80/100 | 95/100 |
