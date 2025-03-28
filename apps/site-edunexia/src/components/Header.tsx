import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="bg-primary-600 text-white py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Edunéxia</Link>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="hover:text-primary-200">Início</Link>
            </li>
            <li>
              <Link to="/sobre" className="hover:text-primary-200">Sobre</Link>
            </li>
            <li>
              <Link to="/contato" className="hover:text-primary-200">Contato</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header; 