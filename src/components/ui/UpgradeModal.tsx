import { useTranslation } from 'react-i18next';
import { X, Lock, Star } from 'lucide-react';
import { Button } from '../ui/Button';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
}

export function UpgradeModal({ isOpen, onClose, feature }: UpgradeModalProps) {
  const { t } = useTranslation('converter');
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white text-center">
          <div className="inline-flex p-3 bg-white/20 rounded-full mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {t('upgrade.title')}
          </h2>
          <p className="text-blue-100">
            {feature ? t('upgrade.featureLocked', { feature }) : t('upgrade.subtitle')}
          </p>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-700">{t('upgrade.benefits.unlimited')}</span>
            </div>
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-700">{t('upgrade.benefits.noAds')}</span>
            </div>
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-700">{t('upgrade.benefits.allFormats')}</span>
            </div>
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-700">{t('upgrade.benefits.largeFiles')}</span>
            </div>
          </div>
          
          {/* Price */}
          <div className="text-center p-4 bg-gray-50 rounded-xl mb-6">
            <p className="text-sm text-gray-500">{t('upgrade.priceLabel')}</p>
            <p className="text-3xl font-bold text-gray-900">$5.50 <span className="text-sm font-normal">USD/mes</span></p>
            <p className="text-sm text-green-600 mt-1">{t('upgrade.annualDeal')}</p>
          </div>
          
          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
              onClick={() => {
                window.location.href = '/pricing';
              }}
            >
              {t('upgrade.cta')}
            </Button>
            <button
              onClick={onClose}
              className="w-full py-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {t('upgrade.notNow')}
            </button>
          </div>
        </div>
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/80 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
