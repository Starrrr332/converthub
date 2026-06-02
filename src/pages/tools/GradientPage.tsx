import { useTranslation } from 'react-i18next';
import { PageLayout } from '../../components/layout/PageLayout';
import { GradientGenerator } from '../../components/tools/GradientGenerator';

export function GradientPage() {
  const { t } = useTranslation();
  return (
    <PageLayout
      title="Generador de Gradient CSS"
      subtitle="Crea gradients visuales y obtén el CSS listo para usar."
      breadcrumb={[{ label: t('nav.home'), to: '/' }, { label: 'Gradient CSS' }]}
    >
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <GradientGenerator />
        </div>
      </div>
    </PageLayout>
  );
}
