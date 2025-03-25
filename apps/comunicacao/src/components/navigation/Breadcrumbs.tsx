import { Link, useLocation } from 'react-router-dom';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

interface BreadcrumbItem {
  path: string;
  label: string;
}

const routeMap: { [key: string]: { label: string; parent?: string } } = {
  '': { label: 'Home' },
  'conversas': { label: 'Conversas', parent: '' },
  'leads': { label: 'Leads', parent: '' },
  'campanhas': { label: 'Campanhas', parent: '' },
  'grupos': { label: 'Grupos', parent: '' },
  'respostas-rapidas': { label: 'Respostas Rápidas', parent: '' },
  'notificacoes': { label: 'Notificações', parent: '' },
  'configuracoes': { label: 'Configurações', parent: '' },
};

export function Breadcrumbs() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  const breadcrumbs: BreadcrumbItem[] = pathSegments
    .map((segment, index) => {
      const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
      const route = routeMap[segment];
      return route ? { path, label: route.label } : null;
    })
    .filter((item): item is BreadcrumbItem => item !== null);

  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-neutral-dark py-2">
      <Link
        to="/"
        className="flex items-center hover:text-primary transition-colors"
      >
        <HomeIcon className="h-4 w-4" />
      </Link>
      
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.path} className="flex items-center">
          <ChevronRightIcon className="h-4 w-4 mx-1" />
          {index === breadcrumbs.length - 1 ? (
            <span className="font-medium text-primary">{crumb.label}</span>
          ) : (
            <Link
              to={crumb.path}
              className="hover:text-primary transition-colors"
            >
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
} 