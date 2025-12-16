# Instruções Rápidas: Configurar CLI do Cursor

## 🚀 Método Rápido (Copiar e Colar)

Execute este comando no seu terminal:

```bash
echo 'export PATH="$PATH:/Applications/Cursor.app/Contents/Resources/app/bin"' >> ~/.zshrc && source ~/.zshrc && cursor --version
```

Isso vai:
1. ✅ Adicionar o Cursor ao PATH
2. ✅ Recarregar o shell
3. ✅ Testar se funcionou

## 📋 Método Passo a Passo

### 1. Adicionar ao PATH

```bash
echo 'export PATH="$PATH:/Applications/Cursor.app/Contents/Resources/app/bin"' >> ~/.zshrc
```

### 2. Recarregar o shell

```bash
source ~/.zshrc
```

### 3. Testar

```bash
cursor --version
cursor --list-extensions
```

## ✅ Verificar se Funcionou

Se você ver a versão do Cursor, está tudo certo! 🎉

```bash
cursor --version
# Deve mostrar algo como: 0.xx.x
```

## 🔧 Comandos Úteis do Cursor

```bash
# Abrir projeto atual
cursor .

# Abrir arquivo específico
cursor arquivo.ts

# Listar extensões instaladas
cursor --list-extensions

# Abrir sem extensões (para debug)
cursor --disable-extensions
```

## ❌ Se Não Funcionar

### Verificar se o Cursor está instalado:

```bash
ls -la /Applications/Cursor.app
```

### Verificar se o binário existe:

```bash
ls -la /Applications/Cursor.app/Contents/Resources/app/bin/cursor
```

### Verificar PATH atual:

```bash
echo $PATH | grep -i cursor
```

### Adicionar manualmente ao ~/.zshrc:

1. Abra o arquivo:
   ```bash
   nano ~/.zshrc
   ```

2. Adicione esta linha no final:
   ```bash
   export PATH="$PATH:/Applications/Cursor.app/Contents/Resources/app/bin"
   ```

3. Salve (Ctrl+O, Enter, Ctrl+X)

4. Recarregue:
   ```bash
   source ~/.zshrc
   ```

## 📚 Mais Informações

Consulte: `docs/CURSOR_MACBOOK_M1_SETUP.md`

