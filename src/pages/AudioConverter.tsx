import { useTranslation } from 'react-i18next';
import { usePremiumStore } from '../store/premiumStore';
import { AudioToolContent } from '../components/audio/AudioToolContent';
import { PrivacyBanner } from '../components/converter/PrivacyBanner';

export function AudioConverter() {
  const { t } = useTranslation('converter');
  const premium = usePremiumStore();
  const isPremium = premium.isPremium();
  
  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('audio.title')}
          </h1>
          <p className="text-gray-600">
            {t('audio.subtitle')}
          </p>
        </div>
        
        {/* Privacy Banner */}
        <div className="mb-6">
          <PrivacyBanner />
        </div>
        
        {/* Tool Content */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <AudioToolContent isPremium={isPremium} />
        </div>
      </div>
    </div>
  );
}
