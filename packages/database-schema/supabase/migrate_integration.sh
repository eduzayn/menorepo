#!/bin/bash

# Script para executar migrações de integração entre RH e Contabilidade em sequência segura
# ------------------------------------------------------------------------------
# Autor: Claude
# Data: 2024-07-05
# Uso: ./migrate_integration.sh
# ------------------------------------------------------------------------------

# Definição de cores para melhor visualização
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se o Supabase CLI está instalado
if ! command -v supabase &> /dev/null
then
    echo -e "${RED}Erro: Supabase CLI não encontrado. Por favor instale conforme as instruções em https://supabase.com/docs/guides/cli ${NC}"
    exit 1
fi

# Diretório base e de migrações
BASE_DIR="$(pwd)"
MIGRATIONS_DIR="$BASE_DIR/packages/database-schema/supabase/migrations"

# Função para executar as migrações SQL
run_migration() {
    local file="$1"
    local description="$2"
    
    echo -e "\n${YELLOW}Executando migração: $description ${NC}"
    echo -e "${YELLOW}Arquivo: $file ${NC}"
    
    # Executar a migração
    supabase db push "$file"
    
    # Verificar o status de saída
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Migração executada com sucesso: $description ${NC}"
    else
        echo -e "${RED}✗ Erro ao executar migração: $file ${NC}"
        echo -e "${YELLOW}Continuando com as próximas migrações... ${NC}"
    fi
}

# Pedir confirmação do usuário
echo -e "${YELLOW}Este script irá executar todas as migrações necessárias para a integração RH-Contabilidade.${NC}"
echo -e "${YELLOW}É recomendado fazer um backup do banco antes de prosseguir.${NC}"
read -p "Deseja continuar? (s/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Ss]$ ]]
then
    echo -e "${RED}Operação cancelada pelo usuário${NC}"
    exit 1
fi

# Executar verificação de estrutura primeiro
echo -e "\n${GREEN}=== ETAPA 1: Verificando a estrutura atual do banco ===${NC}"
run_migration "$MIGRATIONS_DIR/verificacao_estrutura.sql" "Verificação de estrutura existente"

# Criar tabela usuarios_instituicoes se não existir (necessária para as políticas RLS)
echo -e "\n${GREEN}=== ETAPA 2: Configurando tabela de usuários e instituições ===${NC}"
run_migration "$MIGRATIONS_DIR/usuarios_instituicoes.sql" "Criação da tabela usuarios_instituicoes"

# Criar tipos enumerados básicos
echo -e "\n${GREEN}=== ETAPA 3: Criando tipos enumerados ===${NC}"
run_migration "$MIGRATIONS_DIR/20240701_tipos_enumerados.sql" "Criação de tipos enumerados"

# Criar tabelas básicas de integração
echo -e "\n${GREEN}=== ETAPA 4: Criando tabelas para integração ===${NC}"
run_migration "$MIGRATIONS_DIR/20240702_tabelas_integracao.sql" "Criação de tabelas de integração"

# Corrigir políticas RLS com erros
echo -e "\n${GREEN}=== ETAPA 5: Corrigindo políticas RLS ===${NC}"
run_migration "$MIGRATIONS_DIR/correcao_policias_rls.sql" "Correção de políticas RLS"

# Criar correção para verificação do plano de contas
echo -e "\n${GREEN}=== ETAPA 6: Criando função para verificação do plano de contas ===${NC}"
run_migration "$MIGRATIONS_DIR/20240704_correcao_check_contas.sql" "Função de verificação do plano de contas"

# Função de contabilização da folha
echo -e "\n${GREEN}=== ETAPA 7: Criando função de contabilização da folha ===${NC}"
run_migration "$MIGRATIONS_DIR/20240703_funcao_contabilizar_folha.sql" "Função de contabilização da folha"

# Edge Function para integração
echo -e "\n${GREEN}=== ETAPA 8: Implantando Edge Function para integração ===${NC}"
echo -e "${YELLOW}Implantando função 'integrar-rh-contabilidade'...${NC}"
cd "$BASE_DIR/packages/database-schema/supabase/functions/integrar-rh-contabilidade" || exit 1
supabase functions deploy integrar-rh-contabilidade

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Edge Function implantada com sucesso${NC}"
else
    echo -e "${RED}✗ Erro ao implantar Edge Function${NC}"
fi

# Verificar lista de funções implantadas
echo -e "\n${YELLOW}Verificando funções implantadas:${NC}"
supabase functions list

# Voltar para o diretório base
cd "$BASE_DIR" || exit 1

# Concluir
echo -e "\n${GREEN}==================================${NC}"
echo -e "${GREEN}Migração completa!${NC}"
echo -e "${GREEN}==================================${NC}"
echo -e "\n${YELLOW}Próximos passos:${NC}"
echo -e "1. Criar um plano de contas para cada instituição que utilizará a integração:"
echo -e "   SELECT contabilidade.gerar_plano_contas_rh('[UUID_DA_INSTITUICAO]');"
echo -e "2. Testar a integração na página de testes em /contabilidade/teste-integracoes"
echo -e "3. Configurar rotinas automatizadas para processamento periódico"

exit 0 