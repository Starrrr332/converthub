interface ProcessVideoMessage {
  type: 'processVideo';
  file: File;
  options: {
    format?: string;
    startTime?: number;
    endTime?: number;
    width?: number;
    height?: number;
  };
}

self.onmessage = async (e: MessageEvent<ProcessVideoMessage>) => {
  const { file, options } = e.data;

  try {
    const ffmpegModule = await import('@ffmpeg/ffmpeg');
    const { FFmpeg } = ffmpegModule;
    const ffmpeg = new FFmpeg();

    const { toBlobURL } = await import('@ffmpeg/util');
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });

    const inputName =
      'input' +
      (file.name.includes('.') ? file.name.substring(file.name.lastIndexOf('.')) : '.mp4');
    const outputName = 'output.' + (options.format || 'mp4');

    await ffmpeg.writeFile(inputName, new Uint8Array(await file.arrayBuffer()));

    self.postMessage({ type: 'progress', progress: 0.3 });

    const args: string[] = ['-i', inputName];
    if (options.startTime !== undefined) args.push('-ss', String(options.startTime));
    if (options.endTime !== undefined) args.push('-to', String(options.endTime));
    if (options.width && options.height) {
      args.push('-vf', `scale=${options.width}:${options.height}`);
    }
    args.push(outputName);

    await ffmpeg.exec(args);

    self.postMessage({ type: 'progress', progress: 0.9 });

    const data = await ffmpeg.readFile(outputName);
    const raw = data instanceof Uint8Array ? data : new TextEncoder().encode(String(data));
    const buffer = new ArrayBuffer(raw.byteLength);
    new Uint8Array(buffer).set(raw);
    const blob = new Blob([buffer], { type: `video/${outputName.split('.').pop() || 'mp4'}` });

    self.postMessage({ success: true, blob });
  } catch (err) {
    self.postMessage({ success: false, error: (err as Error).message });
  }
};
