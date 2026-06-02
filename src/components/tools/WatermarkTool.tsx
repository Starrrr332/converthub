import { useState, useRef, useCallback } from 'react';
import { Download, Upload, AlertTriangle, Droplets } from 'lucide-react';
import { Button } from '../ui/Button';

type Position =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'middle-left'
  | 'center'
  | 'middle-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

const POSITIONS: { value: Position; label: string }[] = [
  { value: 'top-left', label: '↗' },
  { value: 'top-center', label: '↑' },
  { value: 'top-right', label: '↖' },
  { value: 'middle-left', label: '→' },
  { value: 'center', label: '●' },
  { value: 'middle-right', label: '←' },
  { value: 'bottom-left', label: '↘' },
  { value: 'bottom-center', label: '↓' },
  { value: 'bottom-right', label: '↙' },
];

export function WatermarkTool() {
  const [preview, setPreview] = useState<string | null>(null);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('© ConvertHub');
  const [fontSize, setFontSize] = useState(24);
  const [opacity, setOpacity] = useState(30);
  const [position, setPosition] = useState<Position>('bottom-right');
  const [color, setColor] = useState('#ffffff');
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
    e.target.value = '';
  };

  const getPosition = (canvas: HTMLCanvasElement, textWidth: number, textHeight: number) => {
    const padding = 20;
    const positions: Record<Position, { x: number; y: number }> = {
      'top-left': { x: padding, y: padding + textHeight },
      'top-center': { x: (canvas.width - textWidth) / 2, y: padding + textHeight },
      'top-right': { x: canvas.width - textWidth - padding, y: padding + textHeight },
      'middle-left': { x: padding, y: canvas.height / 2 },
      center: { x: (canvas.width - textWidth) / 2, y: canvas.height / 2 },
      'middle-right': { x: canvas.width - textWidth - padding, y: canvas.height / 2 },
      'bottom-left': { x: padding, y: canvas.height - padding },
      'bottom-center': { x: (canvas.width - textWidth) / 2, y: canvas.height - padding },
      'bottom-right': { x: canvas.width - textWidth - padding, y: canvas.height - padding },
    };
    return positions[position];
  };

  const applyWatermark = useCallback(async () => {
    if (!preview || !text.trim()) return;
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

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);

      ctx.globalAlpha = opacity / 100;
      ctx.fillStyle = color;
      ctx.font = `bold ${fontSize}px Arial, sans-serif`;
      ctx.textBaseline = 'bottom';

      const metrics = ctx.measureText(text);
      const textWidth = metrics.width;
      const textHeight = fontSize;

      const pos = getPosition(canvas, textWidth, textHeight);
      ctx.fillText(text, pos.x, pos.y);

      const dataUrl = canvas.toDataURL('image/png');
      setOutput(dataUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al agregar marca de agua');
    } finally {
      setLoading(false);
    }
  }, [preview, text, fontSize, opacity, position, color]);

  const handleDownload = () => {
    if (!output) return;
    const a = document.createElement('a');
    a.href = output;
    a.download = 'watermarked.png';
    a.click();
  };

  return (
    <div className="space-y-4">
      <div onClick={() => fileRef.current?.click()} className="dropzone cursor-pointer">
        <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <p className="text-sm text-slate-600 text-center">
          Arrastra una imagen o haz clic para seleccionar
        </p>
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFile}
          multiple={false}
        />
      </div>

      {preview && (
        <div className="flex items-center justify-center p-4 bg-slate-50 rounded-lg">
          <img src={output || preview} alt="Preview" className="max-h-48 rounded" />
        </div>
      )}

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Texto del watermark
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="input-field w-full"
            placeholder="© Tu Marca"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tamaño: {fontSize}px
            </label>
            <input
              type="range"
              min="12"
              max="72"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Opacidad: {opacity}%
            </label>
            <input
              type="range"
              min="5"
              max="100"
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-10 h-10 rounded cursor-pointer border-0"
            />
            <span className="text-sm text-slate-500">{color}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Posición</label>
          <div className="grid grid-cols-3 gap-1 w-fit">
            {POSITIONS.map((pos) => (
              <button
                key={pos.value}
                onClick={() => setPosition(pos.value)}
                className={`w-10 h-10 rounded text-sm font-medium transition-colors ${
                  position === pos.value
                    ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {pos.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      <Button
        onClick={applyWatermark}
        disabled={!preview || !text.trim() || loading}
        className="w-full"
      >
        <Droplets className="w-4 h-4" />
        {loading ? 'Aplicando...' : 'Agregar Marca de Agua'}
      </Button>

      {output && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Imagen con marca de agua</span>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Descargar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
