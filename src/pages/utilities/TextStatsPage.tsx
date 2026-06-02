import { PageLayout } from '../../components/layout/PageLayout';
import { TextStatsTool } from '../../components/utilities/TextStatsTool';

export function TextStatsPage() {
  return (
    <PageLayout
      title="Estadísticas de Texto"
      subtitle="Cuenta palabras, caracteres y líneas."
      showPrivacyBanner={false}
      breadcrumb={[
        { label: 'Inicio', to: '/' },
        { label: 'Utilidades', to: '/tools/utilities' },
        { label: 'Estadísticas' },
      ]}
    >
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <TextStatsTool />
        </div>
      </div>
    </PageLayout>
  );
}
