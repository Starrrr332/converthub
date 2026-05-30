import { useState } from 'react';
import { ArrowLeftRight, Copy, Check } from 'lucide-react';
import { Button } from '../ui/Button';

export function UrlEncoderTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = () => {
    setError(null);
    try {
      if (mode === 'encode') {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input));
      }
    } catch {
      setError('Invalid input');
      setOutput('');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <button
          onClick={() => { setMode('encode'); setOutput(''); setError(null); }}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${mode === 'encode' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}
        >
          Encode
        </button>
        <button
          onClick={() => { setMode('decode'); setOutput(''); setError(null); }}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${mode === 'decode' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}
        >
          Decode
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {mode === 'encode' ? 'URL or text' : 'Encoded URL'}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encode' ? 'Enter URL or text to encode...' : 'Enter encoded URL to decode...'}
          className="input-field h-32 font-mono text-sm"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button onClick={handleConvert} disabled={!input} className="w-full">
        <ArrowLeftRight className="w-4 h-4 mr-2" />
        {mode === 'encode' ? 'Encode' : 'Decode'}
      </Button>

      {output && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-gray-700">Result</label>
            <button onClick={handleCopy} className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            className="input-field h-32 font-mono text-sm bg-gray-50"
          />
        </div>
      )}
    </div>
  );
}
