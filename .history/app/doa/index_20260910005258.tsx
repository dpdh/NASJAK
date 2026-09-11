import React, { memo } from 'react';
import { Alert, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppStore } from '../../store/appStore';
import { BorderRadius, Colors, FontSize, Spacing } from '../../constants/theme';
import { DOAS as COMPLETE_DOAS, type DoaEntry } from '../../constants/doa';

function DoaScreen() {
  const theme = useAppStore((s) => s.theme);
  const colors = Colors[theme];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>

        <View style={{ flex: 1, marginLeft: Spacing.md }}>
          <Text style={[styles.title, { color: colors.text }]}>Doa Harian</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Doa pilihan untuk menemani ikhtiar</Text>
        </View>

        <Ionicons name="book-outline" size={24} color={colors.primary} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.intro, { backgroundColor: colors.primary + '12', borderColor: colors.primary + '30' }]}>
          <Ionicons name="information-circle-outline" size={21} color={colors.primary} />
          <Text style={[styles.introText, { color: colors.text }]}>Baca dengan memahami makna dan sertai doa dengan ikhtiar yang baik.</Text>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Doa terkait utang</Text>
        <Text style={[styles.countText, { color: colors.textMuted }]}>{COMPLETE_DOAS.length} doa tersusun dalam pustaka tematik</Text>
        {COMPLETE_DOAS.filter((item) => item.debt).map((item) => (
          <DoaCard key={item.id} item={item} colors={colors} />
        ))}

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Doa harian</Text>
        {COMPLETE_DOAS.filter((item) => !item.debt).map((item) => (
          <DoaCard key={item.id} item={item} colors={colors} />
        ))}

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

function DoaCard({ item, colors }: { item: DoaEntry; colors: typeof Colors.light }) {
  const handleCopy = async () => {
    const text = [
      item.title,
      item.arabic || '',
      item.latin || '',
      item.meaning,
      item.source ? `Sumber: ${item.source}` : '',
    ]
      .filter(Boolean)
      .join('\n\n');

    await Clipboard.setStringAsync(text);
    Alert.alert('Tersalin', 'Teks doa berhasil disalin ke clipboard.');
  };

  const handleShare = async () => {
    const text = [
      item.title,
      item.arabic || '',
      item.latin || '',
      item.meaning,
      item.source ? `Sumber: ${item.source}` : '',
    ]
      .filter(Boolean)
      .join('\n\n');

    try {
      await Share.share({ message: text });
    } catch {
      Alert.alert('Gagal', 'Tidak dapat membagikan doa saat ini.');
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: item.debt ? colors.gold : colors.border }]}>
      <View style={styles.cardHeader}>
        <View style={[styles.number, { backgroundColor: item.debt ? colors.gold : colors.primary }]}>
          <Text style={styles.numberText}>{item.id}</Text>
        </View>

        <View style={[styles.icon, { backgroundColor: item.debt ? colors.gold + '20' : colors.primary + '15' }]}>
          <Ionicons name={item.icon as any} size={19} color={item.debt ? colors.gold : colors.primary} />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>{item.title}</Text>
          <Text style={[styles.category, { color: item.debt ? colors.gold : colors.primary }]}>{item.category}</Text>
        </View>

        {item.debt && <Text style={[styles.badge, { color: colors.gold }]}>UTANG</Text>}
      </View>

      {item.arabic && <Text style={[styles.arabic, { color: colors.text }]}>{item.arabic}</Text>}
      {item.latin && <Text style={[styles.latin, { color: colors.primary }]}>{item.latin}</Text>}
      <Text style={[styles.meaning, { color: colors.textSecondary }]}>{item.meaning}</Text>
      {item.source && <Text style={[styles.source, { color: colors.textMuted }]}>Sumber: {item.source}</Text>}

      <View style={styles.actionRow}>
        <Pressable onPress={handleCopy} style={[styles.actionButton, { backgroundColor: colors.primary + '18', borderColor: colors.primary + '35' }]}>
          <Ionicons name="copy-outline" size={16} color={colors.primary} />
          <Text style={[styles.actionText, { color: colors.primary }]}>Salin</Text>
        </Pressable>

        <Pressable onPress={handleShare} style={[styles.actionButton, { backgroundColor: colors.gold + '18', borderColor: colors.gold + '35' }]}>
          <Ionicons name="share-social-outline" size={16} color={colors.gold} />
          <Text style={[styles.actionText, { color: colors.gold }]}>Bagikan</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default memo(DoaScreen);

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 56,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
  },
  title: { fontSize: FontSize.xl, fontWeight: '800' },
  subtitle: { fontSize: FontSize.sm, marginTop: 2 },
  content: { padding: Spacing.lg },
  intro: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  introText: { flex: 1, fontSize: FontSize.sm, lineHeight: 19 },
  countText: { fontSize: FontSize.xs, marginBottom: Spacing.sm },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '800', marginBottom: Spacing.sm, marginTop: Spacing.sm },
  card: { borderWidth: 1, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.sm },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  number: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  numberText: { color: '#FFF', fontSize: FontSize.xs, fontWeight: '800' },
  icon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: FontSize.md, fontWeight: '800' },
  category: { fontSize: FontSize.xs, fontWeight: '700', marginTop: 2 },
  badge: { fontSize: 10, fontWeight: '900' },
  arabic: { fontSize: 25, lineHeight: 45, textAlign: 'right', marginTop: Spacing.md, fontFamily: 'Lateef-Regular' },
  latin: { fontSize: FontSize.sm, fontStyle: 'italic', lineHeight: 20, marginTop: Spacing.sm },
  meaning: { fontSize: FontSize.sm, lineHeight: 20, marginTop: Spacing.xs },
  source: { fontSize: FontSize.xs, marginTop: Spacing.sm, fontStyle: 'italic' },
  actionRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: BorderRadius.md,
    paddingVertical: 10,
    borderWidth: 1,
  },
  actionText: { fontSize: FontSize.sm, fontWeight: '700' },
});
