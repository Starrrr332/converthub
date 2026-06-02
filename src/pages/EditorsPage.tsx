import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PageLayout } from '../components/layout/PageLayout';
import { editorTools } from '../config/toolRegistry';

export function EditorsPage() {
  return (
    <PageLayout
      title="Editores"
      description="Edita imágenes, texto, JSON, Markdown y hojas de cálculo online gratis. Todas las herramientas funcionan en tu navegador."
      subtitle="Edita imágenes, texto, JSON, Markdown y hojas de cálculo."
      showPrivacyBanner={false}
      breadcrumb={[{ label: 'Inicio', to: '/' }, { label: 'Editores' }]}
    >
      {/* Tools grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {editorTools.map((tool) => (
          <Link
            key={tool.path}
            to={tool.path}
            className={`card-interactive flex items-center gap-4 ${tool.hover}`}
          >
            <div className="p-2.5 rounded-xl bg-accent-50 text-accent-700 shrink-0">
              <tool.icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-text-primary text-sm">{tool.name}</h3>
              <p className="text-xs text-text-secondary mt-0.5">{tool.homeDesc}</p>
            </div>
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
