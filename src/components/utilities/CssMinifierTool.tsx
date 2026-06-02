import { useState } from 'react';
import { Copy } from 'lucide-react';
import { Button } from '../ui/Button';

function cssMinify(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{}:;,])\s*/g, '$1').replace(/;}/g, '}').trim();
}

export function CssMinifierTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">CSS Minifier</h3>
      <Button onClick={() => setOutput(cssMinify(input))} className="mb-4">Minimizar</Button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="/* CSS */" className="p-3 border-2 border-gray-200 rounded-lg h-48 font-mono text-sm" />
        <textarea readOnly value={output} className="p-3 border-2 border-gray-200 rounded-lg h-48 font-mono text-sm bg-gray-50" />
      </div>
      {output && (
        <div className="mt-2 flex gap-2">
          <Button onClick={() => navigator.clipboard.writeText(output)} variant="outline"><Copy className="w-4 h-4 mr-2" /> Copiar</Button>
          <span className="text-sm text-gray-500 self-center">Original: {input.length}B → {output.length}B ({Math.round((1 - output.length / input.length) * 100)}% menor)</span>
        </div>
      )}
    </div>
  );
}
