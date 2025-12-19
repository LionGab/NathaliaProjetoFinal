/**
 * Social Authentication Service
 * Integração com Google, Apple e Facebook via Supabase OAuth
 *
 * Referências de UX dos melhores apps femininos (Flo, Clue, Ovia):
 * - Login social deve ser simples e direto
 * - Priorizar Apple (iOS) e Google (Android/Web)
 * - Facebook como opção secundária
 */

import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import * as AppleAuthentication from "expo-apple-authentication";
import { Platform } from "react-native";
import { supabase } from "./supabase";
import { logger } from "../utils/logger";

// Permitir que o browser feche corretamente após OAuth
WebBrowser.maybeCompleteAuthSession();

// Tipos
export type SocialProvider = "google" | "apple" | "facebook";

export interface SocialAuthResult {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name?: string;
    avatarUrl?: string;
  };
  error?: string;
}

// URLs de redirect
const REDIRECT_URI = AuthSession.makeRedirectUri({
  scheme: "nossamaternidade",
  path: "auth/callback",
});

/**
 * Verifica se o Supabase está configurado
 */
function checkSupabase() {
  if (!supabase) {
    throw new Error(
      "Supabase não está configurado. Adicione as variáveis de ambiente EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY."
    );
  }
  return supabase;
}

/**
 * Login com Google usando Supabase OAuth
 *
 * Baseado nos padrões do Flo e Clue que priorizam Google no Android
 */
export async function signInWithGoogle(): Promise<SocialAuthResult> {
  try {
    const client = checkSupabase();

    logger.info("Iniciando login com Google", "SocialAuth", {
      redirectUri: REDIRECT_URI,
    });

    const { data, error } = await client.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: REDIRECT_URI,
        skipBrowserRedirect: true,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      logger.error("Erro no OAuth Google", "SocialAuth", error);
      return {
        success: false,
        error: error.message,
      };
    }

    if (!data.url) {
      return {
        success: false,
        error: "URL de autenticação não gerada",
      };
    }

    // Abrir browser para autenticação
    const result = await WebBrowser.openAuthSessionAsync(
      data.url,
      REDIRECT_URI,
      {
        showInRecents: true,
      }
    );

    if (result.type === "success" && result.url) {
      // Extrair tokens da URL
      const url = new URL(result.url);
      const params = new URLSearchParams(url.hash.substring(1));
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");

      if (accessToken) {
        // Definir sessão com os tokens
        const { data: sessionData, error: sessionError } =
          await client.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || "",
          });

        if (sessionError) {
          return {
            success: false,
            error: sessionError.message,
          };
        }

        if (sessionData.user) {
          logger.info("Login Google bem sucedido", "SocialAuth", {
            userId: sessionData.user.id,
          });

          return {
            success: true,
            user: {
              id: sessionData.user.id,
              email: sessionData.user.email || "",
              name: sessionData.user.user_metadata?.full_name ||
                sessionData.user.user_metadata?.name,
              avatarUrl: sessionData.user.user_metadata?.avatar_url ||
                sessionData.user.user_metadata?.picture,
            },
          };
        }
      }
    }

    if (result.type === "cancel") {
      return {
        success: false,
        error: "Login cancelado",
      };
    }

    return {
      success: false,
      error: "Falha na autenticação",
    };
  } catch (error) {
    logger.error("Exceção no login Google", "SocialAuth", error as Error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

/**
 * Login com Apple usando autenticação nativa (iOS) ou OAuth (Android/Web)
 *
 * Apple Sign In é obrigatório para apps iOS que oferecem login social
 * Baseado no padrão do Flo que usa Apple como primeira opção no iOS
 */
export async function signInWithApple(): Promise<SocialAuthResult> {
  try {
    const client = checkSupabase();

    // iOS: Usar autenticação nativa
    if (Platform.OS === "ios") {
      return await signInWithAppleNative(client);
    }

    // Android/Web: Usar OAuth
    return await signInWithAppleOAuth(client);
  } catch (error) {
    logger.error("Exceção no login Apple", "SocialAuth", error as Error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

/**
 * Apple Sign In nativo para iOS
 */
async function signInWithAppleNative(
  client: ReturnType<typeof checkSupabase>
): Promise<SocialAuthResult> {
  try {
    // Verificar se Apple Sign In está disponível
    const isAvailable = await AppleAuthentication.isAvailableAsync();
    if (!isAvailable) {
      return {
        success: false,
        error: "Apple Sign In não está disponível neste dispositivo",
      };
    }

    logger.info("Iniciando Apple Sign In nativo", "SocialAuth");

    // Solicitar credenciais
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    if (!credential.identityToken) {
      return {
        success: false,
        error: "Token de identidade não recebido",
      };
    }

    // Autenticar com Supabase usando o token
    const { data, error } = await client.auth.signInWithIdToken({
      provider: "apple",
      token: credential.identityToken,
    });

    if (error) {
      logger.error("Erro ao autenticar com Supabase", "SocialAuth", error);
      return {
        success: false,
        error: error.message,
      };
    }

    if (data.user) {
      // Apple pode não retornar nome em logins subsequentes
      const fullName = credential.fullName
        ? `${credential.fullName.givenName || ""} ${credential.fullName.familyName || ""}`.trim()
        : undefined;

      logger.info("Login Apple bem sucedido", "SocialAuth", {
        userId: data.user.id,
      });

      return {
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email || credential.email || "",
          name: fullName || data.user.user_metadata?.full_name,
          avatarUrl: data.user.user_metadata?.avatar_url,
        },
      };
    }

    return {
      success: false,
      error: "Usuário não retornado",
    };
  } catch (error) {
    // Usuário cancelou
    if (
      error instanceof Error &&
      error.message.includes("ERR_REQUEST_CANCELED")
    ) {
      return {
        success: false,
        error: "Login cancelado",
      };
    }

    throw error;
  }
}

/**
 * Apple Sign In via OAuth para Android/Web
 */
async function signInWithAppleOAuth(
  client: ReturnType<typeof checkSupabase>
): Promise<SocialAuthResult> {
  logger.info("Iniciando Apple Sign In via OAuth", "SocialAuth", {
    redirectUri: REDIRECT_URI,
  });

  const { data, error } = await client.auth.signInWithOAuth({
    provider: "apple",
    options: {
      redirectTo: REDIRECT_URI,
      skipBrowserRedirect: true,
    },
  });

  if (error) {
    logger.error("Erro no OAuth Apple", "SocialAuth", error);
    return {
      success: false,
      error: error.message,
    };
  }

  if (!data.url) {
    return {
      success: false,
      error: "URL de autenticação não gerada",
    };
  }

  const result = await WebBrowser.openAuthSessionAsync(data.url, REDIRECT_URI, {
    showInRecents: true,
  });

  if (result.type === "success" && result.url) {
    const url = new URL(result.url);
    const params = new URLSearchParams(url.hash.substring(1));
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");

    if (accessToken) {
      const { data: sessionData, error: sessionError } =
        await client.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || "",
        });

      if (sessionError) {
        return {
          success: false,
          error: sessionError.message,
        };
      }

      if (sessionData.user) {
        logger.info("Login Apple OAuth bem sucedido", "SocialAuth", {
          userId: sessionData.user.id,
        });

        return {
          success: true,
          user: {
            id: sessionData.user.id,
            email: sessionData.user.email || "",
            name: sessionData.user.user_metadata?.full_name,
            avatarUrl: sessionData.user.user_metadata?.avatar_url,
          },
        };
      }
    }
  }

  if (result.type === "cancel") {
    return {
      success: false,
      error: "Login cancelado",
    };
  }

  return {
    success: false,
    error: "Falha na autenticação",
  };
}

/**
 * Login com Facebook usando Supabase OAuth
 *
 * Facebook é opção secundária nos melhores apps (Flo, Clue)
 * mas ainda importante para usuárias que preferem essa rede
 */
export async function signInWithFacebook(): Promise<SocialAuthResult> {
  try {
    const client = checkSupabase();

    logger.info("Iniciando login com Facebook", "SocialAuth", {
      redirectUri: REDIRECT_URI,
    });

    const { data, error } = await client.auth.signInWithOAuth({
      provider: "facebook",
      options: {
        redirectTo: REDIRECT_URI,
        skipBrowserRedirect: true,
        scopes: "email,public_profile",
      },
    });

    if (error) {
      logger.error("Erro no OAuth Facebook", "SocialAuth", error);
      return {
        success: false,
        error: error.message,
      };
    }

    if (!data.url) {
      return {
        success: false,
        error: "URL de autenticação não gerada",
      };
    }

    const result = await WebBrowser.openAuthSessionAsync(
      data.url,
      REDIRECT_URI,
      {
        showInRecents: true,
      }
    );

    if (result.type === "success" && result.url) {
      const url = new URL(result.url);
      const params = new URLSearchParams(url.hash.substring(1));
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");

      if (accessToken) {
        const { data: sessionData, error: sessionError } =
          await client.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || "",
          });

        if (sessionError) {
          return {
            success: false,
            error: sessionError.message,
          };
        }

        if (sessionData.user) {
          logger.info("Login Facebook bem sucedido", "SocialAuth", {
            userId: sessionData.user.id,
          });

          return {
            success: true,
            user: {
              id: sessionData.user.id,
              email: sessionData.user.email || "",
              name: sessionData.user.user_metadata?.full_name ||
                sessionData.user.user_metadata?.name,
              avatarUrl: sessionData.user.user_metadata?.avatar_url ||
                sessionData.user.user_metadata?.picture,
            },
          };
        }
      }
    }

    if (result.type === "cancel") {
      return {
        success: false,
        error: "Login cancelado",
      };
    }

    return {
      success: false,
      error: "Falha na autenticação",
    };
  } catch (error) {
    logger.error("Exceção no login Facebook", "SocialAuth", error as Error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

/**
 * Verifica se Apple Sign In está disponível no dispositivo
 */
export async function isAppleSignInAvailable(): Promise<boolean> {
  if (Platform.OS !== "ios") {
    return true; // OAuth funciona em qualquer plataforma
  }

  try {
    return await AppleAuthentication.isAvailableAsync();
  } catch {
    return false;
  }
}

/**
 * Helper para obter o nome do provedor em português
 */
export function getProviderDisplayName(provider: SocialProvider): string {
  const names: Record<SocialProvider, string> = {
    google: "Google",
    apple: "Apple",
    facebook: "Facebook",
  };
  return names[provider];
}
