# Configurações Cursor para MacBook M1 8GB RAM

Este documento contém as configurações otimizadas para melhorar o desempenho do Cursor no MacBook M1 com 8GB de RAM.

## 📋 Índice

1. [Configuração Rápida do CLI](#configuração-rápida-do-cli)
2. [Configurações Aplicadas](#configurações-aplicadas)
3. [Monitoramento de Recursos](#monitoramento-de-recursos)
4. [Solução de Problemas](#solução-de-problemas)
5. [Verificação de Configurações](#verificação-de-configurações)

## 🚀 Configuração Rápida do CLI

Se o comando `cursor` não funcionar no terminal, execute este comando:

```bash
echo 'export PATH="$PATH:/Applications/Cursor.app/Contents/Resources/app/bin"' >> ~/.zshrc && source ~/.zshrc && cursor --version
```

Ou siga os passos em: `docs/CURSOR_CLI_SETUP_INSTRUCTIONS.md`

Depois de configurar, você poderá usar comandos como:
- `cursor --version`
- `cursor --list-extensions`
- `cursor .` (abrir projeto atual)

## ✅ Configurações Aplicadas

### Arquivos Criados

- **`.cursorrules`** - Regras e padrões do projeto
- **`.vscode/settings.json`** - Configurações otimizadas do editor
- **`docs/CURSOR_MACBOOK_M1_SETUP.md`** - Esta documentação

### Otimizações Implementadas

#### 1. Performance e Recursos

- ✅ **TypeScript Server**: Limite de memória configurado para 4GB
- ✅ **File Watcher**: Excluídos diretórios pesados (node_modules, .expo, dist, build)
- ✅ **Editor**: Desabilitados recursos visuais desnecessários (minimap, smooth scrolling)
- ✅ **Git**: Autofetch desabilitado para reduzir overhead
- ✅ **Extensions**: Auto-update desabilitado

#### 2. Rede/HTTP

- ✅ **HTTP/2 Desabilitado**: `cursor.general.disableHttp2: true`
  - Ajuda em problemas de conexão e indexação
  - Útil para VPN/Proxy corporativo

#### 3. TypeScript

- ✅ **Watch Options**: Excluídos diretórios desnecessários
- ✅ **Import Organization**: Automático no save
- ✅ **Memory Limit**: 4GB para tsserver

#### 4. ESLint & Prettier

- ✅ **Cache Habilitado**: Reduz tempo de análise
- ✅ **Format on Save**: Automático
- ✅ **Auto Fix**: Automático no save

## 🔍 Monitoramento de Recursos

### Verificar Extensões

1. Abra o Command Palette: `Cmd + Shift + P`
2. Digite: `Developer: Open Extension Monitor`
3. Identifique extensões consumindo muitos recursos
4. Desabilite extensões desnecessárias

### Verificar Processos

1. Abra o Command Palette: `Cmd + Shift + P`
2. Digite: `Developer: Open Process Explorer`
3. Identifique processos com alto uso de CPU/RAM

### Monitor de Atividade (macOS)

**Importante**: Existe um bug conhecido no macOS que pode mostrar valores incorretos de uso de RAM no Cursor.

Para verificar o uso real de memória:
1. Abra o **Activity Monitor** (Monitor de Atividade)
2. Vá para a aba **"Memory"**
3. Procure por processos do Cursor
4. Verifique o uso real de memória

## 🛠️ Solução de Problemas

### Problema: Cursor Lento

**Soluções**:
1. Verifique extensões pesadas no Extension Monitor
2. Teste sem extensões: `cursor --disable-extensions` no terminal
3. Verifique processos no Process Explorer
4. Reinicie o Cursor

### Problema: Indexação Lenta

**Soluções**:
1. Verifique se os diretórios estão excluídos em `files.watcherExclude`
2. Limpe o cache: `Cmd + Shift + P` → `Developer: Reload Window`
3. Verifique espaço em disco (importante para atualizações)

### Problema: Problemas de Rede/HTTP

**Soluções**:
1. Verifique se `cursor.general.disableHttp2` está `true`
2. Execute diagnóstico: `Cursor Settings > Network > Run Diagnostics`
3. Se em rede corporativa, configure proxy nas configurações do sistema

### Problema: TypeScript Lento

**Soluções**:
1. Verifique se `typescript.tsserver.maxTsServerMemory` está configurado
2. Verifique se `typescript.tsserver.watchOptions` exclui diretórios corretos
3. Reinicie o TypeScript Server: `Cmd + Shift + P` → `TypeScript: Restart TS Server`

## ✅ Verificação de Configurações

### Verificar se Configurações Estão Aplicadas

Execute o script de verificação:

```bash
bash scripts/check-cursor-config.sh
```

Ou verifique manualmente:

1. **Arquivo `.cursorrules`** existe na raiz do projeto
2. **Arquivo `.vscode/settings.json`** existe e contém as configurações
3. **HTTP/2 desabilitado**: Verifique em `Cursor Settings` → Busque por "HTTP/2"

### Comandos Úteis

#### Configurar CLI do Cursor (Primeira vez)

Se o comando `cursor` não for encontrado no terminal:

```bash
# Executar script de configuração
bash scripts/setup-cursor-cli.sh
```

Ou configure manualmente:

```bash
# Adicionar ao PATH (adicione ao ~/.zshrc ou ~/.bash_profile)
export PATH="$PATH:/Applications/Cursor.app/Contents/Resources/app/bin"

# Recarregar shell
source ~/.zshrc  # ou source ~/.bash_profile
```

#### Comandos do Cursor (após configurar CLI)

```bash
# Verificar versão
cursor --version

# Verificar extensões instaladas
cursor --list-extensions

# Testar sem extensões
cursor --disable-extensions

# Abrir projeto atual
cursor .

# Abrir arquivo específico
cursor arquivo.ts
```

#### Verificar Processos (macOS)

```bash
# Ver processos do Cursor
ps aux | grep -i cursor | grep -v grep

# Ver uso de memória (Activity Monitor)
open -a "Activity Monitor"

# Ou via terminal (requer permissões)
top -pid $(pgrep -f "Cursor.app")
```

## 📝 Notas Importantes

### MacBook M1 8GB RAM

- **Monitoramento**: Use Activity Monitor para verificar uso real de RAM
- **Espaço em Disco**: Mantenha pelo menos 20GB livres para atualizações
- **Extensões**: Desabilite extensões não essenciais
- **Temas**: Use temas leves para economizar recursos

### VPN/Proxy Corporativo

Se estiver em rede corporativa:
- Configure `cursor.general.disableHttp2: true` (já aplicado)
- Configure proxy nas configurações do sistema macOS
- Verifique firewall corporativo

## 🎯 Otimização de Memória

Para otimizações específicas baseadas em análise do Monitor de Atividade, consulte:

**📄 [`docs/CURSOR_MEMORY_OPTIMIZATION.md`](./CURSOR_MEMORY_OPTIMIZATION.md)**

Este documento contém:
- Análise detalhada do uso de memória (~1,8GB atual)
- Otimizações específicas para Renderer (831MB) e Extension Host (267MB)
- Meta de redução para ~1,2-1,4GB
- Checklist de otimização
- Práticas recomendadas diárias/semanais/mensais

## 🔄 Atualizações

Este documento será atualizado conforme novas otimizações forem identificadas.

**Última atualização**: 2025-12-16

## 📚 Referências

- [Cursor Documentation](https://cursor.sh/docs)
- [VS Code Performance](https://code.visualstudio.com/docs/getstarted/performance)
- [TypeScript Performance](https://github.com/microsoft/TypeScript/wiki/Performance)

