import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, AlertCircle, Loader2 } from 'lucide-react';

interface ProgressIndicatorProps {
  progress: number;
  status: 'idle' | 'converting' | 'complete' | 'error';
  currentFile?: string;
}

export const ProgressIndicator = memo(function ProgressIndicator({
  progress,
  status,
  currentFile,
}: ProgressIndicatorProps) {
  const { t } = useTranslation('converter');

  const getStatusIcon = () => {
    switch (status) {
      case 'converting':
        return <Loader2 className="w-5 h-5 text-accent-400 animate-spin" />;
      case 'complete':
        return <Check className="w-5 h-5 text-accent-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-error" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'converting':
        return currentFile
          ? t('batch.converting', { current: currentFile, total: '' })
          : t('progress.converting');
      case 'complete':
        return t('progress.complete');
      case 'error':
        return t('progress.error');
      default:
        return t('progress.idle');
    }
  };

  if (status === 'idle') {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="text-sm font-medium text-text-primary">{getStatusText()}</span>
        </div>
        {status === 'converting' && <span className="text-sm text-text-muted">{progress}%</span>}
      </div>

      <div className="h-2 bg-surface-secondary rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            status === 'converting'
              ? 'bg-accent-400'
              : status === 'complete'
                ? 'bg-accent-500'
                : status === 'error'
                  ? 'bg-error'
                  : 'bg-surface-secondary'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
});
