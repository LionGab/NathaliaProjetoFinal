/**
 * Button - Design System Component
 *
 * Pink Clean + Blue Clean 2025 ✨
 *
 * Hierarquia de variantes:
 * - accent: Pink Clean CTA (destaque máximo)
 * - glow: Pink Clean CTA com animação de glow pulsante
 * - gradient: Gradiente pink para destaque premium
 * - primary: Blue Clean (ação primária)
 * - secondary: Outline blue
 * - outline: Outline customizável
 * - ghost: Sem fundo
 * - soft: Fundo suave blue
 *
 * @example
 * ```tsx
 * <Button variant="glow" onPress={handleCTA}>Começar Agora</Button>
 * <Button variant="gradient" onPress={handlePremium}>Upgrade Premium</Button>
 * <Button variant="accent" onPress={handleSave}>Salvar</Button>
 * <Button variant="primary" onPress={handleNext}>Próximo</Button>
 * ```
 */

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useMemo, useCallback } from "react";
import { ActivityIndicator, Pressable, Text, View, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from "react-native-reanimated";
import { useTheme } from "../../hooks/useTheme";
import { buttonAccessibility } from "../../utils/accessibility";
import { haptic } from "../../utils/haptics";
import { SPRING, TIMING } from "../../utils/animations";
import { brand, neutral, gradients, shadows, micro } from "../../theme/tokens";

// ===========================================
// TYPES
// ===========================================

type ButtonVariant =
  | "accent"
  | "glow"
  | "gradient"
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "soft";

type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  /** Button text label */
  children: string;
  /** Press handler */
  onPress: () => void;
  /**
   * Visual style variant:
   * - accent: Rosa CTA (destaque máximo)
   * - glow: Rosa CTA com glow pulsante animado
   * - gradient: Gradiente rosa premium
   * - primary: Azul pastel (calmo)
   * - secondary: Outline azul
   * - outline: Outline customizável
   * - ghost: Sem fundo
   * - soft: Fundo suave azul
   */
  variant?: ButtonVariant;
  /** Size variant */
  size?: ButtonSize;
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

// ===========================================
// SIZE CONFIGS
// ===========================================

const SIZE_STYLES = {
  sm: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 14,
    iconSize: 16,
    minHeight: 44, // iOS HIG minimum
    borderRadius: 12,
  },
  md: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    fontSize: 15,
    iconSize: 18,
    minHeight: 44,
    borderRadius: 14,
  },
  lg: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    fontSize: 16,
    iconSize: 20,
    minHeight: 52,
    borderRadius: 16,
  },
} as const;

// ===========================================
// ANIMATED PRESSABLE
// ===========================================

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ===========================================
// BUTTON COMPONENT
// ===========================================

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
  const { button: buttonTokens, brand: themeBrand, neutral: themeNeutral, isDark } = useTheme();

  // Animation values
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(micro.glow.min as number);

  // Glow animation for glow variant
  useEffect(() => {
    if (variant === "glow" && !disabled) {
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(micro.glow.max, {
            duration: TIMING.glow.duration,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
          }),
          withTiming(micro.glow.min, {
            duration: TIMING.glow.duration,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
          })
        ),
        -1,
        false
      );
    }
  }, [variant, disabled, glowOpacity]);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(micro.pressScale, SPRING.snappy);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING.gentle);
  }, [scale]);

  const handlePress = useCallback(async () => {
    if (!disabled && !loading) {
      haptic.light();
      onPress();
    }
  }, [disabled, loading, onPress]);

  const currentSize = SIZE_STYLES[size];
  const isDisabled = disabled || loading;

  // Get variant-specific styles
  const getVariantStyles = useMemo(() => {
    const primary = buttonTokens.primary;
    const secondary = buttonTokens.secondary;
    const ghost = buttonTokens.ghost;
    const soft = buttonTokens.soft;

    return {
      // Rosa CTA - Destaque máximo
      accent: {
        bg: primary.background,
        text: primary.text,
        border: primary.border,
        bgPressed: primary.backgroundPressed,
        bgDisabled: primary.backgroundDisabled,
        textDisabled: primary.textDisabled,
        shadow: shadows.accentGlow,
        isGradient: false,
        hasGlow: false,
      },
      // Rosa CTA com glow animado
      glow: {
        bg: primary.background,
        text: primary.text,
        border: primary.border,
        bgPressed: primary.backgroundPressed,
        bgDisabled: primary.backgroundDisabled,
        textDisabled: primary.textDisabled,
        shadow: shadows.accentGlow,
        isGradient: false,
        hasGlow: true,
      },
      // Gradient rosa premium
      gradient: {
        bg: "transparent",
        text: neutral[900], // Navy for contrast
        border: "transparent",
        bgPressed: "transparent",
        bgDisabled: themeNeutral[200],
        textDisabled: themeNeutral[400],
        shadow: shadows.accentGlow,
        isGradient: true,
        hasGlow: false,
        gradientColors: gradients.accent,
      },
      // Azul pastel
      primary: {
        bg: themeBrand.primary[500],
        text: isDark ? themeBrand.primary[50] : themeNeutral[0],
        border: "transparent",
        bgPressed: themeBrand.primary[600],
        bgDisabled: themeNeutral[200],
        textDisabled: themeNeutral[400],
        shadow: undefined,
        isGradient: false,
        hasGlow: false,
      },
      // Outline azul
      secondary: {
        bg: secondary.background,
        text: secondary.text,
        border: secondary.border,
        bgPressed: secondary.backgroundPressed,
        bgDisabled: secondary.backgroundDisabled,
        textDisabled: secondary.textDisabled,
        shadow: undefined,
        isGradient: false,
        hasGlow: false,
      },
      // Outline customizável
      outline: {
        bg: "transparent",
        text: color || secondary.text,
        border: color || secondary.border,
        bgPressed: secondary.backgroundPressed,
        bgDisabled: "transparent",
        textDisabled: themeNeutral[400],
        shadow: undefined,
        isGradient: false,
        hasGlow: false,
      },
      // Sem fundo
      ghost: {
        bg: ghost.background,
        text: color || ghost.text,
        border: ghost.border,
        bgPressed: ghost.backgroundPressed,
        bgDisabled: ghost.backgroundDisabled,
        textDisabled: ghost.textDisabled,
        shadow: undefined,
        isGradient: false,
        hasGlow: false,
      },
      // Fundo suave azul
      soft: {
        bg: soft.background,
        text: color || soft.text,
        border: soft.border,
        bgPressed: soft.backgroundPressed,
        bgDisabled: soft.backgroundDisabled,
        textDisabled: soft.textDisabled,
        shadow: undefined,
        isGradient: false,
        hasGlow: false,
      },
    };
  }, [buttonTokens, themeBrand, themeNeutral, isDark, color]);

  const currentVariant = getVariantStyles[variant];

  // Animated styles
  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedGlowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  // Accessibility props
  const accessibilityProps = buttonAccessibility(
    accessibilityLabel || children,
    disabled ? "Botão desabilitado" : loading ? "Carregando..." : undefined,
    isDisabled
  );

  // Text color
  const textColor = isDisabled ? currentVariant.textDisabled : currentVariant.text;

  // Render button content
  const renderContent = () => (
    <>
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <Ionicons
              name={icon}
              size={currentSize.iconSize}
              color={textColor}
              style={{ marginRight: 8 }}
            />
          )}
          <Text
            style={{
              color: textColor,
              fontSize: currentSize.fontSize,
              fontWeight: "600",
              fontFamily: "Manrope_600SemiBold",
            }}
          >
            {children}
          </Text>
          {icon && iconPosition === "right" && (
            <Ionicons
              name={icon}
              size={currentSize.iconSize}
              color={textColor}
              style={{ marginLeft: 8 }}
            />
          )}
        </>
      )}
    </>
  );

  // Base button styles
  const baseButtonStyle = {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    minHeight: currentSize.minHeight,
    paddingVertical: currentSize.paddingVertical,
    paddingHorizontal: currentSize.paddingHorizontal,
    borderRadius: currentSize.borderRadius,
    width: fullWidth ? ("100%" as const) : ("auto" as const),
  };

  // Gradient variant
  if (variant === "gradient" && !isDisabled) {
    return (
      <AnimatedPressable
        {...accessibilityProps}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        style={[
          animatedContainerStyle,
          { width: fullWidth ? "100%" : "auto" },
          style,
        ]}
      >
        <LinearGradient
          colors={gradients.accent}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            baseButtonStyle,
            currentVariant.shadow,
            { overflow: "hidden" },
          ]}
        >
          {renderContent()}
        </LinearGradient>
      </AnimatedPressable>
    );
  }

  // Glow variant
  if (currentVariant.hasGlow) {
    return (
      <View style={[{ position: "relative" }, fullWidth && { width: "100%" }]}>
        {/* Glow layer */}
        <Animated.View
          style={[
            {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: brand.accent[400],
              borderRadius: currentSize.borderRadius,
              shadowColor: brand.accent[400],
              shadowOffset: { width: 0, height: 0 },
              shadowRadius: 20,
              elevation: 10,
            },
            animatedGlowStyle,
          ]}
          pointerEvents="none"
        />

        {/* Button */}
        <AnimatedPressable
          {...accessibilityProps}
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={isDisabled}
          style={[
            animatedContainerStyle,
            baseButtonStyle,
            {
              backgroundColor: isDisabled
                ? currentVariant.bgDisabled
                : currentVariant.bg,
              borderWidth: currentVariant.border !== "transparent" ? 1.5 : 0,
              borderColor: currentVariant.border,
              opacity: isDisabled ? 0.6 : 1,
            },
            currentVariant.shadow,
            style,
          ]}
        >
          {renderContent()}
        </AnimatedPressable>
      </View>
    );
  }

  // Standard variants
  return (
    <AnimatedPressable
      {...accessibilityProps}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      style={[
        animatedContainerStyle,
        baseButtonStyle,
        {
          backgroundColor: isDisabled
            ? currentVariant.bgDisabled
            : currentVariant.bg,
          borderWidth: currentVariant.border !== "transparent" ? 1.5 : 0,
          borderColor: currentVariant.border,
          opacity: isDisabled ? 0.6 : 1,
        },
        currentVariant.shadow,
        style,
      ]}
    >
      {renderContent()}
    </AnimatedPressable>
  );
}

/** Legacy export for backward compatibility */
export default Button;
