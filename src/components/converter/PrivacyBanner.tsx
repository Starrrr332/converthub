import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, ExternalLink } from 'lucide-react';

interface PrivacyBannerProps {
  onAccept?: () => void;
  showAcceptButton?: boolean;
}

export function PrivacyBanner({ onAccept, showAcceptButton = false }: PrivacyBannerProps) {
  const { t } = useTranslation('common');

  return (
    <div className="privacy-strip">
      <Shield className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-teal-900 leading-relaxed">
          <strong className="font-semibold">{t('privacy.banner.strong')}</strong>{' '}
          {t('privacy.banner.text')}
        </p>
        <Link
          to="/privacy"
          className="inline-flex items-center gap-1 mt-1.5 text-xs font-medium text-teal-700 hover:text-teal-800"
        >
          {t('privacy.banner.link')}
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
      {showAcceptButton && onAccept && (
        <button
          type="button"
          onClick={onAccept}
          className="shrink-0 px-3 py-1.5 text-sm font-medium text-teal-800 bg-teal-100 rounded-lg hover:bg-teal-200 transition-colors"
        >
          {t('privacy.banner.accept')}
        </button>
      )}
    </div>
  );
}
