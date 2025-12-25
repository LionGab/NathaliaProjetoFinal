import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { brand, premium } from "../../../theme/tokens";
import { FONTS } from "../../../config/onboarding-data";

const GLASS = premium.glass;
const TEXT = premium.text;

type ObjectiveChipProps = {
  selected: boolean;
  onPress: () => void;
  emoji: string;
  label: string;
};

export const ObjectiveChip: React.FC<ObjectiveChipProps> = React.memo(
  ({ selected, onPress, emoji, label }) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const handlePress = async () => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      scale.value = withSequence(
        withTiming(0.9, { duration: 60 }),
        withSpring(1, { damping: 15 })
      );
      onPress();
    };

    return (
      <Pressable onPress={handlePress}>
        <Animated.View style={animatedStyle}>
          <View style={[styles.chip, selected && styles.chipSelected]}>
            <Text style={styles.chipEmoji}>{emoji}</Text>
            <Text
              style={[
                styles.chipLabel,
                selected && styles.chipLabelSelected,
              ]}
            >
              {label}
            </Text>
          </View>
        </Animated.View>
      </Pressable>
    );
  }
);

ObjectiveChip.displayName = "ObjectiveChip";

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GLASS.base,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 18,
    gap: 8,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  chipSelected: {
    backgroundColor: GLASS.accentMedium,
    borderColor: brand.accent[400],
  },
  chipEmoji: {
    fontSize: 18,
  },
  chipLabel: {
    fontSize: 14,
    fontFamily: FONTS.accent,
    color: TEXT.bright,
  },
  chipLabelSelected: {
    color: brand.accent[300],
  },
});
