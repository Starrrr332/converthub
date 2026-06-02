import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Download, FileText, Trash2, Info } from 'lucide-react';
import { Button } from '../ui/Button';
import { ToolInfoModal } from '../ui/ToolInfoModal';
import {
  mergePdfs,
  splitPdf,
  compressPdf,
  imagesToPdf,
  watermarkPdf,
  rotatePdf,
  addPageNumbers,
  unlockPdf,
} from '../../services/conversions/pdfConverter';
import type { PdfTool, PdfConversionResult } from '../../types';

interface PdfToolContentProps {
  tool: PdfTool;
}

export function PdfToolContent({ tool }: PdfToolContentProps) {
  const { t } = useTranslation('converter');
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<PdfConversionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToolInfo, setShowToolInfo] = useState(false);

  const [watermarkText, setWatermarkText] = useState('WATERMARK');
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.3);
  const [rotateDegrees, setRotateDegrees] = useState(90);
  const [pageNumberPosition, setPageNumberPosition] = useState<
    'bottom-center' | 'bottom-right' | 'top-center'
  >('bottom-center');
  const [unlockPassword, setUnlockPassword] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);
    setResult(null);
    setError(null);
  };

  const handleConvert = async () => {
    if (files.length === 0) return;

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
            opacity: watermarkOpacity,
          });
          break;
        case 'rotate':
          conversionResult = await rotatePdf({ file: files[0], degrees: rotateDegrees });
          break;
        case 'page-numbers':
          conversionResult = await addPageNumbers({ file: files[0], position: pageNumberPosition });
          break;
        case 'unlock':
          conversionResult = await unlockPdf({ file: files[0], password: unlockPassword });
          break;
        case 'protect':
          throw new Error('Próximamente disponible');
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
      merge: t('pdf.tools.merge'),
      split: t('pdf.tools.split'),
      compress: t('pdf.tools.compress'),
      'images-to-pdf': t('pdf.tools.imagesToPdf'),
      protect: t('pdf.tools.protect'),
      watermark: t('pdf.tools.watermark'),
      rotate: t('pdf.tools.rotate'),
      'page-numbers': t('pdf.tools.pageNumbers'),
      unlock: t('pdf.tools.unlock'),
    };
    return titles[tool];
  };

  const getDescription = () => {
    const descriptions: Record<PdfTool, string> = {
      merge: 'Selecciona los archivos PDF que quieres unir en uno solo',
      split: 'Selecciona un PDF para dividirlo en páginas individuales',
      compress: 'Reduce el tamaño de tu PDF sin perder calidad',
      'images-to-pdf': 'Selecciona imágenes para convertirlas a PDF',
      protect: 'Protege tu PDF con contraseña',
      watermark: 'Agrega una marca de agua personalizada a tu PDF',
      rotate: 'Rota todas las páginas del PDF',
      'page-numbers': 'Inserta números de página automáticos',
      unlock: 'Remueve la contraseña de un PDF',
    };
    return descriptions[tool];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{getTitle()}</h3>
          <p className="text-sm text-gray-500 mt-1">{getDescription()}</p>
        </div>
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
          multiple={tool === 'merge' || tool === 'images-to-pdf'}
          onChange={handleFileChange}
          className="hidden"
          id={`pdf-input-${tool}`}
        />
        <label htmlFor={`pdf-input-${tool}`} className="cursor-pointer">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            {tool === 'images-to-pdf'
              ? 'Arrastra imágenes aquí o haz clic para seleccionar'
              : 'Arrastra un PDF aquí o haz clic para seleccionar'}
          </p>
        </label>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-red-500" />
                <span className="text-sm text-gray-700">{file.name}</span>
                <span className="text-xs text-gray-400">
                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
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

      {tool === 'watermark' && (
        <div className="p-4 bg-gray-50 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Texto de la marca de agua
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
              Opacidad: {Math.round(watermarkOpacity * 100)}%
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

      {tool === 'rotate' && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">Grados de rotación</label>
          <div className="flex gap-2">
            {[90, 180, 270].map((degrees) => (
              <button
                key={degrees}
                onClick={() => setRotateDegrees(degrees)}
                className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                  rotateDegrees === degrees
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {degrees}°
              </button>
            ))}
          </div>
        </div>
      )}

      {tool === 'page-numbers' && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Posición del número
          </label>
          <div className="flex gap-2">
            {[
              { value: 'bottom-center' as const, label: 'Centro inferior' },
              { value: 'bottom-right' as const, label: 'Derecha inferior' },
              { value: 'top-center' as const, label: 'Centro superior' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setPageNumberPosition(option.value)}
                className={`flex-1 p-3 rounded-lg border-2 transition-all text-sm ${
                  pageNumberPosition === option.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {tool === 'unlock' && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña (opcional)
          </label>
          <input
            type="text"
            value={unlockPassword}
            onChange={(e) => setUnlockPassword(e.target.value)}
            className="input-field"
            placeholder="Deja vacío si no hay contraseña"
          />
        </div>
      )}

      {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>}

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

      {result && (
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-700">
            ✓ Archivo listo para descargar - {(result.size / 1024).toFixed(1)} KB
          </p>
        </div>
      )}

      <ToolInfoModal isOpen={showToolInfo} onClose={() => setShowToolInfo(false)} tool="pdf" />
    </div>
  );
}
