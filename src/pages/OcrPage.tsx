import { useState, useRef } from 'react';
import { Download, Copy, Check, FileText, Image as ImageIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function OcrPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState('');
  const workerRef = useRef<any>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setText('');
    setProgress('');
    const url = URL.createObjectURL(f);
    setPreview(url);
  };

  const runOcr = async () => {
    if (!file) return;
    setLoading(true);
    setProgress('Cargando motor OCR...');

    try {
      const Tesseract = await import('tesseract.js');
      const worker = await Tesseract.createWorker('spa+eng', 1, {
        logger: (m: any) => {
          if (m.status === 'recognizing text') {
            setProgress(`Reconociendo... ${Math.round(m.progress * 100)}%`);
          } else if (m.status === 'loading tesseract core') {
            setProgress('Cargando motor OCR...');
          } else if (m.status === 'initializing tesseract') {
            setProgress('Inicializando...');
          } else if (m.status === 'loading language traineddata') {
            setProgress('Cargando datos de idioma...');
          } else if (m.status === 'initializing api') {
            setProgress('Preparando...');
          }
        }
      });
      workerRef.current = worker;

      const { data } = await worker.recognize(file);
      setText(data.text);
      setProgress('');
    } catch (err) {
      setProgress('Error al procesar la imagen. Intenta con otra.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyText = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadText = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file?.name.replace(/\.[^.]+$/, '') || 'ocr'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clear = () => {
    setFile(null);
    setPreview('');
    setText('');
    setProgress('');
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
  };

  return (
    <div className="py-8 sm:py-12">
      <div className="page-container">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="section-heading">Imagen a Texto (OCR)</h1>
            <p className="section-subheading mx-auto">
              Extrae texto de imágenes y documentos escaneados. 100% privado, sin servidores.
            </p>
          </div>

          {!file ? (
            <div className="dropzone">
              <input type="file" accept="image/*" onChange={handleFile} className="hidden" id="ocr-upload" />
              <label htmlFor="ocr-upload" className="cursor-pointer block">
                <div className="inline-flex p-4 rounded-xl bg-brand-50 text-brand-600 mb-4">
                  <ImageIcon className="w-10 h-10" />
                </div>
                <p className="text-lg font-medium text-text mb-1">Sube una imagen</p>
                <p className="text-sm text-text-muted">PNG, JPG, WebP — sin límite de tamaño</p>
                <p className="text-xs text-text-muted mt-2">Soporta español e inglés</p>
              </label>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="content-panel p-4 sm:p-6">
                <div className="flex items-start gap-4">
                  <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-lg shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-text text-sm truncate">{file.name}</p>
                    <p className="text-xs text-text-muted mt-0.5">{(file.size / 1024).toFixed(1)} KB</p>
                    <div className="flex gap-2 mt-3">
                      <Button onClick={runOcr} disabled={loading} loading={loading} size="sm">
                        <FileText className="w-3.5 h-3.5" />
                        {loading ? 'Procesando...' : 'Extraer texto'}
                      </Button>
                      <Button onClick={clear} variant="ghost" size="sm">Cambiar imagen</Button>
                    </div>
                  </div>
                </div>
              </div>

              {progress && (
                <div className="flex items-center gap-2 p-3 bg-brand-50 rounded-lg text-sm text-brand-700">
                  <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                  {progress}
                </div>
              )}

              {text && (
                <div className="content-panel overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <p className="text-sm font-medium text-text">Texto extraído</p>
                    <div className="flex gap-1">
                      <button onClick={copyText} className="p-1.5 rounded-lg hover:bg-slate-100 text-text-secondary hover:text-text transition-colors" title="Copiar">
                        {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button onClick={downloadText} className="p-1.5 rounded-lg hover:bg-slate-100 text-text-secondary hover:text-text transition-colors" title="Descargar">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <pre className="p-4 text-sm text-text font-sans whitespace-pre-wrap max-h-96 overflow-y-auto">{text}</pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
