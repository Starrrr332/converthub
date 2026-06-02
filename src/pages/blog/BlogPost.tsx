import { Link, useLocation } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, Tag } from 'lucide-react';
import { SEOHead } from '../../components/seo/SEOHead';
import { JsonLd } from '../../components/seo/JsonLd';
import { buildArticleSchema } from '../../utils/structuredData';

interface BlogPostProps {
  title: string;
  description: string;
  date: string;
  readTime: string;
  tags: string[];
  children: React.ReactNode;
  dateISO?: string;
}

export function BlogPost({
  title,
  description,
  date,
  readTime,
  tags,
  children,
  dateISO,
}: BlogPostProps) {
  const location = useLocation();
  const postUrl = `https://converthub.com${location.pathname}`;

  const articleSchema = buildArticleSchema({
    headline: title,
    description,
    datePublished: dateISO || '2026-01-01',
    url: postUrl,
  });

  return (
    <>
      <SEOHead
        title={title}
        description={description}
        canonical={postUrl}
        ogType="article"
        breadcrumbs={[
          { name: 'Inicio', url: 'https://converthub.com' },
          { name: 'Blog', url: 'https://converthub.com/blog' },
          { name: title, url: postUrl },
        ]}
      />
      <JsonLd data={articleSchema} />
      <article className="page-container max-w-3xl">
        {/* Back link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al blog
        </Link>

        {/* Header */}
        <header className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            {title}
          </h1>
          <p className="text-lg text-slate-600 mb-6">{description}</p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {date}
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {readTime}
            </div>
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              {tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="prose prose-slate prose-lg max-w-none">{children}</div>

        {/* CTA */}
        <div className="mt-12 p-6 bg-indigo-50 rounded-xl border border-indigo-100">
          <h3 className="font-semibold text-indigo-900 mb-2">¿Listo para probar ConvertHub?</h3>
          <p className="text-sm text-indigo-700 mb-4">
            Más de 52 herramientas gratuitas para convertir y editar archivos.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            Explorar herramientas
          </Link>
        </div>
      </article>
    </>
  );
}
