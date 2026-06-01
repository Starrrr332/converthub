import { useTranslation } from 'react-i18next';
import { usePremiumStore } from '../store/premiumStore';
import { PageLayout } from '../components/layout/PageLayout';
import { AudioToolContent } from '../components/audio/AudioToolContent';

export function AudioConverter() {
  const { t } = useTranslation('converter');
  const { t: tc } = useTranslation('common');
  const premium = usePremiumStore();
  const isPremium = premium.isPremium();

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
        <AudioToolContent isPremium={isPremium} />
      </div>
    </PageLayout>
  );
}
