import { useState } from 'react';

export function SqlFormatterTool() {
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
