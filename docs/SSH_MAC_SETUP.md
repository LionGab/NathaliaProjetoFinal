# 🍎 SSH Setup no MacBook - Guia Completo

## 🔍 Verificar Status Atual

### 1. Verificar se já tem chaves SSH

```bash
# Ver chaves existentes
ls -la ~/.ssh

# Procurar por:
# id_ed25519 / id_ed25519.pub
# id_rsa / id_rsa.pub
```

### 2. Verificar se ssh-agent está rodando

```bash
# Ver processos do ssh-agent
ps aux | grep ssh-agent

# Ou verificar variável de ambiente
echo $SSH_AUTH_SOCK
```

### 3. Testar conexão com GitHub

```bash
# Testar se já está configurado
ssh -T git@github.com
```

**Se funcionar:**

```
Hi LionGab! You've successfully authenticated, but GitHub does not provide shell access.
```

**Se não funcionar:**

```
Permission denied (publickey)
```

---

## 🔑 Configurar SSH no Mac (se necessário)

### Passo 1: Gerar Chave SSH (se não tiver)

```bash
# Gerar chave Ed25519 (recomendado)
ssh-keygen -t ed25519 -C "gabrielvesz_@hotmail.com"

# Quando perguntar:
# - Localização: Enter (usa ~/.ssh/id_ed25519)
# - Senha: Enter (sem senha) ou digite uma senha forte
# - Confirmar senha: Enter novamente ou digite a mesma senha
```

### Passo 2: Iniciar ssh-agent

```bash
# Iniciar ssh-agent
eval "$(ssh-agent -s)"

# Deve mostrar algo como:
# Agent pid 12345
```

### Passo 3: Adicionar Chave ao ssh-agent

```bash
# Adicionar chave
ssh-add ~/.ssh/id_ed25519

# Se pedir senha, digite a passphrase que configurou
```

### Passo 4: Copiar Chave Pública

```bash
# Copiar para clipboard (Mac)
cat ~/.ssh/id_ed25519.pub | pbcopy

# Ou mostrar na tela para copiar manualmente
cat ~/.ssh/id_ed25519.pub
```

### Passo 5: Adicionar Chave no GitHub

1. **Abrir GitHub:** https://github.com/settings/keys
2. **New SSH key** (botão verde)
3. **Title:** `MacBook - Nossa Maternidade`
4. **Key:** Colar chave pública (começa com `ssh-ed25519`)
5. **Add SSH key**

### Passo 6: Testar Conexão

```bash
# Testar conexão
ssh -T git@github.com

# Resposta esperada:
# Hi LionGab! You've successfully authenticated, but GitHub does not provide shell access.
```

---

## 🔄 Usar a Mesma Chave do Windows (Opcional)

Se você quer usar a **mesma chave SSH** no Windows e Mac:

### Opção 1: Copiar Chave do Windows para Mac

**No Windows:**

```bash
# No Git Bash do Windows
cat ~/.ssh/id_ed25519
# Copiar o conteúdo completo (chave privada)
```

**No Mac:**

```bash
# Criar arquivo da chave privada
nano ~/.ssh/id_ed25519
# Colar conteúdo copiado do Windows
# Salvar: Ctrl + O, Enter, Ctrl + X

# Dar permissão correta
chmod 600 ~/.ssh/id_ed25519

# Copiar chave pública também
# (ou gerar a partir da privada)
ssh-keygen -y -f ~/.ssh/id_ed25519 > ~/.ssh/id_ed25519.pub
```

### Opção 2: Chaves Diferentes (Recomendado)

**Melhor prática:** Ter chaves diferentes para Windows e Mac.

1. **Windows:** Já configurada ✅
2. **Mac:** Gerar nova chave (seguir passos acima)
3. **Adicionar ambas no GitHub:**
   - `Windows - Nossa Maternidade`
   - `MacBook - Nossa Maternidade`

---

## 🔧 Configuração Automática no Mac

### Adicionar ao ~/.ssh/config

Criar/editar arquivo de configuração:

```bash
# Criar/editar config
nano ~/.ssh/config
```

**Adicionar:**

```
# GitHub
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519
    IdentitiesOnly yes
    AddKeysToAgent yes
    UseKeychain yes
```

**Salvar:** Ctrl + O, Enter, Ctrl + X

**Dar permissão:**

```bash
chmod 600 ~/.ssh/config
```

### Adicionar Chave ao Keychain (macOS)

```bash
# Adicionar chave ao keychain do macOS
ssh-add --apple-use-keychain ~/.ssh/id_ed25519

# Se pedir senha, digite a passphrase
```

**Vantagem:** Não precisa digitar senha toda vez que reiniciar o Mac.

---

## 🔄 Mudar Repositório para SSH

### Verificar remoto atual

```bash
cd ~/NossaMaternidade  # ou caminho do seu projeto
git remote -v

# Deve mostrar:
# origin  https://github.com/LionGab/NossaMaternidade.git
```

### Mudar para SSH

```bash
# Mudar URL do remoto
git remote set-url origin git@github.com:LionGab/NossaMaternidade.git

# Verificar
git remote -v

# Deve mostrar:
# origin  git@github.com:LionGab/NossaMaternidade.git
```

### Testar Push/Pull

```bash
# Testar pull
git pull

# Se funcionar, SSH está configurado corretamente!
```

---

## 🎯 Comandos Úteis no Mac

### Verificar Status SSH

```bash
# Ver chaves carregadas no agent
ssh-add -l

# Ver todas as chaves
ls -la ~/.ssh/

# Testar conexão GitHub
ssh -T git@github.com
```

### Gerenciar Chaves

```bash
# Adicionar chave ao agent
ssh-add ~/.ssh/id_ed25519

# Remover chave do agent
ssh-add -d ~/.ssh/id_ed25519

# Listar chaves no agent
ssh-add -l

# Limpar todas as chaves
ssh-add -D
```

### Troubleshooting

```bash
# Ver logs detalhados
ssh -vT git@github.com

# Verificar permissões
ls -la ~/.ssh/

# Chave privada deve ter permissão 600
chmod 600 ~/.ssh/id_ed25519

# Chave pública deve ter permissão 644
chmod 644 ~/.ssh/id_ed25519.pub

# Config deve ter permissão 600
chmod 600 ~/.ssh/config
```

---

## ✅ Checklist MacBook

- [ ] Chave SSH gerada (`id_ed25519`)
- [ ] ssh-agent iniciado
- [ ] Chave adicionada ao ssh-agent
- [ ] Chave pública copiada
- [ ] Chave adicionada no GitHub
- [ ] Conexão testada: `ssh -T git@github.com`
- [ ] Config SSH criado (opcional)
- [ ] Chave adicionada ao Keychain (opcional)
- [ ] Repositório mudado para SSH (opcional)

---

## 🔍 Verificar Tudo Está Funcionando

### Teste Completo

```bash
# 1. Verificar chave existe
ls -la ~/.ssh/id_ed25519*

# 2. Verificar chave no agent
ssh-add -l

# 3. Testar conexão
ssh -T git@github.com

# 4. Verificar remoto (se mudou para SSH)
cd ~/NossaMaternidade
git remote -v

# 5. Testar pull
git pull
```

**Se tudo funcionar, está configurado!** ✅

---

## 🚨 Solução de Problemas

### Erro: "Permission denied (publickey)"

**Causas possíveis:**

1. Chave não adicionada no GitHub
2. Chave não carregada no ssh-agent
3. Permissões incorretas

**Solução:**

```bash
# 1. Verificar chave existe
ls -la ~/.ssh/id_ed25519*

# 2. Adicionar ao agent
ssh-add ~/.ssh/id_ed25519

# 3. Verificar se está no agent
ssh-add -l

# 4. Verificar se está no GitHub
# Acessar: https://github.com/settings/keys

# 5. Testar novamente
ssh -T git@github.com
```

### Erro: "Could not resolve hostname"

**Causa:** Problema de rede ou DNS.

**Solução:**

```bash
# Testar conectividade
ping github.com

# Verificar DNS
nslookup github.com

# Tentar com IP direto (não recomendado, mas para teste)
ssh -T git@140.82.121.3
```

### Chave não persiste após reiniciar Mac

**Solução:** Adicionar ao Keychain

```bash
# Adicionar ao keychain
ssh-add --apple-use-keychain ~/.ssh/id_ed25519

# Adicionar ao ~/.ssh/config
echo "AddKeysToAgent yes" >> ~/.ssh/config
echo "UseKeychain yes" >> ~/.ssh/config
```

---

## 📝 Resumo Rápido

### Primeira Vez no Mac

```bash
# 1. Gerar chave
ssh-keygen -t ed25519 -C "gabrielvesz_@hotmail.com"

# 2. Iniciar agent
eval "$(ssh-agent -s)"

# 3. Adicionar chave
ssh-add ~/.ssh/id_ed25519

# 4. Copiar chave pública
cat ~/.ssh/id_ed25519.pub | pbcopy

# 5. Adicionar no GitHub (https://github.com/settings/keys)

# 6. Testar
ssh -T git@github.com
```

---

**Última atualização:** 16/12/2025
