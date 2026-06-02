import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Download, Copy, Check, Braces } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PageLayout } from '../components/layout/PageLayout';

export function JsonFormatterPage() {
  const { t } = useTranslation('common');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [indent, setIndent] = useState(2);

  const formatJson = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
      setError(null);
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError(null);
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInput(content);
      try {
        const parsed = JSON.parse(content);
        setOutput(JSON.stringify(parsed, null, indent));
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      }
    };
    reader.readAsText(file);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output || input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([output || input], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const validateJson = () => {
    try {
      JSON.parse(input);
      setError(null);
      alert('JSON válido');
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const extractKeys = () => {
    try {
      const parsed = JSON.parse(input);
      const keys = Object.keys(parsed);
      setOutput(keys.join('\n'));
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <PageLayout
      wide
      title={t('nav.editors.json')}
      subtitle={t('nav.editors.jsonDesc')}
      breadcrumb={[{ label: t('nav.home'), to: '/' }, { label: t('nav.editors.json') }]}
    >
      <div className="content-panel p-4 mb-4">
        <div className="flex flex-wrap gap-2">
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="hidden"
            id="json-upload"
          />
          <Button
            onClick={() => document.getElementById('json-upload')?.click()}
            variant="outline"
            size="sm"
          >
            <Upload className="w-4 h-4 mr-1" /> Abrir
          </Button>
          <Button onClick={formatJson} size="sm">
            <Braces className="w-4 h-4 mr-1" /> Formatear
          </Button>
          <Button onClick={minifyJson} variant="outline" size="sm">
            Minificar
          </Button>
          <Button onClick={validateJson} variant="outline" size="sm">
            Validar
          </Button>
          <Button onClick={extractKeys} variant="outline" size="sm">
            Extraer claves
          </Button>
          <Button onClick={handleCopy} variant="outline" size="sm">
            {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
            {copied ? 'Copiado' : 'Copiar'}
          </Button>
          <Button onClick={handleDownload} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1" /> Descargar
          </Button>
          <div className="flex items-center gap-2 ml-auto">
            <label className="text-sm text-gray-600">Indent:</label>
            <select
              value={indent}
              onChange={(e) => setIndent(Number(e.target.value))}
              className="p-1 border rounded text-sm"
            >
              <option value={2}>2 espacios</option>
              <option value={4}>4 espacios</option>
              <option value={8}>8 espacios</option>
              <option value={'\t'}>Tab</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">Error: {error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-2 bg-gray-50 border-b">
            <span className="text-sm font-medium text-gray-700">Entrada</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"key": "value"}'
            className="w-full h-[500px] p-4 border-none focus:outline-none resize-none font-mono text-sm"
          />
        </div>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-2 bg-gray-50 border-b">
            <span className="text-sm font-medium text-gray-700">Salida</span>
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="El JSON formateado aparecerá aquí..."
            className="w-full h-[500px] p-4 border-none focus:outline-none resize-none font-mono text-sm bg-gray-50"
          />
        </div>
      </div>
    </PageLayout>
  );
}
