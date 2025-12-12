import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

interface ChipProps {
  label: string;
  onPress?: () => void;
  selected?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  emoji?: string;
  variant?: "default" | "outline" | "soft";
  color?: string;
  size?: "sm" | "md";
}

const COLORS = {
  primary: "#E11D48",
  primarySoft: "#FEE2E2",
  text: "#4A4A4A",
  textMuted: "#7A7A7A",
  border: "#E5E5E5",
  soft: "#FBF9F7",
  white: "#FFFFFF",
};

export default function Chip({
  label,
  onPress,
  selected = false,
  icon,
  emoji,
  variant = "default",
  color,
  size = "md",
}: ChipProps) {
  const handlePress = async () => {
    if (onPress) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const sizeStyles = {
    sm: { paddingVertical: 6, paddingHorizontal: 12, fontSize: 13, iconSize: 14 },
    md: { paddingVertical: 10, paddingHorizontal: 16, fontSize: 14, iconSize: 16 },
  };

  const currentSize = sizeStyles[size];

  const getStyles = () => {
    if (selected) {
      return {
        bg: color || COLORS.primary,
        text: COLORS.white,
        border: color || COLORS.primary,
      };
    }

    switch (variant) {
      case "outline":
        return {
          bg: "transparent",
          text: color || COLORS.text,
          border: COLORS.border,
        };
      case "soft":
        return {
          bg: COLORS.soft,
          text: color || COLORS.text,
          border: "transparent",
        };
      default:
        return {
          bg: COLORS.white,
          text: COLORS.text,
          border: COLORS.border,
        };
    }
  };

  const styles = getStyles();

  const content = (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: styles.bg,
        borderWidth: styles.border !== "transparent" ? 1 : 0,
        borderColor: styles.border,
        borderRadius: 20,
        paddingVertical: currentSize.paddingVertical,
        paddingHorizontal: currentSize.paddingHorizontal,
      }}
    >
      {emoji && (
        <Text style={{ fontSize: currentSize.iconSize, marginRight: 6 }}>
          {emoji}
        </Text>
      )}
      {icon && !emoji && (
        <Ionicons
          name={icon}
          size={currentSize.iconSize}
          color={styles.text}
          style={{ marginRight: 6 }}
        />
      )}
      <Text
        style={{
          color: styles.text,
          fontSize: currentSize.fontSize,
          fontWeight: selected ? "600" : "500",
        }}
      >
        {label}
      </Text>
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={handlePress} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
        {content}
      </Pressable>
    );
  }

  return content;
}
