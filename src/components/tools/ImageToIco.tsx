import { useState, useRef } from 'react';
import { Download, Upload, AlertTriangle, Image } from 'lucide-react';
import { Button } from '../ui/Button';

export function ImageToIco() {
  const [preview, setPreview] = useState<string | null>(null);
  const [output, setOutput] = useState<Blob | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('favicon.ico');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setOutput(null);
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona un archivo de imagen');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
    setFileName(file.name.replace(/\.[^.]+$/, '') + '.ico');
    e.target.value = '';
  };

  const convertToIco = async () => {
    if (!preview) return;
    setLoading(true);
    setError('');
    try {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Error al cargar la imagen'));
        img.src = preview;
      });

      const sizes = [16, 32, 48];
      const canvases = await Promise.all(
        sizes.map(size => {
          return new Promise<HTMLCanvasElement>((resolve) => {
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d')!;
            ctx.drawImage(img, 0, 0, size, size);
            resolve(canvas);
          });
        })
      );

      const icoBlob = await createIcoBlob(canvases);
      setOutput(icoBlob);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al convertir');
    } finally {
      setLoading(false);
    }
  };

  const createIcoBlob = async (canvases: HTMLCanvasElement[]): Promise<Blob> => {
    const buffers: ArrayBuffer[] = [];
    for (const canvas of canvases) {
      const dataUrl = canvas.toDataURL('image/png');
      const base64 = dataUrl.split(',')[1];
      const binary = atob(base64);
      const array = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        array[i] = binary.charCodeAt(i);
      }
      buffers.push(array.buffer);
    }

    const numImages = canvases.length;
    const header = new ArrayBuffer(6);
    const headerView = new DataView(header);
    headerView.setUint16(0, 0, true);
    headerView.setUint16(2, 1, true);
    headerView.setUint16(4, numImages, true);

    const entries: ArrayBuffer[] = [];
    let offset = 6 + numImages * 16;
    const sizes = [16, 32, 48];

    for (let i = 0; i < numImages; i++) {
      const entry = new ArrayBuffer(16);
      const entryView = new DataView(entry);
      entryView.setUint8(0, sizes[i]);
      entryView.setUint8(1, sizes[i]);
      entryView.setUint8(2, 0);
      entryView.setUint8(3, 0);
      entryView.setUint16(4, 1, true);
      entryView.setUint16(6, 32, true);
      entryView.setUint32(8, buffers[i].byteLength, true);
      entryView.setUint32(12, offset, true);
      entries.push(entry);
      offset += buffers[i].byteLength;
    }

    const totalSize = offset;
    const ico = new ArrayBuffer(totalSize);
    const icoView = new Uint8Array(ico);

    icoView.set(new Uint8Array(header), 0);
    let pos = header.byteLength;
    for (const entry of entries) {
      icoView.set(new Uint8Array(entry), pos);
      pos += entry.byteLength;
    }
    for (const buffer of buffers) {
      icoView.set(new Uint8Array(buffer), pos);
      pos += buffer.byteLength;
    }

    return new Blob([ico], { type: 'image/x-icon' });
  };

  const handleDownload = () => {
    if (!output) return;
    const url = URL.createObjectURL(output);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div
        onClick={() => fileRef.current?.click()}
        className="dropzone cursor-pointer"
      >
        <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <p className="text-sm text-slate-600 text-center">
          Arrastra una imagen o haz clic para seleccionar
        </p>
        <p className="text-xs text-slate-400 text-center mt-1">
          PNG, JPG, WebP, GIF
        </p>
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          accept="image/png,image/jpeg,image/webp,image/gif"
          onChange={handleFile}
        />
      </div>

      {preview && (
        <div className="flex items-center justify-center p-4 bg-slate-50 rounded-lg">
          <img src={preview} alt="Preview" className="max-h-32 rounded" />
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      <Button onClick={convertToIco} disabled={!preview || loading} className="w-full">
        <Image className="w-4 h-4" />
        {loading ? 'Convirtiendo...' : 'Convertir a ICO'}
      </Button>

      {output && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">
              ICO generado (16x16, 32x32, 48x48)
            </span>
            <button onClick={handleDownload} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              Descargar {fileName}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
