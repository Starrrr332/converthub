import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import type { AudioConvertOptions, AudioConversionResult } from '../../types';

let ffmpeg: FFmpeg | null = null;
let ffmpegLoaded = false;

// ==================== INITIALIZATION ====================

async function loadFFmpeg(): Promise<FFmpeg> {
  if (ffmpeg && ffmpegLoaded) return ffmpeg;

  ffmpeg = new FFmpeg();

  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd';

  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  });

  ffmpegLoaded = true;
  return ffmpeg;
}

// ==================== CONVERT AUDIO ====================

export async function convertAudio(
  file: File,
  options: AudioConvertOptions,
  onProgress?: (progress: number) => void,
): Promise<AudioConversionResult> {
  const ff = await loadFFmpeg();

  const inputName = `input.${getExtensionFromMime(file.type)}`;
  const outputName = `output.${options.format}`;

  // Write input file
  await ff.writeFile(inputName, await fetchFile(file));

  // Set up progress tracking
  if (onProgress) {
    ff.on('progress', ({ progress }) => {
      onProgress(Math.round(progress * 100));
    });
  }

  // Build FFmpeg command
  const args = ['-i', inputName];

  // Add format-specific options
  if (options.bitrate) {
    args.push('-b:a', `${options.bitrate}k`);
  }

  if (options.sampleRate) {
    args.push('-ar', String(options.sampleRate));
  }

  // Output format
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

  // Execute conversion
  await ff.exec(args);

  // Read output file
  const outputData = await ff.readFile(outputName);
  const blob = new Blob([new Uint8Array(outputData as Uint8Array)], {
    type: getMimeFromExtension(options.format),
  });
  const url = URL.createObjectURL(blob);

  // Cleanup
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

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
