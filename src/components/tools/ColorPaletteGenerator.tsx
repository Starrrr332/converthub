import { useState, useRef } from 'react';
import { Check, Upload } from 'lucide-react';
import { Button } from '../ui/Button';

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return { h: Math.round((h / 6) * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function getComplementary(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const { h, s, l } = rgbToHsl(r, g, b);
  const compH = (h + 180) % 360;
  return `hsl(${compH}, ${s}%, ${l}%)`;
}

function getTriadic(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const { h, s, l } = rgbToHsl(r, g, b);
  return [`hsl(${(h + 120) % 360}, ${s}%, ${l}%)`, `hsl(${(h + 240) % 360}, ${s}%, ${l}%)`];
}

function getAnalogous(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const { h, s, l } = rgbToHsl(r, g, b);
  return [`hsl(${(h + 30) % 360}, ${s}%, ${l}%)`, `hsl(${(h - 30 + 360) % 360}, ${s}%, ${l}%)`];
}

export function ColorPaletteGenerator() {
  const [baseColor, setBaseColor] = useState('#6366f1');
  const [palette, setPalette] = useState<string[]>([]);
  const [copied, setCopied] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);

  const extractFromImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 100;
      canvas.height = 100;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, 100, 100);
      const data = ctx.getImageData(0, 0, 100, 100).data;

      const colorCounts: Record<string, number> = {};
      for (let i = 0; i < data.length; i += 16) {
        const r = Math.round(data[i] / 32) * 32;
        const g = Math.round(data[i + 1] / 32) * 32;
        const b = Math.round(data[i + 2] / 32) * 32;
        const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        colorCounts[hex] = (colorCounts[hex] || 0) + 1;
      }

      const sorted = Object.entries(colorCounts).sort((a, b) => b[1] - a[1]);
      const top = sorted.slice(0, 6).map(([hex]) => hex);
      setPalette(top);
      setBaseColor(top[0]);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const generateHarmony = (type: string) => {
    const colors = [baseColor];
    switch (type) {
      case 'complementary':
        colors.push(getComplementary(baseColor));
        break;
      case 'triadic':
        colors.push(...getTriadic(baseColor));
        break;
      case 'analogous':
        colors.push(...getAnalogous(baseColor));
        break;
      case 'split': {
        const { r, g, b } = hexToRgb(baseColor);
        const { h, s, l } = rgbToHsl(r, g, b);
        colors.push(`hsl(${(h + 150) % 360}, ${s}%, ${l}%)`);
        colors.push(`hsl(${(h + 210) % 360}, ${s}%, ${l}%)`);
        break;
      }
    }
    setPalette(colors);
  };

  const copyColor = async (color: string, format: string) => {
    let text = color;
    if (format === 'rgb') {
      const temp = document.createElement('div');
      temp.style.color = color;
      document.body.appendChild(temp);
      const computed = getComputedStyle(temp).color;
      document.body.removeChild(temp);
      text = computed;
    } else if (format === 'css') {
      text = `--color: ${color};`;
    }
    await navigator.clipboard.writeText(text);
    setCopied(`${color}-${format}`);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Generador de Paletas de Colores</h3>

      {/* Base color */}
      <div className="flex items-center gap-3 mb-4">
        <input
          type="color"
          value={baseColor}
          onChange={(e) => setBaseColor(e.target.value)}
          className="w-12 h-12 rounded-lg cursor-pointer border-0"
        />
        <input
          value={baseColor}
          onChange={(e) => setBaseColor(e.target.value)}
          className="flex-1 p-2 border border-border rounded-lg font-mono text-sm"
        />
        <input
          type="file"
          ref={fileInput}
          onChange={extractFromImage}
          accept="image/*"
          className="hidden"
        />
        <Button variant="outline" onClick={() => fileInput.current?.click()}>
          <Upload className="w-4 h-4 mr-1" /> Extraer de imagen
        </Button>
      </div>

      {/* Harmony buttons */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {[
          { id: 'complementary', label: 'Complementario' },
          { id: 'triadic', label: 'Triádico' },
          { id: 'analogous', label: 'Análogo' },
          { id: 'split', label: 'Split-complementary' },
        ].map((h) => (
          <button
            key={h.id}
            onClick={() => generateHarmony(h.id)}
            className="px-3 py-1.5 rounded-lg bg-surface-secondary hover:bg-slate-200 text-xs font-medium text-text-secondary transition-colors"
          >
            {h.label}
          </button>
        ))}
      </div>

      {/* Palette */}
      {palette.length > 0 && (
        <div className="space-y-2">
          <div className="flex rounded-xl overflow-hidden h-20">
            {palette.map((color, i) => (
              <div key={i} className="flex-1 relative group" style={{ backgroundColor: color }}>
                <div className="absolute inset-x-0 bottom-0 p-1 flex gap-0.5 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {['hex', 'rgb', 'css'].map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => copyColor(color, fmt)}
                      className="px-1 py-0.5 text-[9px] font-medium bg-black/50 text-white rounded hover:bg-black/70"
                    >
                      {copied === `${color}-${fmt}` ? <Check className="w-2.5 h-2.5" /> : fmt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Color list */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {palette.map((color, i) => {
              const { r, g, b } = hexToRgb(color);
              return (
                <div
                  key={i}
                  className="flex items-center gap-2 p-2 rounded-lg bg-surface-secondary"
                >
                  <div className="w-8 h-8 rounded-lg shrink-0" style={{ backgroundColor: color }} />
                  <div className="min-w-0">
                    <p className="text-xs font-mono text-text truncate">{color}</p>
                    <p className="text-[10px] text-text-muted">
                      rgb({r}, {g}, {b})
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
