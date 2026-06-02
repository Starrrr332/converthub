import { useTranslation } from 'react-i18next';
import { PageLayout } from '../../components/layout/PageLayout';
import { JsonToSql } from '../../components/tools/JsonToSql';

export function JsonToSqlPage() {
  const { t } = useTranslation();
  return (
    <PageLayout
      title="JSON a SQL"
      subtitle="Genera statements INSERT SQL a partir de un array JSON."
      breadcrumb={[{ label: t('nav.home'), to: '/' }, { label: 'JSON a SQL' }]}
    >
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <JsonToSql />
        </div>
      </div>
    </PageLayout>
  );
}
