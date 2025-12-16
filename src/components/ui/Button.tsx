import React, { useMemo } from "react";
import { Pressable, Text, ActivityIndicator, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { buttonAccessibility } from "../../utils/accessibility";
import { useTheme } from "../../hooks/useTheme";

interface ButtonProps {
  /** Button text label */
  children: string;
  /** Press handler */
  onPress: () => void;
  /**
   * Visual style variant:
   * - accent: Rosa CTA (ação principal, destaque máximo)
   * - primary: Azul pastel (ação primária, calmo)
   * - secondary: Outline azul (ação secundária)
   * - outline: Outline customizável
   * - ghost: Sem fundo (terciário)
   * - soft: Fundo suave neutro
   */
  variant?: "accent" | "primary" | "secondary" | "outline" | "ghost" | "soft";
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Optional icon (Ionicons name) */
  icon?: keyof typeof Ionicons.glyphMap;
  /** Icon position relative to text */
  iconPosition?: "left" | "right";
  /** Loading state (shows spinner) */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Full width button */
  fullWidth?: boolean;
  /** Custom color override (for outline/ghost variants) */
  color?: string;
  /** Accessibility label override */
  accessibilityLabel?: string;
  /** Additional style overrides */
  style?: ViewStyle;
}

/**
 * Design System Button Component - Calm FemTech 2025
 *
 * Paleta híbrida: Azul (calma) + Rosa (CTAs)
 *
 * Hierarquia:
 * - accent (rosa): Ação principal, máximo destaque
 * - primary (azul): Ação primária, tom calmo
 * - secondary (outline): Ação secundária
 * - ghost: Ação terciária
 *
 * @example
 * ```tsx
 * <Button variant="accent" onPress={handleSave}>Salvar</Button>
 * <Button variant="primary" onPress={handleNext}>Próximo</Button>
 * <Button variant="secondary" icon="heart">Favoritar</Button>
 * <Button variant="ghost" onPress={handleCancel}>Cancelar</Button>
 * ```
 */
export function Button({
  children,
  onPress,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  fullWidth = false,
  color,
  accessibilityLabel,
  style,
}: ButtonProps) {
  const { brand, neutral, isDark } = useTheme();

  const handlePress = async () => {
    if (!disabled && !loading) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const sizeStyles = useMemo(() => ({
    sm: { paddingVertical: 10, paddingHorizontal: 16, fontSize: 14, iconSize: 16, minHeight: 40 },
    md: { paddingVertical: 14, paddingHorizontal: 20, fontSize: 15, iconSize: 18, minHeight: 44 },
    lg: { paddingVertical: 18, paddingHorizontal: 24, fontSize: 16, iconSize: 20, minHeight: 52 },
  }), []);

  const variantStyles = useMemo(() => ({
    // Rosa CTA - Destaque máximo (warmth, ação principal)
    accent: {
      bg: brand.accent[500],
      text: "#FFFFFF",
      border: "transparent",
      shadow: {
        shadowColor: brand.accent[500],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 6,
      },
    },
    // Azul pastel - Ação primária (calmo, confiante)
    primary: {
      bg: brand.primary[500],
      text: "#FFFFFF",
      border: "transparent",
      shadow: undefined,
    },
    // Outline azul - Ação secundária
    secondary: {
      bg: "transparent",
      text: brand.primary[600],
      border: brand.primary[400],
      shadow: undefined,
    },
    // Outline customizável
    outline: {
      bg: "transparent",
      text: color || brand.primary[600],
      border: color || brand.primary[400],
      shadow: undefined,
    },
    // Sem fundo - Terciário
    ghost: {
      bg: "transparent",
      text: color || brand.primary[600],
      border: "transparent",
      shadow: undefined,
    },
    // Fundo suave neutro
    soft: {
      bg: isDark ? neutral[800] : neutral[100],
      text: color || (isDark ? neutral[100] : neutral[900]),
      border: "transparent",
      shadow: undefined,
    },
  }), [brand, neutral, isDark, color]);

  const currentSize = sizeStyles[size];
  const currentVariant = variantStyles[variant];
  const opacity = disabled ? 0.5 : 1;

  const accessibilityProps = buttonAccessibility(
    accessibilityLabel || children,
    disabled ? "Botão desabilitado" : loading ? "Carregando..." : undefined,
    disabled || loading
  );

  return (
    <Pressable
      {...accessibilityProps}
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: currentVariant.bg,
        borderWidth: currentVariant.border !== "transparent" ? 1.5 : 0,
        borderColor: currentVariant.border,
        borderRadius: 14,
        paddingVertical: currentSize.paddingVertical,
        paddingHorizontal: currentSize.paddingHorizontal,
        minHeight: currentSize.minHeight,
        opacity: pressed ? 0.8 : opacity,
        transform: pressed ? [{ scale: 0.98 }] : [{ scale: 1 }],
        width: fullWidth ? "100%" : "auto",
        ...(currentVariant.shadow || {}),
        ...style,
      })}
    >
      {loading ? (
        <ActivityIndicator size="small" color={currentVariant.text} />
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <Ionicons
              name={icon}
              size={currentSize.iconSize}
              color={currentVariant.text}
              style={{ marginRight: 8 }}
            />
          )}
          <Text
            style={{
              color: currentVariant.text,
              fontSize: currentSize.fontSize,
              fontWeight: "600",
              fontFamily: "DMSans_600SemiBold",
            }}
          >
            {children}
          </Text>
          {icon && iconPosition === "right" && (
            <Ionicons
              name={icon}
              size={currentSize.iconSize}
              color={currentVariant.text}
              style={{ marginLeft: 8 }}
            />
          )}
        </>
      )}
    </Pressable>
  );
}

/** Legacy export for backward compatibility */
export default Button;
