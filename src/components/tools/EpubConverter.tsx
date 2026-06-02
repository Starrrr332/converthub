import { useState, useRef, useCallback } from 'react';
import { Download, FileText } from 'lucide-react';
import { Button } from '../ui/Button';

export function EpubConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File | undefined) => {
    if (!f) return;
    if (!f.name.toLowerCase().endsWith('.epub')) {
      setError('Solo se aceptan archivos .epub');
      return;
    }
    setFile(f);
    setError('');
    setResult(null);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  const convert = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const ePubModule = await import('epubjs');
      const ePub = ePubModule.default;
      const arrayBuffer = await file.arrayBuffer();
      const book = ePub(arrayBuffer);
      await book.ready;

      const { PDFDocument } = await import('pdf-lib');
      const pdfDoc = await PDFDocument.create();

      const spine = book.spine as { each: (fn: (section: Record<string, string>) => void) => void };
      const spineItems: Array<Record<string, string>> = [];
      spine.each((section: Record<string, string>) => {
        spineItems.push(section);
      });

      for (const item of spineItems) {
        try {
          const href = item.href as string;
          const contents = await book.load(href);
          const body = (contents as { ownerDocument: { body: HTMLElement } }).ownerDocument.body;

          const text = body.textContent?.trim();
          if (text) {
            const page = pdfDoc.addPage([595.28, 841.89]);
            const font = await pdfDoc.embedFont('Helvetica');
            const lines: string[] = [];
            let currentLine = '';
            for (const char of text) {
              currentLine += char;
              if (currentLine.length >= 80) {
                lines.push(currentLine);
                currentLine = '';
              }
            }
            if (currentLine) lines.push(currentLine);

            let y = 790;
            for (const line of lines.slice(0, 50)) {
              if (y < 50) break;
              page.drawText(line, {
                x: 50,
                y,
                size: 12,
                font,
                maxWidth: 495,
              });
              y -= 20;
            }
          }
        } catch {
          // skip problematic sections
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setResult({ blob, url });
    } catch {
      setError('Error al procesar el archivo EPUB. Asegúrate de que sea válido.');
    }
    setLoading(false);
  };

  const download = () => {
    if (!result || !file) return;
    const baseName = file.name.replace(/\.epub$/i, '');
    const a = document.createElement('a');
    a.href = result.url;
    a.download = `${baseName}.pdf`;
    a.click();
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">EPUB a PDF</h3>
      <p className="text-sm text-text-secondary mb-4">
        Convierte libros electrónicos EPUB a documentos PDF.
      </p>

      <label
        className={`dropzone flex flex-col items-center justify-center h-32 cursor-pointer mb-4 ${dragOver ? 'dropzone-active' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
      >
        <FileText className="w-8 h-8 text-text-muted mb-2" />
        <p className="text-sm text-text-secondary">
          {file ? file.name : 'Arrastra un archivo .epub'}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept=".epub"
          onChange={(e) => handleFile(e.target.files?.[0])}
          className="hidden"
        />
      </label>

      {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm mb-4">{error}</div>}

      <Button onClick={convert} disabled={!file || loading}>
        {loading ? 'Convirtiendo...' : 'Convertir a PDF'}
      </Button>

      {result && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-700 font-medium mb-1">Conversión exitosa</p>
          <p className="text-xs text-green-600 mb-3">
            Tamaño: {(result.blob.size / 1024).toFixed(1)} KB
          </p>
          <Button onClick={download} size="sm">
            <Download className="w-4 h-4 mr-1" /> Descargar PDF
          </Button>
        </div>
      )}
    </div>
  );
}
