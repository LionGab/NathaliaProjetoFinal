# 🔐 Configuração SSH para Git/GitHub

## ❌ Erro Comum

```bash
# ERRADO
ssh domain\username@servername

# Erro: Could not resolve hostname servername
```

**Problema:**

1. Formato incorreto - não use `domain\username`, use `username@hostname`
2. Hostname inválido - "servername" é um placeholder, não um servidor real

**Correção:**

```bash
# Para GitHub
ssh git@github.com

# Para servidor real
ssh usuario@servidor.com
ssh usuario@192.168.1.100
```

---

## ✅ Formato Correto do SSH

### Sintaxe Básica

```bash
ssh [opções] usuário@hostname
```

### Exemplos

```bash
# Conectar a servidor remoto
ssh usuario@192.168.1.100
ssh usuario@servidor.exemplo.com

# Com porta específica
ssh -p 2222 usuario@servidor.com

# Com chave SSH
ssh -i ~/.ssh/minha_chave usuario@servidor.com
```

---

## 🔑 Configurar SSH para GitHub

### Passo 1: Verificar se já tem chave SSH

```bash
# Verificar chaves existentes
ls -la ~/.ssh

# Procurar por:
# id_rsa / id_rsa.pub (RSA)
# id_ed25519 / id_ed25519.pub (Ed25519 - recomendado)
```

### Passo 2: Gerar Nova Chave SSH (se não tiver)

```bash
# Gerar chave Ed25519 (recomendado)
ssh-keygen -t ed25519 -C "gabrielvesz_@hotmail.com"

# Ou RSA (se Ed25519 não funcionar)
ssh-keygen -t rsa -b 4096 -C "gabrielvesz_@hotmail.com"

# Quando perguntar:
# - Localização: Enter (usa ~/.ssh/id_ed25519)
# - Senha: Enter (sem senha) ou digite uma senha forte
```

### Passo 3: Adicionar Chave ao SSH Agent

```bash
# Iniciar ssh-agent
eval "$(ssh-agent -s)"

# Adicionar chave
ssh-add ~/.ssh/id_ed25519
# ou
ssh-add ~/.ssh/id_rsa
```

### Passo 4: Copiar Chave Pública

```bash
# Windows (Git Bash)
cat ~/.ssh/id_ed25519.pub | clip

# Mac/Linux
cat ~/.ssh/id_ed25519.pub | pbcopy
# ou
cat ~/.ssh/id_ed25519.pub
# (copiar manualmente)
```

### Passo 5: Adicionar Chave no GitHub

1. **GitHub** → **Settings** → **SSH and GPG keys**
2. **New SSH key**
3. **Title:** `Windows - Nossa Maternidade` (ou `Mac - Nossa Maternidade`)
4. **Key:** Colar chave pública (começa com `ssh-ed25519` ou `ssh-rsa`)
5. **Add SSH key**

### Passo 6: Testar Conexão

```bash
# Testar conexão com GitHub
ssh -T git@github.com

# Resposta esperada:
# Hi LionGab! You've successfully authenticated...
```

---

## 🔄 Mudar Repositório de HTTPS para SSH

### Atual (HTTPS)

```bash
git remote -v
# origin  https://github.com/LionGab/NossaMaternidade.git
```

### Mudar para SSH

```bash
# Remover remoto atual
git remote remove origin

# Adicionar com SSH
git remote add origin git@github.com:LionGab/NossaMaternidade.git

# Verificar
git remote -v
# origin  git@github.com:LionGab/NossaMaternidade.git (fetch)
# origin  git@github.com:LionGab/NossaMaternidade.git (push)
```

### Ou atualizar URL existente

```bash
git remote set-url origin git@github.com:LionGab/NossaMaternidade.git
```

---

## 🎯 Usar SSH no GitKraken

### Configurar SSH no GitKraken

1. **Preferences** → **Authentication**
2. **SSH** → **Add SSH Key**
3. **Selecionar** arquivo `~/.ssh/id_ed25519` (ou `id_rsa`)
4. **Save**

### Clonar com SSH

1. **File** → **Clone Repo**
2. **URL:** `git@github.com:LionGab/NossaMaternidade.git`
3. **Clone**

---

## 🔧 Solução de Problemas

### Erro: "Could not resolve hostname"

**Causa:** Hostname inválido ou não existe.

**Solução:**

- Verificar se o hostname está correto
- Verificar conexão com internet
- Para GitHub: usar `github.com` (não `servername`)

### Erro: "Permission denied (publickey)"

**Causa:** Chave SSH não configurada ou não adicionada no GitHub.

**Solução:**

1. Verificar se chave existe: `ls -la ~/.ssh`
2. Adicionar chave ao ssh-agent: `ssh-add ~/.ssh/id_ed25519`
3. Verificar se chave está no GitHub: Settings → SSH keys
4. Testar: `ssh -T git@github.com`

### Erro: "Host key verification failed"

**Causa:** Host key mudou ou não está na lista conhecida.

**Solução:**

```bash
# Remover host antigo
ssh-keygen -R github.com

# Tentar novamente
ssh -T git@github.com
# Digitar "yes" quando perguntar
```

### Windows: "ssh-add não funciona"

**Solução:**

```bash
# Usar caminho completo
ssh-add ~/.ssh/id_ed25519

# Ou no PowerShell
ssh-add $env:USERPROFILE\.ssh\id_ed25519
```

---

## 📝 Configuração Avançada: SSH Config

Criar arquivo `~/.ssh/config` para facilitar:

```bash
# ~/.ssh/config

# GitHub
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519
    IdentitiesOnly yes

# Servidor personalizado (exemplo)
Host meuservidor
    HostName 192.168.1.100
    User usuario
    Port 22
    IdentityFile ~/.ssh/id_rsa
```

**Uso:**

```bash
# Em vez de:
ssh git@github.com

# Pode usar:
ssh github.com

# Ou para servidor personalizado:
ssh meuservidor
```

---

## ✅ Checklist SSH

- [ ] Chave SSH gerada (`id_ed25519` ou `id_rsa`)
- [ ] Chave adicionada ao ssh-agent
- [ ] Chave pública adicionada no GitHub
- [ ] Conexão testada: `ssh -T git@github.com`
- [ ] Repositório configurado com SSH (se necessário)
- [ ] GitKraken configurado com SSH (se necessário)

---

## 🎯 Resumo

### Para GitHub

```bash
# 1. Gerar chave
ssh-keygen -t ed25519 -C "seu@email.com"

# 2. Adicionar ao agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# 3. Copiar chave pública
cat ~/.ssh/id_ed25519.pub | clip  # Windows
cat ~/.ssh/id_ed25519.pub | pbcopy # Mac

# 4. Adicionar no GitHub (Settings → SSH keys)

# 5. Testar
ssh -T git@github.com

# 6. Mudar repositório para SSH (opcional)
git remote set-url origin git@github.com:LionGab/NossaMaternidade.git
```

---

**Última atualização:** 16/12/2025
