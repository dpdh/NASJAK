import React, { useState } from 'react';
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
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from '../../store/appStore';
import { Colors, Spacing, BorderRadius, FontSize } from '../../constants/theme';

const CATEGORIES = ['Keuangan Syariah', 'Hijrah', 'Fiqh', 'Bisnis', 'Umum'] as const;

export default function TanyaAddScreen() {
  const theme = useAppStore((s) => s.theme);
  const user = useAppStore((s) => s.user);
  const addQuestion = useAppStore((s) => s.addQuestion);
  const colors = Colors[theme];

  const [category, setCategory] = useState<string>('Keuangan Syariah');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleSubmit = () => {
    if (!title.trim()) return Alert.alert('Error', 'Judul pertanyaan harus diisi');
    if (!body.trim()) return Alert.alert('Error', 'Isi pertanyaan harus diisi');
    if (!user) return Alert.alert('Error', 'Silakan login terlebih dahulu');

    addQuestion({
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      category: category as any,
      title: title.trim(),
      body: body.trim(),
    });

    Alert.alert('Berhasil', 'Pertanyaan berhasil diposting!', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <LinearGradient colors={[colors.primary, '#0077B6']} style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Ajukan Pertanyaan</Text>
          <View style={{ width: 24 }} />
        </LinearGradient>

        <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
          <Text style={[styles.label, { color: colors.text }]}>Kategori *</Text>
          <View style={styles.chipRow}>
            {CATEGORIES.map((c) => (
              <Pressable key={c} onPress={() => setCategory(c)}
                style={[styles.chip, { backgroundColor: category === c ? colors.primary : colors.surface, borderColor: category === c ? colors.primary : colors.border }]}>
                <Text style={[styles.chipText, { color: category === c ? '#FFF' : colors.textSecondary }]}>{c}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={[styles.label, { color: colors.text }]}>Judul Pertanyaan *</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
            placeholder="Contoh: Bagaimana cara keluar dari riba?"
            placeholderTextColor={colors.textMuted}
            value={title}
            onChangeText={setTitle}
          />

          <Text style={[styles.label, { color: colors.text }]}>Isi Pertanyaan *</Text>
          <TextInput
            style={[styles.input, styles.textArea, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
            placeholder="Jelaskan pertanyaan Anda secara detail..."
            placeholderTextColor={colors.textMuted}
            value={body}
            onChangeText={setBody}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />

          <Pressable onPress={handleSubmit}>
            <LinearGradient colors={[colors.primary, '#0077B6']} style={styles.submitBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Ionicons name="send" size={20} color="#FFF" />
              <Text style={styles.submitText}>Kirim Pertanyaan</Text>
            </LinearGradient>
          </Pressable>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 56, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.lg, gap: Spacing.md },
  headerTitle: { flex: 1, color: '#FFF', fontSize: FontSize.xl, fontWeight: '800', textAlign: 'center' },
  form: { padding: Spacing.lg },
  label: { fontSize: FontSize.sm, fontWeight: '700', marginTop: Spacing.md, marginBottom: 6 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: BorderRadius.full, borderWidth: 1 },
  chipText: { fontSize: FontSize.sm, fontWeight: '600' },
  input: { borderWidth: 1, borderRadius: BorderRadius.md, paddingHorizontal: Spacing.md, height: 48, fontSize: FontSize.md },
  textArea: { height: 140, paddingTop: Spacing.sm },
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: BorderRadius.xl, marginTop: Spacing.xl, gap: 8 },
  submitText: { color: '#FFF', fontSize: FontSize.lg, fontWeight: '800' },
});
