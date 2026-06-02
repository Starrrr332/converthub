import { useState, useMemo } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

function generatePassword(len: number, upper: boolean, lower: boolean, digits: boolean, special: boolean): string {
  let chars = '';
  if (upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (lower) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (digits) chars += '0123456789';
  if (special) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export function PasswordGeneratorTool() {
  const [len, setLen] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [digits, setDigits] = useState(true);
  const [special, setSpecial] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => setPassword(generatePassword(len, upper, lower, digits, special));

  const copy = async () => {
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const strength = useMemo(() => {
    let entropy = 0;
    if (upper) entropy += 26;
    if (lower) entropy += 26;
    if (digits) entropy += 10;
    if (special) entropy += 18;
    const bits = Math.log2(entropy) * len;
    if (bits < 40) return { label: 'Débil', color: 'text-red-500' };
    if (bits < 60) return { label: 'Moderada', color: 'text-yellow-500' };
    if (bits < 80) return { label: 'Fuerte', color: 'text-green-500' };
    return { label: 'Muy fuerte', color: 'text-blue-500' };
  }, [len, upper, lower, digits, special]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Generador de Contraseñas</h3>
      <div className="flex gap-2 mb-4">
        <input readOnly value={password} className="flex-1 p-3 border-2 border-gray-200 rounded-lg font-mono text-lg bg-gray-50" placeholder="Haz clic en Generar" />
        <Button onClick={copy} variant="outline" className="px-3">
          {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Longitud: {len}</label>
          <input type="range" min="4" max="64" value={len} onChange={e => setLen(Number(e.target.value))} className="w-full" />
        </div>
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-700">Fortaleza: <span className={strength.color}>{strength.label}</span></span>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 mb-4">
        {[{ id: 'upper', label: 'A-Z', value: upper, set: setUpper },
          { id: 'lower', label: 'a-z', value: lower, set: setLower },
          { id: 'digits', label: '0-9', value: digits, set: setDigits },
          { id: 'special', label: '!@#$%', value: special, set: setSpecial }].map(opt => (
          <label key={opt.id} className="flex items-center gap-2">
            <input type="checkbox" checked={opt.value} onChange={() => opt.set(!opt.value)} className="w-4 h-4" />
            <span className="text-sm">{opt.label}</span>
          </label>
        ))}
      </div>
      <Button onClick={generate}><RefreshCw className="w-4 h-4 mr-2" /> Generar</Button>
    </div>
  );
}
