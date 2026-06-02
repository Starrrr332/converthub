import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from 'web-vitals';
import { logger } from './logger';

type VitalMetric = Metric & {
  delta: number;
  id: string;
  name: string;
  rating: 'good' | 'needs-improvement' | 'poor';
  value: number;
};

function sendToAnalytics(metric: VitalMetric) {
  logger.logPerformance({
    timestamp: new Date().toISOString(),
    metric: metric.name,
    value: metric.value,
    unit: metric.name === 'CLS' ? '' : 'ms',
    context: {
      id: metric.id,
      rating: metric.rating,
      delta: metric.delta,
    },
  });

  const gtag = (window as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag === 'function') {
    gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
    });
  }
}

export function reportWebVitals() {
  try {
    onCLS(sendToAnalytics);
    onFCP(sendToAnalytics);
    onINP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
    logger.info('Web Vitals reporting initialized', {}, 'performance');
  } catch (error) {
    logger.warn('Failed to initialize Web Vitals', { error: String(error) }, 'performance');
  }
}
