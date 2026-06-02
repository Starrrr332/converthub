interface ProcessImageMessage {
  type: 'processImage';
  id: number;
  file: File;
  options: {
    format?: string;
    quality?: number;
    width?: number;
    height?: number;
    maintainAspectRatio?: boolean;
    rotate?: number;
    flip?: {
      horizontal?: boolean;
      vertical?: boolean;
    };
    crop?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  };
}

function applyTransforms(
  source: ImageBitmap,
  options: ProcessImageMessage['options']
): { width: number; height: number; draw: (ctx: OffscreenCanvasRenderingContext2D) => void } {
  let width = options.width || source.width;
  let height = options.height || source.height;

  if (options.maintainAspectRatio !== false && (options.width || options.height)) {
    const ratio = Math.min(
      (options.width || Infinity) / source.width,
      (options.height || Infinity) / source.height
    );
    width = Math.round(source.width * ratio);
    height = Math.round(source.height * ratio);
  }

  if (options.crop) {
    const { x, y, width: cw, height: ch } = options.crop;
    return {
      width: cw,
      height: ch,
      draw: (ctx) => {
        ctx.drawImage(source, x, y, cw, ch, 0, 0, cw, ch);
      },
    };
  }

  return {
    width,
    height,
    draw: (ctx) => {
      ctx.drawImage(source, 0, 0, width, height);
    },
  };
}

self.onmessage = async (e: MessageEvent<ProcessImageMessage>) => {
  const { id, file, options } = e.data;

  try {
    const bitmap = await createImageBitmap(file);
    const transform = applyTransforms(bitmap, options);

    const canvas = new OffscreenCanvas(transform.width, transform.height);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Cannot get canvas context');

    if (options.rotate) {
      const radians = (options.rotate * Math.PI) / 180;
      ctx.translate(transform.width / 2, transform.height / 2);
      ctx.rotate(radians);
      ctx.translate(-transform.width / 2, -transform.height / 2);
    }

    if (options.flip) {
      ctx.translate(
        options.flip.horizontal ? transform.width : 0,
        options.flip.vertical ? transform.height : 0
      );
      ctx.scale(options.flip.horizontal ? -1 : 1, options.flip.vertical ? -1 : 1);
    }

    transform.draw(ctx);
    bitmap.close();

    const format = options.format || 'image/png';
    const quality = options.quality != null ? options.quality / 100 : 0.92;

    const blob = await canvas.convertToBlob({ type: format, quality });

    self.postMessage({ id, success: true, blob });
  } catch (err) {
    self.postMessage({ id, success: false, error: (err as Error).message });
  }
};
