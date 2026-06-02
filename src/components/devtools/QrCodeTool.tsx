import { useState, useRef, useEffect } from 'react';
import { Download } from 'lucide-react';
import { Button } from '../ui/Button';
import QRCode from 'qrcode';

export function QrCodeTool() {
  const [input, setInput] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (input && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, input, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });

      // Also generate data URL for preview
      QRCode.toDataURL(input, {
        width: 256,
        margin: 2,
      }).then((url: string) => setQrUrl(url));
    }
  }, [input]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Text or URL</label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text or URL to generate QR code..."
          className="input-field"
        />
      </div>

      <canvas ref={canvasRef} className="mx-auto hidden" />

      {qrUrl && (
        <div className="text-center space-y-4">
          <img src={qrUrl} alt="QR Code" className="mx-auto rounded-lg shadow-lg" />
          <Button onClick={handleDownload} variant="secondary" className="mx-auto">
            <Download className="w-4 h-4 mr-2" />
            Download QR Code
          </Button>
        </div>
      )}

      {!input && (
        <p className="text-center text-gray-400 text-sm">
          Enter text or URL above to generate a QR code
        </p>
      )}
    </div>
  );
}
