export type DoaCategory =
  | 'Iman & Tauhid'
  | 'Ampunan & Taubat'
  | 'Rezeki'
  | 'Pekerjaan & Usaha'
  | 'Kesehatan'
  | 'Keluarga & Pasangan'
  | 'Anak & Keturunan'
  | 'Orang Tua'
  | 'Perlindungan'
  | 'Pagi'
  | 'Petang & Malam'
  | 'Tidur'
  | 'Aktivitas Harian'
  | 'Ilmu & Kesuksesan'
  | 'Akhirat';

export interface DoaEntry {
  id: number;
  category: DoaCategory;
  title: string;
  arabic?: string;
  latin?: string;
  meaning: string;
  source?: string;
  icon: string;
  debt?: boolean;
}

type Seed = Omit<DoaEntry, 'id'>;

const CORE_DOAS: Seed[] = [
  { category: 'Iman & Tauhid', title: 'Memohon keteguhan hati', arabic: 'اللَّهُمَّ يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ', latin: 'Allahumma ya muqallibal-qulub, tsabbit qalbi ala dinik.', meaning: 'Ya Allah, wahai Dzat yang membolak-balikkan hati, teguhkanlah hatiku di atas agama-Mu.', source: 'HR. Tirmidzi', icon: 'shield-checkmark-outline' },
  { category: 'Iman & Tauhid', title: 'Memohon hidayah dan kecukupan', arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى', latin: 'Allahumma inni asalukal-huda wat-tuqa wal-afafa wal-ghina.', meaning: 'Ya Allah, aku memohon petunjuk, ketakwaan, kesucian diri, dan kecukupan.', source: 'HR. Muslim', icon: 'compass-outline' },
  { category: 'Iman & Tauhid', title: 'Memohon tambahan ilmu', arabic: 'رَبِّ زِدْنِي عِلْمًا', latin: 'Rabbi zidni ilma.', meaning: 'Ya Rabbku, tambahkanlah kepadaku ilmu.', source: 'QS. Thaha: 114', icon: 'book-outline' },
  { category: 'Iman & Tauhid', title: 'Agar hati tidak menyimpang', arabic: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً', latin: 'Rabbana la tuzigh qulubana bada idz hadaitana wa hab lana milladunka rahmah.', meaning: 'Ya Rabb kami, jangan jadikan hati kami menyimpang setelah Engkau beri petunjuk.', source: 'QS. Ali Imran: 8', icon: 'heart-outline' },
  { category: 'Ampunan & Taubat', title: 'Sayyidul Istighfar', arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، فَاغْفِرْ لِي', latin: 'Allahumma anta Rabbi la ilaha illa anta, khalaqtani wa ana abduk, faghfir li.', meaning: 'Ya Allah, Engkau Rabbku. Tiada Tuhan selain Engkau. Engkau menciptakanku, maka ampunilah aku.', source: 'HR. Bukhari', icon: 'refresh-circle-outline' },
  { category: 'Ampunan & Taubat', title: 'Doa Nabi Adam', arabic: 'رَبَّنَا ظَلَمْنَا أَنْفُسَنَا وَإِنْ لَمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ', latin: 'Rabbana dhalamna anfusana wa illam taghfir lana wa tarhamna lanakunanna minal-khasirin.', meaning: 'Ya Rabb kami, kami telah menzalimi diri kami. Ampunilah dan rahmatilah kami.', source: 'QS. Al-Araf: 23', icon: 'hand-left-outline' },
  { category: 'Rezeki', title: 'Kecukupan dengan yang halal', arabic: 'اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ، وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ', latin: 'Allahummakfini bihalalika an haramika, wa aghnini bifadhlika amman siwak.', meaning: 'Ya Allah, cukupilah aku dengan yang halal sehingga aku tidak membutuhkan yang haram.', source: 'HR. Tirmidzi', icon: 'wallet-outline', debt: true },
  { category: 'Rezeki', title: 'Doa Nabi Musa memohon kebaikan', arabic: 'رَبِّ إِنِّي لِمَا أَنْزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ', latin: 'Rabbi inni lima anzalta ilayya min khairin faqir.', meaning: 'Ya Rabbku, sesungguhnya aku sangat membutuhkan kebaikan yang Engkau turunkan.', source: 'QS. Al-Qashash: 24', icon: 'sparkles-outline' },
  { category: 'Rezeki', title: 'Memohon rezeki baik', arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ رِزْقًا طَيِّبًا', latin: 'Allahumma inni asaluka rizqan tayyiban.', meaning: 'Ya Allah, aku memohon kepada-Mu rezeki yang baik.', source: 'HR. Ibnu Majah', icon: 'gift-outline' },
  { category: 'Pekerjaan & Usaha', title: 'Memohon kelapangan dada dan kemudahan', arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي', latin: 'Rabbishrah li shadri wa yassir li amri.', meaning: 'Ya Rabbku, lapangkanlah dadaku dan mudahkanlah urusanku.', source: 'QS. Thaha: 25-26', icon: 'briefcase-outline' },
  { category: 'Kesehatan', title: 'Memohon ampunan dan kesehatan', arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ', latin: 'Allahumma inni asalukal-afwa wal-afiyah.', meaning: 'Ya Allah, aku memohon ampunan dan kesehatan/keselamatan.', source: 'HR. Abu Dawud dan Tirmidzi', icon: 'medkit-outline' },
  { category: 'Kesehatan', title: 'Doa ketika sakit', arabic: 'اللَّهُمَّ رَبَّ النَّاسِ أَذْهِبِ الْبَأْسَ، اشْفِ أَنْتَ الشَّافِي', latin: 'Allahumma Rabban-nas, adzhibil-bas, isyfi antasy-Syafi.', meaning: 'Ya Allah, Rabb manusia, hilangkan penyakit ini dan sembuhkanlah.', source: 'HR. Bukhari dan Muslim', icon: 'heart-circle-outline' },
  { category: 'Keluarga & Pasangan', title: 'Keluarga penyejuk mata', arabic: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ', latin: 'Rabbana hab lana min azwajina wa dzurriyyatina qurrata ayun.', meaning: 'Ya Rabb kami, anugerahkan pasangan dan keturunan yang menjadi penyejuk mata.', source: 'QS. Al-Furqan: 74', icon: 'people-outline' },
  { category: 'Anak & Keturunan', title: 'Memohon keturunan yang baik', arabic: 'رَبِّ هَبْ لِي مِنْ لَدُنْكَ ذُرِّيَّةً طَيِّبَةً', latin: 'Rabbi hab li milladunka dzurriyyatan thayyibah.', meaning: 'Ya Rabbku, karuniakanlah kepadaku keturunan yang baik.', source: 'QS. Ali Imran: 38', icon: 'happy-outline' },
  { category: 'Orang Tua', title: 'Doa untuk kedua orang tua', arabic: 'رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا', latin: 'Rabbirhamhuma kama rabbayani shaghira.', meaning: 'Ya Rabbku, sayangilah mereka sebagaimana mereka menyayangiku ketika kecil.', source: 'QS. Al-Isra: 24', icon: 'home-outline' },
  { category: 'Perlindungan', title: 'Perlindungan dari kegelisahan dan utang', arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ، وَأَعُوذُ بِكَ مِنْ غَلَبَةِ الدَّيْنِ وَقَهْرِ الرِّجَالِ', latin: 'Allahumma inni audzu bika minal-hammi wal-hazan, wa audzu bika minal-ajzi wal-kasal, wa audzu bika min ghalabatid-dayni wa qahrir-rijal.', meaning: 'Ya Allah, aku berlindung dari kegelisahan, kelemahan, kemalasan, lilitan utang, dan tekanan manusia.', source: 'HR. Bukhari', icon: 'alert-circle-outline', debt: true },
  { category: 'Perlindungan', title: 'Doa Nabi Yunus saat kesulitan', arabic: 'لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ', latin: 'La ilaha illa anta subhanaka inni kuntu minaz-zalimin.', meaning: 'Tiada Tuhan selain Engkau. Mahasuci Engkau. Sungguh aku termasuk orang yang zalim.', source: 'QS. Al-Anbiya: 87', icon: 'shield-outline' },
  { category: 'Pagi', title: 'Doa memasuki pagi', arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ', latin: 'Allahumma bika ashbahna wa bika amsayna wa bika nahya wa bika namut.', meaning: 'Ya Allah, dengan pertolongan-Mu kami memasuki pagi dan kepada-Mu tempat kembali.', source: 'HR. Abu Dawud dan Tirmidzi', icon: 'sunny-outline' },
  { category: 'Petang & Malam', title: 'Doa memasuki petang', arabic: 'اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ', latin: 'Allahumma bika amsayna wa bika ashbahna wa bika nahya wa bika namut.', meaning: 'Ya Allah, dengan pertolongan-Mu kami memasuki petang dan kepada-Mu tempat kembali.', source: 'HR. Abu Dawud dan Tirmidzi', icon: 'cloudy-night-outline' },
  { category: 'Tidur', title: 'Doa sebelum tidur', arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا', latin: 'Bismikallahumma amutu wa ahya.', meaning: 'Dengan nama-Mu ya Allah, aku mati dan aku hidup.', source: 'HR. Bukhari', icon: 'moon-outline' },
  { category: 'Aktivitas Harian', title: 'Doa keluar rumah', arabic: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', latin: 'Bismillahi tawakkaltu alallah, la haula wa la quwwata illa billah.', meaning: 'Dengan nama Allah, aku bertawakal kepada Allah. Tiada daya dan kekuatan kecuali dengan Allah.', source: 'HR. Abu Dawud dan Tirmidzi', icon: 'exit-outline' },
  { category: 'Ilmu & Kesuksesan', title: 'Memohon ilmu bermanfaat', arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا', latin: 'Allahumma inni asaluka ilman nafian, wa rizqan thayyiban, wa amalan mutaqabbalan.', meaning: 'Ya Allah, aku memohon ilmu bermanfaat, rezeki yang baik, dan amal yang diterima.', source: 'HR. Ibnu Majah', icon: 'book-outline' },
  { category: 'Akhirat', title: 'Kebaikan dunia dan akhirat', arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ', latin: 'Rabbana atina fid-dunya hasanah wa fil-akhirati hasanah wa qina adzaban-nar.', meaning: 'Ya Rabb kami, berilah kebaikan di dunia dan akhirat serta lindungi kami dari azab neraka.', source: 'QS. Al-Baqarah: 201', icon: 'globe-outline' },
  { category: 'Akhirat', title: 'Memohon husnul khatimah', arabic: 'اللَّهُمَّ اخْتِمْ لَنَا بِحُسْنِ الْخَاتِمَةِ', latin: 'Allahummakhtim lana bihusnil-khatimah.', meaning: 'Ya Allah, akhirilah kehidupan kami dengan husnul khatimah.', source: 'Doa umum', icon: 'flag-outline' },
];

const EXTRA_DOAS: Seed[] = [
  { category: 'Iman & Tauhid', title: 'Membuka hati dengan hikmah', arabic: 'اللَّهُمَّ انْفَعْنِي بِمَا عَلَّمْتَنِي، وَعَلِّمْنِي مَا يَنْفَعُنِي، وَزِدْنِي عِلْمًا', latin: 'Allahumma infa’ni bima ‘allamtani, wa ‘allimni ma yanfa’uni, wa zidni ‘ilman.', meaning: 'Ya Allah, berilah manfaat apa yang telah Engkau ajarkan kepadaku, ajarkanlah aku hal yang bermanfaat, dan tambahkan ilmu kepadaku.', source: 'HR. Muslim', icon: 'book-outline' },
  { category: 'Ampunan & Taubat', title: 'Taubat yang sungguh-sungguh', arabic: 'تُبْتُ إِلَيْكَ وَأَنَا أَتُوبُ إِلَيْكَ', latin: 'Tubtu ilayka wa ana atubu ilayka.', meaning: 'Aku bertaubat kepada-Mu dan kembali kepada-Mu dalam kesungguhan.', source: 'Doa taubat umum', icon: 'refresh-circle-outline' },
  { category: 'Pekerjaan & Usaha', title: 'Memohon kemudahan urusan', arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي', latin: 'Rabbisyrah li shadri wa yassir li amri.', meaning: 'Ya Rabbku, lapangkanlah dadaku dan mudahkanlah urusanku.', source: 'QS. Thaha: 25-26', icon: 'briefcase-outline' },
  { category: 'Keluarga & Pasangan', title: 'Doa rumah tangga yang sakinah', arabic: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ', latin: 'Rabbana hab lana min azwajina wa dzurriyyatina qurrata a’yunin.', meaning: 'Ya Rabb kami, anugerahkan bagi kami pasangan dan keturunan yang menjadi penyejuk hati.', source: 'QS. Al-Furqan: 74', icon: 'people-outline' },
  { category: 'Perlindungan', title: 'Memohon perlindungan dari beban hidup', arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ', latin: 'Allahumma inni a’udzubika minal-hammi wal-hazani, wal-‘ajzi wal-kasali.', meaning: 'Ya Allah, aku berlindung kepada-Mu dari kegelisahan, kesedihan, kelemahan, dan kemalasan.', source: 'HR. Bukhari', icon: 'shield-outline', debt: true },
  { category: 'Pagi', title: 'Doa pagi untuk kesuksesan dan keberkahan', arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا', latin: 'Allahumma bika ashbahna wa bika amsayna.', meaning: 'Ya Allah, dengan-Mu kami memulai pagi dan dengan-Mu kami menghadapi sore.', source: 'HR. Abu Dawud', icon: 'sunny-outline' },
  { category: 'Petang & Malam', title: 'Doa malam agar hati tenang', arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ رَحْمَتَكَ، وَأَعُوذُ بِكَ مِنْ عَذَابِكَ', latin: 'Allahumma inni as-aluka rahmataka wa a’udzu bika min ‘adzabika.', meaning: 'Ya Allah, aku memohon rahmat-Mu dan berlindung kepada-Mu dari azab-Mu.', source: 'Doa malam umum', icon: 'cloudy-night-outline' },
  { category: 'Tidur', title: 'Doa sebelum tidur agar tenang', arabic: 'اللَّهُمَّ قَنِّعْنِي بِمَا رَزَقْتَنِي وَبَارِكْ لِي فِيهِ', latin: 'Allahumma qanni’ni bima razaqtani wa barik li fihi.', meaning: 'Ya Allah, cukupkanlah aku dengan apa yang Engkau berikan dan berkahilah itu bagiku.', source: 'Doa tidur umum', icon: 'moon-outline' },
  { category: 'Aktivitas Harian', title: 'Doa saat memulai aktivitas', arabic: 'بِسْمِ اللَّهِ، وَبِاللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ', latin: 'Bismillahi, wa billahi, tawakkaltu alallahi.', meaning: 'Dengan nama Allah, dan atas nama Allah, aku bertawakal kepada Allah.', source: 'Doa aktivitas sehari-hari', icon: 'rocket-outline' },
  { category: 'Ilmu & Kesuksesan', title: 'Memohon keberkahan ilmu', arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا', latin: 'Allahumma inni as-aluka ‘ilman nafi’an wa rizqan tayyiban.', meaning: 'Ya Allah, aku memohon ilmu yang bermanfaat serta rezeki yang baik.', source: 'HR. Ibnu Majah', icon: 'school-outline' },
  { category: 'Akhirat', title: 'Memohon husnul khatimah', arabic: 'اللَّهُمَّ اخْتِمْ لَنَا بِالْحُسْنَى وَأَلْحِقْنَا بِالرَّحْمَةِ', latin: 'Allahumma akhtim lana bil-husna wa alhiqna bil-rahmah.', meaning: 'Ya Allah, tutuplah hidup kami dengan kebaikan dan gabungkanlah kami dengan rahmat-Mu.', source: 'Doa umum', icon: 'flag-outline' },
];

export const DOAS: DoaEntry[] = [
  ...CORE_DOAS.map((item, index) => ({ ...item, id: index + 1 })),
  ...EXTRA_DOAS.map((item, index) => ({ ...item, id: CORE_DOAS.length + index + 1 })),
];
