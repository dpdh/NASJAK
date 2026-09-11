import React, { memo, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
  TextInput,
  Image,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from '../../store/appStore';
import { Colors, Spacing, BorderRadius, FontSize, Shadows } from '../../constants/theme';
import { ShimmerGold } from '../../components/ui/ShimmerGold';
import type { User, LapakProduct, Event } from '../../types';

const ROLE_COLORS: Record<User['role'], string> = { super_admin: '#FF6B6B', admin: '#D4A853', sahabat: '#2EC4B6', calon_sahabat: '#999999' };
const ROLE_LABELS: Record<User['role'], string> = { super_admin: 'Super Admin', admin: 'Admin', sahabat: 'Sahabat NASUHA', calon_sahabat: 'Calon Sahabat' };
const STATUS_COLORS: Record<LapakProduct['status'], string> = { pending: '#FFB347', approved: '#2EC4B6', rejected: '#FF6B6B' };
const STATUS_LABELS: Record<LapakProduct['status'], string> = { pending: 'Menunggu', approved: 'Disetujui', rejected: 'Ditolak' };

type CmsTab = 'users' | 'lapak' | 'events' | 'registrations' | 'membership';
type LapakFilter = 'semua' | 'pending' | 'approved' | 'rejected';
type MembershipFilter = 'semua' | 'free' | 'membership' | 'sahabat';
type EventFilter = 'semua' | 'published' | 'draft' | 'cancelled';
const EVENT_STATUS_COLORS: Record<string, string> = { published: '#2EC4B6', draft: '#FFB347', cancelled: '#FF6B6B' };
const EVENT_STATUS_LABELS: Record<string, string> = { published: 'Published', draft: 'Draft', cancelled: 'Dibatalkan' };
const EVENT_TYPE_COLORS: Record<string, string> = { TSN: '#4A90D9', LBU: '#2EC4B6', Kajian: '#D4A853', 'Safari Dakwah': '#9B59B6', KFM: '#E67E22', TOT: '#E74C3C', 'Scale Up Bisnis': '#27AE60', 'Digital Marketing': '#3498DB', 'Public Speaking': '#F39C12', 'Business Coaching': '#8E44AD' };

// ─── Member Card ───
const MemberCard = memo(({ item, isCurrentUser, currentUserRole, colors, onChangeRole, onToggleActive, onRemove }: {
  item: User; isCurrentUser: boolean; currentUserRole: User['role']; colors: typeof Colors.light;
  onChangeRole: (id: string, role: User['role']) => void; onToggleActive: (id: string) => void; onRemove: (id: string) => void;
}) => (
  <View style={[styles.card, { backgroundColor: colors.card, borderColor: item.isActive ? colors.border : colors.error + '40', opacity: item.isActive ? 1 : 0.6 }, Shadows.sm]}>
    <View style={styles.cardRow}>
      {item.avatar ? (
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatarFallback, { backgroundColor: ROLE_COLORS[item.role] }]}>
          <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
        </View>
      )}
      <View style={{ flex: 1 }}>
        <View style={styles.nameRow}>
          <Text style={[styles.cardName, { color: colors.text }]} numberOfLines={1}>{item.name}</Text>
          {isCurrentUser && <View style={[styles.youBadge, { backgroundColor: colors.primary }]}><Text style={styles.youText}>Anda</Text></View>}
        </View>
        <Text style={[styles.cardSub, { color: colors.textSecondary }]}>{item.email}</Text>
        <Text style={[styles.cardMeta, { color: colors.textMuted }]}>Bergabung: {new Date(item.joinDate).toLocaleDateString('id-ID')}</Text>
      </View>
    </View>
    <View style={styles.actionRow}>
      <View style={[styles.badge, { backgroundColor: ROLE_COLORS[item.role] + '20' }]}>
        <View style={[styles.dot, { backgroundColor: ROLE_COLORS[item.role] }]} />
        <Text style={[styles.badgeText, { color: ROLE_COLORS[item.role] }]}>{ROLE_LABELS[item.role]}</Text>
      </View>
      <View style={[styles.badge, { backgroundColor: (item.isActive ? colors.success : colors.error) + '20' }]}>
        <Text style={[styles.badgeText, { color: item.isActive ? colors.success : colors.error }]}>{item.isActive ? 'Aktif' : 'Nonaktif'}</Text>
      </View>
      {!isCurrentUser && (
        <View style={styles.btnRow}>
          <Pressable onPress={() => {
            const allRoles: User['role'][] = ['calon_sahabat', 'sahabat', 'admin', 'super_admin'];
            const allowedRoles: User['role'][] = currentUserRole === 'super_admin' ? allRoles : ['calon_sahabat', 'sahabat'];
            const currentIdx = allowedRoles.indexOf(item.role);
            const next = allowedRoles[(currentIdx + 1) % allowedRoles.length];
            Alert.alert('Ubah Role', `Jadikan ${item.name} sebagai ${ROLE_LABELS[next]}?`, [
              { text: 'Batal', style: 'cancel' },
              { text: `Jadikan ${ROLE_LABELS[next]}`, onPress: () => onChangeRole(item.id, next) },
            ]);
          }} style={[styles.iconBtn, { backgroundColor: colors.primary + '15' }]}>
            <Ionicons name="shield-outline" size={16} color={colors.primary} />
          </Pressable>
          <Pressable onPress={() => onToggleActive(item.id)} style={[styles.iconBtn, { backgroundColor: colors.warning + '15' }]}>
            <Ionicons name={item.isActive ? 'pause-outline' : 'play-outline'} size={16} color={colors.warning} />
          </Pressable>
          <Pressable onPress={() => Alert.alert('Hapus', `Hapus ${item.name}?`, [
            { text: 'Batal', style: 'cancel' },
            { text: 'Hapus', style: 'destructive', onPress: () => onRemove(item.id) },
          ])} style={[styles.iconBtn, { backgroundColor: colors.error + '15' }]}>
            <Ionicons name="trash-outline" size={16} color={colors.error} />
          </Pressable>
        </View>
      )}
    </View>
  </View>
));

// ─── Product Moderation Card ───
const ProductModCard = memo(({ item, colors, onApprove, onReject, onDelete }: {
  item: LapakProduct; colors: typeof Colors.light;
  onApprove: (id: string) => void; onReject: (id: string) => void; onDelete: (id: string) => void;
}) => (
  <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }, Shadows.sm]}>
    <View style={styles.cardRow}>
      {item.photos.length > 0 ? (
        <Image source={{ uri: item.photos[0] }} style={styles.productThumb} />
      ) : (
        <View style={[styles.productThumbPlaceholder, { backgroundColor: colors.gold + '20' }]}>
          <Ionicons name="image-outline" size={24} color={colors.gold} />
        </View>
      )}
      <View style={{ flex: 1 }}>
        <Text style={[styles.cardName, { color: colors.text }]} numberOfLines={1}>{item.name}</Text>
        <Text style={[styles.cardSub, { color: colors.gold }]}>Rp {item.price.toLocaleString('id-ID')}</Text>
        <Text style={[styles.cardMeta, { color: colors.textSecondary }]}>{item.sellerName} · {item.sellerCity}</Text>
        <Text style={[styles.cardMeta, { color: colors.textMuted }]}>{item.category} · {item.photos.length} foto</Text>
      </View>
    </View>

    {/* Specs preview */}
    <View style={styles.specsRow}>
      {item.specs.condition && <View style={[styles.specChip, { backgroundColor: colors.surface }]}><Text style={[styles.specText, { color: colors.textSecondary }]}>{item.specs.condition}</Text></View>}
      {item.specs.weight && <View style={[styles.specChip, { backgroundColor: colors.surface }]}><Text style={[styles.specText, { color: colors.textSecondary }]}>{item.specs.weight}</Text></View>}
      {item.specs.stock !== undefined && <View style={[styles.specChip, { backgroundColor: colors.surface }]}><Text style={[styles.specText, { color: colors.textSecondary }]}>Stok: {item.specs.stock}</Text></View>}
    </View>

    <View style={styles.actionRow}>
      <View style={[styles.badge, { backgroundColor: STATUS_COLORS[item.status] + '20' }]}>
        <View style={[styles.dot, { backgroundColor: STATUS_COLORS[item.status] }]} />
        <Text style={[styles.badgeText, { color: STATUS_COLORS[item.status] }]}>{STATUS_LABELS[item.status]}</Text>
      </View>
      <Text style={[styles.dateText, { color: colors.textMuted }]}>{new Date(item.createdAt).toLocaleDateString('id-ID')}</Text>
      <View style={styles.btnRow}>
        {item.status !== 'approved' && (
          <Pressable onPress={() => onApprove(item.id)} style={[styles.iconBtn, { backgroundColor: '#2EC4B6' + '20' }]}>
            <Ionicons name="checkmark" size={16} color="#2EC4B6" />
          </Pressable>
        )}
        {item.status !== 'rejected' && (
          <Pressable onPress={() => onReject(item.id)} style={[styles.iconBtn, { backgroundColor: '#FFB347' + '20' }]}>
            <Ionicons name="close" size={16} color="#FFB347" />
          </Pressable>
        )}
        <Pressable onPress={() => Alert.alert('Hapus Produk', `Hapus "${item.name}"?`, [
          { text: 'Batal', style: 'cancel' },
          { text: 'Hapus', style: 'destructive', onPress: () => onDelete(item.id) },
        ])} style={[styles.iconBtn, { backgroundColor: '#FF6B6B20' }]}>
          <Ionicons name="trash-outline" size={16} color="#FF6B6B" />
        </Pressable>
      </View>
    </View>
  </View>
));

// ─── Event Card ───
const EventModCard = memo(({ item, colors, onEdit, onPublish, onCancel, onDelete }: {
  item: Event; colors: typeof Colors.light;
  onEdit: (id: number) => void; onPublish: (id: number) => void; onCancel: (id: number) => void; onDelete: (id: number) => void;
}) => {
  const status = item.status || 'published';
  const pct = item.quota > 0 ? Math.round((item.registered / item.quota) * 100) : 0;
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }, Shadows.sm]}>
      <View style={styles.cardRow}>
        <View style={[styles.eventIcon, { backgroundColor: (EVENT_TYPE_COLORS[item.type] || colors.primary) + '20' }]}>
          <Ionicons name={item.type === 'TSN' ? 'people' : item.type === 'LBU' ? 'cash' : item.type === 'Kajian' ? 'book' : 'megaphone'} size={24} color={EVENT_TYPE_COLORS[item.type] || colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.cardName, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
          <Text style={[styles.cardSub, { color: colors.textSecondary }]}>{item.type} · {new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</Text>
          <Text style={[styles.cardMeta, { color: colors.textMuted }]}>{item.time} · {item.location}</Text>
        </View>
      </View>
      <View style={[styles.progressRow, { marginTop: 8 }]}>
        <View style={[styles.progressBg, { backgroundColor: colors.surface }]}>
          <View style={[styles.progressFill, { width: `${Math.min(pct, 100)}%`, backgroundColor: pct >= 90 ? '#FF6B6B' : pct >= 70 ? '#FFB347' : '#2EC4B6' }]} />
        </View>
        <Text style={[styles.cardMeta, { color: colors.textMuted }]}>{item.registered}/{item.quota} ({pct}%)</Text>
      </View>
      <View style={styles.actionRow}>
        <View style={[styles.badge, { backgroundColor: (EVENT_STATUS_COLORS[status] || '#999') + '20' }]}>
          <View style={[styles.dot, { backgroundColor: EVENT_STATUS_COLORS[status] || '#999' }]} />
          <Text style={[styles.badgeText, { color: EVENT_STATUS_COLORS[status] || '#999' }]}>{EVENT_STATUS_LABELS[status] || status}</Text>
        </View>
        <View style={styles.btnRow}>
          <Pressable onPress={() => onEdit(item.id)} style={[styles.iconBtn, { backgroundColor: colors.primary + '15' }]}>
            <Ionicons name="create-outline" size={16} color={colors.primary} />
          </Pressable>
          {status !== 'published' && (
            <Pressable onPress={() => onPublish(item.id)} style={[styles.iconBtn, { backgroundColor: '#2EC4B620' }]}>
              <Ionicons name="checkmark" size={16} color="#2EC4B6" />
            </Pressable>
          )}
          {status !== 'cancelled' && (
            <Pressable onPress={() => onCancel(item.id)} style={[styles.iconBtn, { backgroundColor: '#FFB34720' }]}>
              <Ionicons name="close" size={16} color="#FFB347" />
            </Pressable>
          )}
          <Pressable onPress={() => Alert.alert('Hapus Event', `Hapus "${item.title}"?`, [
            { text: 'Batal', style: 'cancel' },
            { text: 'Hapus', style: 'destructive', onPress: () => onDelete(item.id) },
          ])} style={[styles.iconBtn, { backgroundColor: '#FF6B6B20' }]}>
            <Ionicons name="trash-outline" size={16} color="#FF6B6B" />
          </Pressable>
        </View>
      </View>
    </View>
  );
});

// ─── Main Admin Screen ───
function AdminScreen() {
  const theme = useAppStore((s) => s.theme);
  const user = useAppStore((s) => s.user);
  const members = useAppStore((s) => s.members);
  const products = useAppStore((s) => s.products);
  const events = useAppStore((s) => s.events);
  const eventRegistrations = useAppStore((s) => s.eventRegistrations);
  const confirmRegistration = useAppStore((s) => s.confirmRegistration);
  const cancelRegistration = useAppStore((s) => s.cancelRegistration);
  const updateMemberRole = useAppStore((s) => s.updateMemberRole);
  const toggleMemberActive = useAppStore((s) => s.toggleMemberActive);
  const removeMember = useAppStore((s) => s.removeMember);
  const approveProduct = useAppStore((s) => s.approveProduct);
  const rejectProduct = useAppStore((s) => s.rejectProduct);
  const deleteProduct = useAppStore((s) => s.deleteProduct);
  const updateEvent = useAppStore((s) => s.updateEvent);
  const deleteEvent = useAppStore((s) => s.deleteEvent);
  const colors = Colors[theme];
  const membershipPlans = useAppStore((s) => s.membershipPlans);
  const updateMembershipPlan = useAppStore((s) => s.updateMembershipPlan);
  const updateUserMembership = useAppStore((s) => s.updateUserMembership);

  const [activeTab, setActiveTab] = useState<CmsTab>('users');
  const [search, setSearch] = useState('');
  const [lapakFilter, setLapakFilter] = useState<LapakFilter>('semua');
  const [eventFilter, setEventFilter] = useState<EventFilter>('semua');
  const [membershipFilter, setMembershipFilter] = useState<MembershipFilter>('semua');

  if (!user || (user.role !== 'super_admin' && user.role !== 'admin')) {
    return (
      <View style={[styles.denied, { backgroundColor: colors.background }]}>
        <Ionicons name="lock-closed" size={64} color={colors.textMuted} />
        <Text style={[styles.deniedTitle, { color: colors.text }]}>Akses Ditolak</Text>
        <Text style={[styles.deniedSub, { color: colors.textSecondary }]}>Hanya admin yang dapat mengakses halaman ini</Text>
        <Pressable onPress={() => router.back()} style={[styles.backBtn, { borderColor: colors.primary }]}>
          <Text style={[styles.backBtnText, { color: colors.primary }]}>Kembali</Text>
        </Pressable>
      </View>
    );
  }

  const userStats = useMemo(() => ({
    total: members.length,
    admins: members.filter((m) => m.role === 'super_admin' || m.role === 'admin').length,
    active: members.filter((m) => m.isActive).length,
  }), [members]);

  const productStats = useMemo(() => ({
    total: products.length,
    pending: products.filter((p) => p.status === 'pending').length,
    approved: products.filter((p) => p.status === 'approved').length,
    rejected: products.filter((p) => p.status === 'rejected').length,
  }), [products]);

  const filteredMembers = useMemo(() => {
    if (!search.trim()) return members;
    const q = search.toLowerCase();
    return members.filter((m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q));
  }, [search, members]);

  const filteredProducts = useMemo(() => {
    let list = products;
    if (lapakFilter !== 'semua') list = list.filter((p) => p.status === lapakFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.sellerName.toLowerCase().includes(q));
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [products, lapakFilter, search]);

  const eventStats = useMemo(() => ({
    total: events.length,
    published: events.filter((e) => (e.status || 'published') === 'published').length,
    draft: events.filter((e) => e.status === 'draft').length,
    cancelled: events.filter((e) => e.status === 'cancelled').length,
  }), [events]);

  const filteredEvents = useMemo(() => {
    let list = events;
    if (eventFilter !== 'semua') list = list.filter((e) => (e.status || 'published') === eventFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((e) => e.title.toLowerCase().includes(q) || e.type.toLowerCase().includes(q) || e.location.toLowerCase().includes(q));
    }
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [events, eventFilter, search]);

  const tabs: { id: CmsTab; label: string; icon: React.ComponentProps<typeof Ionicons>['name']; count: number }[] = [
    { id: 'users', label: 'Users', icon: 'people', count: userStats.total },
    { id: 'lapak', label: 'Lapak', icon: 'storefront', count: productStats.total },
    { id: 'events', label: 'Events', icon: 'calendar', count: eventStats.total },
    { id: 'registrations', label: 'Daftar', icon: 'clipboard', count: eventRegistrations.filter((r) => r.status !== 'cancelled').length },
  ];

  const lapakFilters: { id: LapakFilter; label: string; count: number }[] = [
    { id: 'semua', label: 'Semua', count: productStats.total },
    { id: 'pending', label: 'Pending', count: productStats.pending },
    { id: 'approved', label: 'Approved', count: productStats.approved },
    { id: 'rejected', label: 'Rejected', count: productStats.rejected },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <LinearGradient colors={['#FF6B6B', '#C44569']} style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </Pressable>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.headerTitle}>CMS Admin Panel</Text>
          <Text style={styles.headerSub}>Kelola Users & Lapak NASUHA Jakarta</Text>
        </View>
        <Ionicons name="settings-outline" size={24} color="#FFF" />
      </LinearGradient>

      {/* Stats */}
      <View style={[styles.statsCard, { backgroundColor: colors.card, borderColor: colors.border }, Shadows.md]}>
        <ShimmerGold style={styles.shimmer} />
        {activeTab === 'users' ? (
          <View style={styles.statsGrid}>
            <View style={styles.statItem}><Text style={[styles.statVal, { color: colors.primary }]}>{userStats.total}</Text><Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total User</Text></View>
            <View style={styles.statItem}><Text style={[styles.statVal, { color: '#FF6B6B' }]}>{userStats.admins}</Text><Text style={[styles.statLabel, { color: colors.textSecondary }]}>Admin</Text></View>
            <View style={styles.statItem}><Text style={[styles.statVal, { color: colors.success }]}>{userStats.active}</Text><Text style={[styles.statLabel, { color: colors.textSecondary }]}>Aktif</Text></View>
          </View>
        ) : activeTab === 'lapak' ? (
          <View style={styles.statsGrid}>
            <View style={styles.statItem}><Text style={[styles.statVal, { color: colors.primary }]}>{productStats.total}</Text><Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total</Text></View>
            <View style={styles.statItem}><Text style={[styles.statVal, { color: '#FFB347' }]}>{productStats.pending}</Text><Text style={[styles.statLabel, { color: colors.textSecondary }]}>Pending</Text></View>
            <View style={styles.statItem}><Text style={[styles.statVal, { color: '#2EC4B6' }]}>{productStats.approved}</Text><Text style={[styles.statLabel, { color: colors.textSecondary }]}>Approved</Text></View>
            <View style={styles.statItem}><Text style={[styles.statVal, { color: '#FF6B6B' }]}>{productStats.rejected}</Text><Text style={[styles.statLabel, { color: colors.textSecondary }]}>Rejected</Text></View>
          </View>
        ) : activeTab === 'events' ? (
          <View style={styles.statsGrid}>
            <View style={styles.statItem}><Text style={[styles.statVal, { color: colors.primary }]}>{eventStats.total}</Text><Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total</Text></View>
            <View style={styles.statItem}><Text style={[styles.statVal, { color: '#2EC4B6' }]}>{eventStats.published}</Text><Text style={[styles.statLabel, { color: colors.textSecondary }]}>Published</Text></View>
            <View style={styles.statItem}><Text style={[styles.statVal, { color: '#FFB347' }]}>{eventStats.draft}</Text><Text style={[styles.statLabel, { color: colors.textSecondary }]}>Draft</Text></View>
            <View style={styles.statItem}><Text style={[styles.statVal, { color: '#FF6B6B' }]}>{eventStats.cancelled}</Text><Text style={[styles.statLabel, { color: colors.textSecondary }]}>Dibatalkan</Text></View>
          </View>
        ) : (
          <View style={styles.statsGrid}>
            <View style={styles.statItem}><Text style={[styles.statVal, { color: colors.primary }]}>{eventRegistrations.length}</Text><Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total</Text></View>
            <View style={styles.statItem}><Text style={[styles.statVal, { color: '#2EC4B6' }]}>{eventRegistrations.filter((r) => r.status === 'confirmed').length}</Text><Text style={[styles.statLabel, { color: colors.textSecondary }]}>Konfirmasi</Text></View>
            <View style={styles.statItem}><Text style={[styles.statVal, { color: '#FFB347' }]}>{eventRegistrations.filter((r) => r.status === 'registered').length}</Text><Text style={[styles.statLabel, { color: colors.textSecondary }]}>Pending</Text></View>
            <View style={styles.statItem}><Text style={[styles.statVal, { color: '#FF6B6B' }]}>{eventRegistrations.filter((r) => r.status === 'cancelled').length}</Text><Text style={[styles.statLabel, { color: colors.textSecondary }]}>Batal</Text></View>
          </View>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {tabs.map((t) => (
          <Pressable key={t.id} onPress={() => { setActiveTab(t.id); setSearch(''); }} style={[styles.tab, activeTab === t.id && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}>
            <Ionicons name={t.icon as any} size={18} color={activeTab === t.id ? colors.primary : colors.textMuted} />
            <Text style={[styles.tabLabel, { color: activeTab === t.id ? colors.primary : colors.textMuted }]}>{t.label}</Text>
            <View style={[styles.tabCount, { backgroundColor: activeTab === t.id ? colors.primary : colors.textMuted + '30' }]}>
              <Text style={[styles.tabCountText, { color: activeTab === t.id ? '#FFF' : colors.textMuted }]}>{t.count}</Text>
            </View>
          </Pressable>
        ))}
      </View>

      {/* Search */}
      <View style={{ paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm }}>
        <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="search-outline" size={18} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder={activeTab === 'users' ? 'Cari user...' : 'Cari produk/penjual...'}
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && <Pressable onPress={() => setSearch('')}><Ionicons name="close-circle" size={18} color={colors.textMuted} /></Pressable>}
        </View>
      </View>

      {/* Lapak Filters */}
      {activeTab === 'lapak' && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {lapakFilters.map((f) => (
            <Pressable key={f.id} onPress={() => setLapakFilter(f.id)}
              style={[styles.filterChip, { backgroundColor: lapakFilter === f.id ? colors.primary : colors.surface, borderColor: lapakFilter === f.id ? colors.primary : colors.border }]}>
              <Text style={[styles.filterText, { color: lapakFilter === f.id ? '#FFF' : colors.textSecondary }]}>{f.label} ({f.count})</Text>
            </Pressable>
          ))}
        </ScrollView>
      )}

      {/* Event Filters */}
      {activeTab === 'events' && (
        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
            {([{ id: 'semua' as EventFilter, label: 'Semua', count: eventStats.total }, { id: 'published' as EventFilter, label: 'Published', count: eventStats.published }, { id: 'draft' as EventFilter, label: 'Draft', count: eventStats.draft }, { id: 'cancelled' as EventFilter, label: 'Dibatalkan', count: eventStats.cancelled }]).map((f) => (
              <Pressable key={f.id} onPress={() => setEventFilter(f.id)}
                style={[styles.filterChip, { backgroundColor: eventFilter === f.id ? colors.primary : colors.surface, borderColor: eventFilter === f.id ? colors.primary : colors.border }]}>
                <Text style={[styles.filterText, { color: eventFilter === f.id ? '#FFF' : colors.textSecondary }]}>{f.label} ({f.count})</Text>
              </Pressable>
            ))}
          </ScrollView>
          <View style={{ paddingHorizontal: Spacing.lg, paddingBottom: Spacing.sm }}>
            <Pressable onPress={() => router.push('/event/add' as any)} style={[styles.addEventBtn, { backgroundColor: colors.primary }]}>
              <Ionicons name="add" size={20} color="#FFF" />
              <Text style={styles.addEventText}>Tambah Event Baru</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Content */}
      {activeTab === 'users' ? (
        <FlatList
          data={filteredMembers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MemberCard item={item} isCurrentUser={item.id === user.id} currentUserRole={user.role} colors={colors}
              onChangeRole={updateMemberRole} onToggleActive={toggleMemberActive} onRemove={removeMember} />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<View style={styles.empty}><Ionicons name="people-outline" size={48} color={colors.textMuted} /><Text style={[styles.emptyText, { color: colors.textSecondary }]}>Belum ada user</Text></View>}
        />
      ) : activeTab === 'lapak' ? (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductModCard item={item} colors={colors}
              onApprove={approveProduct} onReject={rejectProduct} onDelete={deleteProduct} />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<View style={styles.empty}><Ionicons name="bag-outline" size={48} color={colors.textMuted} /><Text style={[styles.emptyText, { color: colors.textSecondary }]}>{lapakFilter === 'semua' ? 'Belum ada dagangan' : `Tidak ada dagangan ${STATUS_LABELS[lapakFilter as LapakProduct['status']] || ''}`}</Text></View>}
        />
      ) : activeTab === 'events' ? (
        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <EventModCard item={item} colors={colors}
              onEdit={(id) => router.push(`/event/edit/${id}` as any)}
              onPublish={(id) => updateEvent(id, { status: 'published' })}
              onCancel={(id) => Alert.alert('Batalkan Event', `Batalkan "${item.title}"?`, [
                { text: 'Tidak', style: 'cancel' },
                { text: 'Batalkan', style: 'destructive', onPress: () => updateEvent(id, { status: 'cancelled' }) },
              ])}
              onDelete={(id) => deleteEvent(id)} />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<View style={styles.empty}><Ionicons name="calendar-outline" size={48} color={colors.textMuted} /><Text style={[styles.emptyText, { color: colors.textSecondary }]}>Belum ada event. Tambah event baru!</Text></View>}
        />
      ) : (
        <FlatList
          data={eventRegistrations.filter((r) => r.status !== 'cancelled').sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: reg }) => (
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }, Shadows.sm]}>
              <View style={styles.cardRow}>
                <View style={[styles.avatarFallback, { backgroundColor: reg.status === 'confirmed' ? '#2EC4B6' : colors.primary }]}>
                  <Text style={styles.avatarText}>{reg.userName.charAt(0).toUpperCase()}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.cardName, { color: colors.text }]}>{reg.userName}</Text>
                  <Text style={[styles.cardSub, { color: colors.textSecondary }]}>{reg.userEmail}</Text>
                  <Text style={[styles.cardMeta, { color: colors.textMuted }]}>{reg.userPhone}{reg.korda ? ` · ${reg.korda}` : ''}</Text>
                  {reg.userCity && <Text style={[styles.cardMeta, { color: colors.textMuted }]}>{reg.userCity}</Text>}
                  {reg.notes && <Text style={[styles.cardMeta, { color: colors.textMuted, fontStyle: 'italic' }]}>"{reg.notes}"</Text>}
                </View>
              </View>
              <View style={styles.actionRow}>
                <View style={[styles.badge, { backgroundColor: (reg.status === 'confirmed' ? '#2EC4B6' : '#FFB347') + '20' }]}>
                  <View style={[styles.dot, { backgroundColor: reg.status === 'confirmed' ? '#2EC4B6' : '#FFB347' }]} />
                  <Text style={[styles.badgeText, { color: reg.status === 'confirmed' ? '#2EC4B6' : '#FFB347' }]}>{reg.status === 'confirmed' ? 'Dikonfirmasi' : 'Terdaftar'}</Text>
                </View>
                <Text style={[styles.dateText, { color: colors.textMuted }]}>Event #{reg.eventId} · {new Date(reg.createdAt).toLocaleDateString('id-ID')}</Text>
                <View style={styles.btnRow}>
                  {reg.status !== 'confirmed' && (
                    <Pressable onPress={() => confirmRegistration(reg.id)} style={[styles.iconBtn, { backgroundColor: '#2EC4B620' }]}>
                      <Ionicons name="checkmark" size={16} color="#2EC4B6" />
                    </Pressable>
                  )}
                  <Pressable onPress={() => Alert.alert('Batalkan', `Batalkan pendaftaran ${reg.userName}?`, [
                    { text: 'Tidak', style: 'cancel' },
                    { text: 'Batalkan', style: 'destructive', onPress: () => cancelRegistration(reg.id) },
                  ])} style={[styles.iconBtn, { backgroundColor: '#FF6B6B20' }]}>
                    <Ionicons name="close" size={16} color="#FF6B6B" />
                  </Pressable>
                </View>
              </View>
            </View>
          )}
          ListEmptyComponent={<View style={styles.empty}><Ionicons name="clipboard-outline" size={48} color={colors.textMuted} /><Text style={[styles.emptyText, { color: colors.textSecondary }]}>Belum ada pendaftaran event</Text></View>}
        />
      )}
    </View>
  );
}

export default memo(AdminScreen);

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 56, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.lg },
  headerTitle: { color: '#FFF', fontSize: FontSize.xl, fontWeight: '800' },
  headerSub: { color: 'rgba(255,255,255,0.8)', fontSize: FontSize.sm, marginTop: 2 },
  statsCard: { marginHorizontal: Spacing.lg, marginTop: -Spacing.md, borderRadius: BorderRadius.lg, overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth },
  shimmer: { height: 3 },
  statsGrid: { flexDirection: 'row', padding: Spacing.md },
  statItem: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: FontSize.xxl, fontWeight: '800' },
  statLabel: { fontSize: FontSize.xs, marginTop: 2 },
  tabRow: { flexDirection: 'row', marginHorizontal: Spacing.lg, marginTop: Spacing.md },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.sm, gap: 6 },
  tabLabel: { fontSize: FontSize.md, fontWeight: '700' },
  tabCount: { paddingHorizontal: 6, paddingVertical: 1, borderRadius: 10, minWidth: 22, alignItems: 'center' },
  tabCountText: { fontSize: FontSize.xs, fontWeight: '700' },
  searchBox: { flexDirection: 'row', alignItems: 'center', borderRadius: BorderRadius.md, paddingHorizontal: Spacing.md, height: 44, borderWidth: 1, gap: 8 },
  searchInput: { flex: 1, fontSize: FontSize.md, height: 44 },
  filterRow: { paddingHorizontal: Spacing.lg, gap: Spacing.sm, paddingBottom: Spacing.xs },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: BorderRadius.full, borderWidth: 1 },
  filterText: { fontSize: FontSize.sm, fontWeight: '600' },
  list: { padding: Spacing.lg, gap: Spacing.sm, paddingBottom: 100 },
  card: { borderRadius: BorderRadius.lg, padding: Spacing.md, borderWidth: StyleSheet.hairlineWidth },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  avatarFallback: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#FFF', fontWeight: '800', fontSize: FontSize.lg },
  productThumb: { width: 56, height: 56, borderRadius: 12 },
  productThumbPlaceholder: { width: 56, height: 56, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cardName: { fontSize: FontSize.md, fontWeight: '700', flexShrink: 1 },
  cardSub: { fontSize: FontSize.sm, marginTop: 1 },
  cardMeta: { fontSize: FontSize.xs, marginTop: 1 },
  youBadge: { paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4 },
  youText: { color: '#FFF', fontSize: 9, fontWeight: '700' },
  specsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: Spacing.sm },
  specChip: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: BorderRadius.sm },
  specText: { fontSize: FontSize.xs },
  actionRow: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.sm, gap: Spacing.sm, flexWrap: 'wrap' },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 3, borderRadius: BorderRadius.sm, gap: 4 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  badgeText: { fontSize: FontSize.xs, fontWeight: '700' },
  dateText: { fontSize: FontSize.xs },
  btnRow: { flexDirection: 'row', gap: 6, marginLeft: 'auto' },
  iconBtn: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  denied: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl, gap: Spacing.md },
  deniedTitle: { fontSize: FontSize.xxl, fontWeight: '800' },
  deniedSub: { fontSize: FontSize.md, textAlign: 'center' },
  backBtn: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: BorderRadius.lg, borderWidth: 1.5, marginTop: Spacing.md },
  backBtnText: { fontSize: FontSize.md, fontWeight: '700' },
  empty: { alignItems: 'center', paddingVertical: Spacing.xxl, gap: Spacing.md },
  emptyText: { fontSize: FontSize.md, textAlign: 'center' },
  eventIcon: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  progressBg: { flex: 1, height: 6, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: 6, borderRadius: 3 },
  addEventBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: BorderRadius.md, gap: 6 },
  addEventText: { color: '#FFF', fontSize: FontSize.md, fontWeight: '700' },
});
