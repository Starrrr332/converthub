import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePremiumStore } from '../store/premiumStore';
import { SpreadsheetToolContent } from '../components/spreadsheet/SpreadsheetToolContent';
import { PrivacyBanner } from '../components/converter/PrivacyBanner';
import { Table, FileSpreadsheet, FileJson, ArrowRightLeft } from 'lucide-react';
import type { SpreadsheetTool } from '../types';

export function SpreadsheetConverter() {
  const { t } = useTranslation('converter');
  const premium = usePremiumStore();
  const isPremium = premium.isPremium();
  const [selectedTool, setSelectedTool] = useState<SpreadsheetTool>('csv-to-xlsx');
  
  const tools: Array<{ id: SpreadsheetTool; icon: React.ReactNode; label: string }> = [
    { id: 'csv-to-xlsx', icon: <Table className="w-5 h-5" />, label: t('spreadsheet.tools.csvToXlsx') },
    { id: 'xlsx-to-csv', icon: <FileSpreadsheet className="w-5 h-5" />, label: t('spreadsheet.tools.xlsxToCsv') },
    { id: 'csv-to-json', icon: <ArrowRightLeft className="w-5 h-5" />, label: t('spreadsheet.tools.csvToJson') },
    { id: 'json-to-csv', icon: <FileJson className="w-5 h-5" />, label: t('spreadsheet.tools.jsonToCsv') },
  ];
  
  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('spreadsheet.title')}
          </h1>
          <p className="text-gray-600">
            {t('spreadsheet.subtitle')}
          </p>
        </div>
        
        {/* Privacy Banner */}
        <div className="mb-6">
          <PrivacyBanner />
        </div>
        
        {/* Tool Selector */}
        <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-3">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                selectedTool === tool.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              {tool.icon}
              <span className="text-sm font-medium text-center">{tool.label}</span>
            </button>
          ))}
        </div>
        
        {/* Tool Content */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <SpreadsheetToolContent 
            tool={selectedTool} 
            isPremium={isPremium} 
          />
        </div>
      </div>
    </div>
  );
}
