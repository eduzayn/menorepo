import { Outlet } from 'react-router-dom';
import Header from '../components/Header';

export function DefaultLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default DefaultLayout; 