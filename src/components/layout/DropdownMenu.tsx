import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import { converterTools, editorTools, devtoolTools, utilityTools, standaloneTools } from '../../config/toolRegistry';

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
      title: 'Convertidores',
      items: converterTools,
    },
    {
      title: 'Editores',
      items: editorTools,
    },
    {
      title: 'Más herramientas',
      items: [...devtoolTools, ...utilityTools, ...standaloneTools],
    }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
          isOpen ? 'text-brand-700 bg-brand-50' : 'text-text-secondary hover:text-text hover:bg-slate-100'
        }`}
      >
        {t('nav.convert')}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 w-[580px] bg-surface rounded-xl py-3 z-50 border border-border/70 shadow-elevated"
          onMouseLeave={() => setIsOpen(false)}>
          <div className="grid grid-cols-3 gap-1 px-2">
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
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors group"
                  >
                    <div className="p-1.5 rounded-lg bg-slate-100 text-slate-500 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors shrink-0">
                      <tool.icon className="w-4.5 h-4.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text">{tool.name}</p>
                      <p className="text-xs text-text-muted truncate">{tool.homeDesc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
