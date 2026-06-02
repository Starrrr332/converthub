import { useTranslation } from 'react-i18next';
import { X, Info, ExternalLink } from 'lucide-react';
import { useFocusTrap } from '../../hooks/useFocusTrap';

interface ToolInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  tool: 'image' | 'pdf' | 'spreadsheet' | 'audio';
}

const toolInfo = {
  image: {
    name: 'Canvas API',
    description:
      'API nativa del navegador para procesamiento de imágenes. No requiere librerías externas.',
    features: [
      'Conversión de formatos (PNG, JPEG, WebP, BMP, GIF)',
      'Redimensionamiento de imágenes',
      'Recorte y rotación',
      'Compresión con control de calidad',
      'Procesamiento 100% local',
    ],
    privacy: 'Las imágenes nunca salen de tu navegador. Todo se procesa en memoria.',
    link: 'https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API',
  },
  pdf: {
    name: 'pdf-lib',
    description: 'Librería JavaScript para crear y modificar documentos PDF en el navegador.',
    features: [
      'Unir múltiples PDFs',
      'Dividir PDF en páginas individuales',
      'Comprimir tamaño del archivo',
      'Convertir imágenes a PDF',
      'Agregar marcas de agua',
    ],
    privacy:
      'Los archivos PDF se procesan completamente en tu navegador. No se suben a ningún servidor.',
    link: 'https://pdf-lib.js.org/',
  },
  spreadsheet: {
    name: 'SheetJS (xlsx)',
    description:
      'La librería más popular para leer y escribir archivos de hojas de cálculo en JavaScript.',
    features: [
      'Convertir CSV a Excel (XLSX)',
      'Convertir Excel a CSV',
      'Convertir CSV a JSON',
      'Convertir JSON a CSV',
      'Vista previa de datos',
    ],
    privacy:
      'Los archivos de hojas de cálculo se procesan localmente. Nunca se envían a servidores externos.',
    link: 'https://docs.sheetjs.com/',
  },
  audio: {
    name: 'FFmpeg.wasm',
    description:
      'Puerto de WebAssembly de FFmpeg. El estándar de la industria para procesamiento de audio y video.',
    features: [
      'Convertir entre MP3, WAV, OGG, FLAC, AAC',
      'Control de bitrate y sample rate',
      'Procesamiento de alta calidad',
      'Soporte para múltiples formatos',
      'Ejecución en Web Worker (no bloquea la UI)',
    ],
    privacy:
      'El audio se procesa completamente en tu navegador usando WebAssembly. No se sube a ningún servidor.',
    link: 'https://github.com/ffmpegwasm/ffmpeg.wasm',
  },
};

export function ToolInfoModal({ isOpen, onClose, tool }: ToolInfoModalProps) {
  const { t } = useTranslation('converter');
  const info = toolInfo[tool];

  const focusTrapRef = useFocusTrap(isOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      {/* Modal */}
      <div
        ref={focusTrapRef}
        role="dialog"
        aria-modal="true"
        aria-label={info.name}
        className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Info className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{info.name}</h2>
                <p className="text-sm text-gray-500">{t('toolInfo.poweredBy')}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">{t('toolInfo.about')}</h3>
            <p className="text-gray-700">{info.description}</p>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">{t('toolInfo.features')}</h3>
            <ul className="space-y-2">
              {info.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Privacy */}
          <div className="p-4 bg-green-50 rounded-xl">
            <h3 className="text-sm font-medium text-green-800 mb-2">{t('toolInfo.privacy')}</h3>
            <p className="text-sm text-green-700">{info.privacy}</p>
          </div>

          {/* Link */}
          <a
            href={info.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            {t('toolInfo.learnMore')}
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
