import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { NotificationSettings, PrayerLocation } from '../types';

export interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  [key: string]: string;
}

export interface NearbyMosque {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  address?: string;
}

const KAABA = { latitude: 21.422487, longitude: 39.826206 };
const PRAYER_NAMES: Array<keyof PrayerTimes> = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
const PRAYER_LABELS: Record<string, string> = {
  Fajr: 'Subuh',
  Dhuhr: 'Dzuhur',
  Asr: 'Ashar',
  Maghrib: 'Maghrib',
  Isha: 'Isya',
};

export async function getCurrentPrayerLocation(): Promise<PrayerLocation> {
  const permission = await Location.requestForegroundPermissionsAsync();
  if (permission.status !== 'granted') {
    throw new Error('Izin lokasi diperlukan untuk menampilkan waktu shalat.');
  }

  const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
  let city: string | undefined;
  let country: string | undefined;
  try {
    const address = (await Location.reverseGeocodeAsync(position.coords))[0];
    city = address?.city || address?.district || address?.subregion || undefined;
    country = address?.country || undefined;
  } catch {
    // Coordinates remain usable even when reverse geocoding is unavailable.
  }

  return { latitude: position.coords.latitude, longitude: position.coords.longitude, city, country };
}

export async function fetchPrayerTimes(location: PrayerLocation, date = new Date()): Promise<PrayerTimes> {
  const dateValue = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
  const response = await fetch(
    `https://api.aladhan.com/v1/timings/${dateValue}?latitude=${location.latitude}&longitude=${location.longitude}&method=20`,
  );
  if (!response.ok) throw new Error('Jadwal shalat tidak dapat dimuat.');
  const payload = await response.json();
  if (payload.code !== 200 || !payload.data?.timings) throw new Error('Jadwal shalat tidak tersedia.');
  return payload.data.timings as PrayerTimes;
}

export function getPrayerEntries(times: PrayerTimes) {
  return PRAYER_NAMES
    .filter((key) => typeof times[key] === 'string' && times[key].length > 0)
    .map((key) => ({ key, label: PRAYER_LABELS[key], time: times[key].split(' ')[0] }));
}

export function getQiblaBearing(location: PrayerLocation): number {
  const latitude = toRadians(location.latitude);
  const longitudeDelta = toRadians(KAABA.longitude - location.longitude);
  const bearing = Math.atan2(
    Math.sin(longitudeDelta),
    Math.cos(latitude) * Math.tan(toRadians(KAABA.latitude)) - Math.sin(latitude) * Math.cos(longitudeDelta),
  );
  return Math.round((toDegrees(bearing) + 360) % 360);
}

export async function fetchNearbyMosques(location: PrayerLocation): Promise<NearbyMosque[]> {
  const query = `[out:json][timeout:15];(nwr[amenity=place_of_worship][religion=muslim](around:5000,${location.latitude},${location.longitude});nwr[amenity=mosque](around:5000,${location.latitude},${location.longitude}););out center tags;`;
  const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error('Masjid terdekat tidak dapat dimuat.');
  const payload = await response.json();
  const seen = new Set<string>();
  return (payload.elements || [])
    .map((element: any) => {
      const latitude = element.lat ?? element.center?.lat;
      const longitude = element.lon ?? element.center?.lon;
      if (typeof latitude !== 'number' || typeof longitude !== 'number') return null;
      const name = element.tags?.name || 'Masjid terdekat';
      const id = `${name}-${latitude}-${longitude}`;
      if (seen.has(id)) return null;
      seen.add(id);
      return {
        id,
        name,
        latitude,
        longitude,
        distanceKm: haversineDistance(location.latitude, location.longitude, latitude, longitude),
        address: [element.tags?.['addr:street'], element.tags?.['addr:city']].filter(Boolean).join(', ') || undefined,
      } as NearbyMosque;
    })
    .filter(Boolean)
    .sort((a: NearbyMosque, b: NearbyMosque) => a.distanceKm - b.distanceKm)
    .slice(0, 10);
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('adhan', {
      name: 'Adzan',
      importance: Notifications.AndroidImportance.MAX,
      sound: 'default',
      vibrationPattern: [0, 250, 250, 250],
    });
    await Notifications.setNotificationChannelAsync('reminders', {
      name: 'Pengingat NASUHA',
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: 'default',
    });
  }
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const requested = await Notifications.requestPermissionsAsync({ ios: { allowAlert: true, allowBadge: true, allowSound: true } });
  return requested.granted;
}

export async function rescheduleNotifications(times: PrayerTimes, settings: NotificationSettings): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter((item) => item.content.data?.nasjakNotification === true)
      .map((item) => Notifications.cancelScheduledNotificationAsync(item.identifier)),
  );
  if (!(await requestNotificationPermission())) return;

  if (settings.adhanEnabled) {
    for (const key of PRAYER_NAMES) {
      const [hour, minute] = times[key].split(':').map(Number);
      if (!Number.isFinite(hour) || !Number.isFinite(minute)) continue;
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Waktu ${PRAYER_LABELS[key]}`,
          body: `Telah masuk waktu shalat ${PRAYER_LABELS[key]}. Mari tunaikan dengan khusyuk.`,
          sound: 'default',
          data: { nasjakNotification: true, kind: 'adhan', prayer: key },
        },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour, minute, channelId: 'adhan' },
      });
    }
  }

  if (settings.motivationalEnabled) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Motivasi Hari Ini',
        body: 'Satu langkah kecil hari ini bisa menjadi perubahan besar. Yuk baca motivasi NASUHA.',
        data: { nasjakNotification: true, kind: 'motivasi' },
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour: 7, minute: 0, channelId: 'reminders' },
    });
  }

  if (settings.riyadhohEnabled) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Riyadhoh Reminder',
        body: 'Sudahkah Anda menyelesaikan Riyadhoh hari ini? Ayo istiqamah.',
        data: { nasjakNotification: true, kind: 'riyadhoh' },
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour: settings.riyadhohHour, minute: settings.riyadhohMinute, channelId: 'reminders' },
    });
  }
}

export function formatDistance(distanceKm: number): string {
  return distanceKm < 1 ? `${Math.round(distanceKm * 1000)} m` : `${distanceKm.toFixed(1)} km`;
}

function toRadians(value: number) { return value * Math.PI / 180; }
function toDegrees(value: number) { return value * 180 / Math.PI; }
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
