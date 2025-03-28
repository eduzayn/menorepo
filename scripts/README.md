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

## Adicionando Novos Scripts

Ao adicionar novos scripts de utilidade:

1. Crie o script nesta pasta com um nome descritivo
2. Adicione shebang (`#!/bin/bash`) na primeira linha
3. Documente o script neste arquivo README.md
4. Em sistemas Unix/Linux, torne o script executável com `chmod +x script.sh` 