declare module 'qrcode' {
  function toCanvas(
    canvasElement: HTMLCanvasElement,
    text: string,
    options?: Record<string, unknown>
  ): Promise<void>;
  
  function toDataURL(
    text: string,
    options?: Record<string, unknown>
  ): Promise<string>;
}
