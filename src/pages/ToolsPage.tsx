import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PageLayout } from '../components/layout/PageLayout';
import { standaloneTools } from '../config/toolRegistry';

export function ToolsPage() {
  return (
    <PageLayout
      title="Herramientas"
      subtitle="Utilidades standalone para tareas comunes."
      showPrivacyBanner={false}
      breadcrumb={[{ label: 'Inicio', to: '/' }, { label: 'Herramientas' }]}
    >
      {/* Tools grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {standaloneTools.map((tool) => (
          <Link
            key={tool.path}
            to={tool.path}
            className={`card-interactive text-center ${tool.hover}`}
          >
            <div className={`inline-flex p-3 rounded-xl ${tool.bg} ${tool.color} mb-3`}>
              <tool.icon className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-text-primary text-sm">{tool.name}</h3>
            <p className="text-xs text-text-secondary mt-1">{tool.homeDesc}</p>
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
