import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageLayout } from '../components/layout/PageLayout';
import { PdfToolSelector } from '../components/pdf/PdfToolSelector';
import { PdfToolContent } from '../components/pdf/PdfToolContent';
import type { PdfTool } from '../types';

export function PdfConverter() {
  const { t } = useTranslation('converter');
  const { t: tc } = useTranslation('common');
  const [selectedTool, setSelectedTool] = useState<PdfTool>('merge');

  return (
    <PageLayout
      title={t('pdf.title')}
      subtitle={t('pdf.subtitle')}
      breadcrumb={[
        { label: tc('nav.home'), to: '/' },
        { label: tc('nav.converters.pdf') },
      ]}
    >
      <div className="mb-8">
        <PdfToolSelector selectedTool={selectedTool} onSelect={setSelectedTool} />
      </div>

      <div className="content-panel">
        <PdfToolContent tool={selectedTool} />
      </div>
    </PageLayout>
  );
}
