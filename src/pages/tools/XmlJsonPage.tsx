import { PageLayout } from '../../components/layout/PageLayout';
import { XmlJsonConverter } from '../../components/tools/XmlJsonConverter';

export function XmlJsonPage() {
  return (
    <PageLayout
      title="XML ↔ JSON"
      subtitle="Convierte entre XML y JSON de forma rápida y sencilla."
      breadcrumb={[
        { label: 'Inicio', to: '/' },
        { label: 'Herramientas', to: '/tools/utilities' },
        { label: 'XML ↔ JSON' },
      ]}
    >
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <XmlJsonConverter />
        </div>
      </div>
    </PageLayout>
  );
}
