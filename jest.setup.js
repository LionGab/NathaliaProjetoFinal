/**
 * Jest Setup File
 *
 * Mocks and configurations for React Native/Expo testing.
 * Uses require() to avoid jest.mock hoisting issues.
 */

/* eslint-disable @typescript-eslint/no-require-imports */

// Setup react-native-reanimated mock
require("react-native-reanimated").setUpTests();

// Silence act() warnings from React 19
global.IS_REACT_ACT_ENVIRONMENT = true;

// Mock AsyncStorage (used by zustand stores)
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);
