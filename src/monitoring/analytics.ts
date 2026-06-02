import { logger } from './logger';

interface AnalyticsEvent {
  name: string;
  props?: Record<string, string | number | boolean>;
}

interface PageView {
  path: string;
  title: string;
  timestamp: string;
}

class Analytics {
  private enabled: boolean;
  private domain: string;
  private pageViews: PageView[] = [];
  private events: AnalyticsEvent[] = [];
  private maxStored = 500;

  constructor() {
    this.enabled = import.meta.env.PROD && !import.meta.env.VITE_DISABLE_ANALYTICS;
    this.domain = import.meta.env.VITE_ANALYTICS_DOMAIN || 'converthub.app';

    if (this.enabled) {
      this.loadPlausible();
    }
  }

  private loadPlausible() {
    if (typeof window === 'undefined') return;

    const script = document.createElement('script');
    script.defer = true;
    script.data-domain = this.domain;
    script.src = 'https://plausible.io/js/script.tagged-events.js';
    document.head.appendChild(script);

    logger.info('Plausible analytics loaded', { domain: this.domain }, 'analytics');
  }

  trackPageView(path: string, title?: string) {
    const pageView: PageView = {
      path,
      title: title || document.title,
      timestamp: new Date().toISOString(),
    };

    this.pageViews.push(pageView);
    if (this.pageViews.length > this.maxStored) {
      this.pageViews.shift();
    }

    logger.debug('Page view tracked', { path }, 'analytics');

    if (this.enabled && typeof window !== 'undefined' && (window as any).plausible) {
      (window as any).plausible('pageview', { props: { path } });
    }
  }

  trackEvent(name: string, props?: Record<string, string | number | boolean>) {
    const event: AnalyticsEvent = { name, props };

    this.events.push(event);
    if (this.events.length > this.maxStored) {
      this.events.shift();
    }

    logger.logToolUsage({
      timestamp: new Date().toISOString(),
      tool: props?.tool as string || 'unknown',
      action: name,
      metadata: props,
    });

    if (this.enabled && typeof window !== 'undefined' && (window as any).plausible) {
      (window as any).plausible(name, { props });
    }
  }

  trackConversion(tool: string, inputFormat: string, outputFormat: string, fileSize: number, duration: number, success: boolean) {
    this.trackEvent('conversion', {
      tool,
      inputFormat,
      outputFormat,
      fileSize,
      duration,
      success,
    });

    logger.logConversion({
      timestamp: new Date().toISOString(),
      tool,
      inputFormat,
      outputFormat,
      fileSize,
      duration,
      success,
    });
  }

  trackToolUsage(tool: string, action: string, duration?: number) {
    this.trackEvent('tool_usage', {
      tool,
      action,
      ...(duration !== undefined && { duration }),
    });
  }

  getPageViews() {
    return [...this.pageViews];
  }

  getEvents() {
    return [...this.events];
  }

  getStats() {
    const pageViewCounts = this.pageViews.reduce((acc, pv) => {
      acc[pv.path] = (acc[pv.path] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const eventCounts = this.events.reduce((acc, e) => {
      acc[e.name] = (acc[e.name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalPageViews: this.pageViews.length,
      totalEvents: this.events.length,
      pageViewCounts,
      eventCounts,
    };
  }

  isEnabled() {
    return this.enabled;
  }
}

export const analytics = new Analytics();
