import React, { useState, useMemo } from "react";
import { View, Text, Pressable, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInUp, ZoomIn } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useCheckInStore } from "../state/store";

const MOOD_OPTIONS = [
  { value: 1, emoji: "😢", label: "Difícil" },
  { value: 2, emoji: "😔", label: "Baixo" },
  { value: 3, emoji: "😐", label: "Ok" },
  { value: 4, emoji: "🙂", label: "Bem" },
  { value: 5, emoji: "😊", label: "Ótimo" },
];

const ENERGY_OPTIONS = [
  { value: 1, emoji: "🔋", label: "Esgotada", color: "#EF4444" },
  { value: 2, emoji: "🪫", label: "Cansada", color: "#F97316" },
  { value: 3, emoji: "⚡", label: "Normal", color: "#EAB308" },
  { value: 4, emoji: "✨", label: "Boa", color: "#22C55E" },
  { value: 5, emoji: "🌟", label: "Plena", color: "#10B981" },
];

const SLEEP_OPTIONS = [
  { value: 1, emoji: "😫", label: "Péssimo" },
  { value: 2, emoji: "😴", label: "Ruim" },
  { value: 3, emoji: "😌", label: "Regular" },
  { value: 4, emoji: "😇", label: "Bom" },
  { value: 5, emoji: "💤", label: "Ótimo" },
];

type CheckInStep = "mood" | "energy" | "sleep" | "complete";

interface DailyCheckInProps {
  onComplete?: () => void;
}

export default function DailyCheckIn({ onComplete }: DailyCheckInProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<CheckInStep>("mood");

  const checkIns = useCheckInStore((s) => s.checkIns);
  const setTodayMood = useCheckInStore((s) => s.setTodayMood);
  const setTodayEnergy = useCheckInStore((s) => s.setTodayEnergy);
  const setTodaySleep = useCheckInStore((s) => s.setTodaySleep);

  const today = new Date().toISOString().split("T")[0];
  const todayCheckIn = useMemo(() => {
    return checkIns.find((c) => c.date === today);
  }, [checkIns, today]);

  const isComplete = todayCheckIn?.mood && todayCheckIn?.energy && todayCheckIn?.sleep;

  const handleOpen = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentStep("mood");
    setIsOpen(true);
  };

  const handleSelect = async (type: CheckInStep, value: number) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (type === "mood") {
      setTodayMood(value);
      setCurrentStep("energy");
    } else if (type === "energy") {
      setTodayEnergy(value);
      setCurrentStep("sleep");
    } else if (type === "sleep") {
      setTodaySleep(value);
      setCurrentStep("complete");
      setTimeout(() => {
        setIsOpen(false);
        onComplete?.();
      }, 1500);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case "mood":
        return "Como você está se sentindo?";
      case "energy":
        return "Como está sua energia?";
      case "sleep":
        return "Como foi seu sono?";
      case "complete":
        return "Check-in completo!";
    }
  };

  const getOptions = () => {
    switch (currentStep) {
      case "mood":
        return MOOD_OPTIONS;
      case "energy":
        return ENERGY_OPTIONS;
      case "sleep":
        return SLEEP_OPTIONS;
      default:
        return [];
    }
  };

  const renderCompactView = () => {
    if (isComplete) {
      return (
        <Pressable
          onPress={handleOpen}
          style={{
            backgroundColor: "#ECFDF5",
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: "#D1FAE5",
          }}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: "#10B981",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <Ionicons name="checkmark" size={22} color="#FFFFFF" />
              </View>
              <View>
                <Text style={{ color: "#065F46", fontSize: 15, fontWeight: "600" }}>
                  Check-in feito!
                </Text>
                <Text style={{ color: "#047857", fontSize: 13, marginTop: 2 }}>
                  Humor: {MOOD_OPTIONS.find((m) => m.value === todayCheckIn?.mood)?.emoji} ·
                  Energia: {ENERGY_OPTIONS.find((e) => e.value === todayCheckIn?.energy)?.emoji} ·
                  Sono: {SLEEP_OPTIONS.find((s) => s.value === todayCheckIn?.sleep)?.emoji}
                </Text>
              </View>
            </View>
          </View>
        </Pressable>
      );
    }

    return (
      <Pressable
        onPress={handleOpen}
        style={{
          backgroundColor: "#FEF3C7",
          borderRadius: 16,
          padding: 16,
          borderWidth: 1,
          borderColor: "#FDE68A",
        }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: "#F59E0B",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Text style={{ fontSize: 20 }}>✨</Text>
            </View>
            <View className="flex-1">
              <Text style={{ color: "#92400E", fontSize: 15, fontWeight: "600" }}>
                Check-in de hoje
              </Text>
              <Text style={{ color: "#B45309", fontSize: 13, marginTop: 2 }}>
                10 segundos · Humor, energia e sono
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#D97706" />
        </View>
      </Pressable>
    );
  };

  return (
    <>
      {renderCompactView()}

      <Modal visible={isOpen} animationType="fade" transparent statusBarTranslucent>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
            padding: 24,
          }}
        >
          <Animated.View
            entering={ZoomIn.duration(300).springify()}
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 24,
              padding: 24,
              width: "100%",
              maxWidth: 340,
            }}
          >
            {/* Close Button */}
            <Pressable
              onPress={() => setIsOpen(false)}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: "#F5F5F4",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="close" size={18} color="#78716C" />
            </Pressable>

            {/* Progress */}
            <View className="flex-row mb-6">
              {["mood", "energy", "sleep"].map((step, index) => (
                <View
                  key={step}
                  style={{
                    flex: 1,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor:
                      currentStep === step
                        ? "#E11D48"
                        : index < ["mood", "energy", "sleep"].indexOf(currentStep)
                        ? "#10B981"
                        : "#E5E5E5",
                    marginRight: index < 2 ? 8 : 0,
                  }}
                />
              ))}
            </View>

            {/* Title */}
            <Animated.Text
              entering={FadeIn.duration(300)}
              style={{
                fontSize: 20,
                fontWeight: "600",
                color: "#1F2937",
                textAlign: "center",
                marginBottom: 24,
              }}
            >
              {getStepTitle()}
            </Animated.Text>

            {/* Options or Complete State */}
            {currentStep === "complete" ? (
              <Animated.View
                entering={ZoomIn.duration(400).springify()}
                style={{ alignItems: "center", paddingVertical: 20 }}
              >
                <View
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: "#10B981",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  <Ionicons name="checkmark" size={40} color="#FFFFFF" />
                </View>
                <Text style={{ fontSize: 16, color: "#6B7280", textAlign: "center" }}>
                  Obrigada por cuidar de você!
                </Text>
              </Animated.View>
            ) : (
              <View className="flex-row justify-between">
                {getOptions().map((option, index) => (
                  <Animated.View
                    key={option.value}
                    entering={FadeInUp.delay(index * 50).duration(300).springify()}
                  >
                    <Pressable
                      onPress={() => handleSelect(currentStep, option.value)}
                      style={{
                        alignItems: "center",
                        padding: 12,
                        borderRadius: 16,
                        backgroundColor: "#FBF9F7",
                        minWidth: 56,
                      }}
                    >
                      <Text style={{ fontSize: 28, marginBottom: 4 }}>{option.emoji}</Text>
                      <Text style={{ fontSize: 11, color: "#6B7280", fontWeight: "500" }}>
                        {option.label}
                      </Text>
                    </Pressable>
                  </Animated.View>
                ))}
              </View>
            )}
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}
