import { PageLayout } from '../../components/layout/PageLayout';
import { HashGeneratorTool } from '../../components/devtools/HashGeneratorTool';

export function HashGeneratorPage() {
  return (
    <PageLayout
      title="Generador de Hash"
      subtitle="Genera hashes MD5, SHA-1, SHA-256, SHA-512."
      showPrivacyBanner={false}
      breadcrumb={[{ label: 'Inicio', to: '/' }, { label: 'DevTools', to: '/devtools' }, { label: 'Hash' }]}
    >
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <HashGeneratorTool />
        </div>
      </div>
    </PageLayout>
  );
}
