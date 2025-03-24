import { useState } from 'react';
import { Tab } from '@headlessui/react';
import {
  UserIcon,
  BellIcon,
  UserGroupIcon,
  TagIcon,
  ClockIcon,
  BookOpenIcon,
  CogIcon,
  ChatBubbleLeftIcon,
  BuildingStorefrontIcon,
  PuzzlePieceIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const tabs = [
  { name: 'Perfil', icon: UserIcon },
  { name: 'Notificações', icon: BellIcon },
  { name: 'Usuários', icon: UserGroupIcon },
  { name: 'Tags', icon: TagIcon },
  { name: 'Horários', icon: ClockIcon },
  { name: 'Base de Conhecimento', icon: BookOpenIcon },
  { name: 'Automações', icon: CogIcon },
  { name: 'Bot', icon: ChatBubbleLeftIcon },
  { name: 'Produtos', icon: BuildingStorefrontIcon },
  { name: 'Integrações', icon: PuzzlePieceIcon },
  { name: 'Auditoria', icon: DocumentTextIcon },
];

export default function ConfiguracoesPage() {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <div className="h-full">
      <div className="pb-5 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Configurações</h2>
      </div>

      <div className="mt-6">
        <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
          <div className="flex">
            {/* Sidebar de Navegação */}
            <div className="w-64 pr-8">
              <Tab.List className="flex flex-col space-y-1">
                {tabs.map((tab, index) => {
                  const Icon = tab.icon;
                  return (
                    <Tab
                      key={tab.name}
                      className={({ selected }) =>
                        classNames(
                          'flex items-center px-3 py-2 text-sm font-medium rounded-md',
                          selected
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        )
                      }
                    >
                      <Icon className="mr-3 h-5 w-5" aria-hidden="true" />
                      {tab.name}
                    </Tab>
                  );
                })}
              </Tab.List>
            </div>

            {/* Conteúdo das Tabs */}
            <div className="flex-1">
              <Tab.Panels>
                {/* Perfil */}
                <Tab.Panel>
                  <div className="max-w-3xl">
                    <h3 className="text-lg font-medium text-gray-900 mb-6">Seu Perfil</h3>
                    <form className="space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Nome
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="name"
                            id="name"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          E-mail
                        </label>
                        <div className="mt-1">
                          <input
                            type="email"
                            name="email"
                            id="email"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div>
                        <button
                          type="submit"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Salvar Alterações
                        </button>
                      </div>
                    </form>
                  </div>
                </Tab.Panel>

                {/* Notificações */}
                <Tab.Panel>
                  <div className="max-w-3xl">
                    <h3 className="text-lg font-medium text-gray-900 mb-6">Preferências de Notificação</h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="email_notifications"
                            name="email_notifications"
                            type="checkbox"
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="email_notifications" className="font-medium text-gray-700">
                            Notificações por E-mail
                          </label>
                          <p className="text-gray-500">Receba atualizações sobre novas mensagens e leads.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Tab.Panel>

                {/* Outras tabs serão adicionadas aqui */}
                {[...Array(9)].map((_, i) => (
                  <Tab.Panel key={i}>
                    <div className="max-w-3xl">
                      <h3 className="text-lg font-medium text-gray-900 mb-6">{tabs[i + 2].name}</h3>
                      <p className="text-gray-500">
                        Esta seção está em desenvolvimento.
                      </p>
                    </div>
                  </Tab.Panel>
                ))}
              </Tab.Panels>
            </div>
          </div>
        </Tab.Group>
      </div>
    </div>
  );
} 