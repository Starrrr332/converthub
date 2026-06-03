import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Keyboard, ArrowUpDown, Search, Star, ArrowRight } from 'lucide-react';
import { useFocusTrap } from '../../hooks/useFocusTrap';

export function ShortcutsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const focusTrapRef = useFocusTrap(isOpen);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shortcuts = [
    { keys: ['Ctrl', 'K'], icon: Search, desc: t('shortcuts.search', 'Buscar herramienta') },
    { keys: ['Ctrl', '1-9'], icon: Star, desc: t('shortcuts.favorites', 'Ir a favorito N') },
    { keys: ['?'], icon: Keyboard, desc: t('shortcuts.help', 'Abrir esta ayuda') },
    { keys: ['Esc'], icon: X, desc: t('shortcuts.close', 'Cerrar modales') },
    { keys: ['↑', '↓'], icon: ArrowUpDown, desc: t('shortcuts.navigate', 'Navegar resultados') },
    { keys: ['→'], icon: ArrowRight, desc: t('shortcuts.open', 'Abrir seleccionado') },
  ];

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={focusTrapRef}
        role="dialog"
        aria-modal="true"
        aria-label="Atajos de teclado"
        className="relative w-full max-w-md bg-surface rounded-2xl shadow-2xl border border-border overflow-hidden animate-scale-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-accent-50 text-accent-600">
              <Keyboard className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-text-primary">
              {t('shortcuts.title', 'Atajos de teclado')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-secondary transition-colors"
          >
            <X className="w-4 h-4 text-text-muted" />
          </button>
        </div>

        {/* Shortcuts list */}
        <div className="p-6 space-y-1">
          {shortcuts.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={i}
                className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-surface-secondary transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-text-muted" />
                  <span className="text-sm text-text-primary">{s.desc}</span>
                </div>
                <div className="flex items-center gap-1">
                  {s.keys.map((key, j) => (
                    <span key={j}>
                      <kbd className="px-1.5 py-0.5 text-[10px] font-medium bg-surface-secondary border border-border rounded shadow-sm text-text-muted">
                        {key}
                      </kbd>
                      {j < s.keys.length - 1 && (
                        <span className="text-text-muted mx-1 text-xs">+</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-border bg-surface-secondary">
          <p className="text-xs text-text-muted text-center">
            {t('shortcuts.footer', 'Presiona ? en cualquier momento para abrir esta ayuda')}
          </p>
        </div>
      </div>
    </div>
  );
}
