import { PageLayout } from '../../components/layout/PageLayout';
import { BarcodeGeneratorTool } from '../../components/utilities/BarcodeGeneratorTool';

export function BarcodeGeneratorPage() {
  return (
    <PageLayout
      title="Generador de Código de Barras"
      subtitle="Genera códigos EAN-13 y Code128."
      showPrivacyBanner={false}
      breadcrumb={[{ label: 'Inicio', to: '/' }, { label: 'Utilidades', to: '/tools/utilities' }, { label: 'Código de Barras' }]}
    >
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <BarcodeGeneratorTool />
        </div>
      </div>
    </PageLayout>
  );
}
