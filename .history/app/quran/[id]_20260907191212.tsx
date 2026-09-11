import React, { memo, useCallback, useEffect, useMemo, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
  Alert,
  Share,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { useAppStore } from '../../store/appStore';
import { Colors, Spacing, BorderRadius, FontSize, Shadows } from '../../constants/theme';
import { fetchSurahDetail, mapAyahToLocal } from '../../services/quranApi';
import type { QuranAyah } from '../../types';

const formatAyahText = (item: QuranAyah, surahName: string) =>
  `QS. ${surahName} [${item.surahId}]:${item.ayahNumber}\n\n${item.arabic}\n\n${item.translation}\n\n— NASUHA App`;

const AyahItem = memo(
  ({ item, bookmarked, isLastRead, onToggle, onMarkRead, onCopy, onShare, colors, fontSize }: {
    item: QuranAyah; bookmarked: boolean; isLastRead: boolean;
    onToggle: (key: string) => void; onMarkRead: (ayah: number) => void;
    onCopy: (item: QuranAyah) => void; onShare: (item: QuranAyah) => void;
    colors: typeof Colors.light;
    fontSize: number;
  }) => {
    const key = `${item.surahId}:${item.ayahNumber}`;
    return (
      <View style={[
        styles.ayahCard,
        { backgroundColor: colors.card, borderColor: isLastRead ? colors.gold : colors.border },
        isLastRead && { borderWidth: 2 },
        Shadows.sm,
      ]}>
        {/* Last read badge */}
        {isLastRead && (
          <View style={[styles.lastReadBadge, { backgroundColor: colors.gold }]}>
            <Ionicons name="bookmark" size={10} color="#FFF" />
            <Text style={styles.lastReadBadgeText}>Terakhir Dibaca</Text>
          </View>
        )}

        <View style={styles.ayahHeader}>
          <View style={[styles.ayahNum, { backgroundColor: isLastRead ? colors.gold : colors.primary }]}>
            <Text style={styles.ayahNumText}>{item.ayahNumber}</Text>
          </View>
          <View style={styles.actionRow}>
            {/* Copy */}
            <Pressable onPress={() => onCopy(item)} hitSlop={8}
              style={[styles.actionBtn, { backgroundColor: colors.textMuted + '15' }]}>
              <Ionicons name="copy-outline" size={16} color={colors.textMuted} />
            </Pressable>
            {/* Share */}
            <Pressable onPress={() => onShare(item)} hitSlop={8}
              style={[styles.actionBtn, { backgroundColor: colors.textMuted + '15' }]}>
              <Ionicons name="share-social-outline" size={16} color={colors.textMuted} />
            </Pressable>
            {/* Mark as last read */}
            <Pressable onPress={() => onMarkRead(item.ayahNumber)} hitSlop={8}
              style={[styles.actionBtn, { backgroundColor: (isLastRead ? colors.gold : colors.textMuted) + '15' }]}>
              <Ionicons name={isLastRead ? 'flag' : 'flag-outline'} size={16} color={isLastRead ? colors.gold : colors.textMuted} />
            </Pressable>
            {/* Bookmark */}
            <Pressable onPress={() => onToggle(key)} hitSlop={8}
              style={[styles.actionBtn, { backgroundColor: (bookmarked ? colors.gold : colors.textMuted) + '15' }]}>
              <Ionicons name={bookmarked ? 'bookmark' : 'bookmark-outline'} size={16} color={bookmarked ? colors.gold : colors.textMuted} />
            </Pressable>
          </View>
        </View>
        <Text style={[styles.arabic, { color: colors.text, fontSize }]}>{item.arabic}</Text>
        <Text style={[styles.latin, { color: colors.primary }]}>{item.latin}</Text>
        <Text style={[styles.translation, { color: colors.textSecondary }]}>{item.translation}</Text>
      </View>
    );
  },
);

function QuranDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useAppStore((s) => s.theme);
  const bookmarkedAyahs = useAppStore((s) => s.bookmarkedAyahs);
  const toggleBookmarkAyah = useAppStore((s) => s.toggleBookmarkAyah);
  const lastReadAyahs = useAppStore((s) => s.lastReadAyahs);
  const setLastReadAyah = useAppStore((s) => s.setLastReadAyah);
  const quranFontSize = useAppStore((s) => s.quranFontSize);
  const colors = Colors[theme];
  const flatListRef = useRef<FlatList>(null);

  const surahId = Number(id);
  const [ayahs, setAyahs] = useState<QuranAyah[]>([]);
  const [surahName, setSurahName] = useState('');
  const [surahArabic, setSurahArabic] = useState('');
  const [totalAyat, setTotalAyat] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showJumpPicker, setShowJumpPicker] = useState(false);

  const lastReadAyah = lastReadAyahs[String(surahId)] || 0;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const detail = await fetchSurahDetail(surahId);
        if (!cancelled) {
          setSurahName(detail.namaLatin);
          setSurahArabic(detail.nama);
          setTotalAyat(detail.jumlahAyat);
          setAyahs(detail.ayat.map((a) => mapAyahToLocal(surahId, a)));
        }
      } catch (e: any) {
        if (!cancelled) setError(e.message || 'Gagal memuat ayat');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [surahId]);

  // Auto-scroll to last read ayah after data loads
  useEffect(() => {
    if (!loading && ayahs.length > 0 && lastReadAyah > 0) {
      const idx = ayahs.findIndex((a) => a.ayahNumber === lastReadAyah);
      if (idx > 0) {
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({ index: idx, animated: true, viewPosition: 0.3 });
        }, 500);
      }
    }
  }, [loading, ayahs.length, lastReadAyah]);

  const bookmarkSet = useMemo(() => new Set(bookmarkedAyahs), [bookmarkedAyahs]);

  const handleToggle = useCallback(
    (key: string) => toggleBookmarkAyah(key),
    [toggleBookmarkAyah],
  );

  const handleMarkRead = useCallback(
    (ayahNumber: number) => {
      setLastReadAyah(surahId, ayahNumber);
    },
    [surahId, setLastReadAyah],
  );

  const handleCopyAyah = useCallback(
    async (item: QuranAyah) => {
      const text = formatAyahText(item, surahName || `Surah ${surahId}`);
      await Clipboard.setStringAsync(text);
      Alert.alert('Berhasil', `Ayat ${item.ayahNumber} berhasil disalin`);
    },
    [surahName, surahId],
  );

  const handleShareAyah = useCallback(
    async (item: QuranAyah) => {
      const text = formatAyahText(item, surahName || `Surah ${surahId}`);
      try {
        await Share.share({ message: text });
      } catch { /* user cancelled */ }
    },
    [surahName, surahId],
  );

  const handleJumpToAyah = useCallback((ayahNumber: number) => {
    const idx = ayahs.findIndex((a) => a.ayahNumber === ayahNumber);
    if (idx >= 0) {
      flatListRef.current?.scrollToIndex({ index: idx, animated: true, viewPosition: 0.3 });
    }
    setShowJumpPicker(false);
  }, [ayahs]);

  const renderItem = useCallback(
    ({ item }: { item: QuranAyah }) => (
      <AyahItem
        item={item}
        bookmarked={bookmarkSet.has(`${item.surahId}:${item.ayahNumber}`)}
        isLastRead={item.ayahNumber === lastReadAyah}
        onToggle={handleToggle}
        onMarkRead={handleMarkRead}
        onCopy={handleCopyAyah}
        onShare={handleShareAyah}
        colors={colors}
      />
    ),
    [bookmarkSet, handleToggle, handleMarkRead, handleCopyAyah, handleShareAyah, lastReadAyah, colors],
  );

  const onScrollToIndexFailed = useCallback((info: { index: number }) => {
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({ index: info.index, animated: true, viewPosition: 0.3 });
    }, 200);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Pressable onPress={() => setShowJumpPicker(!showJumpPicker)} style={{ flex: 1, alignItems: 'center' }}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{surahName || `Surah ${surahId}`}</Text>
          <Text style={[styles.headerSub, { color: colors.textSecondary }]}>
            {surahArabic ? `${surahArabic} • ` : ''}{totalAyat || '...'} ayat
            {lastReadAyah > 0 ? ` • Ayat ${lastReadAyah}` : ''}
          </Text>
        </Pressable>
        <Pressable onPress={() => setShowJumpPicker(!showJumpPicker)} hitSlop={12}>
          <Ionicons name="navigate-outline" size={22} color={colors.primary} />
        </Pressable>
      </View>

      {/* Jump to Ayah Picker */}
      {showJumpPicker && totalAyat > 0 && (
        <View style={[styles.jumpPicker, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <Text style={[styles.jumpLabel, { color: colors.textSecondary }]}>Lompat ke ayat:</Text>
          <FlatList
            data={Array.from({ length: totalAyat }, (_, i) => i + 1)}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(n) => String(n)}
            contentContainerStyle={styles.jumpList}
            renderItem={({ item: n }) => (
              <Pressable
                onPress={() => handleJumpToAyah(n)}
                style={[
                  styles.jumpChip,
                  {
                    backgroundColor: n === lastReadAyah ? colors.gold : colors.surface,
                    borderColor: n === lastReadAyah ? colors.gold : colors.border,
                  },
                ]}
              >
                {n === lastReadAyah && <Ionicons name="bookmark" size={10} color="#FFF" />}
                <Text style={[styles.jumpChipText, { color: n === lastReadAyah ? '#FFF' : colors.text }]}>{n}</Text>
              </Pressable>
            )}
          />
        </View>
      )}

      {/* Last Read Banner */}
      {!loading && lastReadAyah > 0 && !showJumpPicker && (
        <Pressable
          onPress={() => handleJumpToAyah(lastReadAyah)}
          style={[styles.lastReadBanner, { backgroundColor: colors.gold + '15', borderBottomColor: colors.gold + '30' }]}
        >
          <Ionicons name="bookmark" size={16} color={colors.gold} />
          <Text style={[styles.lastReadText, { color: colors.gold }]}>
            Terakhir dibaca: Ayat {lastReadAyah}
          </Text>
          <Text style={[styles.lastReadCta, { color: colors.gold }]}>Lanjutkan →</Text>
        </Pressable>
      )}

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Memuat ayat...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Ionicons name="cloud-offline-outline" size={48} color={colors.textMuted} />
          <Text style={[styles.errorText, { color: colors.textSecondary }]}>{error}</Text>
          <Pressable
            onPress={() => {
              setLoading(true);
              setError(null);
              fetchSurahDetail(surahId)
                .then((d) => {
                  setSurahName(d.namaLatin);
                  setSurahArabic(d.nama);
                  setTotalAyat(d.jumlahAyat);
                  setAyahs(d.ayat.map((a) => mapAyahToLocal(surahId, a)));
                })
                .catch((e) => setError(e.message))
                .finally(() => setLoading(false));
            }}
            style={[styles.retryBtn, { borderColor: colors.primary }]}
          >
            <Text style={[styles.retryText, { color: colors.primary }]}>Coba Lagi</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={ayahs}
          keyExtractor={(item) => `${item.surahId}:${item.ayahNumber}`}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews
          initialNumToRender={15}
          maxToRenderPerBatch={10}
          windowSize={7}
          onScrollToIndexFailed={onScrollToIndexFailed}
          ListHeaderComponent={
            surahId !== 1 && surahId !== 9 ? (
              <View style={[styles.bismillah, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.bismillahText, { color: colors.text }]}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</Text>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}

export default memo(QuranDetailScreen);

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 56, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md, borderBottomWidth: StyleSheet.hairlineWidth },
  headerTitle: { fontSize: FontSize.xl, fontWeight: '800' },
  headerSub: { fontSize: FontSize.sm, marginTop: 2 },
  list: { padding: Spacing.lg, gap: Spacing.md, paddingBottom: 100 },
  ayahCard: { borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: StyleSheet.hairlineWidth },
  ayahHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  ayahNum: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  ayahNumText: { color: '#FFF', fontWeight: '700', fontSize: FontSize.sm },
  actionRow: { flexDirection: 'row', gap: 6 },
  actionBtn: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  arabic: { fontSize: 28, lineHeight: 52, textAlign: 'right', marginBottom: Spacing.sm, fontFamily: 'Lateef-Regular' },
  latin: { fontSize: FontSize.sm, fontStyle: 'italic', marginBottom: 4 },
  translation: { fontSize: FontSize.md, lineHeight: 22 },
  bismillah: { alignItems: 'center', padding: Spacing.lg, borderRadius: BorderRadius.lg, borderWidth: StyleSheet.hairlineWidth, marginBottom: Spacing.md },
  bismillahText: { fontSize: 32, lineHeight: 56, fontFamily: 'Lateef-Bold' },

  // Last Read Badge on card
  lastReadBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: BorderRadius.sm, marginBottom: Spacing.sm },
  lastReadBadgeText: { color: '#FFF', fontSize: 10, fontWeight: '700' },

  // Last Read Banner
  lastReadBanner: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderBottomWidth: 1, gap: Spacing.sm },
  lastReadText: { flex: 1, fontSize: FontSize.sm, fontWeight: '600' },
  lastReadCta: { fontSize: FontSize.sm, fontWeight: '700' },

  // Jump Picker
  jumpPicker: { paddingVertical: Spacing.sm, borderBottomWidth: StyleSheet.hairlineWidth },
  jumpLabel: { fontSize: FontSize.xs, fontWeight: '600', paddingHorizontal: Spacing.lg, marginBottom: Spacing.xs },
  jumpList: { paddingHorizontal: Spacing.lg, gap: 6 },
  jumpChip: { flexDirection: 'row', alignItems: 'center', gap: 3, minWidth: 36, height: 32, paddingHorizontal: 10, borderRadius: BorderRadius.full, borderWidth: 1, justifyContent: 'center' },
  jumpChipText: { fontSize: FontSize.sm, fontWeight: '700' },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl, gap: Spacing.md },
  loadingText: { fontSize: FontSize.md, marginTop: Spacing.sm },
  errorText: { fontSize: FontSize.md, textAlign: 'center', lineHeight: 22 },
  retryBtn: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: BorderRadius.lg, borderWidth: 1.5 },
  retryText: { fontSize: FontSize.md, fontWeight: '700' },
});
