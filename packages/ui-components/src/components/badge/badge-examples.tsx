import React from 'react';
import { Badge } from './badge';

export const BadgeExamples = () => {
  return (
    <div className="space-y-6 p-4">
      <div>
        <h2 className="text-lg font-bold mb-2">Status de Comunicação</h2>
        <div className="flex flex-wrap gap-2">
          <Badge variant="aberto">Aberto</Badge>
          <Badge variant="fechado">Fechado</Badge>
          <Badge variant="pendente">Pendente</Badge>
          <Badge variant="aprovado">Aprovado</Badge>
          <Badge variant="rejeitado">Rejeitado</Badge>
          <Badge variant="em_andamento">Em Andamento</Badge>
          <Badge variant="arquivado">Arquivado</Badge>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold mb-2">Tipo de Mensagem</h2>
        <div className="flex flex-wrap gap-2">
          <Badge variant="texto">Texto</Badge>
          <Badge variant="template">Template</Badge>
          <Badge variant="media">Media</Badge>
          <Badge variant="imagem">Imagem</Badge>
          <Badge variant="arquivo">Arquivo</Badge>
          <Badge variant="video">Vídeo</Badge>
          <Badge variant="audio">Áudio</Badge>
          <Badge variant="localizacao">Localização</Badge>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold mb-2">Status de Matrícula</h2>
        <div className="flex flex-wrap gap-2">
          <Badge variant="pendente">Pendente</Badge>
          <Badge variant="aprovada">Aprovada</Badge>
          <Badge variant="negada">Negada</Badge>
          <Badge variant="expirada">Expirada</Badge>
          <Badge variant="ativa">Ativa</Badge>
          <Badge variant="cancelada">Cancelada</Badge>
          <Badge variant="trancada">Trancada</Badge>
          <Badge variant="concluida">Concluída</Badge>
          <Badge variant="em_processo">Em Processo</Badge>
          <Badge variant="inadimplente">Inadimplente</Badge>
          <Badge variant="reativada">Reativada</Badge>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold mb-2">Status de Pagamento</h2>
        <div className="flex flex-wrap gap-2">
          <Badge variant="pending">Pending</Badge>
          <Badge variant="processing">Processing</Badge>
          <Badge variant="completed">Completed</Badge>
          <Badge variant="paid">Paid</Badge>
          <Badge variant="failed">Failed</Badge>
          <Badge variant="refunded">Refunded</Badge>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold mb-2">Método de Pagamento</h2>
        <div className="flex flex-wrap gap-2">
          <Badge variant="cartao">Cartão</Badge>
          <Badge variant="credit_card">Credit Card</Badge>
          <Badge variant="debit_card">Debit Card</Badge>
          <Badge variant="boleto">Boleto</Badge>
          <Badge variant="pix">PIX</Badge>
          <Badge variant="cash">Dinheiro</Badge>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold mb-2">Papel do Usuário</h2>
        <div className="flex flex-wrap gap-2">
          <Badge variant="aluno">Aluno</Badge>
          <Badge variant="professor">Professor</Badge>
          <Badge variant="admin">Admin</Badge>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold mb-2">Provedor de Autenticação</h2>
        <div className="flex flex-wrap gap-2">
          <Badge variant="email">Email</Badge>
          <Badge variant="google">Google</Badge>
          <Badge variant="facebook">Facebook</Badge>
          <Badge variant="github">GitHub</Badge>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold mb-2">Tamanhos</h2>
        <div className="flex flex-wrap gap-2 items-center">
          <Badge size="sm" variant="primary">Pequeno</Badge>
          <Badge size="md" variant="primary">Médio</Badge>
          <Badge size="lg" variant="primary">Grande</Badge>
        </div>
      </div>
    </div>
  );
}; 