import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import BlogPostCard from '../components/BlogPostCard';
import { usePublishedBlogPosts, useBlogCategories } from '../hooks/useBlog';
export function BlogPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get('pagina') || '1', 10);
    const selectedCategorySlug = searchParams.get('categoria') || '';
    // Recuperar todas as categorias
    const { data: categories } = useBlogCategories();
    // Encontrar ID da categoria se houver um slug selecionado
    const selectedCategory = categories?.find(cat => cat.slug === selectedCategorySlug);
    // Buscar posts publicados com paginação
    const { data, isLoading, error } = usePublishedBlogPosts({
        page: currentPage,
        limit: 9,
        categoryId: selectedCategory?.id
    });
    // Função para trocar de página
    const handlePageChange = (newPage) => {
        const params = new URLSearchParams(searchParams);
        params.set('pagina', newPage.toString());
        setSearchParams(params);
        window.scrollTo(0, 0);
    };
    // Função para filtrar por categoria
    const handleCategoryFilter = (categorySlug) => {
        const params = new URLSearchParams(searchParams);
        if (categorySlug) {
            params.set('categoria', categorySlug);
        }
        else {
            params.delete('categoria');
        }
        params.delete('pagina'); // Reset página ao mudar categoria
        setSearchParams(params);
    };
    // Extrair post em destaque (primeiro post)
    const featuredPost = data?.posts[0];
    const regularPosts = data?.posts.slice(1);
    return (_jsx(Layout, { children: _jsxs("div", { className: "container mx-auto px-4 py-12", children: [_jsxs("div", { className: "mb-12 text-center", children: [_jsx("h1", { className: "text-4xl font-bold text-primary-800 mb-4", children: "Blog da Edun\u00E9xia" }), _jsx("p", { className: "text-lg text-gray-600 max-w-2xl mx-auto", children: "Artigos, tutoriais e cases de sucesso sobre tecnologia educacional e gest\u00E3o de institui\u00E7\u00F5es de ensino." })] }), categories && categories.length > 0 && (_jsx("div", { className: "mb-10", children: _jsxs("div", { className: "flex flex-wrap items-center justify-center gap-2", children: [_jsx("button", { onClick: () => handleCategoryFilter(''), className: `px-4 py-2 rounded-full text-sm font-medium transition ${!selectedCategorySlug
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`, children: "Todos" }), categories.map(category => (_jsx("button", { onClick: () => handleCategoryFilter(category.slug), className: `px-4 py-2 rounded-full text-sm font-medium transition ${selectedCategorySlug === category.slug
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`, children: category.name }, category.id)))] }) })), isLoading && (_jsx("div", { className: "py-12", children: _jsx("div", { className: "max-w-3xl mx-auto", children: _jsxs("div", { className: "animate-pulse space-y-8", children: [_jsx("div", { className: "h-64 bg-gray-200 rounded-lg" }), _jsx("div", { className: "h-8 bg-gray-200 rounded w-3/4" }), _jsx("div", { className: "h-4 bg-gray-200 rounded" }), _jsx("div", { className: "h-4 bg-gray-200 rounded" }), _jsx("div", { className: "h-4 bg-gray-200 rounded w-5/6" })] }) }) })), error && (_jsx("div", { className: "py-12", children: _jsxs("div", { className: "max-w-md mx-auto bg-red-50 p-6 rounded-lg text-center", children: [_jsx("h2", { className: "text-xl font-semibold text-red-800 mb-2", children: "Erro ao carregar posts" }), _jsx("p", { className: "text-red-600 mb-4", children: "N\u00E3o foi poss\u00EDvel carregar os artigos do blog. Por favor, tente novamente mais tarde." }), _jsx("button", { onClick: () => window.location.reload(), className: "bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition", children: "Tentar novamente" })] }) })), !isLoading && !error && data && (_jsxs(_Fragment, { children: [featuredPost && (_jsx("div", { className: "mb-12", children: _jsx(BlogPostCard, { post: featuredPost, variant: "featured" }) })), regularPosts && regularPosts.length > 0 ? (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12", children: regularPosts.map(post => (_jsx(BlogPostCard, { post: post }, post.id))) })) : (_jsxs("div", { className: "text-center py-10 bg-gray-50 rounded-lg", children: [_jsx("h3", { className: "text-xl font-medium text-gray-700 mb-2", children: "Nenhum post encontrado" }), _jsx("p", { className: "text-gray-500", children: selectedCategorySlug
                                        ? `Não encontramos posts na categoria selecionada.`
                                        : `Ainda não há posts publicados no blog.` }), selectedCategorySlug && (_jsx("button", { onClick: () => handleCategoryFilter(''), className: "mt-4 text-primary-600 hover:text-primary-800 font-medium", children: "Ver todos os posts" }))] })), data.pagination.totalPages > 1 && (_jsx("div", { className: "flex justify-center mt-12", children: _jsxs("div", { className: "flex space-x-1", children: [_jsx("button", { onClick: () => handlePageChange(currentPage - 1), disabled: currentPage === 1, className: `px-4 py-2 rounded-md ${currentPage === 1
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`, children: "Anterior" }), Array.from({ length: data.pagination.totalPages }, (_, i) => i + 1).map(page => (_jsx("button", { onClick: () => handlePageChange(page), className: `w-10 h-10 rounded-md ${currentPage === page
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`, children: page }, page))), _jsx("button", { onClick: () => handlePageChange(currentPage + 1), disabled: currentPage === data.pagination.totalPages, className: `px-4 py-2 rounded-md ${currentPage === data.pagination.totalPages
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`, children: "Pr\u00F3xima" })] }) }))] })), _jsxs("div", { className: "mt-16 bg-primary-50 rounded-lg p-8 text-center", children: [_jsx("h2", { className: "text-2xl font-bold text-primary-800 mb-4", children: "Quer receber nossos artigos em primeira m\u00E3o?" }), _jsx("p", { className: "text-primary-700 mb-6 max-w-2xl mx-auto", children: "Assine nossa newsletter e receba conte\u00FAdos exclusivos sobre tecnologia educacional, gest\u00E3o escolar e as \u00FAltimas tend\u00EAncias em educa\u00E7\u00E3o." }), _jsxs("div", { className: "max-w-md mx-auto flex flex-col sm:flex-row gap-2", children: [_jsx("input", { type: "email", placeholder: "Seu melhor e-mail", className: "flex-grow px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" }), _jsx("button", { className: "sm:flex-shrink-0 px-6 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition", children: "Assinar" })] })] })] }) }));
}
export default BlogPage;
