import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Download, Image, Percent, ZoomIn, FileDown } from 'lucide-react';
import { PageLayout } from '../components/layout/PageLayout';

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

export function ImageCompressorPage() {
  const { t } = useTranslation('common');
  const [original, setOriginal] = useState<{ file: File; url: string; size: number } | null>(null);
  const [compressed, setCompressed] = useState<{ blob: Blob; url: string; size: number } | null>(null);
  const [quality, setQuality] = useState(80);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [maxHeight, setMaxHeight] = useState(1920);
  const [loading, setLoading] = useState(false);

  const handleFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setOriginal({ file, url: URL.createObjectURL(file), size: file.size });
    setCompressed(null);
  }, []);

  const compress = useCallback(async () => {
    if (!original) return;
    setLoading(true);
    try {
      const imageCompression = await import('browser-image-compression');
      const options = {
        maxSizeMB: 10,
        maxWidthOrHeight: Math.max(maxWidth, maxHeight),
        useWebWorker: true,
        quality: quality / 100,
        fileType: original.file.type as any,
      };
      const blob = await imageCompression.default(original.file, options as any);
      setCompressed({ blob, url: URL.createObjectURL(blob), size: blob.size });
    } catch (err) {
      console.error('Compression error:', err);
    }
    setLoading(false);
  }, [original, quality, maxWidth, maxHeight]);

  const download = () => {
    if (!compressed) return;
    const a = document.createElement('a');
    a.href = compressed.url;
    a.download = `compressed_${original?.file.name || 'image'}`;
    a.click();
  };

  return (
    <PageLayout
      title="Compresor de Imágenes"
      subtitle="Reduce el tamaño de tus imágenes sin perder calidad notable."
      breadcrumb={[{ label: 'Inicio', to: '/' }, { label: 'Compresor de Imágenes' }]}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {!original ? (
          <label className="dropzone flex flex-col items-center justify-center h-48 cursor-pointer">
            <Upload className="w-8 h-8 mb-2 text-text-muted" />
            <p className="text-sm text-text-secondary">Arrastra una imagen o haz clic para seleccionar</p>
            <p className="text-xs text-text-muted mt-1">PNG, JPG, WebP</p>
            <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
          </label>
        ) : (
          <div className="space-y-4">
            <div className="card p-4">
              <img src={original.url} alt="Original" className="max-h-48 rounded-lg mx-auto" />
              <p className="text-sm text-text-secondary text-center mt-2">
                <Image className="w-4 h-4 inline mr-1" />
                {original.file.name} — {formatSize(original.size)}
              </p>
            </div>

            <div className="card p-4 space-y-4">
              <div>
                <label className="flex items-center justify-between text-sm font-medium">
                  <Percent className="w-4 h-4 mr-1" /> Calidad: {quality}%
                </label>
                <input type="range" min="10" max="100" value={quality} onChange={e => setQuality(Number(e.target.value))} className="w-full" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium flex items-center"><ZoomIn className="w-4 h-4 mr-1" /> Ancho máx</label>
                  <input type="number" min="100" max="10000" value={maxWidth} onChange={e => setMaxWidth(Number(e.target.value))} className="input-field w-full" />
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center"><ZoomIn className="w-4 h-4 mr-1" /> Alto máx</label>
                  <input type="number" min="100" max="10000" value={maxHeight} onChange={e => setMaxHeight(Number(e.target.value))} className="input-field w-full" />
                </div>
              </div>
              <button onClick={compress} disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading ? <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <Download className="w-4 h-4" />}
                {loading ? 'Comprimiendo...' : 'Comprimir imagen'}
              </button>
            </div>

            {compressed && (
              <div className="card p-4 space-y-4">
                <img src={compressed.url} alt="Compressed" className="max-h-48 rounded-lg mx-auto" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">
                    Original: {formatSize(original.size)}
                  </span>
                  <span className="text-green-600 font-medium">
                    Comprimido: {formatSize(compressed.size)} ({Math.round((1 - compressed.size / original.size) * 100)}% menor)
                  </span>
                </div>
                <button onClick={download} className="btn-primary w-full flex items-center justify-center gap-2">
                  <FileDown className="w-4 h-4" /> Descargar imagen comprimida
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
