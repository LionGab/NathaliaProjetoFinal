# Otimização de Memória - Cursor no MacBook M1 8GB RAM

**Data**: 2025-12-16  
**Análise Baseada em**: Monitor de Atividade do macOS

## 📊 Análise do Uso Atual

### Uso Total de RAM do Cursor: ~1,8 GB

**Processos mais pesados identificados:**

1. 🔴 **Cursor Helper (Renderer)**: 831,5 MB - **ALTO**
   - Renderiza a interface do Cursor
   - **Prioridade máxima de otimização**

2. 🟡 **Cursor Helper (Plugin)**: extension-host: 267 MB
   - Processo de extensões
   - Consumindo 1,1% CPU
   - **Segunda prioridade**

3. 🟢 **Cursor Helper (GPU)**: 199,2 MB
   - Processamento gráfico

4. 🟢 **Cursor Helper**: shared-process: 92,8 MB
   - Processo compartilhado

## 🎯 Meta de Otimização

**Reduzir de ~1,8GB para ~1,2-1,4GB** (economia de 400-600MB)

## 🔧 Otimizações Aplicadas

### 1. ✅ Otimizar Renderer (831 MB → Meta: ~600 MB)

**Configurações aplicadas em `.vscode/settings.json`:**

```json
{
  // Reduzir renderização desnecessária
  "editor.minimap.enabled": false,
  "editor.renderWhitespace": "selection",
  "editor.smoothScrolling": false,
  "workbench.editor.enablePreview": false,
  
  // Desabilitar animações
  "editor.cursorSmoothCaretAnimation": false,
  
  // Tema leve (já configurado)
  "workbench.colorTheme": "Default Dark+"
}
```

**Ações manuais recomendadas:**

- ✅ Feche abas/painéis não utilizados
- ✅ Reduza número de janelas/splits abertos
- ✅ Use tema mais leve (temas escuros geralmente usam menos recursos)
- ✅ Desabilite animações desnecessárias nas configurações do Cursor

### 2. ✅ Otimizar Extension Host (267 MB → Meta: ~150 MB)

**Este é o maior ganho potencial! 🚀**

#### Verificar Extensões Instaladas

1. Abra o Extension Monitor:
   ```
   Cmd + Shift + P → Developer: Open Extension Monitor
   ```

2. Ative o Beta (requer restart):
   ```
   Settings > Cursor Settings > Beta > Extension RPC Tracer
   ```

3. Identifique extensões pesadas:
   - Procure por extensões usando >50MB
   - Verifique uso de CPU

#### Ações Recomendadas

**Desabilite extensões não essenciais:**
- Extensões de tema não utilizadas
- Extensões de formatação duplicadas
- Extensões de linting redundantes
- Extensões de Git não essenciais

**Desinstale extensões desnecessárias:**
- Temas não utilizados
- Extensões experimentais
- Extensões antigas não atualizadas

**Teste sem extensões:**
```bash
cursor --disable-extensions
```

### 3. ✅ File Watcher Otimizado

**Configurações aplicadas:**

```json
{
  "files.watcherExclude": {
    "**/.git/objects/**": true,
    "**/.git/subtree-cache/**": true,
    "**/node_modules/**": true,
    "**/.expo/**": true,
    "**/dist/**": true,
    "**/build/**": true,
    "**/.next/**": true,
    "**/.vscode/**": true
  },
  
  "files.exclude": {
    "**/.git": true,
    "**/.DS_Store": true,
    "**/node_modules": true
  }
}
```

### 4. ✅ Terminal Otimizado para M1

**Configurações aplicadas:**

```json
{
  "terminal.integrated.gpuAcceleration": "off",
  "terminal.integrated.profiles.osx": {
    "zsh": {
      "path": "/bin/zsh",
      "args": ["-l"]
    }
  }
}
```

### 5. ✅ TypeScript Server Otimizado

**Já configurado:**
- Limite de memória: 4GB
- Watch options excluindo diretórios pesados
- Cache habilitado

## 📈 Monitoramento Contínuo

### Process Explorer

Abra para monitorar processos em tempo real:

```
Cmd + Shift + P → Developer: Open Process Explorer
```

**Monitore especialmente:**
- `extensionHost` (suas extensões)
- `ptyHost` (terminais)
- `renderer` (interface)

### Activity Monitor (macOS)

Para ver uso real de RAM:

```bash
open -a "Activity Monitor"
```

Ou via terminal:
```bash
top -pid $(pgrep -f "Cursor.app")
```

## ✅ Práticas Recomendadas

### Diárias

- ✅ **Feche projetos grandes** quando não estiver usando
- ✅ **Limite arquivos abertos** simultaneamente (< 10 arquivos)
- ✅ **Limpe histórico de chat** periodicamente (pode ocupar espaço)
- ✅ **Reinicie o Cursor** diariamente se usar por muitas horas

### Semanais

- ✅ **Revise extensões instaladas** e desabilite não utilizadas
- ✅ **Limpe cache** se necessário: `Cmd + Shift + P → Developer: Reload Window`
- ✅ **Verifique espaço em disco** (mantenha 10-15GB livres)

### Mensais

- ✅ **Atualize extensões** (mas desabilite auto-update)
- ✅ **Revise configurações** de performance
- ✅ **Limpe projetos** não utilizados do workspace

## 🎯 Checklist de Otimização

Use este checklist para garantir máxima performance:

- [ ] Renderer otimizado (minimap off, preview off, animações off)
- [ ] Extension Host otimizado (< 5 extensões essenciais)
- [ ] File Watcher configurado (excluindo node_modules, .expo, etc)
- [ ] Terminal otimizado (GPU acceleration off)
- [ ] TypeScript Server limitado (4GB)
- [ ] Git autofetch desabilitado
- [ ] Tema leve aplicado
- [ ] Projetos grandes fechados quando não em uso
- [ ] Arquivos abertos limitados (< 10)
- [ ] Espaço em disco suficiente (> 10GB)

## 📊 Resultados Esperados

### Antes das Otimizações
- Renderer: 831 MB
- Extension Host: 267 MB
- GPU: 199 MB
- Shared Process: 93 MB
- **Total: ~1,8 GB**

### Depois das Otimizações (Meta)
- Renderer: ~600 MB (-230 MB)
- Extension Host: ~150 MB (-117 MB)
- GPU: ~150 MB (-49 MB)
- Shared Process: ~80 MB (-13 MB)
- **Total: ~1,0-1,2 GB** (-600-800 MB)

## 🚨 Prioridade Máxima

**Reduza o número de extensões ativas - esse é o maior ganho potencial! 🚀**

Cada extensão desabilitada pode economizar 10-50MB de RAM.

## 📚 Referências

- [Cursor Performance Docs](https://cursor.sh/docs)
- [VS Code Performance Tips](https://code.visualstudio.com/docs/getstarted/performance)
- [Extension Performance Guide](https://code.visualstudio.com/api/advanced-topics/extension-host)

## 🔄 Atualizações

Este documento será atualizado conforme novas otimizações forem identificadas.

**Última atualização**: 2025-12-16

