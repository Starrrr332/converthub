import { useState } from 'react';
import { Button } from '../ui/Button';

function generateCron(minute: string, hour: string, dom: string, month: string, dow: string): string {
  return `${minute} ${hour} ${dom} ${month} ${dow}`;
}

export function CronGeneratorTool() {
  const [minute, setMinute] = useState('0');
  const [hour, setHour] = useState('12');
  const [dom, setDom] = useState('*');
  const [month, setMonth] = useState('*');
  const [dow, setDow] = useState('*');
  const [cron, setCron] = useState('');

  const generate = () => setCron(generateCron(minute, hour, dom, month, dow));

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Generador Cron</h3>
      <div className="grid grid-cols-5 gap-2 mb-4">
        {[{ id: 'minute', label: 'Minuto', val: minute, set: setMinute, placeholder: '0-59' },
          { id: 'hour', label: 'Hora', val: hour, set: setHour, placeholder: '0-23' },
          { id: 'dom', label: 'Día del mes', val: dom, set: setDom, placeholder: '*' },
          { id: 'month', label: 'Mes', val: month, set: setMonth, placeholder: '*' },
          { id: 'dow', label: 'Día semana', val: dow, set: setDow, placeholder: '*' }].map(f => (
          <div key={f.id}>
            <label className="block text-xs font-medium text-gray-500 mb-1">{f.label}</label>
            <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} className="w-full p-2 border-2 border-gray-200 rounded-lg text-sm text-center" />
          </div>
        ))}
      </div>
      <Button onClick={generate}>Generar</Button>
      {cron && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="font-mono text-lg text-center">{cron}</p>
          <p className="text-sm text-gray-500 text-center mt-2">
            {minute === '*' && hour === '*' && dom === '*' && month === '*' && dow === '*' ? 'Cada minuto' :
             dom !== '*' ? `Se ejecuta el día ${dom} a las ${hour}:${minute}` :
             hour !== '*' ? `Se ejecuta a las ${hour}:${minute}` : 'Expresión personalizada'}
          </p>
        </div>
      )}
    </div>
  );
}
