import { useTranslation } from 'react-i18next';
import { PageLayout } from '../../components/layout/PageLayout';
import { YamlJsonConverter } from '../../components/tools/YamlJsonConverter';

export function YamlJsonPage() {
  const { t } = useTranslation();
  return (
    <PageLayout
      title="YAML ↔ JSON"
      subtitle="Convierte entre YAML y JSON al instante."
      breadcrumb={[{ label: t('nav.home'), to: '/' }, { label: 'YAML ↔ JSON' }]}
    >
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <YamlJsonConverter />
        </div>
      </div>
    </PageLayout>
  );
}
