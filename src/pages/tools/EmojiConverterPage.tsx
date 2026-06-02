import { useTranslation } from 'react-i18next';
import { PageLayout } from '../../components/layout/PageLayout';
import { EmojiConverter } from '../../components/tools/EmojiConverter';

export function EmojiConverterPage() {
  const { t } = useTranslation();
  return (
    <PageLayout
      title="Convertidor de Emoji"
      subtitle="Busca, copia y consulta el código Unicode de emojis."
      breadcrumb={[{ label: t('nav.home'), to: '/' }, { label: 'Emoji' }]}
    >
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <EmojiConverter />
        </div>
      </div>
    </PageLayout>
  );
}
