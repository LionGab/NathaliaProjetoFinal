# ⚙️ Configurações Ideais do Projeto

## Resumo

Este documento descreve todas as configurações ideais implementadas no projeto Nossa Maternidade.

## Configurações Implementadas

### 1. TypeScript (`tsconfig.json`) ✅

**Melhorias aplicadas:**
- ✅ `strict: true` - Type checking rigoroso
- ✅ `noUnusedLocals: true` - Detecta variáveis não usadas
- ✅ `noUnusedParameters: true` - Detecta parâmetros não usados
- ✅ `noImplicitReturns: true` - Garante retorno explícito
- ✅ `noFallthroughCasesInSwitch: true` - Previne bugs em switch
- ✅ `forceConsistentCasingInFileNames: true` - Consistência de nomes
- ✅ **Path aliases configurados** para imports limpos

**Path aliases disponíveis:**
```typescript
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";
import { COLORS } from "@/theme/design-system";
import { logger } from "@/utils/logger";
```

### 2. Babel (`babel.config.js`) ✅

**Melhorias aplicadas:**
- ✅ **Module resolver** configurado com path aliases
- ✅ Suporte para imports com `@/`
- ✅ Extensões: `.js`, `.jsx`, `.ts`, `.tsx`, `.json`

### 3. Prettier (`.prettierrc.json`) ✅

**Configurações:**
- ✅ `printWidth: 100` - Linhas de até 100 caracteres
- ✅ `tabWidth: 2` - Indentação de 2 espaços
- ✅ `semi: true` - Sempre usar ponto e vírgula
- ✅ `singleQuote: false` - Usar aspas duplas
- ✅ `trailingComma: "es5"` - Vírgula final quando possível
- ✅ Plugin Tailwind CSS para ordenação automática de classes

### 4. EditorConfig (`.editorconfig`) ✅

**Configurações:**
- ✅ UTF-8 encoding
- ✅ LF line endings (Unix)
- ✅ 2 espaços de indentação
- ✅ Trim trailing whitespace
- ✅ Insert final newline

### 5. VS Code (`.vscode/`) ✅

**Settings (`settings.json`):**
- ✅ Format on save
- ✅ ESLint auto-fix on save
- ✅ Organize imports on save
- ✅ Ruler em 100 caracteres
- ✅ TypeScript workspace SDK
- ✅ Tailwind CSS IntelliSense

**Extensions (`extensions.json`):**
- ✅ ESLint
- ✅ Prettier
- ✅ Tailwind CSS IntelliSense
- ✅ Expo Tools
- ✅ TypeScript Next

### 6. Scripts (`package.json`) ✅

**Novos scripts adicionados:**
```bash
# Formatação
bun run format          # Formatar todos os arquivos
bun run format:check    # Verificar formatação

# Limpeza
bun run clean           # Limpar caches
bun run clean:all       # Limpar tudo e reinstalar

# Validação
bun run validate:full   # Formatação + TypeScript + ESLint

# Setup
bun run setup-dev       # Setup completo do ambiente
```

### 7. ESLint (`eslint.config.js`) ✅

**Já configurado com:**
- ✅ Bloqueio de `console.log`
- ✅ Bloqueio de `alert/confirm`
- ✅ Bloqueio de tipos `any`
- ✅ Regras para `@ts-ignore`
- ✅ React Hooks rules
- ✅ Import resolver com TypeScript

### 8. Git Ignore (`.gitignore`) ✅

**Já configurado para ignorar:**
- ✅ `node_modules/`
- ✅ `.expo/`
- ✅ `dist/`, `build/`
- ✅ `.env*`
- ✅ Caches (`.metro-cache`, etc.)
- ✅ Arquivos nativos (`ios/`, `android/`)

## Como Usar

### 1. Path Aliases

**Antes:**
```typescript
import { Button } from "../../../components/ui/Button";
import { useToast } from "../../hooks/useToast";
```

**Depois:**
```typescript
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";
```

### 2. Formatação Automática

O VS Code formata automaticamente ao salvar. Para formatar manualmente:

```bash
bun run format
```

### 3. Validação Completa

Antes de fazer commit:

```bash
bun run validate:full
```

Isso verifica:
- ✅ Formatação (Prettier)
- ✅ TypeScript
- ✅ ESLint

### 4. Setup Inicial

Para configurar o ambiente pela primeira vez:

```bash
bun run setup-dev
```

Isso:
- ✅ Instala dependências
- ✅ Cria `.env` do template
- ✅ Verifica TypeScript
- ✅ Verifica ESLint
- ✅ Verifica formatação

### 5. Limpar Caches

Se tiver problemas com cache:

```bash
bun run clean
```

Para limpar tudo e reinstalar:

```bash
bun run clean:all
```

## Estrutura de Path Aliases

```
@/                    → src/
@/components          → src/components
@/screens             → src/screens
@/hooks               → src/hooks
@/utils               → src/utils
@/api                 → src/api
@/state               → src/state
@/types               → src/types
@/theme               → src/theme
@/navigation          → src/navigation
```

## Exemplos de Uso

### Import com Path Alias

```typescript
// ✅ BOM - Usando path alias
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";
import { COLORS } from "@/theme/design-system";
import { logger } from "@/utils/logger";

// ❌ RUIM - Import relativo longo
import { Button } from "../../../components/ui/Button";
```

### Formatação Automática

O Prettier formata automaticamente ao salvar. Exemplo:

**Antes:**
```typescript
const x={a:1,b:2}
```

**Depois (auto-formatado):**
```typescript
const x = { a: 1, b: 2 };
```

### Validação no Pre-commit

O script `quality-gate.sh` já valida tudo antes de commits (se configurado como pre-commit hook).

## Próximos Passos

1. ✅ **Configurações aplicadas** - Tudo pronto!
2. 🔄 **Migrar imports** - Começar a usar path aliases gradualmente
3. 📝 **Documentar padrões** - Adicionar exemplos de uso

## Troubleshooting

### Path aliases não funcionam

1. Reinicie o TypeScript server no VS Code: `Cmd/Ctrl + Shift + P` → "TypeScript: Restart TS Server"
2. Verifique se `babel.config.js` tem o plugin `module-resolver`
3. Limpe o cache: `bun run clean`

### Prettier não formata

1. Verifique se a extensão Prettier está instalada
2. Verifique se `editor.formatOnSave` está `true` no VS Code
3. Execute manualmente: `bun run format`

### TypeScript não reconhece path aliases

1. Verifique `tsconfig.json` - seção `paths`
2. Reinicie o TypeScript server
3. Verifique se o arquivo está em `include` do `tsconfig.json`

## Conclusão

✅ **Todas as configurações ideais foram aplicadas!**

O projeto agora tem:
- ✅ TypeScript rigoroso
- ✅ Path aliases para imports limpos
- ✅ Formatação automática
- ✅ Validação completa
- ✅ Scripts úteis
- ✅ Configurações de editor

**Pronto para desenvolvimento produtivo!** 🚀
