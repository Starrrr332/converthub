import { useState } from 'react';

export function RegexTesterTool() {
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
