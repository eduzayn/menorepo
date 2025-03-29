import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import BlogPostCard from '../components/BlogPostCard';
import { useBlogPostBySlug, useBlogAuthorById, useBlogCategories, usePublishedBlogPosts } from '../hooks/useBlog';
export function BlogPostPage() {
    const { slug = '' } = useParams();
    const navigate = useNavigate();
    // Buscar post pelo slug
    const { data: post, isLoading, error } = useBlogPostBySlug(slug);
    // Buscar autor do post (se post estiver carregado)
    const { data: author } = useBlogAuthorById(post?.author_id || '');
    // Buscar todas as categorias para poder filtrar as do post
    const { data: categories } = useBlogCategories();
    // Buscar posts relacionados
    const { data: relatedPostsData } = usePublishedBlogPosts({
        limit: 3,
        // Não passamos categoryId para mostrar posts recentes em geral,
        // mas poderíamos filtrar por categoria se quiséssemos posts realmente relacionados
    });
    // Redirecionar para o blog se o post não for encontrado
    useEffect(() => {
        if (!isLoading && !post && !error) {
            navigate('/blog', { replace: true });
        }
    }, [post, isLoading, error, navigate]);
    // Encontrar categorias do post
    const postCategories = categories?.filter(cat => post?.category_ids.includes(cat.id)) || [];
    // Formatar data
    const formattedDate = post?.published_at
        ? new Date(post.published_at).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
        : '';
    // Estado de carregamento
    if (isLoading) {
        return (_jsx(Layout, { children: _jsx("div", { className: "container mx-auto px-4 py-12", children: _jsx("div", { className: "max-w-3xl mx-auto", children: _jsxs("div", { className: "animate-pulse space-y-8", children: [_jsx("div", { className: "h-8 bg-gray-200 rounded w-3/4" }), _jsx("div", { className: "h-64 bg-gray-200 rounded-lg" }), _jsx("div", { className: "h-4 bg-gray-200 rounded" }), _jsx("div", { className: "h-4 bg-gray-200 rounded" }), _jsx("div", { className: "h-4 bg-gray-200 rounded w-5/6" }), _jsx("div", { className: "h-4 bg-gray-200 rounded w-1/2" })] }) }) }) }));
    }
    // Estado de erro
    if (error) {
        return (_jsx(Layout, { children: _jsx("div", { className: "container mx-auto px-4 py-12", children: _jsxs("div", { className: "max-w-md mx-auto bg-red-50 p-6 rounded-lg text-center", children: [_jsx("h2", { className: "text-xl font-semibold text-red-800 mb-2", children: "Erro ao carregar post" }), _jsx("p", { className: "text-red-600 mb-4", children: "N\u00E3o foi poss\u00EDvel carregar o conte\u00FAdo deste artigo. Por favor, tente novamente mais tarde." }), _jsx(Link, { to: "/blog", className: "bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition", children: "Voltar ao blog" })] }) }) }));
    }
    // Caso o post não exista
    if (!post) {
        return (_jsx(Layout, { children: _jsx("div", { className: "container mx-auto px-4 py-12", children: _jsxs("div", { className: "max-w-md mx-auto bg-gray-50 p-6 rounded-lg text-center", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-800 mb-2", children: "Post n\u00E3o encontrado" }), _jsx("p", { className: "text-gray-600 mb-4", children: "O artigo que voc\u00EA est\u00E1 procurando n\u00E3o est\u00E1 dispon\u00EDvel ou foi removido." }), _jsx(Link, { to: "/blog", className: "bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition", children: "Voltar ao blog" })] }) }) }));
    }
    // Renderizar SEO
    const metaDescription = post.meta_description || post.excerpt || `${post.title} - Blog Edunéxia`;
    const metaKeywords = post.meta_keywords || 'edunexia, blog, educação, tecnologia';
    // Helper para renderizar conteúdo estruturado
    const renderContent = () => {
        // Se for JSON estruturado, renderizar conforme tipo de cada bloco
        if (post.content) {
            try {
                // Exemplo simples - na prática você precisaria de um parser mais robusto
                // para lidar com diferentes tipos de blocos (texto, imagem, vídeo, etc)
                if (typeof post.content === 'string') {
                    return _jsx("div", { dangerouslySetInnerHTML: { __html: post.content } });
                }
                // Renderizar conteúdo estruturado (blocos)
                if (Array.isArray(post.content.blocks)) {
                    return (_jsx("div", { className: "space-y-6", children: post.content.blocks.map((block, index) => {
                            if (block.type === 'paragraph') {
                                return _jsx("p", { className: "text-gray-700 leading-relaxed", children: block.content }, index);
                            }
                            if (block.type === 'heading') {
                                return _jsx("h2", { className: "text-2xl font-bold text-primary-800 mt-8 mb-4", children: block.content }, index);
                            }
                            if (block.type === 'image' && block.url) {
                                return (_jsxs("figure", { className: "my-8", children: [_jsx("img", { src: block.url, alt: block.alt || '', className: "rounded-lg w-full" }), block.caption && _jsx("figcaption", { className: "text-sm text-gray-500 mt-2 text-center", children: block.caption })] }, index));
                            }
                            if (block.type === 'list' && Array.isArray(block.items)) {
                                return (_jsx("ul", { className: "list-disc pl-6 space-y-2", children: block.items.map((item, i) => (_jsx("li", { className: "text-gray-700", children: item }, i))) }, index));
                            }
                            return null;
                        }) }));
                }
                // Fallback para objeto simples
                return _jsx("pre", { className: "p-4 bg-gray-100 rounded overflow-auto", children: JSON.stringify(post.content, null, 2) });
            }
            catch (e) {
                console.error("Erro ao renderizar conteúdo:", e);
                return _jsx("p", { className: "text-red-600", children: "Erro ao renderizar conte\u00FAdo do post." });
            }
        }
        return _jsx("p", { className: "text-gray-600", children: "Este post n\u00E3o possui conte\u00FAdo." });
    };
    // Renderizar posts relacionados
    const relatedPosts = relatedPostsData?.posts
        ?.filter(p => p.id !== post.id) // Excluir o post atual
        ?.slice(0, 3) || []; // Limitar a 3
    return (_jsxs(Layout, { children: [_jsxs("div", { className: "hidden", children: [_jsxs("title", { children: [post.title, " - Blog Edun\u00E9xia"] }), _jsx("meta", { name: "description", content: metaDescription }), _jsx("meta", { name: "keywords", content: metaKeywords }), _jsx("meta", { property: "og:title", content: post.title }), _jsx("meta", { property: "og:description", content: metaDescription }), post.featured_image_url && _jsx("meta", { property: "og:image", content: post.featured_image_url }), _jsx("meta", { name: "twitter:card", content: "summary_large_image" })] }), _jsxs("article", { className: "container mx-auto px-4 py-12", children: [_jsxs("div", { className: "max-w-3xl mx-auto", children: [_jsxs("nav", { className: "flex text-sm text-gray-500 mb-8", children: [_jsx(Link, { to: "/", className: "hover:text-primary-600", children: "Home" }), _jsx("span", { className: "mx-2", children: "/" }), _jsx(Link, { to: "/blog", className: "hover:text-primary-600", children: "Blog" }), _jsx("span", { className: "mx-2", children: "/" }), _jsx("span", { className: "text-gray-700", children: post.title })] }), _jsx("div", { className: "flex flex-wrap gap-2 mb-4", children: postCategories.map(category => (_jsx(Link, { to: `/blog?categoria=${category.slug}`, className: "text-xs bg-primary-50 text-primary-700 px-3 py-1 rounded-full hover:bg-primary-100 transition", children: category.name }, category.id))) }), _jsx("h1", { className: "text-4xl font-bold text-primary-900 mb-4", children: post.title }), _jsx("div", { className: "flex items-center mb-8", children: _jsxs("div", { className: "flex items-center", children: [author?.avatar_url ? (_jsx("img", { src: author.avatar_url, alt: author.name, className: "w-10 h-10 rounded-full mr-3" })) : (_jsx("div", { className: "w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-3", children: _jsx("span", { className: "text-primary-700 font-medium", children: author?.name.charAt(0) || '?' }) })), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-900", children: author?.name }), _jsx("div", { className: "text-sm text-gray-500", children: formattedDate })] })] }) }), post.featured_image_url && (_jsx("div", { className: "mb-8", children: _jsx("img", { src: post.featured_image_url, alt: post.title, className: "w-full rounded-lg shadow-md" }) })), _jsx("div", { className: "prose prose-lg max-w-none", children: renderContent() }), author && author.bio && (_jsx("div", { className: "mt-12 p-6 bg-gray-50 rounded-lg", children: _jsxs("div", { className: "flex items-start", children: [author.avatar_url ? (_jsx("img", { src: author.avatar_url, alt: author.name, className: "w-16 h-16 rounded-full mr-4" })) : (_jsx("div", { className: "w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mr-4", children: _jsx("span", { className: "text-xl text-primary-700 font-medium", children: author.name.charAt(0) }) })), _jsxs("div", { children: [_jsxs("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: ["Sobre ", author.name] }), _jsx("p", { className: "text-gray-600 text-sm", children: author.bio }), author.social_links && Object.keys(author.social_links).length > 0 && (_jsx("div", { className: "mt-3 flex space-x-3", children: Object.entries(author.social_links).map(([platform, url]) => (_jsx("a", { href: url, target: "_blank", rel: "noopener noreferrer", className: "text-gray-500 hover:text-primary-600", children: platform.charAt(0).toUpperCase() + platform.slice(1) }, platform))) }))] })] }) }))] }), relatedPosts.length > 0 && (_jsxs("div", { className: "max-w-4xl mx-auto mt-16", children: [_jsx("h2", { className: "text-2xl font-bold text-primary-800 mb-6", children: "Posts relacionados" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: relatedPosts.map(relatedPost => (_jsx(BlogPostCard, { post: relatedPost }, relatedPost.id))) })] })), _jsx("div", { className: "max-w-4xl mx-auto mt-16 text-center", children: _jsxs("div", { className: "bg-primary-50 rounded-lg p-8", children: [_jsx("h2", { className: "text-2xl font-bold text-primary-800 mb-4", children: "Gostou do conte\u00FAdo?" }), _jsx("p", { className: "text-primary-700 mb-6", children: "Conhe\u00E7a as solu\u00E7\u00F5es da Edun\u00E9xia para sua institui\u00E7\u00E3o de ensino." }), _jsx(Link, { to: "/contato", className: "inline-block px-6 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition", children: "Agende uma demonstra\u00E7\u00E3o" })] }) })] })] }));
}
export default BlogPostPage;
