import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useActiveMenuItems } from '../hooks/useMenu';
import { SiteMenuItem } from '@edunexia/database-schema/src/site-edunexia';

// Tipo estendido para incluir filhos nos itens de menu
type MenuItemWithChildren = SiteMenuItem & { children?: MenuItemWithChildren[] };

interface MenuItemProps {
  item: MenuItemWithChildren;
  isMobile?: boolean;
  onItemClick?: () => void;
}

/**
 * Componente que renderiza um item de menu individual
 */
const MenuItem = ({ item, isMobile, onItemClick }: MenuItemProps) => {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  
  const handleClick = () => {
    if (isMobile && onItemClick) {
      onItemClick();
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && hasChildren) {
      setSubmenuOpen(!submenuOpen);
    }
  };
  
  // Renderizar um item de menu com filhos (dropdown)
  if (hasChildren) {
    return isMobile ? (
      // Versão móvel para submenus
      <li>
        <div className="py-2">
          <div 
            className="text-primary-100 mb-1 font-medium flex items-center cursor-pointer"
            onClick={() => setSubmenuOpen(!submenuOpen)}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="button"
            aria-expanded={submenuOpen}
          >
            {item.title}
            <svg 
              className={`w-4 h-4 ml-1 transition-transform ${submenuOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          {submenuOpen && item.children && (
            <ul className="pl-4 space-y-2 border-l border-primary-500">
              {item.children.map((childItem) => (
                <MenuItem 
                  key={childItem.id} 
                  item={childItem} 
                  isMobile={true} 
                  onItemClick={onItemClick}
                />
              ))}
            </ul>
          )}
        </div>
      </li>
    ) : (
      // Versão desktop para submenus (dropdown)
      <li className="relative group">
        <span 
          className="hover:text-primary-200 transition-colors font-medium cursor-pointer flex items-center"
          onClick={() => setSubmenuOpen(!submenuOpen)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          aria-expanded={submenuOpen}
        >
          {item.title}
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
        <ul className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
          {item.children && item.children.map((childItem) => (
            <li key={childItem.id}>
              {childItem.children && childItem.children.length > 0 ? (
                <MenuItem item={childItem} />
              ) : (
                <Link 
                  to={childItem.link} 
                  className="block px-4 py-2 text-gray-800 hover:bg-primary-50 hover:text-primary-600"
                  onClick={handleClick}
                  target={childItem.open_in_new_tab ? '_blank' : undefined}
                  rel={childItem.open_in_new_tab ? 'noopener noreferrer' : undefined}
                >
                  {childItem.title}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </li>
    );
  }
  
  // Renderizar um item de menu simples (link)
  return (
    <li>
      <Link 
        to={item.link} 
        className={isMobile 
          ? "block py-2 text-primary-100 hover:text-white"
          : "hover:text-primary-200 transition-colors font-medium"
        }
        onClick={handleClick}
        target={item.open_in_new_tab ? '_blank' : undefined}
        rel={item.open_in_new_tab ? 'noopener noreferrer' : undefined}
      >
        {item.title}
      </Link>
    </li>
  );
};

interface DynamicMenuProps {
  isMobile?: boolean;
  onItemClick?: () => void;
}

/**
 * Componente principal do menu dinâmico
 */
export function DynamicMenu({ isMobile, onItemClick }: DynamicMenuProps) {
  const { tree: menuItems, isLoading, error } = useActiveMenuItems();
  
  if (isLoading) {
    return (
      <div className="animate-pulse flex space-x-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-4 bg-primary-300 rounded w-16" />
        ))}
      </div>
    );
  }
  
  if (error || !menuItems.length) {
    // Em caso de erro, exibir menu padrão
    return (
      <ul className={isMobile ? "space-y-2" : "flex space-x-8"}>
        <li>
          <Link 
            to="/" 
            className={isMobile 
              ? "block py-2 text-primary-100 hover:text-white"
              : "hover:text-primary-200 transition-colors font-medium"
            }
            onClick={onItemClick}
          >
            Início
          </Link>
        </li>
        <li>
          <Link 
            to="/contato" 
            className={isMobile 
              ? "block py-2 text-primary-100 hover:text-white"
              : "hover:text-primary-200 transition-colors font-medium"
            }
            onClick={onItemClick}
          >
            Contato
          </Link>
        </li>
      </ul>
    );
  }
  
  return (
    <ul className={isMobile ? "space-y-2" : "flex space-x-8"}>
      {menuItems.map((item) => (
        <MenuItem 
          key={item.id} 
          item={item} 
          isMobile={isMobile} 
          onItemClick={onItemClick} 
        />
      ))}
    </ul>
  );
}

export default DynamicMenu; 