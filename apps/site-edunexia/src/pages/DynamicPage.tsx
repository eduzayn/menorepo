import React from 'react';
import { useParams } from 'react-router-dom';
import { usePageBySlug } from '@/hooks/usePages';
import { Helmet } from 'react-helmet';
import { NotFoundError } from '@/components/ErrorPage';
import LoadingSpinner from '@/components/Loading';

interface ContentBlock {
  type: 'paragraph' | 'heading' | 'list' | 'image';
  content?: string;
  items?: string[];
  url?: string;
  caption?: string;
}

interface Page {
  title: string;
  meta_description: string | null;
  featured_image_url?: string;
  content: {
    blocks: ContentBlock[];
  };
}

export const DynamicPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: page, isLoading, error } = usePageBySlug(slug || '');

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !page) {
    return <NotFoundError />;
  }

  return (
    <>
      <Helmet>
        <title>{page.title} - Edunéxia</title>
        <meta name="description" content={page.meta_description || ''} />
      </Helmet>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl font-bold mb-6">{page.title}</h1>
              {page.meta_description && (
                <p className="text-xl">{page.meta_description}</p>
              )}
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto prose prose-lg">
              {page.featured_image_url && (
                <img
                  src={page.featured_image_url}
                  alt={page.title}
                  className="w-full h-auto rounded-lg shadow-lg mb-8"
                />
              )}
              
              {page.content.blocks.map((block: ContentBlock, index: number) => {
                switch (block.type) {
                  case 'paragraph':
                    return (
                      <p key={index} className="mb-6">
                        {block.content}
                      </p>
                    );
                  case 'heading':
                    return (
                      <h2 key={index} className="text-3xl font-bold mb-6">
                        {block.content}
                      </h2>
                    );
                  case 'list':
                    return (
                      <ul key={index} className="list-disc pl-6 mb-6">
                        {block.items?.map((item: string, itemIndex: number) => (
                          <li key={itemIndex}>{item}</li>
                        ))}
                      </ul>
                    );
                  case 'image':
                    return (
                      <img
                        key={index}
                        src={block.url}
                        alt={block.caption || ''}
                        className="w-full h-auto rounded-lg shadow-lg my-8"
                      />
                    );
                  default:
                    return null;
                }
              })}
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default DynamicPage; 