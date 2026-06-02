import { useTranslation } from 'react-i18next';
import { PageLayout } from '../../components/layout/PageLayout';
import { CollageMaker } from '../../components/tools/CollageMaker';

export function CollageMakerPage() {
  const { t } = useTranslation();
  return (
    <PageLayout
      title="Collage Maker"
      subtitle="Crea collages con múltiples imágenes y descárgalos como PNG."
      breadcrumb={[{ label: t('nav.home'), to: '/' }, { label: 'Collage Maker' }]}
      wide
    >
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <CollageMaker />
        </div>
      </div>
    </PageLayout>
  );
}
