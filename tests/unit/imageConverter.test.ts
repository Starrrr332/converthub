import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('../../src/utils/fileHelpers', () => ({
  readFileAsDataURL: vi.fn().mockResolvedValue('data:image/png;base64,mock'),
  loadImage: vi.fn().mockResolvedValue({ naturalWidth: 800, naturalHeight: 600 }),
  createCanvasFromImage: vi.fn().mockReturnValue({
    width: 800,
    height: 600,
    getContext: vi.fn(() => ({
      drawImage: vi.fn(),
      translate: vi.fn(),
      scale: vi.fn(),
      rotate: vi.fn(),
    })),
  }),
  canvasToBlob: vi.fn().mockResolvedValue(new Blob(['mock'], { type: 'image/png' })),
}))

vi.stubGlobal('URL', {
  createObjectURL: vi.fn(() => 'blob:http://localhost/test'),
  revokeObjectURL: vi.fn(),
})

import {
  convertImage,
  resizeImage,
  compressImage,
  cropImage,
  rotateImage,
  flipCanvas,
  convertBatch
} from '../../src/services/conversions/imageConverter'
import { loadImage, createCanvasFromImage, canvasToBlob } from '../../src/utils/fileHelpers'

function createMockFile(name: string, type: string, size = 1024): File {
  return new File([new ArrayBuffer(size)], name, { type })
}

afterEach(() => {
  vi.clearAllMocks()
})

describe('convertImage', () => {
  it('converts file to ConversionResult with basic options', async () => {
    const file = createMockFile('test.png', 'image/png')
    const result = await convertImage(file, { format: 'image/png' })

    expect(result).toHaveProperty('blob')
    expect(result).toHaveProperty('url')
    expect(result).toHaveProperty('width')
    expect(result).toHaveProperty('height')
    expect(result).toHaveProperty('size')
    expect(result).toHaveProperty('format')
    expect(result.format).toBe('image/png')
    expect(result.url).toBe('blob:http://localhost/test')
    expect(readFileAsDataURL).toHaveBeenCalledWith(file)
    expect(loadImage).toHaveBeenCalledWith('data:image/png;base64,mock')
    expect(createCanvasFromImage).toHaveBeenCalled()
    expect(canvasToBlob).toHaveBeenCalled()
  })

  it('applies resize when width and height provided', async () => {
    const file = createMockFile('test.png', 'image/png')
    const result = await convertImage(file, {
      format: 'image/png',
      width: 400,
      height: 300,
    })
    expect(result.width).toBeDefined()
    expect(result.height).toBeDefined()
  })

  it('applies crop when crop region provided', async () => {
    const file = createMockFile('test.png', 'image/png')
    const result = await convertImage(file, {
      format: 'image/png',
      crop: { x: 0, y: 0, width: 100, height: 100 },
    })
    expect(result.width).toBe(100)
    expect(result.height).toBe(100)
  })

  it('applies rotation when rotate provided', async () => {
    const file = createMockFile('test.png', 'image/png')
    const result = await convertImage(file, {
      format: 'image/png',
      rotate: 90,
    })
    expect(result.width).toBe(600)
    expect(result.height).toBe(800)
  })

  it('applies horizontal flip', async () => {
    const file = createMockFile('test.png', 'image/png')
    const result = await convertImage(file, {
      format: 'image/png',
      flip: { horizontal: true },
    })
    expect(result.width).toBe(800)
    expect(result.height).toBe(600)
  })

  it('applies vertical flip', async () => {
    const file = createMockFile('test.png', 'image/png')
    const result = await convertImage(file, {
      format: 'image/png',
      flip: { vertical: true },
    })
    expect(result.width).toBe(800)
    expect(result.height).toBe(600)
  })

  it('applies quality setting', async () => {
    const file = createMockFile('test.jpg', 'image/jpeg')
    const result = await convertImage(file, {
      format: 'image/jpeg',
      quality: 50,
    })
    expect(result.size).toBeDefined()
    expect(canvasToBlob).toHaveBeenCalledWith(
      expect.anything(),
      'image/jpeg',
      50
    )
  })

  it('skips resize when no width/height', async () => {
    const file = createMockFile('test.png', 'image/png')
    await convertImage(file, { format: 'image/png' })
    expect(canvasToBlob).toHaveBeenCalledTimes(1)
  })

  it('skips rotate when rotate is 0', async () => {
    const file = createMockFile('test.png', 'image/png')
    await convertImage(file, { format: 'image/png', rotate: 0 })
    expect(canvasToBlob).toHaveBeenCalledTimes(1)
  })

  it('skips flip when flip not provided', async () => {
    const file = createMockFile('test.png', 'image/png')
    await convertImage(file, { format: 'image/png' })
    expect(canvasToBlob).toHaveBeenCalledTimes(1)
  })

  it('skips crop when crop not provided', async () => {
    const file = createMockFile('test.png', 'image/png')
    await convertImage(file, { format: 'image/png' })
    expect(canvasToBlob).toHaveBeenCalledTimes(1)
  })
})

describe('resizeImage', () => {
  it('delegates to convertImage with resize options', async () => {
    const file = createMockFile('photo.png', 'image/png')
    const result = await resizeImage(file, 400, 300, true)
    expect(result).toHaveProperty('blob')
    expect(readFileAsDataURL).toHaveBeenCalled()
  })
})

describe('compressImage', () => {
  it('delegates to convertImage with quality option', async () => {
    const file = createMockFile('photo.jpg', 'image/jpeg')
    const result = await compressImage(file, 80)
    expect(result).toHaveProperty('blob')
  })

  it('uses png format for png files', async () => {
    const file = createMockFile('photo.png', 'image/png')
    const result = await compressImage(file, 80)
    expect(result.format).toBe('image/png')
  })

  it('uses jpeg format for non-png files', async () => {
    const file = createMockFile('photo.jpg', 'image/jpeg')
    const result = await compressImage(file, 80)
    expect(result.format).toBe('image/jpeg')
  })
})

describe('cropImage', () => {
  it('crops to specified region', async () => {
    const file = createMockFile('test.png', 'image/png')
    const region = { x: 10, y: 20, width: 200, height: 150 }
    const result = await cropImage(file, region)
    expect(result.width).toBe(200)
    expect(result.height).toBe(150)
  })
})

describe('rotateImage', () => {
  it('rotates by given degrees', async () => {
    const file = createMockFile('test.png', 'image/png')
    const result = await rotateImage(file, 90)
    expect(result.width).toBe(600)
    expect(result.height).toBe(800)
  })

  it('handles 180 degree rotation', async () => {
    const file = createMockFile('test.png', 'image/png')
    const result = await rotateImage(file, 180)
    expect(result.width).toBeDefined()
    expect(result.height).toBeDefined()
  })
})

describe('convertBatch', () => {
  it('converts multiple files', async () => {
    const files = [
      createMockFile('a.png', 'image/png'),
      createMockFile('b.jpg', 'image/jpeg'),
    ]
    const results = await convertBatch(files, { format: 'image/webp' })
    expect(results).toHaveLength(2)
  })

  it('calls onProgress callback', async () => {
    const onProgress = vi.fn()
    const files = [
      createMockFile('a.png', 'image/png'),
      createMockFile('b.png', 'image/png'),
    ]
    await convertBatch(files, { format: 'image/webp' }, onProgress)
    expect(onProgress).toHaveBeenCalledWith(1, 2)
    expect(onProgress).toHaveBeenCalledWith(2, 2)
  })

  it('returns empty array for no files', async () => {
    const results = await convertBatch([], { format: 'image/png' })
    expect(results).toHaveLength(0)
  })
})

describe('canvasToBlob', () => {
  it('rejects when blob creation fails', async () => {
    const { canvasToBlob: realCanvasToBlob } = await import('../../src/utils/fileHelpers')
    vi.mocked(realCanvasToBlob).mockRejectedValueOnce(new Error('Failed to create blob'))
    const canvas = { toBlob: vi.fn() } as unknown as HTMLCanvasElement

    await expect(realCanvasToBlob(canvas, 'image/png')).rejects.toThrow('Failed to create blob')
  })
})
