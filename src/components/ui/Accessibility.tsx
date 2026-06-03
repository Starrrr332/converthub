import { useTranslation } from 'react-i18next';

export function SkipLinks() {
  const { t } = useTranslation();

  return (
    <nav
      aria-label={t('accessibility.skipNavLabel', 'Saltar navegación')}
      className="sr-only focus-within:not-sr-only focus-within:fixed focus-within:top-4 focus-within:left-4 focus-within:z-[300]"
    >
      <a
        href="#main-content"
        className="block px-4 py-2 bg-accent-600 text-white text-sm font-medium rounded-lg shadow-lg"
      >
        {t('accessibility.skipToContent', 'Saltar al contenido principal')}
      </a>
    </nav>
  );
}
