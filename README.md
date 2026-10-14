# NASUHA Jakarta — Portal Anggota Sahabat Nasjak (NASJAK)

Portal web keanggotaan NASUHA Jakarta / Sahabat Nasjak: pendaftaran dan pengelolaan keanggotaan, KTA digital dengan QR verifikasi, kolaborasi Pilot Project, ruang baca digital (e-book flipbook), serta panel CMS untuk pengelolaan konten dan anggota.

**Stack utama:** Node.js 20+ (ES Modules) • Express 5 • PostgreSQL 14+ • PDF.js + PageFlip — tanpa framework frontend besar.

---

## Daftar isi

1. [Gambaran aplikasi](#gambaran-aplikasi)
2. [Fitur utama](#fitur-utama)
3. [Teknologi yang digunakan](#teknologi-yang-digunakan)
4. [Struktur repository](#struktur-repository)
5. [Perintah npm](#perintah-npm)
6. [Konfigurasi environment](#konfigurasi-environment)
7. [Menjalankan lokal](#menjalankan-lokal)
8. [Struktur halaman dan akses](#struktur-halaman-dan-akses)
9. [Database](#database)
10. [Endpoint API utama](#endpoint-api-utama)
11. [Data anggota dan autentikasi](#data-anggota-dan-autentikasi)
12. [Panel admin dan role](#panel-admin-dan-role)
13. [Media / ruang baca digital](#media--ruang-baca-digital)
14. [Pilot Project](#pilot-project)
15. [Login sosial](#login-sosial)
16. [Keamanan](#keamanan)
17. [Deployment](#deployment)
18. [Troubleshooting](#troubleshooting)
19. [Repository Git](#repository-git)

---

## Gambaran aplikasi

NASUHA Jakarta / Sahabat Nasjak adalah portal web anggota untuk pendaftaran dan pengelolaan keanggotaan, kolaborasi Pilot Project, pengelolaan konten oleh admin, serta ruang baca digital.

Aplikasi memakai arsitektur server-side sederhana: halaman HTML, CSS, dan JavaScript disajikan oleh Express, sedangkan data akun, role, sesi, konten, dan aktivitas disimpan di PostgreSQL. Tidak ada framework frontend (React/Vue/dll.) — interaksi halaman memakai Fetch API dan DOM API langsung, sehingga ringan dan mudah dipelihara.

Alur inti aplikasi:

1. Calon anggota mendaftar via landing page → akun dibuat berstatus `pending`.
2. Admin meninjau di panel CMS → menyetujui (status `active`) atau menangguhkan.
3. Anggota aktif masuk ke portal: profil, KTA digital + sertifikat, Pilot Project, dan ruang baca (e-book yang aksesnya diberikan admin).
4. Admin mengelola anggota, konten situs, katalog e-book, dan hak akses konten per anggota dari `/admin`.

## Fitur utama

### Landing page dan autentikasi

- Halaman informasi publik dengan judul, deskripsi, dan teks sapaan yang bisa diedit admin (tersimpan di tabel `site_content`).
- Pendaftaran anggota (nama, email, kata sandi), login, pemulihan sesi, logout.
- Kata sandi wajib diganti untuk akun impor (`must_change_password`).
- Pembatasan percobaan login dan registrasi (rate limiting).
- Opsi **Ingat saya di perangkat ini** — sesi 30 hari; tanpa opsi, sesi 8 jam.

### Profil dan identitas anggota

- Ubah nama, instansi/komunitas, dan profesi.
- Foto profil (JPG/PNG/WEBP, maks 5 MB) atau salah satu dari enam avatar karakter (`explorer`, `engineer`, `scientist`, `creator`, `pioneer`, `visionary`).
- Nomor anggota otomatis (`SN-xxxxxx`) dengan urutan unik di database.

### Dashboard anggota

- Ringkasan profil dan statistik keanggotaan.
- **KTA digital dua sisi** (depan/belakang) dengan foto, data anggota, dan QR verifikasi; dapat dicetak dua sisi.
- **Sertifikat keanggotaan** format A4 lanskap untuk ditandatangani Ketua Sahabat Nasjak.
- Fasilitas cetak langsung dari browser.

### Media / ruang baca digital

- Koleksi e-book PDF dibaca langsung di dalam portal sebagai **flipbook** (PDF.js + PageFlip), bukan tab baru.
- Navigasi Sebelumnya/Berikutnya, lompat ke nomor halaman, bookmark, lanjutkan halaman terakhir, mode layar penuh; responsif desktop dan mobile.
- Koleksi statis bawaan: `e-L-01.pdf`, `bcs2025.pdf`, serta Buku Putih NASUHA.
- **Generator e-book CMS**: Super Admin/Admin dapat mengunggah PDF hingga 100 MB dari tab Content Management; metadata tersimpan di PostgreSQL (`ebooks`) dan file langsung muncul di menu Media.
- **Akses konten per anggota**: checklist per anggota di tabel keanggotaan CMS untuk memberi/mencabut akses Buku Putih dan setiap e-book katalog (tabel `user_ebook_access`). Anggota hanya melihat e-book yang aksesnya diberikan.

### Pilot Project

- Grup proyek dengan Project Manager, anggota tim, dan profesi masing-masing.
- Feed perkembangan: teks, tautan web, dan satu lampiran (JPG/PNG/WEBP/PDF, maks 10 MB).
- Like dan komentar pada posting; lampiran tersimpan privat di `uploads/pilot-projects`.
- Greeting antar-anggota (love / flower / crown) dengan pesan singkat.

### Panel CMS/admin

- Persetujuan, penambahan manual, pengubahan, dan penghapusan anggota.
- Role **Super Admin**, **Admin**, **Membership** dengan hak akses berbeda.
- Content Management: teks halaman utama dan halaman masuk/pendaftaran.
- Manajemen katalog e-book dan hak akses konten per anggota.
- Reset password Super Admin via token.
- Membuat KTA dan QR verifikasi untuk anggota.

### Login sosial opsional

- Google, Facebook, Instagram, dan Apple melalui OAuth, aktif setelah kredensial diisi di `.env`.
- Ditautkan ke akun yang sudah ada — login sosial tidak membuat akun baru.

### Keamanan dasar

- Password di-hash bcrypt; sesi memakai token hash + cookie `HttpOnly`.
- Validasi tipe file berdasarkan isi (`file-type`), bukan hanya ekstensi.
- Rate limiting, CSP ketat via Helmet, pemeriksaan same-origin untuk semua request mutasi.
- Pembatasan akses berdasarkan role dan status akun.

## Teknologi yang digunakan

### Backend

| Teknologi | Versi / catatan | Kegunaan |
| --- | --- | --- |
| Node.js | ≥ 20, ES Modules | Runtime |
| Express | 5 | HTTP server dan REST API |
| PostgreSQL | ≥ 14 (via `pg`) | Database relasional |
| `dotenv` | — | Konfigurasi environment |
| `bcryptjs` | — | Hashing password |
| `cookie-parser` | — | Pembaca cookie sesi |
| `express-rate-limit` | — | Pembatasan request sensitif |
| `helmet` | — | Header keamanan HTTP + CSP |
| `multer` | — | Upload foto & lampiran (memory storage) |
| `file-type` | — | Validasi tipe file dari isi byte |
| `qrcode` | — | QR pada KTA dan halaman verifikasi |

### Frontend

| Teknologi | Kegunaan |
| --- | --- |
| HTML5 | Landing, login/registrasi, portal anggota, verifikasi, CMS |
| CSS3 responsif | Stylesheet terpisah: `style.css` (portal), `admin.css` (CMS), `verify.css` (verifikasi), `nasjak.css` (landing) |
| JavaScript vanilla | Fetch API, DOM API, local storage, Fullscreen API — tanpa framework |
| PDF.js (`pdfjs-dist`) | Merender halaman PDF ke canvas |
| PageFlip (`page-flip`) | Efek membalik halaman, mode portrait/landscape, animasi flipbook |
| SVG/PNG | Logo, avatar, cover, template KTA |

Kedua pustaka frontend disajikan dari `node_modules` lewat rute vendor (`/assets/vendor/...`) sehingga tidak memerlukan CDN.

### Penyimpanan dan aset

- **PostgreSQL** — user, role, sesi, pendaftaran, konten situs, katalog e-book, hak akses, grup proyek, posting, like, komentar, greeting, identitas OAuth.
- **`assets/book/`** — PDF e-book statis; **`assets/book/uploads/`** — e-book hasil unggahan CMS (dibuat otomatis).
- **`assets/img/`** — logo, avatar, cover, template KTA (SVG).
- **`uploads/member-photos/`** — foto profil anggota.
- **`uploads/pilot-projects/`** — lampiran posting Pilot Project (privat, hanya via sesi).
- Folder `uploads/` **tidak** di-commit ke Git (ada di `.gitignore`).

## Struktur repository

```
.
├── server.js              # Express server utama: autentikasi anggota, profil, Pilot Project,
│                          #   greeting, KTA/sertifikat, upload foto, sesi, rate limiting,
│                          #   rute statis, bootstrap admin, handler error global
├── admin.js               # Modul backend admin (diekspor ke server.js): login admin,
│                          #   CRUD anggota, role, site content, e-book, reset password
├── admin.html             # Shell UI panel CMS
├── admin.css              # Gaya panel CMS
├── admin-ui.js            # Skrip browser CMS (disajikan sebagai /admin.js)
├── index.html             # Landing page
├── nasjak.css/nasjak.js   # Gaya & skrip landing page
├── script.js / style.css  # Skrip & gaya halaman login/registrasi/portal
├── member-portal.html     # Dashboard anggota: profil, KTA, sertifikat, Pilot Project, Media
├── verify.html/css/js     # Halaman verifikasi publik KTA (/verify/:id)
├── database.sql           # Skema & seed PostgreSQL (idempotent)
├── .env.example           # Template konfigurasi environment
├── .gitignore             # Abaikan node_modules, .env, uploads/, server.log
├── .htaccess              # Rewrite /admin & /anggota untuk deploy Apache/LiteSpeed
├── package.json           # Dependensi & skrip npm
├── scripts/
│   ├── reset-super-admin-password.js         # npm run admin:reset-password
│   └── configure-super-admin-reset-token.js  # npm run admin:configure-reset-token
├── assets/
│   ├── book/              # e-L-01.pdf, bcs2025.pdf + uploads/ (e-book CMS)
│   └── img/               # Logo, maskot, cover, template KTA SVG
├── admin/index.html       # Alias statis /admin (deploy shared hosting)
├── anggota/index.html     # Alias statis /anggota (deploy shared hosting)
└── uploads/               # Runtime upload (tidak di-commit)
```

Catatan penting:

- `server.js` memanggil `registerAdminRoutes()` dari `admin.js` — seluruh rute CMS dipasang di sana.
- `admin-ui.js` disajikan ke browser sebagai `/admin.js` (berbeda dari modul backend `admin.js`).
- `assets/book/uploads/` dibuat otomatis saat admin mengunggah e-book pertama.
- File PDF besar (e-book) memicu peringatan GitHub large file; pertimbangkan Git LFS atau storage eksternal untuk koleksi yang terus bertambah.
- File PDF besar (e-book) memicu peringatan GitHub large file; pertimbangkan Git LFS atau storage eksternal untuk koleksi yang terus bertambah.

## Perintah npm

| Perintah | Kegunaan |
| --- | --- |
| `npm install` | Memasang dependensi aplikasi |
| `npm start` | Menjalankan server web (default port `3000`) |
| `npm run db:setup` | Membuat database & tabel dari `database.sql` (butuh `psql` & kredensial PostgreSQL lokal) |
| `npm run admin:reset-password` | Reset password Super Admin langsung dari terminal (input tersembunyi) |
| `npm run admin:configure-reset-token` | Membuat token acak reset password Super Admin di `.env` |

## Konfigurasi environment

Salin `.env.example` menjadi `.env` lalu isi sesuai kebutuhan.

| Variabel | Wajib | Deskripsi |
| --- | --- | --- |
| `DATABASE_URL` | ✅ | Koneksi PostgreSQL, contoh: `postgresql://postgres:password@localhost:5432/idtc` |
| `PORT` | — | Port server (default `3000`) |
| `UPLOAD_DIR` | — | Folder foto anggota (default `./uploads/member-photos`) |
| `PUBLIC_BASE_URL` | ✅ untuk produksi | URL publik portal — dipakai QR KTA (`/verify/:id`) dan callback OAuth |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | — | Bootstrap akun admin pertama saat server start |
| `SUPER_ADMIN_EMAIL` | — | Email Super Admin (default `dani.hd@idtc.org`); akun akan diaktifkan & diberi role jika ada di database |
| `SUPER_ADMIN_RESET_TOKEN` | — | Token untuk endpoint reset password Super Admin (dibuat oleh `npm run admin:configure-reset-token`) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | — | OAuth Google |
| `FACEBOOK_APP_ID` / `FACEBOOK_APP_SECRET` / `FACEBOOK_GRAPH_VERSION` | — | OAuth Facebook (default graph `v26.0`) |
| `INSTAGRAM_APP_ID` / `INSTAGRAM_APP_SECRET` | — | Instagram Login (akun profesional Business/Creator) |
| `APPLE_CLIENT_ID` / `APPLE_TEAM_ID` / `APPLE_KEY_ID` / `APPLE_PRIVATE_KEY` | — | Sign in with Apple; `APPLE_CLIENT_ID` = Services ID; private key satu baris dengan `\n` |

Aturan: **jangan pernah** commit `.env`, password, client secret, atau private key ke repository.

## Menjalankan lokal

**Persyaratan:** Node.js ≥ 20 dan PostgreSQL ≥ 14.

```bash
# 1. Clone repository
git clone https://github.com/dpdh/NASJAK.git
cd NASJAK

# 2. Pasang dependensi
npm install

# 3. Siapkan environment
cp .env.example .env
# edit .env — isi DATABASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD, dll.

# 4. Buat database dan tabel
npm run db:setup

# 5. Jalankan server
npm start
```

Buka:

- `http://localhost:3000` — landing page NASUHA Jakarta
- `http://localhost:3000/anggota` — portal anggota
- `http://localhost:3000/admin` — panel CMS

Buka alamat dari server Node tersebut (bukan lewat `file://` atau server statis) agar form pendaftaran mencapai API. Cek `GET /api/health` untuk memastikan server dan database sehat.

## Struktur halaman dan akses

| Path | Halaman | Akses |
| --- | --- | --- |
| `/` | Landing page NASUHA Jakarta | Publik |
| `/anggota` | Portal anggota (profil, KTA, Pilot Project, Media) | Login anggota |
| `/admin` | Panel CMS/admin | Login admin |
| `/verify/:id` | Verifikasi KTA publik (dibuka via QR) | Publik (data minimum) |
| `/api/*` | Endpoint autentikasi, anggota, admin, konten, proyek, media | Sesuai route guard |

E-book ditampilkan di dalam halaman portal (inline flipbook), bukan membuka tab baru. Hak akses koleksi mengikuti status akun serta checklist akses yang diberikan admin. File PDF dibaca via viewer PDF.js lokal — tidak memerlukan layanan flipbook eksternal.



## Database

Skema dibuat oleh `database.sql` (`npm run db:setup`). File ini **idempotent** — memakai `CREATE TABLE IF NOT EXISTS` dan `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` sehingga aman dijalankan ulang pada database lama (cara migrasi: jalankan ulang `db:setup`).

### Tabel dan relasi

| Tabel | Fungsi |
| --- | --- |
| `users` | Akun anggota: `full_name`, `email` (unique, case-insensitive), `password_hash`, `organization`, `profession`, `member_photo_path`, `avatar_id`, `member_number` (identity unik), `must_change_password`, `white_paper_access`, `status` (`pending`/`active`/`suspended`) |
| `roles` | `super_admin`, `admin`, `membership`, `member` (Free Member) |
| `user_roles` | Penempatan role per user + `assigned_by`/`assigned_at` |
| `site_content` | Teks halaman landing/login/pendaftaran (`welcome_headline_*`, `login_*`, `register_*`) |
| `ebooks` | Katalog e-book: judul, deskripsi, file asli, nama file storage, ukuran, MIME, pembuat |
| `user_ebook_access` | Hak akses e-book per anggota (`user_id` + `ebook_id`, `granted_by`, `granted_at`) |
| `member_applications` | Impor data pendaftaran (`response_data` JSONB, fingerprint anti-duplikat) |
| `pilot_project_groups` | Grup: nama, fokus, deskripsi, `project_manager_id` |
| `pilot_project_group_members` | Keanggotaan tim per grup |
| `pilot_project_posts` | Posting: konten, `link_url`, media (filename/type/name); minimal satu dari ketiganya terisi |
| `pilot_project_post_likes` | Like per post per user |
| `pilot_project_post_comments` | Komentar (maks 1000 karakter) |
| `member_greetings` | Sapaan antar-anggota: `love`/`flower`/`crown` + pesan ≤240 karakter; pengirim ≠ penerima |
| `user_sessions` | Sesi anggota: `token_hash` (SHA-256), `expires_at`, `revoked_at` |
| `oauth_identities` | Tautan provider OAuth (google/facebook/instagram/apple) ke user |
| `oauth_states` | State/nonce OAuth (hash) dengan kedaluwarsa |

Sesi admin (`admin_sessions`) dikelola di database dengan pola hash serupa. Trigger `set_updated_at` menjaga kolom `updated_at` tetap otomatis.

### Indeks penting

- `users_email_lower_unique` — cegah duplikasi email berbeda kapitalisasi.
- `users_status_created_at_idx` — percepat daftar/filter anggota di CMS.
- `users_member_number_unique` — nomor anggota unik.
- Indeks pada `pilot_project_posts (group_id, created_at DESC)`, likes, comments, sessions, dan oauth untuk query feed & sesi yang cepat.


## Endpoint API utama

Semua endpoint JSON di bawah `/api`. Request mutasi (POST/PATCH/PUT/DELETE) wajib same-origin. Kode status umum: `400` validasi, `401` belum login, `403` role/akses kurang, `404` tidak ditemukan, `409` konflik (email duplikat), `413` file terlalu besar, `429` rate limit.

### Publik

| Method | Endpoint | Fungsi |
| --- | --- | --- |
| GET | `/api/health` | Health check server + koneksi database |
| GET | `/api/content/homepage` | Teks konten landing page dari `site_content` |
| GET | `/api/members/verify/:id` | Verifikasi KTA publik — hanya nama, nomor anggota, instansi, status, tanggal daftar (30/15 mnt) |
| POST | `/api/auth/register` | Pendaftaran anggota baru → status `pending` (8/15 mnt) |

### Anggota (cookie sesi anggota)

| Method | Endpoint | Fungsi |
| --- | --- | --- |
| POST | `/api/auth/login` | Login anggota (8/15 mnt); `remember: true` → sesi 30 hari |
| GET | `/api/auth/me` | Profil anggota yang sedang masuk |
| POST | `/api/auth/logout` | Cabut sesi aktif |
| PATCH | `/api/auth/profile` | Ubah nama, instansi, profesi, avatar |
| POST | `/api/auth/profile/photo` | Unggah foto profil (JPEG/PNG/WebP, maks 5 MB, validasi isi file) |
| DELETE | `/api/auth/profile/photo` | Hapus foto profil |
| POST | `/api/auth/change-password` | Ganti kata sandi (wajib saat `must_change_password`; cabut sesi lain) |
| POST | `/api/auth/profile/password` | Ganti kata sandi dari pengaturan profil (8/15 mnt) |
| GET | `/api/auth/white-paper` | Tautan Buku Putih — hanya bila `white_paper_access` aktif |
| GET | `/api/auth/ebooks` | Daftar e-book yang boleh diakses anggota |
| GET | `/api/auth/ebooks/:id/file` | Stream file PDF e-book (diverifikasi hak akses) |
| GET | `/api/auth/collaboration` | Ringkasan kolaborasi untuk dashboard |
| GET | `/api/auth/collaboration/greetings` | Daftar greeting terbaru |
| POST | `/api/auth/collaboration/greetings` | Kirim greeting (12/15 mnt) |

### Admin (cookie `idtc_admin_session`, sesi 8 jam)

| Method | Endpoint | Fungsi | Guard |
| --- | --- | --- | --- |
| POST | `/api/admin/login` | Login admin (5/15 mnt) | Publik |
| POST | `/api/admin/reset-password` | Reset password Super Admin via token (5/15 mnt) | Publik + token |
| GET | `/api/admin/me` | Profil/role admin aktif | Admin |
| POST | `/api/admin/logout` | Logout admin | Admin |
| GET | `/api/admin/users` | Daftar anggota + katalog e-book + ringkasan status | Admin |
| POST | `/api/admin/users` | Tambah anggota manual (multipart, foto opsional) | Admin |
| PUT | `/api/admin/users/:id` | Ubah data anggota | Admin |
| DELETE | `/api/admin/users/:id` | Hapus anggota | Admin |
| PATCH | `/api/admin/users/:id/status` | Setujui / tangguhkan / kembalikan ke pending | Admin |
| PATCH | `/api/admin/users/:id/white-paper-access` | Cabut / berikan akses Buku Putih | Admin |
| PATCH | `/api/admin/users/:id/ebook-access` | Cabut / berikan akses e-book tertentu | Admin |
| GET | `/api/admin/users/:id/photo` | Foto anggota | Admin |
| GET | `/api/admin/users/:id/qr` | QR KTA anggota | Admin |
| GET | `/api/admin/ebooks` | Katalog e-book | Super Admin / Admin |
| POST | `/api/admin/ebooks` | Unggah e-book PDF (field `ebookFile`, maks 100 MB) | Super Admin / Admin |
| GET | `/api/admin/content` | Baca teks situs | Super Admin / Admin |
| PUT | `/api/admin/content` | Ubah teks situs | Super Admin / Admin |
| GET | `/api/admin/accounts` | Daftar akun staf | Super Admin |
| PATCH | `/api/admin/accounts/:id/role` | Ubah role akun staf (menjaga ≥1 Super Admin) | Super Admin |

Guard role diterapkan melalui middleware `requireRoles()` — `requireSuperAdmin` = `super_admin` saja; `requireContentManager` = `super_admin` atau `admin`; `requireEbookReader` = anggota dengan akses e-book/Buku Putih.

## Data anggota dan autentikasi

### Pendaftaran

Form permohonan keanggotaan meminta nama lengkap, alamat email, dan kata sandi. Kata sandi minimal 8 karakter dan maksimal 72 byte, disimpan sebagai hash bcrypt (bukan teks biasa). Permohonan disimpan sebagai anggota berstatus `pending` dengan role `member` — belum bisa login sampai admin meninjau dan mengaktifkan akun. Foto profil dapat ditambahkan setelah akun aktif.

Data lengkap respons pendaftaran yang diimpor disimpan pada `member_applications.response_data` dan ditautkan ke akun dengan email valid. Respons dengan email tidak valid tetap dipertahankan sebagai arsip, tetapi tidak mendapat akun login. Pendaftaran dibatasi 8 percobaan per 15 menit; email duplikat membalas `409`.

### Sesi

- Login: `POST /api/auth/login` — hanya akun `active` yang dapat masuk.
- Sesi disimpan sebagai **hash token** di `user_sessions` (token asli hanya dikirim lewat cookie `HttpOnly`).
- Durasi: **8 jam** standar; **30 hari** bila centang **Ingat saya di perangkat ini**.
- Sesi dapat dipulihkan setelah halaman dimuat ulang; tombol **Keluar dari akun** mencabut sesi.
- Ganti kata sandi mempertahankan sesi saat ini dan mencabut sesi lainnya.

### Profil

Setelah masuk, pengguna diarahkan ke dashboard profil. **Pengaturan profil** dapat mengubah nama, instansi/komunitas, mengunggah foto profil (JPG/PNG/WEBP maks 5 MB), atau memakai salah satu dari enam avatar karakter. Foto profil juga tampil di KTA. Tombol **Gunakan avatar** menghapus foto tersimpan dan menerapkan avatar pilihan. Email tidak dapat diubah dari halaman profil.

### KTA dan sertifikat

- Anggota ber-role `member` dengan status `active` memiliki aksi **Buat KTA**.
- Sisi depan: `assets/img/sahabat-nasjak-kta-front.svg` + foto, nama, instansi, nomor anggota. Sisi belakang: `sahabat-nasjak-kta-back.svg` + nomor anggota dan QR verifikasi.
- Pilih Depan/Belakang untuk pratinjau, atau **Cetak dua sisi** (sisi terpisah pada halaman portrait). Aktifkan cetak latar belakang agar desain ikut tercetak.
- QR membuka `/verify/<id>` pada `PUBLIC_BASE_URL`; halaman verifikasi hanya menampilkan nama, nomor anggota, instansi, status, dan tanggal terdaftar — **tidak pernah** email atau password.
- Sertifikat dicetak A4 lanskap dengan ruang tanda tangan kosong untuk ditandatangani Ketua Sahabat Nasjak. Tanggal mengikuti tanggal pendaftaran.
- Setelah persetujuan, konfirmasi menampilkan pintasan cetak KTA dan sertifikat.
- Akun aktif **tanpa** role `member` tidak dapat melihat dokumen anggota.

## Panel admin dan role

Buka `http://localhost:3000/admin` dan masuk dengan akun aktif. Sesi memakai cookie `HttpOnly` + `SameSite=Strict`, token disimpan sebagai hash, kedaluwarsa 8 jam.

### Matriks role

| Kemampuan | Super Admin | Admin | Membership | member (Free Member) |
| --- | --- | --- | --- | --- |
| Kelola anggota (lihat, approve, suspend, hapus, tambah manual) | ✅ | ✅ | ✅ | ❌ |
| Kelola akses Buku Putih & e-book per anggota | ✅ | ✅ | ❌ | ❌ |
| Content Management (teks situs, katalog e-book) | ✅ | ✅ | ❌ | ❌ |
| Kelola role akun staf | ✅ | ❌ | ❌ | ❌ |
| Akses panel CMS | ✅ | ✅ | ✅ | ❌ |

- Sistem menjaga selalu ada **minimal satu Super Admin**.
- Akun staf terpisah dari daftar anggota agar tidak terhapus lewat alur kelola anggota.
- Area **Keanggotaan**: filter status, tinjau foto, tambah manual, ubah profil, setujui/tangguhkan, hapus; checklist akses Buku Putih + e-book katalog per anggota aktif.
- **Content Management**: ubah teks halaman utama dan masuk/pendaftaran; perubahan tersimpan di `site_content` dan langsung dibaca portal.

### Reset password Super Admin

**Opsi 1 — token:** jalankan `npm run admin:configure-reset-token` (token acak tersimpan di `.env` tanpa dicetak) → restart server → buka **Reset password Super Admin** di CMS → masukkan token + password baru. Endpoint membatasi percobaan, menyimpan hash, dan mencabut sesi lama. Akun `SUPER_ADMIN_EMAIL` dibuat bila belum ada.

**Opsi 2 — terminal:** dengan `DATABASE_URL` aktif, jalankan `npm run admin:reset-password` dan masukkan password langsung di terminal (input tersembunyi).

### Akun impor

## Media / ruang baca digital

Menu **Media** di portal anggota menampilkan koleksi e-book sebagai flipbook inline (PDF.js dirender ke canvas, PageFlip memberi efek membalik halaman). Tidak membuka tab baru dan tidak memerlukan layanan flipbook eksternal.

### Kemampuan pembaca

- Navigasi Sebelumnya/Berikutnya dan lompat ke nomor halaman tertentu.
- Bookmark halaman dan **lanjutkan halaman terakhir** (tersimpan lokal di browser).
- Mode layar penuh; portrait di mobile, landscape di desktop.
- Koleksi statis bawaan: `e-L-01.pdf`, `bcs2025.pdf`, plus Buku Putih NASUHA (tautan fliphtml5 bila akses diberikan).

### Mengelola e-book via CMS

1. Buka tab **Content Management** di `/admin`.
2. Isi judul dan deskripsi, pilih PDF (maks **100 MB**).
3. Tekan **Upload & Generate Flipbook**.
4. Metadata tersimpan di tabel `ebooks`; file PDF tersimpan di `assets/book/uploads/` dengan nama storage acak.
5. E-book otomatis muncul di katalog CMS dan — setelah dicentang pada checklist akses anggota — di menu Media anggota tersebut.

### Hak akses

- Anggota hanya melihat e-book yang aksesnya diberikan (tabel `user_ebook_access`) plus flag `white_paper_access` untuk Buku Putih.
- Akses dicabut/diberikan centang langsung di tabel keanggotaan CMS; perubahan langsung berlaku.
- File PDF disajikan melalui `/api/auth/ebooks/:id/file` yang memverifikasi sesi + hak akses tiap request (bukan URL publik statis).

## Pilot Project

Menu **Pilot Project** menampilkan grup beserta penggagas/admin grup, Project Manager, anggota tim, dan profesi mereka.

- Anggota aktif dapat membagikan perkembangan berupa teks, tautan web, atau satu lampiran **JPG/PNG/WEBP/PDF maksimal 10 MB**.
- Posting wajib memiliki setidaknya salah satu: konten teks, tautan, atau lampiran (dicek constraint di database).
- Lampiran disimpan **privat** di `uploads/pilot-projects` dan hanya dapat dimuat melalui sesi portal (`.../posts/:postId/media`).
- Feed mendukung like (toggle) dan komentar; pengelola grup dapat memperbarui keanggotaan tim via `PUT .../team`.
- Greeting antar-anggota (love / flower / crown, pesan ≤240 karakter) tersedia di dashboard kolaborasi.
- **Gift** belum aktif — integrasi inventaris Twini Game memerlukan API atau skema database dari sistem game.

## Login sosial

Google, Facebook, Instagram, dan Apple tersedia setelah kredensial OAuth diisi di `.env`; tombol tetap nonaktif untuk provider yang belum dikonfigurasi (dicek via `GET /api/auth/providers`).

### Callback yang harus didaftarkan

Tetapkan `PUBLIC_BASE_URL` ke alamat publik portal, daftarkan URL berikut persis di konsol developer masing-masing, lalu restart server:

- Google: `${PUBLIC_BASE_URL}/auth/google/callback`
- Facebook: `${PUBLIC_BASE_URL}/auth/facebook/callback`
- Instagram: `${PUBLIC_BASE_URL}/auth/instagram/callback`
- Apple: `${PUBLIC_BASE_URL}/auth/apple/callback`

### Kredensial

## Keamanan

### Autentikasi dan sesi

- Password di-hash **bcrypt** — tidak pernah disimpan/dikirim sebagai teks biasa.
- Token sesi hanya dikirim lewat cookie **`HttpOnly`** (+ `SameSite=Strict` untuk sesi admin); yang tersimpan di database adalah **hash SHA-256** token.
- Durasi sesi terbatas (8 jam; 30 hari bila "Ingat saya"); ganti kata sandi mencabut sesi lain.

### Rate limiting (semua jendela 15 menit)

| Endpoint | Batas |
| --- | --- |
| Registrasi, login anggota, ganti kata sandi | 8 |
| Login admin, reset password admin | 5 |
| Kirim greeting | 12 |
| Aktivitas Pilot Project (like/komentar) | 60 |
| Alur login sosial | 20 |
| Verifikasi KTA publik | 30 |

Respons `429` dengan pesan Indonesia; header `RateLimit` standar aktif.

### Header dan validasi

- **Helmet** dengan Content Policy ketat: `defaultSrc 'self'`, `scriptSrc 'self' 'wasm-unsafe-eval'` (PDF.js WASM), `frameSrc` hanya fliphtml5, `objectSrc 'none'`, `frameAncestors 'none'`, `connectSrc 'self'`.
- Body JSON dibatasi **20 kb**.
- Semua request mutasi wajib **same-origin** (`requireSameOrigin`) — mencegah CSRF sederhana.
- Upload divalidasi dengan `file-type` berdasar **isi byte** (bukan ekstensi): foto JPEG/PNG/WebP maks 5 MB; lampiran proyek +10 jenis maks 10 MB; e-book PDF maks 100 MB.
- Lampiran Pilot Project dan foto anggota disajikan privat melalui rute bersesi, bukan folder statis publik.

### Data dan akses

- Endpoint verifikasi publik hanya mengembalikan data minimum; email dan password tidak pernah disertakan.
- Hak akses e-book/Buku Putih diperiksa per anggota (`white_paper_access`, `user_ebook_access`) sebelum file disajikan.
- Pembatasan berbasis role (Super Admin/Admin/Membership) dengan jaminan minimal satu Super Admin.
- Query database memakai **parameterized query** (`pg`) — tidak ada string SQL mentah dari input pengguna.

## Deployment

### Node.js (rekomendasi)

1. Push `main` ke repository produksi.
2. Di server: `git pull`, `npm ci`, siapkan `.env` (terutama `DATABASE_URL` dan `PUBLIC_BASE_URL`), `npm run db:setup`.
3. Jalankan dengan proses manager (systemd/PM2) dan reverse proxy (Nginx/Apache) ke port `PORT`.
4. Pastikan folder `uploads/` dan `assets/book/uploads/` dapat ditulis proses Node dan **masuk backup** (tidak ada di Git).

### Shared hosting (Apache/LiteSpeed)

- `.htaccess` me-rewrite `/admin` → `admin.html` dan `/anggota` → `member-portal.html`; folder `admin/` dan `anggota/` menyediakan `index.html` fallback statis.
- Catatan: fitur penuh (API, sesi, upload) tetap membutuhkan Node.js berjalan — `.htaccess` hanya melayani halaman statis.

### Checklist produksi

- [ ] `PUBLIC_BASE_URL` = domain publik (QR KTA & callback OAuth benar).
- [ ] PostgreSQL dengan backup terjadwal; jalankan ulang `database.sql` untuk migrasi idempotent.
- [ ] `.env` tidak dapat diakses publik; secret cukup di environment.
- [ ] HTTPS aktif di depan Express (wajib untuk cookie `Secure` di produksi).
- [ ] `GET /api/health` dipantau uptime.

## Troubleshooting

| Gejala | Penyebab / solusi |
| --- | --- |
| Server tidak menyambung database | PostgreSQL mati atau `DATABASE_URL` salah — cek `GET /api/health` |
| E-book tidak muncul di portal | Akun bukan `active`, atau akses belum dicentang di CMS; pastikan PDF berhasil diunggah |
| Upload gagal `413` | Melebihi batas: foto 5 MB, lampiran 10 MB, e-book 100 MB |
| Login selalu `429` | Rate limiting 15 menit — tunggu atau atur proxy IP bila di belakang reverse proxy |
| QR KTA membuka URL salah | `PUBLIC_BASE_URL` belum diset ke domain publik |
| Tombol login sosial nonaktif | Kredensial provider belum diisi / server belum di-restart |
| `fatal: refusing to merge unrelated histories` | Riwayat remote tidak terhubung lokal — `git pull --allow-unrelated-histories` atau `git push --force` bila yakin menimpa |
| Push ditolak `non-fast-forward` | Remote lebih baru — `git pull` lalu selesaikan konflik; `--force` hanya bila yakin |
| `node_modules`/`.env` mau ter-commit | Sudah di `.gitignore` — jangan nonaktifkan |
| Peringatan GitHub large file | PDF e-book besar — pertimbangkan Git LFS atau storage eksternal |

## Repository Git

- **Remote produksi:** `https://github.com/dpdh/NASJAK.git` — branch `main`.
- **Alur kerja:** kembangkan di lokal → commit deskriptif → `git pull` bila remote berubah → push ke `main`.
- **`--force`** hanya dipakai bila yakin menimpa remote (riwayat lama remote hilang; simpan branch backup bila perlu).
- Jangan commit: `node_modules/`, `.env`, `uploads/`, `server.log` (sudah diabaikan `.gitignore`).

---

*Dokumen ini mengikuti kode pada branch `main`. Bila menambah fitur/endpoint baru, perbarui bagian terkait agar dokumentasi tetap akurat.*


Buat aplikasi OAuth di [Google Cloud Console](https://console.cloud.google.com/apis/credentials), [Meta for Developers](https://developers.facebook.com/apps/), dan [Apple Developer](https://developer.apple.com/account/resources/identifiers/list). Untuk Instagram, aktifkan produk **Instagram API** dan **Business Login** (hanya mendukung akun profesional Business/Creator). Isi variabel yang sesuai di `.env`:

- Google: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- Facebook: `FACEBOOK_APP_ID`, `FACEBOOK_APP_SECRET`, `FACEBOOK_GRAPH_VERSION` (default `v26.0`)
- Instagram: `INSTAGRAM_APP_ID`, `INSTAGRAM_APP_SECRET`
- Apple: `APPLE_CLIENT_ID` (**Services ID** untuk Sign in with Apple), `APPLE_TEAM_ID`, `APPLE_KEY_ID`, `APPLE_PRIVATE_KEY` (satu baris; newline ditulis `\n`)

### Perilaku

Pengguna harus masuk ke akun Sahabat Nasjak yang sudah ada dengan email/password terlebih dahulu, lalu **menautkan** provider dari bagian **Login dengan akun sosial** di profil. Setelah ditautkan, tombol provider dapat dipakai untuk login. Login sosial **tidak** membuat akun baru dan **tidak** mengaktifkan akun pending/suspended. Simpan semua client secret dan private key hanya di `.env`.


Anggota hasil impor dengan `users.must_change_password = true` akan melihat dialog wajib ganti kata sandi saat login/pemulihan sesi. Kata sandi baru minimal 12 karakter + konfirmasi; setelah berhasil anggota langsung masuk ke profil. Admin mengatur flag ini lewat kolom `users.must_change_password`; mengganti kata sandi lewat CMS tidak otomatis mengubah flag tersebut.


| GET | `/api/auth/pilot-project-groups` | Daftar grup + tim |
| PUT | `/api/auth/pilot-project-groups/:groupId/team` | Perbarui keanggotaan tim (pengelola grup) |
| GET | `/api/auth/pilot-project-groups/:groupId/posts` | Feed posting grup |
| GET | `.../posts/:postId/media` | Muat lampiran posting (privat) |
| POST / DELETE | `.../posts/:postId/like` | Suka / batal suka (60/15 mnt) |
| POST | `.../posts/:postId/comments` | Komentar (60/15 mnt) |
| GET | `/api/auth/membership-documents` | Dokumen KTA & sertifikat |
| GET | `/api/auth/photo` | Foto profil sesi berjalan |
| GET | `/api/auth/providers` | Status konfigurasi provider OAuth |
| GET | `/auth/:provider` + `/callback` | Alur OAuth (20/15 mnt) |

