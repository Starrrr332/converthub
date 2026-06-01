import { useState } from 'react';
import { Upload, Eye, Edit3, Bold, Italic, Code, List, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';

const sampleMarkdown = `# Bienvenido a ConvertHub

Este es un **editor de Markdown** en tiempo real.

## Características

- Soporte completo de Markdown
- Vista previa en tiempo real
- Exportar a HTML

### Código

\`\`\`javascript
function hello() {
  console.log("¡Hola mundo!");
}
\`\`\`

### Lista

1. Primer elemento
2. Segundo elemento
3. Tercer elemento

### Enlaces y fotos

[Más información](https://converthub.com)

---

*Creado con ❤️ por ConvertHub*
`;

function parseMarkdown(md: string): string {
  let html = md;
  
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>');
  
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 rounded text-sm">$1</code>');
  
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg my-3 overflow-x-auto text-sm"><code>$2</code></pre>');
  
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline" target="_blank">$1</a>');
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full rounded my-2" />');
  
  html = html.replace(/^---$/gm, '<hr class="my-4 border-gray-300" />');
  html = html.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-2">$1</blockquote>');
  
  const lines = html.split('\n');
  const result: string[] = [];
  let inList = false;
  
  for (const line of lines) {
    if (/^(\d+)\. (.+)$/.test(line)) {
      if (!inList) { result.push('<ol class="list-decimal pl-6 my-2">'); inList = true; }
      result.push(`<li class="my-1">${line.replace(/^\d+\. /, '')}</li>`);
    } else if (/^- (.+)$/.test(line)) {
      if (!inList) { result.push('<ul class="list-disc pl-6 my-2">'); inList = true; }
      result.push(`<li class="my-1">${line.replace(/^- /, '')}</li>`);
    } else {
      if (inList) { result.push('</ul>'); inList = false; }
      if (line.trim() === '') {
        result.push('<br />');
      } else if (!line.startsWith('<h') && !line.startsWith('<pre') && !line.startsWith('<hr') && !line.startsWith('<blockquote')) {
        result.push(`<p class="my-2">${line}</p>`);
      } else {
        result.push(line);
      }
    }
  }
  if (inList) result.push('</ul>');
  
  return result.join('\n');
}

export function MarkdownEditorPage() {
  const [markdown, setMarkdown] = useState(sampleMarkdown);
  const [showPreview, setShowPreview] = useState(true);
  const [fontSize, setFontSize] = useState(14);

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.getElementById('md-editor') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = markdown.substring(start, end);
    const newText = markdown.substring(0, start) + before + selected + after + markdown.substring(end);
    setMarkdown(newText);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setMarkdown(event.target?.result as string);
    reader.readAsText(file);
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadHtml = () => {
    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>ConvertHub Markdown</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
    pre { background: #1a1a2e; color: #e6e6e6; padding: 16px; border-radius: 8px; overflow-x: auto; }
    code { background: #f0f0f0; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
    blockquote { border-left: 4px solid #ccc; padding-left: 16px; color: #666; font-style: italic; }
    a { color: #2563eb; }
  </style>
</head>
<body>
${parseMarkdown(markdown)}
</body>
</html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Editor Markdown</h1>
          <p className="text-gray-600">Escribe Markdown con vista previa en tiempo real</p>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-xl shadow-lg p-3 mb-4">
          <div className="flex flex-wrap items-center gap-1">
            <input type="file" accept=".md,.markdown,.txt" onChange={handleFileUpload} className="hidden" id="md-upload" />
            <Button onClick={() => document.getElementById('md-upload')?.click()} variant="ghost" size="sm">
              <Upload className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 bg-gray-300 mx-1" />
            <Button onClick={() => insertMarkdown('**', '**')} variant="ghost" size="sm" title="Negrita">
              <Bold className="w-4 h-4" />
            </Button>
            <Button onClick={() => insertMarkdown('*', '*')} variant="ghost" size="sm" title="Itálica">
              <Italic className="w-4 h-4" />
            </Button>
            <Button onClick={() => insertMarkdown('`', '`')} variant="ghost" size="sm" title="Código inline">
              <Code className="w-4 h-4" />
            </Button>
            <Button onClick={() => insertMarkdown('[', '](url)')} variant="ghost" size="sm" title="Enlace">
              <LinkIcon className="w-4 h-4" />
            </Button>
            <Button onClick={() => insertMarkdown('![alt](', ')')} variant="ghost" size="sm" title="Imagen">
              <ImageIcon className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 bg-gray-300 mx-1" />
            <Button onClick={() => insertMarkdown('\n- ')} variant="ghost" size="sm" title="Lista">
              <List className="w-4 h-4" />
            </Button>
            <Button onClick={() => insertMarkdown('\n# ')} variant="ghost" size="sm" title="Título">
              H1
            </Button>
            <Button onClick={() => insertMarkdown('\n## ')} variant="ghost" size="sm" title="Subtítulo">
              H2
            </Button>
            <Button onClick={() => insertMarkdown('\n> ')} variant="ghost" size="sm" title="Cita">
              &gt;
            </Button>
            <Button onClick={() => insertMarkdown('\n---\n')} variant="ghost" size="sm" title="Línea horizontal">
              ---
            </Button>
            <div className="flex-1" />
            <Button onClick={() => setShowPreview(!showPreview)} variant={showPreview ? 'primary' : 'outline'} size="sm">
              <Eye className="w-4 h-4 mr-1" />
              Vista previa
            </Button>
            <Button onClick={handleDownload} variant="outline" size="sm">Descargar .md</Button>
            <Button onClick={downloadHtml} variant="outline" size="sm">Descargar .html</Button>
            <div className="flex items-center gap-2 ml-2">
              <label className="text-sm text-gray-600">Tamaño:</label>
              <input type="number" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))}
                min="10" max="24" className="w-14 p-1 border rounded text-sm" />
            </div>
          </div>
        </div>

        <div className={`grid gap-4 ${showPreview ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-2 bg-gray-50 border-b flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Markdown</span>
              <span className="text-xs text-gray-400 ml-auto">{markdown.length} caracteres</span>
            </div>
            <textarea
              id="md-editor"
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Escribe tu Markdown aquí..."
              className="w-full h-[600px] p-4 border-none focus:outline-none resize-none font-mono text-sm"
              style={{ fontSize: `${fontSize}px` }}
            />
          </div>

          {showPreview && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-2 bg-gray-50 border-b flex items-center gap-2">
                <Eye className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Vista previa</span>
              </div>
              <div
                className="h-[600px] overflow-y-auto p-6 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: parseMarkdown(markdown) }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
