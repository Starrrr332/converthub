import { useTranslation } from 'react-i18next';
import { PageLayout } from '../../components/layout/PageLayout';
import { MdToPdf } from '../../components/tools/MdToPdf';

export function MdToPdfPage() {
  const { t } = useTranslation();
  return (
    <PageLayout
      title="Markdown a PDF"
      subtitle="Escribe Markdown y exporta un PDF con estilo profesional."
      breadcrumb={[{ label: t('nav.home'), to: '/' }, { label: 'Markdown a PDF' }]}
      wide
    >
      <div className="max-w-6xl mx-auto">
        <div className="card">
          <MdToPdf />
        </div>
      </div>
    </PageLayout>
  );
}
