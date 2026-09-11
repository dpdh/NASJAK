import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    Animated,
    Pressable,
    SectionList,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { ShimmerGold } from '../../components/ui/ShimmerGold';
import { RIYADHOH_ITEMS } from '../../constants/data';
import { BorderRadius, Colors, FontSize, Shadows, Spacing } from '../../constants/theme';
import { useAppStore } from '../../store/appStore';

interface RiyadhohRow { id: string; name: string; icon: string; done: boolean; rakaat?: number; }

const RIYADHOH_DOCS = {
  azzam: {
    title: 'Azzam Riyadhoh',
    body: `Dengan penuh kesadaran, kerendahan hati, dan harapan kepada Allah SWT, saya berazam untuk bersungguh-sungguh menapaki jalan ketaatan. Saya berjanji kepada diri sendiri untuk menjaga niat, memperbaiki langkah, serta menjadikan setiap hari sebagai kesempatan untuk semakin dekat kepada Allah SWT.

Saya berkomitmen untuk istiqamah menjalankan kegiatan riyadhoh dengan hati yang ikhlas, sabar, dan penuh rasa syukur. Saya akan menjaga ibadah fardu tepat pada waktunya, meningkatkan kualitas kekhusyukan dalam setiap salat, serta berusaha memahami bahwa ibadah bukan sekadar kewajiban, melainkan kebutuhan jiwa dan bentuk cinta kepada Allah SWT.

Saya juga akan membiasakan ibadah sunah, dzikir, doa, membaca Al-Qur’an, bersedekah, menjaga lisan, menghormati sesama, dan melakukan amalan-amalan baik lainnya. Ketika lelah, saya akan mengingat tujuan. Ketika lalai, saya akan kembali. Ketika diuji, saya akan bersabar. Saya percaya bahwa setiap langkah kecil yang dilakukan dengan istiqamah akan menjadi jalan menuju kebaikan yang besar.

Saya memohon agar Allah SWT senantiasa membimbing hati, menguatkan iman, melapangkan rezeki, menenangkan jiwa, serta menjauhkan diri ini dari kesombongan, kemalasan, dan segala hal yang menjauhkan dari ridha-Nya. Semoga riyadhoh ini menjadi ikhtiar untuk membentuk pribadi yang lebih baik, bermanfaat, berakhlak mulia, dan senantiasa membawa kebaikan bagi keluarga, sahabat, serta lingkungan.`,
  },
  affirmation: {
    title: 'Afirmasi Positif',
    body: `Saya adalah hamba Allah yang sedang bertumbuh dalam ketaatan.
Saya mampu menjaga ibadah dengan cinta dan kesadaran.
Saya memilih istiqamah, meskipun dimulai dari langkah-langkah kecil.
Saya pantas menerima keberkahan hidup, ketenangan hati, dan rezeki yang halal serta melimpah.
Saya diberi kekuatan untuk berusaha, bersyukur, berbagi, dan menjadi pribadi yang bermanfaat.
Dengan izin Allah, hidup saya dipenuhi kebahagiaan di dunia dan keselamatan di akhirat.
Saya senantiasa memohon dan mengejar ridha Allah SWT dalam setiap niat, ucapan, dan perbuatan.

“Bersahabat di Dunia Bertetangga di Surga.”`,
  },
} as const;

const DAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

const DocOptionButton = memo(
  ({ label, active, colors, onPress }: { label: string; active: boolean; colors: typeof Colors.light; onPress: () => void }) => {
    const scale = useRef(new Animated.Value(1)).current;
    const glow = useRef(new Animated.Value(active ? 1 : 0)).current;

    useEffect(() => {
      Animated.timing(glow, {
        toValue: active ? 1 : 0,
        duration: 220,
        useNativeDriver: true,
      }).start();
    }, [active, glow]);

    const handlePressIn = () => {
      Animated.spring(scale, {
        toValue: 0.96,
        friction: 7,
        tension: 220,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scale, {
        toValue: 1,
        friction: 7,
        tension: 220,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View style={[styles.ribbonButtonWrap, { transform: [{ scale }] }]}>
        <Pressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={[
            styles.ribbonChip,
            {
              backgroundColor: active ? colors.primary + 'E6' : 'rgba(255,255,255,0.08)',
              borderColor: active ? 'rgba(255,255,255,0.38)' : 'rgba(255,255,255,0.14)',
              shadowColor: active ? colors.primary : '#000',
              shadowOpacity: active ? 0.28 : 0.08,
              shadowRadius: active ? 12 : 6,
              shadowOffset: { width: 0, height: 6 },
            },
          ]}
        >
          <Animated.View
            pointerEvents="none"
            style={[
              styles.ribbonGlow,
              {
                opacity: glow,
                backgroundColor: active ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.05)',
              },
            ]}
          />
          <Text style={[styles.ribbonChipText, { color: active ? '#FFF' : colors.textSecondary }]}>{label}</Text>
        </Pressable>
      </Animated.View>
    );
  },
);

function getWeekDates(): string[] {
  const today = new Date();
  const day = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((day + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().split('T')[0];
  });
}

const CheckItem = memo(
  ({ item, colors, onToggle }: { item: RiyadhohRow; colors: typeof Colors.light; onToggle: (id: string) => void }) => (
    <Pressable
      onPress={() => onToggle(item.id)}
      style={[
        styles.checkCard,
        { backgroundColor: item.done ? colors.primary + '18' : colors.card, borderColor: item.done ? colors.primary : colors.border },
        Shadows.sm,
      ]}
    >
      <Ionicons
        name={item.done ? 'checkmark-circle' : 'ellipse-outline'}
        size={26}
        color={item.done ? colors.primary : colors.textMuted}
      />
      <Ionicons name={item.icon as any} size={20} color={item.done ? colors.primary : colors.textSecondary} />
      <Text style={[styles.checkName, { color: item.done ? colors.primary : colors.text, textDecorationLine: item.done ? 'line-through' : 'none' }]}>
        {item.name}
      </Text>
      {item.rakaat && <Text style={[styles.rakaatLabel, { color: item.done ? colors.primary : colors.gold }]}>{item.rakaat} rakaat</Text>}
      {item.done && <Text style={[styles.doneLabel, { color: colors.success }]}>Alhamdulillah</Text>}
    </Pressable>
  ),
);

function RiyadhohScreen() {
  const theme = useAppStore((s) => s.theme);
  const riyadhohLogs = useAppStore((s) => s.riyadhohLogs);
  const toggleRiyadhoh = useAppStore((s) => s.toggleRiyadhoh);
  const colors = Colors[theme];

  const todayKey = useMemo(() => new Date().toISOString().split('T')[0], []);
  const weekDates = useMemo(() => getWeekDates(), []);
  const [selectedDoc, setSelectedDoc] = useState<keyof typeof RIYADHOH_DOCS>('azzam');
  const [ribbonVisible, setRibbonVisible] = useState(true);
  const docFade = useRef(new Animated.Value(1)).current;
  const docSlide = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(docFade, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.spring(docSlide, {
        toValue: 0,
        tension: 120,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [docFade, docSlide, selectedDoc]);

  const sections = useMemo(() => {
    const grouped: Record<string, RiyadhohRow[]> = {};
    for (const item of RIYADHOH_ITEMS) {
      const key = `${item.id}_${todayKey}`;
      const row: RiyadhohRow = { id: item.id, name: item.name, icon: item.icon, done: !!riyadhohLogs[key], rakaat: 'rakaat' in item ? item.rakaat : undefined };
      if (!grouped[item.category]) grouped[item.category] = [];
      grouped[item.category].push(row);
    }
    return Object.entries(grouped).map(([title, data]) => ({ title, data }));
  }, [riyadhohLogs, todayKey]);

  const progress = useMemo(() => {
    const total = RIYADHOH_ITEMS.length;
    let done = 0;
    for (const item of RIYADHOH_ITEMS) {
      if (riyadhohLogs[`${item.id}_${todayKey}`]) done++;
    }
    return { done, total, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
  }, [riyadhohLogs, todayKey]);

  // Calculate streak
  const streak = useMemo(() => {
    let count = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateKey = d.toISOString().split('T')[0];
      let anyDone = false;
      for (const item of RIYADHOH_ITEMS) {
        if (riyadhohLogs[`${item.id}_${dateKey}`]) { anyDone = true; break; }
      }
      if (anyDone) count++;
      else if (i > 0) break; // Allow today to be incomplete
    }
    return count;
  }, [riyadhohLogs]);

  // Weekly chart data
  const weeklyData = useMemo(() => {
    return weekDates.map((dateKey) => {
      let done = 0;
      for (const item of RIYADHOH_ITEMS) {
        if (riyadhohLogs[`${item.id}_${dateKey}`]) done++;
      }
      return { date: dateKey, done, pct: Math.round((done / RIYADHOH_ITEMS.length) * 100), isToday: dateKey === todayKey };
    });
  }, [weekDates, riyadhohLogs, todayKey]);

  const handleToggle = useCallback(
    (id: string) => {
      toggleRiyadhoh(`${id}_${todayKey}`);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    },
    [toggleRiyadhoh, todayKey],
  );

  const allDone = progress.pct === 100;

  const renderItem = useCallback(
    ({ item }: { item: RiyadhohRow }) => <CheckItem item={item} colors={colors} onToggle={handleToggle} />,
    [colors, handleToggle],
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: { title: string } }) => (
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{section.title}</Text>
    ),
    [colors],
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        removeClippedSubviews
        ListHeaderComponent={
          <View>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.card }]}>
              <Text style={[styles.title, { color: colors.text }]}>Riyadhoh Saya</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Catat dan pantau perjalanan ibadah harian</Text>
            </View>

            <View style={[styles.ribbonWrapper, { backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.1)' }]}>
              {ribbonVisible ? (
                <View style={styles.ribbonMenu}>
                  {(Object.keys(RIYADHOH_DOCS) as Array<keyof typeof RIYADHOH_DOCS>).map((key) => {
                    const active = selectedDoc === key;
                    const label = key === 'azzam' ? 'Azzam Riyadhoh' : 'Afirmasi Positif';
                    return (
                      <DocOptionButton
                        key={key}
                        label={label}
                        active={active}
                        colors={colors}
                        onPress={() => setSelectedDoc(key)}
                      />
                    );
                  })}
                  <Pressable onPress={() => setRibbonVisible(false)} style={styles.hideRibbonButton}>
                    <Ionicons name="chevron-up" size={16} color={colors.primary} />
                  </Pressable>
                </View>
              ) : (
                <Pressable onPress={() => setRibbonVisible(true)} style={[styles.peekButton, { backgroundColor: colors.primary }]}>
                  <Ionicons name="chevron-down" size={16} color="#FFF" />
                </Pressable>
              )}
            </View>

            {ribbonVisible && (
              <Animated.View
                style={[
                  styles.docCard,
                  {
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    borderColor: 'rgba(255,255,255,0.12)',
                    opacity: docFade,
                    transform: [{ translateY: docSlide }],
                  },
                  Shadows.sm,
                ]}
              >
                <Text style={[styles.docTitle, { color: colors.text }]}>{RIYADHOH_DOCS[selectedDoc].title}</Text>
                <Text style={[styles.docBody, { color: colors.textSecondary }]}>{RIYADHOH_DOCS[selectedDoc].body}</Text>
              </Animated.View>
            )}

            {/* Progress Card */}
            <View style={[styles.progressCard, { backgroundColor: colors.card, borderColor: colors.border }, Shadows.md]}>
              <ShimmerGold style={styles.shimmer} />
              <View style={styles.progressRow}>
                {/* Circular Ring */}
                <View style={styles.ringContainer}>
                  <View style={[styles.ringOuter, { borderColor: colors.surface }]}>
                    <View style={[styles.ringFill, { borderColor: colors.primary, borderTopColor: progress.pct > 25 ? colors.primary : 'transparent', borderRightColor: progress.pct > 50 ? colors.primary : 'transparent', borderBottomColor: progress.pct > 75 ? colors.primary : 'transparent' }]} />
                    <View style={styles.ringInner}>
                      <Text style={[styles.ringPct, { color: colors.primary }]}>{progress.pct}%</Text>
                    </View>
                  </View>
                  <Text style={[styles.ringLabel, { color: colors.textSecondary }]}>Progress Hari Ini</Text>
                </View>
                {/* Stats */}
                <View style={styles.statsCol}>
                  <View style={styles.statRow}>
                    <Ionicons name="flame" size={20} color={colors.gold} />
                    <Text style={[styles.statVal, { color: colors.gold }]}>{streak}</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Hari Istiqamah</Text>
                  </View>
                  <View style={styles.statRow}>
                    <Ionicons name="checkmark-done" size={20} color={colors.success} />
                    <Text style={[styles.statVal, { color: colors.success }]}>{progress.done}</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>dari {progress.total}</Text>
                  </View>
                </View>
              </View>

              {allDone && (
                <View style={[styles.completeBanner, { backgroundColor: colors.success + '15' }]}>
                  <Text style={[styles.completeText, { color: colors.success }]}>
                    MasyaAllah! Hari ini kamu telah menyelesaikan Riyadhoh. Semoga Allah menerima amal kita.
                  </Text>
                </View>
              )}
            </View>

            {/* Weekly Chart */}
            <View style={[styles.weekCard, { backgroundColor: colors.card, borderColor: colors.border }, Shadows.sm]}>
              <Text style={[styles.weekTitle, { color: colors.text }]}>Progress 7 Hari</Text>
              <View style={styles.chartRow}>
                {weeklyData.map((day, i) => (
                  <View key={day.date} style={styles.chartCol}>
                    <View style={[styles.chartBarBg, { backgroundColor: colors.surface }]}>
                      <View style={[styles.chartBarFill, { height: `${Math.max(day.pct, 4)}%`, backgroundColor: day.isToday ? colors.primary : colors.primaryLight }]} />
                    </View>
                    <Text style={[styles.chartDay, { color: day.isToday ? colors.primary : colors.textMuted, fontWeight: day.isToday ? '700' : '400' }]}>{DAYS[i]}</Text>
                  </View>
                ))}
              </View>
              {streak >= 3 && (
                <Text style={[styles.streakMsg, { color: colors.gold }]}>
                  🔥 {streak} Hari Istiqamah — MasyaAllah! Pertahankan istiqamahmu.
                </Text>
              )}
            </View>

            {/* Section label */}
            <Text style={[styles.checklistLabel, { color: colors.text }]}>Checklist Ibadah Hari Ini</Text>
            <Text style={[styles.rawatibHint, { color: colors.textSecondary }]}>Rawatib Muakkadah: 12 rakaat dalam 5 waktu sunnah</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

export default memo(RiyadhohScreen);

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 56, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md },
  title: { fontSize: FontSize.xxl, fontWeight: '800' },
  subtitle: { fontSize: FontSize.sm, marginTop: 2 },
  ribbonWrapper: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderColor: 'rgba(255,255,255,0.12)',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
  },
  ribbonMenu: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: Spacing.sm, flexWrap: 'wrap' },
  ribbonButtonWrap: { overflow: 'visible' },
  ribbonChip: {
    position: 'relative',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: BorderRadius.md,
    minHeight: 36,
    justifyContent: 'center',
    borderWidth: 1,
    overflow: 'hidden',
  },
  ribbonGlow: {
    ...StyleSheet.absoluteFill,
    borderRadius: BorderRadius.md,
  },
  ribbonChipText: { fontSize: FontSize.xs, fontWeight: '700', letterSpacing: 0.2 },
  hideRibbonButton: { marginLeft: 'auto', width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.08)' },
  peekButton: { alignSelf: 'center', width: 42, height: 32, borderRadius: BorderRadius.full, alignItems: 'center', justifyContent: 'center', marginVertical: 4 },
  docCard: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
  },
  docTitle: { fontSize: FontSize.lg, fontWeight: '800', marginBottom: Spacing.sm },
  docBody: { fontSize: FontSize.sm, lineHeight: 22, textAlign: 'left' },
  progressCard: { marginHorizontal: Spacing.lg, marginTop: Spacing.md, borderRadius: BorderRadius.lg, overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth },
  shimmer: { height: 3 },
  progressRow: { flexDirection: 'row', padding: Spacing.lg, gap: Spacing.lg },
  ringContainer: { alignItems: 'center' },
  ringOuter: { width: 80, height: 80, borderRadius: 40, borderWidth: 6, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  ringFill: { position: 'absolute', width: 80, height: 80, borderRadius: 40, borderWidth: 6, top: -6, left: -6 },
  ringInner: { alignItems: 'center', justifyContent: 'center' },
  ringPct: { fontSize: FontSize.xl, fontWeight: '800' },
  ringLabel: { fontSize: FontSize.xs, marginTop: 4 },
  statsCol: { flex: 1, justifyContent: 'center', gap: Spacing.md },
  statRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statVal: { fontSize: FontSize.xl, fontWeight: '800' },
  statLabel: { fontSize: FontSize.sm },
  completeBanner: { marginHorizontal: Spacing.md, marginBottom: Spacing.md, padding: Spacing.md, borderRadius: BorderRadius.md },
  completeText: { fontSize: FontSize.sm, fontWeight: '600', textAlign: 'center', lineHeight: 20 },
  weekCard: { marginHorizontal: Spacing.lg, marginTop: Spacing.md, padding: Spacing.md, borderRadius: BorderRadius.lg, borderWidth: StyleSheet.hairlineWidth },
  weekTitle: { fontSize: FontSize.lg, fontWeight: '700', marginBottom: Spacing.sm },
  chartRow: { flexDirection: 'row', height: 80, gap: 4 },
  chartCol: { flex: 1, alignItems: 'center' },
  chartBarBg: { flex: 1, width: '70%', borderRadius: 4, overflow: 'hidden', justifyContent: 'flex-end' },
  chartBarFill: { width: '100%', borderRadius: 4 },
  chartDay: { fontSize: FontSize.xs, marginTop: 4 },
  streakMsg: { fontSize: FontSize.sm, fontWeight: '600', textAlign: 'center', marginTop: Spacing.sm },
  checklistLabel: { fontSize: FontSize.lg, fontWeight: '700', marginHorizontal: Spacing.lg, marginTop: Spacing.lg, marginBottom: Spacing.sm },
  listContent: { paddingBottom: 24 },
  sectionTitle: { fontSize: FontSize.sm, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginTop: Spacing.sm, marginBottom: Spacing.sm, marginHorizontal: Spacing.lg },
  checkCard: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, borderRadius: BorderRadius.lg, borderWidth: 1, marginBottom: Spacing.sm, marginHorizontal: Spacing.lg, gap: Spacing.sm },
  checkName: { fontSize: FontSize.md, fontWeight: '600', flex: 1 },
  rakaatLabel: { fontSize: FontSize.xs, fontWeight: '800' },
  rawatibHint: { fontSize: FontSize.xs, marginHorizontal: Spacing.lg, marginBottom: Spacing.sm },
  doneLabel: { fontSize: FontSize.xs, fontWeight: '600' },
});
