import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePremiumStore } from '../store/premiumStore';
import { PdfToolSelector } from '../components/pdf/PdfToolSelector';
import { PdfToolContent } from '../components/pdf/PdfToolContent';
import { PrivacyBanner } from '../components/converter/PrivacyBanner';
import type { PdfTool } from '../types';

export function PdfConverter() {
  const { t } = useTranslation('converter');
  const premium = usePremiumStore();
  const isPremium = premium.isPremium();
  const [selectedTool, setSelectedTool] = useState<PdfTool>('merge');
  
  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('pdf.title')}
          </h1>
          <p className="text-gray-600">
            {t('pdf.subtitle')}
          </p>
        </div>
        
        {/* Privacy Banner */}
        <div className="mb-6">
          <PrivacyBanner />
        </div>
        
        {/* Tool Selector */}
        <div className="mb-8">
          <PdfToolSelector 
            selectedTool={selectedTool} 
            onSelect={setSelectedTool} 
          />
        </div>
        
        {/* Tool Content */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <PdfToolContent 
            tool={selectedTool} 
            isPremium={isPremium} 
          />
        </div>
      </div>
    </div>
  );
}
