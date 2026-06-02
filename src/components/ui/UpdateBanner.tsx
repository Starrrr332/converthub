import { RefreshCw, X } from 'lucide-react';
import { usePWA } from '../../hooks/usePWA';
import { useState } from 'react';

export function UpdateBanner() {
  const { updateAvailable, updateApp } = usePWA();
  const [dismissed, setDismissed] = useState(false);

  if (!updateAvailable || dismissed) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
      <div className="flex items-center gap-3 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-elevated">
        <RefreshCw className="w-4 h-4 shrink-0 text-accent-400" />
        <p className="text-sm font-medium flex-1">Nueva versión disponible</p>
        <button
          onClick={updateApp}
          className="px-3 py-1.5 text-xs font-semibold bg-accent-500 hover:bg-accent-600 rounded-lg transition-colors"
        >
          Actualizar
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 hover:bg-white/10 rounded-md transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
