import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Image, FileText, Table, Music } from 'lucide-react';

export function DropdownMenu() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const menuItems = [
    { 
      path: '/converter/image', 
      icon: <Image className="w-5 h-5" />, 
      label: t('nav.converters.image'),
      description: t('nav.converters.imageDesc')
    },
    { 
      path: '/converter/pdf', 
      icon: <FileText className="w-5 h-5" />, 
      label: t('nav.converters.pdf'),
      description: t('nav.converters.pdfDesc')
    },
    { 
      path: '/converter/csv', 
      icon: <Table className="w-5 h-5" />, 
      label: t('nav.converters.csv'),
      description: t('nav.converters.csvDesc')
    },
    { 
      path: '/converter/audio', 
      icon: <Music className="w-5 h-5" />, 
      label: t('nav.converters.audio'),
      description: t('nav.converters.audioDesc')
    },
  ];
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
      >
        {t('nav.convert')}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                {item.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
