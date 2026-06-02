import { useState } from 'react';

export function JsFormatterTool() {
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
