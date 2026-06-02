import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Download, Table, FileSpreadsheet, FileJson, Info } from 'lucide-react';
import { Button } from '../ui/Button';
import { ToolInfoModal } from '../ui/ToolInfoModal';
import {
  csvToXlsx,
  xlsxToCsv,
  csvToJson,
  jsonToCsv,
  previewSpreadsheet,
  getFileFormat,
} from '../../services/conversions/spreadsheetConverter';
import type {
  SpreadsheetTool,
  SpreadsheetConversionResult,
  SpreadsheetPreviewResult,
} from '../../types';

interface SpreadsheetToolContentProps {
  tool: SpreadsheetTool;
}

export function SpreadsheetToolContent({ tool }: SpreadsheetToolContentProps) {
  const { t } = useTranslation('converter');
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<SpreadsheetConversionResult | null>(null);
  const [preview, setPreview] = useState<SpreadsheetPreviewResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToolInfo, setShowToolInfo] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setResult(null);
    setError(null);

    try {
      const previewData = await previewSpreadsheet(selectedFile);
      setPreview(previewData);
    } catch (err) {
      console.error('Preview error:', err);
    }
  };

  const handleConvert = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      let conversionResult: SpreadsheetConversionResult;

      switch (tool) {
        case 'csv-to-xlsx':
          conversionResult = await csvToXlsx({ file });
          break;
        case 'xlsx-to-csv':
          conversionResult = await xlsxToCsv({ file });
          break;
        case 'csv-to-json':
          conversionResult = await csvToJson({ file });
          break;
        case 'json-to-csv':
          conversionResult = await jsonToCsv({ file });
          break;
        default:
          throw new Error('Tool not implemented');
      }

      setResult(conversionResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;

    const a = document.createElement('a');
    a.href = result.url;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const getAcceptTypes = () => {
    switch (tool) {
      case 'csv-to-xlsx':
        return '.csv';
      case 'xlsx-to-csv':
        return '.xlsx,.xls';
      case 'csv-to-json':
        return '.csv';
      case 'json-to-csv':
        return '.json';
      default:
        return '.csv,.xlsx,.xls,.json';
    }
  };

  const getIcon = () => {
    if (!file) return <Upload className="w-12 h-12 text-gray-400" />;
    const format = getFileFormat(file);
    if (format === 'json') return <FileJson className="w-12 h-12 text-yellow-500" />;
    if (format === 'csv') return <Table className="w-12 h-12 text-green-500" />;
    return <FileSpreadsheet className="w-12 h-12 text-blue-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">{t('spreadsheet.title')}</h3>
        <button
          onClick={() => setShowToolInfo(true)}
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title={t('toolInfo.about')}
        >
          <Info className="w-5 h-5" />
        </button>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors">
        <input
          type="file"
          accept={getAcceptTypes()}
          onChange={handleFileChange}
          className="hidden"
          id={`spreadsheet-input-${tool}`}
        />
        <label htmlFor={`spreadsheet-input-${tool}`} className="cursor-pointer">
          {getIcon()}
          <p className="text-gray-600 mt-4">{t('spreadsheet.dropzone')}</p>
        </label>
      </div>

      {preview && preview.headers.length > 0 && (
        <div className="overflow-x-auto">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            {t('spreadsheet.preview')} ({preview.totalRows} rows)
          </h4>
          <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                {preview.headers.map((header, i) => (
                  <th
                    key={i}
                    className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {preview.rows.slice(0, 10).map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  {row.map((cell, j) => (
                    <td key={j} className="px-4 py-2 text-sm text-gray-600 border-b">
                      {cell || '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {preview.totalRows > 10 && (
            <p className="text-xs text-gray-500 mt-2">
              {t('spreadsheet.previewMore', { count: preview.totalRows - 10 })}
            </p>
          )}
        </div>
      )}

      {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>}

      <div className="flex gap-4">
        <Button
          onClick={handleConvert}
          disabled={!file || loading}
          loading={loading}
          className="flex-1"
        >
          {loading ? t('progress.converting') : t('actions.convert')}
        </Button>

        {result && (
          <Button onClick={handleDownload} variant="secondary">
            <Download className="w-4 h-4 mr-2" />
            {t('actions.download')}
          </Button>
        )}
      </div>

      {result && (
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-700">
            ✓ {t('spreadsheet.result.ready')} - {(result.size / 1024).toFixed(1)} KB
          </p>
        </div>
      )}

      <ToolInfoModal
        isOpen={showToolInfo}
        onClose={() => setShowToolInfo(false)}
        tool="spreadsheet"
      />
    </div>
  );
}
