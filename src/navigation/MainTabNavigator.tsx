import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MainTabParamList } from "../types/navigation";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { shadowPresets } from "../utils/shadow";

// Screens
import HomeScreen from "../screens/HomeScreen";
import CommunityScreen from "../screens/CommunityScreen";
import AssistantScreen from "../screens/AssistantScreen";
import ProfileScreen from "../screens/ProfileScreen";
import MyCareScreen from "../screens/MyCareScreen";

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        lazy: true,
        tabBarStyle: {
          backgroundColor: "#FFFCF9",
          borderTopColor: "#F5E1DB",
          borderTopWidth: 1,
          paddingTop: 8,
          height: 88,
        },
        tabBarActiveTintColor: "#E11D48",
        tabBarInactiveTintColor: "#A8A29E",
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: "500",
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarAccessibilityLabel: "Início - Tela principal do app",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Community"
        component={CommunityScreen}
        options={{
          tabBarLabel: "Maes Valente",
          tabBarAccessibilityLabel: "Comunidade Mães Valente - Conecte-se com outras mães",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "people" : "people-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Assistant"
        component={AssistantScreen}
        options={{
          tabBarLabel: "NathIA",
          tabBarAccessibilityLabel: "NathIA - Assistente de inteligência artificial",
          tabBarIcon: () => (
            <View
              className="bg-rose-500 rounded-full p-2.5 -mt-5"
              style={shadowPresets.colored("#E11D48", 0.4)}
              accessibilityRole="button"
              accessibilityLabel="NathIA"
            >
              <Ionicons name="sparkles" size={22} color="#FFFFFF" />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Mundo da Nath",
          tabBarAccessibilityLabel: "Perfil - Mundo da Nath e configurações",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MyCare"
        component={MyCareScreen}
        options={{
          tabBarLabel: "Meus Cuidados",
          tabBarAccessibilityLabel: "Meus Cuidados - Bem-estar e autocuidado",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "heart" : "heart-outline"} size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
