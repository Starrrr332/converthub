import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Download, FileText, Trash2, Info, Lock } from 'lucide-react';
import { Button } from '../ui/Button';
import { UpgradeModal } from '../ui/UpgradeModal';
import { ToolInfoModal } from '../ui/ToolInfoModal';
import { 
  mergePdfs, 
  splitPdf, 
  compressPdf, 
  imagesToPdf, 
  watermarkPdf
} from '../../services/conversions/pdfConverter';
import type { PdfTool, PdfConversionResult } from '../../types';

interface PdfToolContentProps {
  tool: PdfTool;
  isPremium: boolean;
}

// Premium-only tools
const PREMIUM_TOOLS: PdfTool[] = ['split', 'compress', 'protect', 'watermark'];

export function PdfToolContent({ tool, isPremium }: PdfToolContentProps) {
  const { t } = useTranslation('converter');
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<PdfConversionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showToolInfo, setShowToolInfo] = useState(false);
  
  // Watermark options
  const [watermarkText, setWatermarkText] = useState('WATERMARK');
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.3);
  
  const isPremiumTool = PREMIUM_TOOLS.includes(tool);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    // Check file limits for free users
    if (!isPremium) {
      if (tool === 'merge' && selectedFiles.length > 2) {
        setError(t('pdf.limits.mergeFree'));
        return;
      }
      if (tool === 'images-to-pdf' && selectedFiles.length > 3) {
        setError(t('pdf.limits.imagesFree'));
        return;
      }
    }
    
    setFiles(selectedFiles);
    setResult(null);
    setError(null);
  };
  
  const handleConvert = async () => {
    if (files.length === 0) return;
    
    // Check premium access
    if (isPremiumTool && !isPremium) {
      setShowUpgradeModal(true);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      let conversionResult: PdfConversionResult | PdfConversionResult[];
      
      switch (tool) {
        case 'merge':
          conversionResult = await mergePdfs({ files });
          break;
        case 'split':
          conversionResult = await splitPdf({ file: files[0], splitAll: true });
          break;
        case 'compress':
          conversionResult = await compressPdf({ file: files[0], quality: 'medium' });
          break;
        case 'images-to-pdf':
          conversionResult = await imagesToPdf({ files });
          break;
        case 'watermark':
          conversionResult = await watermarkPdf({ 
            file: files[0], 
            text: watermarkText,
            opacity: watermarkOpacity
          });
          break;
        default:
          throw new Error('Tool not implemented');
      }
      
      if (Array.isArray(conversionResult)) {
        setResult(conversionResult[0]);
      } else {
        setResult(conversionResult);
      }
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
    if (tool === 'images-to-pdf') {
      return '.png,.jpg,.jpeg';
    }
    return '.pdf';
  };
  
  const getTitle = () => {
    const titles: Record<PdfTool, string> = {
      'merge': t('pdf.tools.merge'),
      'split': t('pdf.tools.split'),
      'compress': t('pdf.tools.compress'),
      'images-to-pdf': t('pdf.tools.imagesToPdf'),
      'protect': t('pdf.tools.protect'),
      'watermark': t('pdf.tools.watermark')
    };
    return titles[tool];
  };
  
  return (
    <div className="space-y-6">
      {/* Header with info button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold text-gray-900">{getTitle()}</h3>
          {isPremiumTool && !isPremium && (
            <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
              <Lock className="w-3 h-3" />
              Premium
            </span>
          )}
        </div>
        <button
          onClick={() => setShowToolInfo(true)}
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title={t('toolInfo.about')}
        >
          <Info className="w-5 h-5" />
        </button>
      </div>
      
      {/* Free user limit notice */}
      {!isPremium && (tool === 'merge' || tool === 'images-to-pdf') && (
        <div className="p-3 bg-blue-50 text-blue-700 text-sm rounded-lg">
          {tool === 'merge' 
            ? t('pdf.limits.mergeFreeNotice')
            : t('pdf.limits.imagesFreeNotice')
          }
        </div>
      )}
      
      {/* File Input */}
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors">
        <input
          type="file"
          accept={getAcceptTypes()}
          multiple={tool === 'merge' || tool === 'images-to-pdf'}
          onChange={handleFileChange}
          className="hidden"
          id={`pdf-input-${tool}`}
        />
        <label htmlFor={`pdf-input-${tool}`} className="cursor-pointer">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            {tool === 'images-to-pdf' 
              ? t('pdf.dropzone.images')
              : t('pdf.dropzone.pdf')
            }
          </p>
        </label>
      </div>
      
      {/* Selected Files */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-red-500" />
                <span className="text-sm text-gray-700">{file.name}</span>
              </div>
              <button
                onClick={() => setFiles(files.filter((_, i) => i !== index))}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Watermark Options */}
      {tool === 'watermark' && (
        <div className="p-4 bg-gray-50 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('pdf.watermark.text')}
            </label>
            <input
              type="text"
              value={watermarkText}
              onChange={(e) => setWatermarkText(e.target.value)}
              className="input-field"
              placeholder="WATERMARK"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('pdf.watermark.opacity')}: {Math.round(watermarkOpacity * 100)}%
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={watermarkOpacity}
              onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      )}
      
      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      {/* Actions */}
      <div className="flex gap-4">
        <Button
          onClick={handleConvert}
          disabled={files.length === 0 || loading}
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
      
      {/* Result Info */}
      {result && (
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-700">
            ✓ {t('pdf.result.ready')} - {(result.size / 1024).toFixed(1)} KB
          </p>
        </div>
      )}
      
      {/* Modals */}
      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)}
        feature={getTitle()}
      />
      <ToolInfoModal 
        isOpen={showToolInfo} 
        onClose={() => setShowToolInfo(false)}
        tool="pdf"
      />
    </div>
  );
}
