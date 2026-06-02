import { PageLayout } from '../../components/layout/PageLayout';
import { JwtDecoderTool } from '../../components/devtools/JwtDecoderTool';

export function JwtDecoderPage() {
  return (
    <PageLayout
      title="Decodificador JWT"
      subtitle="Decodifica tokens JWT al instante."
      showPrivacyBanner={false}
      breadcrumb={[{ label: 'Inicio', to: '/' }, { label: 'DevTools', to: '/devtools' }, { label: 'JWT' }]}
    >
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <JwtDecoderTool />
        </div>
      </div>
    </PageLayout>
  );
}
