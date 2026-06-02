type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/** Global gtag function type (Google Analytics) */
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  source?: string;
}

interface ConversionLog {
  timestamp: string;
  tool: string;
  inputFormat: string;
  outputFormat: string;
  fileSize: number;
  duration: number;
  success: boolean;
  error?: string;
}

interface PerformanceLog {
  timestamp: string;
  metric: string;
  value: number;
  unit: string;
  context?: Record<string, unknown>;
}

interface ToolUsageLog {
  timestamp: string;
  tool: string;
  action: string;
  duration?: number;
  metadata?: Record<string, unknown>;
}

class Logger {
  private logs: LogEntry[] = [];
  private conversionLogs: ConversionLog[] = [];
  private performanceLogs: PerformanceLog[] = [];
  private toolUsageLogs: ToolUsageLog[] = [];
  private maxLogs = 1000;

  private createEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    source?: string,
  ): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      source,
    };

    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    if (import.meta.env.DEV) {
      const style = this.getConsoleStyle(level);
      console.log(`%c[${level.toUpperCase()}] ${message}`, style, context || '');
    }

    return entry;
  }

  private getConsoleStyle(level: LogLevel): string {
    switch (level) {
      case 'error':
        return 'color: #ef4444; font-weight: bold';
      case 'warn':
        return 'color: #f59e0b; font-weight: bold';
      case 'info':
        return 'color: #3b82f6; font-weight: bold';
      case 'debug':
        return 'color: #6b7280';
      default:
        return '';
    }
  }

  debug(message: string, context?: Record<string, unknown>, source?: string) {
    return this.createEntry('debug', message, context, source);
  }

  info(message: string, context?: Record<string, unknown>, source?: string) {
    return this.createEntry('info', message, context, source);
  }

  warn(message: string, context?: Record<string, unknown>, source?: string) {
    return this.createEntry('warn', message, context, source);
  }

  error(message: string, context?: Record<string, unknown>, source?: string) {
    return this.createEntry('error', message, context, source);
  }

  logConversion(log: ConversionLog) {
    this.conversionLogs.push(log);
    if (this.conversionLogs.length > this.maxLogs) {
      this.conversionLogs.shift();
    }

    this.info(
      'Conversion completed',
      {
        tool: log.tool,
        success: log.success,
        duration: log.duration,
      },
      'converter',
    );

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        event_category: 'converter',
        event_label: log.tool,
        value: log.duration,
      });
    }
  }

  logPerformance(log: PerformanceLog) {
    this.performanceLogs.push(log);
    if (this.performanceLogs.length > this.maxLogs) {
      this.performanceLogs.shift();
    }

    this.debug(
      `Performance: ${log.metric}`,
      {
        value: log.value,
        unit: log.unit,
      },
      'performance',
    );
  }

  logToolUsage(log: ToolUsageLog) {
    this.toolUsageLogs.push(log);
    if (this.toolUsageLogs.length > this.maxLogs) {
      this.toolUsageLogs.shift();
    }

    this.info(
      `Tool used: ${log.tool}`,
      {
        action: log.action,
        duration: log.duration,
      },
      'analytics',
    );
  }

  getConversionStats() {
    const total = this.conversionLogs.length;
    const successful = this.conversionLogs.filter((l) => l.success).length;
    const failed = total - successful;
    const avgDuration =
      total > 0 ? this.conversionLogs.reduce((sum, l) => sum + l.duration, 0) / total : 0;

    const byTool = this.conversionLogs.reduce(
      (acc, log) => {
        acc[log.tool] = (acc[log.tool] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return { total, successful, failed, avgDuration, byTool };
  }

  getPerformanceStats() {
    const byMetric = this.performanceLogs.reduce(
      (acc, log) => {
        if (!acc[log.metric]) {
          acc[log.metric] = { values: [], unit: log.unit };
        }
        acc[log.metric].values.push(log.value);
        return acc;
      },
      {} as Record<string, { values: number[]; unit: string }>,
    );

    const stats = Object.entries(byMetric).map(([metric, data]) => ({
      metric,
      unit: data.unit,
      min: Math.min(...data.values),
      max: Math.max(...data.values),
      avg: data.values.reduce((a, b) => a + b, 0) / data.values.length,
      count: data.values.length,
    }));

    return stats;
  }

  getToolUsageStats() {
    const total = this.toolUsageLogs.length;
    const byTool = this.toolUsageLogs.reduce(
      (acc, log) => {
        acc[log.tool] = (acc[log.tool] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const byAction = this.toolUsageLogs.reduce(
      (acc, log) => {
        acc[log.action] = (acc[log.action] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return { total, byTool, byAction };
  }

  getRecentLogs(count = 50): LogEntry[] {
    return this.logs.slice(-count);
  }

  getAllConversionLogs(): ConversionLog[] {
    return [...this.conversionLogs];
  }

  exportLogs() {
    return {
      logs: this.logs,
      conversions: this.conversionLogs,
      performance: this.performanceLogs,
      toolUsage: this.toolUsageLogs,
      exportedAt: new Date().toISOString(),
    };
  }

  clear() {
    this.logs = [];
    this.conversionLogs = [];
    this.performanceLogs = [];
    this.toolUsageLogs = [];
  }
}

export const logger = new Logger();
