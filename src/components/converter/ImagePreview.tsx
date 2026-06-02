import { useTranslation } from 'react-i18next';
import { formatFileSize } from '../../utils/constants';
import { Download, Eye } from 'lucide-react';
import { triggerDownload } from '../../utils/fileHelpers';

interface ImagePreviewProps {
  originalUrl: string;
  convertedUrl?: string;
  originalSize: number;
  convertedSize?: number;
  originalName: string;
  format: string;
}

export function ImagePreview({
  originalUrl,
  convertedUrl,
  originalSize,
  convertedSize,
  originalName,
  format,
}: ImagePreviewProps) {
  const { t } = useTranslation('converter');

  const reduction = convertedSize ? Math.round((1 - convertedSize / originalSize) * 100) : 0;

  const handleDownload = () => {
    if (convertedUrl) {
      const extension = format.split('/')[1] || 'webp';
      const newName = originalName.replace(/\.[^/.]+$/, `.${extension}`);
      triggerDownload(convertedUrl, newName);
    }
  };

  return (
    <div className="content-panel p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-text-secondary">{t('preview.original')}</h4>
          <div className="relative aspect-video bg-surface-secondary rounded-lg overflow-hidden">
            <img src={originalUrl} alt="Original" className="w-full h-full object-contain" />
          </div>
          <div className="flex justify-between text-xs text-text-secondary">
            <span>{originalName}</span>
            <span>{formatFileSize(originalSize)}</span>
          </div>
        </div>

        {/* Converted */}
        {convertedUrl && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-text-secondary">{t('preview.converted')}</h4>
            <div className="relative aspect-video bg-surface-secondary rounded-lg overflow-hidden">
              <img src={convertedUrl} alt="Converted" className="w-full h-full object-contain" />
            </div>
            <div className="flex justify-between text-xs text-text-secondary">
              <span>{originalName.replace(/\.[^/.]+$/, `.${format.split('/')[1]}`)}</span>
              <span>{formatFileSize(convertedSize || 0)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      {convertedSize && (
        <div className="mt-4 p-3 bg-accent-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-accent-700">
              {t('preview.convertedSize')}: {formatFileSize(convertedSize)}
            </span>
            <span className="text-sm font-medium text-accent-600">
              {t('preview.reduction', { percent: reduction })}
            </span>
          </div>
        </div>
      )}

      {/* Actions */}
      {convertedUrl && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium bg-accent-500 text-white hover:bg-accent-600 transition-colors rounded-md"
          >
            <Download className="w-4 h-4" />
            {t('actions.download')}
          </button>
          <a
            href={convertedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium border border-border rounded-md hover:bg-accent-50 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </a>
        </div>
      )}
    </div>
  );
}
