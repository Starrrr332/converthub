import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Image as ImageIcon, Menu, X } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { DropdownMenu } from './DropdownMenu';
import { useState } from 'react';

interface HeaderProps {
  isPremium: boolean;
}

export function Header({ isPremium }: HeaderProps) {
  const { t } = useTranslation();
  const location = window.location;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <ImageIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              {t('app.name')}
            </span>
            {isPremium && (
              <span className="badge-premium">PRO</span>
            )}
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/'
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t('nav.home')}
            </Link>
            
            <DropdownMenu />
            
            <Link
              to="/pricing"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/pricing'
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t('nav.pricing')}
            </Link>
          </nav>
          
          {/* Right side */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-gray-600"
            >
              {t('nav.home')}
            </Link>
            
            <div className="py-2">
              <p className="text-sm font-medium text-gray-900 mb-2">{t('nav.convert')}</p>
              <div className="pl-4 space-y-2">
                <Link to="/converter/image" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-sm text-gray-600">
                  {t('nav.converters.image')}
                </Link>
                <Link to="/converter/pdf" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-sm text-gray-600">
                  {t('nav.converters.pdf')}
                </Link>
                <Link to="/converter/csv" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-sm text-gray-600">
                  {t('nav.converters.csv')}
                </Link>
                <Link to="/converter/audio" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-sm text-gray-600">
                  {t('nav.converters.audio')}
                </Link>
              </div>
            </div>
            
            <Link
              to="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-gray-600"
            >
              {t('nav.pricing')}
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
