import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-accent-50 rounded-xl border border-border hover:border-accent-200 transition-all"
      title={i18n.language === 'es' ? t('language.switchToEn') : t('language.switchToEs')}
    >
      <Globe className="w-4 h-4" />
      <span>{i18n.language === 'es' ? 'EN' : 'ES'}</span>
    </button>
  );
}
