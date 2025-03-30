import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useActiveMenuItems } from '../hooks/useMenu';

// Tipo estendido para incluir filhos nos itens de menu
type MenuItemWithChildren = {
  id: number | string;
  title: string;
  link: string;
  order?: number;
  open_in_new_tab?: boolean;
  is_active?: boolean;
  parent_id?: number | string | null;
  children?: MenuItemWithChildren[];
};

interface MenuItemProps {
  item: MenuItemWithChildren;
  mobile?: boolean;
  onClose?: () => void;
}

/**
 * Componente que renderiza um item de menu individual
 */
const MenuItem = ({ item, mobile, onClose }: MenuItemProps) => {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  const handleClick = () => {
    if (mobile && onClose) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && hasChildren) {
      setSubmenuOpen(!submenuOpen);
    }
  };

  // Corrigir link de hash para rota
  const fixedLink = item.link.startsWith('#') 
    ? item.link.replace('#', '/') 
    : item.link;

  // Renderizar um item de menu com filhos (dropdown)
  if (hasChildren) {
    return mobile ? (
      // Versão móvel para submenus
      <li>
        <div className="py-2">
          <div
            className="text-gray-800 mb-1 font-medium flex items-center cursor-pointer"
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
                  mobile={true}
                  onClose={onClose}
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
                  to={childItem.link.startsWith('#') ? childItem.link.replace('#', '/') : childItem.link}
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
        to={fixedLink}
        className={mobile
          ? "block py-2 text-gray-800 hover:text-primary-600"
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
  mobile?: boolean;
  onClose?: () => void;
}

/**
 * Componente principal do menu dinâmico
 */
function DynamicMenu({ mobile, onClose }: DynamicMenuProps) {
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
      <ul className={mobile ? "space-y-2" : "flex space-x-8"}>
        <li>
          <Link
            to="/"
            className={mobile
              ? "block py-2 text-gray-800 hover:text-primary-600"
              : "hover:text-primary-200 transition-colors font-medium"
            }
            onClick={onClose}
          >
            Início
          </Link>
        </li>
        <li>
          <Link
            to="/sobre"
            className={mobile
              ? "block py-2 text-gray-800 hover:text-primary-600"
              : "hover:text-primary-200 transition-colors font-medium"
            }
            onClick={onClose}
          >
            Sobre
          </Link>
        </li>
        <li className="relative group">
          <span
            className={mobile
              ? "block py-2 text-gray-800 hover:text-primary-600 flex items-center"
              : "hover:text-primary-200 transition-colors font-medium flex items-center"
            }
          >
            Soluções
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
          <ul className={mobile
            ? "pl-4 mt-2 space-y-2 border-l border-primary-500"
            : "absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10"
          }>
            <li>
              <Link
                to="/pagina/sistema-matriculas"
                className={mobile
                  ? "block py-2 text-gray-800 hover:text-primary-600"
                  : "block px-4 py-2 text-gray-800 hover:bg-primary-50 hover:text-primary-600"
                }
                onClick={onClose}
              >
                Sistema de Matrículas
              </Link>
            </li>
            <li>
              <Link
                to="/pagina/portal-aluno"
                className={mobile
                  ? "block py-2 text-gray-800 hover:text-primary-600"
                  : "block px-4 py-2 text-gray-800 hover:bg-primary-50 hover:text-primary-600"
                }
                onClick={onClose}
              >
                Portal do Aluno
              </Link>
            </li>
            <li>
              <Link
                to="/pagina/gestao-financeira"
                className={mobile
                  ? "block py-2 text-gray-800 hover:text-primary-600"
                  : "block px-4 py-2 text-gray-800 hover:bg-primary-50 hover:text-primary-600"
                }
                onClick={onClose}
              >
                Gestão Financeira
              </Link>
            </li>
          </ul>
        </li>
        <li>
          <Link
            to="/blog"
            className={mobile
              ? "block py-2 text-gray-800 hover:text-primary-600"
              : "hover:text-primary-200 transition-colors font-medium"
            }
            onClick={onClose}
          >
            Blog
          </Link>
        </li>
        <li>
          <Link
            to="/contato"
            className={mobile
              ? "block py-2 text-gray-800 hover:text-primary-600"
              : "hover:text-primary-200 transition-colors font-medium"
            }
            onClick={onClose}
          >
            Contato
          </Link>
        </li>
      </ul>
    );
  }

  return (
    <ul className={mobile ? "space-y-2" : "flex space-x-8"}>
      {menuItems.map((item) => (
        <MenuItem key={item.id} item={item} mobile={mobile} onClose={onClose} />
      ))}
    </ul>
  );
}

export default DynamicMenu; 