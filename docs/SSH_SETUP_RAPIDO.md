# 🔐 SSH Setup Rápido - Próximos Passos

## ✅ Chave SSH Gerada!

Sua chave pública foi gerada com sucesso:

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIE5hUm0+AyXDi/Txswu3JR7AE57knhulF3tGv2uJGTbT gabrielvesz_@hotmail.com
```

---

## 📋 Passo a Passo (Execute no Git Bash)

### 1. Adicionar Chave ao SSH Agent

**No Git Bash (não PowerShell):**

```bash
# Iniciar ssh-agent
eval "$(ssh-agent -s)"

# Adicionar chave
ssh-add ~/.ssh/id_ed25519
```

**Se pedir senha:** Digite a passphrase que você configurou (ou Enter se não tiver).

### 2. Copiar Chave Pública

```bash
# Copiar chave para clipboard (Windows)
cat ~/.ssh/id_ed25519.pub | clip

# Ou mostrar na tela para copiar manualmente
cat ~/.ssh/id_ed25519.pub
```

**Sua chave pública:**

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIE5hUm0+AyXDi/Txswu3JR7AE57knhulF3tGv2uJGTbT gabrielvesz_@hotmail.com
```

### 3. Adicionar Chave no GitHub

1. **Abrir GitHub** → https://github.com/settings/keys
2. **New SSH key** (botão verde)
3. **Title:** `Windows - Nossa Maternidade`
4. **Key:** Colar a chave pública (começa com `ssh-ed25519`)
5. **Add SSH key**

### 4. Testar Conexão

```bash
# Testar conexão com GitHub
ssh -T git@github.com
```

**Resposta esperada:**

```
Hi LionGab! You've successfully authenticated, but GitHub does not provide shell access.
```

✅ **Se aparecer isso, está funcionando!**

---

## 🔄 Mudar Repositório para SSH (Opcional)

Se quiser usar SSH ao invés de HTTPS:

```bash
# Ver remoto atual
git remote -v

# Mudar para SSH
git remote set-url origin git@github.com:LionGab/NossaMaternidade.git

# Verificar
git remote -v
```

---

## ⚠️ Importante

- **Execute comandos no Git Bash**, não no PowerShell
- Se o ssh-agent não funcionar, pode pular essa etapa
- A chave pública já está pronta para adicionar no GitHub

---

## ✅ Checklist

- [x] Chave SSH gerada
- [ ] Chave adicionada ao ssh-agent (opcional)
- [ ] Chave pública copiada
- [ ] Chave adicionada no GitHub
- [ ] Conexão testada: `ssh -T git@github.com`
- [ ] Repositório mudado para SSH (opcional)

---

**Próximo passo:** Adicione a chave pública no GitHub e teste a conexão!
