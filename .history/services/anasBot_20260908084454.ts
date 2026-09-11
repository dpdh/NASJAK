interface KnowledgeEntry {
  keywords: string[];
  topic: string;
  response: string;
}

const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  { keywords: ['landasan agama riba', 'riba dan keadilan', 'pokok harta', 'jangan zalim', 'jangan menzalimi', 'literasi riba', 'al baqarah 279', 'al baqarah 280'], topic: 'Literasi: Riba & Keadilan', response: `**Literasi ANAS: Riba, Utang, dan Keadilan**\n\nDalam konteks utang, riba adalah tambahan yang disyaratkan atas pokok pinjaman karena faktor waktu. Namun tidak semua keuntungan dalam transaksi otomatis riba; akad, objek, risiko, dan sumber keuntungan perlu dilihat secara utuh.\n\n**Landasan penting:**\n- QS. Al-Baqarah 2:275: Allah menghalalkan jual beli dan mengharamkan riba.\n- QS. Al-Baqarah 2:278-279: tinggalkan sisa riba dan kembalikan pokok harta; jangan menzalimi dan jangan dizalimi.\n- QS. Al-Baqarah 2:280: orang yang benar-benar kesulitan diberi tenggang sampai lapang.\n- Hadis: penundaan pembayaran oleh orang yang mampu adalah kezaliman.\n\n**Prinsip NASUHA:** kreditur berhak mendapatkan haknya, debitur wajib bertanggung jawab, dan prosesnya harus transparan, manusiawi, tanpa penghinaan atau intimidasi. Materi ini adalah edukasi, bukan pengganti fatwa atau nasihat hukum untuk kasus individual.` },
  { keywords: ['negosiasi utang', 'negosiasi bank', 'restrukturisasi utang', 'surat bank', 'surat negosiasi', 'settlement', 'rentenir', 'pinjol legal'], topic: 'Literasi: Negosiasi Utang', response: `**Literasi ANAS: Negosiasi Utang yang Bertanggung Jawab**\n\nTujuan negosiasi bukan lari dari kewajiban, tetapi menemukan pembayaran yang realistis dan dapat dijalankan.\n\n**Urutan praktis:**\n1. Hentikan gali lubang tutup lubang dan jangan menambah pinjaman baru.\n2. Catat kreditur, pokok yang diterima, biaya/imbalan, denda, yang sudah dibayar, sisa, dan jatuh tempo.\n3. Lindungi kebutuhan pokok, tempat tinggal, kesehatan, dan alat kerja terlebih dahulu.\n4. Hubungi kanal resmi kreditur. Minta rincian tertulis serta opsi restrukturisasi, rescheduling, atau settlement.\n5. Ajukan angka yang benar-benar mampu dibayar, misalnya Rp1.500.000 per bulan mulai tanggal tertentu.\n6. Minta semua kesepakatan dikonfirmasi melalui kanal resmi dan simpan bukti komunikasi serta pembayaran.\n\n**Template singkat:**\nSaya ingin menyelesaikan kewajiban ini. Kondisi keuangan saya saat ini membuat saya belum mampu membayar sesuai jadwal. Mohon rincian pokok, biaya, denda, saldo terakhir, dan opsi restrukturisasi/settlement. Kemampuan saya saat ini Rp[xxx] per bulan mulai [tanggal].\n\nUntuk ancaman, pemerasan, atau penyebaran data pribadi, simpan bukti dan gunakan kanal pengaduan atau penegakan hukum yang relevan.` },
  { keywords: ['doa lunas utang', 'doa keluar riba', 'doa rezeki halal', 'doa debt recovery', 'rutinitas doa utang', 'doa lengkap utang'], topic: 'Literasi: Doa & Pemulihan', response: `**Literasi ANAS: Doa dan Pemulihan Utang**\n\n**Doa utama:**\nاللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ، وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ\n\n“Ya Allah, cukupilah aku dengan yang halal sehingga aku tidak membutuhkan yang haram, dan cukupilah aku dengan karunia-Mu sehingga aku tidak membutuhkan selain-Mu.”\n\n**Doa ketika terbebani utang:**\nاللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ، وَأَعُوذُ بِكَ مِنَ الْجُبْنِ وَالْبُخْلِ، وَأَعُوذُ بِكَ مِنْ غَلَبَةِ الدَّيْنِ وَقَهْرِ الرِّجَالِ\n\nTambahkan istighfar, “Rabbi inni lima anzalta ilayya min khairin faqir”, dan doa dengan bahasa sendiri. Doa tidak menjadi jaminan tanggal pelunasan; ia berjalan bersama taubat, ikhtiar, disiplin, negosiasi, dan pembayaran.\n\n**Rutinitas:** setelah Subuh tetapkan satu tindakan pemasukan; sebelum bekerja baca doa Nabi Musa dan kerjakan langkah nyata; setelah Isya evaluasi pemasukan, pengeluaran, pembayaran, dan komunikasi.` },
  { keywords: ['recovery journey', 'perjalanan bebas utang', 'payment plan', 'rencana pembayaran', 'debt map', 'peta utang', 'snowball', 'avalanche'], topic: 'Literasi: Recovery Journey', response: `**Literasi ANAS: Debt Recovery Journey**\n\nDoa perlu berjalan bersama tindakan nyata:\n\n**Doa → taubat → cari penghasilan halal → kurangi pengeluaran → hentikan utang baru → petakan utang → negosiasi → susun payment plan → bayar konsisten → bangun dana darurat.**\n\nMulai dengan **Debt Map**: daftar kreditur, pokok, tambahan, jatuh tempo, status legalitas, dan kemampuan bayar. Setelah kebutuhan hidup aman, pilih **snowball** untuk utang terkecil atau **avalanche** untuk biaya tambahan tertinggi.\n\nAlat kerja tidak selalu harus dijual jika menghasilkan pendapatan. Ukur apakah keputusan itu membantu kemampuan bayar atau justru menghilangkan sumber penghasilan. Target NASUHA bukan sekadar bebas utang, tetapi bebas utang dengan cara halal, menjaga martabat, memenuhi hak pihak lain, dan tidak mengulang pola yang sama.` },
  // ─── RIBA ───
  {
    keywords: ['riba', 'bunga', 'interest', 'haram', 'bunga bank'],
    topic: 'Hukum Riba',
    response: `Riba hukumnya HARAM secara tegas dalam Al-Quran dan Hadis.

📖 **Dalil Al-Quran:**
"Allah menghalalkan jual beli dan mengharamkan riba." (QS. Al-Baqarah: 275)

"Hai orang-orang yang beriman, bertakwalah kepada Allah dan tinggalkan sisa riba jika kamu orang-orang yang beriman." (QS. Al-Baqarah: 278)

📖 **Dalil Hadis:**
Rasulullah SAW melaknat pemakan riba, pemberi riba, pencatat, dan kedua saksinya. Beliau bersabda: "Mereka semua sama (dosanya)." (HR. Muslim)

💡 **Mengapa riba diharamkan?**
1. Riba menzalimi pihak yang lemah
2. Riba membuat harta beredar di kalangan orang kaya saja
3. Riba menghancurkan keberkahan harta
4. Riba merusak sistem ekonomi yang adil

Jika Anda masih terlibat riba, jangan putus asa. Allah Maha Pengampun. Langkah pertama adalah niat tulus untuk meninggalkannya.`,
  },
  {
    keywords: ['jenis riba', 'macam riba', 'riba fadhl', 'riba nasiah', 'tipe riba'],
    topic: 'Jenis-jenis Riba',
    response: `Ada beberapa jenis riba yang perlu diketahui:

**1. Riba Nasiah (Riba Jahiliyah)**
Tambahan yang disyaratkan atas pinjaman karena penundaan waktu. Ini yang paling umum terjadi di perbankan konvensional — pinjam 100 juta, bayar 130 juta karena bunga.

**2. Riba Fadhl**
Pertukaran barang sejenis dengan jumlah berbeda. Contoh: tukar 1kg emas dengan 1.1kg emas.

**3. Riba Qardh**
Manfaat atau tingkat kelebihan tertentu yang disyaratkan terhadap yang berutang. Contoh: meminjamkan uang dengan syarat dikembalikan lebih.

**4. Riba dalam Perbankan Modern:**
- Bunga kredit / KPR konvensional
- Bunga kartu kredit
- Bunga deposito (sebagai pemberi)
- Pinjaman online (pinjol) dengan bunga

💡 **Semua bentuk bunga bank adalah riba**, baik kecil maupun besar, baik untuk konsumsi maupun produktif.`,
  },
  // ─── PENYELESAIAN UTANG ───
  {
    keywords: ['lunasi', 'lunas', 'bayar utang', 'hutang', 'utang', 'pelunasan', 'bebas utang', 'cara lunas'],
    topic: 'Cara Menyelesaikan Utang Riba',
    response: `**Langkah-langkah Menyelesaikan Utang Riba:**

**1. Niat dan Taubat**
Niatkan untuk meninggalkan riba. Allah berfirman: "Jika kamu bertaubat, maka bagimu pokok hartamu." (QS. Al-Baqarah: 279)

**2. Inventarisasi Utang**
- Catat SEMUA utang riba yang ada (bank, kartu kredit, pinjol)
- Hitung total pokok pinjaman
- Hitung total bunga yang masih berjalan

**3. Prioritaskan Pelunasan**
- Lunasi utang dengan bunga tertinggi terlebih dahulu
- Atau yang paling kecil dulu (snowball method) untuk motivasi

**4. Strategi Pelunasan:**
- Negosiasi dengan bank untuk pelunasan dipercepat
- Minta keringanan/diskon pelunasan
- Alokasikan minimal 30% penghasilan untuk cicilan
- Kurangi pengeluaran tidak penting

**5. Bergabung Program LBU NASUHA**
Program Langkah Bebas Utang membantu pelunasan secara kolektif dan terstruktur.

**6. Jangan Tambah Utang Baru**
Tutup semua kartu kredit dan hindari pinjaman konvensional baru.

💡 Ingat: "Sesungguhnya sesudah kesulitan itu ada kemudahan." (QS. Al-Insyirah: 6)`,
  },
  {
    keywords: ['lbu', 'langkah bebas utang', 'program lbu', 'ikut lbu'],
    topic: 'Program LBU NASUHA',
    response: `**Program LBU (Langkah Bebas Utang) NASUHA**

LBU adalah program unggulan NASUHA untuk membantu anggota melunasi hutang riba secara kolektif.

**Tahapan LBU:**
1. 📝 Daftar sebagai peserta LBU
2. 🔍 Verifikasi data hutang riba
3. 📚 Ikuti kajian dan pembinaan anti-riba
4. 💰 Proses pelunasan bersama
5. 🎉 Deklarasi bebas riba!

**Statistik:**
- Sudah 37 batch LBU
- 12.500+ peserta
- 94% tingkat keberhasilan
- Rp 85 miliar+ total hutang terlunaskan

**Cara Ikut:**
1. Hubungi pengurus NASUHA Jakarta
2. Daftar melalui event TSN terdekat
3. Atau melalui menu Event di aplikasi NASJAK

💡 Anda tidak sendirian. Bersama NASUHA, bebas utang itu mungkin!`,
  },
  // ─── MEDIASI BANK ───
  {
    keywords: ['mediasi', 'negosiasi', 'bank', 'nego bank', 'mediasi bank', 'cara mediasi'],
    topic: 'Cara Mediasi dengan Bank',
    response: `**Panduan Mediasi dengan Bank untuk Pelunasan Utang Riba:**

**Persiapan Sebelum Mediasi:**
1. Kumpulkan semua dokumen (perjanjian kredit, bukti pembayaran, rekening koran)
2. Hitung total yang sudah dibayar vs pokok pinjaman
3. Siapkan kemampuan bayar yang realistis
4. Catat nomor pengaduan OJK: 157

**Langkah Mediasi:**

**Tahap 1: Hubungi CS Bank**
- Sampaikan niat pelunasan dipercepat
- Minta informasi sisa pokok dan total kewajiban
- Tanyakan apakah ada program restrukturisasi

**Tahap 2: Ajukan Keringanan**
- Minta diskon bunga/penalti untuk pelunasan sekaligus
- Biasanya bank bisa memberi keringanan 10-30% dari total bunga
- Sampaikan kondisi keuangan dengan jujur

**Tahap 3: Jika Ditolak**
- Ajukan mediasi melalui OJK (Otoritas Jasa Keuangan)
- Atau melalui LAPS (Lembaga Alternatif Penyelesaian Sengketa)
- Hak Anda dilindungi UU No. 21 Tahun 2011 tentang OJK

**Tips Penting:**
- Selalu bersikap sopan dan kooperatif
- Dokumentasikan setiap komunikasi
- Jangan menghindar dari bank — hadapi dengan baik
- Minta semua kesepakatan secara TERTULIS

💡 Bank lebih memilih Anda bayar daripada macet. Manfaatkan posisi ini.`,
  },
  {
    keywords: ['surat', 'syurat', 'bersurat', 'surat bank', 'surat pelunasan', 'surat permohonan'],
    topic: 'Cara Bersurat dengan Bank',
    response: `**Panduan Membuat Surat ke Bank:**

**1. Surat Permohonan Pelunasan Dipercepat:**

Kepada Yth. Pimpinan [Nama Bank]
Perihal: Permohonan Pelunasan Dipercepat

Dengan hormat,
Saya yang bertanda tangan di bawah ini:
Nama: [Nama Lengkap]
No. Rekening/Pinjaman: [Nomor]

Dengan ini mengajukan permohonan pelunasan dipercepat atas fasilitas kredit saya. Saya bermaksud melunasi sisa pokok pinjaman dan memohon keringanan atas bunga/denda yang berjalan.

Besar harapan saya agar permohonan ini dapat dipertimbangkan.

Hormat saya,
[Nama & Tanda Tangan]

**2. Surat Permohonan Restrukturisasi:**
- Sertakan alasan (penurunan penghasilan, dll)
- Lampirkan slip gaji / bukti penghasilan terkini
- Ajukan skema cicilan yang mampu Anda bayar

**3. Surat Pengaduan ke OJK:**
- Kirim ke: konsumen@ojk.go.id
- Atau hubungi 157
- Sertakan kronologi dan bukti

**Tips:**
- Gunakan bahasa formal dan sopan
- Kirim via pos tercatat (ada bukti kirim)
- Simpan salinan semua surat
- Follow up dalam 14 hari kerja`,
  },
  // ─── FUNDAMENTAL AQIDAH ───
  {
    keywords: ['aqidah', 'tauhid', 'iman', 'keyakinan', 'rukun iman', 'pilar iman'],
    topic: 'Fundamental Aqidah',
    response: `**Fundamental Aqidah Islam:**

Aqidah adalah fondasi keimanan seorang muslim. Tanpa aqidah yang benar, seluruh amal ibadah tidak memiliki landasan.

**6 Rukun Iman:**
1. ☝️ **Iman kepada Allah** — Mengesakan Allah dalam rububiyah, uluhiyah, dan asma wa sifat
2. 👼 **Iman kepada Malaikat** — Makhluk Allah yang selalu taat
3. 📖 **Iman kepada Kitab-kitab** — Al-Quran sebagai kitab terakhir
4. 👤 **Iman kepada Rasul** — Muhammad SAW sebagai penutup para nabi
5. ⏰ **Iman kepada Hari Akhir** — Kehidupan setelah kematian
6. 📋 **Iman kepada Qadha dan Qadar** — Takdir baik dan buruk

**Hubungan Aqidah dengan Anti-Riba:**
Ketika aqidah kuat, kita yakin bahwa:
- Rezeki sudah diatur Allah, tidak perlu riba
- Ada pertanggungjawaban di akhirat atas harta
- Keberkahan lebih berharga dari keuntungan duniawi

"Dan barangsiapa bertakwa kepada Allah niscaya Dia akan memberikan jalan keluar baginya, dan memberinya rezeki dari arah yang tidak disangka-sangkanya." (QS. At-Talaq: 2-3)`,
  },
  {
    keywords: ['tawakkal', 'pasrah', 'tawakal', 'serahkan'],
    topic: 'Tawakkal kepada Allah',
    response: `**Tawakkal — Menyerahkan Hasil kepada Allah**

Tawakkal bukan pasrah tanpa usaha. Tawakkal adalah:
1. Berusaha sebaik mungkin (ikhtiar)
2. Berdoa dengan sungguh-sungguh
3. Menyerahkan hasil kepada Allah
4. Ridha dengan keputusan Allah

Rasulullah SAW bersabda: "Ikatlah untamu, kemudian bertawakkallah kepada Allah." (HR. Tirmidzi)

**Dalam konteks keuangan:**
- Berusaha mencari nafkah halal ✅
- Menghindari riba ✅
- Bersedekah meski sedikit ✅
- Yakin Allah yang mencukupkan ✅

"Seandainya kalian bertawakkal kepada Allah dengan sebenar-benarnya tawakkal, niscaya Allah akan memberi kalian rezeki sebagaimana Dia memberi rezeki kepada burung. Burung itu berangkat pagi dalam keadaan lapar dan pulang sore dalam keadaan kenyang." (HR. Tirmidzi)`,
  },
  // ─── KEUANGAN SYARIAH ───
  {
    keywords: ['syariah', 'bank syariah', 'keuangan syariah', 'halal', 'akad', 'murabahah', 'mudharabah'],
    topic: 'Keuangan Syariah',
    response: `**Dasar-dasar Keuangan Syariah:**

**Prinsip Utama:**
1. Tidak ada riba (bunga)
2. Tidak ada gharar (ketidakjelasan)
3. Tidak ada maysir (judi/spekulasi)
4. Transaksi berdasarkan akad yang jelas

**Akad-akad Syariah:**
- **Murabahah** — jual beli dengan margin yang disepakati
- **Mudharabah** — bagi hasil (satu modal, satu kerja)
- **Musyarakah** — kerjasama patungan modal
- **Ijarah** — sewa menyewa
- **Wakalah** — perwakilan/agen

**Alternatif Produk Syariah:**
- KPR Syariah (akad murabahah/musyarakah mutanaqishah)
- Tabungan Syariah (wadiah/mudharabah)
- Pembiayaan usaha syariah
- Asuransi syariah (takaful)

**Bank Syariah di Indonesia:**
BSI, Bank Muamalat, BCA Syariah, BRI Syariah, dll.

💡 Migrasi ke bank syariah adalah langkah konkret meninggalkan riba.`,
  },
  // ─── PINJOL / KARTU KREDIT ───
  {
    keywords: ['pinjol', 'pinjaman online', 'kartu kredit', 'kredit', 'kpr', 'cicilan'],
    topic: 'Pinjaman Online & Kartu Kredit',
    response: `**Hukum Pinjol dan Kartu Kredit dalam Islam:**

Pinjaman online (pinjol) dan kartu kredit konvensional mengandung riba karena ada bunga yang dikenakan.

**Bahaya Pinjol:**
- Bunga sangat tinggi (bisa 100%+ per tahun)
- Penagihan yang tidak manusiawi
- Data pribadi bisa disalahgunakan
- Jeratan utang yang sulit keluar

**Langkah Keluar dari Pinjol:**
1. STOP pinjam baru — ini yang paling penting
2. Catat semua pinjol yang aktif
3. Prioritaskan yang bunga tertinggi
4. Hubungi pinjol legal untuk restrukturisasi
5. Laporkan pinjol ilegal ke OJK: 157
6. Jika diintimidasi, laporkan ke polisi

**Alternatif Halal:**
- Pinjaman qardh hasan (tanpa bunga) dari keluarga/komunitas
- Pembiayaan syariah dari bank/BMT
- Koperasi syariah
- Program LBU NASUHA

💡 Tidak ada masalah yang tidak bisa diselesaikan dengan sabar dan ikhtiar.`,
  },
  // ─── DOA ───
  {
    keywords: ['doa', 'doa utang', 'doa rezeki', 'doa lunas', 'dzikir'],
    topic: 'Doa Pelunasan Utang',
    response: `**Doa-doa untuk Pelunasan Utang:**

**1. Doa Nabi SAW saat Terlilit Utang:**
اللَّهُمَّ اكْفِنِي بِحَلاَلِكَ عَنْ حَرَامِكَ وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ

"Ya Allah, cukupkanlah aku dengan rezeki yang halal sehingga aku tidak memerlukan yang haram, dan kayakanlah aku dengan karunia-Mu sehingga aku tidak memerlukan selain Engkau." (HR. Tirmidzi)

**2. Doa Pelunasan Utang:**
اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحُزْنِ وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ وَأَعُوذُ بِكَ مِنَ الْجُبْنِ وَالْبُخْلِ وَأَعُوذُ بِكَ مِنْ غَلَبَةِ الدَّيْنِ وَقَهْرِ الرِّجَالِ

"Ya Allah, aku berlindung kepada-Mu dari kegelisahan dan kesedihan, dari kelemahan dan kemalasan, dari sifat pengecut dan kikir, dan dari lilitan utang serta dominasi orang." (HR. Bukhari)

**3. Istighfar**
Perbanyak istighfar — "Barangsiapa memperbanyak istighfar, Allah akan memberikan jalan keluar dari setiap kesempitan dan rezeki dari arah yang tidak disangka." (HR. Abu Dawud)

💡 Baca doa-doa ini setelah shalat 5 waktu dan shalat tahajud.`,
  },
  // ─── DEFAULT / GREETING ───
  {
    keywords: ['halo', 'hai', 'assalamu', 'salam', 'apa kabar', 'siapa', 'kamu siapa', 'anas'],
    topic: 'Salam',
    response: `Wa'alaikumussalam warahmatullahi wabarakatuh!

Saya **Anas**, asisten virtual NASUHA. Saya siap membantu Anda dengan pertanyaan seputar:

**Keuangan & Anti-Riba:**
- Hukum Riba & dalilnya
- Penyelesaian Utang & program LBU
- Mediasi & negosiasi dengan Bank
- Keuangan Syariah & alternatif halal
- Pinjaman Online & Kartu Kredit

**Ilmu Agama:**
- Fiqih Muamalah (jual beli, akad, zakat)
- Fiqih Ibadah (shalat, puasa, haji, zakat)
- Ilmu Al-Quran & Hadis
- Fundamental Aqidah & Tauhid

**Pengembangan Diri:**
- Penguatan Mental & Spiritual
- Perbaikan Diri dalam Ibadah
- Doa-doa dari Rasulullah SAW

Silakan tanyakan apa saja! Ketik pertanyaan Anda di bawah.`,
  },
  // ─── FIQIH MUAMALAH ───
  {
    keywords: ['fiqih muamalah', 'muamalah', 'jual beli', 'akad jual beli', 'hukum jual beli', 'transaksi', 'bisnis syariah', 'zakat mal', 'zakat', 'infaq', 'sedekah', 'wakaf'],
    topic: 'Fiqih Muamalah',
    response: `**Fiqih Muamalah — Hukum Transaksi dalam Islam**

Muamalah adalah aturan Islam yang mengatur hubungan antar manusia dalam hal harta dan ekonomi.

**Prinsip Dasar Muamalah:**
1. Halal — tidak mengandung unsur haram
2. Saling ridha — kedua pihak rela
3. Jelas — tidak ada gharar (ketidakjelasan)
4. Adil — tidak ada kezaliman
5. Jujur — tidak ada penipuan

**Akad-akad dalam Muamalah:**

**Jual Beli (Bai'):**
- Murabahah — jual beli dengan margin disepakati
- Salam — pesan barang bayar di muka
- Istishna — pesan pembuatan barang

**Kerja Sama:**
- Mudharabah — bagi hasil (satu modal, satu kerja)
- Musyarakah — patungan modal bersama

**Sewa & Jasa:**
- Ijarah — sewa menyewa
- Ju'alah — upah atas jasa

**Sosial:**
- Qardh — pinjaman tanpa bunga
- Wadi'ah — titipan
- Hibah — pemberian sukarela
- Wakaf — penyerahan harta untuk kepentingan umum

**Zakat Mal:**
- Wajib jika harta mencapai nishab (setara 85 gram emas)
- Kadar: 2.5% dari total harta
- Ditunaikan setahun sekali
- Disalurkan ke 8 asnaf

"Hai orang-orang yang beriman, janganlah kamu saling memakan harta sesamamu dengan jalan yang batil, kecuali dengan jalan perniagaan yang berlaku dengan suka sama suka di antara kamu." (QS. An-Nisa: 29)`,
  },
  // ─── FIQIH IBADAH ───
  {
    keywords: ['fiqih ibadah', 'ibadah', 'shalat', 'solat', 'puasa', 'shaum', 'haji', 'umrah', 'wudhu', 'tayammum', 'thaharah', 'rukun islam', 'syarat shalat', 'rukun shalat', 'sunnah shalat'],
    topic: 'Fiqih Ibadah',
    response: `**Fiqih Ibadah — Panduan Ibadah dalam Islam**

**5 Rukun Islam:**
1. Syahadat — kesaksian keesaan Allah dan kerasulan Muhammad
2. Shalat — 5 waktu sehari semalam
3. Zakat — pembersihan harta
4. Puasa Ramadhan — menahan diri dari subuh hingga maghrib
5. Haji — bagi yang mampu

**Thaharah (Bersuci):**
- Wudhu: syarat sah shalat, membersihkan hadats kecil
- Mandi wajib: membersihkan hadats besar (junub, haidh, nifas)
- Tayammum: pengganti wudhu/mandi saat tidak ada air

**Shalat:**
Rukun Shalat: niat, takbiratul ihram, berdiri bagi yang mampu, membaca Al-Fatihah, rukuk, i'tidal, sujud, duduk antara dua sujud, tasyahhud akhir, shalawat, salam.

Shalat Wajib: Subuh (2), Dzuhur (4), Ashar (4), Maghrib (3), Isya (4)

Shalat Sunnah yang Dianjurkan:
- Rawatib (sebelum/sesudah shalat wajib)
- Dhuha (waktu pagi)
- Tahajud (sepertiga malam terakhir)
- Witir (setelah Isya)

**Puasa:**
- Wajib: Ramadhan, nadzar, kafarat
- Sunnah: Senin-Kamis, Ayyamul Bidh (13-14-15 setiap bulan), Arafah, Asyura

**Zakat:**
- Fitrah: wajib sebelum Idul Fitri
- Mal: 2.5% dari harta yang mencapai nishab

"Sesungguhnya shalat itu mencegah dari perbuatan keji dan mungkar." (QS. Al-Ankabut: 45)`,
  },
  // ─── ILMU AL-QURAN & HADIS ───
  {
    keywords: ['quran', 'alquran', 'al-quran', 'hadis', 'hadist', 'hadits', 'sunnah', 'ilmu quran', 'ulumul quran', 'ilmu hadis', 'musthola hadis', 'tafsir', 'asbabun nuzul', 'shahih', 'dhaif'],
    topic: 'Ilmu Al-Quran & Hadis',
    response: `**Ilmu Al-Quran & Hadis**

**Al-Quran:**
- 114 surah, 6.236 ayat, 30 juz
- Diturunkan selama 23 tahun (13 tahun di Makkah, 10 tahun di Madinah)
- Surah Makkiyah: fokus pada aqidah & tauhid
- Surah Madaniyah: fokus pada hukum & muamalah

**Keutamaan Membaca Al-Quran:**
- Setiap huruf mendapat 10 kebaikan (HR. Tirmidzi)
- Al-Quran akan memberi syafaat di hari kiamat (HR. Muslim)
- Pembaca Al-Quran bersama malaikat yang mulia (HR. Bukhari Muslim)
- Rumah yang dibacakan Al-Quran dihadiri malaikat

**Tips Istiqomah Membaca:**
1. Tentukan waktu tetap setiap hari (setelah Subuh/Maghrib)
2. Mulai dari sedikit tapi konsisten (1 halaman/hari)
3. Pahami artinya, bukan sekadar membaca
4. Ikut program tahsin/tahfidz

**Hadis:**
Sabda, perbuatan, dan ketetapan Nabi Muhammad SAW.

**Kitab Hadis Utama:**
1. Shahih Bukhari — 7.563 hadis
2. Shahih Muslim — 5.362 hadis
3. Sunan Abu Dawud
4. Sunan Tirmidzi
5. Sunan An-Nasa'i
6. Sunan Ibnu Majah

**Tingkatan Hadis:**
- Shahih — valid, bisa dijadikan hujjah
- Hasan — baik, bisa dijadikan hujjah
- Dha'if — lemah, tidak bisa dijadikan hujjah hukum
- Maudhu' — palsu, haram diriwayatkan

"Sebaik-baik kalian adalah yang belajar Al-Quran dan mengajarkannya." (HR. Bukhari)`,
  },
  // ─── PENGUATAN MENTAL ───
  {
    keywords: ['mental', 'depresi', 'stres', 'stress', 'cemas', 'anxiety', 'takut', 'galau', 'sedih', 'putus asa', 'menyerah', 'lelah', 'burnout', 'kuat mental', 'penguatan mental', 'kesehatan jiwa', 'psikologi'],
    topic: 'Penguatan Mental & Spiritual',
    response: `**Penguatan Mental dari Perspektif Islam**

**Prinsip Dasar:**
Allah berfirman: "Ingatlah, hanya dengan mengingat Allah hati menjadi tenteram." (QS. Ar-Ra'd: 28)

**Ketika Merasa Lemah & Lelah:**
1. Aku mungkin sedang lelah, tetapi aku tidak sedang kalah
2. Allah mengetahui perjuangan yang tidak diketahui manusia
3. Kesulitan tidak selalu datang untuk menghancurkan; terkadang ia datang untuk mendewasakan
4. Aku boleh menangis, tetapi aku tidak akan menyerah

**Langkah Praktis Penguatan Mental:**

**1. Shalat & Dzikir**
Shalat adalah terapi jiwa. Sujud adalah posisi paling dekat dengan Allah. Perbanyak dzikir saat hati gelisah.

**2. Baca Al-Quran**
Al-Quran adalah obat hati. "Kami turunkan Al-Quran sebagai penawar dan rahmat." (QS. Al-Isra: 82)

**3. Istighfar**
Perbanyak istighfar — membuka pintu rezeki dan jalan keluar dari kesempitan.

**4. Komunitas yang Baik**
Bergaul dengan orang sholeh. Sahabat NASUHA saling menguatkan.

**5. Ubah Pola Pikir**
- "Mengapa aku?" → "Apa yang bisa aku pelajari?"
- "Aku tidak mampu" → "Aku belum mampu, tapi sedang belajar"
- "Aku gagal" → "Aku sedang dalam proses"

**6. Jangan Membandingkan**
Setiap orang punya timeline berbeda. Fokus pada progressmu sendiri.

**7. Minta Bantuan**
Tidak lemah untuk meminta bantuan. Konsultasi dengan ustadz, psikolog, atau sahabat terpercaya.

"Cukuplah Allah sebagai Penolong kami dan Dia adalah sebaik-baik Pelindung." (QS. Ali Imran: 173)`,
  },
  // ─── PERBAIKAN DIRI DALAM IBADAH ───
  {
    keywords: ['perbaikan diri', 'istiqomah', 'konsisten ibadah', 'malas ibadah', 'meningkatkan ibadah', 'rajin ibadah', 'kebiasaan baik', 'memperbaiki shalat', 'tahajud', 'qiyamul lail', 'riyadhoh', 'muhasabah', 'introspeksi', 'taubat'],
    topic: 'Perbaikan Diri dalam Ibadah',
    response: `**Metode Perbaikan Diri dalam Ibadah**

**Prinsip: "Amal yang paling dicintai Allah adalah yang paling konsisten meskipun sedikit." (HR. Bukhari Muslim)**

**Langkah 1: Muhasabah (Introspeksi)**
Sebelum tidur, tanyakan:
- Apa dosa yang harus aku taubati hari ini?
- Amal baik apa yang harus aku syukuri?
- Apakah aku lebih baik dari kemarin?

**Langkah 2: Mulai dari yang Wajib**
Pastikan shalat 5 waktu terjaga dulu. Jangan loncat ke sunnah kalau yang wajib masih bolong.

**Langkah 3: Tambah Sedikit demi Sedikit**
- Minggu 1: Shalat 5 waktu tepat waktu
- Minggu 2: + Shalat rawatib (minimal 2 rakaat sebelum Subuh)
- Minggu 3: + Baca Al-Quran 1 halaman/hari
- Minggu 4: + Dzikir pagi & petang
- Selanjutnya: + Shalat Dhuha, Tahajud

**Langkah 4: Bangun Sistem, Bukan Motivasi**
- Pasang alarm untuk shalat
- Taruh mushaf di tempat yang mudah dijangkau
- Ikut program riyadhoh NASUHA
- Punya partner ibadah (saling mengingatkan)

**Langkah 5: Jangan Putus saat Terjatuh**
Jika kembali terjatuh, jangan jadikan alasan berhenti. Langsung bangkit dan istighfar.

**Program Riyadhoh NASUHA:**
Tracking ibadah harian bersama komunitas — saling menguatkan untuk istiqomah.

**Shalat Tahajud — Kunci Perubahan:**
- Waktu mustajab: sepertiga malam terakhir
- Minimal 2 rakaat
- Allah turun ke langit dunia dan berfirman: "Adakah yang memohon kepada-Ku, niscaya akan Aku kabulkan?" (HR. Bukhari Muslim)

**Doa Istiqomah:**
"Ya Muqallibal Qulub, tsabbit qalbi 'ala dinik."
(Wahai Dzat yang membolak-balikkan hati, teguhkan hatiku di atas agama-Mu.)

"Perubahan besar dimulai dari keputusan kecil yang dilakukan konsisten."`,
  },
];

const DEFAULT_RESPONSE = `Terima kasih atas pertanyaannya. Saya akan berusaha membantu sebaik mungkin.

Saat ini saya bisa membantu Anda dengan topik berikut:

**Keuangan & Anti-Riba:**
- Hukum riba dan dalilnya
- Cara menyelesaikan utang riba
- Mediasi dan negosiasi dengan bank
- Keuangan syariah & alternatif halal
- Pinjaman online & kartu kredit
- Program LBU NASUHA

**Ilmu Agama:**
- Fiqih Muamalah (jual beli, akad, zakat)
- Fiqih Ibadah (shalat, puasa, wudhu)
- Ilmu Al-Quran & Hadis
- Fundamental Aqidah & Tauhid

**Pengembangan Diri:**
- Penguatan mental & spiritual
- Perbaikan diri dalam ibadah
- Doa pelunasan utang

Silakan tanyakan dengan kata kunci yang lebih spesifik, misalnya:
- "Apa hukum riba?"
- "Bagaimana fiqih jual beli?"
- "Cara istiqomah dalam ibadah"
- "Bagaimana menguatkan mental?"

Jika pertanyaan Anda di luar cakupan saya, silakan hubungi pengurus NASUHA melalui menu Korda di aplikasi.`;

export function getAnasResponse(input: string): { topic: string; response: string } {
  const lower = input.toLowerCase().trim();
  if (!lower) return { topic: 'Salam', response: KNOWLEDGE_BASE[KNOWLEDGE_BASE.length - 1].response };

  let bestMatch: KnowledgeEntry | null = null;
  let bestScore = 0;

  for (const entry of KNOWLEDGE_BASE) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (lower.includes(kw.toLowerCase())) {
        score += kw.length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  if (bestMatch && bestScore > 0) {
    return { topic: bestMatch.topic, response: bestMatch.response };
  }

  return { topic: 'Umum', response: DEFAULT_RESPONSE };
}

export const SUGGESTED_QUESTIONS = [
  'Literasi riba dan keadilan',
  'Literasi negosiasi utang',
  'Literasi doa dan pemulihan utang',
  'Bagaimana recovery journey bebas utang?',
  'Apa hukum riba?',
  'Bagaimana cara melunasi utang riba?',
  'Apa itu program LBU?',
  'Cara mediasi dengan bank',
  'Apa itu keuangan syariah?',
  'Doa pelunasan utang',
  'Bahaya pinjaman online',
  'Apa itu fiqih muamalah?',
  'Bagaimana fiqih ibadah?',
  'Ilmu Al-Quran dan Hadis',
  'Cara menguatkan mental',
  'Cara istiqomah dalam ibadah',
  'Apa itu aqidah?',
  'Makna tawakkal',
];
