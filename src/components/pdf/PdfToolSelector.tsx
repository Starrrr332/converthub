import { useTranslation } from 'react-i18next';
import { FileText, Scissors, Minimize2, Image, Lock, Droplets } from 'lucide-react';
import type { PdfTool } from '../../types';

interface PdfToolSelectorProps {
  selectedTool: PdfTool;
  onSelect: (tool: PdfTool) => void;
}

export function PdfToolSelector({ selectedTool, onSelect }: PdfToolSelectorProps) {
  const { t } = useTranslation('converter');
  
  const tools: Array<{ id: PdfTool; icon: React.ReactNode; label: string; free: boolean }> = [
    { id: 'merge', icon: <FileText className="w-5 h-5" />, label: t('pdf.tools.merge'), free: true },
    { id: 'split', icon: <Scissors className="w-5 h-5" />, label: t('pdf.tools.split'), free: false },
    { id: 'compress', icon: <Minimize2 className="w-5 h-5" />, label: t('pdf.tools.compress'), free: false },
    { id: 'images-to-pdf', icon: <Image className="w-5 h-5" />, label: t('pdf.tools.imagesToPdf'), free: true },
    { id: 'protect', icon: <Lock className="w-5 h-5" />, label: t('pdf.tools.protect'), free: false },
    { id: 'watermark', icon: <Droplets className="w-5 h-5" />, label: t('pdf.tools.watermark'), free: false },
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
          {!tool.free && (
            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Premium</span>
          )}
        </button>
      ))}
    </div>
  );
}
