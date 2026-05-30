import { useState } from 'react';
import { Base64Tool } from '../components/devtools/Base64Tool';
import { UrlEncoderTool } from '../components/devtools/UrlEncoderTool';
import { HashGeneratorTool } from '../components/devtools/HashGeneratorTool';
import { QrCodeTool } from '../components/devtools/QrCodeTool';
import { ColorConverterTool } from '../components/devtools/ColorConverterTool';
import { Binary, Link, Hash, QrCode, Palette } from 'lucide-react';

type Tool = 'base64' | 'url' | 'hash' | 'qrcode' | 'color';

const tools: Array<{ id: Tool; icon: React.ReactNode; label: string; description: string }> = [
  { id: 'base64', icon: <Binary className="w-5 h-5" />, label: 'Base64', description: 'Encode/Decode text' },
  { id: 'url', icon: <Link className="w-5 h-5" />, label: 'URL Encoder', description: 'Encode/Decode URLs' },
  { id: 'hash', icon: <Hash className="w-5 h-5" />, label: 'Hash Generator', description: 'MD5, SHA-1, SHA-256' },
  { id: 'qrcode', icon: <QrCode className="w-5 h-5" />, label: 'QR Code', description: 'Generate QR codes' },
  { id: 'color', icon: <Palette className="w-5 h-5" />, label: 'Color Converter', description: 'HEX ↔ RGB ↔ HSL' },
];

export function DevToolsPage() {
  const [selectedTool, setSelectedTool] = useState<Tool>('base64');
  
  const renderTool = () => {
    switch (selectedTool) {
      case 'base64': return <Base64Tool />;
      case 'url': return <UrlEncoderTool />;
      case 'hash': return <HashGeneratorTool />;
      case 'qrcode': return <QrCodeTool />;
      case 'color': return <ColorConverterTool />;
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Developer Tools</h1>
          <p className="text-gray-600">Free tools for developers. No login required.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id)}
              className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
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

        <div className="bg-white rounded-xl shadow-lg p-6">
          {renderTool()}
        </div>
      </div>
    </div>
  );
}
