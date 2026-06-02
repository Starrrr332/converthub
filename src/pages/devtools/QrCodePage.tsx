import { PageLayout } from '../../components/layout/PageLayout';
import { QrCodeTool } from '../../components/devtools/QrCodeTool';

export function QrCodePage() {
  return (
    <PageLayout
      title="Generador de QR"
      subtitle="Genera códigos QR al instante."
      showPrivacyBanner={false}
      breadcrumb={[
        { label: 'Inicio', to: '/' },
        { label: 'DevTools', to: '/devtools' },
        { label: 'QR Gen' },
      ]}
    >
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <QrCodeTool />
        </div>
      </div>
    </PageLayout>
  );
}
