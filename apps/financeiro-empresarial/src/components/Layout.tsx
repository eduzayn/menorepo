import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
} 