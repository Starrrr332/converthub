import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from './analytics';

export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    analytics.trackPageView(location.pathname);
  }, [location.pathname]);
}
