interface ProcessImageMessage {
  type: 'processImage';
  file: File;
  options: {
    format?: string;
    quality?: number;
    width?: number;
    height?: number;
    rotate?: number;
  };
}

self.onmessage = async (e: MessageEvent<ProcessImageMessage>) => {
  const { file, options } = e.data;

  try {
    const bitmap = await createImageBitmap(file);

    const width = options.width || bitmap.width;
    const height = options.height || bitmap.height;

    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Cannot get canvas context');

    if (options.rotate) {
      ctx.translate(width / 2, height / 2);
      ctx.rotate((options.rotate * Math.PI) / 180);
      ctx.translate(-width / 2, -height / 2);
    }

    ctx.drawImage(bitmap, 0, 0, width, height);

    const format = options.format || 'image/png';
    const quality = options.quality || 0.92;

    const blob = await canvas.convertToBlob({ type: format, quality });

    self.postMessage({ success: true, blob });
  } catch (err) {
    self.postMessage({ success: false, error: (err as Error).message });
  }
};
