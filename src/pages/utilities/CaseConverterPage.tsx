import { PageLayout } from '../../components/layout/PageLayout';
import { CaseConverterTool } from '../../components/utilities/CaseConverterTool';

export function CaseConverterPage() {
  return (
    <PageLayout
      title="Convertidor de Texto"
      subtitle="MAYÚSCULAS, minúsculas, Title Case."
      showPrivacyBanner={false}
      breadcrumb={[
        { label: 'Inicio', to: '/' },
        { label: 'Utilidades', to: '/tools/utilities' },
        { label: 'Case Converter' },
      ]}
    >
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <CaseConverterTool />
        </div>
      </div>
    </PageLayout>
  );
}
