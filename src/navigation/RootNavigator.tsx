import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { useAppStore } from "../state/store";

// Screens
import OnboardingScreen from "../screens/OnboardingScreen";
import MainTabNavigator from "./MainTabNavigator";
import PostDetailScreen from "../screens/PostDetailScreen";
import NewPostScreen from "../screens/NewPostScreen";
import WeightCalculatorScreen from "../screens/WeightCalculatorScreen";
import DailyLogScreen from "../screens/DailyLogScreen";
import AffirmationsScreen from "../screens/AffirmationsScreen";
import HabitsScreen from "../screens/HabitsScreen";
import LegalScreen from "../screens/LegalScreen";
import ComingSoonScreen from "../screens/ComingSoonScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const isOnboardingComplete = useAppStore((s) => s.isOnboardingComplete);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: { backgroundColor: "#FFFCF9" },
      }}
    >
      {!isOnboardingComplete ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          <Stack.Screen
            name="PostDetail"
            component={PostDetailScreen}
            options={{
              headerShown: true,
              headerTitle: "Post",
              headerBackTitle: "Voltar",
              headerTintColor: "#9E7269",
              headerStyle: { backgroundColor: "#FFFCF9" },
            }}
          />
          <Stack.Screen
            name="NewPost"
            component={NewPostScreen}
            options={{
              presentation: "modal",
              headerShown: true,
              headerTitle: "Nova Publicacao",
              headerTintColor: "#9E7269",
              headerStyle: { backgroundColor: "#FFFCF9" },
            }}
          />
          <Stack.Screen
            name="WeightCalculator"
            component={WeightCalculatorScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="DailyLog"
            component={DailyLogScreen}
            options={{
              headerShown: false,
              presentation: "modal",
            }}
          />
          <Stack.Screen
            name="Affirmations"
            component={AffirmationsScreen}
            options={{
              headerShown: false,
              animation: "fade",
            }}
          />
          <Stack.Screen
            name="Habits"
            component={HabitsScreen}
            options={{
              headerShown: true,
              headerTitle: "Meus Hábitos",
              headerBackTitle: "Voltar",
              headerTintColor: "#9E7269",
              headerStyle: { backgroundColor: "#FFFCF9" },
            }}
          />
          <Stack.Screen
            name="Legal"
            component={LegalScreen}
            options={{
              headerShown: false,
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="ComingSoon"
            component={ComingSoonScreen}
            options={{
              headerShown: false,
              presentation: "modal",
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
