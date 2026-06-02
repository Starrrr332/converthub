import { useTranslation } from 'react-i18next';
import { PageLayout } from '../components/layout/PageLayout';
import { AudioToolContent } from '../components/audio/AudioToolContent';

export function AudioConverter() {
  const { t } = useTranslation('converter');
  const { t: tc } = useTranslation('common');

  return (
    <PageLayout
      title={t('audio.title')}
      subtitle={t('audio.subtitle')}
      breadcrumb={[
        { label: tc('nav.home'), to: '/' },
        { label: tc('nav.converters.audio') },
      ]}
    >
      <div className="content-panel">
        <AudioToolContent />
      </div>
    </PageLayout>
  );
}
