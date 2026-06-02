import { useState } from 'react';
import { Save, Trash2, Download, Upload, FileText } from 'lucide-react';
import { useTemplatesStore } from '../../store/templatesStore';

interface TemplateManagerProps {
  toolPath: string;
  currentSettings: Record<string, unknown>;
  onApply: (settings: Record<string, unknown>) => void;
}

export function TemplateManager({ toolPath, currentSettings, onApply }: TemplateManagerProps) {
  const { templates, addTemplate, removeTemplate, exportTemplates, importTemplates } =
    useTemplatesStore();
  const [showSave, setShowSave] = useState(false);
  const [name, setName] = useState('');

  const toolTemplates = templates.filter((t) => t.toolPath === toolPath);

  const save = () => {
    if (!name.trim()) return;
    addTemplate(name.trim(), toolPath, currentSettings);
    setName('');
    setShowSave(false);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const text = await file.text();
      importTemplates(text);
    };
    input.click();
  };

  const handleExport = () => {
    const json = exportTemplates();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converthub-templates.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={() => setShowSave(!showSave)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-text-secondary hover:text-text bg-surface-secondary hover:bg-slate-200 rounded-lg transition-colors"
      >
        <Save className="w-3.5 h-3.5" /> Guardar plantilla
      </button>

      {showSave && (
        <div className="flex items-center gap-1.5">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && save()}
            placeholder="Nombre de la plantilla"
            className="px-2 py-1 border border-border rounded text-xs w-40"
            autoFocus
          />
          <button
            onClick={save}
            className="px-2 py-1 bg-brand-600 text-white text-xs rounded hover:bg-brand-700"
          >
            Guardar
          </button>
        </div>
      )}

      {toolTemplates.length > 0 && (
        <div className="relative group">
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-text-secondary hover:text-text bg-surface-secondary hover:bg-slate-200 rounded-lg transition-colors">
            <FileText className="w-3.5 h-3.5" /> Plantillas ({toolTemplates.length})
          </button>
          <div className="absolute top-full left-0 mt-1 w-56 bg-surface rounded-lg border border-border shadow-elevated py-1 z-50 hidden group-hover:block">
            {toolTemplates.map((tpl) => (
              <div
                key={tpl.id}
                className="flex items-center gap-2 px-3 py-2 hover:bg-surface-secondary"
              >
                <button
                  onClick={() => onApply(tpl.settings)}
                  className="flex-1 text-left text-sm text-text truncate"
                >
                  {tpl.name}
                </button>
                <button
                  onClick={() => removeTemplate(tpl.id)}
                  className="p-0.5 rounded hover:bg-red-100 text-text-muted hover:text-red-500"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleExport}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-text-secondary hover:text-text bg-surface-secondary hover:bg-slate-200 rounded-lg transition-colors"
        title="Exportar plantillas"
      >
        <Download className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={handleImport}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-text-secondary hover:text-text bg-surface-secondary hover:bg-slate-200 rounded-lg transition-colors"
        title="Importar plantillas"
      >
        <Upload className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
