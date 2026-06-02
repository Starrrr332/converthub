import { useState } from 'react';
import { Copy } from 'lucide-react';
import { Button } from '../ui/Button';

export function Base64ImageTool() {
  const [b64, setB64] = useState('');
  const [preview, setPreview] = useState('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setB64(base64);
      setPreview(base64);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Base64 Image Encoder</h3>
      <input
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {b64 && (
        <div className="space-y-4">
          <img src={preview} alt="Preview" className="max-h-48 rounded-lg" />
          <textarea
            readOnly
            value={b64}
            className="w-full h-32 p-3 border-2 border-gray-200 rounded-lg font-mono text-xs"
          />
          <Button onClick={() => navigator.clipboard.writeText(b64)}>
            <Copy className="w-4 h-4 mr-2" /> Copiar Base64
          </Button>
          <p className="text-xs text-gray-400 break-all">
            Tamaño: {(b64.length * 0.75).toFixed(0)} bytes
          </p>
        </div>
      )}
    </div>
  );
}
