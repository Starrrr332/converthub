import { useCallback, useRef } from 'react';
import { analytics } from './analytics';
import { logger } from './logger';

export function useConversionTracking() {
  const startTimeRef = useRef<number>(0);

  const startTracking = useCallback(() => {
    startTimeRef.current = performance.now();
  }, []);

  const trackConversion = useCallback((
    tool: string,
    inputFormat: string,
    outputFormat: string,
    fileSize: number,
    success: boolean,
    error?: string
  ) => {
    const duration = performance.now() - startTimeRef.current;

    analytics.trackConversion(tool, inputFormat, outputFormat, fileSize, duration, success);

    if (!success && error) {
      logger.error('Conversion failed', {
        tool,
        inputFormat,
        outputFormat,
        fileSize,
        duration,
        error,
      }, 'converter');
    }
  }, []);

  return { startTracking, trackConversion };
}
