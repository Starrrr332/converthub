import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Image as ImageIcon, Menu, X } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useState } from 'react';

interface HeaderProps {
  isPremium: boolean;
}

export function Header({ isPremium }: HeaderProps) {
  const { t } = useTranslation();
  const location = window.location;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/converter', label: t('nav.converter') },
    { path: '/pricing', label: t('nav.pricing') }
  ];
  
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
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {item.label}
              </Link>
            ))}
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
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 text-sm font-medium ${
                  location.pathname === item.path
                    ? 'text-blue-600'
                    : 'text-gray-600'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
