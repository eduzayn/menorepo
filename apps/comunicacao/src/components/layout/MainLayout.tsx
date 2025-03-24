import { ReactNode, useState } from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import DetailPanel from './DetailPanel';

interface MainLayoutProps {
  children: ReactNode;
  showDetailsPanel?: boolean;
  detailsData?: {
    name?: string;
    email?: string;
    phone?: string;
    status?: string;
    lastContact?: string;
  };
}

export default function MainLayout({ 
  children, 
  showDetailsPanel = true,
  detailsData 
}: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(true);

  return (
    <div className="flex h-screen bg-neutral-light">
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out lg:static lg:transform-none
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
        {/* Central Panel */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* TopBar */}
          <div className="bg-neutral-lightest border-b border-primary-light">
            <div className="flex h-16 items-center justify-between px-4">
              <button
                type="button"
                className="lg:hidden text-neutral-dark hover:text-gray-900"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
              <TopBar />
            </div>
          </div>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto bg-neutral-lightest">
            <div className="container mx-auto px-4 py-8">
              {children}
            </div>
          </main>
        </div>

        {/* Details Panel */}
        {showDetailsPanel && (
          <div className={`
            fixed inset-y-0 right-0 z-30 w-80 transform transition-transform duration-300 ease-in-out 
            xl:static xl:transform-none
            ${isDetailsPanelOpen ? 'translate-x-0' : 'translate-x-full'}
          `}>
            <DetailPanel 
              onClose={() => setIsDetailsPanelOpen(false)}
              data={detailsData}
            />
          </div>
        )}
      </div>
    </div>
  );
} 