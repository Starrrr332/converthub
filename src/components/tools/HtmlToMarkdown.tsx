import { useState, useCallback } from 'react';
import TurndownService from 'turndown';
import { FileCode, Copy, Check, Download, Upload, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
});

export function HtmlToMarkdown() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const convert = useCallback(() => {
    setError('');
    setOutput('');
    if (!input.trim()) {
      setError('Ingresa contenido HTML para convertir');
      return;
    }
    try {
      const markdown = turndown.turndown(input);
      setOutput(markdown);
    } catch (e) {
      setError('Error al convertir: ' + (e instanceof Error ? e.message : 'error desconocido'));
    }
  }, [input]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setInput(ev.target?.result as string);
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="ml-auto">
          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors">
            <Upload className="w-4 h-4" />
            Subir HTML
            <input type="file" className="hidden" accept=".html,.htm" onChange={handleFile} />
          </label>
        </div>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="<h1>Título</h1><p>Contenido en HTML...</p>"
        className="input-field w-full h-48 font-mono text-sm resize-none"
      />

      <Button onClick={convert} className="w-full">
        <FileCode className="w-4 h-4" />
        Convertir a Markdown
      </Button>

      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {output && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Markdown Generado</span>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                {copied ? 'Copiado' : 'Copiar'}
              </button>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Descargar .md
              </button>
            </div>
          </div>
          <textarea
            readOnly
            value={output}
            className="input-field w-full h-48 font-mono text-sm resize-none bg-green-50 border-green-200"
          />
        </div>
      )}
    </div>
  );
}
