# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Nossa Maternidade** - A maternal health companion app for pregnant women and new mothers in Brazil, created by Nathalia Valente. iOS-first Expo React Native app.

## Critical Constraints (Vibecode Environment)

- **DO NOT** install new packages - all dependencies are pre-installed in package.json
- **DO NOT** manage git unless explicitly asked
- **DO NOT** tinker with the dev server (auto-hosted on port 8081)
- **DO NOT** share, display, or expose API keys in any manner
- **Always use** `bun` instead of `npm`
- **Always use** double quotes for strings containing apostrophes: `"How's it going?"` (NOT single quotes)
- **Never use** `console.log()` for user communication - display messages on screen instead
- **Never use** alerts - implement custom modals instead
- Ignore the orange menu button in screenshots (Vibecode system UI)

## Commands

```bash
# Development (auto-managed by Vibecode, rarely needed)
bun start            # Start Expo dev server
bun run ios          # Run on iOS simulator
bun run android      # Run on Android emulator

# Type checking
bunx tsc --noEmit    # Check TypeScript errors
```

## Architecture

### Navigation Structure

```
RootNavigator (Native Stack)
├── OnboardingScreen (9 steps, shown if !onboardingComplete)
└── MainTabs (Bottom Tab Navigator)
    ├── Home         → HomeScreen
    ├── Ciclo        → CycleTrackerScreen
    ├── NathIA       → AssistantScreen (AI chat)
    ├── Comunidade   → CommunityScreen
    └── Meus Cuidados → MyCareScreen

Modal Screens (presentation: "modal"):
├── PostDetail, NewPost
├── DailyLog, Affirmations, Habits
├── WeightCalculator, ComingSoon
```

### State Management (Zustand + AsyncStorage)

All stores centralized in `src/state/store.ts`:

| Store | Persisted | Purpose |
|-------|-----------|---------|
| useAppStore | Yes | User profile, onboarding state |
| useCommunityStore | No | Posts, groups (always fresh from API) |
| useChatStore | Yes | AI conversation history |
| useCycleStore | Yes | Menstrual cycle tracking, daily logs |
| useAffirmationsStore | Yes | Favorite affirmations, daily selection |
| useHabitsStore | Yes | 8 wellness habits, streaks |
| useCheckInStore | Yes | Daily mood/energy/sleep check-ins |

**Zustand selector pattern** (avoid infinite loops):
```typescript
// GOOD: Individual selectors
const user = useAppStore(s => s.user);
const setUser = useAppStore(s => s.setUser);

// BAD: Object selector creates new ref each render
const { user, setUser } = useAppStore(s => ({ user: s.user, setUser: s.setUser }));
```

### Pre-built API Functions

Located in `src/api/`:

```typescript
// AI Chat (src/api/chat-service.ts)
getOpenAITextResponse(messages, options?)  // Default: gpt-4o
getGrokTextResponse(messages, options?)    // Alternative: grok-3-beta

// Audio (src/api/transcribe-audio.ts)
transcribeAudio(filePath)  // Uses gpt-4o-transcribe

// Images (src/api/image-generation.ts)
generateImage(prompt)      // Uses gpt-image-1

// Supabase (src/api/supabase.ts)
// Optional - only initializes if env vars exist
```

## Styling Rules

- **Use Nativewind + Tailwind** with `className` prop
- **Use `cn()` helper** from `src/utils/cn.ts` for conditional classes
- **EXCEPTION**: `<CameraView>` and `<LinearGradient>` require inline `style` prop (not className)
- **EXCEPTION**: Animated components (AnimatedView, AnimatedText) may need inline styles
- **Use Ionicons** from `@expo/vector-icons` for icons
- **Use zeego** for context/dropdown menus

### Design Tokens

```
Primary: rose-600 (#E11D48)
Background: cream (#FFFCF9)
Accent: blush (#BC8B7B)
Fertility: violet-500 (#8B5CF6)
Fonts: DMSans (body), DMSerifDisplay (headers)
```

## Animation & Gestures

- **Use react-native-reanimated v3** - NOT Animated from react-native
- **Use react-native-gesture-handler** for gestures
- **Always WebSearch docs** before implementing - training data may be outdated

## Layout Rules

- **Use SafeAreaProvider** with `useSafeAreaInsets` (not SafeAreaView from react-native)
- Tab navigator → no bottom insets needed
- Native header → no safe area insets needed
- Custom header → top inset required
- **Use Pressable** over TouchableOpacity

## Camera Implementation

```typescript
// Correct import (Camera is deprecated)
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

// Must use style prop, NOT className
<CameraView style={{ flex: 1 }} facing={facing} ref={cameraRef}>
  {/* Overlay must be absolute positioned */}
  <View className="absolute inset-0 z-10">
    {/* UI controls */}
  </View>
</CameraView>
```

## Type Definitions

Navigation types in `src/types/navigation.ts`:
- `RootStackParamList` - all stack screens
- `MainTabParamList` - 5 tab screens
- Domain types: `UserProfile`, `Post`, `ChatMessage`, `DailyLog`, `Affirmation`, `Habit`

AI types in `src/types/ai.ts`:
- `AIMessage`, `AIRequestOptions`, `AIResponse`

## File Organization

```
src/
├── api/           # External service clients (OpenAI, Grok, Supabase)
├── components/    # Reusable UI (ui/ for atoms, feature components at root)
├── screens/       # Full-page screen components
├── navigation/    # RootNavigator, MainTabNavigator
├── state/         # Zustand stores (store.ts)
├── types/         # TypeScript definitions
└── utils/         # Helpers (cn.ts, logger.ts)
```

## Key Files

| File | Purpose |
|------|---------|
| `App.tsx` | Root component, font loading, providers |
| `src/state/store.ts` | All Zustand stores |
| `src/navigation/RootNavigator.tsx` | Navigation config |
| `tailwind.config.js` | Theme colors, fonts |
| `app.json` | Expo config (bundle ID, permissions) |
