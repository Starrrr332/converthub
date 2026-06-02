import { PageLayout } from '../../components/layout/PageLayout';
import { HtmlEntityTool } from '../../components/utilities/HtmlEntityTool';

export function HtmlEntityPage() {
  return (
    <PageLayout
      title="HTML Entities"
      subtitle="Codifica y decodifica entidades HTML."
      showPrivacyBanner={false}
      breadcrumb={[
        { label: 'Inicio', to: '/' },
        { label: 'Utilidades', to: '/tools/utilities' },
        { label: 'HTML Entities' },
      ]}
    >
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <HtmlEntityTool />
        </div>
      </div>
    </PageLayout>
  );
}
