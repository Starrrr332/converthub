import { PageLayout } from '../../components/layout/PageLayout';
import { WatermarkTool } from '../../components/tools/WatermarkTool';

export function WatermarkPage() {
  return (
    <PageLayout
      title="Marca de Agua"
      subtitle="Agrega texto o marca de agua a tus imágenes con configuración personalizada."
      breadcrumb={[
        { label: 'Inicio', to: '/' },
        { label: 'Herramientas', to: '/tools/utilities' },
        { label: 'Marca de Agua' },
      ]}
    >
      <div className="max-w-lg mx-auto">
        <div className="card">
          <WatermarkTool />
        </div>
      </div>
    </PageLayout>
  );
}
