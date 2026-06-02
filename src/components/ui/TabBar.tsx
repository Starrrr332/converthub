import { Link, useLocation } from 'react-router-dom';
import { X, Plus } from 'lucide-react';
import { useTabsStore } from '../../store/tabsStore';
import { toolRegistry } from '../../config/toolRegistry';

export function TabBar() {
  const { tabs, setActiveTab, removeTab } = useTabsStore();
  const location = useLocation();

  if (tabs.length === 0) return null;

  return (
    <div className="border-b border-border bg-surface">
      <div className="page-container">
        <div className="flex items-center gap-1 overflow-x-auto py-1 -mb-px">
          {tabs.map((tab) => {
            const tool = toolRegistry.find((t) => t.path === tab.path);
            const isActive = location.pathname === tab.path;
            return (
              <Link
                key={tab.id}
                to={tab.path}
                onClick={() => setActiveTab(tab.id)}
                className={`group flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-brand-500 text-brand-700 bg-brand-50'
                    : 'border-transparent text-text-secondary hover:text-text hover:bg-surface-secondary'
                }`}
              >
                {tool && <tool.icon className="w-3.5 h-3.5" />}
                <span>{tab.label}</span>
                <button
                  onClick={(e) => { e.preventDefault(); removeTab(tab.id); }}
                  className="p-0.5 rounded hover:bg-slate-200 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </Link>
            );
          })}
          {tabs.length < 5 && (
            <Link
              to="/"
              className="flex items-center gap-1 px-2 py-2 text-xs text-text-muted hover:text-text rounded-t-lg hover:bg-surface-secondary transition-colors"
              title="Abrir nueva pestaña"
            >
              <Plus className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
