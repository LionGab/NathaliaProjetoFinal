import React from "react";
import { Text, StyleSheet, Pressable } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { premium } from "../../../theme/tokens";
import { FONTS } from "../../../config/onboarding-data";

const GLASS = premium.glass;
const TEXT = premium.text;

type EmotionalOptionProps = {
  id: string;
  emoji: string;
  label: string;
  color: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
  index: number;
};

export const EmotionalOption: React.FC<EmotionalOptionProps> = React.memo(
  ({ id, emoji, label, color, isSelected, onSelect, index }) => {
    return (
      <Animated.View
        entering={FadeInDown.delay(350 + index * 60).duration(300)}
        style={styles.emotionalItem}
      >
        <Pressable
          onPress={() => {
            onSelect(id);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }}
          style={[
            styles.emotionalCard,
            isSelected && {
              borderColor: color,
              backgroundColor: `${color}20`,
            },
          ]}
        >
          <Text style={styles.emotionalEmoji}>{emoji}</Text>
          <Text
            style={[
              styles.emotionalLabel,
              isSelected && { color: color },
            ]}
          >
            {label}
          </Text>
        </Pressable>
      </Animated.View>
    );
  }
);

EmotionalOption.displayName = "EmotionalOption";

const styles = StyleSheet.create({
  emotionalItem: {
    width: "30%",
  },
  emotionalCard: {
    alignItems: "center",
    backgroundColor: GLASS.light,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  emotionalEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  emotionalLabel: {
    fontSize: 12,
    fontFamily: FONTS.accent,
    color: TEXT.secondary,
    textAlign: "center",
  },
});
