import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  FadeInDown,
  FadeIn,
} from "react-native-reanimated";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "WeightCalculator">;

// Tabela de ganho de peso recomendado (em kg) por semana gestacional
// Baseado em diretrizes do IOM (Institute of Medicine)
const WEIGHT_GAIN_RANGES = {
  underweight: { // IMC < 18.5
    week12: [0.5, 2.0],
    week20: [2.0, 6.0],
    week28: [5.0, 10.0],
    week36: [9.0, 15.0],
    week40: [12.5, 18.0],
  },
  normal: { // IMC 18.5-24.9
    week12: [0.5, 2.0],
    week20: [2.0, 5.5],
    week28: [4.5, 8.5],
    week36: [8.0, 13.0],
    week40: [11.5, 16.0],
  },
  overweight: { // IMC 25-29.9
    week12: [0.5, 1.5],
    week20: [1.5, 4.0],
    week28: [3.0, 6.5],
    week36: [5.5, 9.5],
    week40: [7.0, 11.5],
  },
  obese: { // IMC >= 30
    week12: [0, 1.0],
    week20: [0.5, 3.0],
    week28: [2.0, 5.0],
    week36: [4.0, 7.5],
    week40: [5.0, 9.0],
  },
};

const WEEKS = [12, 20, 28, 36, 40];

export default function WeightCalculatorScreen({ navigation }: Props) {
  const [prePregnancyWeight, setPrePregnancyWeight] = useState("");
  const [height, setHeight] = useState("");
  const [currentWeek, setCurrentWeek] = useState(20);

  // Calcular IMC pré-gravidez
  const bmi = useMemo(() => {
    const weight = parseFloat(prePregnancyWeight);
    const heightM = parseFloat(height) / 100;
    if (weight > 0 && heightM > 0) {
      return weight / (heightM * heightM);
    }
    return 0;
  }, [prePregnancyWeight, height]);

  // Determinar categoria de IMC
  const bmiCategory = useMemo(() => {
    if (bmi === 0) return null;
    if (bmi < 18.5) return "underweight";
    if (bmi < 25) return "normal";
    if (bmi < 30) return "overweight";
    return "obese";
  }, [bmi]);

  // Obter faixa de ganho de peso recomendado
  const recommendedGain = useMemo(() => {
    if (!bmiCategory) return null;

    const ranges = WEIGHT_GAIN_RANGES[bmiCategory as keyof typeof WEIGHT_GAIN_RANGES];

    // Encontrar a semana mais próxima
    let weekKey = `week${currentWeek}` as keyof typeof ranges;
    if (!ranges[weekKey]) {
      // Interpolação linear entre semanas
      const lowerWeek = WEEKS.filter(w => w < currentWeek).pop() || WEEKS[0];
      const upperWeek = WEEKS.filter(w => w > currentWeek)[0] || WEEKS[WEEKS.length - 1];

      const lowerKey = `week${lowerWeek}` as keyof typeof ranges;
      const upperKey = `week${upperWeek}` as keyof typeof ranges;

      const ratio = (currentWeek - lowerWeek) / (upperWeek - lowerWeek);
      const minGain = ranges[lowerKey][0] + (ranges[upperKey][0] - ranges[lowerKey][0]) * ratio;
      const maxGain = ranges[lowerKey][1] + (ranges[upperKey][1] - ranges[lowerKey][1]) * ratio;

      return [minGain, maxGain];
    }

    return ranges[weekKey];
  }, [bmiCategory, currentWeek]);

  // Calcular peso ideal atual
  const idealWeightRange = useMemo(() => {
    if (!recommendedGain) return null;
    const baseWeight = parseFloat(prePregnancyWeight);
    if (baseWeight <= 0) return null;

    return [
      baseWeight + recommendedGain[0],
      baseWeight + recommendedGain[1],
    ];
  }, [prePregnancyWeight, recommendedGain]);

  // Determinar status e cor
  const getStatusInfo = () => {
    if (!bmiCategory || bmi === 0) {
      return {
        status: "Preencha os dados",
        color: "#9CA3AF",
        icon: "information-circle" as const,
        bg: "bg-gray-100",
      };
    }

    const categoryLabels = {
      underweight: "Baixo peso",
      normal: "Peso normal",
      overweight: "Sobrepeso",
      obese: "Obesidade",
    };

    return {
      status: categoryLabels[bmiCategory as keyof typeof categoryLabels],
      color: bmiCategory === "normal" ? "#6BAD78" : bmiCategory === "underweight" ? "#F59E0B" : "#E11D48",
      icon: bmiCategory === "normal" ? "checkmark-circle" : "alert-circle" as const,
      bg: bmiCategory === "normal" ? "bg-sage-100" : bmiCategory === "underweight" ? "bg-yellow-100" : "bg-rose-100",
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <View className="flex-1 bg-cream">
      <LinearGradient
        colors={["#FFF5F0", "#FFFCF9"]}
        className="flex-1"
      >
        <SafeAreaView edges={["top"]} className="flex-1">
          {/* Header */}
          <View className="px-6 py-4 flex-row items-center">
            <Pressable
              onPress={() => navigation.goBack()}
              className="mr-4 active:opacity-50"
            >
              <Ionicons name="arrow-back" size={24} color="#1F2937" />
            </Pressable>
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-900" style={{ fontFamily: "DMSerifDisplay_400Regular" }}>
                Calculadora de Peso
              </Text>
              <Text className="text-sm text-gray-600 mt-1" style={{ fontFamily: "DMSans_400Regular" }}>
                Acompanhe seu ganho de peso ideal
              </Text>
            </View>
          </View>

          <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
            {/* Input: Peso Pré-Gravidez */}
            <Animated.View entering={FadeInDown.delay(100)} className="mb-6">
              <Text className="text-base font-semibold text-gray-900 mb-2" style={{ fontFamily: "DMSans_600SemiBold" }}>
                Peso pré-gravidez (kg)
              </Text>
              <View className="bg-white rounded-2xl px-4 py-4 shadow-sm">
                <TextInput
                  value={prePregnancyWeight}
                  onChangeText={setPrePregnancyWeight}
                  placeholder="Ex: 65.5"
                  keyboardType="decimal-pad"
                  className="text-lg text-gray-900"
                  style={{ fontFamily: "DMSans_500Medium" }}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </Animated.View>

            {/* Input: Altura */}
            <Animated.View entering={FadeInDown.delay(200)} className="mb-6">
              <Text className="text-base font-semibold text-gray-900 mb-2" style={{ fontFamily: "DMSans_600SemiBold" }}>
                Altura (cm)
              </Text>
              <View className="bg-white rounded-2xl px-4 py-4 shadow-sm">
                <TextInput
                  value={height}
                  onChangeText={setHeight}
                  placeholder="Ex: 165"
                  keyboardType="number-pad"
                  className="text-lg text-gray-900"
                  style={{ fontFamily: "DMSans_500Medium" }}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </Animated.View>

            {/* Semana Gestacional */}
            <Animated.View entering={FadeInDown.delay(300)} className="mb-6">
              <Text className="text-base font-semibold text-gray-900 mb-3" style={{ fontFamily: "DMSans_600SemiBold" }}>
                Semana gestacional: {currentWeek}
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {WEEKS.map((week) => (
                  <Pressable
                    key={week}
                    onPress={() => setCurrentWeek(week)}
                    className={`flex-1 min-w-[60px] py-3 rounded-xl ${
                      currentWeek === week ? "bg-rose-600" : "bg-white"
                    }`}
                    style={{
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.05,
                      shadowRadius: 2,
                      elevation: 1,
                    }}
                  >
                    <Text
                      className={`text-center text-base font-semibold ${
                        currentWeek === week ? "text-white" : "text-gray-700"
                      }`}
                      style={{ fontFamily: "DMSans_600SemiBold" }}
                    >
                      {week}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {/* Slider para semanas entre 12-40 */}
              <View className="mt-4 bg-white rounded-2xl px-4 py-4">
                <Text className="text-sm text-gray-600 mb-2" style={{ fontFamily: "DMSans_400Regular" }}>
                  Ou escolha qualquer semana entre 12 e 40:
                </Text>
                <View className="flex-row items-center">
                  <TextInput
                    value={currentWeek.toString()}
                    onChangeText={(text) => {
                      const num = parseInt(text) || 12;
                      setCurrentWeek(Math.max(12, Math.min(40, num)));
                    }}
                    keyboardType="number-pad"
                    className="flex-1 text-lg text-gray-900 text-center"
                    style={{ fontFamily: "DMSans_600SemiBold" }}
                  />
                  <Text className="text-sm text-gray-500 ml-2" style={{ fontFamily: "DMSans_400Regular" }}>
                    semanas
                  </Text>
                </View>
              </View>
            </Animated.View>

            {/* Resultado: Card Grande */}
            {bmi > 0 && idealWeightRange && (
              <Animated.View entering={FadeIn.delay(400)} className="mb-6">
                <View className="bg-white rounded-3xl p-6 shadow-lg">
                  {/* IMC Pré-gravidez */}
                  <View className="mb-6">
                    <Text className="text-sm text-gray-600 mb-2" style={{ fontFamily: "DMSans_400Regular" }}>
                      IMC pré-gravidez
                    </Text>
                    <Text className="text-3xl font-bold text-gray-900" style={{ fontFamily: "DMSans_700Bold" }}>
                      {bmi.toFixed(1)}
                    </Text>
                    <View className={`mt-2 px-3 py-1 rounded-full self-start flex-row items-center ${statusInfo.bg}`}>
                      <Ionicons name={statusInfo.icon as any} size={16} color={statusInfo.color} />
                      <Text className="text-sm font-semibold ml-1" style={{ fontFamily: "DMSans_600SemiBold", color: statusInfo.color }}>
                        {statusInfo.status}
                      </Text>
                    </View>
                  </View>

                  {/* Divider */}
                  <View className="h-px bg-gray-200 mb-6" />

                  {/* Ganho de Peso Esperado */}
                  <View className="mb-6">
                    <Text className="text-sm text-gray-600 mb-2" style={{ fontFamily: "DMSans_400Regular" }}>
                      Ganho de peso esperado (semana {currentWeek})
                    </Text>
                    <Text className="text-2xl font-bold text-rose-600" style={{ fontFamily: "DMSans_700Bold" }}>
                      {recommendedGain?.[0].toFixed(1)} - {recommendedGain?.[1].toFixed(1)} kg
                    </Text>
                  </View>

                  {/* Divider */}
                  <View className="h-px bg-gray-200 mb-6" />

                  {/* Peso Ideal Atual */}
                  <View>
                    <Text className="text-sm text-gray-600 mb-2" style={{ fontFamily: "DMSans_400Regular" }}>
                      Faixa de peso ideal atual
                    </Text>
                    <Text className="text-2xl font-bold text-gray-900" style={{ fontFamily: "DMSans_700Bold" }}>
                      {idealWeightRange[0].toFixed(1)} - {idealWeightRange[1].toFixed(1)} kg
                    </Text>
                  </View>
                </View>
              </Animated.View>
            )}

            {/* Dica Importante */}
            <Animated.View entering={FadeInDown.delay(500)} className="mb-8">
              <View className="bg-blush/10 rounded-2xl p-4 flex-row items-start">
                <Ionicons name="information-circle" size={24} color="#BC8B7B" />
                <View className="flex-1 ml-3">
                  <Text className="text-sm font-semibold text-gray-900 mb-1" style={{ fontFamily: "DMSans_600SemiBold" }}>
                    Importante
                  </Text>
                  <Text className="text-sm text-gray-700 leading-5" style={{ fontFamily: "DMSans_400Regular" }}>
                    Esta calculadora fornece apenas estimativas baseadas em diretrizes gerais. Sempre consulte seu obstetra para orientações personalizadas sobre ganho de peso na gravidez.
                  </Text>
                </View>
              </View>
            </Animated.View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}
