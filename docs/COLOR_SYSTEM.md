# Sistema de Cores - Nossa Maternidade

Sistema de cores baseado no design **"Boa Noite Mãe"**, criado para proporcionar uma experiência visual acolhedora e moderna.

## 🎨 Paleta Principal

### Cores Primárias

- **Primary Pink** (`#f4258c`): Rosa vibrante principal
  - Usado em: Botões principais, ícones ativos, destaques
  - Variações: 50-900 (do mais claro ao mais escuro)

- **Secondary Blue** (`#89CFF0`): Azul claro suave (Baby Blue)
  - Usado em: Elementos secundários, gradientes, categorias
  - Variações: 50-900

### Cores de Fundo

- **Background** (`#f8f5f7`): Rosa muito claro
  - Cor principal de fundo do app
  - Proporciona suavidade e acolhimento

- **Background Light** (`#ffffff`): Branco
  - Usado em: Cards, modais, elementos elevados

### Cores de Texto

- **Text Dark** (`#1a2b4b`): Azul escuro
  - Textos principais, títulos, conteúdo importante

- **Text Light** (`#64748b`): Cinza médio
  - Textos secundários, descrições

- **Text Muted** (`#94a3b8`): Cinza claro
  - Textos terciários, placeholders

## 😊 Cores de Sentimentos (Daily Feelings)

Sistema de cores para o check-in diário:

| Sentimento | Cor | Cor Ativa | Uso |
|------------|-----|-----------|-----|
| **Bem** (sunny) | `#eab308` | `#fef08a` | Amarelo - Estado positivo |
| **Cansada** (cloud) | `#60a5fa` | `#dbeafe` | Azul - Estado de cansaço |
| **Enjoada** (rainy) | `#818cf8` | `#e0e7ff` | Índigo - Estado de desconforto |
| **Amada** (heart) | `#f4258c` | `#fce7f3` | Rosa - Estado emocional positivo |

## 📦 Cores de Categorias

- **Nutrição**: `#f4258c` (Primary pink)
- **Exercício**: `#89CFF0` (Secondary blue)
- **Saúde**: `#818cf8` (Índigo)
- **Bem-estar**: `#f4258c` (Primary pink)

## 🌈 Gradientes

### Gradiente Principal
```typescript
["#f4258c", "#89CFF0"] // Rosa para azul
```
Usado em: Cards hero, elementos destacados

### Gradiente Primário Suave
```typescript
["#f4258c", "#ec4899"] // Rosa para rosa mais claro
```
Usado em: Botões, elementos interativos

### Gradiente Secundário
```typescript
["#89CFF0", "#60a5fa"] // Azul claro para azul
```
Usado em: Elementos secundários

## 💻 Uso no Código

### Tailwind CSS

```tsx
// Cores primárias
<View className="bg-primary-500" />
<Text className="text-primary-600" />

// Cores de sentimentos
<View className="bg-feeling-sunny" />
<View className="bg-feeling-heart-light" />

// Cores de texto
<Text className="text-text-dark" />
<Text className="text-text-light" />

// Cores de fundo
<View className="bg-background" />
<View className="bg-background-light" />
```

### TypeScript/JavaScript

```typescript
import { Colors, PRIMARY_COLOR, getFeelingColor } from '@/utils/colors';

// Usar cor primária
const primaryColor = Colors.primary.DEFAULT;
// ou
const primaryColor = PRIMARY_COLOR;

// Usar cores de sentimentos
const feeling = getFeelingColor('sunny');
console.log(feeling.color); // "#eab308"
console.log(feeling.activeColor); // "#fef08a"

// Usar gradientes
import { LinearGradient } from 'expo-linear-gradient';
<LinearGradient colors={Colors.gradients.primary} />
```

### React Native Style

```tsx
import { Colors } from '@/utils/colors';

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary.DEFAULT,
  },
  text: {
    color: Colors.text.dark,
  },
  card: {
    backgroundColor: Colors.background.light,
  },
});
```

## 🎯 Princípios de Uso

1. **Consistência**: Sempre use as cores do sistema, evite cores hardcoded
2. **Contraste**: Garanta contraste adequado para acessibilidade (WCAG AAA)
3. **Hierarquia**: Use cores primárias para elementos importantes
4. **Acolhimento**: O sistema foi pensado para transmitir calma e acolhimento

## 📱 Aplicação no App

### Tela Principal (Home)
- Background: `#f8f5f7`
- Cards: Branco com sombras suaves
- Botões primários: `#f4258c`
- Textos: `#1a2b4b`

### Check-in Diário
- Use as cores de sentimentos conforme o estado selecionado
- Estado ativo: use a cor `activeColor`
- Estado inativo: use fundo cinza claro

### Navegação
- Tab ativa: `#f4258c`
- Tab inativa: `#9ca3af`
- Botão central (NathIA): Gradiente `["#f4258c", "#ec4899"]`

## 🔄 Migração

Se você encontrar cores antigas no código:

**Antes:**
```tsx
backgroundColor: "#E11D48" // Rose antigo
```

**Depois:**
```tsx
backgroundColor: Colors.primary.DEFAULT // ou "#f4258c"
// ou
className="bg-primary-500"
```

## 📚 Referências

- Design original: "Boa Noite Mãe"
- Arquivo de cores: `src/utils/colors.ts`
- Configuração Tailwind: `tailwind.config.js`
- Configuração Expo: `app.config.js`

