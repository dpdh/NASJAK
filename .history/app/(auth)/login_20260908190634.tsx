import React, { memo, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAppStore } from '../../store/appStore';
import { Colors, Spacing, BorderRadius, FontSize, Shadows } from '../../constants/theme';
import { ShimmerGold } from '../../components/ui/ShimmerGold';
import { useGoogleAuth, fetchGoogleUserInfo, isGoogleConfigured } from '../../services/googleAuth';
import { syncGoogleProfile } from '../../services/userProvider';

const LOGO_SPLASH = require('../../assets/images/logo-splash.png');

function LoginScreen() {
  const theme = useAppStore((s) => s.theme);
  const login = useAppStore((s) => s.login);
  const loginWithGoogle = useAppStore((s) => s.loginWithGoogle);
  const colors = Colors[theme];

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { request, response, promptAsync, isConfigured } = useGoogleAuth();
  const googleConfigured = isGoogleConfigured();

  // Handle Google Auth response
  useEffect(() => {
    if (response?.type === 'success' && response.authentication?.accessToken) {
      handleGoogleSuccess(response.authentication.accessToken);
    } else if (response?.type === 'error') {
      setGoogleLoading(false);
      Alert.alert('Error', 'Login Google gagal. Silakan coba lagi.');
    } else if (response?.type === 'dismiss') {
      setGoogleLoading(false);
    }
  }, [response]);

  const handleGoogleSuccess = useCallback(async (accessToken: string) => {
    setGoogleLoading(true);
    try {
      const userInfo = await fetchGoogleUserInfo(accessToken);
      if (!userInfo || !userInfo.email) {
        Alert.alert('Error', 'Tidak dapat mengambil informasi akun Google');
        setGoogleLoading(false);
        return;
      }

      const providerProfile = await syncGoogleProfile(accessToken, { id: userInfo.id, email: userInfo.email, name: userInfo.name || userInfo.email.split('@')[0], avatar: userInfo.picture });
      loginWithGoogle({
        googleId: userInfo.id,
        email: userInfo.email,
        name: userInfo.name || userInfo.email.split('@')[0],
        avatar: userInfo.picture,
        membershipType: providerProfile?.membershipType,
        membershipFeatures: providerProfile?.membershipFeatures,
      });

      const user = useAppStore.getState().user;
      if (user?.role === 'super_admin' || user?.role === 'admin') {
        Alert.alert('Selamat Datang Admin!', `Login Google sebagai ${user.email}\nRole: ${user.role === 'super_admin' ? 'Super Admin' : 'Admin'} NASUHA`);
      }

      router.replace('/(tabs)/' as any);
    } catch {
      Alert.alert('Error', 'Terjadi kesalahan saat login Google');
    } finally {
      setGoogleLoading(false);
    }
  }, [loginWithGoogle]);

  const handleGoogleLogin = useCallback(async () => {
    if (!googleConfigured || !request) {
      Alert.alert(
        'Google Sign-In Belum Aktif',
        'Untuk mengaktifkan login Google:\n\n' +
        '1. Buka Google Cloud Console\n' +
        '2. Buat OAuth Client ID\n' +
        '3. Isi Client ID di services/googleAuth.ts\n\n' +
        'Lihat panduan lengkap di file services/googleAuth.ts',
        [{ text: 'OK' }]
      );
      return;
    }
    setGoogleLoading(true);
    try {
      await promptAsync();
    } catch {
      setGoogleLoading(false);
      Alert.alert('Error', 'Tidak dapat membuka halaman login Google');
    }
  }, [promptAsync, googleConfigured, request]);

  const handleLogin = useCallback(async () => {
    if (!identifier.trim() || !password) {
      Alert.alert('Error', 'Email/no. HP dan password harus diisi');
      return;
    }

    setLoading(true);
    try {
      const result = await login(identifier, password);
      if (!result.success) {
        Alert.alert('Error', result.error || 'Login gagal');
        return;
      }

      const user = useAppStore.getState().user;
      if (user?.role === 'super_admin' || user?.role === 'admin') {
        Alert.alert('Selamat Datang Admin!', `Login sebagai ${user.email}\nRole: ${user.role === 'super_admin' ? 'Super Admin' : 'Admin'} NASUHA`);
      }
      router.replace('/(tabs)/' as any);
    } catch {
      Alert.alert('Error', 'Terjadi kesalahan saat login. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  }, [identifier, password, login]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={theme === 'dark' ? ['#0A1628', '#112240'] : ['#F0FAFF', '#CAF0F8']}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {/* Logo & Branding */}
          <View style={styles.logoSection}>
            <Image source={LOGO_SPLASH} style={styles.logo} resizeMode="contain" />
            <Text style={[styles.appName, { color: colors.primary }]}>NASUHA App</Text>
            <Text style={[styles.tagline, { color: colors.gold }]}>Hijrah Bersama, Tumbuh Bersama</Text>
          </View>

          {/* Login Card */}
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }, Shadows.md]}>
            <ShimmerGold style={styles.shimmerTop} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>Masuk</Text>
            <Text style={[styles.cardSub, { color: colors.textSecondary }]}>Assalamu'alaikum, silakan login</Text>

            {/* Google Sign-In Button */}
            <Pressable
              onPress={handleGoogleLogin}
              disabled={googleLoading}
              style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
            >
              <View style={[styles.googleBtn, { backgroundColor: colors.surface, borderColor: colors.border }, googleLoading && { opacity: 0.6 }]}>
                {googleLoading ? (
                  <Text style={[styles.googleBtnText, { color: colors.text }]}>Menghubungkan...</Text>
                ) : (
                  <>
                    <View style={styles.googleIconWrap}>
                      <Text style={styles.googleG}>G</Text>
                    </View>
                    <Text style={[styles.googleBtnText, { color: colors.text }]}>Masuk dengan Google</Text>
                  </>
                )}
              </View>
            </Pressable>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              <Text style={[styles.dividerText, { color: colors.textMuted }]}>atau</Text>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            </View>

            {/* Email or phone */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Email atau No. HP</Text>
              <View style={[styles.inputBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Ionicons name="person-circle-outline" size={20} color={colors.textMuted} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="email@example.com atau 08xxxxxxxxxx"
                  placeholderTextColor={colors.textMuted}
                  value={identifier}
                  onChangeText={setIdentifier}
                  keyboardType="default"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Password</Text>
              <View style={[styles.inputBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Masukkan password"
                  placeholderTextColor={colors.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={8}>
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textMuted} />
                </Pressable>
              </View>
            </View>

            {/* Forgot Password */}
            <Pressable style={styles.forgotRow}>
              <Text style={[styles.forgotText, { color: colors.primary }]}>Lupa password?</Text>
            </Pressable>

            {/* Login Button */}
            <Pressable onPress={handleLogin} disabled={loading} style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}>
              <LinearGradient
                colors={[colors.primary, '#0077B6']}
                style={[styles.loginBtn, loading && { opacity: 0.6 }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {loading ? (
                  <Text style={styles.loginText}>Memuat...</Text>
                ) : (
                  <>
                    <Ionicons name="log-in-outline" size={20} color="#FFF" />
                    <Text style={styles.loginText}>Masuk</Text>
                  </>
                )}
              </LinearGradient>
            </Pressable>
          </View>

          {/* Register Link */}
          <View style={styles.registerRow}>
            <Text style={[styles.registerLabel, { color: colors.textSecondary }]}>Belum punya akun? </Text>
            <Pressable onPress={() => router.push('/(auth)/register' as any)}>
              <Text style={[styles.registerLink, { color: colors.primary }]}>Daftar Sekarang</Text>
            </Pressable>
          </View>

          {/* Guest */}
          <Pressable
            onPress={() => router.replace('/(tabs)/' as any)}
            style={styles.guestRow}
          >
            <Text style={[styles.guestText, { color: colors.textMuted }]}>Masuk sebagai Tamu</Text>
          </Pressable>

          {/* Lihat Onboarding */}
          <Pressable
            onPress={() => router.push('/about' as any)}
            style={styles.onboardingRow}
          >
            <Ionicons name="information-circle-outline" size={16} color={colors.primary} />
            <Text style={[styles.onboardingText, { color: colors.primary }]}>Lihat Tentang NASUHA App</Text>
          </Pressable>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

export default memo(LoginScreen);

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: Spacing.lg },
  logoSection: { alignItems: 'center', marginBottom: Spacing.xl },
  logo: { width: 88, height: 88, marginBottom: Spacing.md },
  appName: { fontSize: FontSize.xxxl, fontWeight: '900', letterSpacing: 2 },
  tagline: { fontSize: FontSize.sm, fontWeight: '600', marginTop: 4 },
  card: { borderRadius: BorderRadius.xl, overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth },
  shimmerTop: { height: 3 },
  cardTitle: { fontSize: FontSize.xxl, fontWeight: '800', paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg },
  cardSub: { fontSize: FontSize.sm, paddingHorizontal: Spacing.lg, marginTop: 4, marginBottom: Spacing.lg },

  // Google Button
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    paddingVertical: 12,
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
    gap: Spacing.sm,
  },
  googleIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  googleG: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4285F4',
  },
  googleBtnText: { fontSize: FontSize.md, fontWeight: '600' },

  // Divider
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  dividerLine: { flex: 1, height: StyleSheet.hairlineWidth },
  dividerText: { fontSize: FontSize.sm },

  inputGroup: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.md },
  label: { fontSize: FontSize.sm, fontWeight: '600', marginBottom: 6 },
  inputBox: { flexDirection: 'row', alignItems: 'center', borderRadius: BorderRadius.md, paddingHorizontal: Spacing.md, height: 48, borderWidth: 1, gap: 10 },
  input: { flex: 1, fontSize: FontSize.md, height: 48 },
  forgotRow: { alignItems: 'flex-end', paddingHorizontal: Spacing.lg, marginBottom: Spacing.lg },
  forgotText: { fontSize: FontSize.sm, fontWeight: '600' },
  loginBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: Spacing.lg, marginBottom: Spacing.lg, paddingVertical: 14, borderRadius: BorderRadius.xl, gap: Spacing.sm },
  loginText: { color: '#FFF', fontSize: FontSize.lg, fontWeight: '700' },
  registerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.lg },
  registerLabel: { fontSize: FontSize.md },
  registerLink: { fontSize: FontSize.md, fontWeight: '700' },
  guestRow: { alignItems: 'center', marginTop: Spacing.md },
  guestText: { fontSize: FontSize.sm, fontWeight: '600' },
  onboardingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: Spacing.md, paddingBottom: Spacing.lg },
  onboardingText: { fontSize: FontSize.sm, fontWeight: '600' },
});
