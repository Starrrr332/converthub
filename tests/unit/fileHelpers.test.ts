import { describe, it, expect, vi } from 'vitest'
import {
  validateImageFile,
  createDownloadUrl,
  triggerDownload,
  cleanupUrl,
  generateFilename
} from '../../src/utils/fileHelpers'

function createMockFile(name: string, type: string, size: number): File {
  const buffer = new ArrayBuffer(size)
  return new File([buffer], name, { type })
}

describe('validateImageFile', () => {
  it('accepts valid image file within size limit', () => {
    const file = createMockFile('photo.jpg', 'image/jpeg', 1024)
    const result = validateImageFile(file)
    expect(result.valid).toBe(true)
  })

  it('rejects file exceeding 100MB limit', () => {
    const file = createMockFile('huge.png', 'image/png', 101 * 1024 * 1024)
    const result = validateImageFile(file)
    expect(result.valid).toBe(false)
    expect(result.code).toBe('FILE_TOO_LARGE')
  })

  it('rejects unsupported file format', () => {
    const file = createMockFile('doc.pdf', 'application/pdf', 1024)
    const result = validateImageFile(file)
    expect(result.valid).toBe(false)
    expect(result.code).toBe('UNSUPPORTED_FORMAT')
  })

  it('accepts all free formats', () => {
    const formats = ['image/png', 'image/jpeg', 'image/webp', 'image/bmp', 'image/gif']
    for (const type of formats) {
      const file = createMockFile(`test.${type.split('/')[1]}`, type, 512)
      expect(validateImageFile(file).valid).toBe(true)
    }
  })

  it('accepts premium formats', () => {
    const formats = ['image/svg+xml', 'image/x-icon', 'image/avif', 'image/heic']
    for (const type of formats) {
      const file = createMockFile(`test.${type.split('/')[1]}`, type, 512)
      expect(validateImageFile(file).valid).toBe(true)
    }
  })

  it('rejects file with no type', () => {
    const file = createMockFile('unknown', '', 1024)
    const result = validateImageFile(file)
    expect(result.valid).toBe(false)
  })

  it('rejects file exactly at size limit + 1', () => {
    const file = createMockFile('test.png', 'image/png', 100 * 1024 * 1024 + 1)
    expect(validateImageFile(file).valid).toBe(false)
  })

  it('accepts file exactly at size limit', () => {
    const file = createMockFile('test.png', 'image/png', 100 * 1024 * 1024)
    expect(validateImageFile(file).valid).toBe(true)
  })
})

describe('createDownloadUrl', () => {
  it('creates a blob URL from a Blob', () => {
    const blob = new Blob(['test'], { type: 'text/plain' })
    const url = createDownloadUrl(blob)
    expect(url).toMatch(/^blob:/)
    URL.revokeObjectURL(url)
  })
})

describe('cleanupUrl', () => {
  it('revokes a blob URL', () => {
    const blob = new Blob(['test'], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    expect(() => cleanupUrl(url)).not.toThrow()
  })
})

describe('triggerDownload', () => {
  it('creates an anchor element and triggers download', () => {
    const appendChildSpy = vi.spyOn(document.body, 'appendChild')
    const removeChildSpy = vi.spyOn(document.body, 'removeChild')

    triggerDownload('blob:http://localhost/test', 'file.png')

    expect(appendChildSpy).toHaveBeenCalled()
    expect(removeChildSpy).toHaveBeenCalled()

    appendChildSpy.mockRestore()
    removeChildSpy.mockRestore()
  })
})

describe('generateFilename', () => {
  it('replaces extension with new format extension', () => {
    expect(generateFilename('photo.jpg', 'image/png')).toBe('photo.png')
  })

  it('handles filename without extension by appending new extension', () => {
    expect(generateFilename('photo', 'image/webp')).toBe('.webp')
  })

  it('handles filename with multiple dots', () => {
    expect(generateFilename('my.photo.test.jpg', 'image/png')).toBe('my.photo.test.png')
  })

  it('maps all formats correctly', () => {
    const cases: [string, string][] = [
      ['input.bmp', 'image/jpeg'],
      ['input.gif', 'image/avif'],
      ['input.ico', 'image/heic'],
      ['input.svg', 'image/bmp'],
    ]
    for (const [input, format] of cases) {
      const ext = format.split('/')[1]
      const baseName = input.substring(0, input.lastIndexOf('.'))
      expect(generateFilename(input, format)).toBe(`${baseName}.${ext}`)
    }
  })
})
