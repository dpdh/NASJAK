import { readCache, writeCache } from './storage';

const BASE_URL = 'https://equran.id/api/v2';
const CACHE_PREFIX = '@nasjak_quran_';
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface ApiSurah {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  audioFull: Record<string, string>;
}

export interface ApiAyah {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: Record<string, string>;
}

export interface ApiSurahDetail extends ApiSurah {
  ayat: ApiAyah[];
}

async function getCache<T>(key: string): Promise<T | null> {
  return readCache<T>(CACHE_PREFIX + key, CACHE_TTL);
}

async function setCache<T>(key: string, data: T): Promise<void> {
  await writeCache(CACHE_PREFIX + key, data);
}

export async function fetchAllSurahs(): Promise<ApiSurah[]> {
  const cached = await getCache<ApiSurah[]>('surahs');
  if (cached) return cached;

  const res = await fetch(`${BASE_URL}/surat`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();
  const data: ApiSurah[] = json.data;
  await setCache('surahs', data);
  return data;
}

export async function fetchSurahDetail(nomor: number): Promise<ApiSurahDetail> {
  const cached = await getCache<ApiSurahDetail>(`surah_${nomor}`);
  if (cached) return cached;

  const res = await fetch(`${BASE_URL}/surat/${nomor}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();
  const data: ApiSurahDetail = json.data;
  await setCache(`surah_${nomor}`, data);
  return data;
}

export function mapSurahToLocal(s: ApiSurah) {
  return {
    id: s.nomor,
    name: s.namaLatin,
    arabic: s.nama,
    ayahCount: s.jumlahAyat,
    type: s.tempatTurun === 'Mekah' ? ('Makkiyah' as const) : ('Madaniyah' as const),
    meaning: s.arti,
  };
}

export function mapAyahToLocal(surahId: number, a: ApiAyah) {
  const audioKeys = Object.keys(a.audio || {});
  return {
    surahId,
    ayahNumber: a.nomorAyat,
    arabic: a.teksArab,
    latin: a.teksLatin,
    translation: a.teksIndonesia,
    audioUrl: audioKeys.length > 0 ? a.audio[audioKeys[0]] : undefined,
  };
}
