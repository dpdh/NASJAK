import { readCache, writeCache } from './storage';

const BASE_URL = 'https://hadis-api-id.vercel.app/hadith';
const CACHE_PREFIX = '@nasjak_hadis_';
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface ApiHadisCollection {
  name: string;
  slug: string;
  total: number;
}

export interface ApiHadisItem {
  number: number;
  arab: string;
  id: string; // Indonesian translation
}

export interface ApiHadisPage {
  name: string;
  slug: string;
  total: number;
  pagination: {
    totalItems: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
  };
  items: ApiHadisItem[];
}

async function getCache<T>(key: string): Promise<T | null> {
  return readCache<T>(CACHE_PREFIX + key, CACHE_TTL);
}

async function setCache<T>(key: string, data: T): Promise<void> {
  await writeCache(CACHE_PREFIX + key, data);
}

const COLLECTION_META: Record<string, { arabic: string; author: string }> = {
  bukhari: { arabic: 'صحيح البخاري', author: 'Imam Bukhari' },
  muslim: { arabic: 'صحيح مسلم', author: 'Imam Muslim' },
  tirmidzi: { arabic: 'سنن الترمذي', author: 'Imam Tirmidzi' },
  'abu-dawud': { arabic: 'سنن أبي داود', author: 'Imam Abu Dawud' },
  nasai: { arabic: 'سنن النسائي', author: "Imam An-Nasa'i" },
  'ibnu-majah': { arabic: 'سنن ابن ماجه', author: 'Imam Ibnu Majah' },
  ahmad: { arabic: 'مسند أحمد', author: 'Imam Ahmad bin Hanbal' },
  darimi: { arabic: 'سنن الدارمي', author: 'Imam Ad-Darimi' },
  malik: { arabic: 'موطأ مالك', author: 'Imam Malik bin Anas' },
};

export async function fetchHadisCollections(): Promise<(ApiHadisCollection & { arabic: string; author: string })[]> {
  const cached = await getCache<(ApiHadisCollection & { arabic: string; author: string })[]>('collections');
  if (cached) return cached;

  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json: ApiHadisCollection[] = await res.json();

  const data = json.map((c) => ({
    ...c,
    arabic: COLLECTION_META[c.slug]?.arabic || c.name,
    author: COLLECTION_META[c.slug]?.author || c.name,
  }));

  await setCache('collections', data);
  return data;
}

export async function fetchHadisPage(slug: string, page: number, limit: number = 20): Promise<ApiHadisPage> {
  const cacheKey = `${slug}_p${page}_l${limit}`;
  const cached = await getCache<ApiHadisPage>(cacheKey);
  if (cached) return cached;

  const res = await fetch(`${BASE_URL}/${slug}?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json: ApiHadisPage = await res.json();

  await setCache(cacheKey, json);
  return json;
}

export async function searchHadis(slug: string, keyword: string): Promise<ApiHadisItem[]> {
  const res = await fetch(`${BASE_URL}/${slug}?page=1&limit=300`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json: ApiHadisPage = await res.json();

  const lower = keyword.toLowerCase();
  return json.items.filter(
    (h) => h.id.toLowerCase().includes(lower) || h.arab.includes(keyword) || String(h.number).includes(keyword),
  );
}
