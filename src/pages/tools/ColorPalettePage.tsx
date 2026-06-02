import { useTranslation } from 'react-i18next';
import { PageLayout } from '../../components/layout/PageLayout';
import { ColorPaletteGenerator } from '../../components/tools/ColorPaletteGenerator';

export function ColorPalettePage() {
  const { t } = useTranslation();
  return (
    <PageLayout
      title="Paleta de Colores"
      subtitle="Extrae colores dominantes de imágenes y genera armonías cromáticas."
      breadcrumb={[{ label: t('nav.home'), to: '/' }, { label: 'Paleta de Colores' }]}
    >
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <ColorPaletteGenerator />
        </div>
      </div>
    </PageLayout>
  );
}
