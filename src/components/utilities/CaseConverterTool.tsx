import { useState } from 'react';
import { Copy } from 'lucide-react';
import { Button } from '../ui/Button';

function convertCase(
  text: string,
  type: 'upper' | 'lower' | 'title' | 'camel' | 'snake' | 'kebab' | 'toggle',
): string {
  switch (type) {
    case 'upper':
      return text.toUpperCase();
    case 'lower':
      return text.toLowerCase();
    case 'title':
      return text.replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
    case 'camel':
      return text
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())
        .replace(/^./, (c) => c.toLowerCase());
    case 'snake':
      return text.replace(/[^a-zA-Z0-9]+/g, '_').toLowerCase();
    case 'kebab':
      return text.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase();
    case 'toggle':
      return text
        .split('')
        .map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()))
        .join('');
  }
}

export function CaseConverterTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [type, setType] = useState<
    'upper' | 'lower' | 'title' | 'camel' | 'snake' | 'kebab' | 'toggle'
  >('upper');

  const cases = [
    { id: 'upper' as const, label: 'MAYÚSCULAS' },
    { id: 'lower' as const, label: 'minúsculas' },
    { id: 'title' as const, label: 'Title Case' },
    { id: 'camel' as const, label: 'camelCase' },
    { id: 'snake' as const, label: 'snake_case' },
    { id: 'kebab' as const, label: 'kebab-case' },
    { id: 'toggle' as const, label: 'tOGGLE' },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Convertir Texto</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        {cases.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              setType(c.id);
              setOutput(convertCase(input, c.id));
            }}
            className={`p-2 rounded-lg text-sm ${type === c.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setOutput(convertCase(e.target.value, type));
          }}
          placeholder="Ingresa texto..."
          className="p-3 border-2 border-gray-200 rounded-lg h-32"
        />
        <textarea
          readOnly
          value={output}
          className="p-3 border-2 border-gray-200 rounded-lg h-32 bg-gray-50"
        />
      </div>
      {output && (
        <Button
          onClick={() => navigator.clipboard.writeText(output)}
          variant="outline"
          className="mt-2"
        >
          <Copy className="w-4 h-4 mr-2" /> Copiar
        </Button>
      )}
    </div>
  );
}
