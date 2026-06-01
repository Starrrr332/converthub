import { useTranslation } from 'react-i18next';
import { FileText, Scissors, Minimize2, Image, Lock, Droplets, RotateCw, Hash, Unlock } from 'lucide-react';
import type { PdfTool } from '../../types';

interface PdfToolSelectorProps {
  selectedTool: PdfTool;
  onSelect: (tool: PdfTool) => void;
}

export function PdfToolSelector({ selectedTool, onSelect }: PdfToolSelectorProps) {
  const { t } = useTranslation('converter');
  
  const tools: Array<{ id: PdfTool; icon: React.ReactNode; label: string; description: string }> = [
    { id: 'merge', icon: <FileText className="w-5 h-5" />, label: t('pdf.tools.merge'), description: 'Unir varios PDF' },
    { id: 'split', icon: <Scissors className="w-5 h-5" />, label: t('pdf.tools.split'), description: 'Dividir PDF en partes' },
    { id: 'compress', icon: <Minimize2 className="w-5 h-5" />, label: t('pdf.tools.compress'), description: 'Reducir tamaño PDF' },
    { id: 'images-to-pdf', icon: <Image className="w-5 h-5" />, label: t('pdf.tools.imagesToPdf'), description: 'Convertir imágenes a PDF' },
    { id: 'rotate', icon: <RotateCw className="w-5 h-5" />, label: t('pdf.tools.rotate'), description: 'Rotar páginas PDF' },
    { id: 'watermark', icon: <Droplets className="w-5 h-5" />, label: t('pdf.tools.watermark'), description: 'Agregar marca de agua' },
    { id: 'page-numbers', icon: <Hash className="w-5 h-5" />, label: t('pdf.tools.pageNumbers'), description: 'Insertar números de página' },
    { id: 'protect', icon: <Lock className="w-5 h-5" />, label: t('pdf.tools.protect'), description: 'Proteger con contraseña' },
    { id: 'unlock', icon: <Unlock className="w-5 h-5" />, label: t('pdf.tools.unlock'), description: 'Quitar contraseña PDF' },
  ];
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {tools.map((tool) => (
        <button
          key={tool.id}
          onClick={() => onSelect(tool.id)}
          className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
            selectedTool === tool.id
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 hover:border-gray-300 text-gray-600'
          }`}
        >
          {tool.icon}
          <span className="text-sm font-medium text-center">{tool.label}</span>
          <span className="text-xs text-gray-400 text-center">{tool.description}</span>
        </button>
      ))}
    </div>
  );
}
