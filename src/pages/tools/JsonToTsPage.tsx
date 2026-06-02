import { useTranslation } from 'react-i18next';
import { PageLayout } from '../../components/layout/PageLayout';
import { JsonToTsTypes } from '../../components/tools/JsonToTsTypes';

export function JsonToTsPage() {
  const { t } = useTranslation();
  return (
    <PageLayout
      title="JSON a Tipos TypeScript"
      subtitle="Genera interfaces TypeScript automáticamente desde JSON."
      breadcrumb={[{ label: t('nav.home'), to: '/' }, { label: 'JSON a TS' }]}
    >
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <JsonToTsTypes />
        </div>
      </div>
    </PageLayout>
  );
}
