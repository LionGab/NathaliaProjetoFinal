/**
 * Hook para gerenciar tema (light/dark)
 * Integra com useAppStore para persistência
 */

import React from "react";
import { useColorScheme } from "react-native";
import { useAppStore } from "../state/store";
import { COLORS, COLORS_DARK } from "../theme/design-system";

export type ThemeMode = "light" | "dark" | "system";

export function useTheme() {
  const systemColorScheme = useColorScheme();
  const theme = useAppStore((s) => s.theme);
  const isDarkMode = useAppStore((s) => s.isDarkMode);
  const setIsDarkMode = useAppStore((s) => s.setIsDarkMode);
  const setTheme = useAppStore((s) => s.setTheme);

  // Determina se deve usar dark mode baseado no tema escolhido
  const shouldUseDark =
    theme === "dark" || (theme === "system" && systemColorScheme === "dark");

  // Atualiza isDarkMode quando necessário
  React.useEffect(() => {
    if (shouldUseDark !== isDarkMode) {
      setIsDarkMode(shouldUseDark);
    }
  }, [shouldUseDark, isDarkMode, setIsDarkMode]);

  // Retorna as cores baseadas no tema (usando design-system.ts)
  const colors = shouldUseDark ? COLORS_DARK : COLORS;

  return {
    theme,
    isDark: shouldUseDark,
    colors,
    setTheme,
    toggleTheme: () => {
      const newTheme = theme === "light" ? "dark" : "light";
      setTheme(newTheme);
    },
  };
}
