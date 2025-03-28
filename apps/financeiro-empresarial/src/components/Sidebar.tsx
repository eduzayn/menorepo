import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  DollarSign,
  CreditCard,
  FileText,
  BarChart2,
  Tag,
  Users,
  Settings,
  ChevronRight,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active: boolean;
}

// Item de menu individual
function MenuItem({ icon, label, to, active }: MenuItemProps) {
  return (
    <Link 
      to={to}
      className={`flex items-center gap-2 p-2 rounded-md transition-colors ${
        active 
          ? 'bg-blue-100 text-blue-700' 
          : 'hover:bg-gray-100'
      }`}
    >
      <div className="w-5 h-5 flex items-center justify-center">
        {icon}
      </div>
      <span>{label}</span>
    </Link>
  );
}

// Componente de seção de menu (grupo de itens)
interface MenuSectionProps {
  title: string;
  children: React.ReactNode;
}

function MenuSection({ title, children }: MenuSectionProps) {
  const [expanded, setExpanded] = useState(true);
  
  return (
    <div className="mb-2">
      <button 
        className="flex items-center w-full text-sm text-gray-500 mb-1 p-1 font-medium"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? <ChevronDown className="w-4 h-4 mr-1" /> : <ChevronRight className="w-4 h-4 mr-1" />}
        {title}
      </button>
      {expanded && (
        <div className="ml-2 space-y-1">
          {children}
        </div>
      )}
    </div>
  );
}

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Verifica se um caminho está ativo (exato ou como prefixo)
  const isActive = (path: string) => {
    if (path === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(path);
  }
  
  // Conteúdo da barra lateral
  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-blue-800">Financeiro</h2>
        <p className="text-sm text-gray-500">Gestão Financeira Edunéxia</p>
      </div>
      
      <div className="p-4 flex-1 overflow-y-auto">
        <MenuSection title="Principal">
          <MenuItem 
            icon={<Home className="w-4 h-4" />} 
            label="Dashboard" 
            to="/" 
            active={isActive('/')}
          />
        </MenuSection>
        
        <MenuSection title="Financeiro">
          <MenuItem 
            icon={<DollarSign className="w-4 h-4" />} 
            label="Contas a Receber" 
            to="/receber" 
            active={isActive('/receber')}
          />
          <MenuItem 
            icon={<CreditCard className="w-4 h-4" />} 
            label="Contas a Pagar" 
            to="/pagar" 
            active={isActive('/pagar')}
          />
          <MenuItem 
            icon={<FileText className="w-4 h-4" />} 
            label="Cobranças" 
            to="/cobrancas" 
            active={isActive('/cobrancas')}
          />
          <MenuItem 
            icon={<Tag className="w-4 h-4" />} 
            label="Taxas Administrativas" 
            to="/taxas" 
            active={isActive('/taxas')}
          />
        </MenuSection>
        
        <MenuSection title="Relatórios">
          <MenuItem 
            icon={<BarChart2 className="w-4 h-4" />} 
            label="Relatórios Financeiros" 
            to="/relatorios" 
            active={isActive('/relatorios')}
          />
          <MenuItem 
            icon={<Users className="w-4 h-4" />} 
            label="Comissões e Repasses" 
            to="/comissoes" 
            active={isActive('/comissoes')}
          />
        </MenuSection>
        
        <MenuSection title="Sistema">
          <MenuItem 
            icon={<Settings className="w-4 h-4" />} 
            label="Configurações" 
            to="/configuracoes" 
            active={isActive('/configuracoes')}
          />
        </MenuSection>
      </div>
      
      <div className="p-4 border-t text-xs text-gray-500">
        v1.0.0 | Edunéxia © {new Date().getFullYear()}
      </div>
    </div>
  );
  
  // Versão móvel com toggle
  return (
    <>
      {/* Versão móvel do sidebar com toggle */}
      <div className="lg:hidden fixed top-0 left-0 z-30 p-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md bg-white shadow-md"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      
      {/* Overlay para mobile quando aberto */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar móvel */}
      <div 
        className={`lg:hidden fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>
      
      {/* Sidebar desktop */}
      <div className="hidden lg:block w-64 h-screen border-r bg-white">
        {sidebarContent}
      </div>
    </>
  );
} 