import { useEffect, useRef } from 'react';

export function useSmartPreload() {
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cooldownMapRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      // Match any internal navigation link
      const link = (e.target as HTMLElement).closest('a[href]') as HTMLAnchorElement | null;
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:'))
        return;

      // Cooldown: don't prefetch the same link more than once per 30s
      const now = Date.now();
      const lastPrefetch = cooldownMapRef.current.get(href);
      if (lastPrefetch && now - lastPrefetch < 30000) return;

      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }

      hoverTimeoutRef.current = setTimeout(() => {
        cooldownMapRef.current.set(href, Date.now());
        const prefetchLink = document.createElement('link');
        prefetchLink.rel = 'prefetch';
        prefetchLink.href = href;
        document.head.appendChild(prefetchLink);
        setTimeout(() => prefetchLink.remove(), 10000);
      }, 200);
    };

    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);
}
