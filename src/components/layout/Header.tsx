import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Image as ImageIcon, Menu, X, Heart } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { DropdownMenu } from './DropdownMenu';
import { useState, useEffect } from 'react';

interface HeaderProps {
  isPremium: boolean;
}

export function Header({ isPremium }: HeaderProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const mobileSections = [
    {
      title: 'Convertidores',
      items: [
        { path: '/converter/image', label: 'Imágenes' },
        { path: '/converter/pdf', label: 'PDF' },
        { path: '/converter/csv', label: 'CSV / Excel' },
        { path: '/converter/audio', label: 'Audio' },
        { path: '/converter/video', label: 'Video' },
      ]
    },
    {
      title: 'Editores',
      items: [
        { path: '/editor/image', label: 'Editor de Imágenes' },
        { path: '/editor/text', label: 'Editor de Texto' },
        { path: '/editor/json', label: 'JSON Formatter' },
        { path: '/editor/markdown', label: 'Editor Markdown' },
        { path: '/editor/spreadsheet', label: 'CSV Online' },
      ]
    },
    {
      title: 'Más herramientas',
      items: [
        { path: '/devtools', label: 'DevTools' },
        { path: '/tools/unit-converter', label: 'Convertidor de Unidades' },
        { path: '/tools/utilities', label: 'Utilidades' },
        { path: '/tools/ocr', label: 'OCR - Texto de Imagen' },
        { path: '/tools/image-compressor', label: 'Compresor de Imágenes' },
        { path: '/tools/file-analyzer', label: 'Analizador de Archivos' },
      ]
    }
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-200 ${
      scrolled ? 'glass-nav shadow-sm' : 'bg-transparent'
    }`}>
      <div className="page-container">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="p-1.5 bg-brand-600 rounded-lg">
              <ImageIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-text tracking-tight">
              {t('app.name')}
            </span>
            {isPremium && (
              <span className="badge-premium">PRO</span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive('/') ? 'text-brand-700 bg-brand-50' : 'text-text-secondary hover:text-text hover:bg-slate-100'
              }`}
            >
              {t('nav.home')}
            </Link>

            <DropdownMenu />

            <Link
              to="/pricing"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                isActive('/pricing') ? 'text-brand-700 bg-brand-50' : 'text-text-secondary hover:text-text hover:bg-slate-100'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              {t('nav.pricing')}
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />

            <Link to="/pricing" className="hidden sm:inline-flex">
              <button className="px-3 py-1.5 text-xs font-semibold bg-brand-600 text-white rounded-full hover:bg-brand-700 transition-colors">
                Donar
              </button>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text hover:bg-slate-100 transition-colors"
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/50 bg-surface max-h-[calc(100vh-3.5rem)] overflow-y-auto">
          <nav className="page-container py-4 space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
                isActive('/') ? 'text-brand-700 bg-brand-50' : 'text-text-secondary'
              }`}
            >
              {t('nav.home')}
            </Link>

            {mobileSections.map((section) => (
              <div key={section.title} className="pt-3 first:pt-0">
                <p className="px-3 pb-1 text-xs font-semibold text-text-muted uppercase tracking-wider">
                  {section.title}
                </p>
                <div className="space-y-0.5">
                  {section.items.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-3 py-2 rounded-lg text-sm ${
                        isActive(item.path) ? 'text-brand-700 bg-brand-50 font-medium' : 'text-text-secondary hover:text-text hover:bg-slate-50'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <div className="pt-3 mt-3 border-t border-border/50">
              <Link
                to="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-brand-600"
              >
                <Heart className="w-4 h-4" />
                Donar
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
