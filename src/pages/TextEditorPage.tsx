import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Download, Copy, Trash2, FileText, WrapText, Type } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PageLayout } from '../components/layout/PageLayout';

type CaseType = 'upper' | 'lower' | 'title' | 'sentence' | 'none';

export function TextEditorPage() {
  const { t } = useTranslation('common');
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('document.txt');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [lineCount, setLineCount] = useState(1);
  const [fontSize, setFontSize] = useState(14);
  const [wordWrap, setWordWrap] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateCounts = (value: string) => {
    setText(value);
    setCharCount(value.length);
    setWordCount(value.trim() ? value.trim().split(/\s+/).length : 0);
    setLineCount(value.split('\n').length);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      updateCounts(content);
    };
    reader.readAsText(file);
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  const transformCase = (type: CaseType) => {
    let result = text;
    switch (type) {
      case 'upper': result = text.toUpperCase(); break;
      case 'lower': result = text.toLowerCase(); break;
      case 'title': 
        result = text.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
        break;
      case 'sentence':
        result = text.replace(/(^\s*|[.!?]\s+)([a-z])/g, (_match, sep, letter) => sep + letter.toUpperCase());
        break;
    }
    updateCounts(result);
  };

  const removeDuplicates = () => {
    const lines = text.split('\n');
    const unique = [...new Set(lines)];
    updateCounts(unique.join('\n'));
  };

  const sortLines = (ascending: boolean) => {
    const lines = text.split('\n');
    lines.sort((a, b) => ascending ? a.localeCompare(b) : b.localeCompare(a));
    updateCounts(lines.join('\n'));
  };

  const removeEmptyLines = () => {
    const lines = text.split('\n').filter(l => l.trim() !== '');
    updateCounts(lines.join('\n'));
  };

  const findAndReplace = () => {
    const find = prompt('Buscar:');
    if (!find) return;
    const replace = prompt('Reemplazar con:');
    if (replace === null) return;
    updateCounts(text.split(find).join(replace));
  };

  const insertTimestamp = () => {
    const now = new Date().toLocaleString('es-ES');
    updateCounts(text + now);
  };

  return (
    <PageLayout
      wide
      title={t('nav.editors.text')}
      subtitle={t('nav.editors.textDesc')}
      breadcrumb={[{ label: t('nav.home'), to: '/' }, { label: t('nav.editors.text') }]}
    >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="content-panel p-4 space-y-4">
              {/* File */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">Archivo</h3>
                <div className="space-y-2">
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".txt,.md,.json,.csv,.log,.xml,.html,.css,.js" />
                  <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full text-sm">
                    <Upload className="w-4 h-4 mr-2" /> Abrir archivo
                  </Button>
                  <Button onClick={handleDownload} variant="outline" className="w-full text-sm">
                    <Download className="w-4 h-4 mr-2" /> Guardar
                  </Button>
                </div>
              </div>

              {/* Format */}
              <div className="pt-3 border-t">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">Formato</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Type className="w-4 h-4 text-gray-500" />
                    <label className="text-sm text-gray-600">Tamaño:</label>
                    <input type="number" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))}
                      min="10" max="24" className="w-16 p-1 border rounded text-sm" />
                  </div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={wordWrap} onChange={(e) => setWordWrap(e.target.checked)} />
                    <WrapText className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">Ajuste de línea</span>
                  </label>
                </div>
              </div>

              {/* Text Case */}
              <div className="pt-3 border-t">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">Convertir texto</h3>
                <div className="grid grid-cols-2 gap-1">
                  <Button onClick={() => transformCase('upper')} variant="outline" className="text-xs py-1">MAYÚSCULAS</Button>
                  <Button onClick={() => transformCase('lower')} variant="outline" className="text-xs py-1">minúsculas</Button>
                  <Button onClick={() => transformCase('title')} variant="outline" className="text-xs py-1">Titulo</Button>
                  <Button onClick={() => transformCase('sentence')} variant="outline" className="text-xs py-1">Oración</Button>
                </div>
              </div>

              {/* Tools */}
              <div className="pt-3 border-t">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">Herramientas</h3>
                <div className="space-y-1">
                  <Button onClick={findAndReplace} variant="ghost" className="w-full justify-start text-sm py-1">Buscar y reemplazar</Button>
                  <Button onClick={removeDuplicates} variant="ghost" className="w-full justify-start text-sm py-1">Eliminar duplicados</Button>
                  <Button onClick={removeEmptyLines} variant="ghost" className="w-full justify-start text-sm py-1">Eliminar líneas vacías</Button>
                  <Button onClick={() => sortLines(true)} variant="ghost" className="w-full justify-start text-sm py-1">Ordenar A-Z</Button>
                  <Button onClick={() => sortLines(false)} variant="ghost" className="w-full justify-start text-sm py-1">Ordenar Z-A</Button>
                  <Button onClick={insertTimestamp} variant="ghost" className="w-full justify-start text-sm py-1">Insertar fecha/hora</Button>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t">
                <div className="space-y-1">
                  <Button onClick={handleCopy} variant="ghost" className="w-full justify-start text-sm py-1">
                    <Copy className="w-4 h-4 mr-2" /> Copiar todo
                  </Button>
                  <Button onClick={() => updateCounts('')} variant="ghost" className="w-full justify-start text-sm py-1 text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" /> Limpiar
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Editor */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-2 bg-gray-50 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <input type="text" value={fileName} onChange={(e) => setFileName(e.target.value)}
                    className="bg-transparent text-sm font-medium text-gray-700 border-none focus:outline-none focus:ring-0" />
                </div>
                <div className="flex gap-4 text-xs text-gray-500">
                  <span>{charCount} caracteres</span>
                  <span>{wordCount} palabras</span>
                  <span>{lineCount} líneas</span>
                </div>
              </div>
              <textarea
                value={text}
                onChange={(e) => updateCounts(e.target.value)}
                placeholder="Escribe o pega tu texto aquí..."
                className="w-full h-[600px] p-4 border-none focus:outline-none resize-none font-mono"
                style={{ fontSize: `${fontSize}px`, whiteSpace: wordWrap ? 'pre-wrap' : 'pre' }}
              />
            </div>
          </div>
        </div>
    </PageLayout>
  );
}
