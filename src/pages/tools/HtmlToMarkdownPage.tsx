import { PageLayout } from '../../components/layout/PageLayout';
import { HtmlToMarkdown } from '../../components/tools/HtmlToMarkdown';

export function HtmlToMarkdownPage() {
  return (
    <PageLayout
      title="HTML → Markdown"
      subtitle="Convierte HTML a Markdown limpio y formateado."
      breadcrumb={[
        { label: 'Inicio', to: '/' },
        { label: 'Herramientas', to: '/tools/utilities' },
        { label: 'HTML → Markdown' },
      ]}
    >
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <HtmlToMarkdown />
        </div>
      </div>
    </PageLayout>
  );
}
