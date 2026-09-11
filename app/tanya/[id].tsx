import React, { memo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { useAppStore } from '../../store/appStore';
import { Colors, Spacing, BorderRadius, FontSize, Shadows } from '../../constants/theme';
import type { Answer } from '../../types';

const CAT_COLORS: Record<string, string> = { 'Keuangan Syariah': '#2EC4B6', Hijrah: '#7B61FF', Fiqh: '#D4A853', Bisnis: '#FF6B6B', Umum: '#4A90D9' };

const AnswerCard = memo(({ item, colors }: { item: Answer; colors: typeof Colors.light }) => (
  <View style={[styles.answerCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
    <View style={styles.answerHeader}>
      <View style={[styles.answerAvatar, { backgroundColor: colors.primary }]}>
        <Text style={styles.answerAvatarText}>{item.userName.charAt(0)}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.answerName, { color: colors.text }]}>{item.userName}</Text>
        <Text style={[styles.answerDate, { color: colors.textMuted }]}>{new Date(item.createdAt).toLocaleDateString('id-ID')}</Text>
      </View>
    </View>
    <Text style={[styles.answerBody, { color: colors.textSecondary }]}>{item.body}</Text>
  </View>
));

function TanyaDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useAppStore((s) => s.theme);
  const user = useAppStore((s) => s.user);
  const questions = useAppStore((s) => s.questions);
  const addAnswer = useAppStore((s) => s.addAnswer);
  const colors = Colors[theme];

  const question = questions.find((q) => q.id === id);
  const [answerText, setAnswerText] = useState('');

  if (!question) {
    return (
      <View style={[styles.empty, { backgroundColor: colors.background }]}>
        <Ionicons name="help-circle-outline" size={64} color={colors.textMuted} />
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Pertanyaan tidak ditemukan</Text>
        <Pressable onPress={() => router.back()} style={[styles.backBtn, { borderColor: colors.primary }]}>
          <Text style={{ color: colors.primary, fontWeight: '700' }}>Kembali</Text>
        </Pressable>
      </View>
    );
  }

  const handleSubmitAnswer = () => {
    if (!answerText.trim()) return Alert.alert('Error', 'Jawaban harus diisi');
    if (!user) return Alert.alert('Error', 'Silakan login terlebih dahulu');

    addAnswer(question.id, {
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      body: answerText.trim(),
    });
    setAnswerText('');
    Alert.alert('Berhasil', 'Jawaban berhasil dikirim!');
  };

  const catColor = CAT_COLORS[question.category] || colors.primary;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Detail Pertanyaan</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Question */}
          <View style={[styles.questionCard, { backgroundColor: colors.card, borderColor: colors.border }, Shadows.sm]}>
            <View style={styles.qHeader}>
              <View style={[styles.avatar, { backgroundColor: catColor }]}>
                <Text style={styles.avatarText}>{question.userName.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.qUserName, { color: colors.text }]}>{question.userName}</Text>
                <View style={styles.metaRow}>
                  <View style={[styles.catBadge, { backgroundColor: catColor + '20' }]}>
                    <Text style={[styles.catText, { color: catColor }]}>{question.category}</Text>
                  </View>
                  <Text style={[styles.qDate, { color: colors.textMuted }]}>{new Date(question.createdAt).toLocaleDateString('id-ID')}</Text>
                </View>
              </View>
            </View>
            <Text style={[styles.qTitle, { color: colors.text }]}>{question.title}</Text>
            <Text style={[styles.qBody, { color: colors.textSecondary }]}>{question.body}</Text>
          </View>

          {/* Answers */}
          <View style={styles.answersSection}>
            <Text style={[styles.answersTitle, { color: colors.text }]}>
              {question.answers.length} Jawaban
            </Text>
            {question.answers.length === 0 ? (
              <View style={styles.noAnswers}>
                <Ionicons name="chatbubble-ellipses-outline" size={40} color={colors.textMuted} />
                <Text style={[styles.noAnswersText, { color: colors.textSecondary }]}>Belum ada jawaban. Jadilah yang pertama menjawab!</Text>
              </View>
            ) : (
              question.answers.map((a) => <AnswerCard key={a.id} item={a} colors={colors} />)
            )}
          </View>
        </ScrollView>

        {/* Answer Input */}
        <View style={[styles.inputBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
          <TextInput
            style={[styles.answerInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
            placeholder="Tulis jawaban..."
            placeholderTextColor={colors.textMuted}
            value={answerText}
            onChangeText={setAnswerText}
            multiline
          />
          <Pressable onPress={handleSubmitAnswer} style={[styles.sendBtn, { backgroundColor: colors.primary }]}>
            <Ionicons name="send" size={18} color="#FFF" />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

export default memo(TanyaDetailScreen);

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 56, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md, borderBottomWidth: StyleSheet.hairlineWidth, gap: Spacing.md },
  headerTitle: { flex: 1, fontSize: FontSize.lg, fontWeight: '700', textAlign: 'center' },
  content: { padding: Spacing.lg, paddingBottom: 100 },
  questionCard: { borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: StyleSheet.hairlineWidth },
  qHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#FFF', fontWeight: '800', fontSize: FontSize.lg },
  qUserName: { fontSize: FontSize.md, fontWeight: '700' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  catBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: BorderRadius.sm },
  catText: { fontSize: FontSize.xs, fontWeight: '700' },
  qDate: { fontSize: FontSize.xs },
  qTitle: { fontSize: FontSize.xl, fontWeight: '800', marginTop: Spacing.md },
  qBody: { fontSize: FontSize.md, lineHeight: 22, marginTop: Spacing.sm },
  answersSection: { marginTop: Spacing.xl },
  answersTitle: { fontSize: FontSize.lg, fontWeight: '700', marginBottom: Spacing.md },
  answerCard: { borderRadius: BorderRadius.md, padding: Spacing.md, borderWidth: StyleSheet.hairlineWidth, marginBottom: Spacing.sm },
  answerHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  answerAvatar: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  answerAvatarText: { color: '#FFF', fontWeight: '700', fontSize: FontSize.sm },
  answerName: { fontSize: FontSize.sm, fontWeight: '700' },
  answerDate: { fontSize: FontSize.xs },
  answerBody: { fontSize: FontSize.sm, lineHeight: 20, marginTop: Spacing.sm },
  noAnswers: { alignItems: 'center', paddingVertical: Spacing.xl, gap: Spacing.sm },
  noAnswersText: { fontSize: FontSize.sm, textAlign: 'center' },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', padding: Spacing.md, gap: Spacing.sm, borderTopWidth: StyleSheet.hairlineWidth },
  answerInput: { flex: 1, borderWidth: 1, borderRadius: BorderRadius.lg, paddingHorizontal: Spacing.md, paddingVertical: 10, fontSize: FontSize.md, maxHeight: 100 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.md },
  emptyText: { fontSize: FontSize.md },
  backBtn: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: BorderRadius.lg, borderWidth: 1.5, marginTop: Spacing.md },
});
