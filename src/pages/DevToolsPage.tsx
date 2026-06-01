import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Binary, Link, Hash, QrCode, Palette, Database, FileDiff, Regex, Key, FileCode, Scan, Upload, Check, X } from 'lucide-react';
import { PageLayout } from '../components/layout/PageLayout';
import { Base64Tool } from '../components/devtools/Base64Tool';
import { UrlEncoderTool } from '../components/devtools/UrlEncoderTool';
import { HashGeneratorTool } from '../components/devtools/HashGeneratorTool';
import { QrCodeTool } from '../components/devtools/QrCodeTool';
import { ColorConverterTool } from '../components/devtools/ColorConverterTool';

type Tool = 'base64' | 'url' | 'hash' | 'qrcode' | 'color' | 'sql' | 'diff' | 'regex' | 'jwt' | 'jsfmt' | 'qrscan';

const tools: Array<{ id: Tool; icon: React.ReactNode; label: string }> = [
  { id: 'base64', icon: <Binary className="w-5 h-5" />, label: 'Base64' },
  { id: 'url', icon: <Link className="w-5 h-5" />, label: 'URL' },
  { id: 'hash', icon: <Hash className="w-5 h-5" />, label: 'Hash' },
  { id: 'qrcode', icon: <QrCode className="w-5 h-5" />, label: 'QR Gen' },
  { id: 'qrscan', icon: <Scan className="w-5 h-5" />, label: 'QR Scan' },
  { id: 'color', icon: <Palette className="w-5 h-5" />, label: 'Color' },
  { id: 'sql', icon: <Database className="w-5 h-5" />, label: 'SQL' },
  { id: 'diff', icon: <FileDiff className="w-5 h-5" />, label: 'Diff' },
  { id: 'regex', icon: <Regex className="w-5 h-5" />, label: 'Regex' },
  { id: 'jwt', icon: <Key className="w-5 h-5" />, label: 'JWT' },
  { id: 'jsfmt', icon: <FileCode className="w-5 h-5" />, label: 'JS' },
];

// SQL Formatter
function SqlFormatterTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const formatSql = async () => {
    try {
      const { format } = await import('sql-formatter');
      const result = format(input, { language: 'sql', tabWidth: 2 });
      setOutput(result);
      setError('');
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">SQL Formatter</h3>
      <button onClick={formatSql} className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 mb-4 transition-colors">Format SQL</button>
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="SELECT * FROM users WHERE id = 1" className="input-field h-48 font-mono text-sm" />
        <textarea readOnly value={output} className="input-field h-48 font-mono text-sm bg-surface-secondary" />
      </div>
    </div>
  );
}

// Diff Checker
function DiffCheckerTool() {
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');
  const [diffLines, setDiffLines] = useState<Array<{ type: 'same' | 'added' | 'removed'; text: string }>>([]);

  const computeDiff = async () => {
    const { diffArrays } = await import('diff');
    const lLines = left.split('\n');
    const rLines = right.split('\n');
    const changes = diffArrays(lLines, rLines);
    const result: Array<{ type: 'same' | 'added' | 'removed'; text: string }> = [];
    
    for (const change of changes) {
      for (const value of change.value as string[]) {
        if (change.added) {
          result.push({ type: 'added', text: value });
        } else if (change.removed) {
          result.push({ type: 'removed', text: value });
        } else {
          result.push({ type: 'same', text: value });
        }
      }
    }
    setDiffLines(result);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Diff Checker</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <textarea value={left} onChange={e => setLeft(e.target.value)} placeholder="Texto original" className="input-field h-48 font-mono text-sm" />
        <textarea value={right} onChange={e => setRight(e.target.value)} placeholder="Texto modificado" className="input-field h-48 font-mono text-sm" />
      </div>
      <button onClick={computeDiff} className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 mb-4 transition-colors">Comparar</button>
      {diffLines.length > 0 && (
        <div className="border border-border rounded-lg overflow-hidden">
          {diffLines.map((line, i) => (
            <div key={i} className={`px-3 py-1 font-mono text-sm ${
              line.type === 'added' ? 'bg-green-50 text-green-800' :
              line.type === 'removed' ? 'bg-red-50 text-red-800' : 'bg-surface'
            }`}>
              <span className="mr-2 font-bold select-none">{line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}</span>
              {line.text || ' '}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Regex Tester
function RegexTesterTool() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('gm');
  const [text, setText] = useState('');
  const [matches, setMatches] = useState<string[]>([]);
  const [error, setError] = useState('');

  const test = () => {
    try {
      const regex = new RegExp(pattern, flags);
      const found: string[] = [];
      let match;
      while ((match = regex.exec(text)) !== null) {
        found.push(match[0]);
      }
      setMatches(found);
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setMatches([]);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Regex Tester</h3>
      <div className="flex gap-2 mb-4">
        <input value={pattern} onChange={e => setPattern(e.target.value)} placeholder="/patrón/" className="flex-1 p-3 border-2 border-gray-200 rounded-lg font-mono" />
        <input value={flags} onChange={e => setFlags(e.target.value)} placeholder="flags" className="w-24 p-3 border-2 border-gray-200 rounded-lg font-mono" />
        <button onClick={test} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Test</button>
      </div>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Texto de prueba" className="w-full p-3 border-2 border-gray-200 rounded-lg h-48 font-mono text-sm mb-4" />
      {matches.length > 0 && (
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-sm font-medium text-green-800">{matches.length} match(es) found</p>
          <div className="font-mono text-sm text-green-700 mt-1">{matches.map((m, i) => <span key={i} className="inline-block bg-green-100 px-2 py-0.5 rounded mr-1 mb-1">{m}</span>)}</div>
        </div>
      )}
    </div>
  );
}

// JWT Decoder
function JwtDecoderTool() {
  const [token, setToken] = useState('');
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');
  const [error, setError] = useState('');

  const decode = () => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) { setError('Invalid JWT format'); return; }
      setHeader(JSON.stringify(JSON.parse(atob(parts[0])), null, 2));
      setPayload(JSON.stringify(JSON.parse(atob(parts[1])), null, 2));
      setError('');
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">JWT Decoder</h3>
      <textarea value={token} onChange={e => setToken(e.target.value)} placeholder="eyJhbGciOiJI...token..." className="w-full p-3 border-2 border-gray-200 rounded-lg h-24 font-mono text-sm mb-4" />
      <button onClick={decode} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mb-4">Decode</button>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-2">Header</h4>
          <pre className="p-3 bg-gray-50 rounded-lg border-2 border-gray-200 overflow-auto max-h-48 text-xs">{header}</pre>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-2">Payload</h4>
          <pre className="p-3 bg-gray-50 rounded-lg border-2 border-gray-200 overflow-auto max-h-48 text-xs">{payload}</pre>
        </div>
      </div>
    </div>
  );
}

// JS Formatter
function JsFormatterTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const formatJs = () => {
    try {
      const formatted = input
        .replace(/\s+/g, ' ')
        .replace(/([{;])/g, '$1\n')
        .replace(/(})/g, '\n$1\n')
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean)
        .reduce((acc: string[], line) => {
          const indent = line.startsWith('}') || line.startsWith(']') ? -1 : 0;
          const prevIndent = acc.length > 0 ? (acc[acc.length - 1].endsWith('{') || acc[acc.length - 1].endsWith('[') ? 1 : 0) : 0;
          const level = Math.max(0, (acc.filter(l => l.includes('{')).length - acc.filter(l => l.includes('}')).length + indent));
          acc.push('  '.repeat(level + prevIndent) + line);
          return acc;
        }, [])
        .join('\n');
      setOutput(formatted);
      setError('');
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">JavaScript Formatter</h3>
      <button onClick={formatJs} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mb-4">Format</button>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="const x = {a:1,b:2}" className="p-3 border-2 border-gray-200 rounded-lg h-48 font-mono text-sm" />
        <textarea readOnly value={output} className="p-3 border-2 border-gray-200 rounded-lg h-48 font-mono text-sm bg-gray-50" />
      </div>
    </div>
  );
}

// QR Scanner
function QrScanTool() {
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResult('');
    setError('');

    try {
      const jsQR = (await import('jsqr')).default;
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          setResult(code.data);
        } else {
          setError('No se encontró ningún código QR en la imagen.');
        }
        URL.revokeObjectURL(url);
      };
      img.onerror = () => setError('Error al cargar la imagen.');
      img.src = url;
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(result);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Lector QR</h3>
      <p className="text-sm text-text-secondary mb-4">Sube una imagen que contenga un código QR para extraer su contenido.</p>
      <label className="dropzone flex flex-col items-center justify-center h-36 cursor-pointer mb-4">
        <Upload className="w-6 h-6 mb-1 text-text-muted" />
        <p className="text-xs text-text-secondary">Selecciona una imagen con QR</p>
        <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </label>
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          <X className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}
      {result && (
        <div className="card p-4 space-y-3">
          <div className="flex items-center gap-2 text-green-600">
            <Check className="w-5 h-5" />
            <span className="font-medium">QR detectado</span>
          </div>
          <textarea readOnly value={result} className="input-field w-full h-24 font-mono text-sm" />
          <button onClick={copy} className="btn-primary text-sm px-4 py-2">Copiar resultado</button>
        </div>
      )}
    </div>
  );
}

export function DevToolsPage() {
  const { t } = useTranslation('common');
  const [selectedTool, setSelectedTool] = useState<Tool>('base64');

  const renderTool = () => {
    switch (selectedTool) {
      case 'base64':
        return <Base64Tool />;
      case 'url':
        return <UrlEncoderTool />;
      case 'hash':
        return <HashGeneratorTool />;
      case 'qrcode':
        return <QrCodeTool />;
      case 'qrscan':
        return <QrScanTool />;
      case 'color':
        return <ColorConverterTool />;
      case 'sql':
        return <SqlFormatterTool />;
      case 'diff':
        return <DiffCheckerTool />;
      case 'regex':
        return <RegexTesterTool />;
      case 'jwt':
        return <JwtDecoderTool />;
      case 'jsfmt':
        return <JsFormatterTool />;
    }
  };

  return (
    <PageLayout
      title={t('nav.devtools')}
      subtitle="Herramientas para desarrolladores. Sin registro."
      showPrivacyBanner={false}
      breadcrumb={[{ label: t('nav.home'), to: '/' }, { label: t('nav.devtools') }]}
    >
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        {tools.map((tool) => (
          <button
            key={tool.id}
            type="button"
            onClick={() => setSelectedTool(tool.id)}
            className={`tool-tab ${selectedTool === tool.id ? 'tool-tab-active' : ''}`}
          >
            {tool.icon}
            <span className="text-sm font-medium">{tool.label}</span>
          </button>
        ))}
      </div>

      <div className="content-panel">{renderTool()}</div>
    </PageLayout>
  );
}
