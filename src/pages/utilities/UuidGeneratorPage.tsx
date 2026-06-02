import { PageLayout } from '../../components/layout/PageLayout';
import { UuidGeneratorTool } from '../../components/utilities/UuidGeneratorTool';

export function UuidGeneratorPage() {
  return (
    <PageLayout
      title="Generador de UUID"
      subtitle="Genera UUID v4 aleatorios."
      showPrivacyBanner={false}
      breadcrumb={[{ label: 'Inicio', to: '/' }, { label: 'Utilidades', to: '/tools/utilities' }, { label: 'UUID' }]}
    >
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <UuidGeneratorTool />
        </div>
      </div>
    </PageLayout>
  );
}
