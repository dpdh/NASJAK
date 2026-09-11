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
import * as ImagePicker from 'expo-image-picker';
import { useAppStore } from '../../store/appStore';
import { Colors, Spacing, BorderRadius, FontSize } from '../../constants/theme';

const PROGRAMS = ['LBU', 'TSN', 'Riyadhoh', 'Kajian', 'Lainnya'] as const;

export default function TestimoniAddScreen() {
  const theme = useAppStore((s) => s.theme);
  const user = useAppStore((s) => s.user);
  const addTestimonial = useAppStore((s) => s.addTestimonial);
  const colors = Colors[theme];

  const [program, setProgram] = useState<string>('LBU');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [photo, setPhoto] = useState<string | undefined>();

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (!text.trim()) return Alert.alert('Error', 'Cerita testimoni harus diisi');
    if (text.trim().length < 20) return Alert.alert('Error', 'Cerita testimoni minimal 20 karakter');
    if (!user) return Alert.alert('Error', 'Silakan login terlebih dahulu');

    addTestimonial({
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      program: program as any,
      rating,
      text: text.trim(),
      photo,
    });

    Alert.alert('Berhasil', 'Testimoni Anda berhasil dikirim. Jazakallah khair!', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <LinearGradient colors={['#D4A853', '#B8860B']} style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Tulis Testimoni</Text>
          <View style={{ width: 24 }} />
        </LinearGradient>

        <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
          <Text style={[styles.label, { color: colors.text }]}>Program yang Diikuti *</Text>
          <View style={styles.chipRow}>
            {PROGRAMS.map((p) => (
              <Pressable key={p} onPress={() => setProgram(p)}
                style={[styles.chip, { backgroundColor: program === p ? colors.gold : colors.surface, borderColor: program === p ? colors.gold : colors.border }]}>
                <Text style={[styles.chipText, { color: program === p ? '#FFF' : colors.textSecondary }]}>{p}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={[styles.label, { color: colors.text }]}>Rating *</Text>
          <View style={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Pressable key={n} onPress={() => setRating(n)} hitSlop={8}>
                <Ionicons name={n <= rating ? 'star' : 'star-outline'} size={36} color={colors.gold} />
              </Pressable>
            ))}
          </View>

          <Text style={[styles.label, { color: colors.text }]}>Cerita Testimoni *</Text>
          <TextInput
            style={[styles.input, styles.textArea, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
            placeholder="Ceritakan pengalaman Anda bersama NASUHA..."
            placeholderTextColor={colors.textMuted}
            value={text}
            onChangeText={setText}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
          <Text style={[styles.charCount, { color: colors.textMuted }]}>{text.length} karakter</Text>

          <Text style={[styles.label, { color: colors.text }]}>Foto (opsional)</Text>
          <Pressable onPress={pickPhoto} style={[styles.photoBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {photo ? (
              <View style={styles.photoPreviewRow}>
                <Ionicons name="image" size={20} color={colors.success} />
                <Text style={[styles.photoBtnText, { color: colors.success }]}>Foto terpilih</Text>
                <Pressable onPress={() => setPhoto(undefined)}><Ionicons name="close-circle" size={18} color={colors.error} /></Pressable>
              </View>
            ) : (
              <>
                <Ionicons name="camera-outline" size={24} color={colors.textMuted} />
                <Text style={[styles.photoBtnText, { color: colors.textMuted }]}>Tambah Foto</Text>
              </>
            )}
          </Pressable>

          <Pressable onPress={handleSubmit}>
            <LinearGradient colors={[colors.gold || '#D4A853', '#B8860B']} style={styles.submitBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Ionicons name="send" size={20} color="#FFF" />
              <Text style={styles.submitText}>Kirim Testimoni</Text>
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
  ratingRow: { flexDirection: 'row', gap: 8 },
  input: { borderWidth: 1, borderRadius: BorderRadius.md, paddingHorizontal: Spacing.md, height: 48, fontSize: FontSize.md },
  textArea: { height: 140, paddingTop: Spacing.sm },
  charCount: { fontSize: FontSize.xs, textAlign: 'right', marginTop: 4 },
  photoBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderRadius: BorderRadius.md, borderWidth: 1, borderStyle: 'dashed' },
  photoBtnText: { fontSize: FontSize.sm, fontWeight: '600' },
  photoPreviewRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: BorderRadius.xl, marginTop: Spacing.xl, gap: 8 },
  submitText: { color: '#FFF', fontSize: FontSize.lg, fontWeight: '800' },
});
