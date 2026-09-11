import React, { memo, useCallback, useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, Pressable, TextInput, Linking, Alert, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { useAppStore } from '../../store/appStore';
import { Colors, Spacing, BorderRadius, FontSize, Shadows } from '../../constants/theme';
import { LAPAK_CATEGORIES } from '../../constants/data';

import type { LapakProduct } from '../../types';

const ProductCard = memo(({ item, colors }: { item: LapakProduct; colors: typeof Colors.light }) => {
  const handleWhatsApp = useCallback(async () => {
    const msg = encodeURIComponent(`Assalamu'alaikum, saya tertarik dengan produk "${item.name}" di NASJAK App. Apakah masih tersedia?`);
    try {
      const deepLink = `whatsapp://send?phone=${item.sellerWhatsapp}&text=${msg}`;
      const supported = await Linking.canOpenURL(deepLink);
      await Linking.openURL(supported ? deepLink : `https://wa.me/${item.sellerWhatsapp}?text=${msg}`);
    } catch { Alert.alert('Error', 'Tidak dapat membuka WhatsApp'); }
  }, [item]);

  return (
    <Pressable
      style={[styles.productCard, { backgroundColor: colors.card, borderColor: colors.border }, Shadows.sm]}
      onPress={() => router.push(`/lapak/${item.id}` as any)}
    >
      {/* Photo */}
      {item.photos.length > 0 ? (
        <Image source={{ uri: item.photos[0] }} style={styles.productImage} />
      ) : (
        <LinearGradient colors={['#D4A853', '#F5D98C']} style={styles.productImagePlaceholder}>
          <Ionicons name="image-outline" size={32} color="#FFF" />
        </LinearGradient>
      )}

      <View style={styles.productBody}>
        {/* Tags */}
        <View style={styles.tagRow}>
          {item.tags.slice(0, 2).map((tag) => (
            <View key={tag} style={[styles.tag, { backgroundColor: colors.primary + '15' }]}>
              <Text style={[styles.tagText, { color: colors.primary }]}>{tag}</Text>
            </View>
          ))}
          {item.specs.condition && (
            <View style={[styles.tag, { backgroundColor: colors.gold + '15' }]}>
              <Text style={[styles.tagText, { color: colors.gold }]}>{item.specs.condition}</Text>
            </View>
          )}
        </View>

        <Text style={[styles.productName, { color: colors.text }]} numberOfLines={2}>{item.name}</Text>
        <Text style={[styles.productPrice, { color: colors.gold }]}>Rp {item.price.toLocaleString('id-ID')}</Text>

        {/* Specs mini */}
        <View style={styles.specsMini}>
          {item.specs.weight && <Text style={[styles.specMiniText, { color: colors.textMuted }]}>{item.specs.weight}</Text>}
          {item.specs.stock !== undefined && <Text style={[styles.specMiniText, { color: colors.textMuted }]}>Stok: {item.specs.stock}</Text>}
          {item.specs.shippingFrom && <Text style={[styles.specMiniText, { color: colors.textMuted }]}>{item.specs.shippingFrom}</Text>}
        </View>

        {/* Seller */}
        <View style={[styles.sellerRow, { borderTopColor: colors.border }]}>
          <View style={[styles.sellerDot, { backgroundColor: colors.primary }]}>
            <Text style={styles.sellerInitial}>{item.sellerName.charAt(0)}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.sellerName, { color: colors.text }]}>{item.sellerName}</Text>
            <Text style={[styles.sellerCity, { color: colors.textMuted }]}>{item.sellerCity}</Text>
          </View>
          <Pressable style={[styles.waBtn, { backgroundColor: '#25D366' }]} onPress={handleWhatsApp}>
            <Ionicons name="logo-whatsapp" size={16} color="#FFF" />
            <Text style={styles.waBtnText}>Chat</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
});

function LapakScreen() {
  const { mine } = useLocalSearchParams<{ mine?: string }>();
  const theme = useAppStore((s) => s.theme);
  const user = useAppStore((s) => s.user);
  const products = useAppStore((s) => s.products);
  const colors = Colors[theme];
  const [activeCategory, setActiveCategory] = useState('semua');
  const [searchQuery, setSearchQuery] = useState('');

  const approvedProducts = useMemo(() => products.filter((p) => p.status === 'approved'), [products]);
  const myProducts = useMemo(() => user ? products.filter((p) => p.sellerId === user.id) : [], [products, user]);

  const filteredProducts = useMemo(() => {
    let list = mine === '1' ? myProducts : approvedProducts;
    if (activeCategory !== 'semua') list = list.filter((p) => p.category === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.sellerName.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    return list;
  }, [approvedProducts, myProducts, activeCategory, searchQuery, mine]);

  const renderProduct = useCallback(
    ({ item }: { item: LapakProduct }) => <ProductCard item={item} colors={colors} />,
    [colors],
  );

  const headerComponent = useMemo(() => (
    <>
      {/* Hero */}
      <LinearGradient colors={['#D4A853', '#B8860B']} style={styles.hero}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </Pressable>
        <Ionicons name="storefront" size={48} color="#FFF" />
        <Text style={styles.heroTitle}>Lapak Sahabat NASUHA</Text>
        <Text style={styles.heroSub}>Belanja dari sesama sahabat, berkah bersama</Text>
        <View style={styles.heroStats}>
          <View style={styles.heroStat}><Text style={styles.heroStatNum}>{approvedProducts.length}</Text><Text style={styles.heroStatLabel}>Produk</Text></View>
          <View style={styles.heroStatDivider} />
          <View style={styles.heroStat}><Text style={styles.heroStatNum}>{new Set(approvedProducts.map((p) => p.sellerId)).size}</Text><Text style={styles.heroStatLabel}>Penjual</Text></View>
          <View style={styles.heroStatDivider} />
          <View style={styles.heroStat}><Text style={styles.heroStatNum}>100%</Text><Text style={styles.heroStatLabel}>Halal</Text></View>
        </View>
      </LinearGradient>

      {/* My Products Banner */}
      {myProducts.length > 0 && (
        <Pressable onPress={() => router.push('/lapak/?mine=1' as any)} style={[styles.myBanner, { backgroundColor: colors.primary + '12', borderColor: colors.primary + '30' }]}>
          <Ionicons name="bag-check" size={20} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.myBannerTitle, { color: colors.text }]}>Dagangan Saya ({myProducts.length})</Text>
            <Text style={[styles.myBannerSub, { color: colors.textSecondary }]}>
              {myProducts.filter((p) => p.status === 'pending').length} pending · {myProducts.filter((p) => p.status === 'approved').length} aktif
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.primary} />
        </Pressable>
      )}

      {/* Search */}
      <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Ionicons name="search-outline" size={20} color={colors.textMuted} />
        <TextInput
          placeholder="Cari produk atau penjual..."
          placeholderTextColor={colors.textMuted}
          style={[styles.searchInput, { color: colors.text }]}
          value={searchQuery} onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && <Pressable onPress={() => setSearchQuery('')}><Ionicons name="close-circle" size={18} color={colors.textMuted} /></Pressable>}
      </View>

      {/* Categories */}
      <FlatList horizontal data={LAPAK_CATEGORIES} keyExtractor={(item) => item.id} showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryList}
        renderItem={({ item }) => (
          <Pressable onPress={() => setActiveCategory(item.id)}
            style={[styles.categoryChip, { backgroundColor: activeCategory === item.id ? colors.gold : colors.card, borderColor: activeCategory === item.id ? colors.gold : colors.border }]}>
            <Ionicons name={item.icon as any} size={14} color={activeCategory === item.id ? '#FFF' : colors.textSecondary} />
            <Text style={[styles.categoryLabel, { color: activeCategory === item.id ? '#FFF' : colors.textSecondary }]}>{item.label}</Text>
          </Pressable>
        )}
      />
      <Text style={[styles.resultCount, { color: colors.textSecondary }]}>{filteredProducts.length} produk ditemukan</Text>
    </>
  ), [colors, activeCategory, searchQuery, approvedProducts, myProducts, filteredProducts.length]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
        ListHeaderComponent={headerComponent}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="bag-outline" size={48} color={colors.textMuted} />
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>Belum ada produk</Text>
            <Text style={[styles.emptyHint, { color: colors.textSecondary }]}>Jadilah yang pertama jual dagangan!</Text>
          </View>
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      {/* FAB - Jual Dagangan */}
      <Pressable onPress={() => router.push('/lapak/add' as any)} style={({ pressed }) => [styles.fab, { opacity: pressed ? 0.9 : 1 }]}>
        <LinearGradient colors={['#D4A853', '#B8860B']} style={styles.fabGradient}>
          <Ionicons name="add" size={24} color="#FFF" />
          <Text style={styles.fabText}>Jual</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

export default memo(LapakScreen);

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: { paddingTop: 56, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl, alignItems: 'center' },
  backBtn: { alignSelf: 'flex-start', marginBottom: Spacing.md },
  heroTitle: { color: '#FFF', fontSize: FontSize.xxl, fontWeight: '900', marginTop: Spacing.md, textAlign: 'center' },
  heroSub: { color: 'rgba(255,255,255,0.85)', fontSize: FontSize.sm, marginTop: 4 },
  heroStats: { flexDirection: 'row', marginTop: Spacing.lg, gap: Spacing.lg },
  heroStat: { alignItems: 'center' },
  heroStatNum: { color: '#FFF', fontSize: FontSize.xl, fontWeight: '900' },
  heroStatLabel: { color: 'rgba(255,255,255,0.75)', fontSize: FontSize.xs, marginTop: 2 },
  heroStatDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.3)' },
  myBanner: { flexDirection: 'row', alignItems: 'center', marginHorizontal: Spacing.lg, marginTop: Spacing.md, padding: Spacing.md, borderRadius: BorderRadius.lg, borderWidth: 1, gap: Spacing.sm },
  myBannerTitle: { fontSize: FontSize.md, fontWeight: '700' },
  myBannerSub: { fontSize: FontSize.xs, marginTop: 1 },
  searchBox: { flexDirection: 'row', alignItems: 'center', marginHorizontal: Spacing.lg, marginTop: Spacing.md, paddingHorizontal: Spacing.md, height: 48, borderRadius: BorderRadius.lg, borderWidth: 1, gap: Spacing.sm },
  searchInput: { flex: 1, fontSize: FontSize.md, height: 48 },
  categoryList: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, gap: Spacing.sm },
  categoryChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: BorderRadius.full, borderWidth: 1 },
  categoryLabel: { fontSize: FontSize.sm, fontWeight: '600' },
  resultCount: { fontSize: FontSize.sm, marginHorizontal: Spacing.lg, marginBottom: Spacing.sm },
  list: { paddingBottom: 100 },
  productCard: { marginHorizontal: Spacing.lg, marginBottom: Spacing.md, borderRadius: BorderRadius.lg, borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden' },
  productImage: { width: '100%', height: 200 },
  productImagePlaceholder: { width: '100%', height: 160, alignItems: 'center', justifyContent: 'center' },
  productBody: { padding: Spacing.md },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: Spacing.xs },
  tag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: BorderRadius.sm },
  tagText: { fontSize: FontSize.xs, fontWeight: '700' },
  productName: { fontSize: FontSize.lg, fontWeight: '700' },
  productPrice: { fontSize: FontSize.xl, fontWeight: '900', marginTop: 4 },
  specsMini: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: Spacing.xs },
  specMiniText: { fontSize: FontSize.xs },
  sellerRow: { flexDirection: 'row', alignItems: 'center', paddingTop: Spacing.sm, marginTop: Spacing.sm, borderTopWidth: StyleSheet.hairlineWidth, gap: Spacing.sm },
  sellerDot: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  sellerInitial: { color: '#FFF', fontWeight: '800', fontSize: FontSize.sm },
  sellerName: { fontSize: FontSize.sm, fontWeight: '700' },
  sellerCity: { fontSize: FontSize.xs },
  waBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 14, paddingVertical: 8, borderRadius: BorderRadius.full },
  waBtnText: { color: '#FFF', fontSize: FontSize.xs, fontWeight: '700' },
  empty: { alignItems: 'center', paddingTop: Spacing.xxl, gap: Spacing.sm },
  emptyText: { fontSize: FontSize.lg, fontWeight: '700' },
  emptyHint: { fontSize: FontSize.sm },
  fab: { position: 'absolute', bottom: 24, right: Spacing.lg },
  fabGradient: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 20, paddingVertical: 14, borderRadius: BorderRadius.full },
  fabText: { color: '#FFF', fontSize: FontSize.md, fontWeight: '800' },
});
