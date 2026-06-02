import { useState, useRef, useCallback, useEffect } from 'react';
import { Download, Plus, X } from 'lucide-react';
import { Button } from '../ui/Button';

interface CollageImage {
  file: File;
  url: string;
  img: HTMLImageElement;
}

export function CollageMaker() {
  const [images, setImages] = useState<CollageImage[]>([]);
  const [columns, setColumns] = useState(2);
  const [rows, setRows] = useState(2);
  const [gap, setGap] = useState(10);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [dragOver, setDragOver] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const maxSlots = columns * rows;

  const loadImages = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files).filter(f => f.type.startsWith('image/'));
    setImages(prev => {
      const remaining = maxSlots - prev.length;
      const toAdd = arr.slice(0, remaining);
      const newImages: CollageImage[] = [...prev];

      for (const file of toAdd) {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.src = url;
        newImages.push({ file, url, img });
      }
      return newImages;
    });
  }, [maxSlots]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    loadImages(e.dataTransfer.files);
  }, [loadImages]);

  const removeImage = (index: number) => {
    setImages(prev => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };

  useEffect(() => {
    return () => {
      images.forEach(img => URL.revokeObjectURL(img.url));
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellW = 300;
    const cellH = 300;
    canvas.width = columns * cellW + (columns + 1) * gap;
    canvas.height = rows * cellH + (rows + 1) * gap;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < Math.min(images.length, maxSlots); i++) {
      const row = Math.floor(i / columns);
      const col = i % columns;
      const x = gap + col * (cellW + gap);
      const y = gap + row * (cellH + gap);

      const img = images[i].img;
      if (!img.complete || !img.naturalWidth) continue;

      const imgRatio = img.naturalWidth / img.naturalHeight;
      const cellRatio = cellW / cellH;

      let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
      if (imgRatio > cellRatio) {
        sw = img.naturalHeight * cellRatio;
        sx = (img.naturalWidth - sw) / 2;
      } else {
        sh = img.naturalWidth / cellRatio;
        sy = (img.naturalHeight - sh) / 2;
      }

      ctx.drawImage(img, sx, sy, sw, sh, x, y, cellW, cellH);
    }
  }, [images, columns, rows, gap, bgColor, maxSlots]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob(blob => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'collage.png';
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Collage Maker</h3>

      <label
        className={`dropzone flex flex-col items-center justify-center h-28 cursor-pointer mb-4 ${dragOver ? 'dropzone-active' : ''}`}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
      >
        <Plus className="w-6 h-6 text-text-muted mb-1" />
        <p className="text-sm text-text-secondary">
          Arrastra imágenes ({images.length}/{maxSlots})
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={e => { if (e.target.files) loadImages(e.target.files); }}
          className="hidden"
        />
      </label>

      {images.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {images.map((img, i) => (
            <div key={i} className="relative group w-16 h-16 rounded-lg overflow-hidden border border-border">
              <img src={img.url} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => removeImage(i)}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">Columnas</label>
          <input
            type="number"
            min={1}
            max={6}
            value={columns}
            onChange={e => setColumns(Number(e.target.value))}
            className="input-field text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">Filas</label>
          <input
            type="number"
            min={1}
            max={6}
            value={rows}
            onChange={e => setRows(Number(e.target.value))}
            className="input-field text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">Espacio: {gap}px</label>
          <input
            type="range"
            min={0}
            max={50}
            value={gap}
            onChange={e => setGap(Number(e.target.value))}
            className="w-full mt-1"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">Fondo</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={bgColor}
              onChange={e => setBgColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border-0"
            />
            <span className="text-xs font-mono text-text-secondary">{bgColor}</span>
          </div>
        </div>
      </div>

      <div className="mb-4 overflow-x-auto">
        <canvas ref={canvasRef} className="border border-border rounded-lg max-w-full" />
      </div>

      {images.length > 0 && (
        <Button onClick={download}>
          <Download className="w-4 h-4 mr-1" /> Descargar Collage
        </Button>
      )}
    </div>
  );
}
