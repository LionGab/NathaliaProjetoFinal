import React from "react";
import { View, Text, ScrollView, Pressable, Linking, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import Constants from "expo-constants";
import { RootStackScreenProps } from "../types/navigation";
import { shadowPresets } from "../utils/shadow";
import * as Haptics from "expo-haptics";

// URLs dos documentos legais via expo-constants (definidos em app.json extra.legal)
const legalConfig = Constants.expoConfig?.extra?.legal as {
  privacyUrl?: string;
  termsUrl?: string;
  aiDisclaimerUrl?: string;
} | undefined;

const LEGAL_URLS = {
  privacy: legalConfig?.privacyUrl ?? "https://nossamaternidade.com.br/privacy",
  terms: legalConfig?.termsUrl ?? "https://nossamaternidade.com.br/terms",
  aiDisclaimer: legalConfig?.aiDisclaimerUrl ?? "https://nossamaternidade.com.br/ai-disclaimer",
};

interface LegalItem {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  url: string;
}

const LEGAL_ITEMS: LegalItem[] = [
  {
    id: "privacy",
    title: "Política de Privacidade",
    description: "Como coletamos, usamos e protegemos seus dados",
    icon: "shield-checkmark-outline",
    color: "#6366F1",
    url: LEGAL_URLS.privacy,
  },
  {
    id: "terms",
    title: "Termos de Uso",
    description: "Regras e condições para usar o app",
    icon: "document-text-outline",
    color: "#8B5CF6",
    url: LEGAL_URLS.terms,
  },
  {
    id: "aiDisclaimer",
    title: "Uso de Inteligência Artificial",
    description: "Informações sobre a NathIA e uso de IA no app",
    icon: "sparkles-outline",
    color: "#EC4899",
    url: LEGAL_URLS.aiDisclaimer,
  },
];

const INFO_ITEMS = [
  {
    id: "lgpd",
    title: "Seus Direitos (LGPD)",
    items: [
      "Acessar seus dados pessoais",
      "Corrigir dados incompletos ou incorretos",
      "Solicitar exclusão dos seus dados",
      "Revogar consentimento a qualquer momento",
    ],
  },
  {
    id: "medical",
    title: "Aviso Médico Importante",
    content:
      "Este aplicativo não substitui consultas médicas. A NathIA oferece apoio emocional e informações gerais, mas não é uma profissional de saúde. Em caso de emergência, procure atendimento médico imediato.",
    icon: "medkit-outline",
    color: "#EF4444",
  },
];

export default function LegalScreen({ navigation }: RootStackScreenProps<"Legal">) {
  const insets = useSafeAreaInsets();

  const handleOpenLink = async (url: string, title: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          "Link indisponível",
          `Não foi possível abrir ${title}. Tente novamente mais tarde.`,
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao abrir o link.", [{ text: "OK" }]);
    }
  };

  const handleBack = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  };

  const handleContactDPO = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const email = "privacidade@nossamaternidade.com.br";
    const subject = encodeURIComponent("Solicitação LGPD - Nossa Maternidade");
    const url = `mailto:${email}?subject=${subject}`;

    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert(
        "Email",
        `Entre em contato pelo email: ${email}`,
        [{ text: "OK" }]
      );
    }
  };

  return (
    <View className="flex-1 bg-cream-50">
      <LinearGradient
        colors={["#F5F3FF", "#FDF4FF", "#FFFCF9"]}
        locations={[0, 0.4, 1]}
        style={{ position: "absolute", top: 0, left: 0, right: 0, height: 350 }}
      />

      {/* Header */}
      <Animated.View
        entering={FadeInDown.duration(400)}
        style={{ paddingTop: insets.top + 8 }}
        className="px-4 pb-4 flex-row items-center"
      >
        <Pressable
          onPress={handleBack}
          className="p-2 mr-3"
          style={[{ backgroundColor: "#FFFFFF", borderRadius: 12 }, shadowPresets.sm]}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          accessibilityHint="Retorna para a tela anterior"
        >
          <Ionicons name="arrow-back" size={24} color="#78716C" />
        </Pressable>
        <Text
          className="text-warmGray-800 text-2xl font-serif flex-1"
          accessibilityRole="header"
        >
          Legal e Privacidade
        </Text>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Documentos Legais */}
        <Animated.View
          entering={FadeInUp.delay(100).duration(500).springify()}
          className="px-4 mb-6"
        >
          <Text className="text-warmGray-600 text-sm font-medium mb-3 ml-1">
            DOCUMENTOS
          </Text>
          <View
            style={[
              { backgroundColor: "#FFFFFF", borderRadius: 20, overflow: "hidden" },
              shadowPresets.md,
            ]}
          >
            {LEGAL_ITEMS.map((item, index) => (
              <Pressable
                key={item.id}
                onPress={() => handleOpenLink(item.url, item.title)}
                className={`flex-row items-center px-4 py-4 ${
                  index < LEGAL_ITEMS.length - 1 ? "border-b border-warmGray-100" : ""
                }`}
                accessibilityRole="link"
                accessibilityLabel={item.title}
                accessibilityHint={`Abre ${item.title} no navegador`}
              >
                <View
                  className="w-11 h-11 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: `${item.color}15` }}
                >
                  <Ionicons name={item.icon} size={22} color={item.color} />
                </View>
                <View className="flex-1">
                  <Text className="text-warmGray-800 text-base font-semibold">
                    {item.title}
                  </Text>
                  <Text className="text-warmGray-500 text-sm mt-0.5">
                    {item.description}
                  </Text>
                </View>
                <Ionicons name="open-outline" size={20} color="#A8A29E" />
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Aviso Médico */}
        <Animated.View
          entering={FadeInUp.delay(200).duration(500).springify()}
          className="px-4 mb-6"
        >
          <View
            style={[
              {
                backgroundColor: "#FEF2F2",
                borderRadius: 20,
                padding: 16,
                borderWidth: 1,
                borderColor: "#FECACA",
              },
            ]}
            accessibilityRole="alert"
          >
            <View className="flex-row items-center mb-3">
              <View
                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: "#FEE2E2" }}
              >
                <Ionicons name="medkit-outline" size={20} color="#EF4444" />
              </View>
              <Text className="text-red-700 text-base font-bold flex-1">
                Aviso Médico Importante
              </Text>
            </View>
            <Text className="text-red-600 text-sm leading-5">
              Este aplicativo não substitui consultas médicas. A NathIA oferece
              apoio emocional e informações gerais, mas não é uma profissional de
              saúde. Em caso de emergência, procure atendimento médico imediato.
            </Text>
          </View>
        </Animated.View>

        {/* Direitos LGPD */}
        <Animated.View
          entering={FadeInUp.delay(300).duration(500).springify()}
          className="px-4 mb-6"
        >
          <Text className="text-warmGray-600 text-sm font-medium mb-3 ml-1">
            SEUS DIREITOS (LGPD)
          </Text>
          <View
            style={[
              { backgroundColor: "#FFFFFF", borderRadius: 20, padding: 16 },
              shadowPresets.md,
            ]}
          >
            <Text className="text-warmGray-700 text-sm mb-4">
              De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:
            </Text>
            {INFO_ITEMS[0].items?.map((item, index) => (
              <View key={index} className="flex-row items-start mb-3">
                <View
                  className="w-6 h-6 rounded-full items-center justify-center mr-3 mt-0.5"
                  style={{ backgroundColor: "#E0E7FF" }}
                >
                  <Ionicons name="checkmark" size={14} color="#6366F1" />
                </View>
                <Text className="text-warmGray-700 text-sm flex-1">{item}</Text>
              </View>
            ))}
            <Pressable
              onPress={handleContactDPO}
              className="flex-row items-center justify-center mt-4 py-3 rounded-xl"
              style={{ backgroundColor: "#F5F3FF" }}
              accessibilityRole="button"
              accessibilityLabel="Entrar em contato com o DPO"
              accessibilityHint="Abre o email para contato sobre privacidade"
            >
              <Ionicons name="mail-outline" size={18} color="#6366F1" />
              <Text className="text-indigo-600 text-sm font-semibold ml-2">
                Entrar em contato sobre seus dados
              </Text>
            </Pressable>
          </View>
        </Animated.View>

        {/* Uso de IA */}
        <Animated.View
          entering={FadeInUp.delay(400).duration(500).springify()}
          className="px-4 mb-6"
        >
          <Text className="text-warmGray-600 text-sm font-medium mb-3 ml-1">
            SOBRE A INTELIGÊNCIA ARTIFICIAL
          </Text>
          <View
            style={[
              {
                backgroundColor: "#FDF4FF",
                borderRadius: 20,
                padding: 16,
                borderWidth: 1,
                borderColor: "#F5D0FE",
              },
            ]}
          >
            <View className="flex-row items-center mb-3">
              <View
                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: "#FAE8FF" }}
              >
                <Ionicons name="sparkles" size={20} color="#A855F7" />
              </View>
              <Text className="text-purple-800 text-base font-bold flex-1">
                NathIA - Sua Assistente
              </Text>
            </View>
            <Text className="text-purple-700 text-sm leading-5 mb-3">
              A NathIA utiliza inteligência artificial para oferecer apoio
              emocional e informações sobre maternidade. Suas conversas são
              processadas por provedores de IA (OpenAI/Google) para gerar respostas.
            </Text>
            <View className="flex-row items-start">
              <Ionicons
                name="information-circle-outline"
                size={16}
                color="#9333EA"
                style={{ marginTop: 2, marginRight: 6 }}
              />
              <Text className="text-purple-600 text-xs flex-1">
                Não compartilhamos suas conversas com terceiros para fins de marketing.
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Versão e Copyright */}
        <Animated.View
          entering={FadeInUp.delay(500).duration(500).springify()}
          className="items-center mt-4"
        >
          <Text className="text-warmGray-400 text-sm">Nossa Maternidade v1.0.0</Text>
          <Text className="text-warmGray-300 text-xs mt-1">
            © 2025 Nathália Valente. Todos os direitos reservados.
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
