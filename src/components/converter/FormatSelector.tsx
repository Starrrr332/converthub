import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Crown } from 'lucide-react';
import type { ImageFormat } from '../../types';
import { PREMIUM_FORMATS } from '../../types';
import {
  FORMAT_NAMES,
  FORMAT_COLORS,
  isPremiumFormat,
} from '../../utils/constants';

interface FormatSelectorProps {
  inputFormat: string;
  selectedFormat: string;
  onSelect: (format: ImageFormat) => void;
  isPremium?: boolean;
}

export const FormatSelector = memo(function FormatSelector({
  inputFormat,
  selectedFormat,
  onSelect,
  isPremium = false,
}: FormatSelectorProps) {
  const { t } = useTranslation('converter');

  // Show ALL formats, but mark non-premium ones differently
  // For premium users, show all. For free, show all but disable premium ones.
  const allFormats = PREMIUM_FORMATS.filter((f: ImageFormat) => f !== inputFormat);
  const hasPremiumDisabled = !isPremium && allFormats.some((f: ImageFormat) => isPremiumFormat(f));

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-text-secondary">{t('formats.output')}</label>

      <div role="radiogroup" aria-label="Formato de salida" className="flex flex-wrap gap-2">
        {allFormats.map((format: ImageFormat) => {
          const isSelected = selectedFormat === format;
          const color = FORMAT_COLORS[format];
          const name = FORMAT_NAMES[format];
          const isPrem = isPremiumFormat(format);
          const isDisabled = isPrem && !isPremium;

          return (
            <button
              key={format}
              role="radio"
              aria-checked={isSelected}
              disabled={isDisabled}
              onClick={() => !isDisabled && onSelect(format)}
              title={isDisabled ? t('formats.locked') : name}
              className={`px-3 py-1.5 rounded-md border border-border transition-all duration-150 flex items-center gap-2 ${
                isSelected && !isDisabled
                  ? 'border-accent-400 bg-accent-50 text-accent-700'
                  : isDisabled
                    ? 'opacity-50 cursor-not-allowed border-dashed border-amber-200 bg-amber-50/30'
                    : 'text-text-secondary hover:bg-accent-50 hover:text-accent-700'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-sm font-medium">{name}</span>
              {isPrem && (
                <Crown className={`w-3 h-3 ${isDisabled ? 'text-amber-400' : 'text-amber-500'}`} />
              )}
            </button>
          );
        })}
      </div>

      {hasPremiumDisabled && (
          <p className="text-xs text-amber-600 flex items-center gap-1 mt-1">
          <Crown className="w-3 h-3" />
          {t('formats.premiumNotice')}{' '}
          <a href="/pricing" className="underline font-medium hover:text-amber-700">
            {t('formats.upgradeLink')}
          </a>
        </p>
      )}
    </div>
  );
});
