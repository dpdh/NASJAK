import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export async function readJson<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export async function writeJson<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Persistence is best effort; the in-memory state remains usable.
  }
}

export async function remove(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    // Ignore storage cleanup failures.
  }
}

export async function readCache<T>(key: string, ttlMs: number): Promise<T | null> {
  const entry = await readJson<CacheEntry<T>>(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > ttlMs) {
    await remove(key);
    return null;
  }
  return entry.data;
}

export async function writeCache<T>(key: string, data: T): Promise<void> {
  await writeJson(key, { data, timestamp: Date.now() } satisfies CacheEntry<T>);
}
