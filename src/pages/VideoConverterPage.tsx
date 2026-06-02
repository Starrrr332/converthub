import { useState, useRef } from 'react';
import { Download, Scissors, Film, Music } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNotifications } from '../hooks/useNotifications';

type VideoTool = 'convert' | 'compress' | 'trim' | 'audio';

export function VideoConverterPage() {
  const { notify } = useNotifications();
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [tool, setTool] = useState<VideoTool>('convert');
  const [outputFormat, setOutputFormat] = useState('webm');
  const [quality, setQuality] = useState(0.8);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);
  const [duration, setDuration] = useState(0);
  const [converting, setConverting] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState('video');
  const [info, setInfo] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setFileName(f.name.replace(/\.[^.]+$/, ''));
    const url = URL.createObjectURL(f);
    setVideoUrl(url);
    setResultUrl(null);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = url;
    video.onloadedmetadata = () => {
      setDuration(video.duration);
      setTrimEnd(Math.floor(video.duration));
    };
  };

  const getMimeType = (fmt: string) => {
    const map: Record<string, string> = {
      webm: 'video/webm;codecs=vp9',
      mp4: 'video/mp4',
      mov: 'video/quicktime',
      avi: 'video/x-msvideo',
    };
    return map[fmt] || 'video/webm';
  };

  const handleConvert = async () => {
    if (!file || !videoUrl) return;
    setConverting(true);
    setInfo('');

    if (tool === 'audio') {
      extractAudio();
      return;
    }

    try {
      const video = document.createElement('video');
      video.src = videoUrl;
      video.crossOrigin = 'anonymous';
      await video.play();

      let stream: MediaStream;
      try {
        stream = (
          video as HTMLVideoElement & { captureStream(fps?: number): MediaStream }
        ).captureStream(30);
      } catch {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext('2d')!;
        stream = canvas.captureStream(30);

        const paint = () => {
          if (!video.paused && !video.ended) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            requestAnimationFrame(paint);
          }
        };
        paint();
      }

      const mimeType = getMimeType(outputFormat);
      const supported = MediaRecorder.isTypeSupported(mimeType);
      const actualMime = supported ? mimeType : 'video/webm;codecs=vp8';

      if (!supported) {
        setInfo(
          `Formato ${outputFormat.toUpperCase()} no soportado directamente. Se usará WebM como alternativa.`,
        );
      }

      const chunks: BlobPart[] = [];
      const recorder = new MediaRecorder(stream, {
        mimeType: actualMime,
        videoBitsPerSecond: Math.round(quality * 5000000),
      });

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const ext = actualMime.includes('webm') ? 'webm' : outputFormat;
        const blob = new Blob(chunks, { type: actualMime });
        setResultUrl(URL.createObjectURL(blob));
        setFileName(`${fileName}.${ext}`);
        setConverting(false);
        video.pause();
        notify('Video Converter', {
          body: `Video convertido a ${ext.toUpperCase()} listo para descargar`,
        });
      };

      recorder.start();

      if (tool === 'trim' && trimEnd > trimStart) {
        const durationMs = (trimEnd - trimStart) * 1000;
        video.currentTime = trimStart;
        setTimeout(() => {
          recorder.stop();
          video.pause();
        }, durationMs);
      } else if (tool === 'compress') {
        video.onended = () => recorder.stop();
      } else {
        video.onended = () => recorder.stop();
      }
    } catch {
      setInfo('Error al procesar el video. Intenta con otro formato.');
      setConverting(false);
    }
  };

  const extractAudio = () => {
    if (!file || !videoUrl) return;
    setInfo('Extrayendo audio...');

    const audioCtx = new AudioContext();
    const audio = new Audio(videoUrl);
    const source = audioCtx.createMediaElementSource(audio);
    const dest = audioCtx.createMediaStreamDestination();
    source.connect(dest);
    source.connect(audioCtx.destination);

    const chunks: BlobPart[] = [];
    const recorder = new MediaRecorder(dest.stream, { mimeType: 'audio/webm;codecs=opus' });

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/mpeg' });
      setResultUrl(URL.createObjectURL(blob));
      setFileName(`${fileName}.webm`);
      setConverting(false);
      setInfo('Audio extraído correctamente. Descarga el archivo.');
      notify('Video Converter', { body: 'Audio extraído listo para descargar' });
    };

    recorder.start();
    audio.play();
    audio.onended = () => recorder.stop();
  };

  const tools = [
    { id: 'convert' as VideoTool, icon: <Film className="w-5 h-5" />, label: 'Convertir formato' },
    { id: 'compress' as VideoTool, icon: <Download className="w-5 h-5" />, label: 'Comprimir' },
    { id: 'trim' as VideoTool, icon: <Scissors className="w-5 h-5" />, label: 'Recortar' },
    { id: 'audio' as VideoTool, icon: <Music className="w-5 h-5" />, label: 'Extraer audio' },
  ];

  const getOutputExt = () => {
    if (tool === 'audio') return 'webm';
    return outputFormat;
  };

  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Video Converter</h1>
          <p className="text-gray-600">
            Convierte, comprime, recorta y extrae audio de videos. 100% en tu navegador.
          </p>
        </div>

        {!file ? (
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-500 transition-colors">
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
              id="video-upload"
            />
            <label htmlFor="video-upload" className="cursor-pointer">
              <Film className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600 mb-2">Arrastra un video aquí</p>
              <p className="text-sm text-gray-400">
                MP4, WebM, MOV, AVI, MKV - Sin límite de tamaño
              </p>
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Herramientas</h3>
                <div className="space-y-2">
                  {tools.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTool(t.id)}
                      className={`w-full p-3 rounded-lg flex items-center gap-3 transition-all ${
                        tool === t.id
                          ? 'bg-blue-50 text-blue-700 border-2 border-blue-500'
                          : 'hover:bg-gray-50 border-2 border-transparent'
                      }`}
                    >
                      {t.icon} <span className="font-medium">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-lg p-6">
                {videoUrl && (
                  <>
                    <video
                      ref={videoRef}
                      src={videoUrl}
                      className="w-full max-h-[300px] rounded-lg mb-4"
                      controls
                    />
                    <canvas ref={canvasRef} className="hidden" />
                  </>
                )}

                <div className="space-y-4">
                  {tool === 'convert' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Formato de salida
                      </label>
                      <div className="flex gap-2">
                        {['webm', 'mp4', 'mov', 'avi'].map((f) => (
                          <button
                            key={f}
                            onClick={() => setOutputFormat(f)}
                            className={`p-3 rounded-lg border-2 flex-1 transition-all ${outputFormat === f ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200'}`}
                          >
                            {f.toUpperCase()}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        Nota: Chrome/Firefox convierten a WebM nativamente. MP4/MOV/AVI pueden no
                        estar disponibles en todos los navegadores.
                      </p>
                    </div>
                  )}

                  {(tool === 'compress' || tool === 'convert') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Calidad: {Math.round(quality * 100)}%
                      </label>
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.1"
                        value={quality}
                        onChange={(e) => setQuality(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  )}

                  {tool === 'trim' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Inicio: {trimStart.toFixed(1)}s / {duration.toFixed(0)}s
                        </label>
                        <input
                          type="range"
                          min="0"
                          max={duration}
                          step="0.5"
                          value={trimStart}
                          onChange={(e) => setTrimStart(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fin: {trimEnd.toFixed(1)}s / {duration.toFixed(0)}s
                        </label>
                        <input
                          type="range"
                          min="0"
                          max={duration}
                          step="0.5"
                          value={trimEnd}
                          onChange={(e) => setTrimEnd(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <p className="text-sm text-gray-500">
                        Duración: {(trimEnd - trimStart).toFixed(1)}s
                      </p>
                    </div>
                  )}

                  {tool === 'audio' && (
                    <p className="text-sm text-gray-500">
                      Extrae el audio del video en formato WebM (Opus).
                    </p>
                  )}
                </div>

                {info && (
                  <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">{info}</div>
                )}

                <div className="mt-6 space-y-4">
                  {!resultUrl ? (
                    <Button
                      onClick={handleConvert}
                      disabled={converting}
                      className="w-full"
                      loading={converting}
                    >
                      {converting ? 'Procesando...' : `Convertir a ${getOutputExt().toUpperCase()}`}
                    </Button>
                  ) : (
                    <div>
                      <a href={resultUrl} download={fileName}>
                        <Button className="w-full">
                          <Download className="w-4 h-4 mr-2" /> Descargar
                        </Button>
                      </a>
                      <button
                        onClick={() => {
                          setFile(null);
                          setVideoUrl(null);
                          setResultUrl(null);
                        }}
                        className="w-full mt-2 py-2 text-gray-500 hover:text-gray-700 text-sm"
                      >
                        Nuevo video
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
