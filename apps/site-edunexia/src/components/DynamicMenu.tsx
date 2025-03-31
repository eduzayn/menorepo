import React from 'react';
import { Link } from 'react-router-dom';

interface MenuItem {
  id: string;
  title: string;
  path: string;
  children?: MenuItem[];
}

interface DynamicMenuProps {
  items: MenuItem[];
  className?: string;
}

export const DynamicMenu: React.FC<DynamicMenuProps> = ({ items, className = '' }) => {
  const renderMenuItem = (item: MenuItem) => {
    return (
      <li key={item.id} className="relative group">
        <Link
          to={item.path}
          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
        >
          {item.title}
        </Link>
        {item.children && item.children.length > 0 && (
          <ul className="absolute left-0 hidden group-hover:block bg-white shadow-lg rounded-md">
            {item.children.map((child) => (
              <li key={child.id}>
                <Link
                  to={child.path}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
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