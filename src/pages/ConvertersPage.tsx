import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PageLayout } from '../components/layout/PageLayout';
import { converterTools } from '../config/toolRegistry';

type SubCategory = 'all' | 'image' | 'document' | 'audio' | 'video';

const subCategories = [
  { key: 'all', label: 'Todos' },
  { key: 'image', label: 'Imágenes' },
  { key: 'document', label: 'Documentos' },
  { key: 'audio', label: 'Audio' },
  { key: 'video', label: 'Video' },
];

export function ConvertersPage() {
  const [activeSubCategory, setActiveSubCategory] = useState<SubCategory>('all');

  const filteredTools = activeSubCategory === 'all'
    ? converterTools
    : converterTools.filter(t => t.subCategory === activeSubCategory);

  return (
    <PageLayout
      title="Convertidores"
      subtitle="Convierte entre múltiples formatos de archivo al instante."
      showPrivacyBanner={false}
      breadcrumb={[{ label: 'Inicio', to: '/' }, { label: 'Convertidores' }]}
    >
      {/* Sub-category filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {subCategories.map((sub) => (
          <button
            key={sub.key}
            onClick={() => setActiveSubCategory(sub.key as SubCategory)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeSubCategory === sub.key
                ? 'bg-accent-600 text-white'
                : 'bg-surface-secondary text-text-secondary hover:bg-accent-50 hover:text-accent-700'
            }`}
          >
            {sub.label}
          </button>
        ))}
      </div>

      {/* Tools grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTools.map((tool) => (
          <Link
            key={tool.path}
            to={tool.path}
            className={`card-interactive text-center ${tool.hover}`}
          >
            <div className={`inline-flex p-3 rounded-xl ${tool.bg} ${tool.color} mb-3`}>
              <tool.icon className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-text-primary text-sm">{tool.name}</h3>
            <p className="text-xs text-text-secondary mt-1 leading-relaxed">{tool.homeDesc}</p>
          </Link>
        ))}
      </div>

      {/* Back to home */}
      <div className="mt-12 text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-accent-600 hover:text-accent-700"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          Volver al inicio
        </Link>
      </div>
    </PageLayout>
  );
}