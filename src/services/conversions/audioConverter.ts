import type { AudioConvertOptions, AudioConversionResult } from '../../types';

let ffmpegPromise: Promise<typeof import('@ffmpeg/ffmpeg').FFmpeg> | null = null;
let loadedInstance: Awaited<ReturnType<typeof loadFFmpeg>> | null = null;

// ==================== INITIALIZATION ====================

async function loadFFmpeg() {
  if (loadedInstance) return loadedInstance;

  if (!ffmpegPromise) {
    ffmpegPromise = (async () => {
      const [{ FFmpeg }, { fetchFile, toBlobURL }] = await Promise.all([
        import('@ffmpeg/ffmpeg'),
        import('@ffmpeg/util'),
      ]);
      const ff = new FFmpeg();
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd';
      await ff.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
      return { ff, fetchFile };
    })();
  }

  loadedInstance = await ffmpegPromise;
  return loadedInstance;
}

// ==================== CONVERT AUDIO ====================

export async function convertAudio(
  file: File,
  options: AudioConvertOptions,
  onProgress?: (progress: number) => void,
): Promise<AudioConversionResult> {
  const { ff, fetchFile } = await loadFFmpeg();

  const inputName = `input.${getExtensionFromMime(file.type)}`;
  const outputName = `output.${options.format}`;

  await ff.writeFile(inputName, await fetchFile(file));

  if (onProgress) {
    ff.on('progress', ({ progress }) => {
      onProgress(Math.round(progress * 100));
    });
  }

  const args = ['-i', inputName];

  if (options.bitrate) {
    args.push('-b:a', `${options.bitrate}k`);
  }

  if (options.sampleRate) {
    args.push('-ar', String(options.sampleRate));
  }

  switch (options.format) {
    case 'mp3':
      args.push('-codec:a', 'libmp3lame');
      break;
    case 'wav':
      args.push('-codec:a', 'pcm_s16le');
      break;
    case 'ogg':
      args.push('-codec:a', 'libvorbis');
      break;
    case 'flac':
      args.push('-codec:a', 'flac');
      break;
    case 'aac':
      args.push('-codec:a', 'aac');
      break;
  }

  args.push(outputName);

  await ff.exec(args);

  const outputData = await ff.readFile(outputName);
  const blob = new Blob([new Uint8Array(outputData as Uint8Array)], {
    type: getMimeFromExtension(options.format),
  });
  const url = URL.createObjectURL(blob);

  await ff.deleteFile(inputName);
  await ff.deleteFile(outputName);

  const baseName = file.name.replace(/\.[^/.]+$/, '');

  return {
    blob,
    url,
    filename: `${baseName}.${options.format}`,
    size: blob.size,
  };
}

// ==================== GET AUDIO DURATION ====================

export async function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.src = URL.createObjectURL(file);
    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(audio.src);
      resolve(audio.duration);
    };
    audio.onerror = () => resolve(0);
  });
}

// ==================== VALIDATION ====================

export function validateAudioFile(file: File): boolean {
  const validTypes = [
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/ogg',
    'audio/flac',
    'audio/aac',
    'audio/mp4',
    'audio/x-m4a',
    'audio/webm',
  ];

  return (
    validTypes.includes(file.type) ||
    file.name.match(/\.(mp3|wav|ogg|flac|aac|m4a|webm)$/i) !== null
  );
}

// ==================== HELPERS ====================

function getExtensionFromMime(mimeType: string): string {
  const map: Record<string, string> = {
    'audio/mpeg': 'mp3',
    'audio/mp3': 'mp3',
    'audio/wav': 'wav',
    'audio/x-wav': 'wav',
    'audio/ogg': 'ogg',
    'audio/flac': 'flac',
    'audio/aac': 'aac',
    'audio/mp4': 'm4a',
    'audio/x-m4a': 'm4a',
    'audio/webm': 'webm',
  };
  return map[mimeType] || 'mp3';
}

function getMimeFromExtension(ext: string): string {
  const map: Record<string, string> = {
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
    flac: 'audio/flac',
    aac: 'audio/aac',
  };
  return map[ext] || 'audio/mpeg';
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Re-export formatFileSize from shared utils for backward compatibility
export { formatFileSize } from '../../utils/constants';
