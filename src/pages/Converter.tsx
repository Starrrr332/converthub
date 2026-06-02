import { useState, useRef, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useImageConverter } from '../hooks/useImageConverter';
import { PageLayout } from '../components/layout/PageLayout';
import { FileDropzone } from '../components/converter/FileDropzone';
import { FormatSelector } from '../components/converter/FormatSelector';
import { ImagePreview } from '../components/converter/ImagePreview';
import { ProgressIndicator } from '../components/converter/ProgressIndicator';
import { UpgradeModal } from '../components/ui/UpgradeModal';
import { Button } from '../components/ui/Button';
import { Trash2, RefreshCw, Crown, AlertTriangle } from 'lucide-react';
import type { ImageFormat } from '../types';

const ITEM_HEIGHT = 64;
const OVERSCAN = 5;

export function Converter() {
  const { t } = useTranslation('converter');
  const { t: tc } = useTranslation('common');
  const converter = useImageConverter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState<string | undefined>();

  const fileList = converter.selectedFiles;
  const fileListLength = fileList.length;

  const handleConvert = async () => {
    if (!converter.canConvert) {
      setUpgradeFeature('límite diario de conversiones');
      setShowUpgradeModal(true);
      return;
    }

    if (fileListLength === 1) {
      await converter.convert();
    } else {
      await converter.convertAll();
    }
  };

  const handleFormatSelect = (format: ImageFormat) => {
    // The hook already validates format support internally
    converter.setFormat(format);
  };

  const onScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (el) setScrollTop(el.scrollTop);
  }, []);

  const containerHeight = 320;
  const totalHeight = fileListLength * ITEM_HEIGHT;
  const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - OVERSCAN);
  const endIndex = Math.min(
    fileListLength,
    Math.ceil((scrollTop + containerHeight) / ITEM_HEIGHT) + OVERSCAN,
  );
  const visibleFiles = useMemo(
    () => fileList.slice(startIndex, endIndex).map((file, i) => ({ file, index: startIndex + i })),
    [fileList, startIndex, endIndex],
  );

  const fileThumbnails = useMemo(() => {
    const thumbs = new Map<File, string>();
    for (const file of fileList) {
      thumbs.set(file, URL.createObjectURL(file));
    }
    return thumbs;
  }, [fileList]);

  return (
    <PageLayout
      title={t('actions.convert')}
      description="Convierte imágenes online gratis entre PNG, JPG, WebP, GIF, SVG, AVIF e ICO. Procesamiento 100% local en tu navegador, sin límites."
      subtitle={`${converter.remainingConversions === Infinity ? t('limits.premiumUnlimited') : t('limits.remaining', { count: converter.remainingConversions })}`}
      showPrivacyBanner
      breadcrumb={[{ label: tc('nav.home'), to: '/' }, { label: tc('nav.converters.image') }]}
    >
      {/* Premium banner for free users */}
      {!converter.isPremium && (
        <div className="mb-6 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-500" />
            <p className="text-sm text-amber-800">
              <span className="font-semibold">{t('premiumBanner.text')}</span> {t('premiumBanner.desc')}
            </p>
          </div>
          <a
            href="/pricing"
            className="shrink-0 px-4 py-1.5 bg-amber-500 text-white text-xs font-bold rounded-lg hover:bg-amber-600 transition-colors"
          >
            {t('premiumBanner.cta')}
          </a>
        </div>
      )}

      <FileDropzone
        onFilesSelected={converter.addFiles}
        maxSize={converter.maxSize}
        disabled={converter.isConverting}
        isPremium={converter.isPremium}
      />

      {fileListLength > 0 && (
        <div className="mt-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text">
              {t('batch.filesSelected', { count: fileListLength })}
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

          <div
            ref={scrollContainerRef}
            onScroll={onScroll}
            style={{
              height: fileListLength * ITEM_HEIGHT > containerHeight ? containerHeight : undefined,
            }}
            className={
              fileListLength * ITEM_HEIGHT > containerHeight
                ? 'overflow-y-auto rounded-xl'
                : 'space-y-2'
            }
          >
            <div style={{ height: totalHeight, position: 'relative' }}>
              {visibleFiles.map(({ file, index }) => (
                <div
                  key={`${file.name}-${index}`}
                  style={{
                    position: 'absolute',
                    top: index * ITEM_HEIGHT,
                    left: 0,
                    right: 0,
                    height: ITEM_HEIGHT,
                  }}
                  className="flex items-center justify-between px-3 bg-surface-secondary rounded-xl border border-border"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={fileThumbnails.get(file)}
                      alt={file.name}
                      className="w-9 h-9 object-cover rounded-lg shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text truncate">{file.name}</p>
                      <p className="text-xs text-text-muted">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => converter.removeFile(index)}
                    className="p-2 text-text-muted hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                    disabled={converter.isConverting}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="content-panel">
            <FormatSelector
              inputFormat={fileList[0]?.type || 'image/png'}
              selectedFormat={converter.options.format}
              onSelect={handleFormatSelect}
              isPremium={converter.isPremium}
            />
          </div>

          {/* Limit warning */}
          {!converter.isPremium && converter.remainingConversions < 10 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-sm text-amber-800">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
              <span>
                {t('limits.fewLeft', { count: converter.remainingConversions })} {' '}
                <a href="/pricing" className="underline font-medium">{t('limits.upgradeLink')}</a>
              </span>
            </div>
          )}

          <ProgressIndicator
            progress={converter.progress}
            status={converter.isConverting ? 'converting' : converter.error ? 'error' : 'idle'}
          />

          {converter.error && (
            <div className="p-4 bg-red-50 text-red-800 rounded-xl border border-red-100 text-sm">
              {converter.error}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={handleConvert}
              disabled={converter.isConverting || fileListLength === 0}
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
          <h2 className="text-lg font-semibold text-text">Resultados</h2>
          {converter.convertedFiles.map((result, index) => (
            <ImagePreview
              key={index}
              originalUrl={URL.createObjectURL(fileList[0])}
              convertedUrl={result.url}
              originalSize={fileList[0]?.size || 0}
              convertedSize={result.size}
              originalName={fileList[0]?.name || 'image'}
              format={result.format}
            />
          ))}
        </div>
      )}

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature={upgradeFeature}
      />

      {/* SEO Content */}
      <div className="mt-16 border-t border-border pt-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-text mb-4">
            Convertidor de Imágenes Online Gratis
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            Nuestro convertidor de imágenes te permite transformar fácilmente entre los formatos más
            populares: PNG, JPG, WebP, GIF, SVG, AVIF y ICO. Todo el procesamiento se realiza
            directamente en tu navegador, garantizando que tus imágenes nunca salgan de tu
            dispositivo.
          </p>

          <h3 className="text-xl font-semibold text-text mb-3 mt-6">
            ¿Por qué usar nuestro convertidor?
          </h3>
          <ul className="list-disc list-inside text-text-secondary space-y-2 mb-4">
            <li>
              <strong>Privacidad total:</strong> Tus archivos se procesan localmente en tu
              navegador. No se suben a ningún servidor.
            </li>
            <li>
              <strong>Sin límites:</strong> Convierte tantas imágenes como necesites, sin
              restricciones de tamaño o cantidad.
            </li>
            <li>
              <strong>Rápido y eficiente:</strong> Obtén tus imágenes convertidas en segundos
              gracias al procesamiento moderno del navegador.
            </li>
            <li>
              <strong>Gratis:</strong> No hay costos ocultos, no se requiere registro y todas las
              funciones están disponibles.
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-text mb-3 mt-6">Formatos soportados</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {['PNG', 'JPG/WebP', 'GIF', 'SVG', 'AVIF', 'ICO', 'BMP', 'TIFF'].map((format) => (
              <div
                key={format}
                className="px-3 py-2 bg-surface-secondary rounded-lg text-center text-sm font-medium text-text"
              >
                {format}
              </div>
            ))}
          </div>

          <h3 className="text-xl font-semibold text-text mb-3 mt-6">
            Cómo convertir imágenes
          </h3>
          <ol className="list-decimal list-inside text-text-secondary space-y-2 mb-4">
            <li>Arrastra y suelta tu imagen o haz clic para seleccionarla</li>
            <li>Elige el formato de salida deseado</li>
            <li>Haz clic en "Convertir" y espera unos segundos</li>
            <li>Descarga tu imagen convertida con un solo clic</li>
          </ol>

          <div className="bg-brand-50 rounded-xl p-6 mt-6">
            <h4 className="font-semibold text-text mb-2">
              ¿Necesitas convertir múltiples imágenes?
            </h4>
            <p className="text-text-secondary text-sm">
              Nuestro convertidor soporta procesamiento por lotes. Puedes seleccionar varias
              imágenes a la vez y convertirlas todas al mismo formato de manera rápida y eficiente.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
