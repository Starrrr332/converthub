import { PageLayout } from '../../components/layout/PageLayout';
import { CronGeneratorTool } from '../../components/utilities/CronGeneratorTool';

export function CronGeneratorPage() {
  return (
    <PageLayout
      title="Generador de Cron"
      subtitle="Genera expresiones cron fácilmente."
      showPrivacyBanner={false}
      breadcrumb={[
        { label: 'Inicio', to: '/' },
        { label: 'Utilidades', to: '/tools/utilities' },
        { label: 'Cron' },
      ]}
    >
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <CronGeneratorTool />
        </div>
      </div>
    </PageLayout>
  );
}
