import { PageForm } from '../../components/admin/PageForm';

const NewPagePage = () => {
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Nova Página</h1>
        <p className="text-gray-600 mt-1">
          Crie uma nova página estática para o site institucional
        </p>
      </div>
      
      <PageForm mode="create" />
    </div>
  );
};

export default NewPagePage; 