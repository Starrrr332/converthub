import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCommandStore } from '../store/commandStore';

interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  action: () => void;
  description: string;
}

export function useKeyboardShortcuts() {
  const navigate = useNavigate();
  const { favorites } = useCommandStore();

  useEffect(() => {
    const shortcuts: ShortcutConfig[] = [
      // Ctrl+K: Command Palette (handled by CommandPalette component)
      // Ctrl+1-9: Navigate to favorite N
      ...Array.from({ length: 9 }, (_, i) => ({
        key: String(i + 1),
        ctrl: true,
        action: () => {
          if (favorites[i]) {
            navigate(favorites[i]);
          }
        },
        description: `Abrir favorito ${i + 1}`,
      })),
      // Escape: Close modals (handled by individual components)
    ];

    const handler = (e: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl ? (e.metaKey || e.ctrlKey) : true;
        const shiftMatch = shortcut.shift ? e.shiftKey : true;
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();

        if (ctrlMatch && shiftMatch && keyMatch) {
          // Don't trigger if user is typing in an input/textarea
          const target = e.target as HTMLElement;
          if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
            return;
          }
          e.preventDefault();
          shortcut.action();
          return;
        }
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate, favorites]);
}

export const SHORTCUT_HELP = [
  { keys: ['Ctrl', 'K'], description: 'Buscar herramienta' },
  { keys: ['Ctrl', '1-9'], description: 'Ir a favorito N' },
  { keys: ['Esc'], description: 'Cerrar modales' },
];
