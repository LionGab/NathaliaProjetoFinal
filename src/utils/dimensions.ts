import { Dimensions } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Base dimensions (iPhone 11 Pro)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

/**
 * Calculates responsive width based on screen width
 */
export const wp = (percentage: number): number => {
  return (SCREEN_WIDTH * percentage) / 100;
};

/**
 * Calculates responsive height based on screen height
 */
export const hp = (percentage: number): number => {
  return (SCREEN_HEIGHT * percentage) / 100;
};

/**
 * Calculates font size based on screen width
 */
export const fs = (size: number): number => {
  return (SCREEN_WIDTH / BASE_WIDTH) * size;
};

/**
 * Get responsive padding for container
 */
export const getContainerPadding = (): number => {
  if (SCREEN_WIDTH < 375) return 16; // Small phones
  if (SCREEN_WIDTH < 414) return 20; // Medium phones
  return 24; // Large phones
};

/**
 * Get responsive card spacing
 */
export const getCardSpacing = (): number => {
  if (SCREEN_WIDTH < 375) return 12;
  return 16;
};

export { SCREEN_WIDTH, SCREEN_HEIGHT };
