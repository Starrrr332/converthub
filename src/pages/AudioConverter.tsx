import { useTranslation } from 'react-i18next';
import { PageLayout } from '../components/layout/PageLayout';
import { AudioToolContent } from '../components/audio/AudioToolContent';

export function AudioConverter() {
  const { t } = useTranslation('converter');
  const { t: tc } = useTranslation('common');

  return (
    <PageLayout
      title={t('audio.title')}
      description="Convierte audio online entre MP3, WAV, OGG, FLAC y AAC. Procesamiento 100% local en tu navegador. Plan gratuito disponible."
      subtitle={t('audio.subtitle')}
      breadcrumb={[{ label: tc('nav.home'), to: '/' }, { label: tc('nav.converters.audio') }]}
    >
      <div className="content-panel">
        <AudioToolContent />
      </div>
    </PageLayout>
  );
}
