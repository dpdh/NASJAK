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

const EVENT_TYPES = ['TSN', 'LBU', 'Kajian', 'KFM', 'TOT', 'Scale Up Bisnis', 'Safari Dakwah', 'Digital Marketing', 'Public Speaking', 'Business Coaching', 'Sosial', 'Lainnya'];

export default function EventAddScreen() {
  const theme = useAppStore((s) => s.theme);
  const user = useAppStore((s) => s.user);
  const addEvent = useAppStore((s) => s.addEvent);
  const colors = Colors[theme];

  const [title, setTitle] = useState('');
  const [type, setType] = useState('TSN');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [quota, setQuota] = useState('');
  const [contactWhatsapp, setContactWhatsapp] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');

  if (!user || user.role !== 'admin') {
    return (
      <View style={[styles.denied, { backgroundColor: colors.background }]}>
        <Ionicons name="lock-closed" size={64} color={colors.textMuted} />
        <Text style={[styles.deniedTitle, { color: colors.text }]}>Akses Ditolak</Text>
        <Pressable onPress={() => router.back()} style={[styles.backBtn, { borderColor: colors.primary }]}>
          <Text style={{ color: colors.primary, fontWeight: '700' }}>Kembali</Text>
        </Pressable>
      </View>
    );
  }

  const handleSave = () => {
    if (!title.trim()) return Alert.alert('Error', 'Judul event harus diisi');
    if (!date.trim()) return Alert.alert('Error', 'Tanggal harus diisi (format: YYYY-MM-DD)');
    if (!time.trim()) return Alert.alert('Error', 'Waktu harus diisi (format: HH:MM)');
    if (!location.trim()) return Alert.alert('Error', 'Lokasi harus diisi');
    if (!quota.trim() || isNaN(Number(quota))) return Alert.alert('Error', 'Kuota harus berupa angka');

    addEvent({
      title: title.trim(),
      type,
      date: date.trim(),
      time: time.trim(),
      location: location.trim(),
      description: description.trim(),
      quota: parseInt(quota, 10),
      status,
      contactWhatsapp: contactWhatsapp.trim() || undefined,
      createdBy: user.id,
    });

    Alert.alert('Berhasil', 'Event berhasil ditambahkan!', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <LinearGradient colors={['#4A90D9', '#357ABD']} style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Tambah Event Baru</Text>
          <View style={{ width: 24 }} />
        </LinearGradient>

        <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
          <Text style={[styles.label, { color: colors.text }]}>Judul Event *</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
            placeholder="Contoh: TSN Oktober 2026"
            placeholderTextColor={colors.textMuted}
            value={title}
            onChangeText={setTitle}
          />

          <Text style={[styles.label, { color: colors.text }]}>Tipe Event *</Text>
          <View style={styles.chipRow}>
            {EVENT_TYPES.map((t) => (
              <Pressable key={t} onPress={() => setType(t)}
                style={[styles.chip, { backgroundColor: type === t ? colors.primary : colors.surface, borderColor: type === t ? colors.primary : colors.border }]}>
                <Text style={[styles.chipText, { color: type === t ? '#FFF' : colors.textSecondary }]}>{t}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: colors.text }]}>Tanggal * (YYYY-MM-DD)</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                placeholder="2026-10-15"
                placeholderTextColor={colors.textMuted}
                value={date}
                onChangeText={setDate}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: colors.text }]}>Waktu * (HH:MM)</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                placeholder="09:00"
                placeholderTextColor={colors.textMuted}
                value={time}
                onChangeText={setTime}
              />
            </View>
          </View>

          <Text style={[styles.label, { color: colors.text }]}>Lokasi *</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
            placeholder="Masjid / Gedung / Online via Zoom"
            placeholderTextColor={colors.textMuted}
            value={location}
            onChangeText={setLocation}
          />

          <Text style={[styles.label, { color: colors.text }]}>Deskripsi</Text>
          <TextInput
            style={[styles.input, styles.textArea, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
            placeholder="Penjelasan singkat tentang event..."
            placeholderTextColor={colors.textMuted}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: colors.text }]}>Kuota Peserta *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                placeholder="200"
                placeholderTextColor={colors.textMuted}
                value={quota}
                onChangeText={setQuota}
                keyboardType="numeric"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: colors.text }]}>WhatsApp CP</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                placeholder="6281234567890"
                placeholderTextColor={colors.textMuted}
                value={contactWhatsapp}
                onChangeText={setContactWhatsapp}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <Text style={[styles.label, { color: colors.text }]}>Status</Text>
          <View style={styles.chipRow}>
            {(['published', 'draft'] as const).map((s) => (
              <Pressable key={s} onPress={() => setStatus(s)}
                style={[styles.chip, { backgroundColor: status === s ? colors.primary : colors.surface, borderColor: status === s ? colors.primary : colors.border }]}>
                <Ionicons name={s === 'published' ? 'globe-outline' : 'document-outline'} size={14} color={status === s ? '#FFF' : colors.textSecondary} />
                <Text style={[styles.chipText, { color: status === s ? '#FFF' : colors.textSecondary }]}>{s === 'published' ? 'Langsung Publish' : 'Simpan Draft'}</Text>
              </Pressable>
            ))}
          </View>

          <Pressable onPress={handleSave} style={[styles.saveBtn, { backgroundColor: colors.primary }]}>
            <Ionicons name="checkmark-circle" size={20} color="#FFF" />
            <Text style={styles.saveBtnText}>Simpan Event</Text>
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
  input: { borderWidth: 1, borderRadius: BorderRadius.md, paddingHorizontal: Spacing.md, height: 48, fontSize: FontSize.md },
  textArea: { height: 100, paddingTop: Spacing.sm },
  row: { flexDirection: 'row', gap: Spacing.md },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: BorderRadius.full, borderWidth: 1, gap: 4 },
  chipText: { fontSize: FontSize.sm, fontWeight: '600' },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: BorderRadius.lg, marginTop: Spacing.xl, gap: 8 },
  saveBtnText: { color: '#FFF', fontSize: FontSize.lg, fontWeight: '800' },
  denied: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.md },
  deniedTitle: { fontSize: FontSize.xxl, fontWeight: '800' },
  backBtn: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: BorderRadius.lg, borderWidth: 1.5, marginTop: Spacing.md },
});
