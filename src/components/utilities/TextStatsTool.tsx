import { useState, useMemo } from 'react';

export function TextStatsTool() {
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
