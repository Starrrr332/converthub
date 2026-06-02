import { PageLayout } from '../../components/layout/PageLayout';
import { LoremIpsumTool } from '../../components/utilities/LoremIpsumTool';

export function LoremIpsumPage() {
  return (
    <PageLayout
      title="Lorem Ipsum"
      subtitle="Genera texto placeholder personalizable."
      showPrivacyBanner={false}
      breadcrumb={[{ label: 'Inicio', to: '/' }, { label: 'Utilidades', to: '/tools/utilities' }, { label: 'Lorem Ipsum' }]}
    >
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <LoremIpsumTool />
        </div>
      </div>
    </PageLayout>
  );
}
