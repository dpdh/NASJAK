import React, { memo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppStore } from '../../store/appStore';
import { Spacing, BorderRadius, FontSize, Shadows, COLOR_SCHEMES, getColors } from '../../constants/theme';
import type { ColorScheme } from '../../constants/theme';
import { ShimmerGold } from '../../components/ui/ShimmerGold';

const LOGO_BADGE = require('../../assets/images/logo-icon.png');

interface MenuItem {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  sub?: string;
  color?: string;
  action: () => void;
}

const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  sahabat: 'Sahabat NASUHA',
  calon_sahabat: 'Calon Sahabat',
};

const ROLE_COLORS: Record<string, string> = {
  super_admin: '#FF6B6B',
  admin: '#D4A853',
  sahabat: '#2EC4B6',
  calon_sahabat: '#999999',
};

function ProfileScreen() {
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const colorScheme = useAppStore((s) => s.colorScheme);
  const setColorScheme = useAppStore((s) => s.setColorScheme);
  const user = useAppStore((s) => s.user);
  const logout = useAppStore((s) => s.logout);
  const members = useAppStore((s) => s.members);
  const bookmarkedAyahs = useAppStore((s) => s.bookmarkedAyahs);
  const bookmarkedHadiths = useAppStore((s) => s.bookmarkedHadiths);
  const quranFontSize = useAppStore((s) => s.quranFontSize);
  const hadithFontSize = useAppStore((s) => s.hadithFontSize);
  const setQuranFontSize = useAppStore((s) => s.setQuranFontSize);
  const setHadithFontSize = useAppStore((s) => s.setHadithFontSize);
  const colors = getColors(colorScheme)[theme];

  const isAdmin = user?.role === 'super_admin' || user?.role === 'admin';
  const totalBookmarks = bookmarkedAyahs.length + bookmarkedHadiths.length;
  const [showAbout, setShowAbout] = useState(false);

  const menuItems: MenuItem[] = [
    ...(isAdmin
      ? [
          {
            icon: 'shield-checkmark' as const,
            label: 'CMS Admin Panel',
            sub: `${members.length} user · Kelola User & Lapak`,
            color: '#FF6B6B',
            action: () => router.push('/admin/' as any),
          },
        ]
      : []),
    { icon: 'person-outline' as const, label: 'Edit Profil', sub: 'Ubah foto dan data diri', action: () => router.push('/profile/edit' as any) },
    { icon: 'storefront-outline' as const, label: 'Dagangan Saya', sub: 'Kelola lapak jualan Anda', action: () => router.push('/lapak/' as any) },
    { icon: 'moon-outline' as const, label: 'Mode Gelap', sub: theme === 'dark' ? 'Aktif' : 'Nonaktif', action: toggleTheme },
    { icon: 'bookmark-outline' as const, label: 'Bookmark', sub: `${totalBookmarks} tersimpan`, action: () => {} },
    { icon: 'information-circle-outline' as const, label: 'Tentang NASUHA App', sub: 'v1.0.0 · 8 Agustus 2026', action: () => setShowAbout(true) },
  ];

  const handleLogout = () => {
    Alert.alert('Logout', 'Yakin ingin keluar dari akun?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Keluar',
        style: 'destructive',
        onPress: () => {
          logout();
        },
      },
    ]);
  };

  const initials = user?.name
    ? user.name.split(' ').map((w) => w.charAt(0)).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header */}
      <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }, Shadows.md]}>
        <ShimmerGold style={styles.shimmerTop} />
        <Pressable style={styles.profileRow} onPress={() => router.push('/profile/edit' as any)}>
          {/* Avatar */}
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
          ) : (
            <View style={[styles.avatarFallback, { backgroundColor: isAdmin ? '#FF6B6B' : colors.primary }]}>
              <Text style={styles.avatarInitials}>{initials}</Text>
            </View>
          )}
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={[styles.name, { color: colors.text }]}>{user?.name || 'Sahabat NASUHA'}</Text>
              {user?.role && (
                <View style={[styles.roleBadge, { backgroundColor: ROLE_COLORS[user.role] + '20' }]}>
                  <Text style={[styles.roleText, { color: ROLE_COLORS[user.role] }]}>{ROLE_LABELS[user.role]}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.email, { color: colors.textSecondary }]}>{user?.email || 'Belum login'}</Text>
            {user?.bio && <Text style={[styles.bio, { color: colors.textMuted }]} numberOfLines={1}>{user.bio}</Text>}
            {(user?.city || user?.nasuhaRegion) && (
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={12} color={colors.textMuted} />
                <Text style={[styles.locationText, { color: colors.textMuted }]}>
                  {[user.city, user.nasuhaRegion].filter(Boolean).join(' · ')}
                </Text>
              </View>
            )}
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </Pressable>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statVal, { color: colors.primary }]}>0</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Riyadhoh</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statVal, { color: colors.gold }]}>0</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>TSN</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statVal, { color: colors.success }]}>{totalBookmarks}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Bookmark</Text>
          </View>
        </View>
      </View>

      {/* User Detail Card */}
      {user && (user.phone || user.occupation || user.gender) && (
        <View style={[styles.detailCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {user.phone && (
            <View style={styles.detailRow}>
              <Ionicons name="call-outline" size={16} color={colors.textMuted} />
              <Text style={[styles.detailText, { color: colors.text }]}>{user.phone}</Text>
            </View>
          )}
          {user.occupation && (
            <View style={styles.detailRow}>
              <Ionicons name="briefcase-outline" size={16} color={colors.textMuted} />
              <Text style={[styles.detailText, { color: colors.text }]}>{user.occupation}</Text>
            </View>
          )}
          {user.gender && (
            <View style={styles.detailRow}>
              <Ionicons name={user.gender === 'laki-laki' ? 'male' : 'female'} size={16} color={colors.textMuted} />
              <Text style={[styles.detailText, { color: colors.text }]}>
                {user.gender === 'laki-laki' ? 'Laki-laki' : 'Perempuan'}
              </Text>
            </View>
          )}
          {user.birthDate && (
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={16} color={colors.textMuted} />
              <Text style={[styles.detailText, { color: colors.text }]}>{user.birthDate}</Text>
            </View>
          )}
        </View>
      )}

      {/* Badge */}
      <View style={[styles.badgeCard, Shadows.gold]}>
        <Image source={LOGO_BADGE} style={styles.badgeImage} resizeMode="contain" />
        <View style={{ flex: 1 }}>
          <Text style={[styles.badgeTitle, { color: colors.gold }]}>NASUHA</Text>
          <Text style={[styles.badgeSub, { color: colors.textSecondary }]}>Bersahabat di Dunia, Bertetangga di Surga</Text>
        </View>
      </View>

      {/* Color Scheme Picker */}
      <View style={[styles.colorCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.colorTitle, { color: colors.text }]}>Tema Warna</Text>
        <View style={styles.colorRow}>
          {(Object.keys(COLOR_SCHEMES) as ColorScheme[]).map((key) => {
            const scheme = COLOR_SCHEMES[key];
            const isActive = colorScheme === key;
            return (
              <Pressable
                key={key}
                onPress={() => setColorScheme(key)}
                style={[styles.colorOption, isActive && { borderColor: scheme.primary, borderWidth: 2.5 }]}
              >
                <View style={[styles.colorCircle, { backgroundColor: scheme.primary }]}>
                  <Ionicons name={scheme.icon as any} size={16} color="#FFF" />
                </View>
                <Text style={[styles.colorLabel, { color: isActive ? scheme.primary : colors.textSecondary }]}>{scheme.label.split(' ')[0]}</Text>
                {isActive && <Ionicons name="checkmark-circle" size={14} color={scheme.primary} />}
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Font Size Settings */}
      <View style={[styles.fontSizeCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.fontSizeTitle, { color: colors.text }]}>Ukuran Huruf</Text>
        
        {/* Quran Font Size */}
        <View style={styles.fontSizeSection}>
          <View style={styles.fontSizeHeader}>
            <Ionicons name="book-outline" size={18} color={colors.primary} />
            <Text style={[styles.fontSizeLabel, { color: colors.text }]}>Al-Quran</Text>
          </View>
          <View style={styles.fontSizeControl}>
            <Pressable onPress={() => setQuranFontSize(quranFontSize - 2)} style={[styles.fontSizeBtn, { backgroundColor: colors.textMuted + '20' }]}>
              <Ionicons name="remove" size={18} color={colors.text} />
            </Pressable>
            <Text style={[styles.fontSizeValue, { color: colors.text }]}>{quranFontSize}px</Text>
            <Pressable onPress={() => setQuranFontSize(quranFontSize + 2)} style={[styles.fontSizeBtn, { backgroundColor: colors.textMuted + '20' }]}>
              <Ionicons name="add" size={18} color={colors.text} />
            </Pressable>
          </View>
          <Text style={[styles.fontSizePreview, { color: colors.textSecondary, fontSize: quranFontSize }]}>
            وَقُرْآنًا فَرَقْنَاهُ
          </Text>
        </View>

        {/* Hadith Font Size */}
        <View style={[styles.fontSizeSection, { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: Spacing.md, marginTop: Spacing.md }]}>
          <View style={styles.fontSizeHeader}>
            <Ionicons name="document-text-outline" size={18} color={colors.gold} />
            <Text style={[styles.fontSizeLabel, { color: colors.text }]}>Hadis</Text>
          </View>
          <View style={styles.fontSizeControl}>
            <Pressable onPress={() => setHadithFontSize(hadithFontSize - 2)} style={[styles.fontSizeBtn, { backgroundColor: colors.textMuted + '20' }]}>
              <Ionicons name="remove" size={18} color={colors.text} />
            </Pressable>
            <Text style={[styles.fontSizeValue, { color: colors.text }]}>{hadithFontSize}px</Text>
            <Pressable onPress={() => setHadithFontSize(hadithFontSize + 2)} style={[styles.fontSizeBtn, { backgroundColor: colors.textMuted + '20' }]}>
              <Ionicons name="add" size={18} color={colors.text} />
            </Pressable>
          </View>
          <Text style={[styles.fontSizePreview, { color: colors.textSecondary, fontSize: hadithFontSize }]}>
            عن أبي هريرة رضي الله عنه
          </Text>
        </View>
      </View>

      {/* Menu */}
      <View style={[styles.menuCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {menuItems.map((item, idx) => (
          <Pressable
            key={item.label}
            onPress={item.action}
            style={({ pressed }) => [
              styles.menuItem,
              idx < menuItems.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Ionicons name={item.icon} size={22} color={item.color || colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
              {item.sub && <Text style={[styles.menuSub, { color: colors.textSecondary }]}>{item.sub}</Text>}
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </Pressable>
        ))}
      </View>

      {/* Logout */}
      <Pressable onPress={handleLogout} style={[styles.logoutBtn, { backgroundColor: colors.error + '10', borderColor: colors.error }]}>
        <Ionicons name="log-out-outline" size={20} color={colors.error} />
        <Text style={[styles.logoutText, { color: colors.error }]}>Keluar dari Akun</Text>
      </Pressable>

      {/* User Info */}
      {user && (
        <View style={[styles.userInfoCard, { backgroundColor: colors.surface }]}>
          <Ionicons name="finger-print-outline" size={16} color={colors.textMuted} />
          <Text style={[styles.userInfoText, { color: colors.textMuted }]}>
            Login sebagai {user.email} · {ROLE_LABELS[user.role] || 'Member'}
          </Text>
        </View>
      )}

      {/* About Modal */}
      <Modal visible={showAbout} transparent animationType="slide" onRequestClose={() => setShowAbout(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowAbout(false)}>
          <Pressable style={[styles.modalContent, { backgroundColor: colors.card }]} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHandle} />
            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 500 }}>
              <Text style={[styles.aboutTitle, { color: colors.primary }]}>NASUHA App</Text>
              <Text style={[styles.aboutVersion, { color: colors.gold }]}>Versi 1.0.0</Text>

              <Text style={[styles.aboutDesc, { color: colors.text }]}>
                Aplikasi resmi komunitas NASUHA.
              </Text>
              <Text style={[styles.aboutTagline, { color: colors.textSecondary }]}>
                Hijrah Bersama, Tumbuh Bersama, Bebas Utang Bersama.
              </Text>

              <Text style={[styles.aboutSectionTitle, { color: colors.text }]}>Fitur Utama</Text>
              {[
                'Al-Quran & Hadis lengkap dengan terjemahan',
                'Riyadhoh & tracking ibadah harian',
                'Program LBU & TSN',
                'Motivasi & 260+ Kalimat Muhasabah',
                'Lapak Sahabat NASUHA',
                'Asisten Anas AI',
                'Media Sosial & Kegiatan',
                'Event Management (TSN, LBU, KFM, TOT, dll)',
              ].map((f, i) => (
                <View key={i} style={styles.aboutFeatureRow}>
                  <Ionicons name="checkmark-circle" size={14} color={colors.success} />
                  <Text style={[styles.aboutFeatureText, { color: colors.textSecondary }]}>{f}</Text>
                </View>
              ))}

              <View style={[styles.aboutDivider, { backgroundColor: colors.border }]} />

              <Text style={[styles.aboutSectionTitle, { color: colors.text }]}>Informasi</Text>
              {[
                { label: 'Dibuat oleh', value: 'Dani Hamdani' },
                { label: 'Organisasi', value: 'NASUHA' },
                { label: 'Tanggal Rilis', value: '8 Agustus 2026' },
                { label: 'Website', value: 'nasuha.org' },
                { label: 'Instagram', value: '@nasuhajakarta' },
              ].map((info, i) => (
                <View key={i} style={styles.aboutInfoRow}>
                  <Text style={[styles.aboutInfoLabel, { color: colors.textMuted }]}>{info.label}</Text>
                  <Text style={[styles.aboutInfoValue, { color: colors.text }]}>{info.value}</Text>
                </View>
              ))}

              <View style={{ height: 20 }} />
            </ScrollView>

            <Pressable onPress={() => setShowAbout(false)} style={[styles.aboutCloseBtn, { backgroundColor: colors.primary }]}>
              <Text style={styles.aboutCloseBtnText}>Tutup</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

export default memo(ProfileScreen);

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingTop: 56, paddingBottom: 100 },
  profileCard: { marginHorizontal: Spacing.lg, borderRadius: BorderRadius.lg, overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth },
  shimmerTop: { height: 3 },
  profileRow: { flexDirection: 'row', alignItems: 'center', padding: Spacing.lg, gap: Spacing.md },

  // Avatar
  avatarImage: { width: 60, height: 60, borderRadius: 30 },
  avatarFallback: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  avatarInitials: { color: '#FFF', fontSize: FontSize.xl, fontWeight: '900' },

  name: { fontSize: FontSize.xl, fontWeight: '800' },
  email: { fontSize: FontSize.sm, marginTop: 2 },
  bio: { fontSize: FontSize.xs, marginTop: 4, fontStyle: 'italic' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 2 },
  locationText: { fontSize: FontSize.xs },
  roleBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: BorderRadius.sm },
  roleText: { fontSize: FontSize.xs, fontWeight: '700' },
  statsRow: { flexDirection: 'row', paddingHorizontal: Spacing.lg, paddingBottom: Spacing.lg },
  statItem: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: FontSize.xxl, fontWeight: '800' },
  statLabel: { fontSize: FontSize.xs, marginTop: 2 },
  statDivider: { width: 1, height: 32, alignSelf: 'center' },

  // Detail Card
  detailCard: {
    marginHorizontal: Spacing.lg, marginTop: Spacing.sm, borderRadius: BorderRadius.lg,
    borderWidth: StyleSheet.hairlineWidth, padding: Spacing.md, gap: Spacing.sm,
  },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  detailText: { fontSize: FontSize.sm },

  badgeCard: { flexDirection: 'row', alignItems: 'center', marginHorizontal: Spacing.lg, marginTop: Spacing.md, padding: Spacing.md, borderRadius: BorderRadius.lg, gap: Spacing.md },
  badgeImage: { width: 56, height: 56 },
  badgeTitle: { fontSize: FontSize.lg, fontWeight: '700' },
  badgeSub: { fontSize: FontSize.xs, marginTop: 2 },

  // Color Scheme Picker
  colorCard: { marginHorizontal: Spacing.lg, marginTop: Spacing.md, borderRadius: BorderRadius.lg, borderWidth: StyleSheet.hairlineWidth, padding: Spacing.md },
  colorTitle: { fontSize: FontSize.md, fontWeight: '700', marginBottom: Spacing.sm },
  colorRow: { flexDirection: 'row', justifyContent: 'space-between' },
  colorOption: { alignItems: 'center', gap: 4, padding: 6, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: 'transparent' },
  colorCircle: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  colorLabel: { fontSize: 10, fontWeight: '600' },

  menuCard: { marginHorizontal: Spacing.lg, marginTop: Spacing.lg, borderRadius: BorderRadius.lg, overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, gap: Spacing.md },
  menuLabel: { fontSize: FontSize.md, fontWeight: '600' },
  menuSub: { fontSize: FontSize.xs, marginTop: 1 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: Spacing.lg, marginTop: Spacing.lg, paddingVertical: 14, borderRadius: BorderRadius.lg, borderWidth: 1.5, gap: Spacing.sm },
  logoutText: { fontSize: FontSize.md, fontWeight: '700' },
  userInfoCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: Spacing.lg, marginTop: Spacing.md, padding: Spacing.sm, borderRadius: BorderRadius.md, gap: Spacing.xs },
  userInfoText: { fontSize: FontSize.xs },

  // About Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: Spacing.lg, paddingBottom: 40 },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#CCC', alignSelf: 'center', marginBottom: Spacing.lg },
  aboutTitle: { fontSize: FontSize.xxl, fontWeight: '800', textAlign: 'center' },
  aboutVersion: { fontSize: FontSize.md, fontWeight: '700', textAlign: 'center', marginTop: 4 },
  aboutDesc: { fontSize: FontSize.md, lineHeight: 22, textAlign: 'center', marginTop: Spacing.md },
  aboutTagline: { fontSize: FontSize.sm, fontStyle: 'italic', textAlign: 'center', marginTop: 4 },
  aboutSectionTitle: { fontSize: FontSize.md, fontWeight: '700', marginTop: Spacing.lg, marginBottom: Spacing.sm },
  aboutFeatureRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 3 },
  aboutFeatureText: { fontSize: FontSize.sm, flex: 1 },
  aboutDivider: { height: 1, marginVertical: Spacing.md },
  aboutInfoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  aboutInfoLabel: { fontSize: FontSize.sm },
  aboutInfoValue: { fontSize: FontSize.sm, fontWeight: '600' },
  aboutCloseBtn: { paddingVertical: 12, borderRadius: BorderRadius.lg, alignItems: 'center', marginTop: Spacing.sm },
  aboutCloseBtnText: { color: '#FFF', fontSize: FontSize.md, fontWeight: '700' },
});
