import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePageBySlug } from '../hooks/usePages';
import Layout from '../components/Layout';
export function DynamicPage() {
    const { slug = '' } = useParams();
    const navigate = useNavigate();
    // Buscar página pelo slug
    const { data: page, isLoading, error } = usePageBySlug(slug);
    // Redirecionar para home se página não for encontrada
    useEffect(() => {
        if (!isLoading && !page && !error) {
            navigate('/', { replace: true });
        }
    }, [page, isLoading, error, navigate]);
    if (isLoading) {
        return (_jsx(Layout, { children: _jsx("div", { className: "container mx-auto py-12 px-4", children: _jsxs("div", { className: "animate-pulse", children: [_jsx("div", { className: "h-10 bg-gray-200 rounded w-3/4 mb-6" }), _jsx("div", { className: "h-4 bg-gray-200 rounded mb-2.5 w-full" }), _jsx("div", { className: "h-4 bg-gray-200 rounded mb-2.5 w-11/12" }), _jsx("div", { className: "h-4 bg-gray-200 rounded mb-2.5 w-4/5" }), _jsx("div", { className: "h-64 bg-gray-200 rounded my-6" }), _jsx("div", { className: "h-4 bg-gray-200 rounded mb-2.5 w-full" }), _jsx("div", { className: "h-4 bg-gray-200 rounded mb-2.5 w-full" }), _jsx("div", { className: "h-4 bg-gray-200 rounded mb-2.5 w-3/4" })] }) }) }));
    }
    if (error) {
        return (_jsx(Layout, { children: _jsx("div", { className: "container mx-auto py-12 px-4", children: _jsxs("div", { className: "bg-red-50 p-6 rounded-lg text-center", children: [_jsx("h1", { className: "text-2xl font-bold text-red-800 mb-4", children: "Erro ao carregar p\u00E1gina" }), _jsx("p", { className: "text-red-600 mb-6", children: "N\u00E3o foi poss\u00EDvel carregar o conte\u00FAdo desta p\u00E1gina. Por favor, tente novamente mais tarde." }), _jsx("button", { onClick: () => navigate('/'), className: "px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition", children: "Voltar ao in\u00EDcio" })] }) }) }));
    }
    if (!page) {
        return (_jsx(Layout, { children: _jsx("div", { className: "container mx-auto py-12 px-4", children: _jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-800 mb-4", children: "P\u00E1gina n\u00E3o encontrada" }), _jsx("p", { className: "text-gray-600 mb-6", children: "A p\u00E1gina que voc\u00EA est\u00E1 procurando n\u00E3o existe ou foi removida." }), _jsx("button", { onClick: () => navigate('/'), className: "px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition", children: "Voltar ao in\u00EDcio" })] }) }) }));
    }
    // Renderizar SEO
    const metaDescription = page.meta_description || `${page.title} - Edunéxia`;
    const metaKeywords = page.meta_keywords || 'edunexia, educação, tecnologia';
    // Helper para renderizar conteúdo estruturado
    const renderContent = () => {
        // Se for JSON estruturado, renderizar conforme tipo de cada bloco
        if (page.content) {
            try {
                // Exemplo simples - na prática você precisaria de um parser mais robusto
                // para lidar com diferentes tipos de blocos (texto, imagem, vídeo, etc)
                if (typeof page.content === 'string') {
                    return _jsx("div", { dangerouslySetInnerHTML: { __html: page.content } });
                }
                // Renderizar conteúdo estruturado (blocos)
                if (Array.isArray(page.content.blocks)) {
                    return (_jsx("div", { className: "space-y-8", children: page.content.blocks.map((block, index) => {
                            if (block.type === 'paragraph') {
                                return _jsx("p", { className: "text-gray-700", children: block.content }, index);
                            }
                            if (block.type === 'heading') {
                                return _jsx("h2", { className: "text-2xl font-bold text-primary-800 mt-8 mb-4", children: block.content }, index);
                            }
                            if (block.type === 'image' && block.url) {
                                return (_jsxs("figure", { className: "my-6", children: [_jsx("img", { src: block.url, alt: block.alt || '', className: "rounded-lg w-full" }), block.caption && _jsx("figcaption", { className: "text-sm text-gray-500 mt-2", children: block.caption })] }, index));
                            }
                            return null;
                        }) }));
                }
                // Fallback para objeto simples
                return _jsx("pre", { className: "p-4 bg-gray-100 rounded overflow-auto", children: JSON.stringify(page.content, null, 2) });
            }
            catch (e) {
                console.error("Erro ao renderizar conteúdo:", e);
                return _jsx("p", { className: "text-red-600", children: "Erro ao renderizar conte\u00FAdo da p\u00E1gina." });
            }
        }
        return _jsx("p", { className: "text-gray-600", children: "Esta p\u00E1gina n\u00E3o possui conte\u00FAdo." });
    };
    return (_jsxs(Layout, { children: [_jsxs("div", { className: "hidden", children: [_jsxs("title", { children: [page.title, " - Edun\u00E9xia"] }), _jsx("meta", { name: "description", content: metaDescription }), _jsx("meta", { name: "keywords", content: metaKeywords })] }), _jsxs("div", { className: "container mx-auto py-12 px-4", children: [page.featured_image_url && (_jsx("div", { className: "mb-8", children: _jsx("img", { src: page.featured_image_url, alt: page.title, className: "w-full h-64 md:h-96 object-cover rounded-lg shadow-md" }) })), _jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-4xl font-bold text-primary-800 mb-4", children: page.title }), page.published_at && (_jsxs("p", { className: "text-gray-500", children: ["Publicado em: ", new Date(page.published_at).toLocaleDateString('pt-BR')] }))] }), _jsx("div", { className: "prose prose-lg max-w-none", children: renderContent() })] })] }));
}
export default DynamicPage;
