import { useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Download, RotateCw, RotateCcw, FlipHorizontal, FlipVertical, Crop, SunMedium, Droplets, Undo2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PageLayout } from '../components/layout/PageLayout';

type Tool = 'resize' | 'rotate' | 'flip' | 'crop' | 'filters' | 'compress';

interface FilterOptions {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  sharpen: number;
  grayscale: boolean;
  sepia: boolean;
  invert: boolean;
}

const defaultFilters: FilterOptions = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  sharpen: 0,
  grayscale: false,
  sepia: false,
  invert: false,
};

export function ImageEditorPage() {
  const { t } = useTranslation('common');
  const [selectedTool, setSelectedTool] = useState<Tool>('resize');
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [rotateAngle, setRotateAngle] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const [quality, setQuality] = useState(80);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const aspectRatio = useRef(1);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImage(file);
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    
    const img = new Image();
    img.onload = () => {
      setOriginalImage(img);
      setWidth(img.width);
      setHeight(img.height);
      aspectRatio.current = img.width / img.height;
    };
    img.src = url;
  };

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth);
    if (maintainAspect) {
      setHeight(Math.round(newWidth / aspectRatio.current));
    }
  };

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight);
    if (maintainAspect) {
      setWidth(Math.round(newHeight * aspectRatio.current));
    }
  };

  const getFilterString = useCallback(() => {
    const parts: string[] = [];
    if (filters.brightness !== 100) parts.push(`brightness(${filters.brightness}%)`);
    if (filters.contrast !== 100) parts.push(`contrast(${filters.contrast}%)`);
    if (filters.saturation !== 100) parts.push(`saturate(${filters.saturation}%)`);
    if (filters.blur > 0) parts.push(`blur(${filters.blur}px)`);
    if (filters.grayscale) parts.push('grayscale(100%)');
    if (filters.sepia) parts.push('sepia(100%)');
    if (filters.invert) parts.push('invert(100%)');
    return parts.length > 0 ? parts.join(' ') : 'none';
  }, [filters]);

  const handleDownload = () => {
    if (!originalImage) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = width;
    canvas.height = height;
    
    ctx.filter = getFilterString();
    ctx.translate(width / 2, height / 2);
    ctx.rotate((rotateAngle * Math.PI) / 180);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    
    const drawWidth = rotateAngle % 180 === 0 ? width : height;
    const drawHeight = rotateAngle % 180 === 0 ? height : width;
    ctx.drawImage(originalImage, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `edited-${image?.name || 'image.png'}`;
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png', quality / 100);
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    setRotateAngle(0);
    setFlipH(false);
    setFlipV(false);
  };

  const tools = [
    { id: 'resize' as Tool, icon: <Crop className="w-5 h-5" />, label: 'Redimensionar' },
    { id: 'rotate' as Tool, icon: <RotateCw className="w-5 h-5" />, label: 'Rotar' },
    { id: 'flip' as Tool, icon: <FlipHorizontal className="w-5 h-5" />, label: 'Voltear' },
    { id: 'filters' as Tool, icon: <SunMedium className="w-5 h-5" />, label: 'Filtros' },
    { id: 'compress' as Tool, icon: <Droplets className="w-5 h-5" />, label: 'Calidad' },
  ];

  return (
    <PageLayout
      wide
      title={t('nav.editors.image')}
      subtitle={t('nav.editors.imageDesc')}
      breadcrumb={[{ label: t('nav.home'), to: '/' }, { label: t('nav.editors.image') }]}
    >
        {!image ? (
          <div className="dropzone p-12">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600 mb-2">Arrastra una imagen aquí</p>
              <p className="text-sm text-gray-400">PNG, JPG, WebP, GIF - Sin límite de tamaño</p>
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tool Selector */}
            <div className="lg:col-span-1">
              <div className="content-panel p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Herramientas</h3>
                <div className="space-y-2">
                  {tools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => setSelectedTool(tool.id)}
                      className={`w-full p-3 rounded-lg flex items-center gap-3 transition-all ${
                        selectedTool === tool.id
                          ? 'bg-indigo-50 text-indigo-700 border-2 border-indigo-500'
                          : 'hover:bg-slate-50 border-2 border-transparent'
                      }`}
                    >
                      {tool.icon}
                      <span className="font-medium">{tool.label}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t space-y-2">
                  <Button onClick={resetFilters} variant="outline" className="w-full">
                    <Undo2 className="w-4 h-4 mr-2" />
                    Restablecer
                  </Button>
                  <Button onClick={() => { setImage(null); setImageUrl(null); setOriginalImage(null); }} variant="ghost" className="w-full">
                    Nueva imagen
                  </Button>
                </div>
              </div>
            </div>

            {/* Editor */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6">
                {/* Preview */}
                <div className="mb-6 bg-gray-100 rounded-lg p-4 flex items-center justify-center min-h-[300px]">
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="max-w-full max-h-[400px] object-contain"
                      style={{
                        transform: `rotate(${rotateAngle}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
                        filter: getFilterString()
                      }}
                    />
                  )}
                </div>

                {/* Tool Options */}
                <div className="space-y-4">
                  {selectedTool === 'resize' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ancho (px)</label>
                        <input
                          type="number"
                          value={width}
                          onChange={(e) => handleWidthChange(Number(e.target.value))}
                          className="w-full p-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Alto (px)</label>
                        <input
                          type="number"
                          value={height}
                          onChange={(e) => handleHeightChange(Number(e.target.value))}
                          className="w-full p-2 border rounded-lg"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={maintainAspect}
                            onChange={(e) => setMaintainAspect(e.target.checked)}
                            className="rounded"
                          />
                          <span className="text-sm text-gray-700">Mantener proporción</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {selectedTool === 'rotate' && (
                    <div className="flex gap-3">
                      <Button onClick={() => setRotateAngle((a) => (a - 90) % 360)} variant="outline">
                        <RotateCcw className="w-4 h-4 mr-2" /> -90°
                      </Button>
                      <Button onClick={() => setRotateAngle((a) => (a + 90) % 360)} variant="outline">
                        <RotateCw className="w-4 h-4 mr-2" /> +90°
                      </Button>
                      <Button onClick={() => setRotateAngle(0)} variant="outline">
                        Reset
                      </Button>
                      <span className="self-center text-sm text-gray-600">{rotateAngle}°</span>
                    </div>
                  )}

                  {selectedTool === 'flip' && (
                    <div className="flex gap-3">
                      <Button onClick={() => setFlipH(!flipH)} variant={flipH ? 'primary' : 'outline'}>
                        <FlipHorizontal className="w-4 h-4 mr-2" /> Horizontal
                      </Button>
                      <Button onClick={() => setFlipV(!flipV)} variant={flipV ? 'primary' : 'outline'}>
                        <FlipVertical className="w-4 h-4 mr-2" /> Vertical
                      </Button>
                    </div>
                  )}

                  {selectedTool === 'filters' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Brillo: {filters.brightness}%
                        </label>
                        <input
                          type="range" min="0" max="200" value={filters.brightness}
                          onChange={(e) => setFilters({ ...filters, brightness: Number(e.target.value) })}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Contraste: {filters.contrast}%
                        </label>
                        <input
                          type="range" min="0" max="200" value={filters.contrast}
                          onChange={(e) => setFilters({ ...filters, contrast: Number(e.target.value) })}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Saturación: {filters.saturation}%
                        </label>
                        <input
                          type="range" min="0" max="200" value={filters.saturation}
                          onChange={(e) => setFilters({ ...filters, saturation: Number(e.target.value) })}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Desenfoque: {filters.blur}px
                        </label>
                        <input
                          type="range" min="0" max="10" step="0.5" value={filters.blur}
                          onChange={(e) => setFilters({ ...filters, blur: Number(e.target.value) })}
                          className="w-full"
                        />
                      </div>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" checked={filters.grayscale}
                            onChange={(e) => setFilters({ ...filters, grayscale: e.target.checked })} />
                          <span className="text-sm">Escala de grises</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" checked={filters.sepia}
                            onChange={(e) => setFilters({ ...filters, sepia: e.target.checked })} />
                          <span className="text-sm">Sepia</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" checked={filters.invert}
                            onChange={(e) => setFilters({ ...filters, invert: e.target.checked })} />
                          <span className="text-sm">Invertir</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {selectedTool === 'compress' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Calidad: {quality}%
                      </label>
                      <input
                        type="range" min="10" max="100" value={quality}
                        onChange={(e) => setQuality(Number(e.target.value))}
                        className="w-full"
                      />
                      <p className="text-xs text-gray-500 mt-1">Menor calidad = archivo más pequeño</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex gap-3">
                  <Button onClick={handleDownload} className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Descargar imagen
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
    </PageLayout>
  );
}
