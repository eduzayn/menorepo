<!-- cSpell:disable -->
# Instruções para Commit e Push das Alterações

## Arquivos Modificados

1. **package.json**
   - Adicionada a dependência `madge`
   - Adicionados scripts para verificação de dependências circulares

2. **README.md**
   - Adicionada seção sobre detecção de dependências circulares nas Considerações Técnicas

3. **Novos Arquivos Criados**
   - **scripts/check-circular-deps.bat** - Script batch para verificação
   - **scripts/check-circular-deps.ps1** - Script PowerShell para verificação
   - **docs/dependencias-circulares.md** - Documentação detalhada
   - **.github/workflows/check-circular-deps.yml** - Workflow de CI/CD

## Como fazer o Commit e Push

Quando você tiver acesso ao Git, siga estes passos:

1. Visualize as mudanças:
   ```
   git status
   ```

2. Adicione os arquivos ao stage:
   ```
   git add package.json README.md scripts/check-circular-deps.bat scripts/check-circular-deps.ps1 docs/dependencias-circulares.md .github/workflows/check-circular-deps.yml
   ```

3. Faça o commit usando a mensagem do arquivo commit-message.txt:
   ```
   git commit -F commit-message.txt
   ```

4. Faça o push para o repositório remoto:
   ```
   git push origin main
   ```

## Resumo das Alterações

Implementamos a detecção de dependências circulares no projeto através da ferramenta madge. Adicionamos scripts para facilitar a verificação, documentação detalhada para ajudar os desenvolvedores a entender e resolver dependências circulares, e configuramos um workflow de CI/CD para verificar automaticamente quando houver novos commits ou pull requests.

As verificações iniciais já encontraram dependências circulares no projeto, como entre `api-client/src/index.ts` e `api-client/src/providers/ApiProvider.tsx`, e no módulo `material-didatico`. A documentação fornece orientações sobre como resolver esses problemas. 
