import { useTranslation } from 'react-i18next';
import { useImageConverter } from '../hooks/useImageConverter';
import { FileDropzone } from '../components/converter/FileDropzone';
import { FormatSelector } from '../components/converter/FormatSelector';
import { ImagePreview } from '../components/converter/ImagePreview';
import { ProgressIndicator } from '../components/converter/ProgressIndicator';
import { PrivacyBanner } from '../components/converter/PrivacyBanner';
import { Button } from '../components/ui/Button';
import { Trash2, RefreshCw } from 'lucide-react';

export function Converter() {
  const { t } = useTranslation('converter');
  const converter = useImageConverter();
  
  const handleConvert = async () => {
    if (converter.selectedFiles.length === 1) {
      await converter.convert();
    } else {
      await converter.convertAll();
    }
  };
  
  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('actions.convert')}
          </h1>
          <p className="text-gray-600">
            {converter.isPremium ? 'Premium: Sin límites' : `${converter.remainingConversions} conversiones restantes hoy`}
          </p>
        </div>
        
        {/* Privacy Banner */}
        <div className="mb-6">
          <PrivacyBanner />
        </div>
        
        {/* Dropzone */}
        <div className="mb-6">
          <FileDropzone
            onFilesSelected={converter.addFiles}
            isPremium={converter.isPremium}
            maxSize={converter.maxSize}
            disabled={converter.isConverting}
          />
        </div>
        
        {/* Selected Files */}
        {converter.selectedFiles.length > 0 && (
          <div className="mb-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {t('batch.filesSelected', { count: converter.selectedFiles.length })}
              </h3>
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
            
            {/* File list */}
            <div className="space-y-2">
              {converter.selectedFiles.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => converter.removeFile(index)}
                    className="text-gray-400 hover:text-red-500"
                    disabled={converter.isConverting}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            
            {/* Format Selector */}
            <div className="p-4 bg-white rounded-lg shadow">
              <FormatSelector
                inputFormat={converter.selectedFiles[0]?.type || 'image/png'}
                isPremium={converter.isPremium}
                selectedFormat={converter.options.format}
                onSelect={converter.setFormat}
              />
            </div>
            
            {/* Progress */}
            <ProgressIndicator
              progress={converter.progress}
              status={converter.isConverting ? 'converting' : converter.error ? 'error' : 'idle'}
            />
            
            {/* Error */}
            {converter.error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-lg">
                {converter.error}
              </div>
            )}
            
            {/* Actions */}
            <div className="flex gap-4">
              <Button
                onClick={handleConvert}
                disabled={converter.isConverting || !converter.canConvert}
                loading={converter.isConverting}
                className="flex-1"
              >
                {converter.isConverting ? t('progress.converting') : t('actions.convert')}
              </Button>
              <Button
                variant="outline"
                onClick={converter.reset}
                disabled={converter.isConverting}
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
        
        {/* Converted Files */}
        {converter.convertedFiles.length > 0 && (
          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Resultados
            </h3>
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
      </div>
    </div>
  );
}
