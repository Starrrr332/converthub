import { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { useShareConfig } from '../../hooks/useShareConfig';

interface ShareButtonProps {
  params?: Record<string, string>;
  className?: string;
}

export function ShareButton({ params, className = '' }: ShareButtonProps) {
  const { setConfig, shareUrl } = useShareConfig();
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (params) setConfig(params);
    const ok = shareUrl();
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-text-secondary hover:text-text bg-surface-secondary hover:bg-slate-200 rounded-lg transition-colors ${className}`}
    >
      {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Share2 className="w-3.5 h-3.5" />}
      {copied ? 'Copiado!' : 'Compartir'}
    </button>
  );
}
