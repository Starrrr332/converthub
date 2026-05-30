import { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';

interface ColorValues {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360; s /= 100; l /= 100;
  let r: number, g: number, b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

export function ColorConverterTool() {
  const [hexInput, setHexInput] = useState('#3B82F6');
  const [colorValues, setColorValues] = useState<ColorValues | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const rgb = hexToRgb(hexInput);
    if (rgb) {
      setColorValues({
        hex: hexInput,
        rgb,
        hsl: rgbToHsl(rgb.r, rgb.g, rgb.b)
      });
    }
  }, [hexInput]);

  const handleRgbChange = (channel: 'r' | 'g' | 'b', value: string) => {
    const num = parseInt(value) || 0;
    const clamped = Math.min(255, Math.max(0, num));
    if (colorValues) {
      const newRgb = { ...colorValues.rgb, [channel]: clamped };
      setHexInput(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    }
  };

  const handleHslChange = (channel: 'h' | 's' | 'l', value: string) => {
    const num = parseInt(value) || 0;
    const max = channel === 'h' ? 360 : 100;
    const clamped = Math.min(max, Math.max(0, num));
    if (colorValues) {
      const newHsl = { ...colorValues.hsl, [channel]: clamped };
      const rgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
      setHexInput(rgbToHex(rgb.r, rgb.g, rgb.b));
    }
  };

  const handleCopy = (text: string, format: string) => {
    navigator.clipboard.writeText(text);
    setCopied(format);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!colorValues) return null;

  return (
    <div className="space-y-6">
      {/* Color Preview */}
      <div className="flex items-center gap-4">
        <div
          className="w-20 h-20 rounded-xl shadow-lg border-2 border-gray-200"
          style={{ backgroundColor: colorValues.hex }}
        />
        <div>
          <input
            type="text"
            value={hexInput}
            onChange={(e) => setHexInput(e.target.value)}
            className="input-field font-mono text-lg w-32"
            maxLength={7}
          />
        </div>
      </div>

      {/* RGB */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">RGB</label>
        <div className="flex gap-2">
          {(['r', 'g', 'b'] as const).map((channel) => (
            <div key={channel} className="flex-1">
              <label className="text-xs text-gray-500 uppercase">{channel}</label>
              <input
                type="number"
                min={0}
                max={255}
                value={colorValues.rgb[channel]}
                onChange={(e) => handleRgbChange(channel, e.target.value)}
                className="input-field text-center"
              />
            </div>
          ))}
          <button
            onClick={() => handleCopy(`rgb(${colorValues.rgb.r}, ${colorValues.rgb.g}, ${colorValues.rgb.b})`, 'rgb')}
            className="self-end p-2 text-gray-400 hover:text-blue-600"
          >
            {copied === 'rgb' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* HSL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">HSL</label>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-xs text-gray-500">H (°)</label>
            <input
              type="number"
              min={0}
              max={360}
              value={colorValues.hsl.h}
              onChange={(e) => handleHslChange('h', e.target.value)}
              className="input-field text-center"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-gray-500">S (%)</label>
            <input
              type="number"
              min={0}
              max={100}
              value={colorValues.hsl.s}
              onChange={(e) => handleHslChange('s', e.target.value)}
              className="input-field text-center"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-gray-500">L (%)</label>
            <input
              type="number"
              min={0}
              max={100}
              value={colorValues.hsl.l}
              onChange={(e) => handleHslChange('l', e.target.value)}
              className="input-field text-center"
            />
          </div>
          <button
            onClick={() => handleCopy(`hsl(${colorValues.hsl.h}, ${colorValues.hsl.s}%, ${colorValues.hsl.l}%)`, 'hsl')}
            className="self-end p-2 text-gray-400 hover:text-blue-600"
          >
            {copied === 'hsl' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
