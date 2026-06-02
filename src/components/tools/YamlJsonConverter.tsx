import { useState } from 'react';
import { ArrowLeftRight, Copy, Check } from 'lucide-react';
import { Button } from '../ui/Button';

export function YamlJsonConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'yaml-to-json' | 'json-to-yaml'>('yaml-to-json');
  const [copied, setCopied] = useState(false);

  const convert = async () => {
    try {
      setError('');
      if (mode === 'yaml-to-json') {
        const yaml = await import('js-yaml');
        const parsed = yaml.load(input);
        setOutput(JSON.stringify(parsed, null, 2));
      } else {
        const yaml = await import('js-yaml');
        const parsed = JSON.parse(input);
        setOutput(yaml.dump(parsed, { indent: 2, lineWidth: -1 }));
      }
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

  const swap = () => {
    setMode(mode === 'yaml-to-json' ? 'json-to-yaml' : 'yaml-to-json');
    setInput(output);
    setOutput(input);
    setError('');
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-lg font-semibold">YAML ↔ JSON</h3>
        <button
          onClick={swap}
          className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-text-muted hover:text-text"
          title="Intercambiar"
        >
          <ArrowLeftRight className="w-4 h-4" />
        </button>
        <span className="text-xs text-text-muted">
          {mode === 'yaml-to-json' ? 'YAML → JSON' : 'JSON → YAML'}
        </span>
      </div>

      <div className="flex gap-2 mb-4">
        <Button onClick={convert}>Convertir</Button>
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
          <label className="block text-xs font-medium text-text-muted mb-1">
            {mode === 'yaml-to-json' ? 'YAML' : 'JSON'}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === 'yaml-to-json' ? 'name: ConvertHub\nversion: 1.0' : '{"name": "ConvertHub"}'
            }
            className="input-field h-64 font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">
            {mode === 'yaml-to-json' ? 'JSON' : 'YAML'}
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
