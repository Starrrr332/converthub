import { PageLayout } from '../../components/layout/PageLayout';
import { UrlEncoderTool } from '../../components/devtools/UrlEncoderTool';

export function UrlEncoderPage() {
  return (
    <PageLayout
      title="URL Encoder/Decoder"
      subtitle="Codifica y decodifica URLs."
      showPrivacyBanner={false}
      breadcrumb={[
        { label: 'Inicio', to: '/' },
        { label: 'DevTools', to: '/devtools' },
        { label: 'URL' },
      ]}
    >
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <UrlEncoderTool />
        </div>
      </div>
    </PageLayout>
  );
}
