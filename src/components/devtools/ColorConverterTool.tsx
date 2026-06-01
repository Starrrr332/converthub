import { useState, useEffect } from 'react';
import { Copy, Check, Palette, Sun, Moon } from 'lucide-react';

interface HarmonyColor {
  name: string;
  hex: string;
}

function formatRgb(r: number, g: number, b: number) {
  return `${r}, ${g}, ${b}`;
}

function toHex(n: number): string {
  return Math.round(n).toString(16).padStart(2, '0');
}

export function ColorConverterTool() {
  const [hexInput, setHexInput] = useState('#3B82F6');
  const [color, setColor] = useState<{ r: number; g: number; b: number; h: number; s: number; l: number } | null>(null);
  const [harmonies, setHarmonies] = useState<HarmonyColor[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const loadColor = async () => {
      const raw = hexInput.replace('#', '');
      if (raw.length !== 6) return;
      const r = parseInt(raw.slice(0, 2), 16);
      const g = parseInt(raw.slice(2, 4), 16);
      const b = parseInt(raw.slice(4, 6), 16);
      if (isNaN(r) || isNaN(g) || isNaN(b)) return;

      try {
        const Color = (await import('color')).default;
        const c = Color(`#${raw}`);
        const hsl = c.hsl().object();
        setColor({ r, g, b, h: Math.round(hsl.h), s: Math.round(hsl.s), l: Math.round(hsl.l) });

        const comp = `#${c.rotate(180).hex()}`;
        const tri1 = `#${c.rotate(120).hex()}`;
        const tri2 = `#${c.rotate(240).hex()}`;
        const ana1 = `#${c.rotate(-30).hex()}`;
        const ana2 = `#${c.rotate(30).hex()}`;
        const tet1 = `#${c.rotate(90).hex()}`;
        const tet2 = `#${c.rotate(180).hex()}`;
        const tet3 = `#${c.rotate(270).hex()}`;
        const light = `#${c.lighten(0.3).hex()}`;
        const dark = `#${c.darken(0.3).hex()}`;

        setHarmonies([
          { name: 'Complementario', hex: comp },
          { name: 'Triádico 1', hex: tri1 },
          { name: 'Triádico 2', hex: tri2 },
          { name: 'Análogo 1', hex: ana1 },
          { name: 'Análogo 2', hex: ana2 },
          { name: 'Tetrádico 1', hex: tet1 },
          { name: 'Tetrádico 2', hex: tet2 },
          { name: 'Tetrádico 3', hex: tet3 },
          { name: 'Más claro', hex: light },
          { name: 'Más oscuro', hex: dark },
        ]);
      } catch {
        setColor({ r, g, b, h: 0, s: 0, l: 0 });
        setHarmonies([]);
      }
    };
    loadColor();
  }, [hexInput]);

  const handleCopy = (text: string, format: string) => {
    navigator.clipboard.writeText(text);
    setCopied(format);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-xl shadow-lg border-2 border-border" style={{ backgroundColor: hexInput }} />
        <div>
          <input type="text" value={hexInput} onChange={(e) => setHexInput(e.target.value)} className="input-field font-mono text-lg w-32" maxLength={7} />
        </div>
      </div>

      {color && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">RGB</span>
                <button onClick={() => handleCopy(`rgb(${formatRgb(color.r, color.g, color.b)})`, 'rgb')}>
                  {copied === 'rgb' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-text-muted" />}
                </button>
              </div>
              <div className="font-mono text-sm">rgb({formatRgb(color.r, color.g, color.b)})</div>
            </div>
            <div className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">HSL</span>
                <button onClick={() => handleCopy(`hsl(${color.h}, ${color.s}%, ${color.l}%)`, 'hsl')}>
                  {copied === 'hsl' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-text-muted" />}
                </button>
              </div>
              <div className="font-mono text-sm">hsl({color.h}°, {color.s}%, {color.l}%)</div>
            </div>
            <div className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">HEX</span>
                <button onClick={() => handleCopy(hexInput, 'hex')}>
                  {copied === 'hex' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-text-muted" />}
                </button>
              </div>
              <div className="font-mono text-sm">{hexInput}</div>
            </div>
            <div className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">HSV</span>
                <button onClick={() => handleCopy(`hsv(${color.h}, ${color.s}%, ${color.l}%)`, 'hsv')}>
                  {copied === 'hsv' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-text-muted" />}
                </button>
              </div>
              <div className="font-mono text-sm">hsv({color.h}°, {color.s}%, {color.l}%)</div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Palette className="w-4 h-4 text-text-muted" />
              <span className="text-sm font-medium">Paletas & Armonías</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {harmonies.map((h) => (
                <div key={h.name} className="text-center">
                  <div
                    className="w-full h-10 rounded-lg border border-border cursor-pointer mb-1"
                    style={{ backgroundColor: h.hex }}
                    onClick={() => setHexInput(h.hex)}
                    title={h.hex}
                  />
                  <span className="text-[10px] text-text-muted">{h.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="card p-4 flex items-center gap-3">
              <Sun className="w-5 h-5 text-text-muted" />
              <div>
                <p className="text-xs text-text-muted">Texto claro sobre este color</p>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: hexInput, color: '#ffffff' }}>Blanco</span>
                  <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: hexInput, color: '#000000' }}>Negro</span>
                </div>
              </div>
            </div>
            <div className="card p-4 flex items-center gap-3">
              <Moon className="w-5 h-5 text-text-muted" />
              <div>
                <p className="text-xs text-text-muted">Fondo claro con texto</p>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs px-1.5 py-0.5 rounded bg-white border" style={{ color: hexInput }}>Sobre blanco</span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 border" style={{ color: hexInput }}>Sobre gris</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
