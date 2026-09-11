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
import { Colors, Spacing, BorderRadius, FontSize, Shadows, getColors } from '../../constants/theme';
import { SAMPLE_TESTIMONIALS, NASUHA_KORDA } from '../../constants/data';
import type { Testimonial } from '../../types';

const TestimonialCard = memo(({ item, colors }: { item: Testimonial; colors: typeof Colors.light }) => (
  <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }, Shadows.sm]}>
    <View style={styles.cardHeader}>
      <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
        <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
        <View style={styles.row}>
          <View style={[styles.programBadge, { backgroundColor: colors.gold + '20' }]}>
            <Text style={[styles.programText, { color: colors.gold }]}>{item.program}</Text>
          </View>
          {item.korda && (
            <View style={[styles.kordaBadge, { backgroundColor: colors.primary + '15' }]}>
              <Ionicons name="location" size={9} color={colors.primary} />
              <Text style={[styles.kordaText, { color: colors.primary }]}>{item.korda}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
    <View style={styles.ratingRow}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Ionicons key={i} name={i < item.rating ? 'star' : 'star-outline'} size={14} color={colors.gold} />
      ))}
      <Text style={[styles.date, { color: colors.textMuted }]}>{new Date(item.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'short' })}</Text>
    </View>
    <Text style={[styles.text, { color: colors.textSecondary }]}>{item.text}</Text>
  </View>
));

function TestimoniScreen() {
  const theme = useAppStore((s) => s.theme);
  const colorScheme = useAppStore((s) => s.colorScheme);
  const colors = getColors(colorScheme)[theme];
  const [activeKorda, setActiveKorda] = useState('Semua');

  const filtered = useMemo(() => {
    if (activeKorda === 'Semua') return SAMPLE_TESTIMONIALS;
    return SAMPLE_TESTIMONIALS.filter((t) => t.korda === activeKorda);
  }, [activeKorda]);

  const renderItem = useCallback(
    ({ item }: { item: Testimonial }) => <TestimonialCard item={item} colors={colors} />,
    [colors],
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Testimoni Sahabat</Text>
          <Text style={[styles.headerSub, { color: colors.textSecondary }]}>{SAMPLE_TESTIMONIALS.length} cerita dari {NASUHA_KORDA.length} Korda</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      {/* Korda Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {['Semua', ...NASUHA_KORDA].map((k) => {
          const isActive = activeKorda === k;
          const count = k === 'Semua' ? SAMPLE_TESTIMONIALS.length : SAMPLE_TESTIMONIALS.filter((t) => t.korda === k).length;
          if (k !== 'Semua' && count === 0) return null;
          return (
            <Pressable
              key={k}
              onPress={() => setActiveKorda(k)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: isActive ? colors.primary : colors.surface,
                  borderColor: isActive ? colors.primary : colors.border,
                  shadowOpacity: isActive ? 0.2 : 0,
                },
              ]}
            >
              <Text style={[styles.filterText, { color: isActive ? '#FFF' : colors.textSecondary }]}>
                {k === 'Semua' ? 'Semua' : k.replace('Korda ', '')}
              </Text>
              <View style={[styles.filterCount, { backgroundColor: isActive ? 'rgba(255,255,255,0.18)' : colors.border }]}>
                <Text style={[styles.filterCountText, { color: isActive ? '#FFF' : colors.textMuted }]}>{count}</Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="chatbubbles-outline" size={48} color={colors.textMuted} />
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>Belum ada testimoni dari {activeKorda}</Text>
          </View>
        }
      />

      {/* FAB Tulis Testimoni */}
      <Pressable onPress={() => router.push('/testimoni/add' as any)} style={[styles.fab, { backgroundColor: colors.gold }, Shadows.md]}>
        <Ionicons name="create" size={24} color="#FFF" />
      </Pressable>
    </View>
  );
}

export default memo(TestimoniScreen);

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 56,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: { fontSize: FontSize.xl, fontWeight: '800', letterSpacing: 0.2 },
  headerSub: { fontSize: FontSize.xs, marginTop: 2, letterSpacing: 0.1 },
  filterRow: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, gap: Spacing.sm },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(148, 163, 184, 0.25)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    shadowOpacity: 0.08,
  },
  filterText: { fontSize: FontSize.xs, fontWeight: '700', letterSpacing: 0.1 },
  filterCount: { minWidth: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 },
  filterCountText: { fontSize: 9, fontWeight: '700' },
  list: { padding: Spacing.lg, gap: Spacing.md, paddingBottom: 100 },
  card: { borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: StyleSheet.hairlineWidth },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.sm },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#FFF', fontWeight: '700', fontSize: FontSize.lg },
  name: { fontSize: FontSize.lg, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3, flexWrap: 'wrap' },
  programBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: BorderRadius.sm, maxWidth: '60%' },
  programText: { fontSize: FontSize.xs, fontWeight: '700' },
  kordaBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: BorderRadius.full, maxWidth: '38%' },
  kordaText: { fontSize: 10, fontWeight: '700' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 2, marginBottom: Spacing.sm },
  date: { fontSize: FontSize.xs, marginLeft: 'auto' },
  text: { fontSize: FontSize.md, lineHeight: 22 },
  empty: { alignItems: 'center', paddingTop: Spacing.xxl, gap: Spacing.sm },
  emptyText: { fontSize: FontSize.md },
  fab: { position: 'absolute', bottom: 24, right: 20, width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
});
