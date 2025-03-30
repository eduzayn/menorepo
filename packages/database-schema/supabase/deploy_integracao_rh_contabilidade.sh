#!/bin/bash

# Script para implantar a integração RH-Contabilidade no Supabase
# Executado por: Administrador do Banco de Dados
# Recomendado executar em ambiente de homologação antes da produção

# Cores para saída
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Iniciando implantação da integração RH-Contabilidade...${NC}"

# Verificar pré-requisitos (Supabase CLI)
if ! command -v supabase &> /dev/null
then
    echo -e "${RED}Erro: Supabase CLI não encontrado. Por favor, instale-o primeiro.${NC}"
    echo "Siga as instruções em: https://supabase.com/docs/guides/cli"
    exit 1
fi

# Diretório base (ajuste conforme necessário)
BASE_DIR="$(pwd)"
MIGRATIONS_DIR="$BASE_DIR/migrations"
FUNCTIONS_DIR="$BASE_DIR/functions"

# 1. Executar migrações na ordem correta
echo -e "\n${YELLOW}1. Executando migrações SQL...${NC}"

# Schema RH
echo -e "\n${YELLOW}1.1 Criando schema RH e estruturas básicas...${NC}"
supabase db push "$MIGRATIONS_DIR/20240702_schema_rh.sql" && \
echo -e "${GREEN}Schema RH criado com sucesso!${NC}" || \
echo -e "${RED}Erro ao criar schema RH. Verifique os logs para mais detalhes.${NC}"

# Integração RH-Contabilidade
echo -e "\n${YELLOW}1.2 Criando funções de integração...${NC}"
supabase db push "$MIGRATIONS_DIR/20240703_integracao_rh_contabilidade.sql" && \
echo -e "${GREEN}Funções de integração criadas com sucesso!${NC}" || \
echo -e "${RED}Erro ao criar funções de integração. Verifique os logs para mais detalhes.${NC}"

# Plano de Contas RH
echo -e "\n${YELLOW}1.3 Criando funções para plano de contas RH...${NC}"
supabase db push "$MIGRATIONS_DIR/20240704_plano_contas_rh.sql" && \
echo -e "${GREEN}Função de plano de contas RH criada com sucesso!${NC}" || \
echo -e "${RED}Erro ao criar função de plano de contas. Verifique os logs para mais detalhes.${NC}"

# 2. Implantar funções Edge
echo -e "\n${YELLOW}2. Implantando funções Edge...${NC}"

echo -e "\n${YELLOW}2.1 Implantando função integrar-rh-contabilidade...${NC}"
supabase functions deploy integrar-rh-contabilidade --project-ref $(supabase projects list | grep -m 1 -oP '(?<=\| )[a-z0-9]+(?= \|)') && \
echo -e "${GREEN}Função integrar-rh-contabilidade implantada com sucesso!${NC}" || \
echo -e "${RED}Erro ao implantar função Edge. Verifique os logs para mais detalhes.${NC}"

# 3. Verificar implantação
echo -e "\n${YELLOW}3. Verificando implantação...${NC}"

# Verificar função plano de contas
echo -e "\n${YELLOW}3.1 Verificando função de plano de contas...${NC}"
supabase db run "SELECT routine_name, routine_definition FROM information_schema.routines WHERE routine_name = 'gerar_plano_contas_rh';" && \
echo -e "${GREEN}Função de plano de contas verificada com sucesso!${NC}" || \
echo -e "${RED}Erro ao verificar função de plano de contas. Verifique manualmente.${NC}"

# Verificar função de folha de pagamento
echo -e "\n${YELLOW}3.2 Verificando função de contabilização de folha...${NC}"
supabase db run "SELECT routine_name, routine_definition FROM information_schema.routines WHERE routine_name = 'contabilizar_folha_pagamento';" && \
echo -e "${GREEN}Função de contabilização de folha verificada com sucesso!${NC}" || \
echo -e "${RED}Erro ao verificar função de contabilização. Verifique manualmente.${NC}"

# Verificar função Edge
echo -e "\n${YELLOW}3.3 Verificando função Edge...${NC}"
supabase functions list | grep "integrar-rh-contabilidade" && \
echo -e "${GREEN}Função Edge verificada com sucesso!${NC}" || \
echo -e "${RED}Erro ao verificar função Edge. Verifique manualmente.${NC}"

# 4. Informações adicionais
echo -e "\n${GREEN}Implantação concluída!${NC}"
echo -e "\n${YELLOW}Próximos passos:${NC}"
echo "1. Crie um plano de contas RH para cada instituição usando a função 'contabilidade.gerar_plano_contas_rh'"
echo "2. Configure a página de teste de integrações do frontend"
echo "3. Execute um teste completo do fluxo de contabilização da folha"
echo "4. Documente quaisquer problemas encontrados"

echo -e "\n${YELLOW}Para mais informações, consulte:${NC}"
echo "- packages/database-schema/supabase/INTEGRACAO_RH_CONTABILIDADE.md"
echo "- packages/database-schema/supabase/MIGRATIONS.md"

echo -e "\n${GREEN}FIM DO SCRIPT${NC}" 