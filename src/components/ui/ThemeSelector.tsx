import { Check } from 'lucide-react';
import { useThemeStore, themes } from '../../store/themeStore';

export function ThemeSelector() {
  const { currentTheme, setTheme } = useThemeStore();

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-text">Tema de color</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => setTheme(theme.id)}
            className={`flex items-center gap-2 p-2.5 rounded-lg border-2 transition-all text-left ${
              currentTheme === theme.id
                ? 'border-brand-500 bg-brand-50'
                : 'border-border hover:border-brand-200'
            }`}
          >
            <div className="flex gap-0.5 shrink-0">
              {Object.values(theme.brand).slice(4, 7).map((color, i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <span className="text-xs font-medium text-text truncate">{theme.name}</span>
            {currentTheme === theme.id && (
              <Check className="w-3.5 h-3.5 text-brand-600 shrink-0 ml-auto" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
