import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Image as ImageIcon, Menu, X, Heart } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { DropdownMenu } from './DropdownMenu';
import { useState } from 'react';
import { converterNav, editorNav, toolsNav } from '../../config/navigation';

interface HeaderProps {
  isPremium: boolean;
}

export function Header({ isPremium }: HeaderProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const linkClass = (path: string) =>
    `nav-link ${isActive(path) ? 'nav-link-active' : ''}`;

  const mobileSections = [
    { title: t('nav.convert'), items: converterNav },
    { title: t('nav.edit'), items: editorNav },
    { title: t('nav.more'), items: toolsNav },
  ];

  return (
    <header className="glass-nav sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="p-2 bg-gradient-to-br from-indigo-600 to-teal-500 rounded-xl shadow-md shadow-indigo-500/25 group-hover:shadow-lg transition-shadow">
              <ImageIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">{t('app.name')}</span>
            {isPremium && <span className="badge-premium">PRO</span>}
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            <Link to="/" className={`px-3 py-2 rounded-lg ${linkClass('/')}`}>
              {t('nav.home')}
            </Link>
            <DropdownMenu variant="convert" />
            <DropdownMenu variant="edit" />
            <DropdownMenu variant="tools" />
            <Link
              to="/pricing"
              className={`ml-1 px-3 py-2 rounded-lg flex items-center gap-1.5 ${linkClass('/pricing')}`}
            >
              <Heart className="w-4 h-4 text-rose-500" />
              {t('nav.pricing')}
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              aria-expanded={mobileMenuOpen}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-slate-200/80 max-h-[70vh] overflow-y-auto">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-2 py-2.5 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-50"
            >
              {t('nav.home')}
            </Link>

            {mobileSections.map((section) => (
              <div key={section.title}>
                <p className="px-2 pt-4 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {section.title}
                </p>
                <div className="space-y-0.5 pl-2">
                  {section.items.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 text-sm text-slate-600 hover:text-indigo-600"
                    >
                      {t(item.labelKey)}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <Link
              to="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-2 py-2.5 mt-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-50"
            >
              <Heart className="w-4 h-4 text-rose-500" />
              {t('nav.pricing')}
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
