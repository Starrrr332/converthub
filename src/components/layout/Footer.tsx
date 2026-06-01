import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, Heart } from 'lucide-react';
import { converterNav, editorNav, toolsNav } from '../../config/navigation';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white/60 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-bold text-slate-900">{t('app.name')}</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed max-w-xs">{t('app.tagline')}</p>
            <div className="privacy-strip mt-4 max-w-sm">
              <Shield className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
              <p className="text-xs text-teal-900 leading-relaxed">{t('footer.privacyNote')}</p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
              {t('nav.convert')}
            </h4>
            <ul className="space-y-2.5">
              {converterNav.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-sm text-slate-600 hover:text-indigo-600 transition-colors"
                  >
                    {t(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
              {t('nav.edit')}
            </h4>
            <ul className="space-y-2.5">
              {editorNav.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-sm text-slate-600 hover:text-indigo-600 transition-colors"
                  >
                    {t(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
              {t('nav.more')}
            </h4>
            <ul className="space-y-2.5">
              {toolsNav.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-sm text-slate-600 hover:text-indigo-600 transition-colors"
                  >
                    {t(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
              {t('footer.legal')}
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/privacy" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">
                  {t('footer.privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  {t('nav.pricing')}
                </Link>
              </li>
              <li>
                <a
                  href="mailto:contact@converthub.com"
                  className="text-sm text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  {t('footer.contact')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-200/80">
          <p className="text-sm text-slate-500 text-center">{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
