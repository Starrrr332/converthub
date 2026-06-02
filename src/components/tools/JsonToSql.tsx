import { useState } from 'react';
import { Copy, Check, Database } from 'lucide-react';
import { Button } from '../ui/Button';

type SqlType = 'TEXT' | 'INTEGER' | 'REAL' | 'BOOLEAN';

interface ColumnDef {
  name: string;
  type: SqlType;
}

function escapeValue(value: unknown): string {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`;
  return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
}

function inferType(value: unknown): SqlType {
  if (value === null || value === undefined) return 'TEXT';
  if (typeof value === 'boolean') return 'BOOLEAN';
  if (typeof value === 'number') {
    return Number.isInteger(value) ? 'INTEGER' : 'REAL';
  }
  return 'TEXT';
}

export function JsonToSql() {
  const [input, setInput] = useState('');
  const [tableName, setTableName] = useState('my_table');
  const [primaryKey, setPrimaryKey] = useState('id');
  const [columns, setColumns] = useState<ColumnDef[]>([]);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const parseAndInfer = () => {
    try {
      setError('');
      const parsed = JSON.parse(input);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        setError('El JSON debe ser un array con al menos un objeto.');
        setColumns([]);
        setOutput('');
        return;
      }
      const first = parsed[0] as Record<string, unknown>;
      const inferred: ColumnDef[] = Object.entries(first).map(([key, val]) => ({
        name: key,
        type: inferType(val),
      }));
      setColumns(inferred);
    } catch (e) {
      setError((e as Error).message);
      setColumns([]);
      setOutput('');
    }
  };

  const generate = () => {
    try {
      setError('');
      const parsed = JSON.parse(input);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        setError('El JSON debe ser un array con al menos un objeto.');
        setOutput('');
        return;
      }

      const colNames = columns.map(c => `"${c.name}"`).join(', ');
      const lines: string[] = [];

      for (const row of parsed) {
        const obj = row as Record<string, unknown>;
        const values = columns.map(c => escapeValue(obj[c.name])).join(', ');
        lines.push(`INSERT INTO "${tableName}" (${colNames}) VALUES (${values});`);
      }

      setOutput(lines.join('\n'));
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const updateColumnType = (index: number, type: SqlType) => {
    setColumns(prev => prev.map((c, i) => i === index ? { ...c, type } : c));
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">JSON a SQL INSERT</h3>

      <div className="flex gap-2 mb-4">
        <Button onClick={parseAndInfer}>Analizar JSON</Button>
        {columns.length > 0 && <Button onClick={generate}>Generar SQL</Button>}
        {output && (
          <Button onClick={copy} variant="outline">
            {copied ? <Check className="w-4 h-4 mr-1 text-green-500" /> : <Copy className="w-4 h-4 mr-1" />}
            Copiar
          </Button>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm mb-4">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">JSON de entrada (array)</label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={'[\n  {"name": "Alice", "age": 30},\n  {"name": "Bob", "age": 25}\n]'}
            className="input-field h-48 font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">SQL generado</label>
          <textarea
            readOnly
            value={output}
            className="input-field h-48 font-mono text-sm bg-surface-secondary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">Nombre de tabla</label>
          <input
            type="text"
            value={tableName}
            onChange={e => setTableName(e.target.value)}
            className="input-field text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">Primary Key</label>
          <input
            type="text"
            value={primaryKey}
            onChange={e => setPrimaryKey(e.target.value)}
            className="input-field text-sm"
          />
        </div>
      </div>

      {columns.length > 0 && (
        <div>
          <p className="text-xs font-medium text-text-muted mb-2 flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5" /> Columnas detectadas ({columns.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {columns.map((col, i) => (
              <div key={col.name} className="flex items-center gap-1.5 bg-surface-secondary px-2.5 py-1.5 rounded-lg text-sm">
                <span className="font-mono font-medium text-text">{col.name}</span>
                {col.name === primaryKey && (
                  <span className="text-[10px] bg-accent-100 text-accent-700 px-1.5 py-0.5 rounded-full font-bold">PK</span>
                )}
                <select
                  value={col.type}
                  onChange={e => updateColumnType(i, e.target.value as SqlType)}
                  className="text-xs border border-border rounded px-1.5 py-0.5 bg-surface"
                >
                  <option value="TEXT">TEXT</option>
                  <option value="INTEGER">INTEGER</option>
                  <option value="REAL">REAL</option>
                  <option value="BOOLEAN">BOOLEAN</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
