import { useState, useEffect, useCallback } from 'react';

interface GlobalDropState {
  isDragging: boolean;
  files: File[];
}

export function useGlobalDrop(onFilesDrop: (files: File[]) => void) {
  const [state, setState] = useState<GlobalDropState>({
    isDragging: false,
    files: [],
  });

  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer?.types.includes('Files')) {
      setState((prev) => ({ ...prev, isDragging: true }));
    }
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    if (e.relatedTarget === null) {
      setState((prev) => ({ ...prev, isDragging: false }));
    }
  }, []);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setState({ isDragging: false, files: [] });
      if (e.dataTransfer?.files.length) {
        onFilesDrop(Array.from(e.dataTransfer.files));
      }
    },
    [onFilesDrop]
  );

  useEffect(() => {
    document.addEventListener('dragenter', handleDragEnter);
    document.addEventListener('dragleave', handleDragLeave);
    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('drop', handleDrop);

    return () => {
      document.removeEventListener('dragenter', handleDragEnter);
      document.removeEventListener('dragleave', handleDragLeave);
      document.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('drop', handleDrop);
    };
  }, [handleDragEnter, handleDragLeave, handleDragOver, handleDrop]);

  return state;
}
