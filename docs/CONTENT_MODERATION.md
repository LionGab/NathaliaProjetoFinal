# Sistema de Moderação de Conteúdo

## 📋 VISÃO GERAL

Sistema automático de moderação de conteúdo usando OpenAI Moderation API para detectar e filtrar conteúdo inapropriado em posts e comentários da comunidade.

---

## 🎯 RECURSOS

- ✅ Moderação automática via OpenAI Moderation API
- ✅ Classificação: **SAFE** / **FLAGGED** / **BLOCKED**
- ✅ Rate limiting (50 req/min por usuário)
- ✅ Cache de resultados (1 hora)
- ✅ Logging completo de decisões
- ✅ Notificações para admins (conteúdo flagged)
- ✅ Sistema de revisão manual
- ✅ RLS policies (apenas admins veem conteúdo bloqueado)

---

## 🏗️ ARQUITETURA

### Edge Function: `/moderate-content`

**Localização:** `supabase/functions/moderate-content/index.ts`

**Endpoint:** `https://[projeto].supabase.co/functions/v1/moderate-content`

**Autenticação:**
- JWT token (usuários autenticados)
- Service key (sistema/triggers)

### Database

**Migration:** `013_content_moderation.sql`

**Tabelas:**
- `moderation_logs` - Log de todas as decisões
- `community_posts` - Campo `moderation_status` adicionado
- `community_comments` - Campos `is_hidden`, `hidden_reason`, `moderation_status` adicionados

**Views:**
- `pending_moderation` - Conteúdo aguardando revisão (apenas admins)

---

## 🚀 COMO USAR

### 1. Chamar Edge Function Diretamente

```typescript
// src/api/moderation.ts
import { supabase } from "./supabase";

interface ModerationResult {
  status: "safe" | "flagged" | "blocked";
  reasons: string[];
  confidence: number;
  action_taken: "published" | "quarantined" | "rejected";
  details?: {
    categories: Record<string, boolean>;
    category_scores: Record<string, number>;
  };
}

export async function moderateContent(
  content: string,
  type: "post" | "comment",
  authorId: string
): Promise<ModerationResult> {
  const { data, error } = await supabase.functions.invoke("moderate-content", {
    body: {
      content,
      type,
      author_id: authorId,
    },
  });

  if (error) throw error;
  return data as ModerationResult;
}
```

### 2. Exemplo: Moderar Antes de Criar Post

```typescript
// src/components/community/NewPostModal.tsx
import { moderateContent } from "@/api/moderation";

async function handleCreatePost(content: string) {
  const user = useAppStore.getState().user;
  if (!user) return;

  try {
    // 1. Moderar conteúdo ANTES de criar
    const moderation = await moderateContent(content, "post", user.id);

    if (moderation.status === "blocked") {
      // Bloquear completamente
      alert(
        "Seu conteúdo foi bloqueado por violar nossas diretrizes de comunidade."
      );
      return;
    }

    if (moderation.status === "flagged") {
      // Avisar que está em revisão
      alert(
        "Seu conteúdo foi enviado para revisão e será publicado após aprovação."
      );
    }

    // 2. Criar post (será marcado como is_hidden se flagged/blocked)
    const { data: post, error } = await supabase
      .from("community_posts")
      .insert({
        author_id: user.id,
        content,
        is_hidden: moderation.status !== "safe",
        hidden_reason:
          moderation.status !== "safe"
            ? `Conteúdo em revisão: ${moderation.reasons.join(", ")}`
            : null,
        moderation_status: moderation.status,
      })
      .select()
      .single();

    if (error) throw error;

    if (moderation.status === "safe") {
      alert("Post publicado com sucesso!");
    }
  } catch (err) {
    console.error("Erro ao criar post:", err);
    alert("Erro ao criar post. Tente novamente.");
  }
}
```

### 3. Exemplo: Hook de Moderação

```typescript
// src/hooks/useModerationCheck.ts
import { useState } from "react";
import { moderateContent } from "@/api/moderation";
import { useAppStore } from "@/state/store";

export function useModerationCheck() {
  const [isChecking, setIsChecking] = useState(false);
  const user = useAppStore((s) => s.user);

  const checkContent = async (
    content: string,
    type: "post" | "comment"
  ) => {
    if (!user) throw new Error("User not authenticated");

    setIsChecking(true);
    try {
      const result = await moderateContent(content, type, user.id);
      return result;
    } finally {
      setIsChecking(false);
    }
  };

  return { checkContent, isChecking };
}

// Uso no componente:
const { checkContent, isChecking } = useModerationCheck();

async function handleSubmit() {
  const moderation = await checkContent(postContent, "post");

  if (moderation.status === "blocked") {
    showError("Conteúdo bloqueado");
    return;
  }

  // Continuar com criação...
}
```

---

## 🔧 TRIGGERS AUTOMÁTICOS (OPCIONAL)

Os triggers estão **desabilitados por padrão** porque:
- Aumentam latência de inserção
- Requerem `pg_net` extension
- Melhor UX moderando antes de inserir

### Habilitar Triggers

Se você quiser moderação automática no banco (sem chamar da aplicação):

```sql
-- Já está criado na migration, mas desabilitado
-- Para habilitar:
ALTER TABLE community_posts ENABLE TRIGGER trigger_auto_moderate_post;
ALTER TABLE community_comments ENABLE TRIGGER trigger_auto_moderate_comment;

-- Para desabilitar:
ALTER TABLE community_posts DISABLE TRIGGER trigger_auto_moderate_post;
ALTER TABLE community_comments DISABLE TRIGGER trigger_auto_moderate_comment;
```

**⚠️ IMPORTANTE:** Triggers requerem:
1. Extension `pg_net` habilitada
2. Service key configurada em `app.settings.supabase_service_key`
3. URL do Supabase configurada em `app.settings.supabase_url`

---

## 📊 THRESHOLDS DE MODERAÇÃO

```typescript
// Configuração em supabase/functions/moderate-content/index.ts
const THRESHOLDS = {
  block: 0.8, // >= 0.8 em qualquer categoria = BLOCKED
  flag: 0.5, // >= 0.5 em qualquer categoria = FLAGGED
  // < 0.5 em todas as categorias = SAFE
};
```

**Categorias do OpenAI Moderation:**
- `harassment` - Assédio
- `harassment/threatening` - Assédio com ameaças
- `hate` - Discurso de ódio
- `hate/threatening` - Ódio com ameaças
- `self-harm` - Auto-lesão
- `sexual` - Conteúdo sexual
- `sexual/minors` - Conteúdo sexual envolvendo menores
- `violence` - Violência
- `violence/graphic` - Violência gráfica

---

## 🛡️ REVISÃO MANUAL (ADMINS)

### Ver Conteúdo Pendente

```sql
-- View pending_moderation
SELECT * FROM pending_moderation;
```

Retorna:
- `log_id` - ID do log de moderação
- `content_type` - Tipo (post/comment)
- `content_id` - ID do conteúdo
- `author_name` - Nome do autor
- `status` - Status (sempre 'flagged' nesta view)
- `reasons` - Categorias flagged
- `content_text` - Texto do conteúdo

### Revisar Conteúdo

```sql
-- Aprovar
SELECT review_moderated_content(
  '[log_id]',
  'approved',
  'Conteúdo revisado e aprovado'
);

-- Rejeitar (deleta o conteúdo)
SELECT review_moderated_content(
  '[log_id]',
  'rejected',
  'Violação de diretrizes confirmada'
);
```

### Painel Admin (futuro)

Criar tela em `src/screens/AdminModerationScreen.tsx`:

```typescript
// Buscar conteúdo pendente
const { data: pending } = await supabase
  .from("pending_moderation")
  .select("*")
  .order("created_at", { ascending: false });

// Revisar
await supabase.rpc("review_moderated_content", {
  p_log_id: logId,
  p_decision: "approved", // ou 'rejected'
  p_notes: "Motivo da decisão",
});
```

---

## 📈 MONITORAMENTO

### Estatísticas de Moderação

```sql
-- Total de moderações por status
SELECT
  status,
  COUNT(*) AS total,
  AVG(confidence) AS avg_confidence
FROM moderation_logs
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY status;

-- Top categorias flagged
SELECT
  unnest(reasons) AS category,
  COUNT(*) AS count
FROM moderation_logs
WHERE status IN ('flagged', 'blocked')
  AND created_at >= NOW() - INTERVAL '7 days'
GROUP BY category
ORDER BY count DESC;

-- Usuários com mais conteúdo bloqueado
SELECT
  p.name,
  COUNT(*) AS blocked_count
FROM moderation_logs ml
JOIN profiles p ON ml.author_id = p.id
WHERE ml.status = 'blocked'
  AND ml.created_at >= NOW() - INTERVAL '30 days'
GROUP BY p.id, p.name
ORDER BY blocked_count DESC
LIMIT 10;
```

---

## 🔒 SEGURANÇA

### RLS Policies

```sql
-- Usuários não veem conteúdo bloqueado (exceto próprio ou admin)
CREATE POLICY "Users cannot see blocked posts"
  ON community_posts FOR SELECT
  USING (
    NOT is_hidden
    OR author_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

-- Apenas admins veem logs de moderação
CREATE POLICY "Admins can view moderation logs"
  ON moderation_logs FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );
```

### Rate Limiting

- **50 requests/minuto** por usuário
- Service calls (system) não têm limite
- Cache de 1 hora para mesmo conteúdo

### CORS

Apenas domínios permitidos:
- `https://nossamaternidade.com.br`
- `https://www.nossamaternidade.com.br`
- `exp://` (Expo Go)
- `http://localhost:8081` (dev local)

---

## 🧪 TESTES

### Testar Edge Function Localmente

```bash
# 1. Instalar Supabase CLI
npm install -g supabase

# 2. Iniciar funções localmente
supabase functions serve moderate-content --env-file .env.local

# 3. Testar
curl -X POST http://localhost:54321/functions/v1/moderate-content \
  -H "Authorization: Bearer [seu-jwt-token]" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Este é um teste de moderação",
    "type": "post",
    "author_id": "[user-uuid]"
  }'
```

### Casos de Teste

```typescript
// 1. Conteúdo safe
const safe = await moderateContent(
  "Boa noite mamães! Alguém tem dicas de receitas saudáveis?",
  "post",
  userId
);
// Esperado: { status: "safe", ... }

// 2. Conteúdo com linguagem ofensiva
const flagged = await moderateContent(
  "Seu [palavra ofensiva], você é [insulto]...",
  "post",
  userId
);
// Esperado: { status: "flagged" ou "blocked", reasons: ["harassment"] }

// 3. Conteúdo extremo
const blocked = await moderateContent(
  "Vou te matar... [ameaça violenta]",
  "post",
  userId
);
// Esperado: { status: "blocked", reasons: ["violence", "harassment/threatening"] }
```

---

## 🐛 TROUBLESHOOTING

### Erro: "OpenAI API error"

**Causa:** API key inválida ou expirada

**Solução:**
1. Verificar `OPENAI_API_KEY` em `.env.local`
2. Verificar na dashboard Supabase: Settings → Edge Functions → Secrets

### Erro: "Rate limit exceeded"

**Causa:** Usuário excedeu 50 req/min

**Solução:** Aguardar 1 minuto ou implementar debounce na UI

### Conteúdo Safe Está Sendo Bloqueado

**Causa:** Thresholds muito baixos

**Solução:** Ajustar `THRESHOLDS` em `moderate-content/index.ts`:
```typescript
const THRESHOLDS = {
  block: 0.9, // Aumentar para ser mais permissivo
  flag: 0.7,
};
```

### Triggers Não Funcionam

**Causa:** Triggers desabilitados ou `pg_net` não configurado

**Solução:** Usar moderação direta da aplicação (recomendado)

---

## 📚 REFERÊNCIAS

- [OpenAI Moderation API](https://platform.openai.com/docs/guides/moderation)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [RLS Policies](https://supabase.com/docs/guides/auth/row-level-security)

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

- [x] Edge Function `/moderate-content` criada
- [x] Migration `013_content_moderation.sql` criada
- [x] Tabela `moderation_logs` criada
- [x] Campos de moderação em `community_posts` e `community_comments`
- [x] RLS policies configuradas
- [x] View `pending_moderation` para admins
- [x] Função `review_moderated_content` para revisão manual
- [ ] Rodar migration no banco de dados
- [ ] Configurar `OPENAI_API_KEY` nas secrets do Supabase
- [ ] Deploy da Edge Function
- [ ] Criar hook `useModerationCheck` no app
- [ ] Integrar moderação em `NewPostModal`
- [ ] Integrar moderação em comentários
- [ ] Criar painel admin de moderação (opcional)
- [ ] Testar com conteúdo real

---

**Última atualização:** 2025-01-17
**Versão:** 1.0.0
**Autor:** Lion + Claude Code
