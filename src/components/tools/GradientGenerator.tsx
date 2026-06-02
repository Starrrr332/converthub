import { useState } from 'react';
import { Copy, Check, Plus, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface ColorStop {
  color: string;
  position: number;
}

const PRESETS: { name: string; gradient: string }[] = [
  { name: 'Sunset', gradient: 'linear-gradient(135deg, #ff6b6b, #feca57)' },
  { name: 'Ocean', gradient: 'linear-gradient(135deg, #667eea, #764ba2)' },
  { name: 'Forest', gradient: 'linear-gradient(135deg, #11998e, #38ef7d)' },
  { name: 'Neon', gradient: 'linear-gradient(135deg, #f953c6, #b91d73)' },
  { name: 'Peach', gradient: 'linear-gradient(135deg, #ffecd2, #fcb69f)' },
  { name: 'Midnight', gradient: 'linear-gradient(135deg, #232526, #414345)' },
];

export function GradientGenerator() {
  const [type, setType] = useState<'linear' | 'radial' | 'conic'>('linear');
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<ColorStop[]>([
    { color: '#6366f1', position: 0 },
    { color: '#8b5cf6', position: 100 },
  ]);
  const [copied, setCopied] = useState(false);

  const gradientCSS = (() => {
    const stopsStr = stops.map((s) => `${s.color} ${s.position}%`).join(', ');
    switch (type) {
      case 'linear':
        return `linear-gradient(${angle}deg, ${stopsStr})`;
      case 'radial':
        return `radial-gradient(circle, ${stopsStr})`;
      case 'conic':
        return `conic-gradient(from ${angle}deg, ${stopsStr})`;
    }
  })();

  const cssOutput = `background: ${gradientCSS};`;

  const copy = async () => {
    await navigator.clipboard.writeText(cssOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addStop = () => {
    const lastPos = stops[stops.length - 1]?.position || 50;
    setStops([...stops, { color: '#ec4899', position: Math.min(lastPos + 10, 100) }]);
  };

  const removeStop = (index: number) => {
    if (stops.length <= 2) return;
    setStops(stops.filter((_, i) => i !== index));
  };

  const updateStop = (index: number, field: keyof ColorStop, value: string | number) => {
    setStops(stops.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  };

  const applyPreset = (gradient: string) => {
    const match = gradient.match(/linear-gradient\((\d+)deg,\s*(.+)\)/);
    if (match) {
      setAngle(parseInt(match[1]));
      const stopsStr = match[2];
      const parsedStops = stopsStr.split(',').map((s) => {
        const [color, pos] = s.trim().split(' ');
        return { color, position: parseInt(pos) || 0 };
      });
      setStops(parsedStops);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Generador de Gradient CSS</h3>

      {/* Preview */}
      <div
        className="w-full h-32 rounded-xl mb-4 border border-border"
        style={{ background: gradientCSS }}
      />

      {/* Type selector */}
      <div className="flex gap-2 mb-4">
        {(['linear', 'radial', 'conic'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              type === t
                ? 'bg-brand-600 text-white'
                : 'bg-surface-secondary text-text-secondary hover:bg-slate-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Angle */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-text mb-1">Ángulo: {angle}°</label>
        <input
          type="range"
          min="0"
          max="360"
          value={angle}
          onChange={(e) => setAngle(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Color stops */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-text">Paradas de color</label>
          <button
            onClick={addStop}
            className="text-xs text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> Agregar
          </button>
        </div>
        {stops.map((stop, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="color"
              value={stop.color}
              onChange={(e) => updateStop(i, 'color', e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border-0"
            />
            <input
              type="text"
              value={stop.color}
              onChange={(e) => updateStop(i, 'color', e.target.value)}
              className="flex-1 p-1.5 border border-border rounded text-sm font-mono"
            />
            <input
              type="number"
              min="0"
              max="100"
              value={stop.position}
              onChange={(e) => updateStop(i, 'position', Number(e.target.value))}
              className="w-16 p-1.5 border border-border rounded text-sm text-center"
            />
            <span className="text-xs text-text-muted">%</span>
            <button
              onClick={() => removeStop(i)}
              disabled={stops.length <= 2}
              className="p-1 rounded hover:bg-red-50 text-text-muted hover:text-red-500 disabled:opacity-30"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Presets */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-text mb-2">Predefinidos</label>
        <div className="grid grid-cols-3 gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset.gradient)}
              className="h-10 rounded-lg border border-border hover:border-brand-300 transition-colors"
              style={{ background: preset.gradient }}
              title={preset.name}
            />
          ))}
        </div>
      </div>

      {/* Output */}
      <div className="flex items-center gap-2">
        <code className="flex-1 p-3 bg-surface-secondary rounded-lg font-mono text-sm text-text overflow-x-auto">
          {cssOutput}
        </code>
        <Button onClick={copy} variant="outline" className="shrink-0">
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
}
