import { PageLayout } from '../../components/layout/PageLayout';
import { DiffCheckerTool } from '../../components/devtools/DiffCheckerTool';

export function DiffCheckerPage() {
  return (
    <PageLayout
      title="Comparador de Texto"
      subtitle="Compara dos textos y muestra diferencias."
      showPrivacyBanner={false}
      breadcrumb={[{ label: 'Inicio', to: '/' }, { label: 'DevTools', to: '/devtools' }, { label: 'Diff' }]}
    >
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <DiffCheckerTool />
        </div>
      </div>
    </PageLayout>
  );
}
