import { useState } from 'react';
import { Copy } from 'lucide-react';
import { Button } from '../ui/Button';

function entityEncode(text: string): string {
  return text.replace(
    /[&<>"'/]/g,
    (c) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#47;',
      })[c] || c,
  );
}

function entityDecode(text: string): string {
  return text.replace(
    /&(?:amp|lt|gt|quot|#39|#47);/g,
    (c) =>
      ({
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#39;': "'",
        '&#47;': '/',
      })[c] || c,
  );
}

export function HtmlEntityTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">HTML Entities</h3>
      <div className="flex gap-2 mb-4">
        <Button onClick={() => setOutput(entityEncode(input))}>Codificar</Button>
        <Button onClick={() => setOutput(entityDecode(input))}>Decodificar</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Entrada..."
          className="p-3 border-2 border-gray-200 rounded-lg h-32 font-mono text-sm"
        />
        <textarea
          readOnly
          value={output}
          className="p-3 border-2 border-gray-200 rounded-lg h-32 font-mono text-sm bg-gray-50"
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
