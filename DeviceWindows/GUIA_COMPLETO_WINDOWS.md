# 🪟 Guia Completo - Nossa Maternidade (Windows Device)

**Data de Criação**: 2025-01-17  
**Propósito**: Documentação completa para continuidade do desenvolvimento no Windows  
**Status**: ✅ Documento de referência completo

---

## 📋 Índice

1. [Visão Geral do Projeto](#visão-geral)
2. [Stack Tecnológica](#stack-tecnológica)
3. [Decisões Técnicas Críticas](#decisões-técnicas-críticas)
4. [Setup e Configuração](#setup-e-configuração)
5. [Workflows e Comandos](#workflows-e-comandos)
6. [Arquitetura e Estrutura](#arquitetura-e-estrutura)
7. [Problemas Resolvidos](#problemas-resolvidos)
8. [Próximos Passos](#próximos-passos)
9. [Referências Rápidas](#referências-rápidas)

---

## 🎯 Visão Geral do Projeto

**Nossa Maternidade** é um aplicativo iOS-first de saúde materna para gestantes e mães no Brasil, criado por Nathália Valente. O app utiliza:

- **React Native + Expo SDK 54+** (managed workflow)
- **TypeScript 5.7+** (strict mode)
- **Supabase** (auth, database, storage, edge functions)
- **IA Híbrida** (Claude + Gemini via Edge Functions)
- **Design System**: Calm FemTech (Azul + Rosa)

### Características Principais

- ✅ Autenticação OAuth (Google, Apple, Facebook)
- ✅ Onboarding completo (6 etapas + NathIA personalização)
- ✅ Rastreamento de ciclo menstrual
- ✅ Chat com IA (NathIA) - Assistente de saúde materna
- ✅ Comunidade (posts, comentários, grupos)
- ✅ Hábitos e check-ins diários
- ✅ Afirmações personalizadas
- ✅ Plataforma Premium (RevenueCat)

---

## 🛠️ Stack Tecnológica

### Core

- **React Native**: 0.81+
- **Expo SDK**: 54+
- **TypeScript**: 5.7+ (strict mode)
- **Node.js**: v22.x ou compatível

### UI & Styling

- **NativeWind 4+** (Tailwind para React Native)
- **React Navigation 7** (Stack + Bottom Tabs)
- **Ionicons** (@expo/vector-icons)
- **Zeego** (context menus)

### State Management

- **Zustand** (stores centralizados em `src/state/store.ts`)
- **AsyncStorage** (persistência)

### Backend & Services

- **Supabase**:
  - Auth (OAuth + Email)
  - PostgreSQL (com RLS)
  - Storage (imagens, vídeos)
  - Edge Functions (IA, upload, transcribe, notifications)
- **RevenueCat** (IAP - In-App Purchases)
- **OpenAI/Gemini/Claude** (via Edge Functions)

### Design System

- **Fonte única**: `src/theme/tokens.ts` (Calm FemTech preset)
- **Hook**: `useThemeColors()` para light/dark mode
- **Tokens**: Cores, tipografia, espaçamento (8pt grid)

---

## ⚠️ Decisões Técnicas Críticas

### 1. Segurança - Edge Functions (NUNCA Client-Side)

**❌ REJEITADO**: Client-side Gemini com `EXPO_PUBLIC_GEMINI_API_KEY`

**Razão**:

- API key exposta no bundle JavaScript
- Pode ser extraída via `apktool` em 5 minutos
- Quota pode ser drenada completamente
- Violação LGPD (dados direto para Google)

**✅ MANTIDO**: Supabase Edge Functions com JWT

**Benefícios**:

- API keys no servidor (seguro)
- Rate limiting por `user_id`
- LGPD compliant
- Logs auditáveis
- Autenticação obrigatória

**Arquivo**: `supabase/functions/ai/index.ts`

---

### 2. Arquitetura de IA - Híbrida Claude + Gemini

**Estratégia**:

- **Claude 3.5 Sonnet**: Default (persona brasileira, empatia, tom natural)
- **Gemini 2.5 Flash**: Queries médicas com grounding (Google Search)
- **Fallback automático**: Se um falhar, usa o outro

**Por quê híbrida**:

1. Claude: Superior em persona (tom brasileiro, empatia, "vida real")
2. Gemini: Melhor para grounding médico (Google Search, 1M context)
3. Resiliência: Fallback automático
4. Melhor ferramenta para cada trabalho

**Arquivos**:

- `src/api/chat-service.ts` (client)
- `supabase/functions/ai/index.ts` (server)

---

### 3. Design System - Migração em Andamento

**⚠️ ATENÇÃO**: Migração de design system em progresso

**❌ DEPRECADO**:

- `src/utils/colors.ts` (legado)
- `src/theme/design-system.ts` (legado)

**✅ NOVO (Fonte Única)**:

- `src/theme/tokens.ts` (Calm FemTech preset)

**Regras**:

- **NUNCA** hardcodar cores (`#xxx`, `rgba()`, `'white'`, `'black'`)
- **SEMPRE** usar `Tokens.*` ou `useThemeColors()`
- Overlays: `Tokens.overlay.light/medium/dark/heavy/backdrop`
- Shadows: `Tokens.neutral[900]` como `shadowColor`

**Hook**:

```typescript
import { useThemeColors } from "@/hooks/useTheme";

const colors = useThemeColors(); // Auto-switch light/dark
```

---

### 4. Logging - Centralizado

**❌ PROIBIDO**: `console.log/warn/error`

**✅ OBRIGATÓRIO**: `logger.*` de `src/utils/logger.ts`

**Padrão**:

```typescript
import { logger } from "@/utils/logger";

logger.info("mensagem", "contexto", { metadata });
logger.error("erro", "contexto", { error });
```

**Quality gate falha** se encontrar `console.log`

---

### 5. TypeScript - Strict Mode

**Regras**:

- **Zero `any`** (usar `unknown` + type guards)
- **Sem `@ts-ignore`** ou `@ts-expect-error` sem justificativa explícita
- Type checking obrigatório antes de PR (`npm run typecheck`)

---

## 🚀 Setup e Configuração

### Pré-requisitos Windows

1. **Node.js v22.x**:

   ```powershell
   # Verificar versão
   node --version

   # Se não tiver, baixar de: https://nodejs.org/
   ```

2. **Git**:

   ```powershell
   git --version
   # Configurar mesmo user/email do MacBook
   git config --global user.name "Seu Nome"
   git config --global user.email "seu@email.com"
   ```

3. **Bun** (opcional, mais rápido que npm):
   ```powershell
   # Instalar via PowerShell
   powershell -c "irm bun.sh/install.ps1 | iex"
   ```

### Clonar e Instalar

```powershell
# Clonar repositório
git clone https://github.com/seu-usuario/NossaMaternidade.git
cd NossaMaternidade

# Instalar dependências
npm install
# OU
bun install

# Verificar .env existe
cat .env
# Deve ter: EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY, etc.
```

### Variáveis de Ambiente

**Arquivo**: `.env.local` (não commitado)

**Variáveis obrigatórias**:

```env
# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon

# IA (opcional, Edge Functions usam secrets do Supabase)
EXPO_PUBLIC_OPENAI_API_KEY=opcional
EXPO_PUBLIC_GEMINI_API_KEY=opcional

# OAuth (configurado no Supabase Dashboard)
# Não precisa aqui, mas redirect URI deve estar configurado
```

**⚠️ NUNCA modificar `.env*` diretamente** - Se precisar nova variável, informar nome + onde é lida + pedir confirmação

### Verificar Setup

```powershell
# Verificar Node.js
node --version  # Deve ser v22.x

# Verificar Git
git config --list | Select-String user

# Verificar .env
npm run check-env

# Verificar TypeScript
npm run typecheck
```

---

## 📝 Workflows e Comandos

### Desenvolvimento

```powershell
# Iniciar Expo dev server
npm start
# OU
bun start

# Limpar cache e iniciar
npm start:clear

# Rodar no iOS (requer Mac + Xcode)
npm run ios

# Rodar no Android (requer Android Studio + emulador)
npm run android

# Rodar no Web
npm run web
```

### Quality Gate (OBRIGATÓRIO antes de PR)

```powershell
# Quality gate completo (4 checks)
npm run quality-gate

# Checks individuais
npm run typecheck    # TypeScript
npm run lint         # ESLint
npm run lint:fix     # Auto-fix ESLint
npm run format       # Prettier
npm run check-build-ready  # Build readiness
```

### Testes

```powershell
npm test              # Jest
npm test:watch        # Watch mode
npm test:coverage     # Coverage report
```

### Limpeza

```powershell
npm run clean         # Cache (Metro, Expo, temp)
npm run clean:all     # Nuclear (inclui node_modules)
```

### EAS Build (Produção)

```powershell
# Build iOS
npm run eas:build:ios

# Build Android
npm run eas:build:android

# Listar builds
npm run eas:build:list
```

---

## 🏗️ Arquitetura e Estrutura

### Estrutura de Pastas

```
src/
├── api/              # Serviços externos (OpenAI, Supabase, etc.)
├── components/       # Componentes reutilizáveis
│   ├── ui/          # Componentes base (atoms)
│   └── ...          # Componentes de features
├── screens/          # Telas completas
├── navigation/       # RootNavigator, MainTabNavigator
├── state/            # Zustand stores (store.ts)
├── types/            # TypeScript definitions
├── theme/            # Design tokens (tokens.ts)
├── hooks/            # Custom hooks
└── utils/            # Helpers (logger, cn, colors, etc.)

supabase/
├── functions/        # Edge Functions
│   ├── ai/          # Chat IA (Claude/Gemini)
│   ├── transcribe/  # Audio transcription
│   ├── upload-image/# Image upload
│   └── notifications/# Push notifications
└── migrations/       # SQL migrations

assets/
├── onboarding/      # Imagens e vídeos do onboarding
└── ...             # Outros assets
```

### Navegação

**RootNavigator** (5-stage auth flow):

1. `LoginScreen` (se `!isAuthenticated`)
2. `NotificationPermissionScreen` (se `!notificationSetupDone`)
3. `OnboardingScreen` (6 steps)
4. `NathIAOnboardingScreen` (5 steps)
5. `MainTabs` (Bottom Tab Navigator)

**MainTabs**:

- `Home` → `HomeScreen`
- `Ciclo` → `CycleTrackerScreen`
- `NathIA` → `AssistantScreen` (chat IA)
- `Comunidade` → `CommunityScreen`
- `Meus Cuidados` → `MyCareScreen`

### State Management (Zustand)

**Stores centralizados** em `src/state/store.ts`:

| Store                  | Persistido | Propósito                             |
| ---------------------- | ---------- | ------------------------------------- |
| `useAppStore`          | Sim        | User profile, onboarding state        |
| `useCommunityStore`    | Não        | Posts, groups (sempre fresh da API)   |
| `useChatStore`         | Sim        | Histórico de conversa IA              |
| `useCycleStore`        | Sim        | Rastreamento menstrual, daily logs    |
| `useAffirmationsStore` | Sim        | Afirmações favoritas, seleção diária  |
| `useHabitsStore`       | Sim        | 8 hábitos de bem-estar, streaks       |
| `useCheckInStore`      | Sim        | Check-ins diários (mood/energy/sleep) |

**⚠️ Padrão de Selector** (evitar loops infinitos):

```typescript
// ✅ BOM: Selectors individuais
const user = useAppStore((s) => s.user);
const setUser = useAppStore((s) => s.setUser);

// ❌ RUIM: Objeto cria nova ref a cada render
const { user, setUser } = useAppStore((s) => ({
  user: s.user,
  setUser: s.setUser,
}));
```

---

## 🔧 Problemas Resolvidos

### 1. Erro 400 - OAuth Supabase

**Problema**: Erro 400 Bad Request ao fazer login com Google/Apple/Facebook

**Causa**: Redirect URI não autorizado no Supabase Dashboard

**Solução**:

1. Removido `queryParams` do Google OAuth (conflito com PKCE)
2. Adicionado tratamento específico de erro 400
3. **AÇÃO NECESSÁRIA**: Configurar redirect URI no Supabase Dashboard:
   - Authentication → URL Configuration → Additional Redirect URLs
   - Adicionar: `nossamaternidade://auth-callback`

**Arquivo**: `src/api/social-auth.ts`  
**Documentação**: `docs/ERRO_400_FIX.md`

---

### 2. Uso Excessivo de Memória no Cursor (5GB)

**Problema**: Cursor indexando arquivos pesados (vídeos, builds, node_modules)

**Solução**: Criado `.cursorignore` para excluir:

- `node_modules/` (1.3GB)
- `ios/build/` (702MB)
- `assets/onboarding/videos/*.mp4` (124MB)
- `.expo/`, cache, temporários

**Arquivo**: `.cursorignore` (raiz do projeto)

**Resultado esperado**: Redução significativa no uso de memória

---

### 3. Download de Reels do Instagram

**Problema**: Instagram bloqueia downloads automáticos sem autenticação

**Solução**:

- Scripts criados: `scripts/download-reels.js`, `scripts/download-top-reels.js`
- Reels baixados: 9 vídeos (~105 MB) em `assets/onboarding/videos/`
- Documentação: `docs/REELS_DOWNLOADED.md`

**Ferramenta**: `yt-dlp` (instalado via Homebrew no Mac)

---

## 📋 Próximos Passos

### NathIA v2 (Em Progresso)

**Status**: Phase 1 Task 1/7 completada (14%)

**Próximas tarefas**:

1. ✅ **Task 1**: Pre-Classifier criado (`src/ai/policies/nathia.preClassifier.ts`)
2. ⏸️ **Task 2**: Response Canonicalizer (próximo)
3. **Task 3**: Unit tests para policies
4. **Task 4**: Novo prompt v2 (146 linhas)
5. **Task 5**: Prompt emocional v2 (mood-based)
6. **Task 6**: Atualizar `src/config/nathia.ts`
7. **Task 7**: Integrar em `AssistantScreen.tsx`

**Documentação**: `docs/NATHIA_V2_PROGRESS.md`

---

### Plataforma Premium (Roadmap)

**Fase 1: Foundation** (Semana 1)

- [ ] Remote Config / Kill Switch
- [ ] Cloud Sync - Ciclo (bidirecional, offline-first)
- [ ] Cloud Sync - Habits & Check-ins
- [ ] LGPD UI em Settings

**Fase 2: Business & Premium** (Semana 2)

- [ ] `usePremiumStatus()` hook + realtime subscription
- [ ] Feature gating (IA limite, community, exports)
- [ ] RevenueCat SDK + Paywall integration
- [ ] Rate limiting diferenciado FREE/PRO

**Fase 3: Intelligence & Quality** (Semana 3)

- [ ] Guardian Agent - Bloqueio UI + recursos de crise
- [ ] CI/CD Pipeline (GitHub Actions)
- [ ] Testes unitários (ciclo, premium, IA)
- [ ] Testes E2E (Maestro)

**Fase 4: Polish & Launch** (Semana 4)

- [ ] A11Y Audit + Fixes
- [ ] RAG Setup (pgvector + embeddings)
- [ ] Refactor AssistantScreen (1085 LOC → componentes)
- [ ] Documentação final + App Store checklist

**Documentação**: `docs/PLATAFORMA_PREMIUM_AUDIT.md`, `docs/RELATORIO_AUDITORIA_360.md`

---

## 📚 Referências Rápidas

### Arquivos Críticos

| Arquivo                          | Propósito                                |
| -------------------------------- | ---------------------------------------- |
| `CLAUDE.md`                      | Regras críticas + comandos + arquitetura |
| `src/theme/tokens.ts`            | Design Tokens (fonte única)              |
| `src/utils/logger.ts`            | Sistema de logging centralizado          |
| `src/state/store.ts`             | Todos os stores Zustand                  |
| `src/api/chat-service.ts`        | Serviço de chat IA                       |
| `supabase/functions/ai/index.ts` | Edge Function IA (server)                |

### Documentação Importante

- `docs/ERRO_400_FIX.md` - Correção OAuth
- `docs/REELS_DOWNLOADED.md` - Reels baixados
- `docs/NATHIA_V2_PROGRESS.md` - Progresso NathIA v2
- `docs/PLATAFORMA_PREMIUM_AUDIT.md` - Auditoria Premium
- `docs/RELATORIO_AUDITORIA_360.md` - Auditoria completa
- `docs/DESIGN_SYSTEM_CALM_FEMTECH.md` - Design System
- `docs/SAFE_AREA_MIGRATION.md` - Safe Area handling

### Comandos Essenciais

```powershell
# Setup inicial
npm install
npm run check-env

# Desenvolvimento
npm start
npm run ios          # Mac apenas
npm run android      # Windows OK

# Quality Gate (antes de PR)
npm run quality-gate

# Limpeza
npm run clean
```

### Checklist Antes de PR

- [ ] `npm run quality-gate` passou
- [ ] Sem `console.log` (usar `logger.*`)
- [ ] Sem cores hardcoded (usar `Tokens.*`)
- [ ] TypeScript strict (sem `any`, sem `@ts-ignore`)
- [ ] Testes passando (se houver)
- [ ] Acessibilidade (WCAG AAA, tap targets 44pt+)

---

## 🎯 Dicas para Windows

### Diferenças Mac vs Windows

1. **iOS Build**: Requer Mac + Xcode (não funciona no Windows)
   - Use EAS Build para builds iOS no Windows
   - Ou desenvolva apenas Android/Web no Windows

2. **Scripts `.sh`**: Não funcionam nativamente no Windows
   - Use Git Bash ou WSL
   - Ou use scripts PowerShell (`.ps1`) equivalentes

3. **Path separators**: Windows usa `\`, Unix usa `/`
   - Node.js/Expo normaliza automaticamente
   - Mas cuidado em scripts customizados

### Ferramentas Recomendadas

- **Git Bash**: Para scripts `.sh`
- **Windows Terminal**: Terminal moderno
- **VS Code**: Editor recomendado (com extensões React Native)
- **Android Studio**: Para emulador Android

---

## 📞 Suporte

**Desenvolvedor**: Lion  
**Email**: eugabrielmktd@gmail.com

**Documentação Principal**: `CLAUDE.md` (raiz do projeto)

---

**Última atualização**: 2025-01-17  
**Versão**: 1.0.0  
**Status**: ✅ Completo e pronto para uso
