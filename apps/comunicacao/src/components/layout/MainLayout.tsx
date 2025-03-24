import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Sidebar from './Sidebar';
import { DetailsPanel } from '../chat/DetailsPanel';

interface MainLayoutProps {
  children: React.ReactNode;
  showDetails?: boolean;
  detailsProps?: {
    lead?: any;
    aluno?: any;
    historicoInteracoes: any[];
    onAcaoRapida: (acao: string) => void;
  };
}

export function MainLayout({ children, showDetails = false, detailsProps }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDetailsOpen, setIsDetailsOpen] = useState(showDetails);

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity lg:hidden ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="flex-shrink-0 h-16 bg-white border-b flex items-center justify-between px-4">
          <div className="flex items-center">
            <button
              type="button"
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <h1 className="ml-2 text-xl font-semibold text-gray-900">Edunexia</h1>
          </div>
          <div className="flex items-center">
            {showDetails && (
              <button
                type="button"
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                onClick={() => setIsDetailsOpen(!isDetailsOpen)}
              >
                {isDetailsOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Primary Content */}
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>

          {/* Details Panel */}
          {showDetails && detailsProps && (
            <div
              className={`fixed inset-y-0 right-0 z-50 w-80 bg-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
                isDetailsOpen ? 'translate-x-0' : 'translate-x-full'
              }`}
            >
              <DetailsPanel {...detailsProps} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 