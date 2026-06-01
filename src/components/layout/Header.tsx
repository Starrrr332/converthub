import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Image as ImageIcon, Menu, X, Wrench, Ruler, Cpu } from 'lucide-react';
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
        { path: '/devtools', label: 'DevTools', icon: <Cpu className="w-4 h-4" /> },
        { path: '/tools/unit-converter', label: 'Convertidor de Unidades', icon: <Ruler className="w-4 h-4" /> },
        { path: '/tools/utilities', label: 'Utilidades', icon: <Wrench className="w-4 h-4" /> },
      ]
    }
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
          <nav className="md:hidden py-4 border-t max-h-[70vh] overflow-y-auto">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-gray-600"
            >
              {t('nav.home')}
            </Link>
            
            {mobileSections.map((section) => (
              <div key={section.title} className="py-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  {section.title}
                </p>
                <div className="pl-3 space-y-1">
                  {section.items.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 py-1.5 text-sm text-gray-600 hover:text-blue-600"
                    >
                      {(item as any).icon}
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            
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
