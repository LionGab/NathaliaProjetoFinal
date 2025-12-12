import React, { useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { Avatar } from "./ui";
import { useAppStore } from "../state/store";
import * as Haptics from "expo-haptics";

const POST_TYPES = [
  { id: "duvida", label: "Dúvida", emoji: "❓", color: "#3B82F6", bgColor: "#EFF6FF" },
  { id: "desabafo", label: "Desabafo", emoji: "💭", color: "#8B5CF6", bgColor: "#F5F3FF" },
  { id: "vitoria", label: "Vitória", emoji: "🎉", color: "#10B981", bgColor: "#ECFDF5" },
  { id: "dica", label: "Dica", emoji: "💡", color: "#F59E0B", bgColor: "#FFFBEB" },
];

interface CommunityComposerProps {
  onPost: (content: string, type: string) => void;
  onExpand?: () => void;
}

export default function CommunityComposer({ onPost, onExpand }: CommunityComposerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [content, setContent] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const user = useAppStore((s) => s.user);

  const handleExpand = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsExpanded(true);
    onExpand?.();
  };

  const handleTypeSelect = async (typeId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedType(typeId === selectedType ? null : typeId);
  };

  const handlePost = async () => {
    if (!content.trim()) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPost(content.trim(), selectedType || "geral");
    setContent("");
    setSelectedType(null);
    setIsExpanded(false);
  };

  const handleCancel = () => {
    setContent("");
    setSelectedType(null);
    setIsExpanded(false);
  };

  if (!isExpanded) {
    return (
      <Pressable
        onPress={handleExpand}
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 20,
          padding: 16,
          marginBottom: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.04,
          shadowRadius: 8,
        }}
      >
        <View className="flex-row items-center">
          <Avatar
            size={44}
            source={user?.avatarUrl ? { uri: user.avatarUrl } : null}
            isNathalia={!user?.avatarUrl}
            fallbackIcon="person"
            fallbackColor="#E11D48"
            fallbackBgColor="#FEE2E2"
            style={{ marginRight: 12 }}
          />
          <Text style={{ flex: 1, color: "#9CA3AF", fontSize: 15 }}>
            Como você está hoje?
          </Text>
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: "#E11D48",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />
          </View>
        </View>

        {/* Quick Type Shortcuts */}
        <View className="flex-row mt-4 pt-4 border-t border-gray-100">
          {POST_TYPES.map((type) => (
            <Pressable
              key={type.id}
              onPress={() => {
                handleExpand();
                setSelectedType(type.id);
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: type.bgColor,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 20,
                marginRight: 8,
              }}
            >
              <Text style={{ fontSize: 14, marginRight: 4 }}>{type.emoji}</Text>
              <Text style={{ color: type.color, fontSize: 13, fontWeight: "500" }}>
                {type.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </Pressable>
    );
  }

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      }}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <Avatar
            size={40}
            source={user?.avatarUrl ? { uri: user.avatarUrl } : null}
            isNathalia={!user?.avatarUrl}
            fallbackIcon="person"
            fallbackColor="#E11D48"
            fallbackBgColor="#FEE2E2"
            style={{ marginRight: 10 }}
          />
          <Text style={{ color: "#1F2937", fontSize: 15, fontWeight: "600" }}>
            Nova publicação
          </Text>
        </View>
        <Pressable onPress={handleCancel}>
          <Ionicons name="close" size={24} color="#9CA3AF" />
        </Pressable>
      </View>

      {/* Type Selection */}
      <View className="flex-row mb-4">
        {POST_TYPES.map((type, index) => (
          <Animated.View
            key={type.id}
            entering={FadeInUp.delay(index * 50).duration(200)}
          >
            <Pressable
              onPress={() => handleTypeSelect(type.id)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: selectedType === type.id ? type.color : type.bgColor,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 20,
                marginRight: 8,
              }}
            >
              <Text style={{ fontSize: 14, marginRight: 4 }}>{type.emoji}</Text>
              <Text
                style={{
                  color: selectedType === type.id ? "#FFFFFF" : type.color,
                  fontSize: 13,
                  fontWeight: "500",
                }}
              >
                {type.label}
              </Text>
            </Pressable>
          </Animated.View>
        ))}
      </View>

      {/* Text Input */}
      <TextInput
        value={content}
        onChangeText={setContent}
        placeholder="Compartilhe o que está pensando..."
        placeholderTextColor="#9CA3AF"
        multiline
        autoFocus
        style={{
          fontSize: 16,
          color: "#1F2937",
          minHeight: 100,
          textAlignVertical: "top",
          marginBottom: 16,
        }}
      />

      {/* Actions */}
      <View className="flex-row items-center justify-between pt-4 border-t border-gray-100">
        <View className="flex-row items-center">
          <Pressable
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#F3F4F6",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 8,
            }}
          >
            <Ionicons name="image-outline" size={20} color="#6B7280" />
          </Pressable>
          <Pressable
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#F3F4F6",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="happy-outline" size={20} color="#6B7280" />
          </Pressable>
        </View>

        <Pressable
          onPress={handlePost}
          disabled={!content.trim()}
          style={{
            backgroundColor: content.trim() ? "#E11D48" : "#F3F4F6",
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 20,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: content.trim() ? "#FFFFFF" : "#9CA3AF",
              fontSize: 14,
              fontWeight: "600",
              marginRight: 4,
            }}
          >
            Publicar
          </Text>
          <Ionicons
            name="send"
            size={16}
            color={content.trim() ? "#FFFFFF" : "#9CA3AF"}
          />
        </Pressable>
      </View>
    </Animated.View>
  );
}
