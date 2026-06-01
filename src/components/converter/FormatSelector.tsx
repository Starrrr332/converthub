import { useTranslation } from 'react-i18next';
import type { ImageFormat } from '../../types';
import { FORMAT_NAMES, FORMAT_COLORS, getOutputFormats } from '../../utils/constants';

interface FormatSelectorProps {
  inputFormat: string;
  isPremium: boolean;
  selectedFormat: string;
  onSelect: (format: ImageFormat) => void;
}

export function FormatSelector({
  inputFormat,
  isPremium,
  selectedFormat,
  onSelect
}: FormatSelectorProps) {
  const { t } = useTranslation('converter');
  
  const formats = getOutputFormats(inputFormat, isPremium);
  
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {t('formats.output')}
      </label>
      
      <div className="flex flex-wrap gap-2">
        {formats.map((format) => {
          const isSelected = selectedFormat === format;
          const color = FORMAT_COLORS[format];
          const name = FORMAT_NAMES[format];
          
          return (
            <button
              key={format}
              onClick={() => onSelect(format)}
              className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 flex items-center gap-2 ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="font-medium">{name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
