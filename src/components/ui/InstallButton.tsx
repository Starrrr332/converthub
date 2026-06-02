import { Download } from 'lucide-react';
import { usePWA } from '../../hooks/usePWA';

export function InstallButton() {
  const { isInstallable, isInstalled, install } = usePWA();

  if (isInstalled || !isInstallable) return null;

  return (
    <button
      onClick={install}
      className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-accent-700 bg-accent-50 hover:bg-accent-100 rounded-full transition-colors border border-accent-200"
      title="Instalar ConvertHub"
    >
      <Download className="w-3.5 h-3.5" />
      Instalar
    </button>
  );
}
