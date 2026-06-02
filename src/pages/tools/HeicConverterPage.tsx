import { useTranslation } from 'react-i18next';
import { PageLayout } from '../../components/layout/PageLayout';
import { HeicConverter } from '../../components/tools/HeicConverter';

export function HeicConverterPage() {
  const { t } = useTranslation();
  return (
    <PageLayout
      title="HEIC a JPG / PNG"
      subtitle="Convierte fotos HEIC de Apple a formato estándar sin salir de tu navegador."
      breadcrumb={[{ label: t('nav.home'), to: '/' }, { label: 'HEIC → JPG/PNG' }]}
    >
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <HeicConverter />
        </div>
      </div>
    </PageLayout>
  );
}
