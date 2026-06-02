import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, Heart } from 'lucide-react';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="page-container py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-base font-bold text-text-primary tracking-tight">
              {t('app.name')}
            </h3>
            <p className="text-sm text-text-secondary mt-2 max-w-xs leading-relaxed">
              {t('app.tagline')}
            </p>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-1.5 mt-5 text-sm font-medium text-accent-600 hover:text-accent-700 transition-colors duration-200"
            >
              <Heart className="w-3.5 h-3.5" />
              Donar
            </Link>
          </div>

          {/* Categorías */}
          <div>
            <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">
              Categorías
            </h4>
            <ul className="space-y-2.5">
              {[
                { path: '/converter', label: 'Convertidores' },
                { path: '/editor', label: 'Editores' },
                { path: '/tools', label: 'Herramientas' },
                { path: '/devtools', label: 'DevTools' },
                { path: '/utilities', label: 'Utilidades' },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">
              Legal
            </h4>
            <ul className="space-y-2.5">
              {[
                { path: '/privacy', label: t('footer.privacyPolicy') },
                { path: '/terms', label: 'Términos de Servicio' },
                { path: '/security', label: 'Seguridad' },
                { path: '/about', label: 'Acerca de' },
                { path: '/contact', label: 'Contacto' },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-1.5 mt-5 text-xs text-accent-600">
              <Shield className="w-3.5 h-3.5" />
              <span>{t('footer.privacy')}</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-text-muted">{t('footer.copyright')}</p>
          <p className="text-xs text-text-muted">{t('footer.privacyNote')}</p>
        </div>
      </div>
    </footer>
  );
}
