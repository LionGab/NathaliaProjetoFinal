/**
 * Nossa Maternidade - RestSoundsScreen
 * Relaxation sounds categorized by nature, meditation, and sleep
 */

import React, { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { Audio } from "expo-av";
import { useNavigation } from "@react-navigation/native";
import {
  COLORS,
  SPACING,
  RADIUS,
  TYPOGRAPHY,
} from "../theme/design-system";

type SoundCategory = "nature" | "meditation" | "sleep";

interface SoundItem {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  category: SoundCategory;
  audioUri?: string;
}

const SOUNDS: SoundItem[] = [
  // Nature Sounds
  {
    id: "rain",
    title: "Chuva Suave",
    subtitle: "Som relaxante de chuva",
    duration: "30 min",
    icon: "rainy",
    color: "#60A5FA",
    category: "nature",
  },
  {
    id: "ocean",
    title: "Ondas do Mar",
    subtitle: "Paz do oceano",
    duration: "45 min",
    icon: "water",
    color: "#06B6D4",
    category: "nature",
  },
  {
    id: "forest",
    title: "Floresta",
    subtitle: "Passaros e natureza",
    duration: "40 min",
    icon: "leaf",
    color: COLORS.semantic.success,
    category: "nature",
  },
  {
    id: "fire",
    title: "Lareira",
    subtitle: "Crepitar do fogo",
    duration: "60 min",
    icon: "flame",
    color: "#F59E0B",
    category: "nature",
  },

  // Meditation
  {
    id: "breathe",
    title: "Respiracao Guiada",
    subtitle: "Para maes",
    duration: "10 min",
    icon: "heart",
    color: COLORS.primary[500],
    category: "meditation",
  },
  {
    id: "body-scan",
    title: "Relaxamento Corporal",
    subtitle: "Meditacao guiada",
    duration: "15 min",
    icon: "body",
    color: COLORS.secondary[500],
    category: "meditation",
  },
  {
    id: "loving-kindness",
    title: "Amor Proprio",
    subtitle: "Meditacao de bondade",
    duration: "12 min",
    icon: "sparkles",
    color: "#F472B6",
    category: "meditation",
  },

  // Sleep
  {
    id: "lullaby",
    title: "Cancao de Ninar",
    subtitle: "Para voce e seu bebe",
    duration: "20 min",
    icon: "musical-notes",
    color: "#8B5CF6",
    category: "sleep",
  },
  {
    id: "sleep-story",
    title: "Historia para Dormir",
    subtitle: "Narracao tranquila",
    duration: "25 min",
    icon: "book",
    color: "#6366F1",
    category: "sleep",
  },
  {
    id: "white-noise",
    title: "Ruido Branco",
    subtitle: "Som continuo suave",
    duration: "60 min",
    icon: "radio",
    color: "#94A3B8",
    category: "sleep",
  },
];

const CATEGORIES = [
  { id: "nature" as SoundCategory, name: "Natureza", icon: "leaf" as keyof typeof Ionicons.glyphMap },
  { id: "meditation" as SoundCategory, name: "Meditacao", icon: "heart" as keyof typeof Ionicons.glyphMap },
  { id: "sleep" as SoundCategory, name: "Sono", icon: "moon" as keyof typeof Ionicons.glyphMap },
];

export default function RestSoundsScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState<SoundCategory>("nature");
  const [playingSound, setPlayingSound] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const filteredSounds = SOUNDS.filter((s) => s.category === selectedCategory);

  const handleCategoryChange = (category: SoundCategory) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCategory(category);
  };

  const handlePlaySound = async (soundId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Stop currently playing sound
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }

    if (playingSound === soundId) {
      // Stop if same sound
      setPlayingSound(null);
      return;
    }

    // In production, load and play the actual audio file
    // For now, just simulate playing
    setPlayingSound(soundId);
  };

  const handleClose = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
    }
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#1F2937" }}>
      {/* Header */}
      <LinearGradient
        colors={["#1F2937", "#111827"]}
        style={{
          paddingTop: insets.top + SPACING.lg,
          paddingBottom: SPACING.xl,
          paddingHorizontal: SPACING["2xl"],
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: SPACING["2xl"],
          }}
        >
          <Pressable onPress={handleClose} style={{ padding: SPACING.sm }}>
            <Ionicons name="close" size={28} color="#FFF" />
          </Pressable>
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: TYPOGRAPHY.titleMedium.fontSize,
              fontWeight: "700",
            }}
          >
            Descanso
          </Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Info Card */}
        <View
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: RADIUS["2xl"],
            padding: SPACING.lg,
            marginBottom: SPACING.lg,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                backgroundColor: "rgba(192, 132, 252, 0.2)",
                borderRadius: RADIUS.full,
                padding: SPACING.sm,
                marginRight: SPACING.md,
              }}
            >
              <Ionicons name="moon" size={20} color="#C084FC" />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: TYPOGRAPHY.bodySmall.fontSize,
                  fontWeight: "600",
                }}
              >
                Sons para relaxar
              </Text>
              <Text
                style={{
                  color: "rgba(255, 255, 255, 0.6)",
                  fontSize: TYPOGRAPHY.labelSmall.fontSize,
                  marginTop: 2,
                }}
              >
                Encontre paz e tranquilidade
              </Text>
            </View>
          </View>
        </View>

        {/* Category Tabs */}
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: RADIUS.full,
            padding: SPACING.xs,
          }}
        >
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat.id}
              onPress={() => handleCategoryChange(cat.id)}
              style={{ flex: 1 }}
            >
              <View
                style={{
                  paddingVertical: SPACING.sm + 2,
                  borderRadius: RADIUS.full,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor:
                    selectedCategory === cat.id
                      ? "rgba(255, 255, 255, 0.2)"
                      : "transparent",
                }}
              >
                <Ionicons
                  name={cat.icon}
                  size={16}
                  color={selectedCategory === cat.id ? "#FFF" : "#9CA3AF"}
                />
                <Text
                  style={{
                    marginLeft: SPACING.sm,
                    fontSize: TYPOGRAPHY.bodySmall.fontSize,
                    fontWeight: "600",
                    color: selectedCategory === cat.id ? "#FFFFFF" : "#9CA3AF",
                  }}
                >
                  {cat.name}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </LinearGradient>

      {/* Sounds List */}
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: SPACING["2xl"] }}
      >
        <View style={{ paddingHorizontal: SPACING["2xl"], paddingTop: SPACING.lg }}>
          {filteredSounds.map((item, index) => (
            <Animated.View
              key={item.id}
              entering={FadeInUp.delay(index * 80).duration(500).springify()}
              style={{ marginBottom: SPACING.lg }}
            >
              <Pressable onPress={() => handlePlaySound(item.id)}>
                <View
                  style={{
                    backgroundColor:
                      playingSound === item.id
                        ? `${item.color}20`
                        : "rgba(255, 255, 255, 0.1)",
                    borderRadius: RADIUS["2xl"],
                    padding: SPACING.xl,
                    borderWidth: 1,
                    borderColor:
                      playingSound === item.id
                        ? item.color
                        : "rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {/* Icon */}
                    <View
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 28,
                        backgroundColor:
                          playingSound === item.id ? item.color : "#374151",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: SPACING.lg,
                      }}
                    >
                      {playingSound === item.id ? (
                        <Ionicons name="pause" size={28} color="#FFF" />
                      ) : (
                        <Ionicons
                          name={item.icon}
                          size={28}
                          color={playingSound === item.id ? "#FFF" : item.color}
                        />
                      )}
                    </View>

                    {/* Content */}
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          color: "#FFFFFF",
                          fontSize: TYPOGRAPHY.bodyLarge.fontSize,
                          fontWeight: "700",
                          marginBottom: 2,
                        }}
                      >
                        {item.title}
                      </Text>
                      <Text
                        style={{
                          color: "#9CA3AF",
                          fontSize: TYPOGRAPHY.bodySmall.fontSize,
                          marginBottom: SPACING.sm,
                        }}
                      >
                        {item.subtitle}
                      </Text>
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Ionicons name="time-outline" size={14} color="#9CA3AF" />
                        <Text
                          style={{
                            color: "#9CA3AF",
                            fontSize: TYPOGRAPHY.labelSmall.fontSize,
                            marginLeft: 4,
                          }}
                        >
                          {item.duration}
                        </Text>
                      </View>
                    </View>

                    {/* Play Button */}
                    <View
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        backgroundColor:
                          playingSound === item.id ? item.color : "#374151",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons
                        name={playingSound === item.id ? "pause" : "play"}
                        size={22}
                        color="#FFF"
                      />
                    </View>
                  </View>

                  {/* Playing Indicator */}
                  {playingSound === item.id && (
                    <Animated.View
                      entering={FadeInDown.duration(400)}
                      style={{
                        marginTop: SPACING.lg,
                        paddingTop: SPACING.lg,
                        borderTopWidth: 1,
                        borderTopColor: "rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={{
                            color: "rgba(255, 255, 255, 0.6)",
                            fontSize: TYPOGRAPHY.labelSmall.fontSize,
                          }}
                        >
                          Tocando...
                        </Text>
                        <View style={{ flexDirection: "row", gap: 3 }}>
                          {[1, 2, 3, 4].map((i) => (
                            <View
                              key={i}
                              style={{
                                width: 3,
                                height: 12 + Math.random() * 8,
                                backgroundColor: item.color,
                                borderRadius: 2,
                              }}
                            />
                          ))}
                        </View>
                      </View>
                    </Animated.View>
                  )}
                </View>
              </Pressable>
            </Animated.View>
          ))}
        </View>

        {/* Bottom Tip */}
        <View style={{ paddingHorizontal: SPACING["2xl"], marginTop: SPACING.lg }}>
          <View
            style={{
              backgroundColor: "rgba(168, 85, 247, 0.1)",
              borderRadius: RADIUS["2xl"],
              padding: SPACING.xl,
              borderWidth: 1,
              borderColor: "rgba(168, 85, 247, 0.2)",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
              <Text style={{ fontSize: 24, marginRight: SPACING.md }}>💡</Text>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontWeight: "600",
                    marginBottom: SPACING.sm,
                  }}
                >
                  Dica
                </Text>
                <Text
                  style={{
                    color: "rgba(255, 255, 255, 0.7)",
                    fontSize: TYPOGRAPHY.bodySmall.fontSize,
                    lineHeight: 20,
                  }}
                >
                  Use fones de ouvido para uma experiencia mais imersiva. Sons da
                  natureza podem ajudar seu bebe a dormir melhor tambem.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
