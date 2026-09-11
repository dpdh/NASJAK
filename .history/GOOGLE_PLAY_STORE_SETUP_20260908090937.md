# Google Login, Database, dan Play Store

## Batas keamanan

Aplikasi tidak boleh menyimpan password Gmail, refresh token OAuth, atau file JSON service account di dalam APK, repository, atau AsyncStorage. Profil yang boleh disimpan adalah `googleId`, email, nama, avatar, dan provider login.

## Mengaktifkan login Google

1. Buka Google Cloud Console dan pilih project aplikasi NASUHA.
2. Konfigurasikan OAuth consent screen.
3. Buat OAuth Client ID untuk Web, Android, dan iOS.
4. Untuk Android gunakan package `com.nasuha.nasjak` dan SHA-1 dari keystore build yang dipakai.
5. Salin Client ID ke file environment lokal berdasarkan `.env.example`:

```env
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=...
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=...
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=...
```

Client ID bersifat publik. Client secret tetap berada di server, bukan di aplikasi mobile.

## Database akun Google

Saat ini mode demo aplikasi menyimpan profil member secara lokal untuk prototipe. Untuk database produksi, buat backend dengan Firebase Authentication, Supabase Auth, atau server API sendiri.

Backend harus:

- memverifikasi token Google di server;
- menggunakan `sub` Google sebagai identifier yang stabil, bukan email sebagai primary key;
- menyimpan email, nama, avatar, provider, dan waktu login;
- tidak menyimpan password Gmail;
- mengatur role dan akses admin di server;
- menerapkan aturan keamanan database dan audit log.

Setelah backend tersedia, isi `EXPO_PUBLIC_API_BASE_URL` dan ubah proses login Google agar mengirim identity token/access token ke endpoint backend untuk diverifikasi. Jangan mempercayai role atau email admin yang dikirim langsung dari client.

## Upload ke Play Store dengan EAS

Upload ke Google Play Store dilakukan oleh EAS, bukan oleh akun Gmail yang disimpan di aplikasi.

1. Buat aplikasi di Google Play Console dengan package `com.nasuha.nasjak`.
2. Di Google Cloud, aktifkan Google Play Android Developer API.
3. Buat service account khusus release dan berikan akses yang diperlukan di Play Console.
4. Simpan file JSON service account hanya di secret/credential EAS atau mesin CI yang aman.
5. Login EAS dan jalankan build produksi:

```sh
npx eas login
npx eas build -p android --profile production
npx eas submit -p android --profile production
```

Untuk rilis pertama, Play Console mungkin memerlukan pembuatan aplikasi, pengisian store listing, content rating, data safety, dan upload manual pertama sebelum EAS submit dapat digunakan.

Jangan commit file service account JSON, password, client secret, atau token ke repository.
