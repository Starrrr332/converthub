import { useTranslation } from 'react-i18next';
import { useImageConverter } from '../hooks/useImageConverter';
import { PageLayout } from '../components/layout/PageLayout';
import { FileDropzone } from '../components/converter/FileDropzone';
import { FormatSelector } from '../components/converter/FormatSelector';
import { ImagePreview } from '../components/converter/ImagePreview';
import { ProgressIndicator } from '../components/converter/ProgressIndicator';
import { Button } from '../components/ui/Button';
import { Trash2, RefreshCw } from 'lucide-react';

export function Converter() {
  const { t } = useTranslation('converter');
  const { t: tc } = useTranslation('common');
  const converter = useImageConverter();

  const handleConvert = async () => {
    if (converter.selectedFiles.length === 1) {
      await converter.convert();
    } else {
      await converter.convertAll();
    }
  };

  return (
    <PageLayout
      title={t('actions.convert')}
      subtitle={
        converter.isPremium
          ? 'Premium: sin límites'
          : `${converter.remainingConversions} conversiones restantes hoy`
      }
      showPrivacyBanner
      breadcrumb={[
        { label: tc('nav.home'), to: '/' },
        { label: tc('nav.converters.image') },
      ]}
    >
      <FileDropzone
        onFilesSelected={converter.addFiles}
        isPremium={converter.isPremium}
        maxSize={converter.maxSize}
        disabled={converter.isConverting}
      />

      {converter.selectedFiles.length > 0 && (
        <div className="mt-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              {t('batch.filesSelected', { count: converter.selectedFiles.length })}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={converter.clearFiles}
              disabled={converter.isConverting}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              {t('actions.reset')}
            </Button>
          </div>

          <div className="space-y-2">
            {converter.selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-11 h-11 object-cover rounded-lg shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
                    <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => converter.removeFile(index)}
                  className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors"
                  disabled={converter.isConverting}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="content-panel">
            <FormatSelector
              inputFormat={converter.selectedFiles[0]?.type || 'image/png'}
              isPremium={converter.isPremium}
              selectedFormat={converter.options.format}
              onSelect={converter.setFormat}
            />
          </div>

          <ProgressIndicator
            progress={converter.progress}
            status={converter.isConverting ? 'converting' : converter.error ? 'error' : 'idle'}
          />

          {converter.error && (
            <div className="p-4 bg-rose-50 text-rose-800 rounded-xl border border-rose-100 text-sm">
              {converter.error}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={handleConvert}
              disabled={converter.isConverting || !converter.canConvert}
              loading={converter.isConverting}
              className="flex-1"
            >
              {converter.isConverting ? t('progress.converting') : t('actions.convert')}
            </Button>
            <Button variant="outline" onClick={converter.reset} disabled={converter.isConverting}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {converter.convertedFiles.length > 0 && (
        <div className="mt-10 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Resultados</h2>
          {converter.convertedFiles.map((result, index) => (
            <ImagePreview
              key={index}
              originalUrl={URL.createObjectURL(converter.selectedFiles[0])}
              convertedUrl={result.url}
              originalSize={converter.selectedFiles[0]?.size || 0}
              convertedSize={result.size}
              originalName={converter.selectedFiles[0]?.name || 'image'}
              format={result.format}
            />
          ))}
        </div>
      )}
    </PageLayout>
  );
}
