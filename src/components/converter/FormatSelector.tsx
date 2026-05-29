import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ImageFormat } from '../../types';
import { FORMAT_NAMES, FORMAT_COLORS, getOutputFormats, isFormatSupported } from '../../utils/constants';
import { Lock } from 'lucide-react';
import { UpgradeModal } from '../ui/UpgradeModal';

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
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [lockedFormat, setLockedFormat] = useState<string>('');
  
  const formats = getOutputFormats(inputFormat, isPremium);
  
  const handleFormatClick = (format: ImageFormat) => {
    // Check if format is premium-only
    if (!isPremium && !isFormatSupported(format, false)) {
      setLockedFormat(FORMAT_NAMES[format]);
      setShowUpgradeModal(true);
      return;
    }
    onSelect(format);
  };
  
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {t('formats.output')}
      </label>
      
      <div className="flex flex-wrap gap-2">
        {formats.map((format) => {
          const isSelected = selectedFormat === format;
          const isLocked = !isPremium && !isFormatSupported(format, false);
          const color = FORMAT_COLORS[format];
          const name = FORMAT_NAMES[format];
          
          return (
            <button
              key={format}
              onClick={() => handleFormatClick(format)}
              className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 flex items-center gap-2 ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : isLocked
                    ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="font-medium">{name}</span>
              {isLocked && (
                <Lock className="w-3 h-3 text-yellow-500" />
              )}
            </button>
          );
        })}
      </div>
      
      {!isPremium && (
        <p className="text-xs text-gray-500 mt-2">
          {t('formats.premium')} formatos disponibles con suscripción
        </p>
      )}
      
      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)}
        feature={`${t('formats.output')}: ${lockedFormat}`}
      />
    </div>
  );
}
