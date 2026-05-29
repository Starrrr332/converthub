import { useTranslation } from 'react-i18next';
import { Check, AlertCircle, Loader2 } from 'lucide-react';

interface ProgressIndicatorProps {
  progress: number;
  status: 'idle' | 'converting' | 'complete' | 'error';
  currentFile?: string;
}

export function ProgressIndicator({
  progress,
  status,
  currentFile
}: ProgressIndicatorProps) {
  const { t } = useTranslation('converter');
  
  const getStatusIcon = () => {
    switch (status) {
      case 'converting':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'complete':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
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
  
  const getStatusColor = () => {
    switch (status) {
      case 'converting':
        return 'bg-blue-500';
      case 'complete':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
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
          <span className="text-sm font-medium text-gray-700">
            {getStatusText()}
          </span>
        </div>
        {status === 'converting' && (
          <span className="text-sm text-gray-500">{progress}%</span>
        )}
      </div>
      
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${getStatusColor()}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
