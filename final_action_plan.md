# Plano de Ação Final para Desbloqueio do Deploy (P0)

**Projeto:** Nossa Maternidade
**Status Atual:** Documentos legais placeholder criados.
**Objetivo:** Fornecer um guia claro e executável para remover os bloqueadores críticos de lançamento (P0) restantes.

---

## 1. Bloqueadores Críticos Restantes

Os bloqueadores P0 que **exigem acesso às suas contas** e não podem ser automatizados são:

| Bloqueador | Justificativa |
| :--- | :--- |
| **Configuração de Secrets no EAS** | O app não se conecta ao Supabase ou às APIs de IA em produção sem as chaves configuradas no ambiente de build. |
| **Configuração do RevenueCat** | A monetização não funciona sem a criação do *entitlement*, *offering* e a sincronização dos produtos. |
| **Criação de Produtos nas Lojas** | Os produtos de assinatura (mensal/anual) precisam ser criados no App Store Connect e Google Play Console para serem reconhecidos pelo RevenueCat. |

## 2. Plano de Ação Executável (Dia 1 e 2)

Este plano é baseado no `PLANO_LANCAMENTO_10_DIAS.md` e deve ser executado por você, pois exige acesso a credenciais privadas.

### Ação 1: Configuração de Secrets (Técnico)

**O que fazer:** Configurar as variáveis de ambiente no EAS.

| Secret | Valor de Exemplo (Substituir) | Comando EAS (Executar no seu terminal) |
| :--- | :--- | :--- |
| `EXPO_PUBLIC_SUPABASE_URL` | `https://seu-projeto.supabase.co` | `eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "..."` |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | `sua-chave-anon-aqui` | `eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "..."` |
| `EXPO_PUBLIC_OPENAI_API_KEY` | `sk-sua-chave-aqui` | `eas secret:create --scope project --name EXPO_PUBLIC_OPENAI_API_KEY --value "..."` |
| `EXPO_PUBLIC_REVENUECAT_IOS_KEY` | `appl_sua-chave-ios` | `eas secret:create --scope project --name EXPO_PUBLIC_REVENUECAT_IOS_KEY --value "..."` |
| `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY` | `goog_sua-chave-android` | `eas secret:create --scope project --name EXPO_PUBLIC_REVENUECAT_ANDROID_KEY --value "..."` |

### Ação 2: Configuração da Monetização (RevenueCat)

**O que fazer:** Seguir os passos do `PLANO_LANCAMENTO_10_DIAS.md` (Seção 3.2).

1.  **Criar Entitlement:** Criar o *entitlement* com o ID **`premium`** no dashboard do RevenueCat.
2.  **Criar Offering:** Criar o *offering* com o ID **`default`**.
3.  **Configurar Webhook:** Configurar o webhook do RevenueCat para o endpoint do Supabase:
    *   **URL:** `https://lqahkqfpynypbmhtffyi.supabase.co/functions/v1/webhook/revenuecat`
    *   **Secret:** `925768eedee5c9fb740587618da37a816100f21f4ca4eb47df327d624fbc6525`

### Ação 3: Criação de Produtos nas Lojas (Lojas)

**O que fazer:** Criar os produtos de assinatura nas lojas.

| Loja | Produto ID (EXACT MATCH) | Tipo | Preço |
| :--- | :--- | :--- | :--- |
| **App Store Connect** | `com.nossamaternidade.subscription.monthly` | Auto-Renewable | R$ 19,90/mês |
| **App Store Connect** | `com.nossamaternidade.subscription.annual` | Auto-Renewable | R$ 79,90/ano |
| **Google Play Console** | `com.nossamaternidade.subscription.monthly` | Subscription | R$ 19,90/mês |
| **Google Play Console** | `com.nossamaternidade.subscription.annual` | Subscription | R$ 79,90/ano |

## 3. Próximo Passo de Execução (Refinamento de Design)

Assim que os bloqueadores P0 forem resolvidos e você puder fazer um *build* de desenvolvimento funcional, o foco deve ser o **Refinamento de Design** para o "efeito cinema" (Ação 2 do nosso estudo de produto).

**Ação:** Implementar animações mais fluidas e personalizadas (usando `react-native-reanimated`) nas transições de tela e modais.

---
*Plano de Ação compilado por Manus AI.*
