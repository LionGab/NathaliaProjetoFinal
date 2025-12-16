# Accessibility Audit (WCAG 2.2 AA)

Verifica conformidade de acessibilidade no codigo.

## Checklist

### 1. Tap Targets (Apple HIG / Material)
- Minimo 44x44pt para iOS
- Minimo 48x48dp para Android
- Buscar: `width: XX` ou `height: XX` onde XX < 44

```typescript
// ERRADO
<Pressable style={{ width: 32, height: 32 }}>

// CORRETO
<Pressable style={{ width: 44, height: 44 }}>
// ou usar hitSlop
<Pressable hitSlop={12} style={{ width: 32, height: 32 }}>
```

### 2. Contraste de Cores (WCAG AA)
- Texto normal: 4.5:1 minimo
- Texto grande (18pt+ ou 14pt bold): 3:1 minimo
- Componentes UI: 3:1 minimo

Verificar combinacoes:
- Texto sobre background
- Icones sobre fundo
- Placeholders em inputs

### 3. Labels de Acessibilidade

```typescript
// Botoes precisam de label
<Pressable
  accessibilityLabel="Enviar mensagem"
  accessibilityRole="button"
  accessibilityHint="Toque duas vezes para enviar"
>

// Imagens decorativas
<Image accessibilityElementsHidden={true} />

// Imagens informativas
<Image accessibilityLabel="Foto do perfil de Maria" />
```

### 4. Roles Semanticos

```typescript
accessibilityRole="button"    // Pressable, TouchableOpacity
accessibilityRole="link"      // Links externos
accessibilityRole="header"    // Titulos de secao
accessibilityRole="image"     // Imagens
accessibilityRole="text"      // Texto importante
accessibilityRole="checkbox"  // Switches, checkboxes
accessibilityRole="radio"     // Radio buttons
accessibilityRole="tab"       // Tabs
accessibilityRole="alert"     // Alertas importantes
```

### 5. Estados Dinamicos

```typescript
// Botao desabilitado
accessibilityState={{ disabled: true }}

// Item selecionado
accessibilityState={{ selected: true }}

// Checkbox marcado
accessibilityState={{ checked: true }}

// Conteudo expandido
accessibilityState={{ expanded: true }}
```

### 6. Anuncio de Mudancas

```typescript
// Anunciar mudancas importantes
import { AccessibilityInfo } from "react-native";
AccessibilityInfo.announceForAccessibility("Mensagem enviada com sucesso");
```

## Formato de Saida

```
=== AUDIT DE ACESSIBILIDADE ===

CRITICO (bloqueadores):
- [TAP] src/components/IconButton.tsx:15 - Tap target 24x24 (minimo 44x44)
- [LABEL] src/screens/Home.tsx:42 - Botao sem accessibilityLabel

ATENCAO (melhorias importantes):
- [CONTRAST] src/screens/Login.tsx:88 - Placeholder pode ter contraste baixo
- [ROLE] src/components/Card.tsx:22 - Pressable sem accessibilityRole

INFO (sugestoes):
- [HINT] src/screens/Profile.tsx:55 - Considerar accessibilityHint

=== ESTATISTICAS ===
Elementos interativos: XX
Com accessibilityLabel: XX (YY%)
Com accessibilityRole: XX (YY%)
Tap targets < 44pt: XX
```

## Ferramentas de Teste

- iOS: Settings > Accessibility > VoiceOver
- Android: Settings > Accessibility > TalkBack
- Expo: `npx expo start` e testar com leitor de tela

## Referencias

- Apple HIG: https://developer.apple.com/design/human-interface-guidelines/accessibility
- Material: https://m3.material.io/foundations/accessible-design
- WCAG 2.2: https://www.w3.org/WAI/WCAG22/quickref/
