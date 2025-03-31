import React from 'react';
import { Link } from 'react-router-dom';

interface MenuItem {
  id: string;
  title: string;
  path?: string;
  link?: string;
  url?: string;
  children?: MenuItem[];
  order_index?: number;
  is_active?: boolean;
  open_in_new_tab?: boolean;
  parent_id?: string;
}

interface DynamicMenuProps {
  items: MenuItem[];
  className?: string;
}

export const DynamicMenu: React.FC<DynamicMenuProps> = ({ items, className = '' }) => {
  const renderMenuItem = (item: MenuItem) => {
    const href = item.path || item.link || item.url || '#';
    
    return (
      <li key={item.id} className="relative group">
        <Link
          to={href}
          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          target={item.open_in_new_tab ? '_blank' : undefined}
          rel={item.open_in_new_tab ? 'noopener noreferrer' : undefined}
        >
          {item.title}
        </Link>
        {item.children && item.children.length > 0 && (
          <ul className="absolute left-0 hidden group-hover:block bg-white shadow-lg rounded-md">
            {item.children.map((child) => (
              <li key={child.id}>
                <Link
                  to={child.path || child.link || child.url || '#'}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  target={child.open_in_new_tab ? '_blank' : undefined}
                  rel={child.open_in_new_tab ? 'noopener noreferrer' : undefined}
                >
                  {child.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <nav className={className}>
      <ul className="flex space-x-4">
        {items.map(renderMenuItem)}
      </ul>
    </nav>
  );
};

export default DynamicMenu; 