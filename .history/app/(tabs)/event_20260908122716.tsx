import React, { memo, useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppStore } from '../../store/appStore';
import { Colors, Spacing, BorderRadius, FontSize, Shadows } from '../../constants/theme';
import { SAMPLE_EVENTS } from '../../constants/data';
import type { Event } from '../../types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function EventTabScreen() {
  const theme = useAppStore((s) => s.theme);
  const storeEvents = useAppStore((s) => s.events);
  const colors = Colors[theme];
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState('Semua');

  const allEvents = useMemo(() => {
    const combined: Event[] = [
      ...SAMPLE_EVENTS.map((e) => ({ ...e, status: 'published' as const })),
      ...storeEvents,
    ];
    // Remove duplicates by id (store events override sample)
    const map = new Map<number, Event>();
    combined.forEach((e) => map.set(e.id, e));
    let list = Array.from(map.values()).filter((e) => (e.status || 'published') !== 'cancelled');
    if (filter !== 'Semua') list = list.filter((e) => e.type === filter);
    return list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [storeEvents, filter]);

  const renderItem = useCallback(
    ({ item }: { item: Event }) => {
      const pct = Math.round((item.registered / item.quota) * 100);
      return (
        <Pressable
          onPress={() => router.push(`/event/${item.id}` as any)}
          style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }, Shadows.sm]}
        >
          <View style={[styles.badge, { backgroundColor: colors.primary }]}>
            <Text style={styles.badgeText}>{item.type}</Text>
          </View>
          <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
          <View style={styles.meta}>
            <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>{item.date}</Text>
            <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>{item.time}</Text>
          </View>
          <View style={styles.locRow}>
            <Ionicons name="location-outline" size={14} color={colors.textMuted} />
            <Text style={[styles.locText, { color: colors.textMuted }]} numberOfLines={1}>{item.location}</Text>
          </View>
          <Text style={[styles.desc, { color: colors.textSecondary }]} numberOfLines={2}>{item.description}</Text>
          <View style={styles.footer}>
            <View style={[styles.progressBar, { backgroundColor: colors.surface }]}>
              <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: pct >= 90 ? colors.warning : colors.primary }]} />
            </View>
            <Text style={[styles.quota, { color: colors.textMuted }]}>{item.registered}/{item.quota}</Text>
          </View>
          <View style={styles.btnRow}>
            <Pressable style={[styles.detailBtn, { borderColor: colors.primary }]}>
              <Text style={[styles.detailBtnText, { color: colors.primary }]}>DETAIL EVENT</Text>
            </Pressable>
            <Pressable style={[styles.daftarBtn, { backgroundColor: colors.primary }]}>
              <Text style={styles.daftarBtnText}>DAFTAR</Text>
            </Pressable>
          </View>
        </Pressable>
      );
    },
    [colors],
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card, paddingTop: insets.top + Spacing.md }]}> 
        <Text style={[styles.headerTitle, { color: colors.text }]}>Event NASUHA</Text>
        <Text style={[styles.headerSub, { color: colors.textSecondary }]}>Jakarta & Sekitarnya</Text>
      </View>
      {/* Quick filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {['Semua', 'TSN', 'LBU', 'Kajian', 'KFM', 'TOT', 'Scale Up Bisnis', 'Safari Dakwah', 'Digital Marketing', 'Public Speaking', 'Business Coaching'].map((f) => (
          <Pressable key={f} onPress={() => setFilter(f)} style={[styles.filterChip, { backgroundColor: f === filter ? colors.primary : colors.surface }]}>
            <Text style={{ color: f === filter ? '#FFF' : colors.textSecondary, fontSize: FontSize.xs, fontWeight: '600' }}>{f}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <FlatList
        data={allEvents}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
      />
    </View>
  );
}

export default memo(EventTabScreen);

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md },
  headerTitle: { fontSize: FontSize.xxl, fontWeight: '800' },
  headerSub: { fontSize: FontSize.sm, marginTop: 2 },
  filterRow: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, gap: Spacing.sm },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: BorderRadius.full },
  list: { padding: Spacing.lg, gap: Spacing.md },
  card: { borderRadius: BorderRadius.lg, padding: Spacing.md, borderWidth: StyleSheet.hairlineWidth },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: BorderRadius.sm },
  badgeText: { color: '#FFF', fontSize: FontSize.xs, fontWeight: '700' },
  title: { fontSize: FontSize.lg, fontWeight: '700', marginTop: 6 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  metaText: { fontSize: FontSize.sm },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  locText: { fontSize: FontSize.xs, flex: 1 },
  desc: { fontSize: FontSize.sm, lineHeight: 18, marginTop: 6 },
  footer: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 },
  progressBar: { flex: 1, height: 4, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: 4, borderRadius: 2 },
  quota: { fontSize: FontSize.xs },
  btnRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md },
  detailBtn: { flex: 1, paddingVertical: 10, borderRadius: BorderRadius.lg, borderWidth: 1.5, alignItems: 'center' },
  detailBtnText: { fontSize: FontSize.sm, fontWeight: '700' },
  daftarBtn: { flex: 1, paddingVertical: 10, borderRadius: BorderRadius.lg, alignItems: 'center' },
  daftarBtnText: { color: '#FFF', fontSize: FontSize.sm, fontWeight: '700' },
});
