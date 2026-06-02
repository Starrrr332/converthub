import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react';

interface BlogEntry {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  tags: string[];
}

const blogPosts: BlogEntry[] = [
  {
    slug: 'como-convertir-imagenes-sin-perder-calidad',
    title: 'Cómo Convertir Imágenes Sin Perder Calidad',
    description: 'Guía completa para convertir entre formatos de imagen manteniendo la máxima calidad posible.',
    date: '1 de enero, 2026',
    readTime: '5 min de lectura',
    tags: ['Imágenes', 'Guía', 'Calidad'],
  },
  {
    slug: 'guia-formatos-imagen-2026',
    title: 'Guía Completa de Formatos de Imagen 2026',
    description: 'PNG, JPG, WebP, AVIF: ¿cuál elegir? Conoce las diferencias y cuándo usar cada formato.',
    date: '15 de diciembre, 2025',
    readTime: '8 min de lectura',
    tags: ['Formatos', 'Imágenes', 'SEO'],
  },
  {
    slug: 'herramientas-online-seguras',
    title: 'Cómo Elegir Herramientas Online Seguras',
    description: 'Qué buscar en una herramienta online para proteger tus datos y archivos personales.',
    date: '1 de diciembre, 2025',
    readTime: '6 min de lectura',
    tags: ['Seguridad', 'Privacidad', 'Consejos'],
  },
];

export function BlogIndex() {
  return (
    <div className="page-container max-w-4xl">
      <div className="text-center mb-12">
        <div className="inline-flex p-4 bg-indigo-100 rounded-2xl mb-4">
          <BookOpen className="w-8 h-8 text-indigo-600" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Blog</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Guías, tutoriales y consejos para sacar el máximo provecho de nuestras herramientas.
        </p>
      </div>

      <div className="grid gap-6">
        {blogPosts.map((post) => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            className="card-interactive group"
          >
            <article>
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mb-3">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {post.date}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {post.readTime}
                </div>
              </div>

              <h2 className="text-xl font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2">
                {post.title}
              </h2>
              <p className="text-slate-600 mb-4">{post.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 group-hover:gap-2 transition-all">
                  Leer más
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
