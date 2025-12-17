# 🔧 SSH Mac - Solução de Problemas

## ❌ Erro: "Permission denied (publickey)"

**Causa:** A chave SSH não está sendo reconhecida pelo GitHub.

**Soluções:**

### 1. Adicionar Chave ao ssh-agent

```bash
# Iniciar ssh-agent
eval "$(ssh-agent -s)"

# Adicionar chave (vai pedir passphrase)
ssh-add ~/.ssh/id_ed25519

# Verificar se foi adicionada
ssh-add -l
```

### 2. Verificar se Chave Está no GitHub

**Sua chave pública:**
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIA+LrISewyRK000KW4w3GfaS6MYFqjjvpCJW4GN54lJr gabrielvesz_@hotmail.com
```

**Passos:**
1. Acesse: https://github.com/settings/keys
2. Verifique se essa chave está lá
3. Se não estiver, adicione:
   - **New SSH key**
   - **Title:** `MacBook - Nossa Maternidade`
   - **Key:** Cole a chave pública acima
   - **Add SSH key**

### 3. Testar Conexão

```bash
# Testar com verbose para ver detalhes
ssh -vT git@github.com

# Ou teste simples
ssh -T git@github.com
```

**Resposta esperada:**
```
Hi LionGab! You've successfully authenticated, but GitHub does not provide shell access.
```

---

## 🔍 Verificação Completa

Execute estes comandos para diagnosticar:

```bash
# 1. Verificar chave existe
ls -la ~/.ssh/id_ed25519*

# 2. Ver chave pública
cat ~/.ssh/id_ed25519.pub

# 3. Verificar ssh-agent
eval "$(ssh-agent -s)"

# 4. Adicionar chave
ssh-add ~/.ssh/id_ed25519

# 5. Verificar chave no agent
ssh-add -l

# 6. Testar GitHub
ssh -T git@github.com
```

---

## 💡 Dica: Adicionar ao Keychain (macOS)

Para não precisar digitar passphrase toda vez:

```bash
# Adicionar ao keychain
ssh-add --apple-use-keychain ~/.ssh/id_ed25519

# Configurar para usar keychain automaticamente
cat >> ~/.ssh/config << EOF
Host github.com
    AddKeysToAgent yes
    UseKeychain yes
    IdentityFile ~/.ssh/id_ed25519
EOF

# Dar permissão ao config
chmod 600 ~/.ssh/config
```

---

## ✅ Checklist

- [ ] Chave SSH gerada (`id_ed25519`)
- [ ] Chave adicionada ao ssh-agent (`ssh-add`)
- [ ] Chave pública adicionada no GitHub
- [ ] Teste SSH funcionando (`ssh -T git@github.com`)
- [ ] Repositório configurado para SSH

---

**Última atualização:** 16/12/2025

