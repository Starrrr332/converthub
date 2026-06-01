import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Image, FileText, Table, Music, Film, Edit3, Type, Braces, Code, FileSpreadsheet, Wrench, Ruler, Cpu } from 'lucide-react';

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
      items: [
        { path: '/converter/image', icon: <Image className="w-4.5 h-4.5" />, label: 'Imágenes', desc: 'PNG, JPG, WebP, GIF, SVG' },
        { path: '/converter/pdf', icon: <FileText className="w-4.5 h-4.5" />, label: 'PDF', desc: 'Unir, dividir, rotar, comprimir' },
        { path: '/converter/csv', icon: <Table className="w-4.5 h-4.5" />, label: 'CSV / Excel', desc: 'CSV ↔ XLSX ↔ JSON' },
        { path: '/converter/audio', icon: <Music className="w-4.5 h-4.5" />, label: 'Audio', desc: 'MP3, WAV, OGG, FLAC, AAC' },
        { path: '/converter/video', icon: <Film className="w-4.5 h-4.5" />, label: 'Video', desc: 'Convertir, comprimir, recortar' },
      ]
    },
    {
      title: 'Editores',
      items: [
        { path: '/editor/image', icon: <Edit3 className="w-4.5 h-4.5" />, label: 'Imágenes', desc: 'Redimensionar, rotar, filtros' },
        { path: '/editor/text', icon: <Type className="w-4.5 h-4.5" />, label: 'Texto', desc: 'Notepad con búsqueda y stats' },
        { path: '/editor/json', icon: <Braces className="w-4.5 h-4.5" />, label: 'JSON', desc: 'Formatear, minificar, validar' },
        { path: '/editor/markdown', icon: <Code className="w-4.5 h-4.5" />, label: 'Markdown', desc: 'Live preview, exportar HTML' },
        { path: '/editor/spreadsheet', icon: <FileSpreadsheet className="w-4.5 h-4.5" />, label: 'CSV Online', desc: 'Editar hojas de cálculo' },
      ]
    },
    {
      title: 'Más herramientas',
      items: [
        { path: '/devtools', icon: <Cpu className="w-4.5 h-4.5" />, label: 'DevTools', desc: 'Base64, Hash, QR, SQL, JWT' },
        { path: '/tools/unit-converter', icon: <Ruler className="w-4.5 h-4.5" />, label: 'Unidades', desc: 'Longitud, peso, temperatura' },
        { path: '/tools/utilities', icon: <Wrench className="w-4.5 h-4.5" />, label: 'Utilidades', desc: 'Passwords, UUID, Lorem, Cron' },
      ]
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
                {section.items.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors group"
                  >
                    <div className="p-1.5 rounded-lg bg-slate-100 text-slate-500 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors shrink-0">
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text">{item.label}</p>
                      <p className="text-xs text-text-muted truncate">{item.desc}</p>
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
