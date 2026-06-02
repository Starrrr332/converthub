import { PageLayout } from '../../components/layout/PageLayout';
import { Base64Tool } from '../../components/devtools/Base64Tool';

export function Base64Page() {
  return (
    <PageLayout
      title="Base64"
      subtitle="Codifica y decodifica en Base64."
      showPrivacyBanner={false}
      breadcrumb={[{ label: 'Inicio', to: '/' }, { label: 'DevTools', to: '/devtools' }, { label: 'Base64' }]}
    >
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <Base64Tool />
        </div>
      </div>
    </PageLayout>
  );
}
