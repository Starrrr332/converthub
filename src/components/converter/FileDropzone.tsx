import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { PREMIUM_FORMATS } from '../../types';
import { formatFileSize } from '../../utils/constants';

interface FileDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  maxSize: number;
  disabled?: boolean;
}

export function FileDropzone({
  onFilesSelected,
  maxSize,
  disabled = false
}: FileDropzoneProps) {
  const { t } = useTranslation('converter');
  const [isDragActive, setIsDragActive] = useState(false);
  
  const acceptedFormats = PREMIUM_FORMATS;
  
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (disabled) return;
    
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(file => {
      const isValidType = acceptedFormats.includes(file.type as any);
      const isValidSize = file.size <= maxSize;
      return isValidType && isValidSize;
    });
    
    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  }, [disabled, acceptedFormats, maxSize, onFilesSelected]);
  
  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = acceptedFormats.includes(file.type as any);
      const isValidSize = file.size <= maxSize;
      return isValidType && isValidSize;
    });
    
    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
    
    e.target.value = '';
  }, [acceptedFormats, maxSize, onFilesSelected]);
  
return (
     <div
       className={`dropzone ${isDragActive ? 'dropzone-active' : ''} ${
         disabled ? 'opacity-50 cursor-not-allowed' : ''
       }`}
       onDragEnter={handleDragEnter}
       onDragLeave={handleDragLeave}
       onDragOver={handleDragOver}
       onDrop={handleDrop}
     >
       <input
         type="file"
         multiple
         accept={acceptedFormats.join(',')}
         onChange={handleFileInput}
         className="hidden"
         id="file-input"
         disabled={disabled}
       />
       
       <label htmlFor="file-input" className="cursor-pointer">
         <div className="flex flex-col items-center gap-4">
           <div className={`p-4 rounded-xl ${isDragActive ? 'bg-accent-50' : 'bg-surface-secondary'}`}>
             {isDragActive ? (
               <ImageIcon className="w-12 h-12 text-accent-500" />
             ) : (
               <Upload className="w-12 h-12 text-text-muted" />
             )}
           </div>
           
           <div>
             <h3 className="text-lg font-semibold text-text-primary">
               {isDragActive ? t('dropzone.dragActive') : t('dropzone.title')}
             </h3>
             <p className="text-sm text-text-secondary mt-1">
               {t('dropzone.subtitle')}
             </p>
           </div>
           
           <div className="text-xs text-text-muted">
             <p>{t('dropzone.acceptedFormats')}</p>
             <p>{t('dropzone.maxSize', { size: formatFileSize(maxSize) })}</p>
           </div>
         </div>
       </label>
     </div>
   );
}
