import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Dados simulados para as páginas
const MOCK_PAGES = [
  { id: 1, titulo: 'Home', slug: 'home', status: 'Publicada', dataAtualizacao: '30/03/2024' },
  { id: 2, titulo: 'Sobre Nós', slug: 'sobre', status: 'Publicada', dataAtualizacao: '28/03/2024' },
  { id: 3, titulo: 'Contato', slug: 'contato', status: 'Publicada', dataAtualizacao: '25/03/2024' },
  { id: 4, titulo: 'Serviços', slug: 'servicos', status: 'Rascunho', dataAtualizacao: '22/03/2024' },
  { id: 5, titulo: 'FAQ', slug: 'faq', status: 'Publicada', dataAtualizacao: '20/03/2024' },
  { id: 6, titulo: 'Política de Privacidade', slug: 'politica-privacidade', status: 'Publicada', dataAtualizacao: '15/03/2024' },
  { id: 7, titulo: 'Termos de Uso', slug: 'termos-uso', status: 'Publicada', dataAtualizacao: '15/03/2024' },
  { id: 8, titulo: 'Novidades', slug: 'novidades', status: 'Rascunho', dataAtualizacao: '10/03/2024' },
];

const PaginasPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pages, setPages] = useState(MOCK_PAGES);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  // Filtrar páginas com base no termo de pesquisa
  const filteredPages = pages.filter(
    (page) =>
      page.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Manipular seleção de linhas
  const toggleRowSelection = (id: number) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  // Manipular exclusão simulada
  const handleDelete = () => {
    if (selectedRows.length === 0) return;
    
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir ${selectedRows.length} página(s)?`
    );
    
    if (confirmed) {
      setPages(pages.filter((page) => !selectedRows.includes(page.id)));
      setSelectedRows([]);
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Gerenciamento de Páginas</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          {/* Barra de ferramentas */}
          <div className="bg-white shadow-sm rounded-lg p-4 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div className="w-full sm:w-auto flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <input
                  type="text"
                  placeholder="Buscar páginas..."
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full sm:w-auto flex space-x-2">
                <Link
                  to="/admin/paginas/nova"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Nova Página
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={selectedRows.length === 0}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    selectedRows.length === 0
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                  }`}
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>

          {/* Tabela */}
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRows(filteredPages.map((page) => page.id));
                        } else {
                          setSelectedRows([]);
                        }
                      }}
                      checked={selectedRows.length === filteredPages.length && filteredPages.length > 0}
                    />
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Título
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data de Atualização
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPages.length > 0 ? (
                  filteredPages.map((page) => (
                    <tr key={page.id} className={selectedRows.includes(page.id) ? 'bg-gray-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          checked={selectedRows.includes(page.id)}
                          onChange={() => toggleRowSelection(page.id)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{page.titulo}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{page.slug}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            page.status === 'Publicada'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {page.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {page.dataAtualizacao}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <Link
                            to={`/admin/paginas/editar/${page.id}`}
                            className="text-indigo-600 hover:text-indigo-900 font-medium"
                          >
                            Editar
                          </Link>
                          <a
                            href={`/pagina/${page.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-gray-600 hover:text-gray-900 font-medium"
                          >
                            Visualizar
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      Nenhuma página encontrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginasPage; 