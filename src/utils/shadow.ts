import { Platform, ViewStyle } from "react-native";

export interface ShadowConfig {
  shadowColor?: string;
  shadowOffset?: { width: number; height: number };
  shadowOpacity?: number;
  shadowRadius?: number;
  elevation?: number;
}

/**
 * Cria estilos de shadow/elevation compatíveis com iOS e Android
 * @param config Configuração de shadow
 * @returns Objeto de estilo com shadow para iOS e elevation para Android
 */
export function createShadow(config: ShadowConfig = {}): ViewStyle {
  const {
    shadowColor = "#000",
    shadowOffset = { width: 0, height: 2 },
    shadowOpacity = 0.1,
    shadowRadius = 8,
    elevation = 3,
  } = config;

  if (Platform.OS === "ios") {
    return {
      shadowColor,
      shadowOffset,
      shadowOpacity,
      shadowRadius,
    };
  }

  // Android usa elevation
  return {
    elevation,
  };
}

/**
 * Presets de shadow comuns para uso rápido
 */
export const shadowPresets = {
  none: createShadow({ shadowOpacity: 0, elevation: 0 }),
  sm: createShadow({
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  }),
  md: createShadow({
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  }),
  lg: createShadow({
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  }),
  xl: createShadow({
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  }),
  colored: (color: string, intensity: number = 0.3) =>
    createShadow({
      shadowColor: color,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: intensity,
      shadowRadius: 12,
      elevation: 6,
    }),
};

