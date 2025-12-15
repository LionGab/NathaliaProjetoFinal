import React, { useMemo } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";
import { useHabitsStore, Habit } from "../state/store";
import * as Haptics from "expo-haptics";
import { useTheme } from "../hooks/useTheme";
import { IconName } from "../types/icons";

const CATEGORY_LABELS: Record<string, { label: string; emoji: string }> = {
  "self-care": { label: "Autocuidado", emoji: "✨" },
  health: { label: "Saude", emoji: "💪" },
  mindfulness: { label: "Paz Interior", emoji: "🧘" },
  connection: { label: "Conexao", emoji: "💕" },
  growth: { label: "Crescimento", emoji: "🌱" },
};

const MOTIVATIONAL_QUOTES = [
  "Cada pequeno passo e uma vitoria",
  "Voce merece cuidar de si mesma",
  "Seu bem-estar e prioridade",
  "Hoje e um novo comeco",
];

export default function HabitsScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const habits = useHabitsStore((s) => s.habits);
  const toggleHabit = useHabitsStore((s) => s.toggleHabit);

  const today = new Date().toISOString().split("T")[0];
  const completedCount = habits.filter((h) => h.completed).length;
  const totalCount = habits.length;
  const completionPercentage = Math.round((completedCount / totalCount) * 100);

  const quote = useMemo(() => {
    return MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
  }, []);

  const totalStreak = useMemo(() => {
    return habits.reduce((acc, h) => acc + h.streak, 0);
  }, [habits]);

  const handleToggleHabit = async (id: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleHabit(id, today);
  };

  const groupedHabits = useMemo(() => {
    const groups: Record<string, Habit[]> = {};
    habits.forEach((habit) => {
      if (!groups[habit.category]) {
        groups[habit.category] = [];
      }
      groups[habit.category].push(habit);
    });
    return groups;
  }, [habits]);

  const renderHabitCard = (habit: Habit, index: number) => {
    return (
      <Animated.View
        key={habit.id}
        entering={FadeInUp.delay(100 + index * 40).duration(500).springify()}
      >
        <Pressable
          onPress={() => handleToggleHabit(habit.id)}
          className="mb-3"
        >
          <View
            className="rounded-2xl overflow-hidden"
            style={{
              backgroundColor: habit.completed ? `${habit.color}12` : colors.background.card,
              borderWidth: 1.5,
              borderColor: habit.completed ? habit.color : colors.neutral[100],
            }}
          >
            <View className="flex-row items-center p-4">
              {/* Icon Container */}
              <View
                className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
                style={{
                  backgroundColor: habit.completed ? habit.color : `${habit.color}15`,
                }}
              >
                <Ionicons
                  name={habit.icon as IconName}
                  size={26}
                  color={habit.completed ? colors.neutral[0] : habit.color}
                />
              </View>

              {/* Content */}
              <View className="flex-1">
                <Text
                  className="text-base font-semibold mb-0.5"
                  style={{ color: habit.completed ? colors.neutral[900] : colors.neutral[700] }}
                >
                  {habit.title}
                </Text>
                <Text className="text-warmGray-500 text-sm">
                  {habit.description}
                </Text>
                {habit.streak > 0 && (
                  <View className="flex-row items-center mt-1.5">
                    <View className="flex-row items-center bg-amber-50 px-2 py-0.5 rounded-full">
                      <Ionicons name="flame" size={12} color="#F59E0B" />
                      <Text className="text-amber-600 text-xs font-medium ml-1">
                        {habit.streak} dias
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              {/* Checkbox */}
              <View
                className="w-7 h-7 rounded-full items-center justify-center"
                style={{
                  backgroundColor: habit.completed ? habit.color : "transparent",
                  borderWidth: 2,
                  borderColor: habit.completed ? habit.color : colors.neutral[300],
                }}
              >
                {habit.completed && (
                  <Ionicons name="checkmark" size={16} color={colors.neutral[0]} />
                )}
              </View>
            </View>
          </View>
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background.primary }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Header with Gradient */}
        <View style={{ paddingTop: insets.top }}>
          <LinearGradient
            colors={[colors.primary[50], colors.secondary[50], colors.background.primary]}
            locations={[0, 0.6, 1]}
            style={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 24 }}
          >
            <Animated.View entering={FadeInDown.duration(600).springify()}>
              {/* Top Row */}
              <View className="flex-row items-center justify-between mb-6">
                <View>
                  <Text className="text-warmGray-500 text-sm font-medium">
                    Seus rituais diarios
                  </Text>
                  <Text className="text-warmGray-900 text-3xl font-serif mt-1">
                    Habitos
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <View className="rounded-full px-4 py-2 flex-row items-center mr-2" style={{ backgroundColor: colors.background.card, shadowColor: colors.neutral[900], shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }}>
                    <Ionicons name="flame" size={18} color="#F59E0B" />
                    <Text className="text-warmGray-700 text-sm font-semibold ml-1.5">
                      {totalStreak}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Motivational Quote */}
              <Animated.View
                entering={FadeIn.delay(200).duration(600)}
                className="mb-6"
              >
                <View
                  className="rounded-2xl p-5"
                  style={{
                    backgroundColor: colors.background.glass,
                    borderWidth: 1,
                    borderColor: colors.primary[100],
                  }}
                >
                  <View className="flex-row items-start">
                    <Text className="text-2xl mr-3">💫</Text>
                    <View className="flex-1">
                      <Text className="text-warmGray-700 text-base leading-6 italic">
                        &ldquo;{quote}&rdquo;
                      </Text>
                      <Text className="text-warmGray-400 text-xs mt-2">
                        - Nathalia Valente
                      </Text>
                    </View>
                  </View>
                </View>
              </Animated.View>

              {/* Progress Card */}
              <Animated.View
                entering={FadeInUp.delay(300).duration(600).springify()}
              >
                <LinearGradient
                  colors={[colors.primary[500], colors.primary[400]]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    borderRadius: 24,
                    padding: 24,
                    shadowColor: colors.primary[500],
                    shadowOffset: { width: 0, height: 12 },
                    shadowOpacity: 0.3,
                    shadowRadius: 20,
                  }}
                >
                  <View className="flex-row items-center justify-between mb-5">
                    <View className="flex-1">
                      <Text className="text-white/70 text-xs font-medium uppercase tracking-wider mb-1">
                        Progresso de hoje
                      </Text>
                      <View className="flex-row items-baseline">
                        <Text className="text-white text-5xl font-bold">
                          {completionPercentage}
                        </Text>
                        <Text className="text-white/80 text-xl font-medium ml-1">
                          %
                        </Text>
                      </View>
                    </View>
                    <View className="items-center">
                      <View
                        className="w-20 h-20 rounded-full items-center justify-center"
                        style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                      >
                        <View
                          className="w-16 h-16 rounded-full items-center justify-center"
                          style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                        >
                          <Text className="text-3xl">
                            {completionPercentage === 100 ? "🎉" : completionPercentage >= 50 ? "💪" : "🌸"}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Progress Bar */}
                  <View className="h-3 bg-white/20 rounded-full overflow-hidden">
                    <View
                      className="h-full rounded-full"
                      style={{
                        width: `${completionPercentage}%`,
                        backgroundColor: colors.neutral[0],
                      }}
                    />
                  </View>

                  <View className="flex-row items-center justify-between mt-4">
                    <Text className="text-white/90 text-sm">
                      {completedCount} de {totalCount} habitos
                    </Text>
                    {completedCount === totalCount && (
                      <View className="flex-row items-center bg-white/20 px-3 py-1 rounded-full">
                        <Ionicons name="checkmark-circle" size={14} color="#FFFFFF" />
                        <Text className="text-white text-xs font-medium ml-1">
                          Completo!
                        </Text>
                      </View>
                    )}
                  </View>
                </LinearGradient>
              </Animated.View>
            </Animated.View>
          </LinearGradient>
        </View>

        {/* Habits by Category */}
        <View className="px-6 pt-2">
          {Object.entries(groupedHabits).map(([category, categoryHabits], catIndex) => (
            <Animated.View
              key={category}
              entering={FadeInUp.delay(400 + catIndex * 100).duration(600).springify()}
              className="mb-6"
            >
              {/* Category Header */}
              <View className="flex-row items-center mb-4">
                <Text className="text-xl mr-2">
                  {CATEGORY_LABELS[category]?.emoji || "✨"}
                </Text>
                <Text className="text-warmGray-800 text-lg font-semibold">
                  {CATEGORY_LABELS[category]?.label || category}
                </Text>
                <View className="flex-1 h-px bg-warmGray-200 ml-4" />
              </View>

              {/* Habits in Category */}
              {categoryHabits.map((habit, index) => renderHabitCard(habit, catIndex * 10 + index))}
            </Animated.View>
          ))}
        </View>

        {/* Weekly Overview */}
        <Animated.View
          entering={FadeInUp.delay(800).duration(600).springify()}
          className="px-6 mb-6"
        >
          <Text className="text-warmGray-800 text-lg font-semibold mb-4">
            Sua semana
          </Text>
          <View
            className="rounded-3xl p-5"
            style={{
              backgroundColor: colors.background.card,
              shadowColor: colors.neutral[900],
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.06,
              shadowRadius: 16,
            }}
          >
            <View className="flex-row justify-between mb-5">
              {["D", "S", "T", "Q", "Q", "S", "S"].map((day, i) => {
                const isToday = i === new Date().getDay();
                const isPast = i < new Date().getDay();
                const isCompleted = isPast || (isToday && completionPercentage === 100);
                return (
                  <View key={i} className="items-center">
                    <Text
                      className="text-xs font-medium mb-2"
                      style={{ color: isToday ? colors.primary[500] : colors.neutral[400] }}
                    >
                      {day}
                    </Text>
                    <View
                      className="w-10 h-10 rounded-full items-center justify-center"
                      style={{
                        backgroundColor: isCompleted
                          ? colors.semantic.success
                          : isToday
                          ? colors.primary[100]
                          : colors.neutral[100],
                        borderWidth: isToday ? 2 : 0,
                        borderColor: colors.primary[500],
                      }}
                    >
                      {isCompleted ? (
                        <Ionicons name="checkmark" size={18} color={colors.neutral[0]} />
                      ) : isToday ? (
                        <Text className="text-warmGray-600 text-xs font-semibold">
                          {completionPercentage}%
                        </Text>
                      ) : null}
                    </View>
                  </View>
                );
              })}
            </View>

            <View className="pt-4 border-t border-warmGray-100">
              <View className="flex-row items-center justify-center">
                <Ionicons name="heart" size={16} color={colors.primary[500]} />
                <Text className="text-warmGray-600 text-sm ml-2">
                  Continue assim, voce esta incrivel!
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Inspirational Footer */}
        <Animated.View
          entering={FadeInUp.delay(900).duration(600).springify()}
          className="px-6"
        >
          <View
            className="rounded-3xl p-6 items-center"
            style={{
              backgroundColor: colors.background.tertiary,
              borderWidth: 1,
              borderColor: colors.primary[200],
            }}
          >
            <View className="flex-row items-center mb-3">
              <Text className="text-2xl">🦋</Text>
            </View>
            <Text className="text-warmGray-700 text-center text-base leading-7 italic">
              Pequenos habitos constroem grandes transformacoes. Voce esta no caminho certo.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
