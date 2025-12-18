# NathIA v2 Implementation Progress

**Project**: Nossa Maternidade - Maternal Health App
**Last Update**: 2025-01-17 23:45 BRT (Windows)
**Next Environment**: MacBook OS
**Status**: Phase 1 Task 1/7 completed (14%)

---

## Quick Resume (TL;DR)

✅ **Completed**: Pre-Classifier com templates de crise (CVV 188, SAMU 192)
⏸️ **Paused**: Após Task 1/7 para switch Windows → MacBook
📋 **Next**: Criar Response Canonicalizer (regex hard blocks)

---

## What Was Created

### Files
- ✅ `src/ai/policies/nathia.preClassifier.ts` (160 lines)
- ✅ `src/ai/policies/` directory
- ✅ `src/ai/prompts/` directory
- ✅ `.claude/plans/refactored-pondering-turing.md` (plan file)

### Code Summary
`nathia.preClassifier.ts` exports:
- `preClassifyMessage(text: string): PreClassifyResult`
- `BlockType = "crisis" | "medical" | "identity" | "none"`
- `CRISIS_KEYWORDS[]` (19 keywords expandidos) → CVV 188 template
- `MEDICAL_KEYWORDS[]` (9 keywords) → Recusa gentil template
- Identity detection → "Sou IA, não a Nathália" template

---

## Technical Decisions (IMPORTANT)

### 1. Security Architecture ⚠️ CRITICAL
- ❌ **REJECTED**: Client-side Gemini with `EXPO_PUBLIC_GEMINI_API_KEY`
  - Reason: API key exposed in JavaScript bundle (can be extracted via apktool)
  - Impact: Quota drain, security breach, LGPD violation
- ✅ **KEPT**: Supabase Edge Functions with JWT authentication
  - API keys stay on server
  - Rate limiting per user_id
  - LGPD compliant
  - Auditable logs

**Why this matters**: The original instructions proposed putting Gemini API key in client code. This was REJECTED because:
1. APK/IPA can be decompiled in 5 minutes
2. API key would be in plain text in JavaScript bundle
3. Attacker could drain your Gemini quota completely
4. No rate limiting per user
5. User data goes directly to Google (LGPD violation)

### 2. Prompt System
- ✅ **APPROVED**: New 146-line prompt (Testemunha Ativa framework)
- Structure: 3-block responses (Validação → Espelho → Escolha)
- Replacing: Current 65-line "amiga virtual" prompt
- File: `src/ai/prompts/nathia.system.v2.ts` (to be created in Phase 2)

**Comparison**:
| Aspect | Current (65 lines) | New (146 lines) | Winner |
|--------|-------------------|-----------------|--------|
| Structure | Informal | 3-blocks (Validação → Espelho → Escolha) | ✅ New |
| Anti-drift | None | Thinking block + Anti-rules | ✅ New |
| Tone | "Amiga virtual" | "Testemunha Ativa" (less dependency) | ✅ New |
| Limits | Generic | Crystal clear ("❌ Never...") | ✅ New |
| Modes | Single | 3 modes (Registro/Ferramentas/Segurança) | ✅ New |

### 3. Provider Strategy
- ✅ **APPROVED**: Hybrid Claude + Gemini router
- Claude: Default (better persona, Brazilian tone, empathy)
- Gemini: Medical queries with grounding (Google Search integration)
- Fallback: If one fails, use the other

**Why hybrid**:
1. ✅ Claude: Superior persona (Brazilian tone, empathy, "vida real")
2. ✅ Gemini: Medical grounding (Google Search, 1M context window)
3. ✅ Automatic fallback (resilience)
4. ✅ Best tool for each job

---

## Progress Tracking

### Phase 1: Policies (Client-side)
- [x] **Task 1**: Create `nathia.preClassifier.ts` ✅ **DONE** (Windows)
- [ ] **Task 2**: Create `nathia.responseCanonicalizer.ts` ⏸️ **NEXT** (MacBook)
- [ ] **Task 3**: Unit tests for policies

### Phase 2: New Prompt
- [ ] **Task 4**: Create `nathia.system.v2.ts` (146 lines)
- [ ] **Task 5**: Create `nathia.emotional.v2.ts` (mood-based)
- [ ] **Task 6**: Update `src/config/nathia.ts` (import v2)

### Phase 3: Client Integration
- [ ] **Task 7**: Modify `AssistantScreen.tsx` (add pre-classifier + canonicalizer)
- [ ] **Task 8**: Update `ai-service.ts` (detect medical queries, add grounding flag)

### Phase 4: Edge Function (Server-side)
- [ ] **Task 9**: Install `@google/generative-ai` in Supabase function
- [ ] **Task 10**: Add router (Claude/Gemini) in `supabase/functions/ai/index.ts`
- [ ] **Task 11**: Configure `GEMINI_API_KEY` env var in Supabase dashboard

### Phase 5: Testing
- [ ] **Task 12**: Test crisis input → CVV 188 template (no LLM call)
- [ ] **Task 13**: Test medical input → Gentle refusal + offer to organize
- [ ] **Task 14**: Test identity → "Sou IA" clarification
- [ ] **Task 15**: Test normal input → 3-block response

### Phase 6: Documentation
- [ ] **Task 16**: Create `docs/NATHIA_V2.md` (complete system doc)
- [ ] **Task 17**: Update `CLAUDE.md` (add NathIA v2 info)

**Overall**: 1/17 tasks completed (6%)

---

## How to Continue on MacBook

### Step 1: Clone and Navigate
```bash
git clone https://github.com/eugabrielmktd/NossaMaternidade.git
cd NossaMaternidade
```

### Step 2: Install Dependencies
```bash
npm install
# or
bun install
```

### Step 3: Read Full Plan
```bash
cat .claude/plans/refactored-pondering-turing.md
```

The plan contains:
- Complete architecture analysis
- Security rationale (why Edge Functions, not client-side Gemini)
- Prompt comparison (65 vs 146 lines)
- Provider strategy (Claude + Gemini hybrid)
- Complete implementation checklist (6 phases)
- Code snippets for all files to create

### Step 4: Continue Task 2 - Create Response Canonicalizer

Create `src/ai/policies/nathia.responseCanonicalizer.ts`:

**Purpose**: Post-process LLM responses to prevent prompt drift and enforce hard limits.

**Specification** (from plan):
```typescript
const HARD_BLOCK_PATTERNS = [
  /\bvoc[eê]\s+tem\s+(depress[aã]o|ansiedade|dpp)\b/i,  // Never diagnose
  /\btome\b/i,                                           // Never prescribe
  /\bvai\s+ficar\s+tudo\s+bem\b/i,                      // Never promise
  /\bgaranto\b/i,                                        // Never guarantee
  /\bfica\s+comigo\b/i,                                  // Never create dependency
  /\bs[oó]\s+eu\s+te\s+entendo\b/i,                     // Never exclusivity
  /\btoda\s+m[aã]e\b/i,                                  // Never compare
  /\bcoitad(a|inha)\b/i,                                 // Never infantilize
  /\bmam[aã]e(zinha)?\b/i,                               // Never infantilize (2)
  /\beu\s+te\s+amo\b/i,                                  // Never fake intimacy
  /\bnormal\s+[eé]\b/i,                                  // Never normalize
];

const FALLBACK_RESPONSE = `Entendi. Isso pesa.

Quer registrar mais 1 detalhe ou fechar por aqui?`;

export function canonicalizeResponse(raw: string): string {
  // 1. Hard blocks (forbidden phrases)
  for (const pattern of HARD_BLOCK_PATTERNS) {
    if (pattern.test(raw)) {
      console.warn("[Canonicalizer] Hard block triggered:", pattern);
      return FALLBACK_RESPONSE;
    }
  }

  // 2. Limit to 7 lines
  const lines = raw.split("\n").filter(l => l.trim()).slice(0, 7);

  // 3. Ensure minimum 2 lines
  if (lines.length < 2) {
    return `Entendi.

${lines[0] || "Registrando o que você disse."}

Quer continuar ou fechar por aqui?`;
  }

  return lines.join("\n");
}
```

**Why it works**:
- ✅ Prevents prompt drift (LLM ignoring instructions over time)
- ✅ Blocks forbidden phrases automatically (compliance)
- ✅ Enforces 3-block format (validation + mirror + choice)
- ✅ Runs client-side (fast, no extra API call)

### Step 5: Update TODO List

After creating canonicalizer, update TODO:
```bash
# Mark Task 2 complete, Task 3 in_progress
```

### Step 6: Run Tests (when Phase 1 complete)

```bash
npm test src/ai/policies/*.test.ts
```

Create tests for:
- Pre-classifier: crisis keywords → CVV 188 template
- Pre-classifier: medical keywords → gentle refusal
- Pre-classifier: identity → "Sou IA"
- Canonicalizer: hard blocks trigger fallback
- Canonicalizer: 7-line limit enforced

---

## Important Files to Review

| File | Purpose | Status |
|------|---------|--------|
| `.claude/plans/refactored-pondering-turing.md` | Complete implementation plan | ✅ Created |
| `src/ai/policies/nathia.preClassifier.ts` | Crisis detection (Task 1) | ✅ Created |
| `src/ai/policies/nathia.responseCanonicalizer.ts` | Response filtering (Task 2) | ⏸️ Next |
| `src/config/nathia.ts` | Current config (317 lines) | 📖 Review |
| `src/api/ai-service.ts` | Current AI service (228 lines) | 📖 Review |
| `src/screens/AssistantScreen.tsx` | Chat UI | 📖 Review |
| `supabase/functions/ai/index.ts` | Edge Function (server) | 📖 Review (Phase 4) |

---

## Current Architecture

```
User → AssistantScreen.tsx
     → useChatStore (Zustand)
     → ai-service.ts (client)
     |  └─ detectMedicalQuestion() [CURRENT - basic]
     |  └─ prepareMessagesForAPI()
     └─ Supabase Edge Function /ai (server) ✅ SECURE
        └─ JWT authentication
        └─ Rate limiting
        └─ Claude API call
```

## New Architecture (After Phase 1-6)

```
User → AssistantScreen.tsx
     → Pre-Classifier (client-side keywords) ⚡ <100ms
     |  ├─ If crisis → CVV 188 template (no LLM) ✅ SAFE
     |  ├─ If medical → MEDICAL_TEMPLATE (no LLM) ✅ SAFE
     |  └─ If identity → IDENTITY_TEMPLATE (no LLM) ✅ SAFE
     |
     └─ ai-service.ts (if not blocked)
        └─ Supabase Edge Function /ai (server) ✅ SECURE
           └─ Router: Claude (default) OR Gemini (medical grounding)
           └─ New system prompt v2 (146 lines)
        |
        └─ Response Canonicalizer (client-side regex) ✅ SAFE
           └─ Hard blocks (forbidden phrases)
           └─ 7-line limit
           └─ 3-block format enforcement
```

**Benefits**:
1. ✅ Crisis responses in <100ms (no LLM latency)
2. ✅ 100% reliable templates (no hallucination)
3. ✅ Compliance enforced programmatically (not just prompt)
4. ✅ Hybrid LLM for best results (Claude persona + Gemini grounding)
5. ✅ Secure (API keys never exposed)

---

## Context for New Environment

### Stack
- **Framework**: Expo SDK 54 (React Native)
- **Language**: TypeScript strict mode
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **State**: Zustand with AsyncStorage persistence
- **Navigation**: Expo Router v4
- **Styling**: Nativewind (Tailwind for RN)

### Project Structure
```
src/
├── ai/                    # ✅ NEW - NathIA v2 system
│   ├── policies/
│   │   ├── nathia.preClassifier.ts       ✅ CREATED
│   │   └── nathia.responseCanonicalizer.ts  ⏸️ NEXT
│   └── prompts/
│       ├── nathia.system.v2.ts           ⏸️ Phase 2
│       └── nathia.emotional.v2.ts        ⏸️ Phase 2
├── api/
│   └── ai-service.ts      # Current AI client (update in Phase 3)
├── config/
│   └── nathia.ts          # Current config (update in Phase 2)
└── screens/
    └── AssistantScreen.tsx  # Chat UI (update in Phase 3)

supabase/
└── functions/
    └── ai/
        └── index.ts       # Edge Function (update in Phase 4)
```

### Environment Variables
```bash
# .env (not committed)
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Supabase Dashboard (server-side)
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key (for Claude)
GEMINI_API_KEY=your_gemini_key (add in Phase 4)
```

---

## Warnings for MacBook Environment

### 1. Paths
- **Windows**: `/c/home/NossaMaternidade` (Git Bash POSIX)
- **MacBook**: `~/NossaMaternidade` or `/Users/[username]/NossaMaternidade`
- All paths in code are RELATIVE (`src/ai/policies/...`) - no changes needed

### 2. Shell
- **Windows**: Git Bash (MSYS2)
- **MacBook**: Native Bash/Zsh - no Git Bash needed

### 3. Node.js
- **Windows**: v22.21.0
- **MacBook**: Ensure compatible version (`node --version`)
- If different, use `nvm` to install v22.21.0

### 4. Package Manager
- **Windows**: npm (primary), bun (optional)
- **MacBook**: Can use npm or bun (bun is faster)

### 5. MCP Memory
- May need to configure MCP servers again
- Check: `mcp__memory-keeper__context_status`
- If not accessible, all context is in this file + plan file

### 6. Git
- Verify credentials: `git config --list`
- Should have same user.name and user.email
- SSH keys may need reconfiguration

### 7. API Keys
- `.env` file is NOT committed (gitignored)
- Need to recreate `.env` on MacBook
- Copy from `.env.example`:
  ```bash
  cp .env.example .env
  # Edit .env with your keys
  ```

---

## Testing Checklist (Phase 5)

When ready to test (after Phases 1-4 complete):

### Crisis Detection (Pre-Classifier)
```typescript
// Test input
"Não aguento mais, quero morrer"

// Expected output (no LLM call)
Você está em um momento muito difícil.
Eu não sou serviço de emergência.

LIGUE AGORA:
• CVV: 188 (24h, grátis, confidencial)
• SAMU: 192 (emergência médica)
• Polícia: 190 (violência)

Enquanto liga, tente respirar devagar.
Conte 1-2-3-4 (inspira), segura, 1-2-3-4 (expira).

Você consegue chamar alguém agora (família/amiga)?
```

### Medical Question (Pre-Classifier)
```typescript
// Test input
"Que remédio posso tomar para enjoo?"

// Expected output (no LLM call)
Aí precisa de profissional de saúde.

Eu não posso dar orientação médica, mas posso te ajudar a:
• Organizar sintomas pra contar pro médico
• Preparar perguntas pra consulta

Quer fazer isso?
```

### Identity Question (Pre-Classifier)
```typescript
// Test input
"Você é a Nath?"

// Expected output (no LLM call)
Não, sou a NathIA, assistente de IA do app Nossa Maternidade.

Sou inspirada no estilo da Nathália — direta, prática, vida real.
Mas ela é pessoa real, eu sou IA.

O que você precisa agora?
```

### Normal Conversation (LLM with new prompt)
```typescript
// Test input
"Estou cansada, o bebê não dormiu a noite toda"

// Expected output (from LLM with 3-block structure)
Entendi. Isso pesa.

Noites sem dormir deixam qualquer um no limite.

Quer registrar mais sobre essa noite ou prefere uma dica rápida de descanso?
```

### Response Canonicalizer (Hard Blocks)
```typescript
// Simulated LLM response (forbidden phrase)
"Você tem depressão pós-parto. Vai ficar tudo bem, eu garanto!"

// Expected output (after canonicalizer)
Entendi. Isso pesa.

Quer registrar mais 1 detalhe ou fechar por aqui?
```

---

## Questions for Continuity

Before continuing on MacBook, verify:

- [ ] **MCP Memory accessible?**
  ```bash
  # In Claude Code on MacBook
  mcp__memory-keeper__context_get { key: "nathia-security-approach" }
  ```
- [ ] **Supabase credentials configured?**
  ```bash
  # Check .env exists and has correct values
  cat .env | grep SUPABASE
  ```
- [ ] **Node.js version compatible?**
  ```bash
  node --version  # Should be v22.x or compatible
  ```
- [ ] **Git configured?**
  ```bash
  git config --list | grep user
  # Should show same name/email as Windows
  ```
- [ ] **Plan file accessible?**
  ```bash
  cat .claude/plans/refactored-pondering-turing.md
  ```

---

## Key Decisions Summary (One-Pager)

For quick reference when resuming:

| Decision | Choice | Reason |
|----------|--------|--------|
| **Security** | Edge Functions (keep) | API keys on server, JWT auth, LGPD compliant |
| **Prompt** | 146-line new (adopt) | 3-block structure, anti-drift, clearer limits |
| **Provider** | Hybrid Claude + Gemini | Claude for persona, Gemini for grounding |
| **Crisis Detection** | Pre-classifier (add) | <100ms, 100% reliable, CVV/SAMU templates |
| **Response Filter** | Canonicalizer (add) | Prevents drift, enforces format, hard blocks |
| **Architecture** | Integrate in existing | Don't rebuild, enhance current Edge Functions |

**Bottom line**: The best solution is NOT the quickest to implement (client-side Gemini), but the most SECURE and COMPLIANT (Edge Functions + policies + hybrid LLM).

---

## Additional Resources

### Documentation to Read
1. `.claude/plans/refactored-pondering-turing.md` - **START HERE**
2. `src/config/nathia.ts` - Current system prompt (317 lines)
3. `src/api/ai-service.ts` - Current AI service (228 lines)
4. `CLAUDE.md` - Project guidelines

### Files to Create (in order)
1. ✅ `src/ai/policies/nathia.preClassifier.ts` - DONE
2. ⏸️ `src/ai/policies/nathia.responseCanonicalizer.ts` - NEXT
3. `src/ai/prompts/nathia.system.v2.ts` (146 lines from plan)
4. `src/ai/prompts/nathia.emotional.v2.ts` (mood-based)

### Files to Modify (later)
5. `src/config/nathia.ts` - Import v2 prompts
6. `src/screens/AssistantScreen.tsx` - Add pre-classifier + canonicalizer
7. `src/api/ai-service.ts` - Add grounding flag detection
8. `supabase/functions/ai/index.ts` - Add Gemini router

---

## Contact & Support

**Developer**: Lion (eugabrielmktd@gmail.com)
**Environment**: Switching Windows → MacBook OS
**Claude Code Version**: Latest (with MCP support)

**If stuck**:
1. Read the plan file (`.claude/plans/refactored-pondering-turing.md`)
2. Read this progress file (`docs/NATHIA_V2_PROGRESS.md`)
3. Check MCP memory (`context_get` with key patterns)
4. Review commit message in git log

---

**End of Progress Document**
_This file is committed to the repository for environment transition continuity._
_Last modified: 2025-01-17 23:45 BRT by Claude Code on Windows_
_Next modification: MacBook OS (TBD)_
