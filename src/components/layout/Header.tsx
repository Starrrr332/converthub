import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Image as ImageIcon, Menu, X, Heart, Search, Star, Palette } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { DropdownMenu } from './DropdownMenu';
import { useState, useEffect, useRef } from 'react';

import { useCommandStore } from '../../store/commandStore';
import { useThemeStore, themes } from '../../store/themeStore';

export function Header() {
  const { t } = useTranslation();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const themeRef = useRef<HTMLDivElement>(null);
  const { favorites } = useCommandStore();
  const { currentTheme, setTheme } = useThemeStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (themeRef.current && !themeRef.current.contains(event.target as Node)) {
        setThemeOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const mobileSections = [
    {
      title: 'Categorías',
      items: [
        { path: '/converter', label: 'Convertidores' },
        { path: '/editor', label: 'Editores' },
        { path: '/tools', label: 'Herramientas' },
        { path: '/devtools', label: 'DevTools' },
        { path: '/utilities', label: 'Utilidades' },
      ],
    },
  ];

  const openCommandPalette = () => {
    window.dispatchEvent(new CustomEvent('toggle-command-palette'));
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled ? 'glass-nav' : 'bg-transparent'
      }`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[200] focus:px-4 focus:py-2 focus:bg-accent-600 focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-accent-300 focus:ring-offset-2"
      >
        Saltar al contenido principal
      </a>
      <div className="page-container">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="p-2 bg-accent-600 rounded-lg">
              <ImageIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-text-primary tracking-tight">
              {t('app.name')}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive('/')
                  ? 'text-accent-700 bg-accent-50'
                  : 'text-text-secondary hover:text-text hover:bg-surface-secondary'
              }`}
            >
              {t('nav.home')}
            </Link>

            <DropdownMenu />

            <Link
              to="/favorites"
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                isActive('/favorites')
                  ? 'text-accent-700 bg-accent-50'
                  : 'text-text-secondary hover:text-text hover:bg-surface-secondary'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              Favoritos
              {favorites.length > 0 && (
                <span className="ml-0.5 px-1.5 py-0.5 text-[10px] font-bold bg-accent-100 text-accent-800 rounded-full">
                  {favorites.length}
                </span>
              )}
            </Link>

            <Link
              to="/pricing"
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                isActive('/pricing')
                  ? 'text-accent-700 bg-accent-50'
                  : 'text-text-secondary hover:text-text hover:bg-surface-secondary'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              {t('nav.pricing')}
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Theme Selector */}
            <div className="relative" ref={themeRef}>
              <button
                onClick={() => setThemeOpen(!themeOpen)}
                className="p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-accent-50 transition-colors"
                title="Cambiar tema"
              >
                <Palette className="w-4 h-4" />
              </button>
              {themeOpen && (
                <div className="absolute top-full right-0 mt-1.5 w-56 bg-surface rounded-lg py-2 z-50 border border-border/70">
                  <p className="px-3 pb-1 text-[11px] font-medium text-text-muted uppercase tracking-wider">
                    Temas
                  </p>
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => {
                        setTheme(theme.id);
                        setThemeOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-accent-50 transition-colors text-left"
                    >
                      <div className="flex gap-0.5 shrink-0">
                        {Object.values(theme.brand)
                          .slice(4, 7)
                          .map((color, i) => (
                            <div
                              key={i}
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                      </div>
                      <span className="text-sm text-text-primary">{theme.name}</span>
                      {currentTheme === theme.id && (
                        <span className="ml-auto text-accent-600 text-xs font-medium">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={openCommandPalette}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm text-text-muted bg-surface-secondary hover:bg-accent-50 transition-colors border border-border"
            >
              <Search className="w-4 h-4" />
              <span className="text-xs">Buscar...</span>
              <kbd className="text-[10px] font-medium px-1 py-0.5 bg-surface rounded border border-border">
                ⌘K
              </kbd>
            </button>

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
                        isActive(item.path)
                          ? 'text-brand-700 bg-brand-50 font-medium'
                          : 'text-text-secondary hover:text-text hover:bg-slate-50'
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
