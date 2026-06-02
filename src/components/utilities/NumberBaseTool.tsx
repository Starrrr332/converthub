import { useState, useMemo } from 'react';
import { Copy } from 'lucide-react';

export function NumberBaseTool() {
  const [input, setInput] = useState('255');
  const [fromBase, setFromBase] = useState<2 | 8 | 10 | 16>(10);

  const convert = useMemo(() => {
    const val = parseInt(input, fromBase);
    if (isNaN(val)) return null;
    return {
      bin: val.toString(2),
      oct: val.toString(8),
      dec: val.toString(10),
      hex: val.toString(16).toUpperCase(),
    };
  }, [input, fromBase]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Conversor de Bases Numéricas</h3>
      <div className="flex gap-2 mb-4">
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Valor" className="flex-1 p-3 border-2 border-gray-200 rounded-lg font-mono" />
        <select value={fromBase} onChange={e => setFromBase(Number(e.target.value) as 2 | 8 | 10 | 16)} className="p-3 border-2 border-gray-200 rounded-lg bg-white">
          <option value={2}>Binario</option>
          <option value={8}>Octal</option>
          <option value={10}>Decimal</option>
          <option value={16}>Hexadecimal</option>
        </select>
      </div>
      {convert && (
        <div className="space-y-2">
          {[
            { label: 'Binario (2)', value: convert.bin, base: 2 },
            { label: 'Octal (8)', value: convert.oct, base: 8 },
            { label: 'Decimal (10)', value: convert.dec, base: 10 },
            { label: 'Hexadecimal (16)', value: convert.hex, base: 16 },
          ].map(b => (
            <div key={b.base} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-xs font-medium text-gray-500 w-28 shrink-0">{b.label}</span>
              <code className="flex-1 font-mono text-sm">{b.value}</code>
              <button onClick={() => navigator.clipboard.writeText(b.value)} className="p-1 hover:bg-gray-200 rounded">
                <Copy className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
