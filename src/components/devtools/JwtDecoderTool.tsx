import { useState } from 'react';

export function JwtDecoderTool() {
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
