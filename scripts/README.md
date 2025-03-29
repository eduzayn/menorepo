<!-- cSpell:disable -->
# Scripts de Utilidade

Este diretório contém scripts de utilidade para automatizar tarefas comuns no desenvolvimento.

## Scripts Disponíveis

### `ts-prune.sh`
Identifica código não utilizado no módulo de comunicação.

```bash
# Para executar:
./scripts/ts-prune.sh
# ou
npm ts-prune apps/comunicacao/src
```

### `pnpm-add.sh`
Adiciona dependências específicas ao módulo de comunicação.

```bash
# Para executar:
./scripts/pnpm-add.sh
# ou
pnpm add @edunexia/eslint-config eslint-import-resolver-typescript --filter apps/comunicacao
```

### `git-ops.ps1`
Script PowerShell para executar operações Git de forma mais confiável em ambiente Windows.

```powershell
# Para executar (exemplos):
pwsh -File scripts/git-ops.ps1 -Command status
pwsh -File scripts/git-ops.ps1 -Command add-all
pwsh -File scripts/git-ops.ps1 -Command commit -Message "feat: adiciona novo recurso"
pwsh -File scripts/git-ops.ps1 -Command push
pwsh -File scripts/git-ops.ps1 -Command pull
```

## Adicionando Novos Scripts

Ao adicionar novos scripts de utilidade:

1. Crie o script nesta pasta com um nome descritivo
2. Adicione shebang (`#!/bin/bash`) na primeira linha para scripts shell
3. Documente o script neste arquivo README.md
4. Em sistemas Unix/Linux, torne o script executável com `chmod +x script.sh`

### Para scripts PowerShell:
1. Use a extensão .ps1
2. Adicione comentários descritivos no início do arquivo
3. Implemente tratamento de erros adequado 
