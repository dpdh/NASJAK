import React, { memo, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, router } from 'expo-router';
import { useAppStore } from '../../../store/appStore';
import { Colors, Spacing, BorderRadius, FontSize, Shadows } from '../../../constants/theme';
import { MOTIVASI_ARTICLES, MOTIVASI_CATEGORIES } from '../../../constants/data';

function ArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useAppStore((s) => s.theme);
  const colors = Colors[theme];

  const article = useMemo(
    () => MOTIVASI_ARTICLES.find((a) => a.id === Number(id)),
    [id],
  );

  const category = useMemo(
    () => MOTIVASI_CATEGORIES.find((c) => c.id === article?.categoryId),
    [article],
  );

  const onShare = async () => {
    if (!article) return;
    try {
      await Share.share({
        message: `${article.title}\n\n${article.content.slice(0, 200)}...\n\n— NASJAK App (NASUHA Jakarta)`,
      });
    } catch { /* ignore */ }
  };

  if (!article || !category) return null;

  const paragraphs = article.content.split('\n\n');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>Artikel</Text>
        <Pressable onPress={onShare} hitSlop={12}>
          <Ionicons name="share-outline" size={22} color={colors.primary} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={category.gradient as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroBanner}
        >
          <Ionicons name={article.icon as any} size={36} color="#FFFFFF" />
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{category.subtitle}</Text>
          </View>
        </LinearGradient>

        <Text style={[styles.title, { color: colors.text }]}>{article.title}</Text>

        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Ionicons name="person-outline" size={14} color={colors.textMuted} />
            <Text style={[styles.metaText, { color: colors.textMuted }]}>{article.author}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={14} color={colors.textMuted} />
            <Text style={[styles.metaText, { color: colors.textMuted }]}>{article.readTime}</Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <Text style={[styles.summary, { color: colors.primary }]}>{article.summary}</Text>

        {paragraphs.map((p, i) => {
          const isQuote = p.startsWith('"') || p.startsWith('\u201C');
          const isList = p.includes('\n•') || p.startsWith('•');
          const isNumbered = /^\d+\./.test(p);

          if (isQuote) {
            return (
              <View
                key={i}
                style={[styles.quoteBlock, { borderLeftColor: colors.gold, backgroundColor: colors.gold + '08' }]}
              >
                <Text style={[styles.bodyText, { color: colors.text, fontStyle: 'italic' }]}>{p}</Text>
              </View>
            );
          }

          if (isList || isNumbered) {
            return (
              <View key={i} style={styles.listBlock}>
                {p.split('\n').map((line, j) => (
                  <Text key={j} style={[styles.bodyText, { color: colors.text }]}>{line}</Text>
                ))}
              </View>
            );
          }

          return (
            <Text key={i} style={[styles.bodyText, { color: colors.text }]}>{p}</Text>
          );
        })}

        <View style={[styles.footer, { backgroundColor: category.color + '10', borderColor: category.color + '30' }]}>
          <Ionicons name="sparkles" size={18} color={category.color} />
          <Text style={[styles.footerText, { color: colors.text }]}>
            Semoga bermanfaat. Bagikan kepada sahabat yang membutuhkan.
          </Text>
          <Pressable style={[styles.shareBtn, { backgroundColor: category.color }]} onPress={onShare}>
            <Ionicons name="share-social" size={16} color="#FFFFFF" />
            <Text style={styles.shareBtnText}>Bagikan</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

export default memo(ArticleScreen);

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 56,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerTitle: { fontSize: FontSize.xl, fontWeight: '800', flex: 1, textAlign: 'center' },
  content: { padding: Spacing.lg, paddingBottom: 100 },
  heroBanner: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  categoryBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  categoryText: { color: '#FFFFFF', fontSize: FontSize.xs, fontWeight: '700' },
  title: { fontSize: FontSize.xxl, fontWeight: '900', lineHeight: 32, marginBottom: Spacing.sm },
  meta: { flexDirection: 'row', gap: Spacing.lg, marginBottom: Spacing.md },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: FontSize.sm },
  divider: { height: 1, marginBottom: Spacing.lg },
  summary: { fontSize: FontSize.md, fontWeight: '600', lineHeight: 22, marginBottom: Spacing.lg },
  bodyText: { fontSize: FontSize.md, lineHeight: 24, marginBottom: Spacing.md },
  quoteBlock: {
    borderLeftWidth: 3,
    paddingLeft: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  listBlock: { marginBottom: Spacing.md, gap: 2 },
  footer: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  footerText: { fontSize: FontSize.sm, textAlign: 'center', lineHeight: 20 },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.xs,
  },
  shareBtnText: { color: '#FFFFFF', fontSize: FontSize.sm, fontWeight: '700' },
});
