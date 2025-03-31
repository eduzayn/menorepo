import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bem-vindo à Edunéxia
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Transformando a educação com tecnologia
          </p>
          <Link
            to="/planos"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Conheça nossos planos
          </Link>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Educação Personalizada</h2>
            <p className="text-gray-600">
              Adaptamos o conteúdo às necessidades específicas de cada aluno
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Tecnologia Avançada</h2>
            <p className="text-gray-600">
              Utilizamos as mais modernas ferramentas educacionais
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Suporte Dedicado</h2>
            <p className="text-gray-600">
              Nossa equipe está sempre pronta para ajudar
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage; 