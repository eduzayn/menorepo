import { Link } from 'react-router-dom';
import { SiteBlogPost } from '@edunexia/database-schema/src/site-edunexia';
import { useBlogAuthorById, useBlogCategories } from '../hooks/useBlog';

interface BlogPostCardProps {
  post: SiteBlogPost;
  variant?: 'default' | 'featured' | 'compact';
}

export function BlogPostCard({ post, variant = 'default' }: BlogPostCardProps) {
  const { data: author } = useBlogAuthorById(post.author_id);
  const { data: allCategories } = useBlogCategories();
  
  // Encontrar categorias do post
  const postCategories = allCategories?.filter(
    cat => post.category_ids.includes(cat.id)
  ) || [];
  
  // Formatar data
  const formattedDate = new Date(post.published_at || post.created_at).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  
  // Verificar se é featured (layout diferente)
  if (variant === 'featured') {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="md:flex">
          <div className="md:flex-shrink-0 md:w-1/2">
            {post.featured_image_url ? (
              <img 
                className="h-full w-full object-cover md:h-full md:w-full" 
                src={post.featured_image_url} 
                alt={post.title}
              />
            ) : (
              <div className="h-full w-full bg-primary-100 flex items-center justify-center text-primary-500">
                <svg className="h-16 w-16" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          <div className="p-8 md:w-1/2">
            <div className="flex flex-wrap gap-2 mb-3">
              {postCategories.map(category => (
                <Link 
                  key={category.id} 
                  to={`/blog/categoria/${category.slug}`}
                  className="text-xs bg-primary-50 text-primary-700 px-3 py-1 rounded-full"
                >
                  {category.name}
                </Link>
              ))}
            </div>
            
            <Link to={`/blog/${post.slug}`} className="block mt-1">
              <h2 className="text-2xl font-bold text-primary-900 hover:text-primary-700 transition">
                {post.title}
              </h2>
            </Link>
            
            <p className="mt-3 text-gray-600">
              {post.excerpt || post.meta_description || ''}
            </p>
            
            <div className="mt-6 flex items-center">
              {author?.avatar_url ? (
                <img 
                  className="h-10 w-10 rounded-full mr-3" 
                  src={author.avatar_url} 
                  alt={author.name} 
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                  <span className="text-primary-700 font-medium">
                    {author?.name.charAt(0) || '?'}
                  </span>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-900">{author?.name}</p>
                <div className="flex space-x-1 text-sm text-gray-500">
                  <time dateTime={post.published_at || post.created_at}>{formattedDate}</time>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Variant compact (para sidebar, relacionados, etc)
  if (variant === 'compact') {
    return (
      <div className="flex items-start space-x-3 mb-4">
        {post.featured_image_url && (
          <img 
            src={post.featured_image_url} 
            alt={post.title}
            className="w-16 h-16 object-cover rounded flex-shrink-0" 
          />
        )}
        <div>
          <Link 
            to={`/blog/${post.slug}`}
            className="text-sm font-medium text-gray-900 hover:text-primary-700 transition line-clamp-2"
          >
            {post.title}
          </Link>
          <div className="text-xs text-gray-500 mt-1">{formattedDate}</div>
        </div>
      </div>
    );
  }
  
  // Default card
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 h-full transition-shadow hover:shadow-md">
      {post.featured_image_url && (
        <Link to={`/blog/${post.slug}`} className="block overflow-hidden">
          <img 
            src={post.featured_image_url} 
            alt={post.title}
            className="h-48 w-full object-cover transition-transform hover:scale-105 duration-300" 
          />
        </Link>
      )}
      
      <div className="p-5">
        {postCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {postCategories.slice(0, 2).map(category => (
              <Link 
                key={category.id} 
                to={`/blog/categoria/${category.slug}`}
                className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full"
              >
                {category.name}
              </Link>
            ))}
            {postCategories.length > 2 && (
              <span className="text-xs text-gray-500">+{postCategories.length - 2}</span>
            )}
          </div>
        )}
        
        <Link to={`/blog/${post.slug}`} className="block">
          <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-700 transition mb-2 line-clamp-2">
            {post.title}
          </h3>
        </Link>
        
        {post.excerpt && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {post.excerpt}
          </p>
        )}
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center">
            {author?.avatar_url ? (
              <img 
                className="h-6 w-6 rounded-full mr-2" 
                src={author.avatar_url} 
                alt={author.name} 
              />
            ) : (
              <div className="h-6 w-6 rounded-full bg-primary-100 flex items-center justify-center mr-2">
                <span className="text-xs text-primary-700 font-medium">
                  {author?.name.charAt(0) || '?'}
                </span>
              </div>
            )}
            <span className="text-xs text-gray-700">{author?.name}</span>
          </div>
          <div className="text-xs text-gray-500">{formattedDate}</div>
        </div>
      </div>
    </div>
  );
}

export default BlogPostCard; 