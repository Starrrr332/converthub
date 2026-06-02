import { useState } from 'react';
import { Key, Type, Hash, Camera, Terminal, FileCode, Braces, Binary, BarChart3, Sigma, Clock } from 'lucide-react';
import { PasswordGeneratorTool } from '../components/utilities/PasswordGeneratorTool';
import { LoremIpsumTool } from '../components/utilities/LoremIpsumTool';
import { UuidGeneratorTool } from '../components/utilities/UuidGeneratorTool';
import { BarcodeGeneratorTool } from '../components/utilities/BarcodeGeneratorTool';
import { CaseConverterTool } from '../components/utilities/CaseConverterTool';
import { HtmlEntityTool } from '../components/utilities/HtmlEntityTool';
import { CronGeneratorTool } from '../components/utilities/CronGeneratorTool';
import { CssMinifierTool } from '../components/utilities/CssMinifierTool';
import { Base64ImageTool } from '../components/utilities/Base64ImageTool';
import { TextStatsTool } from '../components/utilities/TextStatsTool';
import { NumberBaseTool } from '../components/utilities/NumberBaseTool';
import { TimestampTool } from '../components/utilities/TimestampTool';

type UtilityTool = 'password' | 'lorem' | 'uuid' | 'barcode' | 'case' | 'html-entity' | 'cron' | 'css-min' | 'base64-img' | 'text-stats' | 'number-base' | 'timestamp';

const tools = [
  { id: 'password' as UtilityTool, icon: <Key className="w-5 h-5" />, label: 'Generar contraseñas', desc: 'Contraseñas seguras configurables' },
  { id: 'lorem' as UtilityTool, icon: <Type className="w-5 h-5" />, label: 'Lorem Ipsum', desc: 'Texto placeholder personalizable' },
  { id: 'uuid' as UtilityTool, icon: <Hash className="w-5 h-5" />, label: 'Generar UUID', desc: 'UUID v4 aleatorios' },
  { id: 'barcode' as UtilityTool, icon: <Camera className="w-5 h-5" />, label: 'Código de barras', desc: 'Genera códigos EAN-13 y Code128' },
  { id: 'case' as UtilityTool, icon: <Type className="w-5 h-5" />, label: 'Convertir texto', desc: 'MAYUS/minus/Title Case' },
  { id: 'html-entity' as UtilityTool, icon: <FileCode className="w-5 h-5" />, label: 'HTML Entities', desc: 'Codificar/decodificar HTML' },
  { id: 'cron' as UtilityTool, icon: <Terminal className="w-5 h-5" />, label: 'Cron Generator', desc: 'Generar expresiones cron' },
  { id: 'css-min' as UtilityTool, icon: <Braces className="w-5 h-5" />, label: 'CSS Minifier', desc: 'Minimizar CSS' },
  { id: 'base64-img' as UtilityTool, icon: <Binary className="w-5 h-5" />, label: 'Base64 Image', desc: 'Convertir imagen a Base64' },
  { id: 'text-stats' as UtilityTool, icon: <BarChart3 className="w-5 h-5" />, label: 'Estadísticas texto', desc: 'Contar palabras, caracteres, líneas' },
  { id: 'number-base' as UtilityTool, icon: <Sigma className="w-5 h-5" />, label: 'Base numérica', desc: 'Bin/Oct/Dec/Hex converter' },
  { id: 'timestamp' as UtilityTool, icon: <Clock className="w-5 h-5" />, label: 'Timestamp', desc: 'Unix time ↔ fecha legible' },
];

export function UtilitiesPage() {
  const [selectedTool, setSelectedTool] = useState<UtilityTool>('password');

  const renderTool = () => {
    switch (selectedTool) {
      case 'password': return <PasswordGeneratorTool />;
      case 'lorem': return <LoremIpsumTool />;
      case 'uuid': return <UuidGeneratorTool />;
      case 'barcode': return <BarcodeGeneratorTool />;
      case 'case': return <CaseConverterTool />;
      case 'html-entity': return <HtmlEntityTool />;
      case 'cron': return <CronGeneratorTool />;
      case 'css-min': return <CssMinifierTool />;
      case 'base64-img': return <Base64ImageTool />;
      case 'text-stats': return <TextStatsTool />;
      case 'number-base': return <NumberBaseTool />;
      case 'timestamp': return <TimestampTool />;
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Utilidades</h1>
          <p className="text-gray-600">Generadores y herramientas útiles para el día a día</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
          {tools.map(tool => (
            <button key={tool.id} onClick={() => setSelectedTool(tool.id)}
              className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                selectedTool === tool.id ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}>
              {tool.icon}
              <span className="text-xs font-medium text-center">{tool.label}</span>
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          {renderTool()}
        </div>
      </div>
    </div>
  );
}
