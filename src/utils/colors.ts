/**
 * Sistema de Cores - Nossa Maternidade
 * Baseado no design "Boa Noite Mãe"
 * 
 * Este arquivo centraliza todas as cores do app para fácil manutenção
 * e consistência visual.
 */

export const Colors = {
  // Cores Principais
  primary: {
    DEFAULT: "#f4258c", // Primary pink - Rosa vibrante principal
    50: "#fdf2f8",
    100: "#fce7f3",
    200: "#fbcfe8",
    300: "#f9a8d4",
    400: "#f472b6",
    500: "#f4258c", // Main primary
    600: "#ec4899",
    700: "#db2777",
    800: "#be185d",
    900: "#9f1239",
  },
  
  // Cores Secundárias
  secondary: {
    DEFAULT: "#89CFF0", // Baby blue - Azul claro suave
    50: "#f0f9ff",
    100: "#e0f2fe",
    200: "#bae6fd",
    300: "#7dd3fc",
    400: "#38bdf8",
    500: "#89CFF0", // Main secondary
    600: "#60a5fa",
    700: "#3b82f6",
    800: "#2563eb",
    900: "#1e40af",
  },

  // Cores de Sentimentos (Daily Feelings)
  feeling: {
    sunny: {
      color: "#eab308", // Amarelo - Bem
      activeColor: "#fef08a",
      label: "Bem",
    },
    cloud: {
      color: "#60a5fa", // Azul - Cansada
      activeColor: "#dbeafe",
      label: "Cansada",
    },
    rainy: {
      color: "#818cf8", // Índigo - Enjoada
      activeColor: "#e0e7ff",
      label: "Enjoada",
    },
    heart: {
      color: "#f4258c", // Rosa - Amada
      activeColor: "#fce7f3",
      label: "Amada",
    },
  },

  // Cores de Texto
  text: {
    dark: "#1a2b4b", // Azul escuro para textos principais
    DEFAULT: "#1a2b4b",
    light: "#64748b",
    muted: "#94a3b8",
    white: "#ffffff",
  },

  // Cores de Fundo
  background: {
    DEFAULT: "#f8f5f7", // Rosa muito claro
    light: "#ffffff",
    soft: "#f8f5f7",
    cream: "#FFFCF9", // Mantido para compatibilidade
  },

  // Cores de Categorias
  category: {
    nutricao: "#f4258c", // Primary pink
    exercicio: "#89CFF0", // Secondary blue
    saude: "#818cf8", // Índigo
    bemestar: "#f4258c", // Primary pink
  },

  // Gradientes
  gradients: {
    primary: ["#f4258c", "#89CFF0"], // Rosa para azul
    primarySoft: ["#f4258c", "#ec4899"], // Rosa para rosa mais claro
    secondary: ["#89CFF0", "#60a5fa"], // Azul claro para azul
    warm: ["#fce7f3", "#f8f5f7"], // Rosa muito claro
  },

  // Cores de Status
  status: {
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",
  },

  // Cores de UI
  ui: {
    border: "#e5e7eb",
    borderLight: "#f3f4f6",
    shadow: "rgba(244, 37, 140, 0.1)", // Primary com opacidade
    shadowStrong: "rgba(244, 37, 140, 0.2)",
  },
} as const;

// Helper para obter cores de sentimentos
export const getFeelingColor = (feeling: keyof typeof Colors.feeling) => {
  return Colors.feeling[feeling];
};

// Helper para gradientes
export const getGradient = (gradient: keyof typeof Colors.gradients) => {
  return Colors.gradients[gradient];
};

// Exportar cor primária como constante para uso rápido
export const PRIMARY_COLOR = Colors.primary.DEFAULT;
export const SECONDARY_COLOR = Colors.secondary.DEFAULT;
export const BACKGROUND_COLOR = Colors.background.DEFAULT;
export const TEXT_DARK = Colors.text.dark;

