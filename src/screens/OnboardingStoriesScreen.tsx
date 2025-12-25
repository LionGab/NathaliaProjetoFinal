/**
 * OnboardingStoriesScreen - "Jornada da Nath" Stories Format
 *
 * DESIGN CONCEPT:
 * - Instagram/WhatsApp Stories-style navigation
 * - Cinematic, editorial aesthetic
 * - Intimate conversation with Nathalia
 * - 5 core questions + Episode 0 reward
 *
 * AESTHETIC:
 * - Full-screen immersive experience
 * - Gradient transitions: Rose → Lavender → Blue
 * - Bold typography with character
 * - Smooth page transitions
 * - Warm, nurturing, welcoming
 *
 * EXPO GO COMPATIBLE - No native modules requiring builds
 *
 * @version 1.0.0
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useCallback, useMemo } from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  StatusBar,
  ScrollView,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInRight,
  SlideOutLeft,
  runOnJS,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";

import { useAppStore } from "../state/store";
import { useNathJourneyOnboardingStore } from "../state/nath-journey-onboarding-store";
import { logger } from "../utils/logger";
import { brand, maternal, semantic, premium } from "../theme/tokens";
import { PregnancyStage, Interest } from "../types/navigation";

// Config & Data
import {
  FONTS,
  STORY_GRADIENTS,
  SLIDES_ORDER,
  MOMENT_OPTIONS,
  OBJECTIVE_OPTIONS,
  EMOTIONAL_OPTIONS,
  CHECKIN_OPTIONS,
  SEVEN_DAY_PLAN,
} from "../config/onboarding-data";

// Components
import { StoryProgressBar } from "../components/onboarding/stories/StoryProgressBar";
import { SelectionCard } from "../components/onboarding/stories/SelectionCard";
import { ObjectiveChip } from "../components/onboarding/stories/ObjectiveChip";
import { StoryButton } from "../components/onboarding/stories/StoryButton";
import { NathSpeaks } from "../components/onboarding/stories/NathSpeaks";
import { EpisodeCard } from "../components/onboarding/stories/EpisodeCard";
import { EmotionalOption } from "../components/onboarding/stories/EmotionalOption";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const GLASS = premium.glass;
const TEXT = premium.text;

// ============================================
// MAIN SCREEN
// ============================================

export default function OnboardingStoriesScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();

  // Store - App store for user data
  const setOnboardingComplete = useAppStore((s) => s.setOnboardingComplete);
  const updateUser = useAppStore((s) => s.updateUser);

  // Store - Nath Journey store for onboarding state
  const completeNathJourneyOnboarding = useNathJourneyOnboardingStore(
    (s) => s.completeOnboarding
  );

  // State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideProgress, setSlideProgress] = useState(0);

  // Form state
  const [name, setName] = useState("");
  const [moment, setMoment] = useState<PregnancyStage | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [objectives, setObjectives] = useState<Interest[]>([]);
  const [emotional, setEmotional] = useState<string | null>(null);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get current slide data
  const currentSlideKey = SLIDES_ORDER[currentSlide];
  const totalSlides = SLIDES_ORDER.length;

  // Navigation
  const goNext = useCallback(() => {
    if (currentSlide < totalSlides - 1) {
      // Skip date if trying
      if (SLIDES_ORDER[currentSlide + 1] === "date" && moment === "trying") {
        setCurrentSlide((prev) => prev + 2);
      } else {
        setCurrentSlide((prev) => prev + 1);
      }
      setSlideProgress(0);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [currentSlide, totalSlides, moment]);

  const goBack = useCallback(() => {
    if (currentSlide > 0) {
      // Skip date if trying
      if (SLIDES_ORDER[currentSlide - 1] === "date" && moment === "trying") {
        setCurrentSlide((prev) => prev - 2);
      } else {
        setCurrentSlide((prev) => prev - 1);
      }
      setSlideProgress(0);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [currentSlide, moment]);

  // Toggle objective
  const toggleObjective = (id: Interest) => {
    setObjectives((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Complete onboarding
  const handleCompleteOnboarding = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Update user profile in app store
      updateUser({
        name: name || "Mamãe",
        stage: moment || "pregnant",
        dueDate: moment === "pregnant" ? date?.toISOString() : undefined,
        babyBirthDate: moment === "postpartum" ? date?.toISOString() : undefined,
        interests: objectives,
        hasCompletedOnboarding: true,
      });

      // Mark Nath Journey onboarding as complete (triggers navigation)
      completeNathJourneyOnboarding();

      // Mark legacy onboarding as complete
      setOnboardingComplete(true);

      logger.info("Stories onboarding completed", "OnboardingStories", {
        name,
        moment,
        objectives: objectives.length,
        emotional,
        checkInTime,
      });
    } catch (error) {
      logger.error("Onboarding error", "OnboardingStories", error as Error);
      // Still mark as complete to avoid blocking user
      completeNathJourneyOnboarding();
      setOnboardingComplete(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Can proceed?
  const canProceed = useMemo(() => {
    switch (currentSlideKey) {
      case "welcome":
        return true;
      case "moment":
        return moment !== null;
      case "date":
        return date !== null;
      case "objectives":
        return objectives.length >= 1;
      case "emotional":
        return emotional !== null;
      case "checkIn":
        return checkInTime !== null;
      case "reward":
        return true;
      default:
        return false;
    }
  }, [currentSlideKey, moment, date, objectives, emotional, checkInTime]);

  // Gesture handlers for Stories navigation
  const tapGesture = Gesture.Tap()
    .onEnd((event) => {
      const x = event.x;
      // Tap left third = go back, right two-thirds = go next
      if (x < SCREEN_WIDTH * 0.3) {
        runOnJS(goBack)();
      } else if (canProceed && currentSlideKey !== "reward") {
        runOnJS(goNext)();
      }
    });

  // Date picker handler
  const handleDateChange = (_event: unknown, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  // Get gradient for current slide
  const currentGradient = STORY_GRADIENTS[currentSlideKey] || STORY_GRADIENTS.welcome;

  // Render slide content
  const renderSlideContent = () => {
    switch (currentSlideKey) {
      case "welcome":
        return (
          <View style={styles.slideContent}>
            <Animated.View
              entering={FadeIn.delay(100).duration(600)}
              style={styles.welcomeHeader}
            >
              <Image
                source={require("../../assets/nathalia-avatar.jpg")}
                style={styles.welcomeAvatar}
                contentFit="cover"
              />
              <View style={styles.welcomeOnline} />
            </Animated.View>

            <Animated.Text
              entering={FadeInUp.delay(200).duration(500)}
              style={styles.welcomeTitle}
            >
              Oi, eu sou a{"\n"}Nathalia Valente
            </Animated.Text>

            <Animated.Text
              entering={FadeInUp.delay(350).duration(500)}
              style={styles.welcomeSubtitle}
            >
              Vou te guiar nessa jornada incrível da maternidade.
              Vamos começar com algumas perguntas?
            </Animated.Text>

            <Animated.View
              entering={FadeInUp.delay(500).duration(500)}
              style={styles.welcomeFeatures}
            >
              {[
                { icon: "sparkles", text: "5 perguntas rápidas" },
                { icon: "time", text: "Menos de 2 minutos" },
                { icon: "heart", text: "Experiência personalizada" },
              ].map((item, index) => (
                <View key={index} style={styles.welcomeFeature}>
                  <Ionicons
                    name={item.icon as keyof typeof Ionicons.glyphMap}
                    size={16}
                    color={brand.accent[400]}
                  />
                  <Text style={styles.welcomeFeatureText}>{item.text}</Text>
                </View>
              ))}
            </Animated.View>

            {/* Name input */}
            <Animated.View
              entering={FadeInUp.delay(650).duration(500)}
              style={styles.nameInputContainer}
            >
              <Text style={styles.nameLabel}>Como posso te chamar?</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Seu nome ou apelido"
                placeholderTextColor={TEXT.hint}
                style={styles.nameInput}
                autoCapitalize="words"
              />
            </Animated.View>
          </View>
        );

      case "moment":
        return (
          <View style={styles.slideContent}>
            <NathSpeaks
              message={`${name || "Querida"}, em que momento da sua jornada você está?`}
            />

            <Animated.View
              entering={FadeInDown.delay(300).duration(500)}
              style={styles.optionsContainer}
            >
              {MOMENT_OPTIONS.map((option, index) => (
                <Animated.View
                  key={option.id}
                  entering={FadeInDown.delay(400 + index * 100).duration(400)}
                >
                  <SelectionCard
                    selected={moment === option.id}
                    onPress={() => setMoment(option.id)}
                    emoji={option.emoji}
                    label={option.label}
                    subtitle={option.subtitle}
                  />
                </Animated.View>
              ))}
            </Animated.View>
          </View>
        );

      case "date":
        return (
          <View style={styles.slideContent}>
            <NathSpeaks
              message={
                moment === "pregnant"
                  ? "Qual a data prevista para conhecer seu bebê?"
                  : "Quando seu bebê chegou ao mundo?"
              }
            />

            <Animated.View
              entering={FadeInDown.delay(300).duration(500)}
              style={styles.dateContainer}
            >
              <Pressable
                onPress={() => setShowDatePicker(true)}
                style={styles.dateButton}
              >
                <Ionicons
                  name="calendar"
                  size={24}
                  color={date ? brand.accent[400] : TEXT.disabled}
                />
                <Text
                  style={[
                    styles.dateText,
                    date && styles.dateTextSelected,
                  ]}
                >
                  {date
                    ? date.toLocaleDateString("pt-BR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "Toque para selecionar"}
                </Text>
              </Pressable>

              {date && (
                <Animated.View
                  entering={FadeIn.duration(300)}
                  style={styles.dateInfo}
                >
                  <Ionicons name="information-circle" size={18} color={brand.accent[300]} />
                  <Text style={styles.dateInfoText}>
                    {moment === "pregnant"
                      ? `Faltam ${Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} dias!`
                      : `${Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24))} dias de vida!`}
                  </Text>
                </Animated.View>
              )}

              {showDatePicker && (
                <DateTimePicker
                  value={date || new Date()}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                  minimumDate={
                    moment === "pregnant" ? new Date() : new Date(2020, 0, 1)
                  }
                  maximumDate={
                    moment === "pregnant"
                      ? new Date(Date.now() + 300 * 24 * 60 * 60 * 1000)
                      : new Date()
                  }
                  textColor={TEXT.primary}
                />
              )}
            </Animated.View>
          </View>
        );

      case "objectives":
        return (
          <View style={styles.slideContent}>
            <NathSpeaks message="O que você quer cuidar nessa fase?" delay={0} />

            <Animated.Text
              entering={FadeInUp.delay(200).duration(400)}
              style={styles.objectivesHint}
            >
              Escolha quantos quiser
            </Animated.Text>

            <Animated.View
              entering={FadeInDown.delay(300).duration(500)}
              style={styles.chipsContainer}
            >
              {OBJECTIVE_OPTIONS.map((option, index) => (
                <Animated.View
                  key={option.id}
                  entering={FadeInDown.delay(350 + index * 50).duration(300)}
                >
                  <ObjectiveChip
                    selected={objectives.includes(option.id)}
                    onPress={() => toggleObjective(option.id)}
                    emoji={option.emoji}
                    label={option.label}
                  />
                </Animated.View>
              ))}
            </Animated.View>
          </View>
        );

      case "emotional":
        return (
          <View style={styles.slideContent}>
            <NathSpeaks message="Como você está se sentindo agora?" />

            <Animated.View
              entering={FadeInDown.delay(300).duration(500)}
              style={styles.emotionalGrid}
            >
              {EMOTIONAL_OPTIONS.map((option, index) => (
                <EmotionalOption
                  key={option.id}
                  id={option.id}
                  emoji={option.emoji}
                  label={option.label}
                  color={option.color}
                  isSelected={emotional === option.id}
                  onSelect={setEmotional}
                  index={index}
                />
              ))}
            </Animated.View>
          </View>
        );

      case "checkIn":
        return (
          <View style={styles.slideContent}>
            <NathSpeaks message="Qual o melhor momento para eu te lembrar de cuidar de você?" />

            <Animated.View
              entering={FadeInDown.delay(300).duration(500)}
              style={styles.checkInContainer}
            >
              {CHECKIN_OPTIONS.map((option, index) => (
                <Animated.View
                  key={option.id}
                  entering={FadeInDown.delay(350 + index * 100).duration(400)}
                >
                  <SelectionCard
                    selected={checkInTime === option.id}
                    onPress={() => setCheckInTime(option.id)}
                    emoji={option.emoji}
                    label={option.label}
                    subtitle={option.time}
                  />
                </Animated.View>
              ))}
            </Animated.View>
          </View>
        );

      case "reward":
        return (
          <View style={styles.rewardContent}>
            <Animated.View
              entering={FadeIn.delay(100).duration(800)}
              style={styles.rewardHeader}
            >
              <Text style={styles.episodeLabel}>EPISÓDIO 0</Text>
              <Text style={styles.rewardTitle}>Sua Jornada{"\n"}Começa Agora</Text>
              <Text style={styles.rewardSubtitle}>
                Prepare-se para 7 dias de descobertas
              </Text>
            </Animated.View>

            <ScrollView
              style={styles.episodeList}
              contentContainerStyle={styles.episodeListContent}
              showsVerticalScrollIndicator={false}
            >
              {SEVEN_DAY_PLAN.map((item, index) => (
                <EpisodeCard
                  key={item.day}
                  day={item.day}
                  title={item.title}
                  icon={item.icon}
                  delay={300 + index * 80}
                />
              ))}
            </ScrollView>

            <Animated.View
              entering={FadeInUp.delay(900).duration(500)}
              style={styles.rewardFooter}
            >
              <View style={styles.rewardBadge}>
                <Ionicons name="gift" size={20} color={brand.accent[400]} />
                <Text style={styles.rewardBadgeText}>
                  Desbloqueie missões para personalizar ainda mais!
                </Text>
              </View>
            </Animated.View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <LinearGradient colors={currentGradient} style={styles.gradient}>
        <GestureDetector gesture={tapGesture}>
          <View style={styles.storyContainer}>
            {/* Progress bar */}
            <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
              <StoryProgressBar
                currentSlide={currentSlide}
                totalSlides={totalSlides}
                progress={slideProgress}
              />
            </View>

            {/* Close button (back on first slide) */}
            {currentSlide > 0 && currentSlideKey !== "reward" && (
              <Pressable
                onPress={goBack}
                style={[styles.backButton, { top: insets.top + 40 }]}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="chevron-back" size={24} color={TEXT.bright} />
              </Pressable>
            )}

            {/* Content */}
            <Animated.View
              key={currentSlideKey}
              entering={SlideInRight.duration(300).springify()}
              exiting={SlideOutLeft.duration(200)}
              style={styles.contentContainer}
            >
              {renderSlideContent()}
            </Animated.View>

            {/* CTA */}
            <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
              <StoryButton
                label={
                  currentSlideKey === "reward"
                    ? isSubmitting
                      ? "Preparando..."
                      : "Começar minha jornada"
                    : "Continuar"
                }
                onPress={currentSlideKey === "reward" ? handleCompleteOnboarding : goNext}
                disabled={!canProceed || isSubmitting}
              />

              {currentSlideKey !== "welcome" && currentSlideKey !== "reward" && (
                <Text style={styles.tapHint}>
                  Toque na esquerda para voltar
                </Text>
              )}
            </View>
          </View>
        </GestureDetector>
      </LinearGradient>
    </GestureHandlerRootView>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  storyContainer: {
    flex: 1,
  },

  // Header & Progress
  header: {
    paddingHorizontal: 8,
    paddingBottom: 12,
  },

  // Back button
  backButton: {
    position: "absolute",
    left: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: GLASS.dark,
    alignItems: "center",
    justifyContent: "center",
  },

  // Content
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  slideContent: {
    flex: 1,
    paddingTop: 24,
  },

  // Welcome
  welcomeHeader: {
    alignSelf: "center",
    marginBottom: 24,
  },
  welcomeAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: brand.accent[400],
  },
  welcomeOnline: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: semantic.light.success,
    borderWidth: 3,
    borderColor: maternal.stories.welcome[0],
  },
  welcomeTitle: {
    fontSize: 32,
    fontFamily: FONTS.display,
    color: TEXT.primary,
    textAlign: "center",
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  welcomeSubtitle: {
    fontSize: 16,
    fontFamily: FONTS.body,
    color: TEXT.secondary,
    textAlign: "center",
    marginTop: 12,
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  welcomeFeatures: {
    marginTop: 32,
    gap: 12,
  },
  welcomeFeature: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  welcomeFeatureText: {
    fontSize: 14,
    fontFamily: FONTS.accent,
    color: TEXT.bright,
  },
  nameInputContainer: {
    marginTop: 32,
  },
  nameLabel: {
    fontSize: 14,
    fontFamily: FONTS.accent,
    color: TEXT.muted,
    marginBottom: 8,
    textAlign: "center",
  },
  nameInput: {
    backgroundColor: GLASS.base,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 18,
    fontFamily: FONTS.body,
    color: TEXT.primary,
    textAlign: "center",
    borderWidth: 1,
    borderColor: GLASS.border,
  },

  // Options
  optionsContainer: {
    gap: 12,
  },

  // Date
  dateContainer: {
    alignItems: "center",
    gap: 16,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GLASS.base,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 24,
    gap: 12,
    width: "100%",
    borderWidth: 1,
    borderColor: GLASS.border,
  },
  dateText: {
    fontSize: 16,
    fontFamily: FONTS.body,
    color: TEXT.disabled,
  },
  dateTextSelected: {
    color: TEXT.primary,
    fontFamily: FONTS.accent,
  },
  dateInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: GLASS.accentLight,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  dateInfoText: {
    fontSize: 14,
    fontFamily: FONTS.accent,
    color: brand.accent[300],
  },

  // Objectives
  objectivesHint: {
    fontSize: 14,
    fontFamily: FONTS.light,
    color: TEXT.subtle,
    textAlign: "center",
    marginBottom: 20,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
  },

  // Emotional
  emotionalGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
  },

  // Check-in
  checkInContainer: {
    gap: 12,
  },

  // Reward
  rewardContent: {
    flex: 1,
    paddingTop: 16,
  },
  rewardHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  episodeLabel: {
    fontSize: 12,
    fontFamily: FONTS.headline,
    color: brand.accent[400],
    letterSpacing: 2,
    marginBottom: 12,
  },
  rewardTitle: {
    fontSize: 36,
    fontFamily: FONTS.display,
    color: TEXT.primary,
    textAlign: "center",
    lineHeight: 44,
    letterSpacing: -1,
  },
  rewardSubtitle: {
    fontSize: 15,
    fontFamily: FONTS.body,
    color: TEXT.muted,
    marginTop: 12,
  },
  episodeList: {
    flex: 1,
  },
  episodeListContent: {
    gap: 10,
    paddingHorizontal: 4,
  },
  rewardFooter: {
    paddingTop: 16,
  },
  rewardBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GLASS.accentLight,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 10,
  },
  rewardBadgeText: {
    flex: 1,
    fontSize: 13,
    fontFamily: FONTS.body,
    color: brand.accent[300],
    lineHeight: 18,
  },

  // Footer
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  tapHint: {
    fontSize: 12,
    fontFamily: FONTS.light,
    color: TEXT.hint,
    textAlign: "center",
    marginTop: 12,
  },
});
