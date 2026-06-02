import { useState } from 'react';
import { Copy, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

function generateLorem(paragraphs: number): string {
  const words = [
    'lorem',
    'ipsum',
    'dolor',
    'sit',
    'amet',
    'consectetur',
    'adipiscing',
    'elit',
    'sed',
    'do',
    'eiusmod',
    'tempor',
    'incididunt',
    'ut',
    'labore',
    'et',
    'dolore',
    'magna',
    'aliqua',
    'enim',
    'ad',
    'minim',
    'veniam',
    'quis',
    'nostrud',
    'exercitation',
    'ullamco',
    'laboris',
    'nisi',
    'aliquip',
    'ex',
    'ea',
    'commodo',
    'consequat',
    'duis',
    'aute',
    'irure',
    'dolor',
    'in',
    'reprehenderit',
    'voluptate',
    'velit',
    'esse',
    'cillum',
    'fugiat',
    'nulla',
    'pariatur',
    'excepteur',
    'sint',
    'occaecat',
    'cupidatat',
    'non',
    'proident',
    'sunt',
    'culpa',
    'qui',
    'officia',
    'deserunt',
    'mollit',
    'anim',
    'id',
    'est',
    'laborum',
  ];
  const sentencesPerPara = 4 + Math.floor(Math.random() * 4);
  const wordsPerSentence = 8 + Math.floor(Math.random() * 8);
  const result: string[] = [];
  for (let p = 0; p < paragraphs; p++) {
    const para: string[] = [];
    for (let s = 0; s < sentencesPerPara; s++) {
      const sentence: string[] = [];
      for (let w = 0; w < wordsPerSentence; w++) {
        sentence.push(words[Math.floor(Math.random() * words.length)]);
      }
      const str = sentence.join(' ');
      para.push(str.charAt(0).toUpperCase() + str.slice(1) + '.');
    }
    result.push(para.join(' '));
  }
  return result.join('\n\n');
}

export function LoremIpsumTool() {
  const [paras, setParas] = useState(3);
  const [text, setText] = useState('');

  const generate = () => setText(generateLorem(paras));

  const copy = async () => {
    await navigator.clipboard.writeText(text);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Generador Lorem Ipsum</h3>
      <div className="flex items-center gap-4 mb-4">
        <label className="flex items-center gap-2">
          <span className="text-sm font-medium">Párrafos:</span>
          <input
            type="number"
            min="1"
            max="20"
            value={paras}
            onChange={(e) => setParas(Number(e.target.value))}
            className="w-20 p-2 border-2 border-gray-200 rounded-lg"
          />
        </label>
        <Button onClick={generate}>
          <RefreshCw className="w-4 h-4 mr-2" /> Generar
        </Button>
      </div>
      <textarea
        readOnly
        value={text}
        className="w-full h-48 p-3 border-2 border-gray-200 rounded-lg font-mono text-sm"
        placeholder="Lorem ipsum..."
      />
      {text && (
        <Button onClick={copy} variant="outline" className="mt-2">
          <Copy className="w-4 h-4 mr-2" /> Copiar
        </Button>
      )}
    </div>
  );
}
