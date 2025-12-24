# 🪟 Configuração Completa do Cursor - Windows

**Data de Criação**: 2025-01-17  
**Propósito**: Guia completo para configurar o Cursor no Windows com as mesmas configurações do MacBook  
**Status**: ✅ Configuração completa e testada

---

## 📋 Índice

1. [Instalação do Cursor](#instalação)
2. [Configurações Globais](#configurações-globais)
3. [Configurações do Workspace](#configurações-do-workspace)
4. [Extensões Essenciais](#extensões-essenciais)
5. [MCP Servers](#mcp-servers)
6. [Arquivos de Configuração](#arquivos-de-configuração)
7. [Sincronização de Conta](#sincronização-de-conta)
8. [Troubleshooting](#troubleshooting)

---

## 🚀 Instalação do Cursor

### 1. Download e Instalação

1. **Baixar Cursor**:
   - Acesse: https://cursor.sh/
   - Clique em "Download for Windows"
   - Execute o instalador `.exe`

2. **Instalar**:
   - Siga o assistente de instalação
   - Recomendado: Marcar "Add to PATH" durante instalação

3. **Verificar Instalação**:
   ```powershell
   cursor --version
   ```

---

## ⚙️ Configurações Globais

### Localização no Windows

As configurações globais do Cursor ficam em:
```
%APPDATA%\Cursor\User\settings.json
```

**Caminho completo**:
```
C:\Users\SEU_USUARIO\AppData\Roaming\Cursor\User\settings.json
```

### Configurações Recomendadas

Crie/edite o arquivo `settings.json` com o seguinte conteúdo:

```json
{
  "window.commandCenter": true,
  "terminal.integrated.sendKeybindingsToShell": true,
  "claudeCode.preferredLocation": "panel",
  "claudeCode.selectedModel": "haiku",
  "git.autofetch": true,
  "update.releaseTrack": "prerelease",
  "gitlens.ai.model": "gitkraken",
  "gitlens.ai.gitkraken.model": "gemini:gemini-2.0-flash",
  "claudeCode.allowDangerouslySkipPermissions": true,
  "claudeCode.initialPermissionMode": "bypassPermissions",
  "claudeCode.disableLoginPrompt": true,
  "workbench.editor.autoLockGroups": {
    "mainThreadWebview-browserPreview": false
  },
  "redhat.telemetry.enabled": true,
  "mcpServers": {
    "expo-mcp": {
      "description": "Expo MCP Server para builds iOS/Android",
      "transport": "http",
      "url": "https://mcp.expo.dev/mcp"
    },
    "context7": {
      "description": "Documentação atualizada de libraries",
      "command": "npx",
      "args": [
        "-y",
        "@upstash/context7-mcp"
      ]
    },
    "memory-keeper": {
      "description": "Persistência de contexto entre sessões",
      "command": "npx",
      "args": [
        "-y",
        "mcp-memory-keeper"
      ],
      "env": {
        "MCP_MEMORY_DB_PATH": ".claude/context.db"
      }
    },
    "playwright": {
      "description": "Testes visuais automatizados",
      "command": "npx",
      "args": [
        "-y",
        "@anthropic/mcp-server-playwright"
      ]
    }
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "files.watcherExclude": {
    "**/node_modules/**": true,
    "**/.expo/**": true,
    "**/ios/Pods/**": true,
    "**/android/.gradle/**": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/bun.lock": true,
    "**/.expo": true
  },
  "editor.codeActions.triggerOnFocusChange": true
}
```

**⚠️ Nota**: No Windows, ajuste os caminhos se necessário. O Cursor geralmente normaliza automaticamente.

---

## 📁 Configurações do Workspace

### Arquivos Necessários

O projeto já contém os arquivos de configuração necessários:

1. **`.cursorrules`** - Regras do projeto (já existe)
2. **`.cursorignore`** - Arquivos a ignorar na indexação (já existe)
3. **`.vscode/settings.json`** - Configurações do workspace (já existe)
4. **`.vscode/extensions.json`** - Extensões recomendadas (já existe)

### Verificar se Existem

```powershell
# No diretório do projeto
cd C:\caminho\para\NossaMaternidade

# Verificar arquivos
Test-Path .cursorrules
Test-Path .cursorignore
Test-Path .vscode\settings.json
Test-Path .vscode\extensions.json
```

Se algum arquivo não existir, copie do repositório Git.

---

## 🔌 Extensões Essenciais

### Instalação Automática

O arquivo `.vscode/extensions.json` já está configurado. O Cursor deve sugerir instalar automaticamente ao abrir o projeto.

### Lista de Extensões Recomendadas

| Extensão | ID | Propósito |
|----------|-----|-----------|
| **Claude Code** | `anthropic.claude-code` | IA integrada |
| **ESLint** | `dbaeumer.vscode-eslint` | Linting TypeScript/JS |
| **Prettier** | `esbenp.prettier-vscode` | Formatação automática |
| **Tailwind CSS** | `bradlc.vscode-tailwindcss` | IntelliSense Tailwind |
| **GitLens** | `eamodio.gitlens` | Git integrado |
| **Expo Tools** | `expo.vscode-expo-tools` | Ferramentas Expo |
| **React Native** | `msjsdiag.vscode-react-native` | Suporte RN |
| **TypeScript** | `ms-vscode.vscode-typescript-next` | TypeScript |
| **Path IntelliSense** | `christian-kohler.path-intellisense` | Autocomplete paths |
| **NPM IntelliSense** | `christian-kohler.npm-intellisense` | Autocomplete imports |
| **Auto Rename Tag** | `formulahendry.auto-rename-tag` | Renomear tags HTML |
| **Better Comments** | `aaron-bond.better-comments` | Comentários coloridos |
| **Git Graph** | `mhutchie.git-graph` | Visualização Git |

### Instalar Manualmente

```powershell
# Via Cursor CLI (se disponível)
cursor --install-extension dbaeumer.vscode-eslint
cursor --install-extension esbenp.prettier-vscode
cursor --install-extension bradlc.vscode-tailwindcss
cursor --install-extension eamodio.gitlens
cursor --install-extension expo.vscode-expo-tools
cursor --install-extension msjsdiag.vscode-react-native
cursor --install-extension christian-kohler.path-intellisense
cursor --install-extension christian-kohler.npm-intellisense
cursor --install-extension formulahendry.auto-rename-tag
cursor --install-extension aaron-bond.better-comments
cursor --install-extension mhutchie.git-graph
```

**OU** via interface do Cursor:
1. Abra o Cursor
2. Pressione `Ctrl+Shift+X` (Extensions)
3. Busque cada extensão pelo nome
4. Clique em "Install"

---

## 🔧 MCP Servers

### Configuração

Os MCP Servers são configurados no `settings.json` global (veja seção acima).

### Servers Configurados

1. **expo-mcp** - Builds iOS/Android via Expo
2. **context7** - Documentação atualizada de libraries
3. **memory-keeper** - Persistência de contexto
4. **playwright** - Testes visuais automatizados

### Verificar Funcionamento

Após configurar, reinicie o Cursor e verifique:

1. Abra Command Palette (`Ctrl+Shift+P`)
2. Digite "MCP" ou "Model Context Protocol"
3. Deve aparecer opções relacionadas aos servers

### Troubleshooting MCP

**Problema**: MCP servers não aparecem

**Solução**:
1. Verifique se Node.js está instalado: `node --version`
2. Verifique se `npx` funciona: `npx --version`
3. Reinicie o Cursor completamente
4. Verifique logs: `Ctrl+Shift+P` → "Output" → Selecione "MCP"

---

## 📄 Arquivos de Configuração

### 1. `.cursorrules`

Este arquivo contém as regras do projeto. **Já existe no repositório**.

**Localização**: Raiz do projeto (`NossaMaternidade/.cursorrules`)

**Conteúdo**: Regras TypeScript, logging, design system, etc.

### 2. `.cursorignore`

Este arquivo otimiza a indexação do Cursor, reduzindo uso de memória.

**Localização**: Raiz do projeto (`NossaMaternidade/.cursorignore`)

**Conteúdo**: Exclui `node_modules`, builds, vídeos grandes, etc.

### 3. `.vscode/settings.json`

Configurações específicas do workspace.

**Localização**: `NossaMaternidade/.vscode/settings.json`

**Conteúdo**: Veja arquivo completo em `.vscode/settings.json` do projeto.

**Configurações principais**:
- TypeScript: Usa workspace TypeScript, imports relativos
- Formatação: Prettier ao salvar, ESLint auto-fix
- Performance: File watcher otimizado, minimap desabilitado
- Tailwind: IntelliSense para `cn()` e `cva()`
- Git: Auto-fetch desabilitado, GitLens otimizado
- Cursor AI: Modelo Claude 3.5 Sonnet, auto-approve habilitado

**Arquivo completo**: Ver `.vscode/settings.json` no repositório (226 linhas de configurações otimizadas)

### 4. `.vscode/extensions.json`

Extensões recomendadas para o projeto.

**Localização**: `NossaMaternidade/.vscode/extensions.json`

**Conteúdo**:
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "eamodio.gitlens"
  ]
}
```

**Nota**: O Cursor deve sugerir instalar automaticamente ao abrir o projeto.

---

## 🔐 Sincronização de Conta

### Login no Cursor

1. **Abrir Cursor**
2. **Fazer Login**:
   - Clique no ícone de perfil (canto superior direito)
   - Selecione "Sign In"
   - Use a **mesma conta** do MacBook

### Sincronização Automática

O Cursor sincroniza automaticamente:
- ✅ Configurações globais
- ✅ Extensões instaladas
- ✅ Keybindings
- ✅ Snippets
- ✅ Histórico de comandos

**⚠️ Não sincroniza**:
- ❌ Configurações locais do workspace (`.vscode/settings.json`)
- ❌ Arquivos do projeto (`.cursorrules`, `.cursorignore`)
- ❌ MCP Servers (precisa configurar manualmente)

### Verificar Sincronização

Após login, verifique:

1. **Configurações**: Devem aparecer as mesmas do MacBook
2. **Extensões**: Devem ser sugeridas automaticamente
3. **Histórico**: Comandos recentes devem aparecer

---

## 🛠️ Troubleshooting

### Problema 1: Cursor não reconhece `.cursorrules`

**Sintoma**: Cursor não segue as regras do projeto

**Solução**:
1. Verifique se `.cursorrules` existe na raiz do projeto
2. Reinicie o Cursor
3. Abra o projeto pela pasta raiz (não subpasta)

### Problema 2: MCP Servers não funcionam

**Sintoma**: Erro ao usar MCP features

**Solução**:
1. Verifique Node.js: `node --version` (deve ser v22.x)
2. Verifique `npx`: `npx --version`
3. Verifique configuração em `settings.json` global
4. Reinicie o Cursor completamente

### Problema 3: Extensões não instalam automaticamente

**Sintoma**: Extensões recomendadas não aparecem

**Solução**:
1. Verifique se `.vscode/extensions.json` existe
2. Abra Command Palette (`Ctrl+Shift+P`)
3. Digite "Extensions: Show Recommended Extensions"
4. Instale manualmente se necessário

### Problema 4: Uso excessivo de memória

**Sintoma**: Cursor usando muita RAM (>5GB)

**Solução**:
1. Verifique se `.cursorignore` existe e está correto
2. Reinicie o Cursor
3. Feche projetos não utilizados
4. Limpe cache: `Ctrl+Shift+P` → "Developer: Reload Window"

### Problema 5: TypeScript não funciona

**Sintoma**: Erros de TypeScript, IntelliSense não funciona

**Solução**:
1. Verifique se `node_modules/typescript` existe
2. Execute: `npm install` ou `bun install`
3. Verifique `settings.json`: `"typescript.tsdk": "node_modules/typescript/lib"`
4. Reinicie TypeScript Server: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

### Problema 6: Prettier não formata

**Sintoma**: Arquivos não formatam ao salvar

**Solução**:
1. Verifique se Prettier está instalado: `npm list prettier`
2. Verifique extensão: `esbenp.prettier-vscode` instalada
3. Verifique `settings.json`: `"editor.formatOnSave": true`
4. Verifique `settings.json`: `"editor.defaultFormatter": "esbenp.prettier-vscode"`

---

## ✅ Checklist de Configuração

Após seguir este guia, verifique:

- [ ] Cursor instalado e funcionando
- [ ] Login realizado com mesma conta do MacBook
- [ ] Configurações globais aplicadas (`settings.json`)
- [ ] Extensões essenciais instaladas
- [ ] MCP Servers configurados e funcionando
- [ ] `.cursorrules` presente na raiz do projeto
- [ ] `.cursorignore` presente na raiz do projeto
- [ ] `.vscode/settings.json` presente no projeto
- [ ] `.vscode/extensions.json` presente no projeto
- [ ] TypeScript funcionando corretamente
- [ ] Prettier formatando ao salvar
- [ ] ESLint funcionando
- [ ] Git integrado (GitLens)

---

## 📚 Referências

- **Cursor Docs**: https://docs.cursor.sh/
- **VS Code Settings**: https://code.visualstudio.com/docs/getstarted/settings
- **MCP Documentation**: https://modelcontextprotocol.io/

---

## 🎯 Próximos Passos

Após configurar o Cursor:

1. ✅ Abrir projeto: `cursor .` (no diretório do projeto)
2. ✅ Verificar extensões instaladas
3. ✅ Testar TypeScript: Abrir arquivo `.ts` e verificar IntelliSense
4. ✅ Testar Prettier: Salvar arquivo e verificar formatação
5. ✅ Testar GitLens: Ver histórico de commits
6. ✅ Testar Claude Code: Abrir chat (`Ctrl+L`)

---

**Última atualização**: 2025-01-17  
**Versão**: 1.0.0  
**Status**: ✅ Completo e pronto para uso

