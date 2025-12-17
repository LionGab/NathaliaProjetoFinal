# 🔧 Erro Cursor SSH - Solução

## ❌ Erro Identificado

```
ssh: Could not resolve hostname ssh-ed25519: nodename nor servname provided, or not known
```

**Problema:** O Cursor está tentando usar a **chave pública SSH** como hostname, o que está errado.

A chave pública (`ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIE5hUm0+...`) **não é um hostname** - é uma chave de autenticação.

---

## ✅ Solução

### O que aconteceu?

Você provavelmente tentou configurar **Cursor Remote SSH** usando a chave pública como hostname, mas isso está incorreto.

### Para que serve cada coisa:

1. **Chave pública SSH** → Adicionar no GitHub (Settings → SSH keys)
2. **Hostname SSH** → `git@github.com` (para GitHub) ou `usuario@servidor.com` (para servidor remoto)
3. **Cursor Remote SSH** → Para conectar a servidores remotos, não para GitHub

---

## 🎯 Configuração Correta

### Opção 1: Usar SSH com GitHub (Recomendado)

**Não use Cursor Remote SSH para GitHub!** Use Git normalmente:

#### 1. Configurar SSH no Terminal do Mac

```bash
# Verificar se chave existe
ls -la ~/.ssh/id_ed25519*

# Se não tiver, gerar
ssh-keygen -t ed25519 -C "gabrielvesz_@hotmail.com"

# Adicionar ao agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Copiar chave pública
cat ~/.ssh/id_ed25519.pub | pbcopy
```

#### 2. Adicionar Chave no GitHub

1. Acesse: https://github.com/settings/keys
2. **New SSH key**
3. **Title:** `MacBook - Nossa Maternidade`
4. **Key:** Colar chave pública (a que você copiou)
5. **Add SSH key**

#### 3. Testar no Terminal

```bash
# Testar conexão
ssh -T git@github.com

# Deve mostrar:
# Hi LionGab! You've successfully authenticated...
```

#### 4. Mudar Repositório para SSH

```bash
cd ~/NossaMaternidade
git remote set-url origin git@github.com:LionGab/NossaMaternidade.git
git remote -v
```

#### 5. Usar no Cursor Normalmente

- **Não use Remote SSH**
- Abra a pasta localmente: `File > Open Folder > NossaMaternidade`
- Git funciona normalmente via SSH

---

### Opção 2: Remover Configuração Remote SSH Incorreta

Se você configurou Remote SSH incorretamente:

1. **Fechar Cursor**
2. **Remover configuração** (se houver):

   ```bash
   # Verificar se há config SSH remoto
   cat ~/.ssh/config

   # Se houver entrada errada, editar:
   nano ~/.ssh/config
   # Remover linhas com a chave pública como hostname
   ```

3. **Abrir Cursor novamente**
4. **Abrir pasta localmente** (não via Remote SSH)

---

## 🔍 Verificar Configuração Correta

### No Terminal do Mac:

```bash
# 1. Verificar chave existe
ls -la ~/.ssh/id_ed25519*

# 2. Verificar chave no agent
ssh-add -l

# 3. Testar GitHub
ssh -T git@github.com

# 4. Verificar remoto do projeto
cd ~/NossaMaternidade
git remote -v

# Deve mostrar:
# origin  git@github.com:LionGab/NossaMaternidade.git
```

### No Cursor:

1. **File > Open Folder**
2. Selecionar pasta `~/NossaMaternidade`
3. **Não usar** "Connect to Host" ou Remote SSH
4. Git funciona normalmente

---

## 📝 Resumo

### ❌ ERRADO (o que causou o erro):

```
Host ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIE5hUm0+...
    HostName ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIE5hUm0+...
```

### ✅ CORRETO:

**Para GitHub:**

```bash
# No terminal
git remote set-url origin git@github.com:LionGab/NossaMaternidade.git

# Chave pública vai no GitHub (Settings → SSH keys)
# Não vai no hostname!
```

**Para servidor remoto (se necessário):**

```
Host meuservidor
    HostName servidor.com
    User usuario
    IdentityFile ~/.ssh/id_ed25519
```

---

## 🎯 Próximos Passos

1. ✅ **Gerar chave SSH no Mac** (se não tiver)
2. ✅ **Adicionar chave no GitHub** (Settings → SSH keys)
3. ✅ **Testar no Terminal:** `ssh -T git@github.com`
4. ✅ **Mudar repositório para SSH:** `git remote set-url origin git@github.com:LionGab/NossaMaternidade.git`
5. ✅ **Abrir projeto no Cursor localmente** (não via Remote SSH)
6. ✅ **Usar Git normalmente** - SSH funciona automaticamente

---

## 💡 Dica

**Cursor Remote SSH** é para conectar a servidores remotos (servidores Linux, VMs, etc.), não para GitHub.

Para GitHub, use:

- Git normal com SSH (recomendado)
- Ou HTTPS (também funciona)

**Não precisa de Remote SSH para GitHub!**

---

**Última atualização:** 16/12/2025
