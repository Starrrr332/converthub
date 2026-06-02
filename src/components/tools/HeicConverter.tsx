import { useState, useRef, useCallback } from 'react';
import { Download, ImageIcon } from 'lucide-react';
import { Button } from '../ui/Button';

export function HeicConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState<'jpeg' | 'png'>('jpeg');
  const [quality, setQuality] = useState(0.85);
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File | undefined) => {
    if (!f) return;
    const ext = f.name.toLowerCase();
    if (!ext.endsWith('.heic') && !ext.endsWith('.heif')) {
      setError('Solo se aceptan archivos .heic o .heif');
      return;
    }
    setFile(f);
    setError('');
    setResult(null);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  const convert = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const heic2any = (await import('heic2any')).default;
      const blob = await heic2any({
        blob: file,
        toType: `image/${outputFormat}`,
        quality,
      });
      const url = URL.createObjectURL(blob as Blob);
      setResult({ blob: blob as Blob, url });
    } catch {
      setError('Error al convertir. Asegúrate de que el archivo HEIC sea válido.');
    }
    setLoading(false);
  };

  const download = () => {
    if (!result || !file) return;
    const baseName = file.name.replace(/\.heic$/i, '').replace(/\.heif$/i, '');
    const ext = outputFormat === 'jpeg' ? 'jpg' : 'png';
    const a = document.createElement('a');
    a.href = result.url;
    a.download = `${baseName}.${ext}`;
    a.click();
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">HEIC a JPG / PNG</h3>
      <p className="text-sm text-text-secondary mb-4">
        Convierte fotos HEIC de Apple a formato estándar.
      </p>

      <label
        className={`dropzone flex flex-col items-center justify-center h-32 cursor-pointer mb-4 ${dragOver ? 'dropzone-active' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
      >
        <ImageIcon className="w-8 h-8 text-text-muted mb-2" />
        <p className="text-sm text-text-secondary">
          {file ? file.name : 'Arrastra un archivo .heic o .heif'}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept=".heic,.heif"
          onChange={(e) => handleFile(e.target.files?.[0])}
          className="hidden"
        />
      </label>

      <div className="flex items-center gap-4 mb-4">
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">
            Formato de salida
          </label>
          <div className="flex gap-1.5">
            {(['jpeg', 'png'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setOutputFormat(fmt)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  outputFormat === fmt
                    ? 'bg-brand-600 text-white'
                    : 'bg-surface-secondary text-text-secondary'
                }`}
              >
                {fmt.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {outputFormat === 'jpeg' && (
          <div className="flex-1">
            <label className="block text-xs font-medium text-text-muted mb-1">
              Calidad: {Math.round(quality * 100)}%
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full"
            />
          </div>
        )}
      </div>

      {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm mb-4">{error}</div>}

      <Button onClick={convert} disabled={!file || loading}>
        {loading ? 'Convirtiendo...' : 'Convertir'}
      </Button>

      {result && (
        <div className="mt-4">
          <p className="text-sm text-green-700 font-medium mb-2">Conversión exitosa</p>
          <div className="mb-3 rounded-lg overflow-hidden border border-border bg-surface-secondary">
            <img src={result.url} alt="Preview" className="max-h-64 mx-auto object-contain" />
          </div>
          <Button onClick={download} size="sm">
            <Download className="w-4 h-4 mr-1" /> Descargar
          </Button>
        </div>
      )}
    </div>
  );
}
