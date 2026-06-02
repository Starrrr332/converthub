import { useState, useRef, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useImageConverter } from '../hooks/useImageConverter';
import { PageLayout } from '../components/layout/PageLayout';
import { FileDropzone } from '../components/converter/FileDropzone';
import { FormatSelector } from '../components/converter/FormatSelector';
import { ImagePreview } from '../components/converter/ImagePreview';
import { ProgressIndicator } from '../components/converter/ProgressIndicator';
import { Button } from '../components/ui/Button';
import { Trash2, RefreshCw } from 'lucide-react';

const ITEM_HEIGHT = 64;
const OVERSCAN = 5;

export function Converter() {
  const { t } = useTranslation('converter');
  const { t: tc } = useTranslation('common');
  const converter = useImageConverter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const fileList = converter.selectedFiles;
  const fileListLength = fileList.length;

  const handleConvert = async () => {
    if (fileListLength === 1) {
      await converter.convert();
    } else {
      await converter.convertAll();
    }
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
      subtitle={`${converter.remainingConversions === Infinity ? '' : converter.remainingConversions + ' conversiones restantes hoy'}`}
      showPrivacyBanner
      breadcrumb={[{ label: tc('nav.home'), to: '/' }, { label: tc('nav.converters.image') }]}
    >
      <FileDropzone
        onFilesSelected={converter.addFiles}
        maxSize={converter.maxSize}
        disabled={converter.isConverting}
      />

      {fileListLength > 0 && (
        <div className="mt-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
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
                  className="flex items-center justify-between px-3 bg-slate-50 rounded-xl border border-slate-100"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={fileThumbnails.get(file)}
                      alt={file.name}
                      className="w-9 h-9 object-cover rounded-lg shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
                      <p className="text-xs text-slate-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
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
          </div>

          <div className="content-panel">
            <FormatSelector
              inputFormat={fileList[0]?.type || 'image/png'}
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

      {/* Contenido descriptivo para SEO */}
      <div className="mt-16 border-t border-slate-200 pt-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Convertidor de Imágenes Online Gratis
          </h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Nuestro convertidor de imágenes te permite transformar fácilmente entre los formatos más
            populares: PNG, JPG, WebP, GIF, SVG, AVIF y ICO. Todo el procesamiento se realiza
            directamente en tu navegador, garantizando que tus imágenes nunca salgan de tu
            dispositivo.
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">
            ¿Por qué usar nuestro convertidor?
          </h3>
          <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4">
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

          <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">Formatos soportados</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {['PNG', 'JPG/WebP', 'GIF', 'SVG', 'AVIF', 'ICO', 'BMP', 'TIFF'].map((format) => (
              <div
                key={format}
                className="px-3 py-2 bg-slate-100 rounded-lg text-center text-sm font-medium text-slate-700"
              >
                {format}
              </div>
            ))}
          </div>

          <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">
            Cómo convertir imágenes
          </h3>
          <ol className="list-decimal list-inside text-slate-600 space-y-2 mb-4">
            <li>Arrastra y suelta tu imagen o haz clic para seleccionarla</li>
            <li>Elige el formato de salida deseado</li>
            <li>Haz clic en "Convertir" y espera unos segundos</li>
            <li>Descarga tu imagen convertida con un solo clic</li>
          </ol>

          <div className="bg-indigo-50 rounded-xl p-6 mt-6">
            <h4 className="font-semibold text-slate-900 mb-2">
              ¿Necesitas convertir múltiples imágenes?
            </h4>
            <p className="text-slate-600 text-sm">
              Nuestro convertidor soporta procesamiento por lotes. Puedes seleccionar varias
              imágenes a la vez y convertirlas todas al mismo formato de manera rápida y eficiente.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
