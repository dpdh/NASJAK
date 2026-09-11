import React, { memo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppStore } from '../../store/appStore';
import { BorderRadius, Colors, FontSize, Spacing } from '../../constants/theme';

const DOAS = [
  { title: 'Doa sebelum tidur', arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا', latin: 'Bismikallahumma amutu wa ahya', meaning: 'Dengan nama-Mu ya Allah, aku mati dan aku hidup.', icon: 'moon-outline' },
  { title: 'Doa bangun tidur', arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ', latin: 'Alhamdulillahil-ladzi ahyana ba’da ma amatana wa ilaihin-nusyur', meaning: 'Segala puji bagi Allah yang menghidupkan kami setelah mematikan kami dan kepada-Nya kami kembali.', icon: 'sunny-outline' },
  { title: 'Doa keluar rumah', arabic: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', latin: 'Bismillahi tawakkaltu alallah, la haula wa la quwwata illa billah', meaning: 'Dengan nama Allah, aku bertawakal kepada Allah. Tiada daya dan kekuatan kecuali dengan Allah.', icon: 'exit-outline' },
  { title: 'Doa memohon ilmu bermanfaat', arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا', latin: 'Allahumma inni as’aluka ilman nafi’an, wa rizqan tayyiban, wa amalan mutaqabbalan', meaning: 'Ya Allah, aku memohon ilmu yang bermanfaat, rezeki yang baik, dan amal yang diterima.', icon: 'book-outline' },
  { title: 'Doa memohon kebaikan rezeki', arabic: 'رَبِّ إِنِّي لِمَا أَنْزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ', latin: 'Rabbi inni lima anzalta ilayya min khairin faqir', meaning: 'Ya Tuhanku, sesungguhnya aku sangat memerlukan suatu kebaikan yang Engkau turunkan kepadaku.', icon: 'sparkles-outline' },
  { title: 'Doa Nabi Yunus saat kesulitan', arabic: 'لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ', latin: 'La ilaha illa anta subhanaka inni kuntu minaz-zalimin', meaning: 'Tidak ada Tuhan selain Engkau. Mahasuci Engkau. Sungguh aku termasuk orang-orang yang zalim.', icon: 'water-outline' },
  { title: 'Doa berlindung dari lilitan utang', arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ، وَأَعُوذُ بِكَ مِنَ الْجُبْنِ وَالْبُخْلِ، وَأَعُوذُ بِكَ مِنْ غَلَبَةِ الدَّيْنِ وَقَهْرِ الرِّجَالِ', latin: 'Allahumma inni a’udzu bika minal-hammi wal-hazan, wa a’udzu bika minal-ajzi wal-kasal, wa a’udzu bika minal-jubni wal-bukhl, wa a’udzu bika min ghalabatid-dayni wa qahrir-rijal', meaning: 'Ya Allah, aku berlindung kepada-Mu dari kegelisahan, kelemahan, kemalasan, sifat pengecut, kikir, lilitan utang, dan tekanan manusia.', icon: 'alert-circle-outline', debt: true },
  { title: 'Doa kecukupan dengan yang halal', arabic: 'اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ، وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ', latin: 'Allahummakfini bihalalika an haramika, wa aghnini bifadhlika amman siwak', meaning: 'Ya Allah, cukupilah aku dengan yang halal sehingga aku tidak membutuhkan yang haram, dan cukupilah aku dengan karunia-Mu sehingga aku tidak membutuhkan selain-Mu.', icon: 'wallet-outline', debt: true },
  { title: 'Doa memohon ketenangan', arabic: 'حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ، عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ', latin: 'Hasbiyallahu la ilaha illa huwa, alaihi tawakkaltu wa huwa rabbul-arsyil-azhim', meaning: 'Cukuplah Allah bagiku. Tiada Tuhan selain Dia. Kepada-Nya aku bertawakal.', icon: 'heart-outline' },
  { title: 'Doa kebaikan dunia dan akhirat', arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ', latin: 'Rabbana atina fid-dunya hasanah wa fil-akhirati hasanah wa qina adzaban-nar', meaning: 'Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat serta lindungilah kami dari azab neraka.', icon: 'globe-outline' },
];

function DoaScreen() {
  const theme = useAppStore((s) => s.theme);
  const colors = Colors[theme];
  return <View style={[styles.container, { backgroundColor: colors.background }]}>
    <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
      <Pressable onPress={() => router.back()} hitSlop={12}><Ionicons name="arrow-back" size={24} color={colors.text} /></Pressable>
      <View style={{ flex: 1, marginLeft: Spacing.md }}><Text style={[styles.title, { color: colors.text }]}>Doa Harian</Text><Text style={[styles.subtitle, { color: colors.textSecondary }]}>Doa pilihan untuk menemani ikhtiar</Text></View>
      <Ionicons name="book-outline" size={24} color={colors.primary} />
    </View>
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={[styles.intro, { backgroundColor: colors.primary + '12', borderColor: colors.primary + '30' }]}><Ionicons name="information-circle-outline" size={21} color={colors.primary} /><Text style={[styles.introText, { color: colors.text }]}>Baca dengan memahami makna dan sertai doa dengan ikhtiar yang baik.</Text></View>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Doa terkait utang</Text>
      {DOAS.filter((item) => item.debt).map((item) => <DoaCard key={item.title} item={item} colors={colors} />)}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Doa harian</Text>
      {DOAS.filter((item) => !item.debt).map((item) => <DoaCard key={item.title} item={item} colors={colors} />)}
      <View style={{ height: 24 }} />
    </ScrollView>
  </View>;
}

function DoaCard({ item, colors }: { item: typeof DOAS[number]; colors: typeof Colors.light }) {
  return <View style={[styles.card, { backgroundColor: colors.card, borderColor: item.debt ? colors.gold : colors.border }]}>
    <View style={styles.cardHeader}><View style={[styles.icon, { backgroundColor: item.debt ? colors.gold + '20' : colors.primary + '15' }]}><Ionicons name={item.icon as any} size={19} color={item.debt ? colors.gold : colors.primary} /></View><Text style={[styles.cardTitle, { color: colors.text }]}>{item.title}</Text>{item.debt && <Text style={[styles.badge, { color: colors.gold }]}>UTANG</Text>}</View>
    <Text style={[styles.arabic, { color: colors.text }]}>{item.arabic}</Text><Text style={[styles.latin, { color: colors.primary }]}>{item.latin}</Text><Text style={[styles.meaning, { color: colors.textSecondary }]}>{item.meaning}</Text>
  </View>;
}

export default memo(DoaScreen);
const styles = StyleSheet.create({ container: { flex: 1 }, header: { flexDirection: 'row', alignItems: 'center', paddingTop: 56, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md, borderBottomWidth: 1 }, title: { fontSize: FontSize.xl, fontWeight: '800' }, subtitle: { fontSize: FontSize.sm, marginTop: 2 }, content: { padding: Spacing.lg }, intro: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, borderWidth: 1, borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.lg }, introText: { flex: 1, fontSize: FontSize.sm, lineHeight: 19 }, sectionTitle: { fontSize: FontSize.lg, fontWeight: '800', marginBottom: Spacing.sm, marginTop: Spacing.sm }, card: { borderWidth: 1, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.sm }, cardHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }, icon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }, cardTitle: { flex: 1, fontSize: FontSize.md, fontWeight: '800' }, badge: { fontSize: 10, fontWeight: '900' }, arabic: { fontSize: 25, lineHeight: 45, textAlign: 'right', marginTop: Spacing.md, fontFamily: 'Lateef-Regular' }, latin: { fontSize: FontSize.sm, fontStyle: 'italic', lineHeight: 20, marginTop: Spacing.sm }, meaning: { fontSize: FontSize.sm, lineHeight: 20, marginTop: Spacing.xs }, });
