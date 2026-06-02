import { PageLayout } from '../../components/layout/PageLayout';
import { ColorConverterTool } from '../../components/devtools/ColorConverterTool';

export function ColorConverterPage() {
  return (
    <PageLayout
      title="Convertidor de Color"
      subtitle="Convierte entre HEX, RGB, HSL."
      showPrivacyBanner={false}
      breadcrumb={[{ label: 'Inicio', to: '/' }, { label: 'DevTools', to: '/devtools' }, { label: 'Color' }]}
    >
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <ColorConverterTool />
        </div>
      </div>
    </PageLayout>
  );
}
