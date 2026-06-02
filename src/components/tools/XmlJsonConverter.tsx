import { useState, useCallback } from 'react';
import { ArrowLeftRight, Copy, Check, Download, Upload, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';

type ConvertMode = 'xml-to-json' | 'json-to-xml';

function parseXmlToJson(xml: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');
  const errorNode = doc.querySelector('parsererror');
  if (errorNode) {
    throw new Error('XML inválido: ' + errorNode.textContent);
  }
  const result = xmlNodeToObj(doc.documentElement);
  return JSON.stringify(result, null, 2);
}

function xmlNodeToObj(node: Element): Record<string, unknown> {
  const obj: Record<string, unknown> = {};
  if (node.attributes && node.attributes.length > 0) {
    const attrs: Record<string, string> = {};
    for (let i = 0; i < node.attributes.length; i++) {
      const attr = node.attributes[i];
      attrs[attr.name] = attr.value;
    }
    obj['@attributes'] = attrs;
  }
  if (node.childNodes.length === 1 && node.childNodes[0].nodeType === 3) {
    const text = node.textContent?.trim() || '';
    if (Object.keys(obj).length === 0) return { '#text': text } as Record<string, unknown>;
    obj['#text'] = text;
  } else {
    for (let i = 0; i < node.childNodes.length; i++) {
      const child = node.childNodes[i] as Element;
      if (child.nodeType === 1) {
        const childName = child.nodeName;
        const childObj = xmlNodeToObj(child);
        if (obj[childName]) {
          if (!Array.isArray(obj[childName])) {
            obj[childName] = [obj[childName]];
          }
          (obj[childName] as unknown[]).push(childObj);
        } else {
          obj[childName] = childObj;
        }
      }
    }
  }
  return obj;
}

function jsonToXml(jsonStr: string, rootName = 'root'): string {
  const obj = JSON.parse(jsonStr);
  return '<?xml version="1.0" encoding="UTF-8"?>\n' + objToXml(obj, rootName, 0);
}

function objToXml(obj: unknown, tagName: string, indent: number): string {
  const pad = '  '.repeat(indent);
  if (obj === null || obj === undefined) {
    return `${pad}<${tagName}/>\n`;
  }
  if (typeof obj !== 'object') {
    return `${pad}<${tagName}>${escapeXml(String(obj))}</${tagName}>\n`;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => objToXml(item, tagName, indent)).join('');
  }
  let attrs = '';
  let children = '';
  const entries = Object.entries(obj as Record<string, unknown>);
  for (const [key, value] of entries) {
    if (key === '@attributes') {
      const attrEntries = Object.entries(value as Record<string, string>);
      attrs = attrEntries.map(([k, v]) => ` ${k}="${escapeXml(String(v))}"`).join('');
    } else if (key === '#text') {
      children = escapeXml(String(value));
    } else {
      children += objToXml(value, key, indent + 1);
    }
  }
  if (children === '' && !attrs) {
    return `${pad}<${tagName}${attrs}/>\n`;
  }
  if (children.includes('\n') && children.trim()) {
    return `${pad}<${tagName}${attrs}>\n${children}${pad}</${tagName}>\n`;
  }
  return `${pad}<${tagName}${attrs}>${children}</${tagName}>\n`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function XmlJsonConverter() {
  const [mode, setMode] = useState<ConvertMode>('xml-to-json');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const convert = useCallback(() => {
    setError('');
    setOutput('');
    if (!input.trim()) {
      setError('Ingresa contenido para convertir');
      return;
    }
    try {
      if (mode === 'xml-to-json') {
        setOutput(parseXmlToJson(input));
      } else {
        setOutput(jsonToXml(input));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al convertir');
    }
  }, [input, mode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = mode === 'xml-to-json' ? 'json' : 'xml';
    const mime = mode === 'xml-to-json' ? 'application/json' : 'application/xml';
    const blob = new Blob([output], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setInput(ev.target?.result as string);
      if (mode === 'json-to-xml' && file.name.endsWith('.json')) {
        setMode('json-to-xml');
      } else if (mode === 'xml-to-json' && file.name.endsWith('.xml')) {
        setMode('xml-to-json');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setMode('xml-to-json')}
          className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
            mode === 'xml-to-json'
              ? 'bg-indigo-100 text-indigo-700'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          XML → JSON
        </button>
        <button
          onClick={() => setMode('json-to-xml')}
          className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
            mode === 'json-to-xml'
              ? 'bg-indigo-100 text-indigo-700'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          JSON → XML
        </button>
        <div className="ml-auto">
          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors">
            <Upload className="w-4 h-4" />
            Subir archivo
            <input type="file" className="hidden" accept=".xml,.json" onChange={handleFile} />
          </label>
        </div>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={mode === 'xml-to-json' ? 'Pega tu XML aquí...' : 'Pega tu JSON aquí...'}
        className="input-field w-full h-48 font-mono text-sm resize-none"
      />

      <Button onClick={convert} className="w-full">
        <ArrowLeftRight className="w-4 h-4" />
        Convertir
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
            <span className="text-sm font-medium text-slate-700">Resultado</span>
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
                Descargar
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
