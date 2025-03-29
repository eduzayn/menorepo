<!-- cSpell:disable -->
# Configuração do Verificador Ortográfico para Documentação

Este documento explica como configurar o verificador ortográfico (cSpell) para trabalhar corretamente com a documentação em português do projeto Edunéxia.

## Extensões Necessárias

O projeto recomenda as seguintes extensões para o VS Code:

1. **Code Spell Checker** (`streetsidesoftware.code-spell-checker`) - Verificador ortográfico principal
2. **Brazilian Portuguese - Code Spell Checker** (`streetsidesoftware.code-spell-checker-portuguese-brazilian`) - Dicionário de português brasileiro

Ambas as extensões estão listadas no arquivo `.vscode/extensions.json` e serão sugeridas automaticamente pelo VS Code ao abrir o projeto.

## Configuração Automática

O projeto já inclui as configurações necessárias nos seguintes arquivos:

- `.vscode/settings.json` - Configurações locais do editor
- `cspell.json` - Configuração global do verificador ortográfico

Estas configurações incluem:
- Suporte para os idiomas inglês e português
- Lista de palavras específicas do projeto
- Configuração de caminhos ignorados

## Desativação do Spell Checker em Arquivos Markdown

Para evitar erros de ortografia em documentos escritos em português, todos os arquivos markdown do projeto devem incluir o comentário `<!-- cSpell:disable -->` no início do arquivo. 

Você pode usar o script automático para adicionar este comentário a todos os arquivos:

```bash
# No PowerShell
.\scripts\fix-spelling.ps1
```

Este script:
1. Verifica todos os arquivos markdown (`.md`) no projeto
2. Adiciona o comentário de desativação no início dos arquivos que ainda não o possuem
3. Exibe estatísticas sobre os arquivos verificados e atualizados

## Adicionando Novas Palavras

Se você encontrar palavras em português marcadas incorretamente como erros ortográficos, você pode:

1. **Adicionar ao arquivo global**:
   - Edite o arquivo `cspell.json` na raiz do projeto
   - Adicione a palavra à seção `"words": []`

2. **Adicionar localmente no VS Code**:
   - Clique com o botão direito na palavra sublinhada
   - Escolha "Add Word to Workspace Settings"

## Solução de Problemas

Se mesmo após a instalação das extensões e configurações você ainda estiver vendo erros ortográficos em palavras portuguesas:

1. Reinicie o VS Code para aplicar as configurações
2. Verifique se as extensões estão ativas
3. Use a paleta de comandos (Ctrl+Shift+P) e execute "Reload Window"
4. Execute o script `fix-spelling.ps1` para garantir que todos os arquivos markdown tenham o comentário de desativação

## Observações

- O verificador ortográfico valida tanto documentos em inglês quanto em português
- Palavras técnicas e específicas do domínio já estão incluídas na lista de palavras conhecidas
- A configuração respeita as diferentes variantes do português (Portugal e Brasil)
- Arquivos TypeScript, JavaScript e de configuração são ignorados pelo verificador ortográfico

---

Para qualquer dúvida adicional, entre em contato com a equipe de desenvolvimento. 
