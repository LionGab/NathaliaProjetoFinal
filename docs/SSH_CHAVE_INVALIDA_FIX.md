# 🔧 Fix: Chave SSH Inválida no GitHub

## ❌ Erro: "A chave é inválida. Você deve fornecer uma chave no formato de chave pública do OpenSSH."

**Causa:** A chave foi copiada com formatação incorreta (espaços extras, quebras de linha, etc.)

---

## ✅ Solução

### 1. Verificar Chave Correta

Execute no Terminal:

```bash
# Ver chave pública (sem formatação extra)
cat ~/.ssh/id_ed25519.pub
```

**A chave deve ser UMA LINHA SÓ, sem quebras:**

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIA+LrISewyRK000KW4w3GfaS6MYFqjjvpCJW4GN54lJr gabrielvesz_@hotmail.com
```

### 2. Copiar Corretamente

**Opção A: Copiar direto do terminal (recomendado)**

```bash
# Copiar para clipboard (Mac)
cat ~/.ssh/id_ed25519.pub | pbcopy
```

**Opção B: Copiar manualmente**

1. Execute: `cat ~/.ssh/id_ed25519.pub`
2. Selecione **TUDO** (incluindo `ssh-ed25519` no início)
3. Copie (Cmd + C)
4. **IMPORTANTE:** Certifique-se de copiar tudo em uma linha só

### 3. Colar no GitHub

1. Acesse: https://github.com/settings/keys
2. **New SSH key**
3. **Title:** `MacBook - Nossa Maternidade`
4. **Key:** Cole a chave (Cmd + V)
5. **Verificar:**
   - Deve começar com `ssh-ed25519`
   - Deve terminar com `gabrielvesz_@hotmail.com`
   - Deve ser UMA LINHA só (sem quebras)
   - Não deve ter espaços extras no início ou fim
6. **Add SSH key**

---

## 🔍 Verificar Formato Correto

A chave deve ter exatamente este formato:

```
ssh-ed25519 [chave longa] gabrielvesz_@hotmail.com
```

**Exemplo correto:**
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIA+LrISewyRK000KW4w3GfaS6MYFqjjvpCJW4GN54lJr gabrielvesz_@hotmail.com
```

**Erros comuns:**
- ❌ Quebra de linha no meio
- ❌ Espaços extras no início/fim
- ❌ Falta parte da chave
- ❌ Caracteres especiais incorretos

---

## 🧪 Testar Chave

Depois de adicionar, teste:

```bash
# Testar conexão
ssh -T git@github.com
```

**Resposta esperada:**
```
Hi LionGab! You've successfully authenticated, but GitHub does not provide shell access.
```

---

## 💡 Dica: Verificar Chave Antes de Colar

Execute para ver exatamente o que será copiado:

```bash
# Ver chave (vai mostrar exatamente como está)
cat ~/.ssh/id_ed25519.pub

# Verificar se tem quebras de linha
cat ~/.ssh/id_ed25519.pub | wc -l
# Deve retornar: 1 (uma linha só)
```

---

## 🔄 Se Ainda Não Funcionar

### Gerar Nova Chave

Se a chave estiver corrompida, gere uma nova:

```bash
# Fazer backup da chave antiga (se necessário)
mv ~/.ssh/id_ed25519 ~/.ssh/id_ed25519.backup
mv ~/.ssh/id_ed25519.pub ~/.ssh/id_ed25519.pub.backup

# Gerar nova chave
ssh-keygen -t ed25519 -C "gabrielvesz_@hotmail.com"

# Quando perguntar:
# - Localização: Enter (usa padrão)
# - Passphrase: Enter (sem senha) ou digite uma

# Copiar nova chave
cat ~/.ssh/id_ed25519.pub | pbcopy

# Adicionar no GitHub
```

---

## ✅ Checklist

- [ ] Chave copiada completa (uma linha só)
- [ ] Começa com `ssh-ed25519`
- [ ] Termina com `gabrielvesz_@hotmail.com`
- [ ] Sem espaços extras no início/fim
- [ ] Sem quebras de linha
- [ ] Adicionada no GitHub com sucesso
- [ ] Teste SSH funcionando: `ssh -T git@github.com`

---

**Última atualização:** 16/12/2025

