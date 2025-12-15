/**
 * Hook para Deep Linking
 * Navegação direta para telas específicas via URLs
 */

import { useEffect, useCallback, useRef } from "react";
import * as Linking from "expo-linking";
import { RootStackParamList } from "../types/navigation";
import { logger } from "../utils/logger";
import { navigationRef } from "../navigation/navigationRef";

const SCHEME = "nossamaternidade";

interface DeepLinkConfig {
  path: string;
  screen: keyof RootStackParamList;
  getParams?: (id?: string) => Record<string, unknown>;
  staticParams?: Record<string, unknown>;
}

const DEEP_LINK_ROUTES: Record<string, DeepLinkConfig> = {
  "/post/:id": {
    path: "/post/:id",
    screen: "PostDetail",
    getParams: (id?: string) => ({ postId: id || "" }),
  },
  "/community": {
    path: "/community",
    screen: "MainTabs",
    staticParams: { screen: "Community" },
  },
  "/assistant": {
    path: "/assistant",
    screen: "MainTabs",
    staticParams: { screen: "Assistant" },
  },
  "/home": {
    path: "/home",
    screen: "MainTabs",
    staticParams: { screen: "Home" },
  },
};

function findRoute(path: string): DeepLinkConfig | null {
  // Exact match
  if (DEEP_LINK_ROUTES[path]) {
    return DEEP_LINK_ROUTES[path];
  }

  // Pattern match (e.g., /post/123)
  for (const [pattern, config] of Object.entries(DEEP_LINK_ROUTES)) {
    if (pattern.includes(":id")) {
      const regex = new RegExp(pattern.replace(":id", "([^/]+)"));
      const match = path.match(regex);
      if (match) {
        return {
          ...config,
          getParams: config.getParams ? () => config.getParams!(match[1]) : undefined,
        };
      }
    }
  }

  return null;
}

export function useDeepLinking() {
  const pendingUrlRef = useRef<string | null>(null);

  const handleDeepLink = useCallback((url: string) => {
    try {
      const parsed = Linking.parse(url);
      
      if (parsed.scheme !== SCHEME && !url.includes("nossamaternidade.com.br")) {
        return;
      }

      // Se a navegação ainda não está pronta (ex.: web / inicialização),
      // guardar a URL e tentar novamente quando o NavigationContainer estiver ready.
      if (!navigationRef.isReady()) {
        pendingUrlRef.current = url;
        logger.warn("Navigation not ready yet. Queued deep link.", "DeepLinking", { url });
        return;
      }

      const path = parsed.path || "/";
      const route = findRoute(path);

      if (route) {
        const queryId =
          typeof parsed.queryParams?.id === "string" ? parsed.queryParams.id : undefined;

        const params = route.getParams
          ? route.getParams(queryId)
          : route.staticParams || {};
        
        // Type-safe navigation
        if (route.screen === "PostDetail" && "postId" in params) {
          navigationRef.navigate("PostDetail", { postId: params.postId as string });
        } else if (route.screen === "MainTabs" && "screen" in params) {
          const screenName = params.screen as string;
          if (screenName === "Home" || screenName === "Community" || screenName === "Assistant") {
            navigationRef.navigate("MainTabs", {
              screen: screenName as "Home" | "Community" | "Assistant",
            });
          }
        }
        
        logger.info(`Deep link navigated to ${route.screen}`, "DeepLinking");
      } else {
        logger.warn(`Unknown deep link path: ${path}`, "DeepLinking");
      }
    } catch (error) {
      logger.error("Error handling deep link", "DeepLinking", error instanceof Error ? error : new Error(String(error)));
    }
  }, []);

  useEffect(() => {
    // Handle initial URL (app opened via deep link)
    const handleInitialURL = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        handleDeepLink(initialUrl);
      }
    };

    handleInitialURL();

    // Handle URL changes (app already open)
    const subscription = Linking.addEventListener("url", (event) => {
      handleDeepLink(event.url);
    });

    return () => {
      subscription.remove();
    };
  }, [handleDeepLink]);

  useEffect(() => {
    // Se houve deep link antes da navegação estar pronta,
    // tenta reenfileirar quando a ref estiver pronta.
    const interval = setInterval(() => {
      if (pendingUrlRef.current && navigationRef.isReady()) {
        const url = pendingUrlRef.current;
        pendingUrlRef.current = null;
        handleDeepLink(url);
      }
    }, 150);

    return () => clearInterval(interval);
  }, [handleDeepLink]);

  return {
    handleDeepLink,
  };
}
