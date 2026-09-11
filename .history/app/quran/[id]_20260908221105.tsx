import React, { memo, useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { useFonts } from 'expo-font';
import { Amiri_400Regular } from '@expo-google-fonts/amiri';
import { NotoNaskhArabic_400Regular } from '@expo-google-fonts/noto-naskh-arabic';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  ActivityIndicator,
  Alert,
  Share,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { useAppStore } from '../../store/appStore';
import { Colors, Spacing, BorderRadius, FontSize, Shadows } from '../../constants/theme';
import { fetchSurahDetail, mapAyahToLocal } from '../../services/quranApi';
import type { QuranAyah } from '../../types';

const formatAyahText = (item: QuranAyah, surahName: string) =>
  `QS. ${surahName} [${item.surahId}]:${item.ayahNumber}\n\n${item.arabic}\n\n${item.translation}\n\n— NASUHA App`;

type ArabicFont = 'NotoNaskhArabic-Regular' | 'Amiri-Regular' | 'Lateef-Regular';

const getArabicLineHeight = (fontSize: number, fontFamily: ArabicFont) => {
  const multiplier = fontFamily === 'Lateef-Regular' ? 1.2 : 1.5;
  return Math.round(fontSize * multiplier);
};

const AyahItem = memo(
  ({ item, bookmarked, isLastRead, isPlaying, arabicOnly, arabicFont, onToggle, onMarkRead, onCopy, onShare, onPlay, colors, fontSize }: {
    item: QuranAyah; bookmarked: boolean; isLastRead: boolean;
    onToggle: (key: string) => void; onMarkRead: (ayah: number) => void;
    onCopy: (item: QuranAyah) => void; onShare: (item: QuranAyah) => void; onPlay: (item: QuranAyah) => void;
    isPlaying: boolean; arabicOnly: boolean; arabicFont: ArabicFont;
    colors: typeof Colors.light;
    fontSize: number;
  }) => {
    const key = `${item.surahId}:${item.ayahNumber}`;
    return (
      <View style={[
        styles.ayahCard,
        { backgroundColor: arabicOnly ? 'transparent' : colors.card, borderColor: isLastRead ? colors.gold : colors.border },
        arabicOnly ? styles.arabicOnlyCard : styles.fullCard,
        isLastRead && !arabicOnly && { borderWidth: 2 },
        !arabicOnly && Shadows.sm,
      ]}>
        {/* Last read badge */}
        {isLastRead && !arabicOnly && (
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
            <Pressable onPress={() => onPlay(item)} hitSlop={8}
              style={[styles.actionBtn, { backgroundColor: (isPlaying ? colors.primary : colors.textMuted) + '15' }]}>
              <Ionicons name={isPlaying ? 'pause' : 'play'} size={16} color={isPlaying ? colors.primary : colors.textMuted} />
            </Pressable>
            {!arabicOnly && <>
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
            </>}
          </View>
        </View>
        <Text style={[
          styles.arabic,
          {
            color: colors.text,
            fontSize: Math.max(fontSize, 30),
            lineHeight: getArabicLineHeight(Math.max(fontSize, 30), arabicFont),
            fontFamily: arabicFont,
          },
        ]}>{item.arabic}</Text>
        {!arabicOnly && <Text style={[styles.latin, { color: colors.primary }]}>{item.latin}</Text>}
        {!arabicOnly && <Text style={[styles.translation, { color: colors.textSecondary }]}>{item.translation}</Text>}
      </View>
    );
  },
);

function QuranDetailScreen() {
  useFonts({
    'NotoNaskhArabic-Regular': NotoNaskhArabic_400Regular,
    'Amiri-Regular': Amiri_400Regular,
  });
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useAppStore((s) => s.theme);
  const bookmarkedAyahs = useAppStore((s) => s.bookmarkedAyahs);
  const toggleBookmarkAyah = useAppStore((s) => s.toggleBookmarkAyah);
  const lastReadAyahs = useAppStore((s) => s.lastReadAyahs);
  const setLastReadAyah = useAppStore((s) => s.setLastReadAyah);
  const quranFontSize = useAppStore((s) => s.quranFontSize);
  const colors = Colors[theme];
  const flatListRef = useRef<FlatList>(null);
  const audioPlayer = useAudioPlayer(null, { updateInterval: 100 });
  const audioStatus = useAudioPlayerStatus(audioPlayer);

  const surahId = Number(id);
  const [ayahs, setAyahs] = useState<QuranAyah[]>([]);
  const [surahName, setSurahName] = useState('');
  const [surahArabic, setSurahArabic] = useState('');
  const [totalAyat, setTotalAyat] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showJumpPicker, setShowJumpPicker] = useState(false);
  const [playingAyah, setPlayingAyah] = useState<string | null>(null);
  const [repeatCount, setRepeatCount] = useState(2);
  const [currentRepeat, setCurrentRepeat] = useState(0);
  const [rangeStart, setRangeStart] = useState('1');
  const [rangeEnd, setRangeEnd] = useState('1');
  const [rangePlayback, setRangePlayback] = useState<{ end: number } | null>(null);
  const [arabicOnly, setArabicOnly] = useState(false);
  const [arabicFont, setArabicFont] = useState<ArabicFont>('NotoNaskhArabic-Regular');
  const playingAyahRef = useRef<string | null>(null);
  const currentRepeatRef = useRef(0);
  const repeatCountRef = useRef(2);
  const rangePlaybackRef = useRef<{ end: number } | null>(null);
  const ayahsRef = useRef<QuranAyah[]>([]);

  const lastReadAyah = lastReadAyahs[String(surahId)] || 0;

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true, interruptionMode: 'duckOthers' }).catch(() => {});
  }, []);

  useEffect(() => {
    playingAyahRef.current = playingAyah;
    currentRepeatRef.current = currentRepeat;
    repeatCountRef.current = repeatCount;
    rangePlaybackRef.current = rangePlayback;
    ayahsRef.current = ayahs;
  }, [ayahs, currentRepeat, playingAyah, rangePlayback, repeatCount]);

  useEffect(() => {
    const subscription = audioPlayer.addListener('playbackStatusUpdate', (status) => {
      if (!status.didJustFinish) return;

      const activeAyah = playingAyahRef.current;
      if (!activeAyah) return;

      const nextRepeat = currentRepeatRef.current + 1;
      if (nextRepeat <= repeatCountRef.current) {
        currentRepeatRef.current = nextRepeat;
        setCurrentRepeat(nextRepeat);
        void audioPlayer.seekTo(0).then(() => audioPlayer.play());
        return;
      }

      const range = rangePlaybackRef.current;
      if (range) {
        const currentNumber = Number(activeAyah.split(':')[1]);
        const nextAyah = ayahsRef.current.find(
          (ayah) => ayah.ayahNumber > currentNumber && ayah.ayahNumber <= range.end && Boolean(ayah.audioUrl),
        );
        if (nextAyah?.audioUrl) {
          const nextKey = `${nextAyah.surahId}:${nextAyah.ayahNumber}`;
          playingAyahRef.current = nextKey;
          currentRepeatRef.current = 1;
          audioPlayer.replace(nextAyah.audioUrl);
          audioPlayer.play();
          setPlayingAyah(nextKey);
          setCurrentRepeat(1);
          return;
        }
      }

      playingAyahRef.current = null;
      currentRepeatRef.current = 0;
      rangePlaybackRef.current = null;
      setPlayingAyah(null);
      setCurrentRepeat(0);
      setRangePlayback(null);
    });

    return () => subscription.remove();
  }, [audioPlayer]);

  const handlePlayAyah = useCallback((item: QuranAyah) => {
    const key = `${item.surahId}:${item.ayahNumber}`;
    if (!item.audioUrl) {
      Alert.alert('Audio tidak tersedia', 'Audio untuk ayat ini belum tersedia.');
      return;
    }
    if (playingAyah === key && audioStatus.playing) {
      audioPlayer.pause();
      playingAyahRef.current = null;
      currentRepeatRef.current = 0;
      rangePlaybackRef.current = null;
      setPlayingAyah(null);
      setCurrentRepeat(0);
      setRangePlayback(null);
      return;
    }
    audioPlayer.replace(item.audioUrl);
    audioPlayer.play();
    playingAyahRef.current = key;
    currentRepeatRef.current = 1;
    rangePlaybackRef.current = null;
    setPlayingAyah(key);
    setCurrentRepeat(1);
    setRangePlayback(null);
  }, [audioPlayer, audioStatus.playing, playingAyah]);

  const handlePlayRange = useCallback(() => {
    if (rangePlayback) {
      audioPlayer.pause();
      playingAyahRef.current = null;
      currentRepeatRef.current = 0;
      rangePlaybackRef.current = null;
      setPlayingAyah(null);
      setCurrentRepeat(0);
      setRangePlayback(null);
      return;
    }

    const start = Number(rangeStart);
    const end = Number(rangeEnd);
    if (!Number.isInteger(start) || !Number.isInteger(end) || start < 1 || end > totalAyat || start > end) {
      Alert.alert('Rentang ayat tidak valid', `Masukkan ayat awal dan akhir antara 1-${totalAyat}, dengan ayat awal tidak lebih besar dari ayat akhir.`);
      return;
    }

    const firstAyah = ayahs.find((ayah) => ayah.ayahNumber === start);
    if (!firstAyah?.audioUrl) {
      Alert.alert('Audio tidak tersedia', `Audio untuk ayat ${start} belum tersedia.`);
      return;
    }

    audioPlayer.replace(firstAyah.audioUrl);
    audioPlayer.play();
    const firstKey = `${firstAyah.surahId}:${firstAyah.ayahNumber}`;
    playingAyahRef.current = firstKey;
    currentRepeatRef.current = 1;
    rangePlaybackRef.current = { end };
    setPlayingAyah(`${firstAyah.surahId}:${firstAyah.ayahNumber}`);
    setCurrentRepeat(1);
    setRangePlayback({ end });
  }, [audioPlayer, ayahs, rangeEnd, rangePlayback, rangeStart, totalAyat]);

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
        onPlay={handlePlayAyah}
        isPlaying={playingAyah === `${item.surahId}:${item.ayahNumber}` && audioStatus.playing}
        arabicOnly={arabicOnly}
        arabicFont={arabicFont}
        colors={colors}
        fontSize={quranFontSize}
      />
    ),
    [bookmarkSet, handleToggle, handleMarkRead, handleCopyAyah, handleShareAyah, handlePlayAyah, playingAyah, audioStatus.playing, arabicOnly, arabicFont, lastReadAyah, colors, quranFontSize],
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
            {!arabicOnly && lastReadAyah > 0 ? ` • Ayat ${lastReadAyah}` : ''}
          </Text>
        </Pressable>
        <Pressable onPress={() => setArabicOnly((value) => !value)} hitSlop={12} style={styles.modeButton}>
          <Ionicons name={arabicOnly ? 'text-outline' : 'book-outline'} size={18} color={colors.primary} />
          <Text style={[styles.modeButtonText, { color: colors.primary }]}>{arabicOnly ? 'Lengkap' : 'Arab'}</Text>
        </Pressable>
      </View>

      <View style={[styles.fontPicker, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.fontPickerLabel, { color: colors.textSecondary }]}>Huruf Arab</Text>
        <View style={[styles.fontPickerOptions, { backgroundColor: colors.surface }]}>
          {([['Noto Naskh', 'NotoNaskhArabic-Regular'], ['Amiri Quran', 'Amiri-Regular'], ['Lateef', 'Lateef-Regular']] as const).map(([label, value]) => {
            const active = arabicFont === value;
            return (
              <Pressable key={value} onPress={() => setArabicFont(value)} style={[styles.fontOption, active && { backgroundColor: colors.primary }]}>
                <Text style={[styles.fontOptionText, { color: active ? '#FFF' : colors.textSecondary }]}>{label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={[styles.repeatPicker, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Ionicons name="repeat-outline" size={16} color={colors.primary} />
        <Text style={[styles.fontPickerLabel, { color: colors.textSecondary }]}>Putar ayat</Text>
        <View style={[styles.repeatOptions, { backgroundColor: colors.surface }]}>
          {Array.from({ length: 9 }, (_, index) => index + 2).map((count) => (
            <Pressable
              key={count}
              onPress={() => setRepeatCount(count)}
              style={[styles.repeatOption, repeatCount === count && { backgroundColor: colors.primary }]}
            >
              <Text style={[styles.repeatOptionText, { color: repeatCount === count ? '#FFF' : colors.textSecondary }]}>
                {count}x
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={[styles.rangePicker, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.rangeLabel, { color: colors.textSecondary }]}>Rentang</Text>
        <TextInput
          value={rangeStart}
          onChangeText={setRangeStart}
          keyboardType="number-pad"
          maxLength={3}
          style={[styles.rangeInput, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
          placeholder="Dari"
          placeholderTextColor={colors.textMuted}
        />
        <Text style={[styles.rangeTo, { color: colors.textMuted }]}>sampai</Text>
        <TextInput
          value={rangeEnd}
          onChangeText={setRangeEnd}
          keyboardType="number-pad"
          maxLength={3}
          style={[styles.rangeInput, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
          placeholder="Ke"
          placeholderTextColor={colors.textMuted}
        />
        <Pressable
          onPress={handlePlayRange}
          style={[styles.rangePlayButton, { backgroundColor: rangePlayback ? colors.gold : colors.primary }]}
        >
          <Ionicons name={rangePlayback ? 'stop' : 'play'} size={15} color="#FFF" />
          <Text style={styles.rangePlayText}>{rangePlayback ? 'Stop' : 'Putar'}</Text>
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
                {!arabicOnly && n === lastReadAyah && <Ionicons name="bookmark" size={10} color="#FFF" />}
                <Text style={[styles.jumpChipText, { color: n === lastReadAyah ? '#FFF' : colors.text }]}>{n}</Text>
              </Pressable>
            )}
          />
        </View>
      )}

      {/* Last Read Banner */}
      {!arabicOnly && !loading && lastReadAyah > 0 && !showJumpPicker && (
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
              <View style={[styles.bismillah, { backgroundColor: arabicOnly ? 'transparent' : colors.card, borderColor: colors.border }, arabicOnly && styles.arabicOnlyBismillah]}>
                <Text
                  style={[
                    styles.bismillahText,
                    {
                      color: colors.text,
                      fontFamily: arabicFont,
                      lineHeight: getArabicLineHeight(30, arabicFont),
                    },
                  ]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.7}
                >
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </Text>
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
  modeButton: { alignItems: 'center', justifyContent: 'center', minWidth: 48 },
  modeButtonText: { fontSize: 10, fontWeight: '700', marginTop: 2 },
  fontPicker: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderBottomWidth: StyleSheet.hairlineWidth, gap: Spacing.sm },
  fontPickerLabel: { fontSize: FontSize.xs, fontWeight: '700' },
  fontPickerOptions: { flex: 1, flexDirection: 'row', borderRadius: BorderRadius.md, padding: 3, gap: 3 },
  fontOption: { flex: 1, alignItems: 'center', paddingVertical: 6, paddingHorizontal: 4, borderRadius: BorderRadius.sm },
  fontOptionText: { fontSize: FontSize.xs, fontWeight: '700' },
  repeatPicker: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderBottomWidth: StyleSheet.hairlineWidth, gap: Spacing.xs },
  repeatOptions: { flex: 1, flexDirection: 'row', borderRadius: BorderRadius.md, padding: 3, gap: 2 },
  repeatOption: { flex: 1, alignItems: 'center', paddingVertical: 6, borderRadius: BorderRadius.sm },
  repeatOptionText: { fontSize: 10, fontWeight: '700' },
  rangePicker: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderBottomWidth: StyleSheet.hairlineWidth, gap: Spacing.xs },
  rangeLabel: { fontSize: FontSize.xs, fontWeight: '700' },
  rangeInput: { width: 48, height: 32, borderWidth: 1, borderRadius: BorderRadius.sm, textAlign: 'center', fontSize: FontSize.sm, paddingVertical: 0 },
  rangeTo: { fontSize: FontSize.xs },
  rangePlayButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, minWidth: 68, height: 32, borderRadius: BorderRadius.sm, paddingHorizontal: 8 },
  rangePlayText: { color: '#FFF', fontSize: FontSize.xs, fontWeight: '700' },
  list: { padding: Spacing.lg, gap: Spacing.lg, paddingBottom: 100 },
  ayahCard: { borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: StyleSheet.hairlineWidth },
  fullCard: {},
  arabicOnlyCard: { borderWidth: 0, borderRadius: 0, paddingHorizontal: 0, paddingVertical: Spacing.md },
  ayahHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  ayahNum: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  ayahNumText: { color: '#FFF', fontWeight: '700', fontSize: FontSize.sm },
  actionRow: { flexDirection: 'row', gap: 6 },
  actionBtn: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  arabic: { fontSize: 30, lineHeight: 42, letterSpacing: 0.15, textAlign: 'right', marginBottom: Spacing.sm },
  latin: { fontSize: FontSize.sm, fontStyle: 'italic', marginBottom: 4 },
  translation: { fontSize: FontSize.md, lineHeight: 22 },
  bismillah: { alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.lg, borderRadius: BorderRadius.lg, borderWidth: StyleSheet.hairlineWidth, marginBottom: Spacing.md },
  arabicOnlyBismillah: { borderWidth: 0, paddingHorizontal: 0, paddingVertical: Spacing.md },
  bismillahText: { width: '100%', fontSize: 30, lineHeight: 58, textAlign: 'center', includeFontPadding: true, fontFamily: 'Lateef-Bold' },

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
