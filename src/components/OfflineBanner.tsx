import React from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeOut, SlideInUp, SlideOutUp } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

interface OfflineBannerProps {
  /** Called when user taps retry button */
  onRetry?: () => void;
  /** Shows loading indicator on retry button */
  isRetrying?: boolean;
}

/**
 * Banner que aparece no topo da tela quando não há conexão
 * Mostra mensagem amigável e botão para tentar novamente
 *
 * @example
 * const { isOffline, retry, isChecking } = useNetworkStatus();
 *
 * return (
 *   <>
 *     {isOffline && <OfflineBanner onRetry={retry} isRetrying={isChecking} />}
 *     <MainContent />
 *   </>
 * );
 */
export function OfflineBanner({ onRetry, isRetrying = false }: OfflineBannerProps) {
  const insets = useSafeAreaInsets();

  const handleRetry = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onRetry?.();
  };

  return (
    <Animated.View
      entering={SlideInUp.duration(300)}
      exiting={SlideOutUp.duration(300)}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        paddingTop: insets.top + 8,
        paddingBottom: 12,
        paddingHorizontal: 16,
        backgroundColor: "#FEF3C7", // amber-100
        borderBottomWidth: 1,
        borderBottomColor: "#FDE68A", // amber-200
      }}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <Animated.View
        entering={FadeIn.delay(100)}
        exiting={FadeOut}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: "#FDE68A",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 10,
            }}
          >
            <Ionicons name="cloud-offline-outline" size={18} color="#B45309" />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: "#92400E",
                fontSize: 14,
                fontWeight: "600",
              }}
            >
              Sem conexão
            </Text>
            <Text
              style={{
                color: "#B45309",
                fontSize: 12,
                marginTop: 2,
              }}
            >
              Algumas funções podem não funcionar.
            </Text>
          </View>
        </View>

        <Pressable
          onPress={handleRetry}
          disabled={isRetrying}
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#FFFBEB",
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#FCD34D",
            opacity: isRetrying ? 0.7 : 1,
          }}
          accessibilityRole="button"
          accessibilityLabel="Tentar novamente"
          accessibilityHint="Verifica se a conexão foi restabelecida"
          accessibilityState={{ disabled: isRetrying }}
        >
          {isRetrying ? (
            <ActivityIndicator size="small" color="#B45309" />
          ) : (
            <>
              <Ionicons name="refresh-outline" size={16} color="#B45309" />
              <Text
                style={{
                  color: "#B45309",
                  fontSize: 13,
                  fontWeight: "600",
                  marginLeft: 4,
                }}
              >
                Tentar
              </Text>
            </>
          )}
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

export default OfflineBanner;
