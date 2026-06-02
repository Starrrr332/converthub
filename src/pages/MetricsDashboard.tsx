import { useState, useEffect } from 'react';
import { logger } from '../monitoring/logger';
import { analytics } from '../monitoring/analytics';

interface Stats {
  conversions: ReturnType<typeof logger.getConversionStats>;
  performance: ReturnType<typeof logger.getPerformanceStats>;
  toolUsage: ReturnType<typeof logger.getToolUsageStats>;
  analytics: ReturnType<typeof analytics.getStats>;
}

export function MetricsDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const loadStats = () => {
      setStats({
        conversions: logger.getConversionStats(),
        performance: logger.getPerformanceStats(),
        toolUsage: logger.getToolUsageStats(),
        analytics: analytics.getStats(),
      });
    };

    loadStats();
    const interval = setInterval(loadStats, 5000);
    return () => clearInterval(interval);
  }, [refreshKey]);

  if (!stats) {
    return <div className="p-8 text-center">Cargando métricas...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard de Métricas</h1>
          <button
            onClick={() => setRefreshKey(k => k + 1)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Actualizar
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Conversiones Totales"
            value={stats.conversions.total}
            icon="🔄"
          />
          <StatCard
            title="Conversiones Exitosas"
            value={stats.conversions.successful}
            icon="✅"
            color="text-green-600"
          />
          <StatCard
            title="Conversiones Fallidas"
            value={stats.conversions.failed}
            icon="❌"
            color="text-red-600"
          />
          <StatCard
            title="Tiempo Promedio"
            value={`${(stats.conversions.avgDuration / 1000).toFixed(2)}s`}
            icon="⏱️"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Uso por Herramienta</h2>
            <div className="space-y-3">
              {Object.entries(stats.conversions.byTool).map(([tool, count]) => (
                <div key={tool} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{tool}</span>
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                </div>
              ))}
              {Object.keys(stats.conversions.byTool).length === 0 && (
                <p className="text-sm text-gray-500 italic">No hay datos de conversiones aún</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Métricas de Rendimiento</h2>
            <div className="space-y-3">
              {stats.performance.map((perf) => (
                <div key={perf.metric} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{perf.metric}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {perf.avg.toFixed(2)}{perf.unit} (avg)
                  </span>
                </div>
              ))}
              {stats.performance.length === 0 && (
                <p className="text-sm text-gray-500 italic">No hay métricas de rendimiento aún</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Uso de Herramientas</h2>
            <div className="space-y-3">
              {Object.entries(stats.toolUsage.byTool).map(([tool, count]) => (
                <div key={tool} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{tool}</span>
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                </div>
              ))}
              {Object.keys(stats.toolUsage.byTool).length === 0 && (
                <p className="text-sm text-gray-500 italic">No hay datos de uso aún</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Analytics</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Páginas Visitadas</span>
                <span className="text-sm font-medium text-gray-900">{stats.analytics.totalPageViews}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Eventos Totales</span>
                <span className="text-sm font-medium text-gray-900">{stats.analytics.totalEvents}</span>
              </div>
              <div className="pt-3 border-t">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Páginas Más Visitadas</p>
                {Object.entries(stats.analytics.pageViewCounts)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([path, count]) => (
                    <div key={path} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 truncate">{path}</span>
                      <span className="font-medium text-gray-900">{count}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Logs Recientes</h2>
            <button
              onClick={() => {
                const data = logger.exportLogs();
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `metrics-export-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Exportar Logs
            </button>
          </div>
          <div className="overflow-auto max-h-96">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tiempo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nivel</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mensaje</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fuente</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logger.getRecentLogs(20).map((log, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        log.level === 'error' ? 'bg-red-100 text-red-800' :
                        log.level === 'warn' ? 'bg-yellow-100 text-yellow-800' :
                        log.level === 'info' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {log.level.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 max-w-md truncate">{log.message}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{log.source || '-'}</td>
                  </tr>
                ))}
                {logger.getRecentLogs(20).length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-500">
                      No hay logs recientes
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color = 'text-gray-900' }: {
  title: string;
  value: string | number;
  icon: string;
  color?: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );
}
