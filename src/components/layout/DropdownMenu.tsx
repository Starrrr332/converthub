import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ArrowRight } from 'lucide-react';
import {
  featuredConverters,
  featuredEditors,
  featuredTools,
  devtoolTools,
} from '../../config/toolRegistry';

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

  const sections = [
    {
      title: t('nav.sections.converters'),
      items: featuredConverters.slice(0, 4),
      link: '/converter',
      linkText: t('nav.viewAll'),
    },
    {
      title: t('nav.sections.editors'),
      items: featuredEditors.slice(0, 4),
      link: '/editor',
      linkText: t('nav.viewAll'),
    },
    {
      title: t('nav.sections.tools'),
      items: featuredTools.slice(0, 4),
      link: '/tools',
      linkText: t('nav.viewAllF'),
    },
    {
      title: t('nav.sections.devtools'),
      items: devtoolTools.slice(0, 4),
      link: '/devtools',
      linkText: t('nav.viewAll'),
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
          isOpen
          ? 'text-brand-700 bg-brand-50'
          : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
        }`}
      >
        {t('nav.convert')}
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1.5 w-[580px] bg-surface rounded-xl py-3 z-50 border border-border/70 shadow-elevated"
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="grid grid-cols-4 gap-1 px-2">
            {sections.map((section) => (
              <div key={section.title}>
                <p className="text-[11px] font-semibold text-text-muted uppercase tracking-widest px-3 pb-1">
                  {section.title}
                </p>
                {section.items.map((tool) => (
                  <Link
                    key={tool.path}
                    to={tool.path}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-accent-50 transition-colors group"
                  >
                    <div className="p-1.5 rounded-lg bg-surface-secondary text-text-muted group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors shrink-0">
                      <tool.icon className="w-4.5 h-4.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text">{tool.name}</p>
                      <p className="text-xs text-text-muted truncate">{tool.homeDesc}</p>
                    </div>
                  </Link>
                ))}
                <Link
                  to={section.link}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-accent-600 hover:text-accent-700"
                >
                  {section.linkText}
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
