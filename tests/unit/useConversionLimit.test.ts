import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useConversionLimit } from '../../src/hooks/useConversionLimit'

beforeEach(() => {
  localStorage.clear()
})

describe('useConversionLimit', () => {
  it('initializes with default state', () => {
    const { result } = renderHook(() => useConversionLimit())
    expect(result.current.count).toBe(0)
    expect(result.current.limit).toBe(50)
    expect(result.current.canConvert()).toBe(true)
  })

  it('increments usage count', () => {
    const { result } = renderHook(() => useConversionLimit())

    act(() => {
      result.current.incrementUsage()
    })

    expect(result.current.count).toBe(1)
  })

  it('increments multiple times', () => {
    const { result } = renderHook(() => useConversionLimit())

    act(() => {
      result.current.incrementUsage()
      result.current.incrementUsage()
      result.current.incrementUsage()
    })

    expect(result.current.count).toBe(3)
  })

  it('returns remaining count correctly', () => {
    const { result } = renderHook(() => useConversionLimit())

    act(() => {
      result.current.incrementUsage()
      result.current.incrementUsage()
    })

    expect(result.current.getRemaining()).toBe(48)
  })

  it('canConvert returns true when under limit', () => {
    const { result } = renderHook(() => useConversionLimit())

    act(() => {
      result.current.incrementUsage()
    })

    expect(result.current.canConvert()).toBe(true)
  })

  it('canConvert returns false at limit', () => {
    const { result } = renderHook(() => useConversionLimit())

    act(() => {
      for (let i = 0; i < 50; i++) {
        result.current.incrementUsage()
      }
    })

    expect(result.current.canConvert()).toBe(false)
  })

  it('resets daily count', () => {
    const { result } = renderHook(() => useConversionLimit())

    act(() => {
      result.current.incrementUsage()
      result.current.incrementUsage()
    })

    act(() => {
      result.current.resetDaily()
    })

    expect(result.current.count).toBe(0)
    expect(result.current.canConvert()).toBe(true)
  })

  it('getRemaining returns full limit when date changes', () => {
    const { result } = renderHook(() => useConversionLimit())

    act(() => {
      result.current.incrementUsage()
      result.current.incrementUsage()
    })

    vi.spyOn(Date.prototype, 'toISOString').mockReturnValue('2099-01-01T00:00:00.000Z')

    expect(result.current.getRemaining()).toBe(50)
  })

  it('canConvert returns true when date changes', () => {
    const { result } = renderHook(() => useConversionLimit())

    act(() => {
      for (let i = 0; i < 50; i++) {
        result.current.incrementUsage()
      }
    })

    vi.spyOn(Date.prototype, 'toISOString').mockReturnValue('2099-01-01T00:00:00.000Z')

    expect(result.current.canConvert()).toBe(true)
  })

  it('getRemaining never goes below 0', () => {
    const { result } = renderHook(() => useConversionLimit())

    act(() => {
      for (let i = 0; i < 60; i++) {
        result.current.incrementUsage()
      }
    })

    expect(result.current.getRemaining()).toBe(0)
  })

  it('persists state to localStorage', () => {
    const { result } = renderHook(() => useConversionLimit())

    act(() => {
      result.current.incrementUsage()
      result.current.incrementUsage()
    })

    const stored = JSON.parse(localStorage.getItem('converthub-limits') || '{}')
    expect(stored.state.count).toBe(2)
  })

  it('restores state from localStorage', () => {
    const initial = {
      state: { date: new Date().toISOString().split('T')[0], count: 5, limit: 50 },
      version: 0,
    }
    localStorage.setItem('converthub-limits', JSON.stringify(initial))

    const { result } = renderHook(() => useConversionLimit())
    expect(result.current.count).toBe(5)
  })
})
