import { useTranslation } from 'react-i18next';
import { PageLayout } from '../../components/layout/PageLayout';
import { ExpressionCalculator } from '../../components/tools/ExpressionCalculator';

export function ExpressionCalcPage() {
  const { t } = useTranslation();
  return (
    <PageLayout
      title="Calculadora de Expresiones"
      subtitle="Evalúa expresiones matemáticas con funciones y constantes."
      breadcrumb={[{ label: t('nav.home'), to: '/' }, { label: 'Calculadora' }]}
    >
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <ExpressionCalculator />
        </div>
      </div>
    </PageLayout>
  );
}
