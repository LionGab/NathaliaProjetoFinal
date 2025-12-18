/**
 * CommunityScreen - Feed "Mães Valente"
 *
 * Feed único tipo Instagram (sem grupos, sem stories)
 * Posts são enviados para revisão antes de serem publicados
 * Suporta: texto, imagem, vídeo
 *
 * Design: Calm FemTech - Design System 2025
 */

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { ComposerCard, NewPostModal, PostCard } from "../components/community";
import { FAB, ScreenHeader } from "../components/ui";
import { useCommunity } from "../hooks/useCommunity";
import { useTheme } from "../hooks/useTheme";
import { COLORS, RADIUS, SPACING } from "../theme/design-system";
import type { MainTabScreenProps } from "../types/navigation";

// Logo Comunidade Mães Valente
const MAES_VALENTE_LOGO_URL = "https://i.imgur.com/U5ttbqK.jpg";

export default function CommunityScreen({ navigation }: MainTabScreenProps<"Community">) {
  const insets = useSafeAreaInsets();
  const { colors, isDark, spacing } = useTheme();

  // Hook com toda a lógica
  const community = useCommunity(navigation);

  // Theme colors
  const bgPrimary = colors.background.primary;
  const textMain = isDark ? colors.neutral[100] : colors.neutral[900];
  const textMuted = isDark ? colors.neutral[400] : colors.neutral[500];
  const textSecondary = isDark ? colors.neutral[400] : COLORS.text.secondary;
  const borderColor = isDark ? colors.neutral[700] : COLORS.neutral[200];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgPrimary }]} edges={["top"]}>
      <View style={[styles.container, { backgroundColor: bgPrimary }]}>
        {/* Header - Using ScreenHeader component */}
        <ScreenHeader
          title="Mães Valente"
          subtitle="Comunidade de apoio e inspiração"
          logo={
            <Image
              source={{ uri: MAES_VALENTE_LOGO_URL }}
              style={{ width: 32, height: 32 }}
            />
          }
          rightActions={[
            {
              icon: community.isSearchVisible ? "close" : "search",
              onPress: community.handleSearchToggle,
              label: community.isSearchVisible ? "Fechar busca" : "Buscar posts",
            },
          ]}
        />

        {/* Search Input */}
        {community.isSearchVisible && (
          <Animated.View
            entering={FadeIn.duration(200)}
            style={[
              styles.searchInput,
              {
                backgroundColor: isDark ? colors.neutral[800] : COLORS.neutral[0],
                borderColor,
                marginHorizontal: spacing.xl,
                marginBottom: SPACING.md,
              },
            ]}
          >
            <Ionicons name="search" size={18} color={textSecondary} />
            <TextInput
              value={community.searchQuery}
              onChangeText={community.setSearchQuery}
              placeholder="Buscar posts..."
              placeholderTextColor={textSecondary}
              autoFocus
              style={[styles.searchTextInput, { color: textMain }]}
            />
          </Animated.View>
        )}

        {/* Feed */}
        <FlatList
          data={community.filteredPosts}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <PostCard
              post={item}
              index={index}
              onLike={community.handleLike}
              onComment={community.handleCommentPress}
              onShare={community.handleSharePress}
              onPress={community.handlePostPress}
            />
          )}
          ListHeaderComponent={
            <View>
              <ComposerCard onPress={community.openNewPostModal} />
              {/* Separador de seção */}
              <View style={styles.sectionDivider}>
                <View style={[styles.dividerLine, { backgroundColor: borderColor }]} />
                <Text style={[styles.sectionLabel, { color: textMuted }]}>
                  Publicações recentes
                </Text>
                <View style={[styles.dividerLine, { backgroundColor: borderColor }]} />
              </View>
            </View>
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.listContent,
            {
              paddingHorizontal: spacing.xl,
              paddingBottom: 120 + insets.bottom,
            },
          ]}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={5}
          removeClippedSubviews={true}
        />

        {/* FAB - Using FAB component */}
        <View style={[styles.fabContainer, { bottom: insets.bottom + SPACING.xl }]}>
          <FAB
            icon="add"
            onPress={community.openNewPostModal}
            variant="accent"
            size="md"
            accessibilityLabel="Criar novo post"
          />
        </View>

        {/* Modal */}
        <NewPostModal
          visible={community.isNewPostModalVisible}
          onClose={community.closeNewPostModal}
          onSubmit={community.handleNewPost}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  searchInput: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
  },
  searchTextInput: {
    flex: 1,
    marginLeft: SPACING.sm,
    fontSize: 15,
    paddingVertical: SPACING.xs,
  },
  listContent: {
    paddingTop: SPACING.lg,
  },
  sectionDivider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.xl,
    gap: SPACING.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "Manrope_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  fabContainer: {
    position: "absolute",
    right: SPACING.xl,
  },
});
