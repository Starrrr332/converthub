import { useToastStore, type ToastType } from '../../store/toastStore';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const iconMap: Record<ToastType, typeof CheckCircle> = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const colorMap: Record<ToastType, string> = {
  success: 'border-l-green-500 bg-green-50 dark:bg-green-950/30',
  error: 'border-l-red-500 bg-red-50 dark:bg-red-950/30',
  info: 'border-l-blue-500 bg-blue-50 dark:bg-blue-950/30',
  warning: 'border-l-amber-500 bg-amber-50 dark:bg-amber-950/30',
};

const iconColorMap: Record<ToastType, string> = {
  success: 'text-green-600 dark:text-green-400',
  error: 'text-red-600 dark:text-red-400',
  info: 'text-blue-600 dark:text-blue-400',
  warning: 'text-amber-600 dark:text-amber-400',
};

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const removeToast = useToastStore((s) => s.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      aria-live="polite"
      aria-label="Notificaciones"
    >
      {toasts.map((toast, index) => {
        const Icon = iconMap[toast.type];
        return (
          <div
            key={toast.id}
            role="alert"
            className={`pointer-events-auto border-l-4 rounded-xl p-4 shadow-elevated border border-border/60 animate-slide-in-right ${colorMap[toast.type]}`}
            style={{
              animation: `slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1) both`,
              animationDelay: `${index * 0.05}s`,
            }}
          >
            <div className="flex items-start gap-3">
              <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColorMap[toast.type]}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary">{toast.message}</p>
                {toast.description && (
                  <p className="text-xs text-text-secondary mt-0.5">{toast.description}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors shrink-0"
              >
                <X className="w-4 h-4 text-text-muted" />
              </button>
            </div>
          </div>
        );
      })}
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(100%) scale(0.95); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
