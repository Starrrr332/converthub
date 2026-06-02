import { useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '../ui/Button';

function getBarcodePattern(pos: number, digit: number): string {
  const patterns: Record<string, string[]> = {
    '0': ['0001101','0011001','0010011','0111101','0100011','0110001','0101111'],
    '1': ['0100111','0110011','0011011','0100001','0011101','0111001','0000101'],
  };
  const side = pos < 7 ? 'L' : 'R';
  if (side === 'R') {
    const p = ['1110010','1100110','1101100','1000010','1011100','1001110','1010000'];
    return p[digit];
  }
  return patterns['0'][digit];
}

function generateBarcodeEAN13(code: string): string {
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 100;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, 300, 100);

  const digits = code.padEnd(12, '0').slice(0, 12);
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(digits[i]) * (i % 2 === 0 ? 1 : 3);
  }
  const check = (10 - (sum % 10)) % 10;
  const fullCode = digits + check;

  ctx.fillStyle = 'black';
  ctx.font = '10px monospace';
  for (let i = 0; i < 13; i++) {
    const x = 10 + i * 22;
    ctx.fillText(fullCode[i], x + 4, 90);
    const pattern = getBarcodePattern(i, parseInt(fullCode[i]));
    for (let b = 0; b < 7; b++) {
      if (pattern[b] === '1') {
        ctx.fillRect(x + b * 3, 10, 3, 70);
      }
    }
  }

  return canvas.toDataURL('image/png');
}

export function BarcodeGeneratorTool() {
  const [code, setCode] = useState('750123456789');
  const [image, setImage] = useState('');

  const generate = () => setImage(generateBarcodeEAN13(code));

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Generador Código de Barras (EAN-13)</h3>
      <div className="flex gap-2 mb-4">
        <input value={code} onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 12))} placeholder="12 dígitos" className="flex-1 p-3 border-2 border-gray-200 rounded-lg font-mono" />
        <Button onClick={generate}>Generar</Button>
      </div>
      {image && (
        <div className="text-center">
          <img src={image} alt="Barcode" className="inline-block" />
          <a href={image} download="barcode.png"><Button variant="outline" className="mt-2"><Download className="w-4 h-4 mr-2" />Descargar</Button></a>
        </div>
      )}
    </div>
  );
}
