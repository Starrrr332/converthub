import { useState, useMemo } from 'react';
import { Button } from '../ui/Button';

export function TimestampTool() {
  const [timestamp, setTimestamp] = useState(() => Math.floor(Date.now() / 1000).toString());
  const [dateStr, setDateStr] = useState(() => new Date().toISOString().slice(0, 16));

  // eslint-disable-next-line react-hooks/purity
  const nowTs = useMemo(() => Math.floor(Date.now() / 1000), []);

  const tsToDate = () => {
    const ts = parseInt(timestamp);
    if (isNaN(ts)) return;
    const d = new Date(ts * 1000);
    setDateStr(d.toISOString().slice(0, 16));
  };

  const dateToTs = () => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return;
    setTimestamp(Math.floor(d.getTime() / 1000).toString());
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Conversor de Timestamp Unix</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Timestamp Unix (segundos)</label>
          <div className="flex gap-2">
            <input value={timestamp} onChange={e => setTimestamp(e.target.value)} placeholder="1700000000" className="flex-1 p-3 border-2 border-gray-200 rounded-lg font-mono" />
            <Button onClick={tsToDate} variant="outline">→ Fecha</Button>
          </div>
          <p className="text-xs text-gray-400 mt-1">Muestra local: {new Date(parseInt(timestamp) * 1000).toLocaleString()}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha y hora</label>
          <div className="flex gap-2">
            <input type="datetime-local" value={dateStr} onChange={e => setDateStr(e.target.value)} className="flex-1 p-3 border-2 border-gray-200 rounded-lg" />
            <Button onClick={dateToTs} variant="outline">→ Timestamp</Button>
          </div>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg text-sm text-blue-700">
          <p className="font-medium mb-1">Timestamps comunes:</p>
          <div className="space-y-1">
            <button onClick={() => { setTimestamp(nowTs.toString()); tsToDate(); }} className="block hover:underline">Ahora: {nowTs}</button>
            <button onClick={() => { setTimestamp('0'); tsToDate(); }} className="block hover:underline">Unix epoch: 0 → 01/01/1970</button>
            <button onClick={() => { setTimestamp('2147483647'); tsToDate(); }} className="block hover:underline">Máx 32-bit: 2147483647</button>
          </div>
        </div>
      </div>
    </div>
  );
}
