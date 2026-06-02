import { useState } from 'react';
import { Delete } from 'lucide-react';
import { Button } from '../ui/Button';

const CONSTANTS: Record<string, number> = {
  pi: Math.PI,
  e: Math.E,
};

const FUNCTIONS: Record<string, (x: number) => number> = {
  sqrt: Math.sqrt,
  abs: Math.abs,
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  log: Math.log10,
  ln: Math.log,
  ceil: Math.ceil,
  floor: Math.floor,
  round: Math.round,
};

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function evaluate(expr: string): number {
  let cleaned = expr.replace(/\s+/g, '').replace(/\^/g, '**');

  for (const [name, val] of Object.entries(CONSTANTS)) {
    cleaned = cleaned.replace(new RegExp(`\\b${escapeRe(name)}\\b`, 'g'), `(${val})`);
  }

  for (const [name, fn] of Object.entries(FUNCTIONS)) {
    cleaned = cleaned.replace(new RegExp(`${escapeRe(name)}\\(([^)]+)\\)`, 'g'), (_, arg) => {
      const val = evaluate(arg);
      return String(fn(val));
    });
  }

  cleaned = cleaned.replace(/(\d+)\(/g, '$1*(');
  cleaned = cleaned.replace(/\)(\d)/g, ')*$1');
  cleaned = cleaned.replace(/\)\(/g, ')*(');

  if (!/^[\d+\-*/().%**]+$/.test(cleaned)) {
    throw new Error('Expresión inválida');
  }

  const result = Function(`"use strict"; return (${cleaned})`)();
  if (typeof result !== 'number' || isNaN(result)) {
    throw new Error('Resultado no válido');
  }
  return result;
}

export function ExpressionCalculator() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [history, setHistory] = useState<string[]>([]);

  const calc = () => {
    try {
      setError('');
      const val = evaluate(expression);
      const formatted = Number.isInteger(val)
        ? val.toString()
        : val.toFixed(10).replace(/\.?0+$/, '');
      setResult(formatted);
      setHistory((prev) => [`${expression} = ${formatted}`, ...prev].slice(0, 20));
    } catch {
      setError('Expresión inválida');
      setResult('');
    }
  };

  const insert = (val: string) => setExpression((prev) => prev + val);

  const buttons = [
    ['7', '8', '9', '/', 'sqrt'],
    ['4', '5', '6', '*', '^'],
    ['1', '2', '3', '-', 'abs'],
    ['0', '.', '(', '+', 'sin'],
    ['pi', 'e', ')', '%', 'cos'],
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Calculadora de Expresiones</h3>

      {/* Input */}
      <div className="flex gap-2 mb-4">
        <input
          value={expression}
          onChange={(e) => {
            setExpression(e.target.value);
            setError('');
          }}
          onKeyDown={(e) => e.key === 'Enter' && calc()}
          placeholder="2*(3+4) - sqrt(16) + sin(pi/2)"
          className="flex-1 p-3 border-2 border-gray-200 rounded-lg font-mono text-lg"
        />
        <Button onClick={calc}>Calcular</Button>
        <button
          onClick={() => {
            setExpression('');
            setResult('');
            setError('');
          }}
          className="p-2 rounded-lg hover:bg-slate-100 text-text-muted"
        >
          <Delete className="w-5 h-5" />
        </button>
      </div>

      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
      {result && (
        <div className="p-3 bg-green-50 rounded-lg mb-4">
          <span className="text-sm text-green-700">= </span>
          <span className="text-lg font-bold text-green-800 font-mono">{result}</span>
        </div>
      )}

      {/* Keypad */}
      <div className="grid grid-cols-5 gap-1.5 mb-4">
        {buttons.map((row, ri) =>
          row.map((btn) => (
            <button
              key={`${ri}-${btn}`}
              onClick={() => insert(btn)}
              className="p-2 rounded-lg bg-surface-secondary hover:bg-slate-200 text-sm font-mono text-text transition-colors"
            >
              {btn}
            </button>
          )),
        )}
      </div>

      {/* History */}
      {history.length > 0 && (
        <div>
          <p className="text-xs font-medium text-text-muted mb-2">Historial</p>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {history.map((item, i) => (
              <button
                key={i}
                onClick={() => {
                  const expr = item.split(' = ')[0];
                  setExpression(expr);
                }}
                className="block w-full text-left px-3 py-1 text-sm font-mono text-text-secondary hover:bg-surface-secondary rounded transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
