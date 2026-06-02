import { Link } from 'react-router-dom';
import { Star, Clock, Trash2, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageLayout } from '../components/layout/PageLayout';
import { useCommandStore } from '../store/commandStore';
import { toolRegistry } from '../config/toolRegistry';

export function FavoritesPage() {
  const { t } = useTranslation();
  const { favorites, recentPaths, removeFavorite, clearRecent } = useCommandStore();

  const favoriteTools = favorites
    .map((path) => toolRegistry.find((t) => t.path === path))
    .filter((t): t is typeof toolRegistry[number] => Boolean(t));

  const recentTools = recentPaths
    .map((path) => toolRegistry.find((t) => t.path === path))
    .filter((t): t is typeof toolRegistry[number] => Boolean(t));

  return (
    <PageLayout
      title="Mis Favoritos"
      subtitle="Herramientas que marcaste como favoritas y tu historial reciente."
      breadcrumb={[{ label: t('nav.home'), to: '/' }, { label: 'Favoritos' }]}
    >
      {/* Favorites */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Favoritos
          </h2>
        </div>

        {favoriteTools.length === 0 ? (
          <div className="card p-8 text-center">
            <Star className="w-10 h-10 text-text-muted mx-auto mb-3" />
            <p className="text-sm text-text-secondary">Aún no tienes favoritos.</p>
            <p className="text-xs text-text-muted mt-1">Haz clic en la estrella de cualquier herramienta para agregarla.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {favoriteTools.map((tool) => (
              <Link
                key={tool.path}
                to={tool.path}
                className="card-interactive flex items-center gap-3 group"
              >
                <div className={`p-2 rounded-lg ${tool.bg} ${tool.color} shrink-0`}>
                  <tool.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text truncate">{tool.name}</p>
                  <p className="text-xs text-text-muted truncate">{tool.homeDesc}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => { e.preventDefault(); removeFavorite(tool.path); }}
                    className="p-1 rounded hover:bg-red-50 text-text-muted hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    title="Quitar de favoritos"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-brand-600 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Recent History */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text flex items-center gap-2">
            <Clock className="w-5 h-5 text-brand-500" />
            Historial reciente
          </h2>
          {recentTools.length > 0 && (
            <button
              onClick={clearRecent}
              className="text-xs text-text-muted hover:text-red-500 transition-colors"
            >
              Limpiar historial
            </button>
          )}
        </div>

        {recentTools.length === 0 ? (
          <div className="card p-8 text-center">
            <Clock className="w-10 h-10 text-text-muted mx-auto mb-3" />
            <p className="text-sm text-text-secondary">Sin historial reciente.</p>
            <p className="text-xs text-text-muted mt-1">Usa las herramientas y aparecerán aquí.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentTools.map((tool) => (
              <Link
                key={tool.path}
                to={tool.path}
                className="flex items-center gap-3 px-4 py-3 card hover:border-brand-200 transition-colors group"
              >
                <div className={`p-1.5 rounded-lg ${tool.bg} ${tool.color} shrink-0`}>
                  <tool.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text">{tool.name}</p>
                  <p className="text-xs text-text-muted">{tool.homeDesc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-brand-600 transition-colors" />
              </Link>
            ))}
          </div>
        )}
      </section>
    </PageLayout>
  );
}
