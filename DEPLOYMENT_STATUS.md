# 📱 Status de Deploy - Nossa Maternidade

**Última atualização:** 20 de dezembro de 2025  
**Versão do App:** 1.0.0  
**Plataformas:** iOS (App Store) e Android (Google Play Store)

---

## 📊 Resumo Executivo

| Categoria | iOS (App Store) | Android (Google Play) |
|-----------|-----------------|----------------------|
| **Configuração Técnica** | ✅ 100% | ✅ 100% |
| **Build Configuration** | ✅ Pronto | ✅ Pronto |
| **Assets (Ícones/Splash)** | ✅ Completo | ✅ Completo |
| **Screenshots** | ⏳ Pendente | ⏳ Pendente |
| **Metadata da Loja** | ⏳ Pendente | ⏳ Pendente |
| **Conformidade Legal** | ⚠️ Parcial | ⚠️ Parcial |
| **Testes em Dispositivo** | ⏳ Pendente | ⏳ Pendente |
| **Build de Produção** | ⏳ Não iniciado | ⏳ Não iniciado |
| **Submissão** | ⏳ Não iniciado | ⏳ Não iniciado |

**Status Geral:** 🟡 **Em Preparação** (~60% completo)

---

## ✅ Etapas Concluídas

### 1. Configuração Técnica (100%)

- [x] **Bundle IDs configurados:**
  - iOS: `com.nossamaternidade.app`
  - Android: `com.nossamaternidade.app`
  
- [x] **`app.json` e `app.config.js` configurados:**
  - Versão: 1.0.0
  - Build Number (iOS): 1
  - Version Code (Android): 1
  - Target SDK Android: 35 (Android 14+)
  - Min SDK Android: 24 (Android 7.0 - 95%+ cobertura)
  
- [x] **Privacy Manifest iOS 17+ configurado:**
  - NSPrivacyAccessedAPIType: UserDefaults (CA92.1)
  - Compliance com App Tracking Transparency
  
- [x] **Permissões configuradas:**
  - Câmera, Microfone, Galeria de Fotos
  - Localização, Notificações Push
  - Acesso à Internet

- [x] **EAS Build (`eas.json`) configurado:**
  - Perfil `development` para desenvolvimento
  - Perfil `preview` para testes internos
  - Perfil `staging` para homologação
  - Perfil `production` para produção
  - Auto-increment de versões habilitado

### 2. Assets Visuais (80%)

- [x] **App Icon:** `assets/icon.png` (1024×1024px)
- [x] **Splash Screen:** `assets/splash.png`
- [x] **Adaptive Icon Android:** `assets/adaptive-icon.png`
- [x] **Notification Icon:** `assets/notification-icon.png`
- [ ] **Screenshots iOS** (pendente)
- [ ] **Screenshots Android** (pendente)
- [ ] **Feature Graphic Android** (pendente - 1024×500px)

### 3. Código e Qualidade (95%)

- [x] **TypeScript:** 0 erros (`npm run typecheck`)
- [x] **ESLint:** 0 erros críticos (`npm run lint`)
- [x] **Dead code removido:** -698 linhas (OnboardingScreen.tsx deletado)
- [x] **Error Boundary global implementado**
- [x] **Logger centralizado** (substitui console.log)
- [x] **Acessibilidade básica:** accessibilityLabel/Role em componentes principais
- [x] **Touch targets:** Mínimo 44pt (Apple HIG)
- [x] **Dark mode:** Automático (userInterfaceStyle: "automatic")

### 4. Infraestrutura Backend

- [x] **Supabase configurado:**
  - Autenticação (Email, Apple Sign-In)
  - Edge Functions deployadas (ai, notifications, transcribe, etc.)
  - RLS (Row Level Security) configurado
  
- [x] **APIs de IA integradas:**
  - OpenAI (GPT-4o)
  - Grok (xAI)
  - Transcription (gpt-4o-transcribe)

### 5. Documentação de Deploy

- [x] `DEPLOY_STORES.md` - Guia completo
- [x] `docs/PASSO_A_PASSO_DEPLOY.md` - Tutorial detalhado
- [x] `docs/DEPLOYMENT_CHECKLIST.md` - Checklist completo
- [x] `docs/QUICK_START_DEPLOY.md` - Guia rápido
- [x] `docs/SECRETS_SETUP.md` - Configuração de secrets

---

## ⏳ Etapas Pendentes

### 1. Contas nas Lojas (Bloqueante)

| Conta | Custo | Status | Ação Necessária |
|-------|-------|--------|-----------------|
| Apple Developer | $99/ano | ⏳ Pendente | Criar em [developer.apple.com](https://developer.apple.com) |
| Google Play Console | $25 único | ⏳ Pendente | Criar em [play.google.com/console](https://play.google.com/console) |
| EAS Account | Gratuito | ✅ Configurado | `eas whoami` para verificar |

### 2. Secrets no EAS (Bloqueante para Build)

```bash
# Secrets obrigatórios a configurar:
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "..."
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "..."
eas secret:create --scope project --name EXPO_PUBLIC_OPENAI_API_KEY --value "..."
eas secret:create --scope project --name EXPO_PUBLIC_GROK_API_KEY --value "..."
eas secret:create --scope project --name EXPO_PUBLIC_ENABLE_AI_FEATURES --value "true"
```

**Verificar:** `eas secret:list`

### 3. Screenshots (Bloqueante para Submissão)

#### iOS (App Store Connect)
| Tamanho | Dispositivo | Quantidade | Status |
|---------|-------------|------------|--------|
| 1290×2796px | iPhone 6.7" | Mínimo 3 | ⏳ Pendente |
| 1284×2778px | iPhone 6.5" | Mínimo 3 | ⏳ Pendente |
| 1242×2208px | iPhone 5.5" | Mínimo 3 | ⏳ Pendente |

#### Android (Google Play Console)
| Tamanho | Tipo | Quantidade | Status |
|---------|------|------------|--------|
| 1080×1920px | Phone | Mínimo 2 | ⏳ Pendente |
| 1024×500px | Feature Graphic | 1 | ⏳ Pendente |

**Telas sugeridas para screenshots:**
1. Onboarding/Welcome
2. Home/Feed principal
3. Chat com NathIA
4. Comunidade Mães Valente
5. Hábitos/Tracking

### 4. Configuração das Lojas (Bloqueante)

#### App Store Connect
- [ ] Criar app no App Store Connect
- [ ] Preencher metadata (nome, descrição, keywords)
- [ ] Configurar classificação etária (17+ recomendado)
- [ ] Adicionar screenshots
- [ ] Configurar preço (Gratuito)
- [ ] URL da Privacy Policy
- [ ] URL de Suporte

#### Google Play Console
- [ ] Criar app no Play Console
- [ ] Preencher listagem da loja
- [ ] Adicionar Feature Graphic
- [ ] Adicionar screenshots
- [ ] Preencher Data Safety
- [ ] Configurar classificação de conteúdo (IARC)
- [ ] URL da Privacy Policy

### 5. Conformidade Legal (Parcialmente Bloqueante)

| Item | Status | Ação |
|------|--------|------|
| Privacy Policy | ⚠️ URL definida, página pendente | Hospedar em nossamaternidade.com.br/privacy |
| Terms of Service | ⚠️ URL definida, página pendente | Hospedar em nossamaternidade.com.br/terms |
| AI Disclaimer | ⚠️ URL definida, página pendente | Hospedar em nossamaternidade.com.br/ai-disclaimer |
| LGPD Compliance | ⚠️ Parcial | Revisar consentimento granular |
| Disclaimer Médico | ✅ Implementado no app | Visível em respostas da IA |

### 6. Testes em Dispositivos

- [ ] Testar em iPhone físico (iOS 17+)
- [ ] Testar em Android físico (Android 10+)
- [ ] Testar notificações push
- [ ] Testar todas as permissões
- [ ] Testar VoiceOver (iOS)
- [ ] Testar TalkBack (Android)
- [ ] Testar modo offline
- [ ] Testar performance de inicialização (< 3s)

---

## 📅 Timeline Estimada

| Fase | Duração | Datas Estimadas |
|------|---------|-----------------|
| **Fase 1:** Contas e Secrets | 1-2 dias | 21-22 Dez 2025 |
| **Fase 2:** Screenshots e Assets | 1-2 dias | 23-24 Dez 2025 |
| **Fase 3:** Configuração das Lojas | 1 dia | 26 Dez 2025 |
| **Fase 4:** Build de Preview | 1 dia | 27 Dez 2025 |
| **Fase 5:** Testes em Dispositivos | 2-3 dias | 28-30 Dez 2025 |
| **Fase 6:** Build de Produção | 1 dia | 31 Dez 2025 |
| **Fase 7:** Submissão | 1 dia | 1 Jan 2026 |
| **Fase 8:** Review das Lojas | 1-7 dias | 2-8 Jan 2026 |

**Previsão de Publicação:** 🎯 **Segunda semana de Janeiro de 2026**

> **Nota:** O período de festas (Natal/Ano Novo) pode afetar tempos de review das lojas.

---

## ⚠️ Desafios Potenciais

### 1. Review da App Store (Alto Risco)
- **Classificação 17+:** Apps de saúde materna podem exigir justificativas
- **AI Disclaimer:** Apple pode solicitar disclaimers adicionais sobre IA
- **Privacy:** Coleta de dados de saúde requer compliance rigoroso
- **Mitigation:** Disclaimers claros, Privacy Policy detalhada

### 2. Data Safety do Google Play (Médio Risco)
- **Dados de Saúde:** Categorização especial no Data Safety
- **Compartilhamento de dados:** Transparência sobre APIs externas
- **Mitigation:** Preencher Data Safety com precisão

### 3. Hospedagem de Documentos Legais (Bloqueante)
- **URLs definidas mas páginas não hospedadas:**
  - nossamaternidade.com.br/privacy
  - nossamaternidade.com.br/terms
  - nossamaternidade.com.br/ai-disclaimer
- **Mitigation:** Hospedar antes da submissão

### 4. Custos de APIs em Produção
- **OpenAI/Grok:** Custos podem escalar com uso
- **Mitigation:** Implementar rate limiting, caching

### 5. Período de Festas
- **Impacto:** Times de review reduzidos durante festas
- **Mitigation:** Submeter antes de 23/Dez ou após 2/Jan

---

## 🔧 Comandos Rápidos

### Validação Pré-Build
```bash
npm run typecheck    # Verificar TypeScript
npm run lint         # Verificar ESLint
npm run check-build-ready  # Verificar prontidão
```

### Build de Preview (Teste)
```bash
eas build --platform android --profile preview
eas build --platform ios --profile preview
```

### Build de Produção
```bash
eas build --platform ios --profile production
eas build --platform android --profile production
```

### Submissão
```bash
eas submit --platform ios
eas submit --platform android
```

---

## 📚 Documentação Relacionada

| Documento | Descrição |
|-----------|-----------|
| [DEPLOY_STORES.md](./DEPLOY_STORES.md) | Guia de referência |
| [docs/PASSO_A_PASSO_DEPLOY.md](./docs/PASSO_A_PASSO_DEPLOY.md) | Tutorial completo |
| [docs/DEPLOYMENT_CHECKLIST.md](./docs/DEPLOYMENT_CHECKLIST.md) | Checklist |
| [docs/SECRETS_SETUP.md](./docs/SECRETS_SETUP.md) | Configuração de secrets |
| [eas.json](./eas.json) | Configuração EAS Build |

---

## 📞 Próximos Passos Imediatos

1. **Criar conta Apple Developer** ($99/ano)
2. **Criar conta Google Play Console** ($25 único)
3. **Configurar secrets no EAS** (`eas secret:create`)
4. **Hospedar Privacy Policy e Terms of Service**
5. **Criar screenshots das 5 principais telas**
6. **Executar build de preview para testes**

---

**Responsável:** Nathalia Valente  
**Última atualização:** 20 de dezembro de 2025
