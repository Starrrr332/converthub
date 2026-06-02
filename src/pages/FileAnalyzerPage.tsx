import { useState, useCallback } from 'react';
import { Upload, FileText, Hash, Ruler, Tag, Calendar, Info } from 'lucide-react';
import { PageLayout } from '../components/layout/PageLayout';

const FILE_TYPE_COLORS: Record<string, string> = {
  'image/jpeg': 'text-blue-600 bg-blue-50',
  'image/png': 'text-purple-600 bg-purple-50',
  'image/gif': 'text-pink-600 bg-pink-50',
  'image/webp': 'text-cyan-600 bg-cyan-50',
  'image/svg+xml': 'text-orange-600 bg-orange-50',
  'application/pdf': 'text-red-600 bg-red-50',
  'application/json': 'text-emerald-600 bg-emerald-50',
  'text/html': 'text-orange-600 bg-orange-50',
  'text/plain': 'text-slate-600 bg-slate-50',
  'audio/mpeg': 'text-violet-600 bg-violet-50',
  'video/mp4': 'text-amber-600 bg-amber-50',
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function formatHex(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf.slice(0, 16));
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join(' ');
}

export function FileAnalyzerPage() {
  const [fileInfo, setFileInfo] = useState<{
    name: string;
    size: number;
    type: string;
    lastModified: Date;
    mimeType: string;
    hexSignature: string;
    dimensions?: string;
    lines?: number;
    words?: number;
    chars?: number;
  } | null>(null);
  const [error, setError] = useState('');

  const handleFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');

    try {
      const { fileTypeFromBuffer } = await import('file-type');
      const buf = await file.arrayBuffer();
      const detected = await fileTypeFromBuffer(buf);

      let dimensions: string | undefined;
      if (file.type.startsWith('image/')) {
        const img = new Image();
        const url = URL.createObjectURL(file);
        await new Promise<void>((resolve, reject) => {
          img.onload = () => {
            dimensions = `${img.naturalWidth} × ${img.naturalHeight} px`;
            URL.revokeObjectURL(url);
            resolve();
          };
          img.onerror = reject;
          img.src = url;
        });
      }

      let lines: number | undefined;
      let words: number | undefined;
      let chars: number | undefined;
      if (file.type.startsWith('text/') || file.type === 'application/json') {
        const text = await file.text();
        lines = text.split('\n').length;
        words = text.split(/\s+/).filter(Boolean).length;
        chars = text.length;
      }

      setFileInfo({
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: new Date(file.lastModified),
        mimeType: detected?.mime || file.type || 'Desconocido',
        hexSignature: formatHex(buf),
        dimensions,
        lines,
        words,
        chars,
      });
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);

  return (
    <PageLayout
      title="Analizador de Archivos"
      subtitle="Inspecciona metadatos, tipo MIME, firma hexadecimal y más de cualquier archivo."
      breadcrumb={[{ label: 'Inicio', to: '/' }, { label: 'Analizador de Archivos' }]}
    >
      <div className="max-w-2xl mx-auto">
        {!fileInfo ? (
          <label className="dropzone flex flex-col items-center justify-center h-48 cursor-pointer">
            <Upload className="w-8 h-8 mb-2 text-text-muted" />
            <p className="text-sm text-text-secondary">
              Arrastra cualquier archivo o haz clic para analizar
            </p>
            <p className="text-xs text-text-muted mt-1">Se analiza localmente — nunca se sube</p>
            <input type="file" onChange={handleFile} className="hidden" />
          </label>
        ) : (
          <div className="space-y-3">
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <div className="card p-5 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-border">
                <div
                  className={`p-2.5 rounded-xl ${FILE_TYPE_COLORS[fileInfo.type] || 'text-slate-600 bg-slate-50'}`}
                >
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-text">{fileInfo.name}</p>
                  <p className="text-xs text-text-muted">{fileInfo.mimeType}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <Ruler className="w-4 h-4 text-text-muted mt-0.5" />
                  <div>
                    <p className="text-xs text-text-muted">Tamaño</p>
                    <p className="text-sm font-medium">{formatSize(fileInfo.size)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Tag className="w-4 h-4 text-text-muted mt-0.5" />
                  <div>
                    <p className="text-xs text-text-muted">Tipo MIME</p>
                    <p className="text-sm font-medium break-all">{fileInfo.mimeType}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-text-muted mt-0.5" />
                  <div>
                    <p className="text-xs text-text-muted">Última modificación</p>
                    <p className="text-sm font-medium">
                      {fileInfo.lastModified.toLocaleDateString()}{' '}
                      {fileInfo.lastModified.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Hash className="w-4 h-4 text-text-muted mt-0.5" />
                  <div>
                    <p className="text-xs text-text-muted">Firma hexadecimal</p>
                    <p className="text-xs font-mono font-medium break-all">
                      {fileInfo.hexSignature}
                    </p>
                  </div>
                </div>
              </div>

              {fileInfo.dimensions && (
                <div className="flex items-start gap-2 bg-surface-secondary rounded-lg p-3">
                  <Info className="w-4 h-4 text-text-muted mt-0.5" />
                  <div>
                    <p className="text-xs text-text-muted">Dimensiones</p>
                    <p className="text-sm font-medium">{fileInfo.dimensions}</p>
                  </div>
                </div>
              )}

              {fileInfo.lines !== undefined && (
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-surface-secondary rounded-lg p-3 text-center">
                    <p className="text-xs text-text-muted">Líneas</p>
                    <p className="text-lg font-semibold">{fileInfo.lines}</p>
                  </div>
                  <div className="bg-surface-secondary rounded-lg p-3 text-center">
                    <p className="text-xs text-text-muted">Palabras</p>
                    <p className="text-lg font-semibold">{fileInfo.words}</p>
                  </div>
                  <div className="bg-surface-secondary rounded-lg p-3 text-center">
                    <p className="text-xs text-text-muted">Caracteres</p>
                    <p className="text-lg font-semibold">{fileInfo.chars}</p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setFileInfo(null);
              }}
              className="text-sm text-brand-600 hover:underline"
            >
              Analizar otro archivo
            </button>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
