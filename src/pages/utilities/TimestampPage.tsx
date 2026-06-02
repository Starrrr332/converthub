import { PageLayout } from '../../components/layout/PageLayout';
import { TimestampTool } from '../../components/utilities/TimestampTool';

export function TimestampPage() {
  return (
    <PageLayout
      title="Timestamp Converter"
      subtitle="Convierte Unix time a fecha legible."
      showPrivacyBanner={false}
      breadcrumb={[
        { label: 'Inicio', to: '/' },
        { label: 'Utilidades', to: '/tools/utilities' },
        { label: 'Timestamp' },
      ]}
    >
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <TimestampTool />
        </div>
      </div>
    </PageLayout>
  );
}
