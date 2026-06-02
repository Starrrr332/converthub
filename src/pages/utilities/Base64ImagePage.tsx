import { PageLayout } from '../../components/layout/PageLayout';
import { Base64ImageTool } from '../../components/utilities/Base64ImageTool';

export function Base64ImagePage() {
  return (
    <PageLayout
      title="Base64 Image"
      subtitle="Convierte imágenes a Base64."
      showPrivacyBanner={false}
      breadcrumb={[
        { label: 'Inicio', to: '/' },
        { label: 'Utilidades', to: '/tools/utilities' },
        { label: 'Base64 Image' },
      ]}
    >
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <Base64ImageTool />
        </div>
      </div>
    </PageLayout>
  );
}
