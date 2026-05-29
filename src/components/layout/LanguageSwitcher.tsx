import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  
  const toggleLanguage = () => {
    const newLang = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLang);
  };
  
  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      title={i18n.language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
    >
      <Globe className="w-4 h-4" />
      <span>{i18n.language === 'es' ? 'EN' : 'ES'}</span>
    </button>
  );
}
