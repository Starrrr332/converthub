import { useState } from 'react';
import { Upload, Check, X } from 'lucide-react';

export function QrScanTool() {
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResult('');
    setError('');

    try {
      const jsQR = (await import('jsqr')).default;
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          setResult(code.data);
        } else {
          setError('No se encontró ningún código QR en la imagen.');
        }
        URL.revokeObjectURL(url);
      };
      img.onerror = () => setError('Error al cargar la imagen.');
      img.src = url;
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(result);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Lector QR</h3>
      <p className="text-sm text-text-secondary mb-4">
        Sube una imagen que contenga un código QR para extraer su contenido.
      </p>
      <label className="dropzone flex flex-col items-center justify-center h-36 cursor-pointer mb-4">
        <Upload className="w-6 h-6 mb-1 text-text-muted" />
        <p className="text-xs text-text-secondary">Selecciona una imagen con QR</p>
        <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </label>
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          <X className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}
      {result && (
        <div className="card p-4 space-y-3">
          <div className="flex items-center gap-2 text-green-600">
            <Check className="w-5 h-5" />
            <span className="font-medium">QR detectado</span>
          </div>
          <textarea readOnly value={result} className="input-field w-full h-24 font-mono text-sm" />
          <button onClick={copy} className="btn-primary text-sm px-4 py-2">
            Copiar resultado
          </button>
        </div>
      )}
    </div>
  );
}
