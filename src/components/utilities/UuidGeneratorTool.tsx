import { useState } from 'react';
import { Copy, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

function generateUUID(): string {
  return crypto.randomUUID();
}

export function UuidGeneratorTool() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(5);

  const generate = () => setUuids(Array.from({ length: count }, () => generateUUID()));

  const copy = async () => {
    await navigator.clipboard.writeText(uuids.join('\n'));
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Generador UUID v4</h3>
      <div className="flex items-center gap-4 mb-4">
        <label className="flex items-center gap-2">
          <span className="text-sm font-medium">Cantidad:</span>
          <input type="number" min="1" max="100" value={count} onChange={e => setCount(Number(e.target.value))} className="w-20 p-2 border-2 border-gray-200 rounded-lg" />
        </label>
        <Button onClick={generate}><RefreshCw className="w-4 h-4 mr-2" /> Generar</Button>
        {uuids.length > 0 && <Button onClick={copy} variant="outline"><Copy className="w-4 h-4 mr-2" /> Copiar</Button>}
      </div>
      <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm space-y-1">
        {uuids.map((u, i) => <div key={i}>{u}</div>)}
      </div>
    </div>
  );
}
