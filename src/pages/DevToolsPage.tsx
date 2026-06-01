import { useState } from 'react';
import { Binary, Link, Hash, QrCode, Palette, Database, FileDiff, Regex, Key, FileCode } from 'lucide-react';
import { Base64Tool } from '../components/devtools/Base64Tool';
import { UrlEncoderTool } from '../components/devtools/UrlEncoderTool';
import { HashGeneratorTool } from '../components/devtools/HashGeneratorTool';
import { QrCodeTool } from '../components/devtools/QrCodeTool';
import { ColorConverterTool } from '../components/devtools/ColorConverterTool';

type Tool = 'base64' | 'url' | 'hash' | 'qrcode' | 'color' | 'sql' | 'diff' | 'regex' | 'jwt' | 'jsfmt';

const tools: Array<{ id: Tool; icon: React.ReactNode; label: string; description: string }> = [
  { id: 'base64', icon: <Binary className="w-5 h-5" />, label: 'Base64', description: 'Encode/Decode text' },
  { id: 'url', icon: <Link className="w-5 h-5" />, label: 'URL Encoder', description: 'Encode/Decode URLs' },
  { id: 'hash', icon: <Hash className="w-5 h-5" />, label: 'Hash Generator', description: 'MD5, SHA-1, SHA-256' },
  { id: 'qrcode', icon: <QrCode className="w-5 h-5" />, label: 'QR Code', description: 'Generate QR codes' },
  { id: 'color', icon: <Palette className="w-5 h-5" />, label: 'Color Converter', description: 'HEX ↔ RGB ↔ HSL' },
  { id: 'sql', icon: <Database className="w-5 h-5" />, label: 'SQL Formatter', description: 'Format and prettify SQL' },
  { id: 'diff', icon: <FileDiff className="w-5 h-5" />, label: 'Diff Checker', description: 'Compare text differences' },
  { id: 'regex', icon: <Regex className="w-5 h-5" />, label: 'Regex Tester', description: 'Test regular expressions' },
  { id: 'jwt', icon: <Key className="w-5 h-5" />, label: 'JWT Decoder', description: 'Decode JWT tokens' },
  { id: 'jsfmt', icon: <FileCode className="w-5 h-5" />, label: 'JS Formatter', description: 'Format JavaScript code' },
];

// SQL Formatter
function SqlFormatterTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const formatSql = (sql: string) => {
    const keywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'ON', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE', 'INDEX', 'CREATE INDEX', 'UNION', 'ALL', 'DISTINCT', 'AS', 'IN', 'NOT', 'NULL', 'IS', 'BETWEEN', 'LIKE', 'EXISTS', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'ASC', 'DESC', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN', 'CROSS JOIN', 'NATURAL JOIN'];
    let result = sql.replace(/\s+/g, ' ');
    
    for (const kw of keywords) {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi');
      result = result.replace(regex, `\n${kw.toUpperCase()}`);
    }
    
    result = result.replace(/\n\s+/g, '\n').trim();
    
    // Indent
    let indent = 0;
    const lines = result.split('\n').map(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith(')')) indent = Math.max(0, indent - 1);
      const indented = '  '.repeat(indent) + trimmed;
      if (trimmed.endsWith('(')) indent++;
      return indented;
    });
    
    return lines.join('\n');
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">SQL Formatter</h3>
      <button onClick={() => setOutput(formatSql(input))} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mb-4">Format SQL</button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="SELECT * FROM users WHERE id = 1" className="p-3 border-2 border-gray-200 rounded-lg h-48 font-mono text-sm" />
        <textarea readOnly value={output} className="p-3 border-2 border-gray-200 rounded-lg h-48 font-mono text-sm bg-gray-50" />
      </div>
    </div>
  );
}

// Diff Checker
function DiffCheckerTool() {
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');
  const [diffLines, setDiffLines] = useState<Array<{ type: 'same' | 'added' | 'removed'; text: string }>>([]);

  const computeDiff = () => {
    const lLines = left.split('\n');
    const rLines = right.split('\n');
    const maxLen = Math.max(lLines.length, rLines.length);
    const result: Array<{ type: 'same' | 'added' | 'removed'; text: string }> = [];
    
    for (let i = 0; i < maxLen; i++) {
      if (i >= lLines.length) {
        result.push({ type: 'added', text: rLines[i] });
      } else if (i >= rLines.length) {
        result.push({ type: 'removed', text: lLines[i] });
      } else if (lLines[i] === rLines[i]) {
        result.push({ type: 'same', text: lLines[i] });
      } else {
        result.push({ type: 'removed', text: lLines[i] });
        result.push({ type: 'added', text: rLines[i] });
      }
    }
    setDiffLines(result);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Diff Checker</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <textarea value={left} onChange={e => setLeft(e.target.value)} placeholder="Texto original" className="p-3 border-2 border-gray-200 rounded-lg h-48 font-mono text-sm" />
        <textarea value={right} onChange={e => setRight(e.target.value)} placeholder="Texto modificado" className="p-3 border-2 border-gray-200 rounded-lg h-48 font-mono text-sm" />
      </div>
      <button onClick={computeDiff} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mb-4">Comparar</button>
      {diffLines.length > 0 && (
        <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
          {diffLines.map((line, i) => (
            <div key={i} className={`px-3 py-1 font-mono text-sm ${
              line.type === 'added' ? 'bg-green-100 text-green-800' :
              line.type === 'removed' ? 'bg-red-100 text-red-800' : 'bg-white'
            }`}>
              <span className="mr-2">{line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}</span>
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

export function DevToolsPage() {
  const [selectedTool, setSelectedTool] = useState<Tool>('base64');

  const renderTool = () => {
    switch (selectedTool) {
      case 'base64': return <Base64Tool />;
      case 'url': return <UrlEncoderTool />;
      case 'hash': return <HashGeneratorTool />;
      case 'qrcode': return <QrCodeTool />;
      case 'color': return <ColorConverterTool />;
      case 'sql': return <SqlFormatterTool />;
      case 'diff': return <DiffCheckerTool />;
      case 'regex': return <RegexTesterTool />;
      case 'jwt': return <JwtDecoderTool />;
      case 'jsfmt': return <JsFormatterTool />;
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Developer Tools</h1>
          <p className="text-gray-600">Free tools for developers. No login required.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {tools.map((tool) => (
            <button key={tool.id} onClick={() => setSelectedTool(tool.id)}
              className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                selectedTool === tool.id ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}>
              {tool.icon}
              <span className="text-xs font-medium text-center">{tool.label}</span>
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          {renderTool()}
        </div>
      </div>
    </div>
  );
}
