import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Image as ImageIcon, Menu, X, Heart, Search, Star, Palette, Sun, Moon } from 'lucide-react';
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
  const { currentTheme, setTheme, darkMode, toggleDarkMode, customColor, setCustomColor } =
    useThemeStore();

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
      title: t('nav.categories'),
      items: [
        { path: '/converter', label: t('nav.sections.converters') },
        { path: '/editor', label: t('nav.sections.editors') },
        { path: '/tools', label: t('nav.sections.tools') },
        { path: '/devtools', label: t('nav.sections.devtools') },
        { path: '/utilities', label: t('nav.sections.utilities') },
      ],
    },
  ];

  const openCommandPalette = () => {
    window.dispatchEvent(new CustomEvent('toggle-command-palette'));
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-nav' : 'bg-transparent'
      }`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[200] focus:px-4 focus:py-2 focus:bg-accent-600 focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-300 focus:ring-offset-2"
      >
        {t('nav.skipToContent')}
      </a>
      <div className="page-container">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="p-2 bg-accent-600 rounded-xl transition-transform duration-200 group-hover:scale-105 shadow-sm">
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
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive('/')
                  ? 'text-accent-700 bg-accent-50'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
              }`}
            >
              {t('nav.home')}
            </Link>

            <DropdownMenu />

            <Link
              to="/favorites"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1.5 ${
                isActive('/favorites')
                  ? 'text-accent-700 bg-accent-50'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              {t('nav.favorites')}
              {favorites.length > 0 && (
                <span className="ml-0.5 px-1.5 py-0.5 text-[10px] font-bold bg-accent-100 text-accent-800 rounded-full">
                  {favorites.length}
                </span>
              )}
            </Link>

            <Link
              to="/pricing"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1.5 ${
                isActive('/pricing')
                  ? 'text-accent-700 bg-accent-50'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
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
                className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-accent-50 transition-all duration-200"
                title={t('nav.theme.change')}
              >
                <Palette className="w-4 h-4" />
              </button>
              {themeOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-surface rounded-xl py-2 z-50 border border-border shadow-elevated animate-slide-down">
                  <p className="px-3 pb-1.5 text-[11px] font-medium text-text-muted uppercase tracking-wider">
                    {t('nav.theme.title')}
                  </p>
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => {
                        setTheme(theme.id);
                        setThemeOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-accent-50 transition-all duration-150 text-left"
                    >
                      <div className="flex gap-0.5 shrink-0">
                        {Object.values(theme.brand)
                          .slice(4, 7)
                          .map((color, i) => (
                            <div
                              key={i}
                              className="w-3.5 h-3.5 rounded-full ring-1 ring-black/5"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                      </div>
                      <span className="text-sm text-text-primary">{theme.name}</span>
                      {currentTheme === theme.id && (
                        <span className="ml-auto text-accent-600 text-xs font-bold">✓</span>
                      )}
                    </button>
                  ))}

                  {/* Custom color option */}
                  <hr className="mx-3 my-1.5 border-border" />
                  <button
                    onClick={() => {
                      setTheme('custom');
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 transition-all duration-150 text-left ${
                      currentTheme === 'custom'
                        ? 'bg-accent-50'
                        : 'hover:bg-accent-50'
                    }`}
                  >
                    <div className="shrink-0">
                      <div
                        className="w-8 h-5 rounded-md ring-1 ring-black/10 shadow-sm"
                        style={{ backgroundColor: customColor }}
                      />
                    </div>
                    <span className="text-sm text-text-primary">Custom</span>
                    {currentTheme === 'custom' && (
                      <span className="ml-auto text-accent-600 text-xs font-bold">✓</span>
                    )}
                  </button>

                  {currentTheme === 'custom' && (
                    <div className="flex items-center gap-2.5 px-3 py-2">
                      <input
                        type="color"
                        value={customColor}
                        onChange={(e) => {
                          setCustomColor(e.target.value);
                        }}
                        className="w-8 h-8 p-0.5 rounded-lg cursor-pointer border border-border bg-transparent"
                      />
                      <input
                        type="text"
                        value={customColor.toUpperCase()}
                        onChange={(e) => {
                          const val = e.target.value.trim();
                          if (/^#?[0-9a-fA-F]{6}$/.test(val)) {
                            setCustomColor(val.startsWith('#') ? val : `#${val}`);
                          }
                        }}
                        className="flex-1 text-xs font-mono bg-surface-secondary border border-border rounded-md px-2 py-1.5 text-text-primary outline-none focus:border-accent-400 transition-colors"
                        placeholder="#HEX"
                      />
                    </div>
                  )}

                  <hr className="mx-3 my-1.5 border-border" />
                  <button
                    onClick={() => {
                      toggleDarkMode();
                      setThemeOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-accent-50 transition-all duration-150 text-left"
                  >
                    {darkMode ? (
                      <Sun className="w-4 h-4 text-text-muted" />
                    ) : (
                      <Moon className="w-4 h-4 text-text-muted" />
                    )}
                    <span className="text-sm text-text-primary">
                      {darkMode ? t('nav.theme.light') : t('nav.theme.dark')}
                    </span>
                    {darkMode && (
                      <span className="ml-auto text-accent-600 text-xs font-bold">✓</span>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Search */}
            <button
              onClick={openCommandPalette}
              className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm text-text-muted bg-surface-secondary hover:bg-surface hover:border-accent-200 transition-all duration-200 border border-border rounded-lg"
            >
              <Search className="w-4 h-4" />
              <span className="text-xs">{t('nav.search')}</span>
              <kbd className="text-[10px] font-medium px-1.5 py-0.5 bg-surface rounded border border-border shadow-sm">
                ⌘K
              </kbd>
            </button>

            <LanguageSwitcher />

            <Link to="/pricing" className="hidden sm:inline-flex">
              <button className="px-4 py-1.5 text-xs font-semibold bg-accent-600 text-white rounded-full hover:bg-accent-700 transition-all duration-200 shadow-sm hover:shadow-md">
                {t('nav.pricing')}
              </button>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-all duration-200"
              aria-label={mobileMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-surface max-h-[calc(100vh-3.5rem)] overflow-y-auto animate-slide-down">
          <nav className="page-container py-4 space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive('/')
                  ? 'text-accent-700 bg-accent-50'
                  : 'text-text-secondary hover:bg-surface-secondary'
              }`}
            >
              {t('nav.home')}
            </Link>

            {mobileSections.map((section) => (
              <div key={section.title} className="pt-3 first:pt-0">
                <p className="px-3 pb-1.5 text-xs font-semibold text-text-muted uppercase tracking-wider">
                  {section.title}
                </p>
                <div className="space-y-0.5">
                  {section.items.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                        isActive(item.path)
                          ? 'text-accent-700 bg-accent-50 font-medium'
                          : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <div className="pt-3 mt-3 border-t border-border">
              <Link
                to="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-medium text-accent-600 hover:bg-accent-50 transition-all duration-200"
              >
                <Heart className="w-4 h-4" />
                {t('nav.donate')}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
