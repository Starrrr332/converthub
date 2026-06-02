import { useState, useRef } from 'react';
import { Download } from 'lucide-react';
import { Button } from '../ui/Button';
import { sanitizeUrl } from '../../utils/sanitization';
import DOMPurify from 'dompurify';

function renderMarkdown(md: string): string {
  let html = md
    .replace(/```([\s\S]*?)```/g, '<pre class="bg-slate-100 rounded-lg p-4 font-mono text-sm overflow-x-auto my-4"><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code class="bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold mt-6 mb-3 text-slate-800">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mt-8 mb-4 text-slate-900 border-b border-slate-200 pb-2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mt-8 mb-4 text-slate-900">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^\- (.+)$/gm, '<li class="ml-4 list-disc text-slate-700">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal text-slate-700">$1</li>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m: string, text: string, url: string) =>
      `<a href="${sanitizeUrl(url)}" class="text-indigo-600 underline">${text}</a>`)
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-indigo-300 pl-4 italic text-slate-600 my-2">$1</blockquote>')
    .replace(/^---$/gm, '<hr class="my-6 border-slate-200" />')
    .replace(/\n\n/g, '</p><p class="text-slate-700 leading-relaxed mb-3">')
    .replace(/\n/g, '<br />');

  html = `<p class="text-slate-700 leading-relaxed mb-3">${html}</p>`;
  return html;
}

const DEFAULT_MD = `# Documento de Ejemplo

## Introducción

Este es un **ejemplo** de cómo se ve un documento Markdown exportado a PDF.

### Características

- Tipografía profesional
- Diseño limpio
- Soporte para *cursiva* y **negrita**
- Listas ordenadas y desordenadas

### Código

\`\`\`javascript
const hello = "world";
console.log(hello);
\`\`\`

### Cita

> Esta es una cita bloque que aparecerá con un estilo especial en el PDF.

---

Fin del documento.`;

export function MdToPdf() {
  const [markdown, setMarkdown] = useState(DEFAULT_MD);
  const [loading, setLoading] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const exportPdf = async () => {
    setLoading(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = previewRef.current;
      if (!element) return;

      await html2pdf()
        .set({
          margin: 15,
          filename: 'documento.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
        })
        .from(element)
        .save();
    } catch {
      // silent
    }
    setLoading(false);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Markdown a PDF</h3>

      <div className="flex gap-2 mb-4">
        <Button onClick={exportPdf} loading={loading}>
          <Download className="w-4 h-4 mr-1" /> Descargar PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">Markdown</label>
          <textarea
            value={markdown}
            onChange={e => setMarkdown(e.target.value)}
            className="input-field h-[500px] font-mono text-sm resize-y"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">Vista previa</label>
          <div
            ref={previewRef}
            className="bg-white border border-border rounded-lg p-8 h-[500px] overflow-y-auto prose prose-slate max-w-none"
          >
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(renderMarkdown(markdown)) }} />
          </div>
        </div>
      </div>
    </div>
  );
}
