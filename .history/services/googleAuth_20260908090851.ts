import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

// ============================================================
// Google OAuth Client IDs — NASUHA App
// ============================================================
// SETUP INSTRUCTIONS:
// 1. Buka https://console.cloud.google.com/
// 2. Buat project baru "NASUHA App" (atau pilih existing)
// 3. Aktifkan "Google People API" di Library
// 4. Buka APIs & Services → OAuth consent screen → External
//    - App name: NASUHA App
//    - Support email: dp.danihamdani@gmail.com
// 5. Buka Credentials → Create Credentials → OAuth client ID:
//    a) Web application:
//       - Name: NASUHA Web
//       - Authorized redirect URIs:
//         https://auth.expo.io/@nasuha/nasjak-app
//       → Copy Client ID ke webClientId
//    b) Android:
//       - Name: NASUHA Android
//       - Package name: com.nasuha.nasjak
//       - SHA-1: 40:C1:F3:AC:27:02:50:BA:B6:AB:AB:AD:0E:98:6C:B4:79:DD:05:80
//       → Copy Client ID ke androidClientId
//    c) iOS:
//       - Name: NASUHA iOS
//       - Bundle ID: com.nasuha.nasjak
//       → Copy Client ID ke iosClientId
// ============================================================

// GANTI dengan Client ID dari Google Cloud Console:
export const GOOGLE_CONFIG = {
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
  androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
};

const hasValidConfig = Object.values(GOOGLE_CONFIG).every((clientId) => clientId.includes('.apps.googleusercontent.com') && !clientId.startsWith('YOUR_'));

export interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
}

export function useGoogleAuth() {
  if (!hasValidConfig) {
    return {
      request: null as any,
      response: null as any,
      promptAsync: async () => {
        throw new Error('GOOGLE_CONFIG belum diisi. Buka services/googleAuth.ts dan isi Client ID dari Google Cloud Console.');
      },
      isConfigured: false,
    };
  }

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: GOOGLE_CONFIG.webClientId,
    androidClientId: GOOGLE_CONFIG.androidClientId,
    iosClientId: GOOGLE_CONFIG.iosClientId,
  });

  return { request, response, promptAsync, isConfigured: true };
}

export async function fetchGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo | null> {
  try {
    const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) {
      console.warn('[GoogleAuth] Failed to fetch user info:', res.status);
      return null;
    }
    return (await res.json()) as GoogleUserInfo;
  } catch (err) {
    console.warn('[GoogleAuth] Error fetching user info:', err);
    return null;
  }
}

export function isGoogleConfigured(): boolean {
  return hasValidConfig;
}
