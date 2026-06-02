const DB_NAME = 'converthub-cache';
const DB_VERSION = 1;
const STORE_NAME = 'results';
const DEFAULT_TTL = 24 * 60 * 60 * 1000;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };
  });
}

export async function generateHash(data: ArrayBuffer, settings: string = ''): Promise<string> {
  const combined = new Uint8Array(data.byteLength + settings.length);
  combined.set(new Uint8Array(data));
  combined.set(new TextEncoder().encode(settings), data.byteLength);
  const hashBuffer = await crypto.subtle.digest('SHA-256', combined);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

interface CacheEntry {
  key: string;
  value: unknown;
  timestamp: number;
  ttl: number;
}

export async function getCached<T>(key: string): Promise<T | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(key);
      request.onsuccess = () => {
        const entry = request.result as CacheEntry | undefined;
        if (!entry) return resolve(null);
        if (Date.now() - entry.timestamp > entry.ttl) {
          const delTx = db.transaction(STORE_NAME, 'readwrite');
          delTx.objectStore(STORE_NAME).delete(key);
          return resolve(null);
        }
        resolve(entry.value as T);
      };
      request.onerror = () => reject(request.error);
    });
  } catch {
    return null;
  }
}

export async function setCached(
  key: string,
  value: unknown,
  ttl: number = DEFAULT_TTL,
): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put({ key, value, timestamp: Date.now(), ttl });
  } catch {
    // silent fail
  }
}

export async function clearExpired(): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.openCursor();
    request.onsuccess = () => {
      const cursor = request.result;
      if (!cursor) return;
      const entry = cursor.value as CacheEntry;
      if (Date.now() - entry.timestamp > entry.ttl) {
        cursor.delete();
      }
      cursor.continue();
    };
  } catch {
    // silent fail
  }
}
