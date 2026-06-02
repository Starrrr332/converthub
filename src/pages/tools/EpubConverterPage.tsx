import { useTranslation } from 'react-i18next';
import { PageLayout } from '../../components/layout/PageLayout';
import { EpubConverter } from '../../components/tools/EpubConverter';

export function EpubConverterPage() {
  const { t } = useTranslation();
  return (
    <PageLayout
      title="EPUB a PDF"
      subtitle="Convierte libros electrónicos EPUB a documentos PDF."
      breadcrumb={[{ label: t('nav.home'), to: '/' }, { label: 'EPUB ↔ PDF' }]}
    >
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <EpubConverter />
        </div>
      </div>
    </PageLayout>
  );
}
