# Figma MCP Server Setup

Guia para configurar o Figma Dev Mode MCP Server para design-to-code.

## Pre-requisitos

1. **Figma Desktop App** instalado e aberto
2. **Figma account** com acesso ao arquivo de design
3. **Dev Mode** habilitado no Figma (Pricing: Free para visualizar, Pro/Enterprise para editar)

## Instalacao

### Passo 1: Habilitar MCP no Figma Desktop

1. Abra o Figma Desktop App
2. Va em **Figma > Preferences > Developer** (ou Cmd+,)
3. Habilite **"Enable Dev Mode MCP Server"**
4. O servidor roda em `http://127.0.0.1:3845/sse`

### Passo 2: Configurar no Claude Code

```bash
# Adicionar o Figma MCP Server
claude mcp add figma-local --transport sse http://127.0.0.1:3845/sse
```

Ou adicionar manualmente em `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "figma-local": {
      "transport": "sse",
      "url": "http://127.0.0.1:3845/sse"
    }
  }
}
```

### Passo 3: Verificar Conexao

```bash
claude mcp list
# Deve mostrar: figma-local (connected)
```

## Ferramentas Disponiveis

Apos configurar, voce tera acesso a:

### `figma_get_file`
Obter informacoes do arquivo Figma aberto.

### `figma_get_node`
Obter detalhes de um no especifico (componente, frame).

### `figma_get_styles`
Obter estilos de cores, tipografia, efeitos.

### `figma_get_components`
Listar todos os componentes do arquivo.

### `figma_get_variables`
Obter design tokens/variaveis.

### `figma_screenshot`
Capturar screenshot de um frame ou componente.

## Uso com Nossa Maternidade

### 1. Obter Cores do Design

```
Figma, me de as cores primarias do arquivo aberto
```

### 2. Gerar Componente

```
Figma, gere o componente React Native para o card "FeatureCard" usando nosso design-system
```

### 3. Validar Implementacao

```
Figma, compare o frame "HomeScreen" com minha implementacao em src/screens/HomeScreen.tsx
```

## Melhores Praticas

1. **Organize seu Figma**: Componentes bem nomeados geram codigo melhor
2. **Use Auto Layout**: Traduz melhor para Flexbox
3. **Defina Variables**: Design tokens no Figma = tokens no codigo
4. **Nomeie Layers**: Nomes semanticos viram props/classNames

## Troubleshooting

### MCP nao conecta
- Verifique se Figma Desktop esta aberto
- Verifique se Dev Mode MCP esta habilitado
- Reinicie o Figma Desktop

### Arquivo nao aparece
- Abra o arquivo no Figma antes de usar MCP
- Verifique permissoes de acesso ao arquivo

### Estilos incorretos
- Atualize para ultima versao do Figma Desktop
- Verifique se o arquivo usa Variables (nao Styles antigos)

## Alternativa: Figma API (sem Desktop)

Se nao tiver Figma Desktop, use a API REST:

```bash
# Gerar Personal Access Token em figma.com/developers
export FIGMA_ACCESS_TOKEN="seu_token"

# Usar com MCP HTTP
claude mcp add figma-api --transport http https://api.figma.com/v1
```

## Referencias

- [Figma Dev Mode MCP](https://www.figma.com/developers/mcp)
- [MCP Protocol](https://modelcontextprotocol.io)
- [Claude Code + Figma](https://www.builder.io/blog/claude-code-figma-mcp-server)
