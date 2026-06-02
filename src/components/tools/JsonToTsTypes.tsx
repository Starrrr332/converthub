import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '../ui/Button';

function generateInterface(obj: Record<string, unknown>, name = 'Root', indent = 0): string {
  const pad = '  '.repeat(indent);
  let result = `${pad}interface ${name} {\n`;

  for (const [key, value] of Object.entries(obj)) {
    const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;

    if (value === null) {
      result += `${pad}  ${safeKey}: null;\n`;
    } else if (Array.isArray(value)) {
      if (value.length === 0) {
        result += `${pad}  ${safeKey}: unknown[];\n`;
      } else {
        const itemType = inferType(value[0]);
        result += `${pad}  ${safeKey}: ${itemType}[];\n`;
      }
    } else if (typeof value === 'object') {
      const childName = key.charAt(0).toUpperCase() + key.slice(1);
      result += generateInterface(value as Record<string, unknown>, childName, indent + 1);
      result += `${pad}  ${safeKey}: ${childName};\n`;
    } else {
      result += `${pad}  ${safeKey}: ${typeof value};\n`;
    }
  }

  result += `${pad}}\n`;
  return result;
}

function inferType(value: unknown): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) {
    if (value.length === 0) return 'unknown[]';
    return `${inferType(value[0])}[]`;
  }
  if (typeof value === 'object') {
    const keys = Object.keys(value as Record<string, unknown>);
    if (keys.length === 0) return 'Record<string, unknown>';
    return 'object';
  }
  return typeof value;
}

export function JsonToTsTypes() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    try {
      setError('');
      const parsed = JSON.parse(input);
      if (typeof parsed !== 'object' || parsed === null) {
        setError('El JSON debe ser un objeto');
        setOutput('');
        return;
      }
      const types = generateInterface(parsed);
      setOutput(types.trim());
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

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">JSON a Tipos TypeScript</h3>

      <div className="flex gap-2 mb-4">
        <Button onClick={generate}>Generar tipos</Button>
        {output && (
          <Button onClick={copy} variant="outline">
            {copied ? (
              <Check className="w-4 h-4 mr-1 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 mr-1" />
            )}
            Copiar
          </Button>
        )}
      </div>

      {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm mb-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">JSON de entrada</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              '{\n  "name": "ConvertHub",\n  "version": 1,\n  "features": ["images", "pdf"]\n}'
            }
            className="input-field h-64 font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">
            TypeScript generado
          </label>
          <textarea
            readOnly
            value={output}
            className="input-field h-64 font-mono text-sm bg-surface-secondary"
          />
        </div>
      </div>
    </div>
  );
}
