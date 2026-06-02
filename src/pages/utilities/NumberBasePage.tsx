import { PageLayout } from '../../components/layout/PageLayout';
import { NumberBaseTool } from '../../components/utilities/NumberBaseTool';

export function NumberBasePage() {
  return (
    <PageLayout
      title="Base Numérica"
      subtitle="Convierte entre Bin, Oct, Dec y Hex."
      showPrivacyBanner={false}
      breadcrumb={[{ label: 'Inicio', to: '/' }, { label: 'Utilidades', to: '/tools/utilities' }, { label: 'Base Numérica' }]}
    >
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <NumberBaseTool />
        </div>
      </div>
    </PageLayout>
  );
}
