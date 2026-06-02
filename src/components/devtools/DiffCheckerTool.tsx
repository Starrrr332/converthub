import { useState } from 'react';

export function DiffCheckerTool() {
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');
  const [diffLines, setDiffLines] = useState<
    Array<{ type: 'same' | 'added' | 'removed'; text: string }>
  >([]);

  const computeDiff = async () => {
    const { diffArrays } = await import('diff');
    const lLines = left.split('\n');
    const rLines = right.split('\n');
    const changes = diffArrays(lLines, rLines);
    const result: Array<{ type: 'same' | 'added' | 'removed'; text: string }> = [];

    for (const change of changes) {
      for (const value of change.value as string[]) {
        if (change.added) {
          result.push({ type: 'added', text: value });
        } else if (change.removed) {
          result.push({ type: 'removed', text: value });
        } else {
          result.push({ type: 'same', text: value });
        }
      }
    }
    setDiffLines(result);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Diff Checker</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <textarea
          value={left}
          onChange={(e) => setLeft(e.target.value)}
          placeholder="Texto original"
          className="input-field h-48 font-mono text-sm"
        />
        <textarea
          value={right}
          onChange={(e) => setRight(e.target.value)}
          placeholder="Texto modificado"
          className="input-field h-48 font-mono text-sm"
        />
      </div>
      <button
        onClick={computeDiff}
        className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 mb-4 transition-colors"
      >
        Comparar
      </button>
      {diffLines.length > 0 && (
        <div className="border border-border rounded-lg overflow-hidden">
          {diffLines.map((line, i) => (
            <div
              key={i}
              className={`px-3 py-1 font-mono text-sm ${
                line.type === 'added'
                  ? 'bg-green-50 text-green-800'
                  : line.type === 'removed'
                    ? 'bg-red-50 text-red-800'
                    : 'bg-surface'
              }`}
            >
              <span className="mr-2 font-bold select-none">
                {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
              </span>
              {line.text || ' '}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
