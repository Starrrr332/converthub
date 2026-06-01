import { useTranslation } from 'react-i18next';
import { Shield } from 'lucide-react';

interface PrivacyBannerProps {
  onAccept?: () => void;
  showAcceptButton?: boolean;
}

export function PrivacyBanner({ onAccept, showAcceptButton = false }: PrivacyBannerProps) {
  const { t } = useTranslation('common');

  return (
    <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-brand-50/70 border border-brand-100">
      <Shield className="w-4.5 h-4.5 text-brand-500 mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-brand-800">
          <strong>{t('privacy.banner.strong')}</strong> {t('privacy.banner.text')}
        </p>
        <a href="/privacy" className="inline-flex items-center gap-1 mt-1 text-xs text-brand-600 hover:text-brand-700 font-medium">
          {t('privacy.banner.link')}
        </a>
      </div>
      {showAcceptButton && onAccept && (
        <button onClick={onAccept} className="shrink-0 px-3 py-1 text-xs font-medium text-brand-700 bg-brand-100 rounded-lg hover:bg-brand-200 transition-colors">
          {t('privacy.banner.accept')}
        </button>
      )}
    </div>
  );
}
