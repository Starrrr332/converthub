import { PageLayout } from '../../components/layout/PageLayout';
import { RegexTesterTool } from '../../components/devtools/RegexTesterTool';

export function RegexTesterPage() {
  return (
    <PageLayout
      title="Probador de Regex"
      subtitle="Testea expresiones regulares en tiempo real."
      showPrivacyBanner={false}
      breadcrumb={[{ label: 'Inicio', to: '/' }, { label: 'DevTools', to: '/devtools' }, { label: 'Regex' }]}
    >
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <RegexTesterTool />
        </div>
      </div>
    </PageLayout>
  );
}
