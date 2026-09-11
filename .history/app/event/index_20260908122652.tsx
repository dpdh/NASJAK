import React, { memo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppStore } from '../../store/appStore';
import { Colors, Spacing, BorderRadius, FontSize, Shadows } from '../../constants/theme';
import { SAMPLE_EVENTS } from '../../constants/data';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function EventIndexScreen() {
  const theme = useAppStore((s) => s.theme);
  const colors = Colors[theme];
  const insets = useSafeAreaInsets();

  const renderItem = useCallback(
    ({ item }: { item: (typeof SAMPLE_EVENTS)[0] }) => {
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
          <Text style={[styles.location, { color: colors.textMuted }]} numberOfLines={1}>
            <Ionicons name="location-outline" size={12} color={colors.textMuted} /> {item.location}
          </Text>
          <View style={styles.footer}>
            <View style={[styles.progressBar, { backgroundColor: colors.surface }]}>
              <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: colors.primary }]} />
            </View>
            <Text style={[styles.quota, { color: colors.textMuted }]}>{item.registered}/{item.quota}</Text>
          </View>
        </Pressable>
      );
    },
    [colors],
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card, paddingTop: insets.top + Spacing.md }]}> 
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Event NASUHA</Text>
        <View style={{ width: 24 }} />
      </View>
      <FlatList
        data={SAMPLE_EVENTS}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
      />
    </View>
  );
}

export default memo(EventIndexScreen);

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 56, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md },
  headerTitle: { fontSize: FontSize.xl, fontWeight: '800' },
  list: { padding: Spacing.lg, gap: Spacing.md },
  card: { borderRadius: BorderRadius.lg, padding: Spacing.md, borderWidth: StyleSheet.hairlineWidth },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: BorderRadius.sm },
  badgeText: { color: '#FFF', fontSize: FontSize.xs, fontWeight: '700' },
  title: { fontSize: FontSize.lg, fontWeight: '700', marginTop: 6 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  metaText: { fontSize: FontSize.sm },
  location: { fontSize: FontSize.xs, marginTop: 4 },
  footer: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 },
  progressBar: { flex: 1, height: 4, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: 4, borderRadius: 2 },
  quota: { fontSize: FontSize.xs },
});
