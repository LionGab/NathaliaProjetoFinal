# 🔧 SSH GitHub - Fix "Permission denied"

## ✅ Status Atual

- ✅ ssh-agent rodando (pid 82861)
- ✅ Chave adicionada ao agent
- ❌ GitHub ainda rejeita: "Permission denied (publickey)"

**Causa:** A chave pública não está no GitHub ou não corresponde.

---

## 🔍 Verificar Chave Pública

### 1. Ver sua chave pública atual

```bash
# Mostrar chave pública
cat ~/.ssh/id_ed25519.pub
```

**Sua chave deve ser:**
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIA+LrISewyRK000KW4w3GfaS6MYFqjjvpCJW4GN54lJr gabrielvesz_@hotmail.com
```

### 2. Verificar fingerprint

```bash
# Ver fingerprint da chave
ssh-keygen -lf ~/.ssh/id_ed25519.pub
```

**Deve mostrar:**
```
256 SHA256:8gL6/TtKcyXuBGqNuOUkkaE+MAO+40buu8Dn8GzglG8 gabrielvesz_@hotmail.com (ED25519)
```

---

## ✅ Adicionar Chave no GitHub

### Passo a Passo

1. **Copiar chave pública:**
   ```bash
   cat ~/.ssh/id_ed25519.pub | pbcopy
   ```

2. **Abrir GitHub:**
   - https://github.com/settings/keys

3. **Verificar chaves existentes:**
   - Veja se já tem alguma chave com o mesmo fingerprint
   - Se tiver uma chave diferente, pode deletar ou manter ambas

4. **Adicionar nova chave:**
   - Clique em **"New SSH key"**
   - **Title:** `MacBook - Nossa Maternidade`
   - **Key:** Cole a chave pública (começa com `ssh-ed25519`)
   - **Add SSH key**

5. **Verificar:**
   - A chave deve aparecer na lista
   - Deve mostrar o fingerprint: `SHA256:8gL6/TtKcyXuBGqNuOUkkaE+MAO+40buu8Dn8GzglG8`

---

## 🧪 Testar Novamente

```bash
# Testar conexão
ssh -T git@github.com
```

**Resposta esperada:**
```
Hi LionGab! You've successfully authenticated, but GitHub does not provide shell access.
```

**Se ainda der erro, tente com verbose:**
```bash
# Ver detalhes do que está acontecendo
ssh -vT git@github.com
```

---

## 🔄 Se Ainda Não Funcionar

### Verificar se há múltiplas chaves

```bash
# Ver todas as chaves no agent
ssh-add -l

# Ver todas as chaves no diretório
ls -la ~/.ssh/
```

### Testar com chave específica

```bash
# Testar forçando uso da chave
ssh -i ~/.ssh/id_ed25519 -T git@github.com
```

### Verificar config SSH

```bash
# Ver se há config que pode estar interferindo
cat ~/.ssh/config
```

Se houver config, verifique se está correto:
```
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519
    IdentitiesOnly yes
```

---

## 💡 Dica: Verificar Chaves no GitHub

Você pode ter múltiplas chaves no GitHub. Verifique:

1. https://github.com/settings/keys
2. Veja todas as chaves listadas
3. Compare os fingerprints
4. Certifique-se que a chave do Mac está lá

**Fingerprint da sua chave do Mac:**
```
SHA256:8gL6/TtKcyXuBGqNuOUkkaE+MAO+40buu8Dn8GzglG8
```

---

## ✅ Checklist Final

- [ ] Chave pública copiada: `cat ~/.ssh/id_ed25519.pub | pbcopy`
- [ ] Chave adicionada no GitHub (Settings → SSH keys)
- [ ] Fingerprint corresponde: `SHA256:8gL6/TtKcyXuBGqNuOUkkaE+MAO+40buu8Dn8GzglG8`
- [ ] Teste SSH funcionando: `ssh -T git@github.com`
- [ ] Git pull funcionando: `git pull origin main`

---

## 🚨 Se Nada Funcionar

### Opção 1: Usar HTTPS temporariamente

```bash
# Mudar para HTTPS
git remote set-url origin https://github.com/LionGab/NossaMaternidade.git

# Testar
git pull origin main
```

### Opção 2: Gerar nova chave

```bash
# Gerar nova chave com nome diferente
ssh-keygen -t ed25519 -C "gabrielvesz_@hotmail.com" -f ~/.ssh/id_ed25519_mac

# Adicionar ao agent
ssh-add ~/.ssh/id_ed25519_mac

# Copiar chave pública
cat ~/.ssh/id_ed25519_mac.pub | pbcopy

# Adicionar no GitHub
# Depois atualizar config SSH para usar essa chave
```

---

**Última atualização:** 16/12/2025

