import { PageLayout } from '../../components/layout/PageLayout';
import { QrScanTool } from '../../components/devtools/QrScanTool';

export function QrScanPage() {
  return (
    <PageLayout
      title="Escáner de QR"
      subtitle="Lee códigos QR desde imágenes."
      showPrivacyBanner={false}
      breadcrumb={[{ label: 'Inicio', to: '/' }, { label: 'DevTools', to: '/devtools' }, { label: 'QR Scan' }]}
    >
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <QrScanTool />
        </div>
      </div>
    </PageLayout>
  );
}
