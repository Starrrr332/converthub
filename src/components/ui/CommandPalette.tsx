import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { Search, Star, Clock, ArrowRight, X } from 'lucide-react';
import { toolRegistry } from '../../config/toolRegistry';
import { useCommandStore } from '../../store/commandStore';
import { useFocusTrap } from '../../hooks/useFocusTrap';

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { favorites, recentPaths, addRecent } = useCommandStore();

  const fuse = useMemo(
    () =>
      new Fuse(toolRegistry, {
        keys: ['name', 'labelKey', 'homeDesc'],
        threshold: 0.4,
        includeScore: true,
      }),
    [],
  );

  const recentTools = useMemo(
    () =>
      recentPaths
        .map((path) => toolRegistry.find((t) => t.path === path))
        .filter((t): t is (typeof toolRegistry)[number] => Boolean(t)),
    [recentPaths],
  );

  const favoriteTools = useMemo(
    () =>
      favorites
        .map((path) => toolRegistry.find((t) => t.path === path))
        .filter((t): t is (typeof toolRegistry)[number] => Boolean(t)),
    [favorites],
  );

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return fuse.search(query).map((r) => r.item);
  }, [query, fuse]);

  const allItems = useMemo(() => {
    if (query.trim()) return results;
    const items: typeof toolRegistry = [];
    if (recentTools.length > 0) items.push(...recentTools);
    if (favoriteTools.length > 0) items.push(...favoriteTools);
    if (items.length === 0) items.push(...toolRegistry);
    return items;
  }, [query, results, recentTools, favoriteTools]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery('');
      const raf = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(raf);
    }
  }, [isOpen]);

  const selectTool = (path: string) => {
    addRecent(path);
    navigate(path);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, allItems.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && allItems[selectedIndex]) {
      selectTool(allItems[selectedIndex].path);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const focusTrapRef = useFocusTrap(isOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} aria-hidden="true" />
      <div
        ref={focusTrapRef}
        role="dialog"
        aria-modal="true"
        aria-label="Paleta de comandos"
        className="relative w-full max-w-lg bg-surface rounded-xl shadow-2xl border border-border overflow-hidden"
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="w-5 h-5 text-text-muted shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Buscar herramienta..."
            className="flex-1 bg-transparent text-text text-sm outline-none placeholder:text-text-muted"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium text-text-muted bg-surface-secondary rounded border border-border">
            ESC
          </kbd>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-surface-secondary rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-text-muted" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto py-2">
          {!query.trim() && recentTools.length > 0 && (
            <div className="px-3 py-1.5">
              <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider px-2 flex items-center gap-1.5">
                <Clock className="w-3 h-3" /> Recientes
              </p>
            </div>
          )}

          {!query.trim() && favoriteTools.length > 0 && recentTools.length === 0 && (
            <div className="px-3 py-1.5">
              <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider px-2 flex items-center gap-1.5">
                <Star className="w-3 h-3" /> Favoritos
              </p>
            </div>
          )}

          {query.trim() && results.length === 0 && (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-text-muted">No se encontraron resultados para "{query}"</p>
            </div>
          )}

          {allItems.map((tool, index) => (
            <button
              key={tool.path}
              onClick={() => selectTool(tool.path)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                index === selectedIndex
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-text hover:bg-surface-secondary'
              }`}
            >
              <div
                className={`p-1.5 rounded-lg shrink-0 ${
                  index === selectedIndex
                    ? 'bg-brand-100 text-brand-600'
                    : 'bg-surface-secondary text-text-muted'
                }`}
              >
                <tool.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{tool.name}</p>
                <p className="text-xs text-text-muted truncate">{tool.homeDesc}</p>
              </div>
              <ArrowRight
                className={`w-4 h-4 shrink-0 transition-opacity ${
                  index === selectedIndex ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-border flex items-center gap-4 text-[11px] text-text-muted">
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 bg-surface-secondary rounded border border-border">↑↓</kbd>{' '}
            navegar
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 bg-surface-secondary rounded border border-border">↵</kbd>{' '}
            abrir
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 bg-surface-secondary rounded border border-border">esc</kbd>{' '}
            cerrar
          </span>
        </div>
      </div>
    </div>
  );
}
