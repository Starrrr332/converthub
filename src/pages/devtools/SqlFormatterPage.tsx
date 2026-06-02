import { PageLayout } from '../../components/layout/PageLayout';
import { SqlFormatterTool } from '../../components/devtools/SqlFormatterTool';

export function SqlFormatterPage() {
  return (
    <PageLayout
      title="SQL Formatter"
      subtitle="Formatea y valida consultas SQL."
      showPrivacyBanner={false}
      breadcrumb={[
        { label: 'Inicio', to: '/' },
        { label: 'DevTools', to: '/devtools' },
        { label: 'SQL' },
      ]}
    >
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <SqlFormatterTool />
        </div>
      </div>
    </PageLayout>
  );
}
