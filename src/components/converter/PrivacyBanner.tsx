import { Shield, ExternalLink } from 'lucide-react';

interface PrivacyBannerProps {
  onAccept?: () => void;
  showAcceptButton?: boolean;
}

export function PrivacyBanner({
  onAccept,
  showAcceptButton = false
}: PrivacyBannerProps) {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <Shield className="w-5 h-5 text-green-600" />
        </div>
        
        <div className="flex-1">
          <p className="text-sm text-green-800">
            <strong>Tus archivos se procesan en tu navegador</strong> y nunca se envían a ningún servidor. 
            Tu privacidad está garantizada.
          </p>
          
          <a
            href="/privacy"
            className="inline-flex items-center gap-1 mt-2 text-xs text-green-600 hover:text-green-700"
          >
            Ver política de privacidad
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        
        {showAcceptButton && onAccept && (
          <button
            onClick={onAccept}
            className="flex-shrink-0 px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-lg hover:bg-green-200 transition-colors"
          >
            Entendido
          </button>
        )}
      </div>
    </div>
  );
}
