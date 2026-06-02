import { PageLayout } from '../../components/layout/PageLayout';
import { JsFormatterTool } from '../../components/devtools/JsFormatterTool';

export function JsFormatterPage() {
  return (
    <PageLayout
      title="JS Formatter"
      subtitle="Formatea y minifica JavaScript."
      showPrivacyBanner={false}
      breadcrumb={[{ label: 'Inicio', to: '/' }, { label: 'DevTools', to: '/devtools' }, { label: 'JS' }]}
    >
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <JsFormatterTool />
        </div>
      </div>
    </PageLayout>
  );
}
