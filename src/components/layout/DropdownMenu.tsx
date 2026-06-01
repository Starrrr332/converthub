import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import { converterNav, editorNav, toolsNav } from '../../config/navigation';

interface DropdownMenuProps {
  variant: 'convert' | 'edit' | 'tools';
}

export function DropdownMenu({ variant }: DropdownMenuProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const items =
    variant === 'convert' ? converterNav : variant === 'edit' ? editorNav : toolsNav;
  const label =
    variant === 'convert'
      ? t('nav.convert')
      : variant === 'edit'
        ? t('nav.edit')
        : t('nav.more');
  const basePath =
    variant === 'convert' ? '/converter' : variant === 'edit' ? '/editor' : '/tools';
  const isActive =
    variant === 'tools'
      ? location.pathname.startsWith('/tools') || location.pathname === '/devtools'
      : location.pathname.startsWith(basePath);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          isActive ? 'nav-link-active bg-indigo-50' : 'nav-link hover:bg-slate-50'
        }`}
      >
        {label}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl border border-slate-200/80 py-2 z-50 shadow-xl shadow-slate-900/10">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors mx-1 rounded-xl"
              >
                <div className={`p-2 rounded-lg shrink-0 ${item.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{t(item.labelKey)}</p>
                  {item.descKey && (
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{t(item.descKey)}</p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
