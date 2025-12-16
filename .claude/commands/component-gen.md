# Generate Component from Design System

Gera um componente React Native seguindo o design-system do Nossa Maternidade.

## Uso

```
/component-gen Button variant:primary size:lg
/component-gen Card title subtitle image
/component-gen Input label placeholder error
```

## Template Base

Todo componente deve seguir esta estrutura:

```typescript
/**
 * [ComponentName]
 *
 * [Descricao breve do componente]
 */

import React from "react";
import { View, Text, Pressable } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from "../theme/design-system";

interface [ComponentName]Props {
  // Props aqui
}

export function [ComponentName]({ ...props }: [ComponentName]Props) {
  const { colors, isDark } = useTheme();

  return (
    <View>
      {/* Implementacao */}
    </View>
  );
}
```

## Regras de Geracao

### 1. Cores
- NUNCA usar cores hardcoded
- Usar `colors` do `useTheme()` para suporte a dark mode
- Ou `COLORS` direto para valores estaticos

### 2. Tipografia
- Usar tokens de `TYPOGRAPHY`
- Fonte padrao: DMSans
- Headers: DMSerifDisplay

### 3. Espacamento
- Usar `SPACING` tokens
- Grid de 8pt

### 4. Interatividade
- Usar `Pressable` (nao TouchableOpacity)
- Minimo 44pt tap target
- Feedback haptico com expo-haptics

### 5. Animacoes
- Usar react-native-reanimated v3
- Entering/Exiting animations
- Shared values para interacoes

### 6. Acessibilidade
- accessibilityLabel obrigatorio
- accessibilityRole para elementos interativos
- accessibilityHint quando necessario

## Exemplos

### Button

```typescript
import React from "react";
import { Pressable, Text, ActivityIndicator } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS, ACCESSIBILITY } from "../theme/design-system";
import * as Haptics from "expo-haptics";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
}

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
}: ButtonProps) {
  const { colors } = useTheme();

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const sizes = {
    sm: { height: 36, paddingHorizontal: SPACING.lg, fontSize: TYPOGRAPHY.labelSmall.fontSize },
    md: { height: ACCESSIBILITY.minTapTarget, paddingHorizontal: SPACING.xl, fontSize: TYPOGRAPHY.labelMedium.fontSize },
    lg: { height: 52, paddingHorizontal: SPACING["2xl"], fontSize: TYPOGRAPHY.labelLarge.fontSize },
  };

  const variants = {
    primary: {
      backgroundColor: colors.primary[500],
      textColor: COLORS.text.inverse,
    },
    secondary: {
      backgroundColor: "transparent",
      borderWidth: 1.5,
      borderColor: colors.primary[500],
      textColor: colors.primary[500],
    },
    ghost: {
      backgroundColor: "transparent",
      textColor: colors.primary[500],
    },
  };

  const style = { ...sizes[size], ...variants[variant] };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      accessibilityLabel={title}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      style={({ pressed }) => ({
        height: style.height,
        paddingHorizontal: style.paddingHorizontal,
        backgroundColor: style.backgroundColor,
        borderWidth: style.borderWidth,
        borderColor: style.borderColor,
        borderRadius: RADIUS.lg,
        alignItems: "center",
        justifyContent: "center",
        opacity: pressed ? 0.8 : disabled ? 0.5 : 1,
        ...SHADOWS.sm,
      })}
    >
      {loading ? (
        <ActivityIndicator color={style.textColor} />
      ) : (
        <Text
          style={{
            color: style.textColor,
            fontSize: style.fontSize,
            fontWeight: "600",
          }}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}
```

### Card

```typescript
import React from "react";
import { View, Text, Pressable } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from "../theme/design-system";
import Animated, { FadeIn } from "react-native-reanimated";

interface CardProps {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  children?: React.ReactNode;
}

export function Card({ title, subtitle, onPress, children }: CardProps) {
  const { colors } = useTheme();

  const Container = onPress ? Pressable : View;

  return (
    <Animated.View entering={FadeIn}>
      <Container
        onPress={onPress}
        accessibilityLabel={title}
        accessibilityRole={onPress ? "button" : undefined}
        style={{
          backgroundColor: colors.background.card,
          borderRadius: RADIUS["2xl"],
          padding: SPACING["2xl"],
          ...SHADOWS.md,
        }}
      >
        <Text
          style={{
            color: colors.text.primary,
            fontSize: TYPOGRAPHY.titleMedium.fontSize,
            fontWeight: "600",
            marginBottom: subtitle ? SPACING.xs : 0,
          }}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={{
              color: colors.text.secondary,
              fontSize: TYPOGRAPHY.bodySmall.fontSize,
            }}
          >
            {subtitle}
          </Text>
        )}
        {children}
      </Container>
    </Animated.View>
  );
}
```
