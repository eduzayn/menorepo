import { useState } from 'react';
import { Tab } from '@headlessui/react';
import {
  TableCellsIcon,
  ViewColumnsIcon,
} from '@heroicons/react/24/outline';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function LeadsPage() {
  const [viewType, setViewType] = useState('list');

  return (
    <div className="h-full">
      {/* Header */}
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h2 className="text-lg font-medium text-gray-900">Leads</h2>
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <div className="flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => setViewType('list')}
              className={classNames(
                viewType === 'list'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50',
                'px-4 py-2 text-sm font-medium rounded-l-md border border-gray-300 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500'
              )}
            >
              <TableCellsIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setViewType('kanban')}
              className={classNames(
                viewType === 'kanban'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50',
                '-ml-px px-4 py-2 text-sm font-medium rounded-r-md border border-gray-300 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500'
              )}
            >
              <ViewColumnsIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mt-6">
        {viewType === 'list' ? (
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nome
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          E-mail
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Telefone
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Ações</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {/* Lista de leads será adicionada aqui */}
                      <tr>
                        <td className="px-6 py-4" colSpan={5}>
                          <div className="text-center text-sm text-gray-500">
                            Nenhum lead encontrado.
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {/* Colunas do Kanban */}
            {['Captado', 'Qualificado', 'Contato', 'Negociação', 'Fechado'].map((status) => (
              <div key={status} className="flex-shrink-0 w-80">
                <div className="bg-gray-100 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900">{status}</h3>
                  <div className="mt-4 space-y-4">
                    {/* Cards de leads serão adicionados aqui */}
                    <div className="bg-white p-4 rounded-lg shadow">
                      <p className="text-sm text-gray-500">
                        Nenhum lead neste status.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 