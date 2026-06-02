import { useState } from 'react';
import { Lock, Unlock, Download, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';

export function FileEncryptor() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [result, setResult] = useState<{ blob: Blob; url: string; filename: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const deriveKey = async (pwd: string, salt: Uint8Array) => {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(pwd), 'PBKDF2', false, [
      'deriveKey',
    ]);
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: salt as unknown as ArrayBuffer, iterations: 100000, hash: 'SHA-256' },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt'],
    );
  };

  const process = async () => {
    if (!file || !password) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = new Uint8Array(await file.arrayBuffer());

      if (mode === 'encrypt') {
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const key = await deriveKey(password, salt);
        const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data);

        const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
        combined.set(salt, 0);
        combined.set(iv, salt.length);
        combined.set(new Uint8Array(encrypted), salt.length + iv.length);

        const blob = new Blob([combined], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        setResult({ blob, url, filename: file.name + '.enc' });
      } else {
        const salt = data.slice(0, 16);
        const iv = data.slice(16, 28);
        const encrypted = data.slice(28);
        const key = await deriveKey(password, salt);
        const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, encrypted);

        const blob = new Blob([decrypted]);
        const url = URL.createObjectURL(blob);
        const originalName = file.name.replace(/\.enc$/, '');
        setResult({ blob, url, filename: originalName });
      }
    } catch {
      setError('Error al procesar. Verifica la contraseña y el archivo.');
    }
    setLoading(false);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Encriptador / Desencriptador</h3>
      <p className="text-sm text-text-secondary mb-4">
        AES-256-GCM. Todo en tu navegador, sin servidores.
      </p>

      {/* Warning */}
      <div className="flex items-start gap-2 p-3 bg-amber-50 text-amber-700 rounded-lg text-sm mb-4">
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
        <span>Si pierdes la contraseña, no hay forma de recuperar el archivo.</span>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode('encrypt')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'encrypt'
              ? 'bg-brand-600 text-white'
              : 'bg-surface-secondary text-text-secondary'
          }`}
        >
          <Lock className="w-4 h-4" /> Encriptar
        </button>
        <button
          onClick={() => setMode('decrypt')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'decrypt'
              ? 'bg-brand-600 text-white'
              : 'bg-surface-secondary text-text-secondary'
          }`}
        >
          <Unlock className="w-4 h-4" /> Desencriptar
        </button>
      </div>

      {/* File input */}
      <div>
        <label
          htmlFor="encrypt-file-input"
          className="dropzone flex flex-col items-center justify-center h-24 cursor-pointer mb-4"
        >
          <p className="text-sm text-text-secondary">
            {file ? file.name : 'Arrastra o selecciona un archivo'}
          </p>
        </label>
        <input
          id="encrypt-file-input"
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="hidden"
        />
      </div>

      {/* Password */}
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Ingresa una contraseña"
        className="input-field w-full mb-4"
      />

      {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm mb-4">{error}</div>}

      <Button onClick={process} disabled={!file || !password || loading}>
        {loading ? 'Procesando...' : mode === 'encrypt' ? 'Encriptar' : 'Desencriptar'}
      </Button>

      {result && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-700 font-medium mb-2">
            {mode === 'encrypt' ? 'Archivo encriptado listo' : 'Archivo desencriptado listo'}
          </p>
          <a href={result.url} download={result.filename}>
            <Button size="sm">
              <Download className="w-4 h-4 mr-1" /> Descargar {result.filename}
            </Button>
          </a>
        </div>
      )}
    </div>
  );
}
