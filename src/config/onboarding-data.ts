import { maternal, mood, typography } from "../theme/tokens";
import { PregnancyStage, Interest } from "../types/navigation";

// Typography - from Tokens.typography.fontFamily
export const FONTS = {
  display: typography.fontFamily.extrabold,
  headline: typography.fontFamily.bold,
  body: typography.fontFamily.medium,
  accent: typography.fontFamily.semibold,
  light: typography.fontFamily.base,
};

// Story slide type
export type StorySlide =
  | "welcome"
  | "moment"
  | "date"
  | "objectives"
  | "emotional"
  | "checkIn"
  | "reward";

export const SLIDES_ORDER: StorySlide[] = [
  "welcome",
  "moment",
  "date",
  "objectives",
  "emotional",
  "checkIn",
  "reward",
];

// Moment options (replaces stage)
export const MOMENT_OPTIONS: {
  id: PregnancyStage;
  emoji: string;
  label: string;
  subtitle: string;
}[] = [
  { id: "trying", emoji: "🌱", label: "Tentando engravidar", subtitle: "Cada ciclo é uma nova esperança" },
  { id: "pregnant", emoji: "🤰", label: "Gestante", subtitle: "A vida crescendo dentro de você" },
  { id: "postpartum", emoji: "💜", label: "Puerpério", subtitle: "Os primeiros dias são intensos" },
];

// Objectives options
export const OBJECTIVE_OPTIONS: { id: Interest; emoji: string; label: string }[] = [
  { id: "nutrition", emoji: "🥗", label: "Alimentação" },
  { id: "exercise", emoji: "🧘", label: "Movimento" },
  { id: "mental_health", emoji: "🧠", label: "Mente" },
  { id: "baby_care", emoji: "👶", label: "Bebê" },
  { id: "breastfeeding", emoji: "🤱", label: "Amamentação" },
  { id: "sleep", emoji: "🌙", label: "Sono" },
  { id: "relationships", emoji: "💑", label: "Relacionamentos" },
  { id: "career", emoji: "✨", label: "Propósito" },
];

// Emotional state options - using Tokens.mood
export const EMOTIONAL_OPTIONS: { id: string; emoji: string; label: string; color: string }[] = [
  { id: "peaceful", emoji: "😌", label: "Em paz", color: mood.calm },
  { id: "anxious", emoji: "😰", label: "Ansiosa", color: mood.anxious },
  { id: "excited", emoji: "🤩", label: "Animada", color: mood.energetic },
  { id: "tired", emoji: "😴", label: "Cansada", color: mood.tired },
  { id: "overwhelmed", emoji: "🥺", label: "Sobrecarregada", color: mood.sensitive },
  { id: "hopeful", emoji: "🌟", label: "Esperançosa", color: mood.happy },
];

// Check-in time options
export const CHECKIN_OPTIONS: { id: string; emoji: string; label: string; time: string }[] = [
  { id: "morning", emoji: "🌅", label: "Manhã", time: "Acordar com calma" },
  { id: "afternoon", emoji: "☀️", label: "Tarde", time: "Pausa do dia" },
  { id: "evening", emoji: "🌙", label: "Noite", time: "Antes de dormir" },
];

// 7-day plan items for Episode 0
export const SEVEN_DAY_PLAN = [
  { day: 1, title: "Conhecendo você", icon: "heart" as const },
  { day: 2, title: "Primeiro check-in", icon: "sunny" as const },
  { day: 3, title: "Afirmação diária", icon: "sparkles" as const },
  { day: 4, title: "Hábito de ouro", icon: "star" as const },
  { day: 5, title: "Comunidade", icon: "people" as const },
  { day: 6, title: "NathIA", icon: "chatbubble-ellipses" as const },
  { day: 7, title: "Celebração", icon: "trophy" as const },
];

// Story gradients - from Tokens.maternal.stories
export const STORY_GRADIENTS = maternal.stories;
