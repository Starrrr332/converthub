import { PageLayout } from '../../components/layout/PageLayout';
import { CssMinifierTool } from '../../components/utilities/CssMinifierTool';

export function CssMinifierPage() {
  return (
    <PageLayout
      title="CSS Minifier"
      subtitle="Minifica tu CSS para producción."
      showPrivacyBanner={false}
      breadcrumb={[
        { label: 'Inicio', to: '/' },
        { label: 'Utilidades', to: '/tools/utilities' },
        { label: 'CSS Minifier' },
      ]}
    >
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <CssMinifierTool />
        </div>
      </div>
    </PageLayout>
  );
}
