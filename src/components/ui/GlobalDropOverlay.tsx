import { Upload } from 'lucide-react';

interface GlobalDropOverlayProps {
  isVisible: boolean;
}

export function GlobalDropOverlay({ isVisible }: GlobalDropOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-500/20 backdrop-blur-sm pointer-events-none">
      <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-2xl shadow-2xl border-2 border-dashed border-indigo-400">
        <div className="p-4 bg-indigo-100 rounded-xl">
          <Upload className="w-10 h-10 text-indigo-600" />
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-slate-900">Suelta tu archivo aquí</p>
          <p className="text-sm text-slate-500 mt-1">Se procesará automáticamente</p>
        </div>
      </div>
    </div>
  );
}
