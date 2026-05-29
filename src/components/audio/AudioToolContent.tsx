import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Music, Trash2, Loader2, Info, Lock } from 'lucide-react';
import { Button } from '../ui/Button';
import { UpgradeModal } from '../ui/UpgradeModal';
import { ToolInfoModal } from '../ui/ToolInfoModal';
import { 
  convertAudio, 
  validateAudioFile, 
  formatDuration,
  formatFileSize 
} from '../../services/conversions/audioConverter';
import type { AudioFormat, AudioConversionResult } from '../../types';

interface AudioToolContentProps {
  isPremium: boolean;
}

// Free formats: mp3, wav only
const FREE_FORMATS: AudioFormat[] = ['mp3', 'wav'];

const ALL_FORMATS: Array<{ value: AudioFormat; label: string }> = [
  { value: 'mp3', label: 'MP3' },
  { value: 'wav', label: 'WAV' },
  { value: 'ogg', label: 'OGG' },
  { value: 'flac', label: 'FLAC' },
  { value: 'aac', label: 'AAC' },
];

export function AudioToolContent({ isPremium }: AudioToolContentProps) {
  const { t } = useTranslation('converter');
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<AudioFormat>('mp3');
  const [result, setResult] = useState<AudioConversionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showToolInfo, setShowToolInfo] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    if (!validateAudioFile(selectedFile)) {
      setError(t('audio.error.invalidFormat'));
      return;
    }
    
    setFile(selectedFile);
    setResult(null);
    setError(null);
    
    // Get duration
    const audio = new Audio();
    audio.src = URL.createObjectURL(selectedFile);
    audio.onloadedmetadata = () => {
      setDuration(audio.duration);
      URL.revokeObjectURL(audio.src);
    };
  };
  
  const handleFormatSelect = (format: AudioFormat) => {
    if (!isPremium && !FREE_FORMATS.includes(format)) {
      setShowUpgradeModal(true);
      return;
    }
    setTargetFormat(format);
  };
  
  const handleConvert = async () => {
    if (!file) return;
    
    setLoading(true);
    setError(null);
    setProgress(0);
    
    try {
      const conversionResult = await convertAudio(
        file,
        { format: targetFormat },
        (p) => setProgress(p)
      );
      
      setResult(conversionResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed');
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };
  
  const handleDownload = () => {
    if (!result) return;
    
    const a = document.createElement('a');
    a.href = result.url;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  const getSourceFormat = (): string => {
    if (!file) return '';
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    return ext.toUpperCase();
  };
  
  return (
    <div className="space-y-6">
      {/* Header with info button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold text-gray-900">{t('audio.title')}</h3>
          {!isPremium && (
            <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
              <Lock className="w-3 h-3" />
              Free: MP3, WAV
            </span>
          )}
        </div>
        <button
          onClick={() => setShowToolInfo(true)}
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title={t('toolInfo.about')}
        >
          <Info className="w-5 h-5" />
        </button>
      </div>
      
      {/* File Input */}
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors">
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="hidden"
          id="audio-input"
        />
        <label htmlFor="audio-input" className="cursor-pointer">
          <Music className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">{t('audio.dropzone')}</p>
          <p className="text-xs text-gray-400 mt-2">
            MP3, WAV, OGG, FLAC, AAC, M4A
          </p>
        </label>
      </div>
      
      {/* File Info */}
      {file && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Music className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {getSourceFormat()} • {formatFileSize(file.size)}
                  {duration !== null && ` • ${formatDuration(duration)}`}
                </p>
              </div>
            </div>
            <button
              onClick={() => { setFile(null); setResult(null); setDuration(null); }}
              className="text-gray-400 hover:text-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      
      {/* Format Selector */}
      {file && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('audio.outputFormat')}
          </label>
          <div className="flex flex-wrap gap-2">
            {ALL_FORMATS.map((format) => {
              const isFree = FREE_FORMATS.includes(format.value);
              const isSelected = targetFormat === format.value;
              
              return (
                <button
                  key={format.value}
                  onClick={() => handleFormatSelect(format.value)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {format.label}
                  {!isPremium && !isFree && (
                    <Lock className="w-3 h-3 text-yellow-500" />
                  )}
                </button>
              );
            })}
          </div>
          {!isPremium && (
            <p className="text-xs text-gray-500 mt-2">
              Free: MP3, WAV | Premium: + OGG, FLAC, AAC
            </p>
          )}
        </div>
      )}
      
      {/* Progress */}
      {loading && progress > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{t('progress.converting')}</span>
            <span className="text-gray-500">{progress}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      
      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      {/* Actions */}
      <div className="flex gap-4">
        <Button
          onClick={handleConvert}
          disabled={!file || loading}
          loading={loading}
          className="flex-1"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              {t('progress.converting')}
            </span>
          ) : (
            t('actions.convert')
          )}
        </Button>
        
        {result && (
          <Button onClick={handleDownload} variant="secondary">
            <Download className="w-4 h-4 mr-2" />
            {t('actions.download')}
          </Button>
        )}
      </div>
      
      {/* Result Info */}
      {result && (
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-700">
            ✓ {t('audio.result.ready')} - {formatFileSize(result.size)}
          </p>
        </div>
      )}
      
      {/* Modals */}
      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)}
        feature="Audio Format"
      />
      <ToolInfoModal 
        isOpen={showToolInfo} 
        onClose={() => setShowToolInfo(false)}
        tool="audio"
      />
    </div>
  );
}
