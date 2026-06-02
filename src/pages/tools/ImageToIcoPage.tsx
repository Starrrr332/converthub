import { PageLayout } from '../../components/layout/PageLayout';
import { ImageToIco } from '../../components/tools/ImageToIco';

export function ImageToIcoPage() {
  return (
    <PageLayout
      title="Image to ICO"
      subtitle="Convierte imágenes PNG, JPG o WebP a favicon ICO multi-tamaño."
      breadcrumb={[
        { label: 'Inicio', to: '/' },
        { label: 'Herramientas', to: '/tools/utilities' },
        { label: 'Image to ICO' },
      ]}
    >
      <div className="max-w-lg mx-auto">
        <div className="card">
          <ImageToIco />
        </div>
      </div>
    </PageLayout>
  );
}
