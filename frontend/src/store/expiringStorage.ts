import type { StateStorage } from 'zustand/middleware'

interface StoredValue {
  state: unknown
  expiresAt: number
}

function createExpiringStorage(ttlMs: number): StateStorage {
  return {
    getItem: (name) => {
      const raw = localStorage.getItem(name)
      if (!raw) return null

      try {
        const parsed: StoredValue = JSON.parse(raw)
        if (Date.now() > parsed.expiresAt) {
          localStorage.removeItem(name)
          return null
        }
        return JSON.stringify(parsed.state)
      } catch {
        localStorage.removeItem(name)
        return null
      }
    },
    setItem: (name, value) => {
      const payload: StoredValue = {
        state: JSON.parse(value),
        expiresAt: Date.now() + ttlMs,
      }
      localStorage.setItem(name, JSON.stringify(payload))
    },
    removeItem: (name) => localStorage.removeItem(name),
  }
}

export default createExpiringStorage
