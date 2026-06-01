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
        { path: '/converter/image', icon: <Image className="w-5 h-5" />, label: 'Imágenes', desc: 'PNG, JPG, WebP, GIF, SVG y más' },
        { path: '/converter/pdf', icon: <FileText className="w-5 h-5" />, label: 'PDF', desc: 'Unir, dividir, rotar, comprimir y más' },
        { path: '/converter/csv', icon: <Table className="w-5 h-5" />, label: 'CSV / Excel', desc: 'CSV ↔ XLSX ↔ JSON' },
        { path: '/converter/audio', icon: <Music className="w-5 h-5" />, label: 'Audio', desc: 'MP3, WAV, OGG, FLAC, AAC' },
        { path: '/converter/video', icon: <Film className="w-5 h-5" />, label: 'Video', desc: 'Convertir, comprimir, recortar' },
      ]
    },
    {
      title: 'Editores',
      items: [
        { path: '/editor/image', icon: <Edit3 className="w-5 h-5" />, label: 'Imágenes', desc: 'Redimensionar, rotar, filtros' },
        { path: '/editor/text', icon: <Type className="w-5 h-5" />, label: 'Texto', desc: 'Notepad con búsqueda y stats' },
        { path: '/editor/json', icon: <Braces className="w-5 h-5" />, label: 'JSON', desc: 'Formatear, minificar, validar' },
        { path: '/editor/markdown', icon: <Code className="w-5 h-5" />, label: 'Markdown', desc: 'Live preview, exportar HTML' },
        { path: '/editor/spreadsheet', icon: <FileSpreadsheet className="w-5 h-5" />, label: 'CSV Online', desc: 'Editar hojas de cálculo' },
      ]
    },
    {
      title: 'Más herramientas',
      items: [
        { path: '/devtools', icon: <Cpu className="w-5 h-5" />, label: 'DevTools', desc: 'Base64, Hash, QR, SQL, JWT, Regex' },
        { path: '/tools/unit-converter', icon: <Ruler className="w-5 h-5" />, label: 'Unidades', desc: 'Longitud, peso, temperatura, etc' },
        { path: '/tools/utilities', icon: <Wrench className="w-5 h-5" />, label: 'Utilidades', desc: 'Passwords, UUID, Lorem, Cron' },
      ]
    }
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
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[640px] bg-white rounded-xl shadow-lg border border-gray-100 py-4 z-50"
          onMouseLeave={() => setIsOpen(false)}>
          <div className="grid grid-cols-3 gap-2 px-2">
            {sections.map((section) => (
              <div key={section.title}>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-1">
                  {section.title}
                </p>
                {section.items.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="p-1.5 bg-gray-100 rounded-lg text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900">{item.label}</p>
                      <p className="text-xs text-gray-400 truncate">{item.desc}</p>
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
