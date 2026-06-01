import { useState, useMemo } from 'react';
import { Copy, Check, RefreshCw, Key, Type, Hash, Camera, Terminal, FileCode, Braces, Binary, Download, BarChart3, Sigma, Clock } from 'lucide-react';
import { Button } from '../components/ui/Button';

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

function generatePassword(len: number, upper: boolean, lower: boolean, digits: boolean, special: boolean): string {
  let chars = '';
  if (upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (lower) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (digits) chars += '0123456789';
  if (special) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function generateLorem(paragraphs: number): string {
  const words = ['lorem','ipsum','dolor','sit','amet','consectetur','adipiscing','elit','sed','do','eiusmod','tempor','incididunt','ut','labore','et','dolore','magna','aliqua','enim','ad','minim','veniam','quis','nostrud','exercitation','ullamco','laboris','nisi','aliquip','ex','ea','commodo','consequat','duis','aute','irure','dolor','in','reprehenderit','voluptate','velit','esse','cillum','fugiat','nulla','pariatur','excepteur','sint','occaecat','cupidatat','non','proident','sunt','culpa','qui','officia','deserunt','mollit','anim','id','est','laborum'];
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

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
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

function convertCase(text: string, type: 'upper' | 'lower' | 'title' | 'camel' | 'snake' | 'kebab' | 'toggle'): string {
  switch (type) {
    case 'upper': return text.toUpperCase();
    case 'lower': return text.toLowerCase();
    case 'title': return text.replace(/\w\S*/g, w => w[0].toUpperCase() + w.slice(1).toLowerCase());
    case 'camel': return text.replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()).replace(/^./, c => c.toLowerCase());
    case 'snake': return text.replace(/[^a-zA-Z0-9]+/g, '_').toLowerCase();
    case 'kebab': return text.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase();
    case 'toggle': return text.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('');
  }
}

function entityEncode(text: string): string {
  return text.replace(/[&<>"'\/]/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '/': '&#47;'
  }[c] || c));
}

function entityDecode(text: string): string {
  return text.replace(/&(?:amp|lt|gt|quot|#39|#47);/g, c => ({
    '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&#47;': '/'
  }[c] || c));
}

function generateCron(minute: string, hour: string, dom: string, month: string, dow: string): string {
  return `${minute} ${hour} ${dom} ${month} ${dow}`;
}

function cssMinify(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{}:;,])\s*/g, '$1').replace(/;}/g, '}').trim();
}

function ToolPassword() {
  const [len, setLen] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [digits, setDigits] = useState(true);
  const [special, setSpecial] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => setPassword(generatePassword(len, upper, lower, digits, special));
  
  const copy = async () => {
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const strength = useMemo(() => {
    let entropy = 0;
    if (upper) entropy += 26;
    if (lower) entropy += 26;
    if (digits) entropy += 10;
    if (special) entropy += 18;
    const bits = Math.log2(entropy) * len;
    if (bits < 40) return { label: 'Débil', color: 'text-red-500' };
    if (bits < 60) return { label: 'Moderada', color: 'text-yellow-500' };
    if (bits < 80) return { label: 'Fuerte', color: 'text-green-500' };
    return { label: 'Muy fuerte', color: 'text-blue-500' };
  }, [len, upper, lower, digits, special]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Generador de Contraseñas</h3>
      <div className="flex gap-2 mb-4">
        <input readOnly value={password} className="flex-1 p-3 border-2 border-gray-200 rounded-lg font-mono text-lg bg-gray-50" placeholder="Haz clic en Generar" />
        <Button onClick={copy} variant="outline" className="px-3">
          {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Longitud: {len}</label>
          <input type="range" min="4" max="64" value={len} onChange={e => setLen(Number(e.target.value))} className="w-full" />
        </div>
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-700">Fortaleza: <span className={strength.color}>{strength.label}</span></span>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 mb-4">
        {[{ id: 'upper', label: 'A-Z', value: upper, set: setUpper },
          { id: 'lower', label: 'a-z', value: lower, set: setLower },
          { id: 'digits', label: '0-9', value: digits, set: setDigits },
          { id: 'special', label: '!@#$%', value: special, set: setSpecial }].map(opt => (
          <label key={opt.id} className="flex items-center gap-2">
            <input type="checkbox" checked={opt.value} onChange={() => opt.set(!opt.value)} className="w-4 h-4" />
            <span className="text-sm">{opt.label}</span>
          </label>
        ))}
      </div>
      <Button onClick={generate}><RefreshCw className="w-4 h-4 mr-2" /> Generar</Button>
    </div>
  );
}

function ToolLorem() {
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
          <input type="number" min="1" max="20" value={paras} onChange={e => setParas(Number(e.target.value))} className="w-20 p-2 border-2 border-gray-200 rounded-lg" />
        </label>
        <Button onClick={generate}><RefreshCw className="w-4 h-4 mr-2" /> Generar</Button>
      </div>
      <textarea readOnly value={text} className="w-full h-48 p-3 border-2 border-gray-200 rounded-lg font-mono text-sm" placeholder="Lorem ipsum..." />
      {text && <Button onClick={copy} variant="outline" className="mt-2"><Copy className="w-4 h-4 mr-2" /> Copiar</Button>}
    </div>
  );
}

function ToolUUID() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(5);

  const generate = () => setUuids(Array.from({ length: count }, () => generateUUID()));

  const copy = async () => {
    await navigator.clipboard.writeText(uuids.join('\n'));
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Generador UUID v4</h3>
      <div className="flex items-center gap-4 mb-4">
        <label className="flex items-center gap-2">
          <span className="text-sm font-medium">Cantidad:</span>
          <input type="number" min="1" max="100" value={count} onChange={e => setCount(Number(e.target.value))} className="w-20 p-2 border-2 border-gray-200 rounded-lg" />
        </label>
        <Button onClick={generate}><RefreshCw className="w-4 h-4 mr-2" /> Generar</Button>
        {uuids.length > 0 && <Button onClick={copy} variant="outline"><Copy className="w-4 h-4 mr-2" /> Copiar</Button>}
      </div>
      <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm space-y-1">
        {uuids.map((u, i) => <div key={i}>{u}</div>)}
      </div>
    </div>
  );
}

function ToolBarcode() {
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

function ToolCase() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [type, setType] = useState<'upper' | 'lower' | 'title' | 'camel' | 'snake' | 'kebab' | 'toggle'>('upper');

  const cases = [
    { id: 'upper' as const, label: 'MAYÚSCULAS' },
    { id: 'lower' as const, label: 'minúsculas' },
    { id: 'title' as const, label: 'Title Case' },
    { id: 'camel' as const, label: 'camelCase' },
    { id: 'snake' as const, label: 'snake_case' },
    { id: 'kebab' as const, label: 'kebab-case' },
    { id: 'toggle' as const, label: 'tOGGLE' },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Convertir Texto</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        {cases.map(c => (
          <button key={c.id} onClick={() => { setType(c.id); setOutput(convertCase(input, c.id)); }}
            className={`p-2 rounded-lg text-sm ${type === c.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
            {c.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea value={input} onChange={e => { setInput(e.target.value); setOutput(convertCase(e.target.value, type)); }} placeholder="Ingresa texto..." className="p-3 border-2 border-gray-200 rounded-lg h-32" />
        <textarea readOnly value={output} className="p-3 border-2 border-gray-200 rounded-lg h-32 bg-gray-50" />
      </div>
      {output && <Button onClick={() => navigator.clipboard.writeText(output)} variant="outline" className="mt-2"><Copy className="w-4 h-4 mr-2" /> Copiar</Button>}
    </div>
  );
}

function ToolHtmlEntity() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">HTML Entities</h3>
      <div className="flex gap-2 mb-4">
        <Button onClick={() => setOutput(entityEncode(input))}>Codificar</Button>
        <Button onClick={() => setOutput(entityDecode(input))}>Decodificar</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Entrada..." className="p-3 border-2 border-gray-200 rounded-lg h-32 font-mono text-sm" />
        <textarea readOnly value={output} className="p-3 border-2 border-gray-200 rounded-lg h-32 font-mono text-sm bg-gray-50" />
      </div>
      {output && <Button onClick={() => navigator.clipboard.writeText(output)} variant="outline" className="mt-2"><Copy className="w-4 h-4 mr-2" /> Copiar</Button>}
    </div>
  );
}

function ToolCron() {
  const [minute, setMinute] = useState('0');
  const [hour, setHour] = useState('12');
  const [dom, setDom] = useState('*');
  const [month, setMonth] = useState('*');
  const [dow, setDow] = useState('*');
  const [cron, setCron] = useState('');

  const generate = () => setCron(generateCron(minute, hour, dom, month, dow));

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Generador Cron</h3>
      <div className="grid grid-cols-5 gap-2 mb-4">
        {[{ id: 'minute', label: 'Minuto', val: minute, set: setMinute, placeholder: '0-59' },
          { id: 'hour', label: 'Hora', val: hour, set: setHour, placeholder: '0-23' },
          { id: 'dom', label: 'Día del mes', val: dom, set: setDom, placeholder: '*' },
          { id: 'month', label: 'Mes', val: month, set: setMonth, placeholder: '*' },
          { id: 'dow', label: 'Día semana', val: dow, set: setDow, placeholder: '*' }].map(f => (
          <div key={f.id}>
            <label className="block text-xs font-medium text-gray-500 mb-1">{f.label}</label>
            <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} className="w-full p-2 border-2 border-gray-200 rounded-lg text-sm text-center" />
          </div>
        ))}
      </div>
      <Button onClick={generate}>Generar</Button>
      {cron && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="font-mono text-lg text-center">{cron}</p>
          <p className="text-sm text-gray-500 text-center mt-2">
            {minute === '*' && hour === '*' && dom === '*' && month === '*' && dow === '*' ? 'Cada minuto' :
             dom !== '*' ? `Se ejecuta el día ${dom} a las ${hour}:${minute}` :
             hour !== '*' ? `Se ejecuta a las ${hour}:${minute}` : 'Expresión personalizada'}
          </p>
        </div>
      )}
    </div>
  );
}

function ToolCssMin() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">CSS Minifier</h3>
      <Button onClick={() => setOutput(cssMinify(input))} className="mb-4">Minimizar</Button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="/* CSS */" className="p-3 border-2 border-gray-200 rounded-lg h-48 font-mono text-sm" />
        <textarea readOnly value={output} className="p-3 border-2 border-gray-200 rounded-lg h-48 font-mono text-sm bg-gray-50" />
      </div>
      {output && (
        <div className="mt-2 flex gap-2">
          <Button onClick={() => navigator.clipboard.writeText(output)} variant="outline"><Copy className="w-4 h-4 mr-2" /> Copiar</Button>
          <span className="text-sm text-gray-500 self-center">Original: {input.length}B → {output.length}B ({Math.round((1 - output.length / input.length) * 100)}% menor)</span>
        </div>
      )}
    </div>
  );
}

function ToolBase64Img() {
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
      <input type="file" accept="image/*" onChange={handleFile} className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
      {b64 && (
        <div className="space-y-4">
          <img src={preview} alt="Preview" className="max-h-48 rounded-lg" />
          <textarea readOnly value={b64} className="w-full h-32 p-3 border-2 border-gray-200 rounded-lg font-mono text-xs" />
          <Button onClick={() => navigator.clipboard.writeText(b64)}><Copy className="w-4 h-4 mr-2" /> Copiar Base64</Button>
          <p className="text-xs text-gray-400 break-all">Tamaño: {(b64.length * 0.75).toFixed(0)} bytes</p>
        </div>
      )}
    </div>
  );
}

// Text Statistics
function ToolTextStats() {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    if (!text) return null;
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, '').length;
    const words = text.split(/\s+/).filter(Boolean).length;
    const lines = text.split('\n').length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    const spaces = (text.match(/\s/g) || []).length;
    const digits = (text.match(/\d/g) || []).length;
    const letters = (text.match(/[a-zA-Z]/g) || []).length;
    const readingTime = Math.ceil(words / 200);
    const speakingTime = Math.ceil(words / 150);
    return { chars, charsNoSpace, words, lines, sentences, paragraphs, spaces, digits, letters, readingTime, speakingTime };
  }, [text]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Estadísticas de Texto</h3>
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Pega o escribe tu texto aquí..." className="w-full p-3 border-2 border-gray-200 rounded-lg h-48 font-mono text-sm mb-4" />
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Caracteres', value: stats.chars },
            { label: 'Sin espacios', value: stats.charsNoSpace },
            { label: 'Palabras', value: stats.words },
            { label: 'Líneas', value: stats.lines },
            { label: 'Oraciones', value: stats.sentences },
            { label: 'Párrafos', value: stats.paragraphs },
            { label: 'Espacios', value: stats.spaces },
            { label: 'Dígitos', value: stats.digits },
            { label: 'Letras', value: stats.letters },
            { label: 'Lectura', value: `${stats.readingTime} min` },
            { label: 'Habla', value: `${stats.speakingTime} min` },
          ].map(s => (
            <div key={s.label} className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className="text-lg font-semibold text-gray-800">{s.value}</p>
            </div>
          ))}
        </div>
      )}
      {!text && <p className="text-sm text-gray-400">Comienza a escribir para ver las estadísticas.</p>}
    </div>
  );
}

// Number Base Converter
function ToolNumberBase() {
  const [input, setInput] = useState('255');
  const [fromBase, setFromBase] = useState<2 | 8 | 10 | 16>(10);

  const convert = useMemo(() => {
    const val = parseInt(input, fromBase);
    if (isNaN(val)) return null;
    return {
      bin: val.toString(2),
      oct: val.toString(8),
      dec: val.toString(10),
      hex: val.toString(16).toUpperCase(),
    };
  }, [input, fromBase]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Conversor de Bases Numéricas</h3>
      <div className="flex gap-2 mb-4">
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Valor" className="flex-1 p-3 border-2 border-gray-200 rounded-lg font-mono" />
        <select value={fromBase} onChange={e => setFromBase(Number(e.target.value) as any)} className="p-3 border-2 border-gray-200 rounded-lg bg-white">
          <option value={2}>Binario</option>
          <option value={8}>Octal</option>
          <option value={10}>Decimal</option>
          <option value={16}>Hexadecimal</option>
        </select>
      </div>
      {convert && (
        <div className="space-y-2">
          {[
            { label: 'Binario (2)', value: convert.bin, base: 2 },
            { label: 'Octal (8)', value: convert.oct, base: 8 },
            { label: 'Decimal (10)', value: convert.dec, base: 10 },
            { label: 'Hexadecimal (16)', value: convert.hex, base: 16 },
          ].map(b => (
            <div key={b.base} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-xs font-medium text-gray-500 w-28 shrink-0">{b.label}</span>
              <code className="flex-1 font-mono text-sm">{b.value}</code>
              <button onClick={() => navigator.clipboard.writeText(b.value)} className="p-1 hover:bg-gray-200 rounded">
                <Copy className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Timestamp Converter
function ToolTimestamp() {
  const [timestamp, setTimestamp] = useState(Math.floor(Date.now() / 1000).toString());
  const [dateStr, setDateStr] = useState(new Date().toISOString().slice(0, 16));

  const tsToDate = () => {
    const ts = parseInt(timestamp);
    if (isNaN(ts)) return;
    const d = new Date(ts * 1000);
    setDateStr(d.toISOString().slice(0, 16));
  };

  const dateToTs = () => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return;
    setTimestamp(Math.floor(d.getTime() / 1000).toString());
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Conversor de Timestamp Unix</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Timestamp Unix (segundos)</label>
          <div className="flex gap-2">
            <input value={timestamp} onChange={e => setTimestamp(e.target.value)} placeholder="1700000000" className="flex-1 p-3 border-2 border-gray-200 rounded-lg font-mono" />
            <Button onClick={tsToDate} variant="outline">→ Fecha</Button>
          </div>
          <p className="text-xs text-gray-400 mt-1">Muestra local: {new Date(parseInt(timestamp) * 1000).toLocaleString()}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha y hora</label>
          <div className="flex gap-2">
            <input type="datetime-local" value={dateStr} onChange={e => setDateStr(e.target.value)} className="flex-1 p-3 border-2 border-gray-200 rounded-lg" />
            <Button onClick={dateToTs} variant="outline">→ Timestamp</Button>
          </div>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg text-sm text-blue-700">
          <p className="font-medium mb-1">Timestamps comunes:</p>
          <div className="space-y-1">
            <button onClick={() => { setTimestamp(Math.floor(Date.now() / 1000).toString()); tsToDate(); }} className="block hover:underline">Ahora: {Math.floor(Date.now() / 1000)}</button>
            <button onClick={() => { setTimestamp('0'); tsToDate(); }} className="block hover:underline">Unix epoch: 0 → 01/01/1970</button>
            <button onClick={() => { setTimestamp('2147483647'); tsToDate(); }} className="block hover:underline">Máx 32-bit: 2147483647</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function UtilitiesPage() {
  const [selectedTool, setSelectedTool] = useState<UtilityTool>('password');

  const renderTool = () => {
    switch (selectedTool) {
      case 'password': return <ToolPassword />;
      case 'lorem': return <ToolLorem />;
      case 'uuid': return <ToolUUID />;
      case 'barcode': return <ToolBarcode />;
      case 'case': return <ToolCase />;
      case 'html-entity': return <ToolHtmlEntity />;
      case 'cron': return <ToolCron />;
      case 'css-min': return <ToolCssMin />;
      case 'base64-img': return <ToolBase64Img />;
      case 'text-stats': return <ToolTextStats />;
      case 'number-base': return <ToolNumberBase />;
      case 'timestamp': return <ToolTimestamp />;
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
