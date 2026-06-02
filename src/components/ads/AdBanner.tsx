import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdBannerProps {
  position: 'top' | 'sidebar' | 'bottom';
  className?: string;
  slot?: string;
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
}

export function AdBanner({ position, className = '', slot, format = 'auto' }: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    if (!adRef.current) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  const styles: Record<string, string> = {
    top: 'w-full min-h-[100px] mb-6',
    sidebar: 'w-full min-h-[260px]',
    bottom: 'w-full min-h-[100px] mt-6',
  };

  return (
    <div
      className={`ad-container ${styles[position]} flex items-center justify-center rounded-lg overflow-hidden ${className}`}
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-7016162128103513"
        data-ad-slot={slot || undefined}
        data-ad-format={format === 'auto' ? undefined : format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
