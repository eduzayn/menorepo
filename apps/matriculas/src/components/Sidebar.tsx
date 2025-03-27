import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import {
  AcademicCapIcon,
  DocumentTextIcon,
  HomeIcon,
  XMarkIcon,
  UserGroupIcon,
  CreditCardIcon,
  ClipboardDocumentCheckIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'

const menuItems = [
  { 
    path: '/matriculas', 
    label: 'Matrículas', 
    roles: ['admin', 'secretaria'],
    icon: UserGroupIcon
  },
  { 
    path: '/cursos', 
    label: 'Cursos', 
    roles: ['admin', 'secretaria'],
    icon: AcademicCapIcon
  },
  { 
    path: '/planos', 
    label: 'Planos', 
    roles: ['admin', 'secretaria', 'financeiro'],
    icon: CreditCardIcon
  },
  { 
    path: '/documentos', 
    label: 'Documentos', 
    roles: ['admin', 'secretaria', 'documentacao'],
    icon: DocumentTextIcon
  },
  { 
    path: '/contratos', 
    label: 'Contratos', 
    roles: ['admin', 'secretaria', 'financeiro', 'aluno'],
    icon: ClipboardDocumentCheckIcon
  },
  { 
    path: '/configuracoes', 
    label: 'Configurações', 
    roles: ['admin', 'financeiro'],
    icon: Cog6ToothIcon
  },
];

type SidebarProps = {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const location = useLocation()
  const { user } = useAuth()
  const userRoles = user?.roles || []

  // Filtra itens do menu com base nas permissões do usuário
  const filteredMenuItems = menuItems.filter(item => {
    // Se não houver roles definidas, mostrar para todos
    if (!item.roles || item.roles.length === 0) return true
    
    // Caso contrário, verificar se o usuário tem pelo menos uma das roles necessárias
    return item.roles.some(role => userRoles.includes(role))
  })

  return (
    <>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                      <span className="sr-only">Fechar sidebar</span>
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
                  <div className="flex h-16 shrink-0 items-center">
                    <img
                      className="h-8 w-auto"
                      src="/logo.png"
                      alt="Edunéxia"
                    />
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {filteredMenuItems.map((item) => {
                            const isActive = location.pathname.startsWith(item.path)
                            return (
                              <li key={item.path}>
                                <Link
                                  to={item.path}
                                  onClick={() => setSidebarOpen(false)}
                                  className={`group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 ${
                                    isActive
                                      ? 'bg-gray-50 text-blue-600'
                                      : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                                  }`}
                                >
                                  <item.icon
                                    className={`h-6 w-6 shrink-0 ${
                                      isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'
                                    }`}
                                    aria-hidden="true"
                                  />
                                  {item.label}
                                </Link>
                              </li>
                            )
                          })}
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
          <div className="flex h-16 shrink-0 items-center">
            <img
              className="h-8 w-auto"
              src="/logo.png"
              alt="Edunéxia"
            />
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {filteredMenuItems.map((item) => {
                    const isActive = location.pathname.startsWith(item.path)
                    return (
                      <li key={item.path}>
                        <Link
                          to={item.path}
                          className={`group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 ${
                            isActive
                              ? 'bg-gray-50 text-blue-600'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                          }`}
                        >
                          <item.icon
                            className={`h-6 w-6 shrink-0 ${
                              isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'
                            }`}
                            aria-hidden="true"
                          />
                          {item.label}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  )
} 