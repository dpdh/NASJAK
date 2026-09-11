import React, { memo, useCallback, useMemo, useState } from 'react';
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

interface Notification {
  id: string;
  title: string;
  body: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  time: string;
  read: boolean;
  type: 'event' | 'riyadhoh' | 'motivasi' | 'lbu' | 'info';
}

const SAMPLE_NOTIFS: Notification[] = [
  { id: '1', title: 'TSN Jakarta', body: 'TSN Jakarta akan dimulai 3 hari lagi. Pastikan sudah mendaftar!', icon: 'calendar', time: '2 jam lalu', read: false, type: 'event' },
  { id: '2', title: 'Riyadhoh Reminder', body: 'Sudahkah Anda melakukan Riyadhoh hari ini? Ayo istiqamah!', icon: 'checkmark-circle', time: '5 jam lalu', read: false, type: 'riyadhoh' },
  { id: '3', title: 'Motivasi Hari Ini', body: 'Motivasi hari ini sudah tersedia. Yuk baca dan bagikan!', icon: 'bulb', time: '8 jam lalu', read: true, type: 'motivasi' },
  { id: '4', title: 'LBU Batch Baru', body: 'Pendaftaran LBU Batch terbaru telah dibuka. Daftar sekarang!', icon: 'rocket', time: '1 hari lalu', read: true, type: 'lbu' },
  { id: '5', title: 'Selamat Bergabung!', body: 'Assalamu\'alaikum, selamat bergabung di komunitas NASUHA Jakarta.', icon: 'heart', time: '2 hari lalu', read: true, type: 'info' },
];

const TYPE_COLORS: Record<string, string> = {
  event: '#00B4D8', riyadhoh: '#2EC4B6', motivasi: '#D4A853', lbu: '#FF6B6B', info: '#8BA4B8',
};

function NotificationsScreen() {
  const theme = useAppStore((s) => s.theme);
  const colors = Colors[theme];
  const [notifs, setNotifs] = useState(SAMPLE_NOTIFS);

  const unreadCount = useMemo(() => notifs.filter((n) => !n.read).length, [notifs]);

  const markRead = useCallback((id: string) => {
    setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Notification }) => (
      <Pressable
        onPress={() => markRead(item.id)}
        style={[
          styles.notifCard,
          { backgroundColor: item.read ? colors.card : colors.primary + '08', borderColor: item.read ? colors.border : colors.primary + '30' },
          Shadows.sm,
        ]}
      >
        <View style={[styles.notifIcon, { backgroundColor: TYPE_COLORS[item.type] + '20' }]}>
          <Ionicons name={item.icon} size={22} color={TYPE_COLORS[item.type]} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.notifHeaderRow}>
            <Text style={[styles.notifTitle, { color: colors.text }]}>{item.title}</Text>
            {!item.read && <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />}
          </View>
          <Text style={[styles.notifBody, { color: colors.textSecondary }]} numberOfLines={2}>{item.body}</Text>
          <Text style={[styles.notifTime, { color: colors.textMuted }]}>{item.time}</Text>
        </View>
      </Pressable>
    ),
    [colors, markRead],
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: Spacing.md }}>
          <Text style={[styles.title, { color: colors.text }]}>Notifikasi</Text>
          {unreadCount > 0 && (
            <Text style={[styles.subtitle, { color: colors.primary }]}>{unreadCount} belum dibaca</Text>
          )}
        </View>
        {unreadCount > 0 && (
          <Pressable onPress={markAllRead} hitSlop={8}>
            <Text style={[styles.markAll, { color: colors.primary }]}>Baca Semua</Text>
          </Pressable>
        )}
      </View>
      <FlatList
        data={notifs}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Ionicons name="notifications-off-outline" size={48} color={colors.textMuted} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Belum ada notifikasi</Text>
          </View>
        }
      />
    </View>
  );
}

export default memo(NotificationsScreen);

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 56, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md },
  title: { fontSize: FontSize.xxl, fontWeight: '800' },
  subtitle: { fontSize: FontSize.sm, marginTop: 2 },
  markAll: { fontSize: FontSize.sm, fontWeight: '700' },
  list: { padding: Spacing.lg, gap: Spacing.sm },
  notifCard: { flexDirection: 'row', padding: Spacing.md, borderRadius: BorderRadius.lg, borderWidth: 1, gap: Spacing.md },
  notifIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  notifHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  notifTitle: { fontSize: FontSize.md, fontWeight: '700' },
  unreadDot: { width: 8, height: 8, borderRadius: 4 },
  notifBody: { fontSize: FontSize.sm, lineHeight: 18, marginTop: 2 },
  notifTime: { fontSize: FontSize.xs, marginTop: 4 },
  emptyBox: { alignItems: 'center', paddingVertical: Spacing.xxl, gap: Spacing.md },
  emptyText: { fontSize: FontSize.md },
});
