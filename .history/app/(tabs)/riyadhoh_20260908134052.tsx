import React, { memo, useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAppStore } from '../../store/appStore';
import { Colors, Spacing, BorderRadius, FontSize, Shadows } from '../../constants/theme';
import { RIYADHOH_ITEMS } from '../../constants/data';
import { ShimmerGold } from '../../components/ui/ShimmerGold';

interface RiyadhohRow { id: string; name: string; icon: string; done: boolean; rakaat?: number; }

const DAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

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
  progressCard: { marginHorizontal: Spacing.lg, borderRadius: BorderRadius.lg, overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth },
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
