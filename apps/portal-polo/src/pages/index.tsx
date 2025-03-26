import React from 'react';

// Exportando páginas implementadas
export { Dashboard } from './Dashboard';
export { AlunosLista } from './AlunosLista';
export { Comissoes } from './Comissoes';
export { Relatorios } from './Relatorios';

// Páginas que serão implementadas posteriormente (placeholders)
export const AlunoDetalhe = () => {
  return <div className="p-4">Detalhes do Aluno - Em construção</div>;
};

export const Repasses = () => {
  return <div className="p-4">Repasses - Em construção</div>;
};

export const Configuracoes = () => {
  return <div className="p-4">Configurações - Em construção</div>;
};

export const PolosLista = () => {
  return <div className="p-4">Gestão de Polos (Admin) - Em construção</div>;
};

export const PoloDetalhe = () => {
  return <div className="p-4">Detalhes do Polo (Admin) - Em construção</div>;
};

// Página de erro 404
export const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Página não encontrada</p>
      <a 
        href="/dashboard" 
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Voltar para o Dashboard
      </a>
    </div>
  );
}; 