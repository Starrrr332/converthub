import { PageLayout } from '../../components/layout/PageLayout';
import { JsonToCsv } from '../../components/tools/JsonToCsv';

export function JsonToCsvPage() {
  return (
    <PageLayout
      title="JSON → CSV"
      subtitle="Convierte arrays de JSON a formato CSV plano."
      breadcrumb={[
        { label: 'Inicio', to: '/' },
        { label: 'Herramientas', to: '/tools/utilities' },
        { label: 'JSON → CSV' },
      ]}
    >
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <JsonToCsv />
        </div>
      </div>
    </PageLayout>
  );
}
