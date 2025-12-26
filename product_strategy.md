# Estudo de Produto e Estratégia de Design: Nossa Maternidade

**Objetivo:** Sintetizar padrões de sucesso de aplicativos de bem-estar feminino (saúde, ciclo, mindfulness) e conectá-los ao público da Nathalia Valente para definir as prioridades de finalização do aplicativo.

---

## 1. Síntese do Público-Alvo (Nathalia Valente)

O público da Nathalia Valente, conforme o dossiê do projeto, é altamente engajado e busca três pilares emocionais principais: **Validação, Comunidade e Transformação** [1].

| Pilar Emocional | Necessidade no App | Implicação de Design/UX |
| :--- | :--- | :--- |
| **Validação** | Permissão para ser imperfeita (maternidade real). | **UX de Registro Simples:** *Check-ins* emocionais rápidos e não-julgadores. Uso de linguagem acolhedora ("É normal se sentir assim"). |
| **Comunidade** | Não se sentir sozinha na jornada. | **Social Feed Otimizado:** Comunidade fluida e responsiva (já usa FlashList). Foco em micro-interações (likes, comentários) e conexões por fase da maternidade. |
| **Transformação** | Maternidade como realização e resgate da identidade. | **Gamificação e Progresso:** Visualização clara de progresso (hábitos, marcos). O *paywall* deve ser o portal para essa transformação. |

O aplicativo deve ser um **refúgio digital** que valida a experiência da mãe, em contraste com a pressão de perfeição das redes sociais.

## 2. Padrões de Design de Sucesso em Apps de Bem-Estar

A análise dos aplicativos de referência (Flo, Clue, Calm, etc.) e as tendências de design para saúde feminina [2] convergem para os seguintes padrões que o projeto *Nossa Maternidade* deve maximizar:

### 2.1. Estética "Clean & Calm" (O Caminho para o "Design de Cinema")

O design de cinema não é sobre complexidade, mas sobre **fluidez e clareza**.

*   **Paleta de Cores:** O projeto já adotou o **Azul Pastel (Primary)** e **Rosa Claro (Accent)**. Essa combinação é ideal, pois o azul transmite confiança e calma (padrão Calm/Meditopia), enquanto o rosa mantém a feminilidade e o calor (padrão Flo/Clue).
    *   **Recomendação:** Usar o **branco/off-white** como cor de fundo dominante (o `background.primary` já é um azul muito claro, o que é excelente) e reservar as cores vibrantes (o `accent` mais forte) **apenas para CTAs (Call to Action) e elementos de destaque** que levam à monetização.
*   **Tipografia e Hierarquia:** O uso da fonte **Manrope** e a definição de classes tipográficas (Hero, H1, Body) no `tailwind.config.js` são de nível profissional.
    *   **Recomendação:** Garantir que o **espaçamento vertical** (leading/line-height) seja generoso, especialmente em blocos de texto longos, para reduzir a fadiga visual (padrão Calm).
*   **Efeitos Premium:** O projeto já implementou utilitários para **Glassmorphism** e **Soft Shadows**.
    *   **Recomendação:** Aplicar o **Glassmorphism** (fundo desfocado e translúcido) em elementos modais e *bottom sheets* (como o `NewPostModal` ou o `Paywall`) para criar uma sensação de profundidade e sofisticação, simulando o iOS nativo.

### 2.2. Fluidez e Micro-interações (O Fator "Altamente Funcional")

A funcionalidade é percebida através da velocidade e da resposta tátil.

*   **Animações (Reanimated):** A prioridade deve ser a **Ação 2** do relatório anterior. As transições entre telas e a abertura de modais devem ser suaves e rápidas.
    *   **Exemplo:** A transição para o `PostDetailScreen` ou o `Paywall` deve usar *shared element transitions* (se possível) ou animações de *slide* e *fade* personalizadas, mais orgânicas do que o padrão do React Navigation.
*   **Haptics:** O projeto já usa `expo-haptics` (visto no `useCommunity.ts`).
    *   **Recomendação:** Usar *haptics* leves (`ImpactFeedbackStyle.Light`) em todos os toques de confirmação (like, check-in diário, conclusão de hábito) para reforçar a sensação de resposta e qualidade.

## 3. Estratégia de Monetização e Funcionalidades

O modelo de assinatura de **R$ 14,90/mês** é um ponto de entrada forte. Para justificar a conversão, o *paywall* deve bloquear o acesso a funcionalidades que entregam **Transformação e Acesso Íntimo**.

| Funcionalidade (Já Existente) | Valor para o Usuário | Monetização (Paywall) |
| :--- | :--- | :--- |
| **NathIA (AI Chat)** | Acesso a conselhos 24/7, sem julgamento. | **SIM:** Acesso ilimitado à IA (visto no `app.config.js` que a chave é segura via Edge Function). |
| **Mundo da Nath** | Conteúdo exclusivo e acesso íntimo à influenciadora. | **SIM:** Conteúdo exclusivo (vídeos, áudios, *lives*). |
| **Hábitos e Progresso** | Ferramentas para resgatar a identidade (Transformação). | **SIM:** Acesso a *dashboards* avançados, relatórios de progresso e gamificação (níveis, badges). |
| **Comunidade** | Validação e Apoio Mútuo. | **NÃO:** Acesso básico à comunidade deve ser **GRATUITO** para gerar engajamento e *network effect*. |

**Recomendação de Prioridade:**

A **Ação 3 (Testar Compra In-App)** é a mais importante para a estratégia de monetização. Se o *paywall* não funcionar perfeitamente, todo o esforço de design e funcionalidade será perdido.

---

## 4. Próximos Passos Focados na Execução

Com base na análise técnica e de produto, o caminho mais assertivo é:

1.  **Ação 1 (Técnica Crítica):** **Configurar Variáveis de Ambiente (Secrets) no EAS.** (Sem isso, o app não funciona em produção).
2.  **Ação 3 (Monetização Crítica):** **Testar Compra In-App (RevenueCat)** em um *build* de desenvolvimento.
3.  **Ação 2 (Design de Cinema):** **Refinar Animações de Transição** (Reanimated).

**Qual dessas três ações você gostaria de priorizar agora?** Se você puder confirmar que as variáveis de ambiente do Supabase já estão configuradas no EAS, podemos ir direto para a **Ação 3 (Teste de Compra)** ou a **Ação 2 (Design)**.
