import { useState, useCallback } from 'react';
import { FileSpreadsheet, Copy, Check, Download, Upload, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';

function flattenObject(obj: Record<string, unknown>, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;
    const newKey = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value as Record<string, unknown>, newKey));
    } else if (Array.isArray(value)) {
      result[newKey] = JSON.stringify(value);
    } else {
      result[newKey] = value === null || value === undefined ? '' : String(value);
    }
  }
  return result;
}

function escapeCsvValue(val: string, delimiter: string): string {
  const firstChar = val.charAt(0);
  if (firstChar === '=' || firstChar === '+' || firstChar === '-' || firstChar === '@') {
    val = `'${val}`;
  }
  if (val.includes(delimiter) || val.includes('"') || val.includes('\n')) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

function arrayToCsv(data: Record<string, unknown>[], delimiter: string): string {
  if (data.length === 0) return '';
  const allKeys = new Set<string>();
  data.forEach(item => {
    const flat = flattenObject(item as Record<string, unknown>);
    Object.keys(flat).forEach(k => allKeys.add(k));
  });
  const headers = Array.from(allKeys);
  const lines = [
    headers.map(h => escapeCsvValue(h, delimiter)).join(delimiter),
    ...data.map(row => {
      const flat = flattenObject(row as Record<string, unknown>);
      return headers.map(h => escapeCsvValue(flat[h] || '', delimiter)).join(delimiter);
    }),
  ];
  return lines.join('\n');
}

export function JsonToCsv() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [delimiter, setDelimiter] = useState(',');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const convert = useCallback(() => {
    setError('');
    setOutput('');
    if (!input.trim()) {
      setError('Ingresa contenido JSON para convertir');
      return;
    }
    try {
      const parsed = JSON.parse(input);
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      const csv = arrayToCsv(arr, delimiter);
      setOutput(csv);
    } catch (e) {
      setError('JSON inválido: ' + (e instanceof Error ? e.message : 'error desconocido'));
    }
  }, [input, delimiter]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.csv';
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
        <label className="text-sm text-slate-600">Delimitador:</label>
        <select
          value={delimiter}
          onChange={(e) => setDelimiter(e.target.value)}
          className="input-field w-auto text-sm"
        >
          <option value=",">Comma (,)</option>
          <option value=";">Punto y coma (;)</option>
          <option value="\t">Tab</option>
          <option value="|">Pipe (|)</option>
        </select>
        <div className="ml-auto">
          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors">
            <Upload className="w-4 h-4" />
            Subir JSON
            <input type="file" className="hidden" accept=".json" onChange={handleFile} />
          </label>
        </div>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='[{"nombre": "Juan", "edad": 25}, {"nombre": "Ana", "edad": 30}]'
        className="input-field w-full h-48 font-mono text-sm resize-none"
      />

      <Button onClick={convert} className="w-full">
        <FileSpreadsheet className="w-4 h-4" />
        Convertir a CSV
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
            <span className="text-sm font-medium text-slate-700">CSV Generado</span>
            <div className="flex gap-2">
              <button onClick={handleCopy} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copiado' : 'Copiar'}
              </button>
              <button onClick={handleDownload} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                <Download className="w-4 h-4" />
                Descargar .csv
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
