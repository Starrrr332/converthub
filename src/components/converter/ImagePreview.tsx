import { useTranslation } from 'react-i18next';
import { formatFileSize } from '../../utils/constants';
import { Download, Eye, DownloadCloud } from 'lucide-react';
import { triggerDownload } from '../../utils/fileHelpers';
import { downloadAsZip } from '../../utils/zipDownload';

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
      <div className="mt-4 flex gap-2">
        {convertedUrl && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}

export function BulkDownloadButton({
  files,
  disabled,
}: {
  files: Array<{ url: string; format: string; originalName?: string }>;
  disabled?: boolean;
}) {
  const { t } = useTranslation('converter');

  const handleBulkDownload = async () => {
    const mapped = files.map((f) => ({
      url: f.url,
      name: f.originalName
        ? f.originalName.replace(/\.[^/.]+$/, `.${f.format.split('/')[1] || 'webp'}`)
        : `converted.${f.format.split('/')[1] || 'webp'}`,
    }));
    await downloadAsZip(mapped, 'converted-files.zip');
  };

  if (files.length < 2) return null;

  return (
    <button
      onClick={handleBulkDownload}
      disabled={disabled}
      className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-accent-600 text-white hover:bg-accent-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors shadow-sm"
    >
      <DownloadCloud className="w-4 h-4" />
      {t('actions.downloadAll', 'Descargar todo como ZIP')} ({files.length})
    </button>
  );
}
