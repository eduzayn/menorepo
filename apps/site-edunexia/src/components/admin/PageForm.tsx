import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageInput } from '../../services/site-pages';
import { SitePage } from '@edunexia/database-schema/src/site-edunexia';
import { useCreatePage, useUpdatePage } from '../../hooks/usePages';
import { FormSection } from './FormSection';
import { TextEditor } from '../editor/TextEditor';

// Gerador de slug a partir do título
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9]+/g, '-') // Substitui caracteres especiais por hífen
    .replace(/^-+|-+$/g, '') // Remove hífens no início e fim
    .replace(/-{2,}/g, '-'); // Substitui múltiplos hífens por um único
};

interface PageFormProps {
  initialData?: SitePage;
  mode: 'create' | 'edit';
}

export const PageForm = ({ initialData, mode }: PageFormProps) => {
  const navigate = useNavigate();
  const createPage = useCreatePage();
  const updatePage = useUpdatePage();

  // Estado inicial do formulário
  const [formData, setFormData] = useState<PageInput>({
    title: '',
    slug: '',
    content: { blocks: [] },
    meta_description: '',
    meta_keywords: '',
    status: 'draft',
    featured_image_url: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [previewContent, setPreviewContent] = useState(false);

  // Carregar dados existentes se estiver editando
  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        title: initialData.title,
        slug: initialData.slug,
        content: initialData.content,
        meta_description: initialData.meta_description || '',
        meta_keywords: initialData.meta_keywords || '',
        status: initialData.status,
        featured_image_url: initialData.featured_image_url || '',
      });
      setSlugManuallyEdited(true); // Não alterar slug automaticamente ao editar
    }
  }, [initialData, mode]);

  // Gerar slug automaticamente a partir do título
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setFormData((prev) => ({ ...prev, title: newTitle }));

    // Atualizar o slug automaticamente se não foi editado manualmente
    if (!slugManuallyEdited) {
      setFormData((prev) => ({ ...prev, slug: generateSlug(newTitle) }));
    }
  };

  // Quando o usuário editar manualmente o slug
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSlug = e.target.value;
    setFormData((prev) => ({ ...prev, slug: generateSlug(newSlug) }));
    setSlugManuallyEdited(true);
  };

  // Manipulador para campos de texto simples
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Manipulador para o editor de conteúdo
  const handleContentChange = (content: any) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  // Validação do formulário
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'O título é obrigatório';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'O slug é obrigatório';
    }

    // Aqui você pode adicionar mais validações conforme necessário

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enviar o formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (mode === 'create') {
        await createPage.mutateAsync(formData);
        navigate('/admin/paginas');
      } else if (mode === 'edit' && initialData) {
        await updatePage.mutateAsync({
          id: initialData.id,
          data: formData,
        });
        navigate('/admin/paginas');
      }
    } catch (error) {
      console.error('Erro ao salvar página:', error);
      // Exibir mensagem de erro
    }
  };

  // Estado de loading dos mutantes
  const isLoading = createPage.isLoading || updatePage.isLoading;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormSection title="Informações Básicas">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Título */}
          <div className="col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Título da Página *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleTitleChange}
              className={`mt-1 block w-full rounded-md border ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          {/* Slug */}
          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
              Slug *
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                /pagina/
              </span>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleSlugChange}
                className={`block w-full flex-1 rounded-none rounded-r-md border ${
                  errors.slug ? 'border-red-300' : 'border-gray-300'
                } px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
              />
            </div>
            {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug}</p>}
          </div>

          {/* Status */}
          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            >
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
              <option value="archived">Arquivado</option>
            </select>
          </div>
        </div>
      </FormSection>

      <FormSection title="Conteúdo">
        <div className="flex justify-end mb-2">
          <button
            type="button"
            onClick={() => setPreviewContent(!previewContent)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {previewContent ? 'Editar Conteúdo' : 'Visualizar Conteúdo'}
          </button>
        </div>

        <div className="min-h-[300px] border border-gray-300 rounded-md p-4">
          <TextEditor
            initialValue={formData.content}
            onChange={handleContentChange}
            readOnly={previewContent}
          />
        </div>
      </FormSection>

      <FormSection title="SEO e Metadata">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Meta Descrição */}
          <div className="col-span-2">
            <label htmlFor="meta_description" className="block text-sm font-medium text-gray-700">
              Meta Descrição
            </label>
            <textarea
              id="meta_description"
              name="meta_description"
              value={formData.meta_description || ''}
              onChange={handleInputChange}
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              placeholder="Descrição para SEO (recomendado até 160 caracteres)"
            />
            {formData.meta_description && formData.meta_description.length > 160 && (
              <p className="mt-1 text-sm text-yellow-600">
                A descrição é muito longa ({formData.meta_description.length}/160)
              </p>
            )}
          </div>

          {/* Meta Keywords */}
          <div className="col-span-2">
            <label htmlFor="meta_keywords" className="block text-sm font-medium text-gray-700">
              Meta Keywords
            </label>
            <input
              type="text"
              id="meta_keywords"
              name="meta_keywords"
              value={formData.meta_keywords || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              placeholder="Palavras-chave separadas por vírgula"
            />
          </div>

          {/* URL de Imagem de Destaque */}
          <div className="col-span-2">
            <label htmlFor="featured_image_url" className="block text-sm font-medium text-gray-700">
              URL da Imagem de Destaque
            </label>
            <input
              type="url"
              id="featured_image_url"
              name="featured_image_url"
              value={formData.featured_image_url || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              placeholder="https://exemplo.com/imagem.jpg"
            />
            {formData.featured_image_url && (
              <div className="mt-2">
                <img
                  src={formData.featured_image_url}
                  alt="Preview"
                  className="h-32 w-auto object-cover rounded-md"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/300x150?text=Imagem+Inválida';
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </FormSection>

      <div className="flex justify-end space-x-3 pt-5">
        <button
          type="button"
          onClick={() => navigate('/admin/paginas')}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-75"
        >
          {isLoading ? (
            <>
              <svg
                className="mr-2 h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Salvando...
            </>
          ) : mode === 'create' ? (
            'Criar Página'
          ) : (
            'Salvar Alterações'
          )}
        </button>
      </div>
    </form>
  );
}; 