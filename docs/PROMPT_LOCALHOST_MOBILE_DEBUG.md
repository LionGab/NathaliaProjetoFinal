# Prompt para Debug Mobile no Localhost

## 🎯 Prompt Completo

```
Você está debugando o app Nossa Maternidade, um app React Native/Expo mobile para iOS e Android.

CONTEXTO DO APP:
- Framework: Expo SDK 54+ (React Native 0.81+)
- Plataformas: iOS e Android (mobile-first)
- Stack: TypeScript, NativeWind (Tailwind), Zustand, Supabase
- Dev Server: Expo Web rodando em http://localhost:8081

INSTRUÇÕES:
1. Navegue para http://localhost:8081 usando o Cursor IDE Browser MCP
2. Capture um snapshot completo da página usando browser_snapshot
3. Verifique TODOS os erros no console usando browser_console_messages
4. Analise network requests usando browser_network_requests para identificar falhas de API
5. Identifique problemas específicos de mobile:
   - Componentes que não renderizam corretamente em mobile
   - Erros de SafeArea (iOS notch/Android status bar)
   - Problemas de touch targets (menores que 44pt)
   - Erros de NativeWind/Tailwind não aplicados
   - Componentes nativos (Camera, LinearGradient) com problemas
   - Erros de navegação (React Navigation)
   - Problemas de estado (Zustand stores)

ERROS ESPECÍFICOS PARA VERIFICAR:
- ❌ "View config not found" (componente nativo não registrado)
- ❌ "Invariant Violation" (erro de renderização)
- ❌ "Warning: Failed prop type" (props inválidas)
- ❌ "Network request failed" (API/Supabase offline)
- ❌ "Cannot read property" (undefined/null)
- ❌ "Style property not supported" (NativeWind)
- ❌ "SafeAreaView" warnings (iOS/Android)
- ❌ "TouchableOpacity" deprecation (deve usar Pressable)
- ❌ "console.log" detectado (deve usar logger)
- ❌ "any" types (TypeScript strict)

DIFERENÇAS iOS vs ANDROID:
- iOS: SafeArea insets (notch), status bar height, gesture navigation
- Android: Status bar height diferente, back button, material design
- Ambos: Touch targets mínimo 44pt (iOS HIG), cores de contraste WCAG AAA

APÓS IDENTIFICAR OS ERROS:
1. Liste TODOS os erros encontrados (console + network + visual)
2. Classifique por severidade: Critical, Warning, Info
3. Indique se o erro é específico de iOS, Android, ou ambos
4. Sugira correções específicas para mobile
5. Verifique se há erros que impedem o app de funcionar em mobile

IMPORTANTE:
- Este é um app MOBILE, não web. Alguns componentes podem não funcionar no Expo Web.
- Foque em erros que afetam a experiência mobile real (iOS/Android devices)
- Erros de "web-only" podem ser ignorados se não afetam mobile
```

## 📋 Versão Resumida (Quick Use)

```
Debug o app Nossa Maternidade (React Native/Expo mobile iOS+Android) em http://localhost:8081:

1. Navegue e capture snapshot
2. Verifique console errors/warnings
3. Analise network requests (falhas de API)
4. Identifique erros específicos de mobile:
   - SafeArea, touch targets <44pt, NativeWind, componentes nativos
   - iOS vs Android differences
5. Liste todos os erros classificados por severidade e plataforma
6. Sugira correções mobile-first

Lembre-se: é um app MOBILE, não web. Foque em erros que afetam iOS/Android devices reais.
```

## 🔍 Versão Detalhada com Checklist

```
Você está debugando o app Nossa Maternidade, um app React Native/Expo mobile para iOS e Android.

CONTEXTO:
- Expo SDK 54+ (React Native 0.81+)
- Mobile-first: iOS e Android
- Stack: TypeScript, NativeWind, Zustand, Supabase
- URL: http://localhost:8081

AÇÃO 1 - NAVEGAÇÃO:
- Use Cursor IDE Browser MCP para navegar em http://localhost:8081
- Capture snapshot completo (browser_snapshot)
- Verifique se a página carregou corretamente

AÇÃO 2 - CONSOLE ERRORS:
- Execute browser_console_messages
- Filtre por: error, warning, exception
- Identifique:
  ✅ "View config not found" → componente nativo não registrado
  ✅ "Invariant Violation" → erro de renderização React
  ✅ "Network request failed" → API/Supabase offline
  ✅ "Cannot read property" → undefined/null access
  ✅ "Style property not supported" → NativeWind não aplicado
  ✅ "console.log" → deve usar logger.ts
  ✅ "any" type → TypeScript strict violation

AÇÃO 3 - NETWORK REQUESTS:
- Execute browser_network_requests
- Verifique:
  ✅ Status 4xx/5xx (API errors)
  ✅ Falhas de conexão Supabase
  ✅ Timeouts
  ✅ CORS errors (se aplicável)

AÇÃO 4 - ERROS ESPECÍFICOS MOBILE:
Verifique se há problemas com:
- ✅ SafeAreaView: insets incorretos (iOS notch/Android status bar)
- ✅ Touch targets: elementos < 44pt (iOS HIG violation)
- ✅ Componentes nativos: Camera, LinearGradient, AnimatedView
- ✅ NativeWind: classes Tailwind não aplicadas
- ✅ Navegação: React Navigation errors
- ✅ Estado: Zustand stores não inicializados
- ✅ Permissões: Camera, Notifications (mobile-only)

AÇÃO 5 - PLATAFORMA ESPECÍFICA:
- iOS: SafeArea insets, status bar, gesture navigation
- Android: Status bar height, back button, material design
- Ambos: Touch targets 44pt+, contraste WCAG AAA

AÇÃO 6 - RELATÓRIO:
Crie um relatório estruturado:
1. Erros Críticos (impedem funcionamento)
2. Warnings (podem causar problemas)
3. Info (melhorias sugeridas)
4. Plataforma afetada (iOS/Android/Ambos)
5. Sugestões de correção mobile-first

IMPORTANTE:
- App MOBILE, não web
- Alguns componentes podem não funcionar no Expo Web
- Foque em erros que afetam devices iOS/Android reais
```

## 🚀 Exemplo de Uso Prático

### Cenário 1: Debug Inicial

```
Debug o app Nossa Maternidade (React Native/Expo mobile iOS+Android) em http://localhost:8081.
Navegue, capture snapshot, verifique console errors, network requests, e identifique problemas
específicos de mobile (SafeArea, touch targets, componentes nativos). Liste todos os erros
classificados por severidade e plataforma (iOS/Android). Lembre-se: é um app MOBILE, não web.
```

### Cenário 2: Debug Focado em Erros

```
O app Nossa Maternidade está com problemas. Navegue em http://localhost:8081, verifique console
errors e network requests. Identifique erros críticos que impedem o funcionamento em iOS/Android.
Foque em: componentes nativos não registrados, erros de SafeArea, touch targets <44pt, e falhas
de API/Supabase. Classifique por severidade e sugira correções mobile-first.
```

### Cenário 3: Validação de Qualidade

```
Valide a qualidade do app Nossa Maternidade (React Native/Expo mobile) em http://localhost:8081.
Verifique: console errors, network requests, problemas de acessibilidade (touch targets 44pt+),
SafeArea correto, NativeWind aplicado, e erros TypeScript. Liste violações de iOS HIG e WCAG AAA.
Classifique por plataforma (iOS/Android/Ambos).
```

## 📝 Checklist de Erros Mobile

Use este checklist ao analisar:

### Console Errors

- [ ] "View config not found" (componente nativo)
- [ ] "Invariant Violation" (renderização)
- [ ] "Network request failed" (API)
- [ ] "Cannot read property" (undefined)
- [ ] "Style property not supported" (NativeWind)
- [ ] "console.log" detectado
- [ ] "any" types (TypeScript)

### Mobile-Specific

- [ ] SafeArea insets incorretos
- [ ] Touch targets < 44pt
- [ ] Componentes nativos com problemas
- [ ] NativeWind não aplicado
- [ ] Navegação com erros
- [ ] Estado não inicializado
- [ ] Permissões não solicitadas

### Platform-Specific

- [ ] iOS: SafeArea, status bar, gestures
- [ ] Android: Status bar, back button, material
- [ ] Ambos: Touch targets, contraste

### Network

- [ ] Status 4xx/5xx
- [ ] Falhas Supabase
- [ ] Timeouts
- [ ] CORS errors

## 💡 Dicas de Uso

1. **Sempre mencione que é mobile** - ajuda o Claude focar nos erros certos
2. **Especifique iOS/Android** - alguns erros são platform-specific
3. **Peça classificação por severidade** - prioriza correções
4. **Solicite sugestões mobile-first** - garante correções adequadas

## 🔗 Integração com Quality Gate

Após identificar erros, você pode executar:

```bash
npm run quality-gate  # Verifica TypeScript, ESLint, console.log
```

Isso valida os erros encontrados e garante que não há novos problemas.
