import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageLayout } from '../components/layout/PageLayout';
import { SpreadsheetToolContent } from '../components/spreadsheet/SpreadsheetToolContent';
import { Table, FileSpreadsheet, FileJson, ArrowRightLeft } from 'lucide-react';
import type { SpreadsheetTool } from '../types';

export function SpreadsheetConverter() {
  const { t } = useTranslation('converter');
  const { t: tc } = useTranslation('common');
  const [selectedTool, setSelectedTool] = useState<SpreadsheetTool>('csv-to-xlsx');

  const tools: Array<{ id: SpreadsheetTool; icon: React.ReactNode; label: string }> = [
    {
      id: 'csv-to-xlsx',
      icon: <Table className="w-5 h-5" />,
      label: t('spreadsheet.tools.csvToXlsx'),
    },
    {
      id: 'xlsx-to-csv',
      icon: <FileSpreadsheet className="w-5 h-5" />,
      label: t('spreadsheet.tools.xlsxToCsv'),
    },
    {
      id: 'csv-to-json',
      icon: <ArrowRightLeft className="w-5 h-5" />,
      label: t('spreadsheet.tools.csvToJson'),
    },
    {
      id: 'json-to-csv',
      icon: <FileJson className="w-5 h-5" />,
      label: t('spreadsheet.tools.jsonToCsv'),
    },
  ];

  return (
    <PageLayout
      title={t('spreadsheet.title')}
      description="Convierte archivos CSV a XLSX, XLSX a CSV, CSV a JSON y JSON a CSV online gratis. Procesamiento 100% local."
      subtitle={t('spreadsheet.subtitle')}
      breadcrumb={[{ label: tc('nav.home'), to: '/' }, { label: tc('nav.converters.csv') }]}
    >
      <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-3">
        {tools.map((tool) => (
          <button
            key={tool.id}
            type="button"
            onClick={() => setSelectedTool(tool.id)}
            className={`tool-tab ${selectedTool === tool.id ? 'tool-tab-active' : ''}`}
          >
            {tool.icon}
            <span className="text-sm font-medium text-center">{tool.label}</span>
          </button>
        ))}
      </div>

      <div className="content-panel">
        <SpreadsheetToolContent tool={selectedTool} />
      </div>
    </PageLayout>
  );
}
