import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Binary, Link, Hash, QrCode, Palette, Database, FileDiff, Regex, Key, FileCode, Scan } from 'lucide-react';
import { PageLayout } from '../components/layout/PageLayout';
import { Base64Tool } from '../components/devtools/Base64Tool';
import { UrlEncoderTool } from '../components/devtools/UrlEncoderTool';
import { HashGeneratorTool } from '../components/devtools/HashGeneratorTool';
import { QrCodeTool } from '../components/devtools/QrCodeTool';
import { ColorConverterTool } from '../components/devtools/ColorConverterTool';
import { SqlFormatterTool } from '../components/devtools/SqlFormatterTool';
import { DiffCheckerTool } from '../components/devtools/DiffCheckerTool';
import { RegexTesterTool } from '../components/devtools/RegexTesterTool';
import { JwtDecoderTool } from '../components/devtools/JwtDecoderTool';
import { JsFormatterTool } from '../components/devtools/JsFormatterTool';
import { QrScanTool } from '../components/devtools/QrScanTool';

type Tool = 'base64' | 'url' | 'hash' | 'qrcode' | 'color' | 'sql' | 'diff' | 'regex' | 'jwt' | 'jsfmt' | 'qrscan';

const tools: Array<{ id: Tool; icon: React.ReactNode; label: string }> = [
  { id: 'base64', icon: <Binary className="w-5 h-5" />, label: 'Base64' },
  { id: 'url', icon: <Link className="w-5 h-5" />, label: 'URL' },
  { id: 'hash', icon: <Hash className="w-5 h-5" />, label: 'Hash' },
  { id: 'qrcode', icon: <QrCode className="w-5 h-5" />, label: 'QR Gen' },
  { id: 'qrscan', icon: <Scan className="w-5 h-5" />, label: 'QR Scan' },
  { id: 'color', icon: <Palette className="w-5 h-5" />, label: 'Color' },
  { id: 'sql', icon: <Database className="w-5 h-5" />, label: 'SQL' },
  { id: 'diff', icon: <FileDiff className="w-5 h-5" />, label: 'Diff' },
  { id: 'regex', icon: <Regex className="w-5 h-5" />, label: 'Regex' },
  { id: 'jwt', icon: <Key className="w-5 h-5" />, label: 'JWT' },
  { id: 'jsfmt', icon: <FileCode className="w-5 h-5" />, label: 'JS' },
];

export function DevToolsPage() {
  const { t } = useTranslation('common');
  const [selectedTool, setSelectedTool] = useState<Tool>('base64');

  const renderTool = () => {
    switch (selectedTool) {
      case 'base64': return <Base64Tool />;
      case 'url': return <UrlEncoderTool />;
      case 'hash': return <HashGeneratorTool />;
      case 'qrcode': return <QrCodeTool />;
      case 'qrscan': return <QrScanTool />;
      case 'color': return <ColorConverterTool />;
      case 'sql': return <SqlFormatterTool />;
      case 'diff': return <DiffCheckerTool />;
      case 'regex': return <RegexTesterTool />;
      case 'jwt': return <JwtDecoderTool />;
      case 'jsfmt': return <JsFormatterTool />;
    }
  };

  return (
    <PageLayout
      title={t('nav.devtools')}
      subtitle="Herramientas para desarrolladores. Sin registro."
      showPrivacyBanner={false}
      breadcrumb={[{ label: t('nav.home'), to: '/' }, { label: t('nav.devtools') }]}
    >
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        {tools.map((tool) => (
          <button
            key={tool.id}
            type="button"
            onClick={() => setSelectedTool(tool.id)}
            className={`tool-tab ${selectedTool === tool.id ? 'tool-tab-active' : ''}`}
          >
            {tool.icon}
            <span className="text-sm font-medium">{tool.label}</span>
          </button>
        ))}
      </div>

      <div className="content-panel">{renderTool()}</div>
    </PageLayout>
  );
}
