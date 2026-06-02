import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import type { ImageFormat } from '../../types';
import { FORMAT_NAMES, FORMAT_COLORS, getOutputFormats } from '../../utils/constants';

interface FormatSelectorProps {
  inputFormat: string;
  selectedFormat: string;
  onSelect: (format: ImageFormat) => void;
}

export const FormatSelector = memo(function FormatSelector({
  inputFormat,
  selectedFormat,
  onSelect,
}: FormatSelectorProps) {
  const { t } = useTranslation('converter');

  const formats = getOutputFormats(inputFormat);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-text-secondary">{t('formats.output')}</label>

      <div role="radiogroup" aria-label="Formato de salida" className="flex flex-wrap gap-2">
        {formats.map((format) => {
          const isSelected = selectedFormat === format;
          const color = FORMAT_COLORS[format];
          const name = FORMAT_NAMES[format];
           
          return (
            <button
              key={format}
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(format)}
              className={`px-3 py-1.5 rounded-md border border-border transition-all duration-150 flex items-center gap-2 ${
                isSelected
                  ? 'border-accent-400 bg-accent-50 text-accent-700'
                  : 'text-text-secondary hover:bg-accent-50 hover:text-accent-700'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-sm font-medium">{name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
});
