# Audit Hardcoded Colors

Busca e reporta todas as cores hardcoded no codigo fonte.

## Escopo

Analise `src/**/*.tsx` e `src/**/*.ts` buscando:

1. **Hex colors**: `#[0-9A-Fa-f]{3,8}` (ex: #FFF, #FFFFFF, #FFFFFFAA)
2. **RGB/RGBA**: `rgba?\([^)]+\)` que nao estejam em design-system.ts
3. **Named colors**: `color: "white"`, `backgroundColor: "black"`

## Excecoes Validas

Ignorar cores em:
- `src/theme/design-system.ts` (definicoes oficiais)
- `src/utils/colors.ts` (legacy, mapeado para design-system)
- Comentarios e strings de documentacao
- `shadowColor: "#000"` (padrao de sombras)

## Formato de Saida

```
=== AUDIT DE CORES HARDCODED ===

Total: XX cores encontradas em YY arquivos

CRITICO (cores primarias/secundarias hardcoded):
- src/screens/Example.tsx:42 → #F4258C (deveria ser COLORS.primary[500])

ATENCAO (cores de UI hardcoded):
- src/components/Card.tsx:15 → #FFFFFF (deveria ser COLORS.background.secondary)

INFO (cores que podem ser intencionais):
- src/screens/Chart.tsx:88 → #10B981 (cor de grafico - verificar)

=== RECOMENDACOES ===
1. Substituir cores criticas por tokens do design-system
2. Criar tokens semanticos para cores recorrentes
3. Usar getCareColors() pattern para cores de tela especificas
```

## Comando

Execute grep para encontrar padroes:
```bash
grep -rn "#[0-9A-Fa-f]\{6\}" src/ --include="*.tsx" --include="*.ts" | grep -v "design-system.ts" | grep -v "colors.ts"
```

Depois analise cada ocorrencia e categorize.
