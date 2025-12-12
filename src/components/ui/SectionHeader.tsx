import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
  icon?: keyof typeof Ionicons.glyphMap;
  emoji?: string;
}

const COLORS = {
  text: "#4A4A4A",
  textMuted: "#7A7A7A",
  primary: "#E11D48",
};

export default function SectionHeader({
  title,
  subtitle,
  action,
  icon,
  emoji,
}: SectionHeaderProps) {
  const handleAction = async () => {
    if (action) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      action.onPress();
    }
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
        {emoji && (
          <Text style={{ fontSize: 20, marginRight: 10 }}>{emoji}</Text>
        )}
        {icon && !emoji && (
          <Ionicons
            name={icon}
            size={20}
            color={COLORS.text}
            style={{ marginRight: 10 }}
          />
        )}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: COLORS.text,
              fontSize: 18,
              fontWeight: "600",
            }}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={{
                color: COLORS.textMuted,
                fontSize: 13,
                marginTop: 2,
              }}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      {action && (
        <Pressable
          onPress={handleAction}
          style={({ pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text
            style={{
              color: COLORS.primary,
              fontSize: 14,
              fontWeight: "500",
            }}
          >
            {action.label}
          </Text>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={COLORS.primary}
            style={{ marginLeft: 2 }}
          />
        </Pressable>
      )}
    </View>
  );
}
