import { PageLayout } from '../../components/layout/PageLayout';
import { PasswordGeneratorTool } from '../../components/utilities/PasswordGeneratorTool';

export function PasswordGeneratorPage() {
  return (
    <PageLayout
      title="Generador de Contraseñas"
      subtitle="Contraseñas seguras configurables."
      showPrivacyBanner={false}
      breadcrumb={[{ label: 'Inicio', to: '/' }, { label: 'Utilidades', to: '/tools/utilities' }, { label: 'Contraseñas' }]}
    >
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <PasswordGeneratorTool />
        </div>
      </div>
    </PageLayout>
  );
}
