# NASUHA Jakarta dan Portal Anggota Sahabat Nasjak

## Gambaran aplikasi

NASUHA Jakarta / Sahabat Nasjak adalah portal web anggota untuk pendaftaran dan pengelolaan keanggotaan, kolaborasi Pilot Project, pengelolaan konten oleh admin, serta ruang baca digital. Aplikasi menggunakan arsitektur server-side sederhana: halaman HTML, CSS, dan JavaScript disajikan oleh Express, sedangkan data akun, role, sesi, konten, dan aktivitas disimpan di PostgreSQL.

## Fitur utama

- **Landing page dan autentikasi anggota**: halaman informasi, pendaftaran anggota, login, pemulihan sesi, logout, perubahan kata sandi wajib, dan pembatasan percobaan login.
- **Manajemen profil**: nama, instansi/komunitas, profesi, foto profil, enam pilihan avatar, dan data keanggotaan.
- **Dashboard anggota**: ringkasan profil, KTA digital dua sisi, sertifikat keanggotaan, QR verifikasi, dan fasilitas cetak.
- **Pilot Project**: grup proyek, Project Manager, anggota tim, profesi, feed perkembangan, tautan, lampiran, like, dan komentar.
- **Media / ruang baca**: koleksi e-book PDF yang dibaca langsung di dalam portal sebagai flipbook. Koleksi saat ini mencakup `e-L-01.pdf` dan `bcs2025.pdf`, serta cover Buku Putih NASUHA. Pembaca dapat berpindah halaman dengan tombol Sebelumnya/Berikutnya, menuju nomor halaman tertentu, menyimpan bookmark, melanjutkan halaman terakhir, menggunakan mode layar penuh, dan membaca pada desktop maupun perangkat mobile.
- **Panel CMS/admin**: persetujuan dan pengelolaan anggota, role Super Admin/Admin/Membership, konten situs, data proyek, serta konfigurasi administrasi.
- **Generator e-book CMS**: Super Admin dan Admin dapat mengunggah PDF maksimal 100 MB dari tab Content Management. Setelah upload berhasil, metadata e-book tersimpan di PostgreSQL dan file langsung tersedia di menu Media sebagai flipbook PDF.js + PageFlip.
- **Akses konten per anggota**: di tabel keanggotaan CMS terdapat checklist per anggota untuk memberi/mencabut akses Buku Putih NASUHA dan setiap e-book di katalog CMS (tersimpan di tabel `user_ebook_access`). Anggota hanya melihat e-book yang aksesnya diberikan.
- **Login sosial opsional**: Google, Facebook, Instagram, dan Apple melalui OAuth apabila kredensial provider telah dikonfigurasi.
- **Keamanan dasar**: password disimpan dengan bcrypt, sesi memakai token hash dan cookie HttpOnly, validasi tipe/ukuran upload, rate limiting, CSP, Helmet, dan pembatasan akses berdasarkan role.

## Teknologi yang digunakan

### Backend

- Node.js 20 atau lebih baru dengan ES Modules.
- Express 5 sebagai HTTP server dan REST API.
- PostgreSQL 14 atau lebih baru melalui `pg` sebagai database relasional.
- `dotenv` untuk konfigurasi environment.
- `bcryptjs` untuk hashing password.
- `cookie-parser` untuk cookie sesi.
- `express-rate-limit` untuk pembatasan request sensitif.
- `helmet` untuk header keamanan HTTP dan Content Security Policy.
- `multer` untuk upload foto anggota dan lampiran Pilot Project.
- `file-type` untuk validasi tipe file berdasarkan isi file.
- `qrcode` untuk QR pada KTA dan halaman verifikasi.

### Frontend

- HTML5 untuk halaman landing, login, portal anggota, verifikasi, dan CMS.
- CSS3 responsif dengan stylesheet terpisah untuk portal, admin, dan halaman verifikasi.
- JavaScript browser tanpa framework besar, menggunakan Fetch API, DOM API, local storage, dan Fullscreen API.
- **PDF.js** (`pdfjs-dist`) untuk membaca dan merender halaman PDF ke canvas.
- **PageFlip** (`page-flip`) untuk efek membalik halaman, mode portrait/landscape, navigasi halaman, dan animasi flipbook.
- SVG dan PNG untuk logo, avatar, cover buku, KTA, serta aset visual portal.

### Penyimpanan dan aset

- PostgreSQL menyimpan user, role, sesi, pendaftaran, konten situs, grup proyek, posting, like, komentar, dan konfigurasi terkait aplikasi.
- `assets/book/` menyimpan file PDF e-book.
- `assets/img/` menyimpan cover, logo, avatar, template KTA, dan aset gambar lain.
- `uploads/member-photos/` menyimpan foto profil anggota.
- `uploads/pilot-projects/` menyimpan lampiran Pilot Project secara privat dan hanya dapat diakses melalui sesi yang valid.

## Struktur halaman dan akses

- `/` — landing page NASUHA Jakarta.
- `/anggota` — portal anggota dan menu Media.
- `/admin` — panel CMS/admin.
- `/verify/<id>` — verifikasi KTA publik berdasarkan QR.
- `/api/*` — endpoint autentikasi, anggota, admin, konten, proyek, dan media.

E-book ditampilkan di dalam halaman portal, bukan membuka tab baru. Hak akses koleksi dan aksi admin mengikuti status akun serta role yang ditentukan aplikasi. File PDF yang dipasang di server dapat dibaca melalui viewer PDF.js dan tidak memerlukan layanan flipbook eksternal.

## Perintah npm

| Perintah | Kegunaan |
| --- | --- |
| `npm install` | Memasang dependensi aplikasi |
| `npm start` | Menjalankan server web pada port `3000` |
| `npm run db:setup` | Membuat struktur database dari `database.sql` |
| `npm run admin:reset-password` | Mengatur ulang password Super Admin melalui terminal |
| `npm run admin:configure-reset-token` | Membuat token reset password admin ke `.env` |

Pada CMS, buka tab **Content Management**, isi judul dan deskripsi, pilih PDF, lalu tekan **Upload & Generate Flipbook**. E-book baru akan muncul otomatis pada koleksi Media untuk akun aktif yang memiliki role pembaca.

## Konfigurasi environment

Salin `.env.example` menjadi `.env`. Variabel minimum yang diperlukan adalah `DATABASE_URL`. Untuk bootstrap admin, isi `ADMIN_EMAIL` dan `ADMIN_PASSWORD`. Gunakan `PUBLIC_BASE_URL` saat aplikasi dipasang pada domain publik agar QR KTA dan callback OAuth menghasilkan URL yang benar. Jangan commit `.env`, password, client secret OAuth, atau private key ke repository.

## Menjalankan lokal

Persyaratan: Node.js 20 atau lebih baru dan PostgreSQL 14 atau lebih baru.

1. Pastikan server PostgreSQL berjalan.
2. Pasang dependensi dengan `npm install`.
3. Salin `.env.example` menjadi `.env`, lalu sesuaikan `DATABASE_URL` dengan akun PostgreSQL lokal. Jangan commit file `.env`.
4. Isi `ADMIN_EMAIL` dan `ADMIN_PASSWORD` untuk akun admin bootstrap. `SUPER_ADMIN_EMAIL` secara default menunjuk `dani.hd@idtc.org`; akun tersebut akan diaktifkan dan diberi role Super Admin saat ditemukan di database. Password dan profilnya tidak diubah.
5. Jalankan `npm run db:setup` untuk membuat database dan tabel portal Sahabat Nasjak.
6. Jalankan `npm start`, lalu buka `http://localhost:3000` untuk website NASUHA Jakarta. Portal anggota tersedia di `http://localhost:3000/anggota`.

Buka alamat dari server Node tersebut, bukan server file statis, agar form pendaftaran dapat mencapai API.

## Data anggota

Form permohonan keanggotaan meminta nama lengkap, alamat email, dan kata sandi. Kata sandi disimpan sebagai hash bcrypt, bukan teks biasa. Permohonan disimpan sebagai anggota berstatus `pending`, sehingga belum bisa login sampai admin meninjau dan mengaktifkan akun. Foto profil dapat ditambahkan setelah akun aktif.

Data lengkap respons pendaftaran yang diimpor disimpan pada `member_applications.response_data` dan ditautkan ke akun dengan email valid. Akun yang dibuat dari formulir calon anggota berstatus `pending`. Respons dengan alamat email tidak valid tetap dipertahankan, tetapi tidak mendapat akun login.

Pendaftaran menggunakan `POST /api/auth/register` dan dibatasi delapan percobaan per 15 menit. Kata sandi minimal 8 karakter dan maksimal 72 byte. Login anggota dan staf menggunakan `POST /api/auth/login`; hanya akun aktif yang dapat masuk. Sesi disimpan sebagai hash token di `user_sessions`, memakai cookie `HttpOnly`, dan dapat dipulihkan setelah halaman dimuat ulang. Centang **Ingat saya di perangkat ini** untuk mempertahankan sesi hingga 30 hari; tanpa centang, sesi berlaku 8 jam. Gunakan tombol **Keluar dari akun** untuk mencabut sesi.

Setelah masuk, pengguna diarahkan ke dashboard profil. Menu **Pengaturan profil** dapat mengubah nama, instansi/komunitas, mengunggah foto profil (JPG, PNG, atau WEBP maksimal 5 MB), atau menggunakan salah satu dari enam avatar karakter. Foto profil juga ditampilkan pada KTA. Tombol **Gunakan avatar** menghapus foto tersimpan dan menerapkan avatar yang dipilih. Email tidak dapat diubah dari halaman tersebut.

## Pilot Project

Menu **Pilot Project** menampilkan grup beserta admin/penggagas, Project Manager, anggota tim, dan profesi mereka. Anggota yang masuk dapat membagikan perkembangan berupa teks, tautan web, atau satu lampiran JPG, PNG, WEBP, maupun PDF maksimal 10 MB. Lampiran disimpan privat di `uploads/pilot-projects` dan hanya dapat dimuat melalui sesi portal. Feed mendukung like, komentar, serta berbagi tautan ke halaman project. Gift belum aktif karena integrasi inventaris Twini Game memerlukan API atau skema database dari sistem game.

Dashboard anggota aktif juga menampilkan pratinjau KTA dua sisi dan sertifikat keanggotaan. Dokumen diambil berdasarkan sesi akun yang sedang masuk; foto anggota dan QR verifikasi tidak dapat diminta untuk ID pengguna lain melalui portal. Gunakan tombol cetak pada dashboard untuk mencetak KTA dua sisi (masing-masing sisi pada halaman terpisah) atau sertifikat A4 lanskap. Tanggal pada sertifikat mengikuti tanggal pendaftaran anggota, dan sertifikat tetap perlu ditandatangani Ketua Sahabat Nasjak sebelum dibagikan. Akun aktif yang tidak memiliki role `member` tidak dapat melihat dokumen anggota.

## Login sosial

Login Google, Facebook, Instagram, dan Apple tersedia setelah kredensial aplikasi OAuth masing-masing diisi di `.env`; tombol tetap nonaktif untuk provider yang belum dikonfigurasi. Tetapkan `PUBLIC_BASE_URL` ke alamat publik portal, daftarkan URL callback persis berikut di konsol developer masing-masing, lalu mulai ulang server:

- Google: `${PUBLIC_BASE_URL}/auth/google/callback`
- Facebook: `${PUBLIC_BASE_URL}/auth/facebook/callback`
- Instagram: `${PUBLIC_BASE_URL}/auth/instagram/callback`
- Apple: `${PUBLIC_BASE_URL}/auth/apple/callback`

Buat kredensial OAuth pada [Google Cloud Console](https://console.cloud.google.com/apis/credentials), [Meta for Developers](https://developers.facebook.com/apps/), dan [Apple Developer](https://developer.apple.com/account/resources/identifiers/list). Untuk Instagram, aktifkan produk Instagram API dan Business Login pada aplikasi Meta. Isi `GOOGLE_CLIENT_ID` dan `GOOGLE_CLIENT_SECRET`; `FACEBOOK_APP_ID` dan `FACEBOOK_APP_SECRET`; `INSTAGRAM_APP_ID` dan `INSTAGRAM_APP_SECRET`; serta `APPLE_CLIENT_ID`, `APPLE_TEAM_ID`, `APPLE_KEY_ID`, dan `APPLE_PRIVATE_KEY`. `APPLE_CLIENT_ID` harus berupa Services ID untuk Sign in with Apple. Kunci privat Apple dapat disimpan pada satu baris dengan baris baru ditulis sebagai `\n`. Facebook memakai `FACEBOOK_GRAPH_VERSION` yang dapat diatur, dengan default `v26.0`.

Pengguna harus masuk ke akun Sahabat Nasjak yang sudah ada dengan email/password terlebih dahulu, lalu menautkan provider dari bagian **Login dengan akun sosial** di profil. Setelah ditautkan, tombol provider dapat digunakan untuk login ke akun tersebut. Login sosial tidak membuat akun Sahabat Nasjak baru dan tidak mengaktifkan akun pending/suspended. Instagram Login resmi Meta hanya mendukung akun profesional Business/Creator. Simpan semua client secret dan private key hanya di `.env`, jangan commit atau membagikannya.

## Struktur repository

```
.
├── server.js              # Express server utama: autentikasi anggota, profil, Pilot Project,
│                          #   KTA/sertifikat, upload foto, session, rate limiting
├── admin.js (root)        # Modul backend admin: login admin, CRUD anggota, role,
│                          #   site content, e-book, reset password Super Admin
├── admin.html / admin.css / admin-ui.js   # UI panel CMS (dashboard, keanggotaan, content management)
├── index.html             # Landing page (hero, informasi, CTA daftar/masuk)
├── nasjak.css / nasjak.js # Gaya dan skrip landing page
├── script.js / style.css  # Skrip & gaya halaman login/registrasi/portal
├── member-portal.html     # Dashboard anggota: profil, KTA digital, sertifikat,
│                          #   Pilot Project, Media (e-book flipbook)
├── verify.html/css/js     # Halaman verifikasi publik KTA (/verify/:id)
├── database.sql           # Skema PostgreSQL (users, roles, site_content, ebooks,
│                          #   user_ebook_access, pilot project, social login, dll.)
├── .env.example           # Template konfigurasi environment
├── .htaccess              # Route rewrite untuk deploy shared hosting (/admin, /anggota)
├── scripts/               # Script CLI reset password & token Super Admin
├── assets/book/           # PDF e-book statis + cover (uploads CMS di book/uploads/)
├── assets/img/            # Logo, avatar, template KTA, cover buku
├── uploads/               # Upload runtime (foto anggota, lampiran) — tidak di-commit
└── admin/ dan anggota/    # Alias route untuk deploy .htaccess
```

- `server.js` memanggil `registerAdminRoutes()` dari `admin.js` untuk memasang seluruh rute CMS.
- `admin-ui.js` adalah skrip browser panel CMS (disajikan sebagai `/admin.js`).
- `assets/book/uploads/` dibuat otomatis saat admin mengunggah e-book pertama.

## Database

Skema dibuat oleh `database.sql` (`npm run db:setup`). Tabel penting:

| Tabel | Fungsi |
| --- | --- |
| `users` | Akun anggota: nama, email, password hash, instansi, profesi, avatar, nomor anggota, status (`pending`/`active`/`suspended`), flag `white_paper_access` dan `must_change_password` |
| `roles`, `user_roles` | Role `super_admin`, `admin`, `membership`, `member` |
| `site_content` | Teks halaman landing/login/pendaftaran yang bisa diedit via CMS |
| `ebooks` | Katalog e-book (judul, deskripsi, file PDF, ukuran) |
| `user_ebook_access` | Hak akses e-book per anggota (`user_id` + `ebook_id`) |
| `pilot_project_*` | Grup, anggota grup, posting, media, like, komentar Pilot Project |
| `member_sessions`, `admin_sessions` | Sesi login (token disimpan sebagai hash) |
| `social_identities`, `user_sessions` | Tautan login sosial dan sesi anggota |
| `admin_password_resets` | Token reset password Super Admin |

Migrasi idempotent (`CREATE TABLE IF NOT EXISTS`, `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`) sehingga `database.sql` aman dijalankan ulang pada database lama.

## Panel admin dan role

Buka `http://localhost:3000/admin` dan masuk dengan akun aktif. Sesi menggunakan cookie `HttpOnly`, `SameSite=Strict`, dan token yang disimpan sebagai hash.

Role **Super Admin** dapat mengelola role semua akun dan konten portal. Role **Admin** dapat mengelola anggota serta konten portal. Role **Membership** hanya dapat mengelola data anggota. Role internal `member` ditampilkan sebagai **Free Member** dan tidak mendapat akses panel admin. Perubahan role hanya tersedia bagi Super Admin, dan sistem menjaga agar selalu ada minimal satu Super Admin.

Area **Keanggotaan** dapat melihat/filter anggota, meninjau foto, menambah anggota manual, mengubah profil, menyetujui/menangguhkan, serta menghapus data anggota. Akun staf terpisah dari daftar anggota agar tidak terhapus lewat alur tersebut. **Content Management** mengubah teks halaman masuk/pendaftaran dan halaman utama; perubahan disimpan di `site_content` dan langsung dibaca portal.

Untuk mengonfigurasi token reset, jalankan `npm run admin:configure-reset-token`; token acak disimpan ke `.env` tanpa dicetak. Mulai ulang server agar aktif, lalu buka **Reset password Super Admin** di CMS dan masukkan token, password baru, serta konfirmasi. Endpoint membatasi percobaan, menyimpan password sebagai hash, serta mencabut sesi lama. Akun `SUPER_ADMIN_EMAIL` akan dibuat bila belum ada.

Alternatifnya, dengan `DATABASE_URL` terkonfigurasi dan PostgreSQL aktif, jalankan `npm run admin:reset-password` untuk memasukkan password langsung di terminal secara tersembunyi.

Anggota ber-role `member` dengan status `active` memiliki aksi **Buat KTA**. Sisi depan memakai `assets/img/sahabat-nasjak-kta-front.svg` dengan foto, nama, instansi, dan nomor anggota; sisi belakang memakai `assets/img/sahabat-nasjak-kta-back.svg` dengan nomor anggota dan QR verifikasi. Pilih Depan/Belakang untuk pratinjau, atau **Cetak dua sisi** untuk mencetak kedua template pada halaman portrait terpisah. Aktifkan opsi cetak latar belakang agar desain ikut tercetak.

KTA menyertakan QR untuk membuka `/verify/<id>` pada `PUBLIC_BASE_URL`. Halaman verifikasi hanya menampilkan nama, nomor anggota, instansi, status, dan tanggal terdaftar; email serta password tidak pernah disertakan. Atur `PUBLIC_BASE_URL` ke domain publik sebelum mencetak kartu untuk penggunaan produksi.

Konfirmasi setelah persetujuan menampilkan pintasan cetak KTA dan sertifikat. Sertifikat dicetak pada A4 lanskap dengan ruang tanda tangan kosong untuk ditandatangani langsung oleh Ketua Sahabat Nasjak sebelum dibagikan.

Anggota hasil impor dengan `users.must_change_password = true` akan melihat dialog wajib ganti kata sandi saat login atau pemulihan sesi. Kata sandi baru minimal 12 karakter dan harus dikonfirmasi; setelah berhasil anggota langsung masuk ke profil. Rute perubahan kata sandi mempertahankan sesi saat ini dan mencabut sesi lainnya. Admin dapat mengatur flag kewajiban ini melalui kolom `users.must_change_password`; mengganti kata sandi lewat CMS tidak dengan sendirinya mengubah flag tersebut.

## Endpoint API utama

### Anggota (sesi cookie anggota)

| Method | Endpoint | Fungsi |
| --- | --- | --- |
| POST | `/api/auth/register` | Pendaftaran anggota baru (status `pending`) |
| POST | `/api/auth/login` | Login anggota |
| GET | `/api/auth/me` | Profil anggota yang sedang masuk |
| POST | `/api/auth/logout` | Logout |
| PATCH | `/api/auth/profile` | Ubah nama, instansi, profesi, avatar |
| POST | `/api/auth/profile/photo` | Unggah foto profil (JPEG/PNG/WebP, maks 5 MB) |
| DELETE | `/api/auth/profile/photo` | Hapus foto profil |
| POST | `/api/auth/change-password` | Ganti kata sandi (wajib saat `must_change_password`) |
| GET | `/api/auth/white-paper` | Tautan Buku Putih (hanya bila akses diberikan) |
| GET | `/api/auth/ebooks` | Daftar e-book yang boleh diakses anggota |
| GET | `/api/auth/ebooks/:id/file` | Stream file PDF e-book |
| GET | `/api/auth/pilot-project-groups` | Daftar grup Pilot Project |
| GET/POST | `/api/auth/pilot-project-groups/:groupId/posts` | Baca/buat posting grup |
| POST/DELETE | `.../posts/:postId/like` | Suka/batal suka posting |
| POST | `.../posts/:postId/comments` | Komentar pada posting |
| GET | `/api/health` | Health check server + database |

### Admin (sesi cookie `idtc_admin_session`)

| Method | Endpoint | Fungsi |
| --- | --- | --- |
| POST | `/api/admin/login` | Login admin |
| GET | `/api/admin/me` | Profil/role admin aktif |
| GET | `/api/admin/users` | Daftar anggota + katalog e-book + ringkasan status |
| POST | `/api/admin/users` | Tambah anggota manual |
| DELETE | `/api/admin/users/:id` | Hapus anggota |
| PATCH | `/api/admin/users/:id/status` | Setujui/tangguhkan anggota |
| PATCH | `/api/admin/users/:id/white-paper-access` | Cabut/berikan akses Buku Putih |
| PATCH | `/api/admin/users/:id/ebook-access` | Cabut/berikan akses e-book tertentu |
| GET | `/api/admin/users/:id/photo`, `/qr` | Foto & QR KTA anggota |
| GET/POST | `/api/admin/ebooks` | Katalog & unggah e-book PDF (maks 100 MB) |
| GET/PATCH | `/api/admin/content` | Baca/ubah teks situs (`site_content`) |
| GET | `/api/admin/accounts` | Daftar akun staf (Super Admin) |
| PATCH | `/api/admin/accounts/:id/role` | Ubah role akun (Super Admin) |
| POST | `/api/admin/reset-password` | Reset password Super Admin via token |
| GET | `/api/members/verify/:id` | Verifikasi publik KTA |

### Halaman

| Path | Halaman |
| --- | --- |
| `/` | Landing page |
| `/admin` | Panel CMS |
| `/verify/:id` | Verifikasi publik KTA |
| `/anggota` | Portal anggota (alias via `.htaccess` pada deploy) |

## Keamanan

- Password disimpan sebagai hash bcrypt; token sesi disimpan sebagai hash di database dan dikirim lewat cookie `HttpOnly` + `SameSite=Strict` (sesi admin kedaluwarsa dalam 8 jam).
- Rate limiting pada login anggota, login admin, registrasi, komentar/posting, greeting, dan reset password.
- Header keamanan Helmet (CSP, HSTS, dll.) dan pemeriksaan same-origin untuk semua request mutasi.
- Upload divalidasi berdasarkan isi file (`file-type`), bukan hanya ekstensi; ukuran dibatasi per jenis upload (foto 5 MB, lampiran Pilot Project 10 MB, e-book 100 MB).
- Endpoint publik `/api/members/verify/:id` hanya mengembalikan data minimum (nama, nomor anggota, instansi, status, tanggal daftar) — tidak pernah email atau password.
- Akses e-book/Buku Putih diverifikasi per anggota (`white_paper_access`, `user_ebook_access`) sebelum file disajikan.

## Troubleshooting

- **`fatal: refusing to merge unrelated histories`** — repository tujuan berisi riwayat commit yang tidak terhubung dengan riwayat lokal. Pilih salah satu: (1) `git pull --allow-unrelated-histories` untuk menggabungkan kedua riwayat, atau (2) `git push --force` bila yakin menimpa isi repository tujuan (riwayat lama di tujuan akan hilang).
- **Server tidak bisa menyambung database** — pastikan PostgreSQL berjalan dan `DATABASE_URL` benar; cek `GET /api/health` untuk status koneksi.
- **E-book tidak muncul di portal** — pastikan anggota berstatus `active` dan centang akses e-book di tabel keanggotaan CMS; file PDF harus berhasil diunggah lewat Content Management.
- **`node_modules` atau `.env` ikut ter-commit** — keduanya sudah ada di `.gitignore`; jangan mematikan ignore tersebut.
- **Push ditolak (`non-fast-forward`)** — lakukan `git pull` lalu selesaikan konflik; `git push --force` hanya bila yakin menimpa remote.

## Repository Git

- Remote produksi: `https://github.com/dpdh/NASJAK.git` (branch `main`)
- Alur kerja: commit lokal di-push ke `main`; `--force` hanya dipakai bila yakin menimpa isi remote.
