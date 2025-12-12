import React from "react";
import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

interface IconButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "filled" | "soft" | "outline";
  color?: string;
  bgColor?: string;
  disabled?: boolean;
}

const SIZE_MAP = {
  sm: { button: 36, icon: 18 },
  md: { button: 44, icon: 22 },
  lg: { button: 52, icon: 26 },
};

const COLORS = {
  default: "#4A4A4A",
  muted: "#9A9A9A",
  primary: "#E11D48",
  white: "#FFFFFF",
  soft: "#FBF9F7",
  border: "#E5E5E5",
};

export default function IconButton({
  icon,
  onPress,
  size = "md",
  variant = "default",
  color,
  bgColor,
  disabled = false,
}: IconButtonProps) {
  const handlePress = async () => {
    if (!disabled) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const currentSize = SIZE_MAP[size];

  const variantStyles: Record<string, { bg: string; iconColor: string; border?: string }> = {
    default: {
      bg: "transparent",
      iconColor: color || COLORS.default,
    },
    filled: {
      bg: bgColor || COLORS.primary,
      iconColor: color || COLORS.white,
    },
    soft: {
      bg: bgColor || COLORS.soft,
      iconColor: color || COLORS.default,
    },
    outline: {
      bg: "transparent",
      iconColor: color || COLORS.default,
      border: COLORS.border,
    },
  };

  const currentVariant = variantStyles[variant];

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => ({
        width: currentSize.button,
        height: currentSize.button,
        borderRadius: currentSize.button / 2,
        backgroundColor: currentVariant.bg,
        borderWidth: variant === "outline" ? 1.5 : 0,
        borderColor: currentVariant.border ?? "transparent",
        alignItems: "center",
        justifyContent: "center",
        opacity: pressed ? 0.7 : disabled ? 0.5 : 1,
      })}
    >
      <Ionicons
        name={icon}
        size={currentSize.icon}
        color={currentVariant.iconColor}
      />
    </Pressable>
  );
}
