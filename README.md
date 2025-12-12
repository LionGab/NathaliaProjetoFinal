# Nossa Maternidade

Um aplicativo acolhedor para gravidas e maes no pos-parto, criado por **Nathalia Valente**.

## Sobre o App

Nossa Maternidade e uma comunidade completa para mulheres, oferecendo:
- **Ciclo Menstrual**: Acompanhe seu ciclo, fertilidade e ovulacao com calendario visual
- **Registro Diario**: Registre sintomas, humor, temperatura e metricas de saude
- **Afirmacoes**: Mensagens diarias de positividade no estilo Calm
- **Comunidade Maes Valente**: Conecte-se com outras maes, compartilhe experiencias
- **NathIA**: Assistente de IA personalizada para responder suas duvidas
- **Perfil**: Configuracoes e personalizacao

## Design & Estetica

O app foi cuidadosamente desenhado seguindo as diretrizes da Apple Human Interface Guidelines, inspirado em apps como Flo, Clue e Calm:

### Paleta de Cores
- **Rose** (#E11D48): Cor principal
- **Violet** (#8B5CF6): Ovulacao e fertilidade
- **Purple** (#A78BFA): Janela fertil e afirmacoes
- **Pink** (#F472B6): Fases do ciclo
- **Blush** (#BC8B7B): Tons suaves e naturais
- **Cream** (#FFFCF9): Backgrounds acolhedores

### Micro-interacoes
- Animacoes suaves com react-native-reanimated
- Transicoes fluidas entre telas
- Feedback visual em todas interacoes
- Shadows sutis para profundidade
- Bordas arredondadas generosas

## Estrutura do App

### Navegacao Principal (5 Tabs)

1. **Home** - Tela inicial personalizada:
   - Saudacao baseada no horario do dia
   - Card hero com mensagem inspiradora
   - Acesso rapido (Ciclo, NathIA, Afirmacoes, Calculadora)
   - Carrossel de dicas diarias
   - Preview da comunidade

2. **Ciclo** - Rastreador Menstrual (estilo Flo/Clue):
   - Calendario visual com marcacao de periodo, ovulacao e janela fertil
   - Card de fase atual com dia do ciclo
   - Contagem regressiva para proxima menstruacao
   - Grafico de probabilidade de gravidez
   - Acesso rapido para registro de sintomas e humor

3. **NathIA** - Assistente com IA (estilo ChatGPT/Claude):
   - Chat acolhedor e inteligente
   - Perguntas sugeridas em grid
   - Historico de conversas com sidebar lateral
   - Agrupamento por data (Hoje, Ontem, Ultimos 7 dias)
   - Botao de nova conversa
   - Exclusao de conversas
   - Icone de menu para abrir historico
   - Timestamp em cada mensagem
   - Feedback haptico nas interacoes

4. **Comunidade** - Maes Valente:
   - Feed de posts com sistema de likes e comentarios
   - Grupos tematicos por categoria
   - Busca de posts e grupos
   - Criar novas publicacoes

5. **Meus Cuidados** - Espaco de Acolhimento (REDESENHADO v2):
   - Design focado em calma, acolhimento e zero julgamento
   - Paleta pastel suave: lilas, rosa, azul calmo, sage, pessego
   - Tipografia amigavel com bom contraste e tamanhos adequados
   - Card de afirmacao diaria com mensagens de Nathalia Valente
   - Mensagem de pertencimento: "Voce pertence aqui"
   - Grid de cuidados: Respira comigo, Como voce esta?, Descanso, Conexao
   - Apoio rapido: Ansiedade, Sono do bebe, Amamentacao, Autocuidado
   - Card discreto "Precisa conversar?"
   - Comunidade Maes Valente com contador de maes conectadas
   - Botoes suaves: Afirmacoes (pessego) e Habitos (sage)
   - Footer gentil: "Lembre-se: descansar tambem e cuidar"
   - Espacos generosos entre elementos tocaveis (acessibilidade)
   - Visual autentico e humano, sem "instagram de coach"

### Telas Modais

- **DailyLog** - Check-In Diario:
  - Selecao de humor com 8 emojis em grid responsivo
  - **Slider de intensidade** com emoji arrastavel (0-100%)
    - Largura responsiva: 85% da tela (funciona em todos os tamanhos)
    - Barra de progresso animada com cores dinamicas por humor
    - Feedback haptico em pontos-chave (25%, 50%, 75%, 100%)
    - Visual polido com sombras coloridas
  - Layout responsivo que se adapta a diferentes tamanhos de tela
  - Animacoes suaves com react-native-reanimated
  - Safe area corretamente implementada

- **Affirmations** - Afirmacoes Diarias (estilo Calm):
  - Design imersivo com gradientes tematicos
  - 15 afirmacoes em portugues sobre maternidade e autocuidado
  - 5 temas de cores diferentes (Oceano, Ametista, Floresta, Terra, Cosmos)
  - Sistema de favoritos
  - Compartilhamento de afirmacoes
  - Navegacao entre afirmacoes

- **WeightCalculator** - Calculadora de Peso Ideal na Gravidez

### Estrutura de Arquivos

```
src/
  screens/
    - HomeScreen.tsx
    - CycleTrackerScreen.tsx (NOVO - calendario menstrual)
    - DailyLogScreen.tsx (NOVO - registro de sintomas/humor)
    - AffirmationsScreen.tsx (NOVO - afirmacoes estilo Calm)
    - CommunityScreen.tsx
    - AssistantScreen.tsx
    - ProfileScreen.tsx
    - OnboardingScreen.tsx
    - PostDetailScreen.tsx
    - NewPostScreen.tsx
    - WeightCalculatorScreen.tsx
    - HabitsScreen.tsx
  navigation/
    - RootNavigator.tsx
    - MainTabNavigator.tsx (5 tabs)
  state/
    - store.ts (inclui useCycleStore e useAffirmationsStore)
  types/
    - navigation.ts (inclui CycleLog, DailyLog, Affirmation)
```

## Funcionalidades Principais

### Rastreador de Ciclo Menstrual (NOVO)
- Calendario visual com 6 semanas de visualizacao
- Marcacao automatica de periodo, ovulacao e janela fertil
- Calculo baseado em ciclo de 28 dias (configuravel)
- Card de fase atual com cor dinamica
- Previsao de proxima menstruacao
- Grafico de probabilidade de gravidez
- Legendas visuais para cada tipo de dia

### Registro Diario de Saude (NOVO)
- 8 opcoes de humor com emojis coloridos
- 8 categorias de sintomas comuns
- Rastreamento de secrecao vaginal
- Registro de atividade sexual
- Temperatura basal
- Horas de sono
- Consumo de agua
- Notas pessoais

### Afirmacoes Diarias (NOVO)
- 15 afirmacoes em portugues focadas em maternidade
- Design imersivo com gradientes tematicos
- 5 temas de cores para personalizar
- Sistema de favoritos persistente
- Compartilhamento via Share nativo
- Animacoes suaves de transicao

### Calculadora de Peso Ideal na Gravidez
- Calculo de IMC pre-gravidez
- Faixa de ganho de peso recomendado
- Status visual com cores

### Comunidade Maes Valente
- Feed social com posts
- Sistema de likes e comentarios
- Grupos tematicos

### Onboarding Inteligente
- 9 etapas de perguntas
- Identificacao de padroes
- Barra de progresso

## Tecnologias

- **Expo SDK 53** com React Native 0.76.7
- **TypeScript** para type safety
- **Supabase** para backend
- **NativeWind** (TailwindCSS para React Native)
- **Zustand** para gerenciamento de estado (com persistencia AsyncStorage)
- **React Navigation** (Native Stack, Bottom Tabs)
- **React Native Reanimated v3** para animacoes
- **Expo Linear Gradient** para gradientes visuais

## Stores de Estado

### useCycleStore
- lastPeriodStart: Data da ultima menstruacao
- cycleLength: Duracao do ciclo (padrao 28)
- periodLength: Duracao da menstruacao (padrao 5)
- dailyLogs: Array de registros diarios
- Persistido com AsyncStorage

### useAffirmationsStore
- todayAffirmation: Afirmacao do dia
- favoriteAffirmations: Array de favoritos
- lastShownDate: Controle de afirmacao diaria
- Persistido com AsyncStorage

### useChatStore (ATUALIZADO - estilo ChatGPT/Claude)
- conversations: Array de conversas com historico
- currentConversationId: ID da conversa ativa
- isLoading: Estado de carregamento
- isHistoryOpen: Estado do sidebar de historico
- Funcoes: createConversation, deleteConversation, setCurrentConversation, addMessage
- Agrupamento automatico por data
- Titulo automatico baseado na primeira mensagem
- Persistido com AsyncStorage

### useHabitsStore
- habits: Array de habitos com streak, categoria e status
- weeklyCompletion: Array de completude semanal
- totalStreak: Total de dias consecutivos
- Categorias: self-care, health, mindfulness, connection, growth
- Persistido com AsyncStorage

## Habitos Diarios (ATUALIZADO)

Tela redesenhada com foco em bem-estar feminino e acolhimento:

### Habitos Padrao
1. **Hidratar o corpo** - Beba 2L de agua ao longo do dia
2. **Momento de gratidao** - Escreva 3 coisas pelas quais e grata
3. **Movimento consciente** - 30 minutos de atividade que ama
4. **Autocuidado** - Skincare, cuidados pessoais
5. **Meditacao e respiro** - 10 minutos de paz interior
6. **Sono reparador** - Durma 7-8 horas de qualidade
7. **Conexao amorosa** - Tempo de qualidade com quem ama
8. **Leitura inspiradora** - 15 minutos de leitura

### Recursos
- Citacoes motivacionais de Nathalia Valente
- Progresso visual com barra animada
- Agrupamento por categorias com emojis
- Contador de streak por habito
- Visao semanal de completude
- Feedback haptico ao completar
- Design acolhedor com gradientes suaves

---

## QA Checklist - iOS (15 itens)

### Visual & Layout
- [ ] **Safe Area**: Verificar se todas as telas respeitam safe area (notch, home indicator)
- [ ] **Teclado**: Testar se inputs não ficam obscurecidos quando teclado abre
- [ ] **Scroll**: Verificar se scroll funciona suavemente em todas as listas
- [ ] **Dark Mode**: Testar comportamento em modo escuro do iOS (se aplicável)

### Navegação & UX
- [ ] **Tabs**: Verificar se todos os 5 tabs navegam corretamente
- [ ] **Modals**: Testar abertura/fechamento de modais (DailyCheckIn, History sidebar)
- [ ] **Back Navigation**: Verificar se botões voltar funcionam em todas as telas
- [ ] **Deep Links**: Testar navegação entre telas via links internos

### Funcionalidades Core
- [ ] **Check-in Diário**: Testar fluxo completo (humor → energia → sono → sucesso)
- [ ] **Community Composer**: Testar criação de post com tipos (Dúvida/Desabafo/Vitória/Dica)
- [ ] **NathIA Chat**: Verificar envio de mensagens e histórico de conversas
- [ ] **Persistência**: Verificar se dados salvos persistem após fechar app

### Performance & Polish
- [ ] **Animações**: Verificar se animações rodam a 60fps sem travamentos
- [ ] **Haptics**: Testar feedback tátil em botões e interações
- [ ] **Loading States**: Verificar se estados de loading aparecem corretamente

### Microcopy PT-BR
- [ ] Verificar acentuação correta em todos os textos visíveis
- [ ] Verificar se não há textos em inglês não traduzidos

---

**Desenvolvido para mulheres que buscam acompanhar sua saúde com carinho**
