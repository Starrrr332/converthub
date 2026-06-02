import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useShareConfig() {
  const [searchParams, setSearchParams] = useSearchParams();

  const setConfig = useCallback((params: Record<string, string>) => {
    setSearchParams(params, { replace: true });
  }, [setSearchParams]);

  const getConfig = useCallback(() => {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }, [searchParams]);

  const shareUrl = useCallback(() => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      return true;
    }
    return false;
  }, []);

  return { setConfig, getConfig, shareUrl, searchParams };
}
