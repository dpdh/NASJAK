import React, { memo, useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppStore } from '../../store/appStore';
import { Colors, Spacing, BorderRadius, FontSize, Shadows } from '../../constants/theme';
import { MOTIVASI_QUOTES, SAMPLE_EVENTS, SAMPLE_TESTIMONIALS } from '../../constants/data';

type ResultType = 'motivasi' | 'event' | 'testimoni' | 'quran' | 'hadis';

interface SearchResult {
  id: string;
  type: ResultType;
  title: string;
  subtitle: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  route?: string;
}

const TYPE_ICONS: Record<ResultType, React.ComponentProps<typeof Ionicons>['name']> = {
  quran: 'book', hadis: 'library', motivasi: 'bulb', event: 'calendar', testimoni: 'heart',
};

const TYPE_LABELS: Record<ResultType, string> = {
  quran: "Al-Qur'an", hadis: 'Hadis', motivasi: 'Motivasi', event: 'Event', testimoni: 'Testimoni',
};

function SearchScreen() {
  const theme = useAppStore((s) => s.theme);
  const colors = Colors[theme];
  const [query, setQuery] = useState('');

  const results = useMemo<SearchResult[]>(() => {
    if (query.trim().length < 2) return [];
    const q = query.toLowerCase();
    const out: SearchResult[] = [];

    // Search motivasi
    for (const m of MOTIVASI_QUOTES) {
      if (m.text.toLowerCase().includes(q) || m.author.toLowerCase().includes(q) || m.category.toLowerCase().includes(q)) {
        out.push({ id: `m-${m.id}`, type: 'motivasi', title: m.text.substring(0, 60) + '...', subtitle: `${m.author} • ${m.category}`, icon: 'bulb', route: '/motivasi/' });
      }
    }
    // Search events
    for (const e of SAMPLE_EVENTS) {
      if (e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q) || e.type.toLowerCase().includes(q)) {
        out.push({ id: `e-${e.id}`, type: 'event', title: e.title, subtitle: `${e.date} • ${e.location}`, icon: 'calendar', route: `/event/${e.id}` });
      }
    }
    // Search testimonials
    for (const t of SAMPLE_TESTIMONIALS) {
      if (t.text.toLowerCase().includes(q) || t.name.toLowerCase().includes(q) || t.program.toLowerCase().includes(q)) {
        out.push({ id: `t-${t.id}`, type: 'testimoni', title: t.name, subtitle: t.text.substring(0, 60) + '...', icon: 'heart', route: '/testimoni/' });
      }
    }
    // Static search hints for quran/hadis
    if ('quran'.includes(q) || 'al-quran'.includes(q) || 'surah'.includes(q) || 'ayat'.includes(q)) {
      out.push({ id: 'quran', type: 'quran', title: "Al-Qur'an", subtitle: '114 Surah lengkap', icon: 'book', route: '/(tabs)/quran' });
    }
    if ('hadis'.includes(q) || 'hadith'.includes(q) || 'bukhari'.includes(q) || 'muslim'.includes(q)) {
      out.push({ id: 'hadis', type: 'hadis', title: 'Hadis', subtitle: '9 Kitab • 38,000+ hadis', icon: 'library', route: '/hadis/' });
    }
    if ('tsn'.includes(q) || 'temu solusi'.includes(q)) {
      out.push({ id: 'tsn', type: 'event', title: 'Temu Solusi NASUHA', subtitle: 'Program TSN', icon: 'people', route: '/tsn/' });
    }
    if ('lbu'.includes(q) || 'bebas utang'.includes(q) || 'lunasi'.includes(q)) {
      out.push({ id: 'lbu', type: 'event', title: 'Langkah Bebas Utang', subtitle: 'Program LBU', icon: 'rocket', route: '/lbu/' });
    }

    return out.slice(0, 20);
  }, [query]);

  const renderItem = useCallback(
    ({ item }: { item: SearchResult }) => (
      <Pressable
        onPress={() => item.route && router.push(item.route as any)}
        style={[styles.resultCard, { backgroundColor: colors.card, borderColor: colors.border }, Shadows.sm]}
      >
        <View style={[styles.resultIcon, { backgroundColor: colors.primary + '15' }]}>
          <Ionicons name={item.icon} size={20} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.resultHeaderRow}>
            <Text style={[styles.resultTitle, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
            <View style={[styles.typeBadge, { backgroundColor: colors.surface }]}>
              <Text style={[styles.typeText, { color: colors.textSecondary }]}>{TYPE_LABELS[item.type]}</Text>
            </View>
          </View>
          <Text style={[styles.resultSub, { color: colors.textSecondary }]} numberOfLines={1}>{item.subtitle}</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
      </Pressable>
    ),
    [colors],
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="search-outline" size={20} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Cari apa yang sedang kamu butuhkan..."
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={setQuery}
            autoFocus
            autoCorrect={false}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </Pressable>
          )}
        </View>
      </View>

      {query.length < 2 ? (
        <View style={styles.hintBox}>
          <Ionicons name="search" size={48} color={colors.textMuted} />
          <Text style={[styles.hintText, { color: colors.textSecondary }]}>
            Cari ayat Al-Qur'an, Hadis, Motivasi, Event, TSN, LBU, Testimoni...
          </Text>
        </View>
      ) : results.length === 0 ? (
        <View style={styles.hintBox}>
          <Ionicons name="sad-outline" size={48} color={colors.textMuted} />
          <Text style={[styles.hintText, { color: colors.textSecondary }]}>
            Tidak ditemukan hasil untuk "{query}"
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

export default memo(SearchScreen);

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 56, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md, gap: Spacing.sm },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', borderRadius: BorderRadius.md, paddingHorizontal: Spacing.md, height: 44, borderWidth: 1, gap: 8 },
  searchInput: { flex: 1, fontSize: FontSize.md, height: 44 },
  list: { padding: Spacing.lg, gap: Spacing.sm },
  resultCard: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, borderRadius: BorderRadius.lg, borderWidth: StyleSheet.hairlineWidth, gap: Spacing.md },
  resultIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  resultHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  resultTitle: { fontSize: FontSize.md, fontWeight: '700', flex: 1 },
  typeBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  typeText: { fontSize: 9, fontWeight: '700' },
  resultSub: { fontSize: FontSize.xs, marginTop: 2 },
  hintBox: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl, gap: Spacing.md },
  hintText: { fontSize: FontSize.md, textAlign: 'center', lineHeight: 22 },
});
