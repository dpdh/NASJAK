import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  ViewToken,
} from 'react-native';
import { ShimmerGold } from '../components/ui/ShimmerGold';
import { ONBOARDING_SLIDES } from '../constants/data';
import { BorderRadius, Colors, FontSize, Spacing } from '../constants/theme';
import { useAppStore } from '../store/appStore';

const LOGO_SPLASH = require('../assets/images/logo-splash.png');

const ICON_MAP: Record<string, React.ComponentProps<typeof Ionicons>['name']> = {
  heart: 'heart',
  book: 'book',
  people: 'people',
  'shield-checkmark': 'shield-checkmark',
};

// Slide-specific gradient themes
const SLIDE_THEMES: { bg: [string, string, string]; orbs: string[]; accent: string }[] = [
  { bg: ['#0A1628', '#0D2137', '#112240'], orbs: ['#00B4D8', '#0077B6', '#D4A853'], accent: '#00B4D8' },
  { bg: ['#0A1628', '#1A0A2E', '#16213E'], orbs: ['#A855F7', '#6366F1', '#F5D98C'], accent: '#A855F7' },
  { bg: ['#0A1628', '#0A2E1A', '#112240'], orbs: ['#10B981', '#06D6A0', '#D4A853'], accent: '#10B981' },
  { bg: ['#0A1628', '#2E1A0A', '#1E1B4B'], orbs: ['#F59E0B', '#D4A853', '#00B4D8'], accent: '#F59E0B' },
];

// Floating orb component
const FloatingOrb = memo(({ size, color, startX, startY, delay, duration }: {
  size: number; color: string; startX: number; startY: number; delay: number; duration: number;
}) => {
  const animY = useRef(new Animated.Value(0)).current;
  const animX = useRef(new Animated.Value(0)).current;
  const animOpacity = useRef(new Animated.Value(0)).current;
  const animScale = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const yLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(animY, { toValue: -40 - Math.random() * 30, duration: duration * 0.5, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(animY, { toValue: 20 + Math.random() * 20, duration: duration * 0.5, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );
    const xLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(animX, { toValue: 15 + Math.random() * 15, duration: duration * 0.7, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(animX, { toValue: -15 - Math.random() * 15, duration: duration * 0.7, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );
    const fadeIn = Animated.timing(animOpacity, { toValue: 0.35 + Math.random() * 0.25, duration: 1200, delay, useNativeDriver: true });
    const scaleIn = Animated.timing(animScale, { toValue: 0.8 + Math.random() * 0.4, duration: 1500, delay, easing: Easing.out(Easing.back(1.5)), useNativeDriver: true });

    fadeIn.start();
    scaleIn.start();
    yLoop.start();
    xLoop.start();

    return () => { yLoop.stop(); xLoop.stop(); fadeIn.stop(); scaleIn.stop(); };
  }, []);

  return (
    <Animated.View
      style={[
        styles.orb,
        {
          width: size, height: size, borderRadius: size / 2,
          backgroundColor: color,
          left: startX, top: startY,
          opacity: animOpacity,
          transform: [{ translateY: animY }, { translateX: animX }, { scale: animScale }],
        },
      ]}
    />
  );
});

// Pulsing ring component
const PulsingRing = memo(({ size, color, x, y, delay }: {
  size: number; color: string; x: number; y: number; delay: number;
}) => {
  const animScale = useRef(new Animated.Value(0.5)).current;
  const animOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(animScale, { toValue: 1.5, duration: 3000, easing: Easing.out(Easing.ease), useNativeDriver: true }),
          Animated.sequence([
            Animated.timing(animOpacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
            Animated.timing(animOpacity, { toValue: 0, duration: 2200, useNativeDriver: true }),
          ]),
        ]),
        Animated.timing(animScale, { toValue: 0.5, duration: 0, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.View
      style={[
        styles.ring,
        {
          width: size, height: size, borderRadius: size / 2,
          borderColor: color, left: x, top: y,
          opacity: animOpacity,
          transform: [{ scale: animScale }],
        },
      ]}
    />
  );
});

// Scanning line effect
const ScanLine = memo(({ color, height: containerHeight }: { color: string; height: number }) => {
  const animY = useRef(new Animated.Value(-10)).current;
  const animOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(animY, { toValue: containerHeight, duration: 4000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.sequence([
            Animated.timing(animOpacity, { toValue: 0.15, duration: 500, useNativeDriver: true }),
            Animated.timing(animOpacity, { toValue: 0.15, duration: 3000, useNativeDriver: true }),
            Animated.timing(animOpacity, { toValue: 0, duration: 500, useNativeDriver: true }),
          ]),
        ]),
        Animated.timing(animY, { toValue: -10, duration: 0, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [containerHeight]);

  return (
    <Animated.View style={[styles.scanLine, { opacity: animOpacity, transform: [{ translateY: animY }] }]}>
      <LinearGradient colors={['transparent', color, 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.scanLineGradient} />
    </Animated.View>
  );
});

// Grid overlay
const GridOverlay = memo(({ color }: { color: string }) => {
  const animOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animOpacity, { toValue: 1, duration: 2000, useNativeDriver: true }).start();
  }, []);

  const gridLines = [];
  for (let i = 0; i < 8; i++) {
    gridLines.push(
      <View key={`h-${i}`} style={[styles.gridLineH, { top: `${(i + 1) * 12}%`, backgroundColor: color }]} />,
    );
    gridLines.push(
      <View key={`v-${i}`} style={[styles.gridLineV, { left: `${(i + 1) * 12}%`, backgroundColor: color }]} />,
    );
  }

  return <Animated.View style={[StyleSheet.absoluteFill, { opacity: animOpacity }]}>{gridLines}</Animated.View>;
});

// Animated slide background combining all effects
const SlideBackground = memo(({ slideIndex, width, height }: { slideIndex: number; width: number; height: number }) => {
  const themeIdx = slideIndex % SLIDE_THEMES.length;
  const theme = SLIDE_THEMES[themeIdx];

  // Create orb configurations per slide
  const orbs = [
    { size: 120, color: theme.orbs[0], startX: width * 0.1, startY: height * 0.15, delay: 0, duration: 5000 },
    { size: 80, color: theme.orbs[1], startX: width * 0.7, startY: height * 0.1, delay: 300, duration: 6000 },
    { size: 60, color: theme.orbs[2], startX: width * 0.5, startY: height * 0.65, delay: 600, duration: 4500 },
    { size: 100, color: theme.orbs[0], startX: width * 0.8, startY: height * 0.55, delay: 200, duration: 5500 },
    { size: 50, color: theme.orbs[1], startX: width * 0.15, startY: height * 0.7, delay: 500, duration: 7000 },
    { size: 70, color: theme.orbs[2], startX: width * 0.4, startY: height * 0.3, delay: 800, duration: 4000 },
  ];

  return (
    <View style={[StyleSheet.absoluteFill, { width }]}>
      <LinearGradient colors={theme.bg} style={StyleSheet.absoluteFill} />

      {/* Grid */}
      <GridOverlay color={theme.accent + '08'} />

      {/* Floating orbs */}
      {orbs.map((o, i) => (
        <FloatingOrb key={i} {...o} />
      ))}

      {/* Pulsing rings */}
      <PulsingRing size={200} color={theme.orbs[0]} x={width * 0.3} y={height * 0.2} delay={0} />
      <PulsingRing size={160} color={theme.orbs[1]} x={width * 0.6} y={height * 0.6} delay={1500} />

      {/* Scan line */}
      <ScanLine color={theme.accent} height={height} />

      {/* Top vignette */}
      <LinearGradient
        colors={['rgba(0,0,0,0.4)', 'transparent']}
        style={styles.vignetteTop}
      />
      {/* Bottom vignette */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.6)']}
        style={styles.vignetteBottom}
      />
    </View>
  );
});

function OnboardingScreen() {
  const theme = useAppStore((s) => s.theme);
  const isOnboarded = useAppStore((s) => s.isOnboarded);
  const setOnboarded = useAppStore((s) => s.setOnboarded);
  const colors = Colors[theme];
  const { width, height } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // Title fade animation
  const titleOpacity = useRef(new Animated.Value(1)).current;
  const titleTranslateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    titleOpacity.setValue(0);
    titleTranslateY.setValue(20);
    Animated.parallel([
      Animated.timing(titleOpacity, { toValue: 1, duration: 600, delay: 200, useNativeDriver: true }),
      Animated.timing(titleTranslateY, { toValue: 0, duration: 600, delay: 200, easing: Easing.out(Easing.back(1.5)), useNativeDriver: true }),
    ]).start();
  }, [activeIndex]);

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index != null) {
      setActiveIndex(viewableItems[0].index);
    }
  }, []);

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const handleNext = useCallback(() => {
    if (activeIndex < ONBOARDING_SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1 });
    } else if (isOnboarded) {
      router.back();
    } else {
      setOnboarded(true);
      router.replace('/(auth)/login' as any);
    }
  }, [activeIndex, setOnboarded, isOnboarded]);

  const handleSkip = useCallback(() => {
    if (isOnboarded) {
      router.back();
    } else {
      setOnboarded(true);
      router.replace('/(auth)/login' as any);
    }
  }, [setOnboarded, isOnboarded]);

  const activeTheme = SLIDE_THEMES[activeIndex % SLIDE_THEMES.length];

  const renderSlide = useCallback(
    ({ item, index }: { item: (typeof ONBOARDING_SLIDES)[0]; index: number }) => (
      <View style={[styles.slide, { width }]}>
        {/* Animated background per slide */}
        <SlideBackground slideIndex={index} width={width} height={height} />

        {/* Content */}
        <View style={styles.slideContent}>
          {/* Glowing icon */}
          <View style={styles.iconOuter}>
            <View style={[styles.iconGlow, { backgroundColor: SLIDE_THEMES[index % 4].accent + '30', shadowColor: SLIDE_THEMES[index % 4].accent }]}>
              <LinearGradient
                colors={[SLIDE_THEMES[index % 4].accent + '40', SLIDE_THEMES[index % 4].accent + '10']}
                style={styles.iconGlowInner}
              >
                <Ionicons name={ICON_MAP[item.icon] || 'heart'} size={44} color={SLIDE_THEMES[index % 4].accent} />
              </LinearGradient>
            </View>
          </View>

          <Image source={LOGO_SPLASH} style={styles.logo} resizeMode="contain" />

          <Text style={styles.slideTitle}>{item.title}</Text>

          <View style={styles.subtitleRow}>
            <View style={[styles.subtitleLine, { backgroundColor: SLIDE_THEMES[index % 4].accent }]} />
            <Text style={[styles.slideSub, { color: SLIDE_THEMES[index % 4].accent }]}>{item.subtitle}</Text>
            <View style={[styles.subtitleLine, { backgroundColor: SLIDE_THEMES[index % 4].accent }]} />
          </View>

          <Text style={styles.slideDesc}>{item.description}</Text>
        </View>
      </View>
    ),
    [width, height],
  );

  return (
    <View style={styles.container}>
      {/* Skip button */}
      <Pressable onPress={handleSkip} style={styles.skipBtn}>
        <View style={styles.skipPill}>
          <Text style={styles.skipText}>{isOnboarded ? 'Kembali' : 'Lewati'}</Text>
        </View>
      </Pressable>

      <FlatList
        ref={flatListRef}
        data={ONBOARDING_SLIDES}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        bounces={false}
      />

      {/* Bottom controls overlay */}
      <View style={styles.bottomOverlay}>
        {/* Animated dots */}
        <View style={styles.dotsRow}>
          {ONBOARDING_SLIDES.map((_, i) => (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor: i === activeIndex ? activeTheme.accent : 'rgba(255,255,255,0.25)',
                  width: i === activeIndex ? 28 : 8,
                  shadowColor: i === activeIndex ? activeTheme.accent : 'transparent',
                  shadowOpacity: i === activeIndex ? 0.8 : 0,
                  shadowRadius: 6,
                  shadowOffset: { width: 0, height: 0 },
                  elevation: i === activeIndex ? 8 : 0,
                },
              ]}
            />
          ))}
        </View>

        {/* Next / Get Started button */}
        <Pressable onPress={handleNext} style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}>
          <LinearGradient
            colors={[activeTheme.accent, activeTheme.orbs[1]]}
            style={styles.nextBtn}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.nextText}>
              {activeIndex === ONBOARDING_SLIDES.length - 1 ? (isOnboarded ? 'Kembali ke Login' : 'Mulai Sekarang') : 'Selanjutnya'}
            </Text>
            <Ionicons name={activeIndex === ONBOARDING_SLIDES.length - 1 ? 'checkmark-circle' : 'arrow-forward'} size={20} color="#FFF" />
          </LinearGradient>
        </Pressable>

        <ShimmerGold style={styles.bottomShimmer} />
      </View>
    </View>
  );
}

export default memo(OnboardingScreen);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A1628' },
  skipBtn: { position: 'absolute', top: 56, right: Spacing.lg, zIndex: 10 },
  skipPill: { backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: BorderRadius.full, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  skipText: { fontSize: FontSize.sm, fontWeight: '600', color: 'rgba(255,255,255,0.7)' },

  slide: { flex: 1, overflow: 'hidden' },
  slideContent: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.xl, zIndex: 5 },

  // Glowing icon
  iconOuter: { marginBottom: Spacing.lg },
  iconGlow: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 20, elevation: 15 },
  iconGlowInner: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },

  logo: { width: 100, height: 100, marginBottom: Spacing.md },
  slideTitle: { fontSize: 34, fontWeight: '900', textAlign: 'center', color: '#FFFFFF', letterSpacing: 1 },
  subtitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: Spacing.sm },
  subtitleLine: { width: 24, height: 2, borderRadius: 1 },
  slideSub: { fontSize: FontSize.lg, fontWeight: '700', textAlign: 'center' },
  slideDesc: { fontSize: FontSize.md, textAlign: 'center', lineHeight: 24, marginTop: Spacing.md, color: 'rgba(255,255,255,0.7)', maxWidth: 320 },

  // Bottom controls
  bottomOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingBottom: 20, zIndex: 10 },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: Spacing.lg },
  dot: { height: 8, borderRadius: 4 },
  nextBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: Spacing.xl, paddingVertical: 16, borderRadius: BorderRadius.xl, gap: Spacing.sm },
  nextText: { color: '#FFF', fontSize: FontSize.lg, fontWeight: '700' },
  bottomShimmer: { height: 3, marginTop: Spacing.lg },

  // Background effects
  orb: { position: 'absolute' },
  ring: { position: 'absolute', borderWidth: 1.5 },
  scanLine: { position: 'absolute', left: 0, right: 0, height: 2 },
  scanLineGradient: { flex: 1 },
  vignetteTop: { position: 'absolute', top: 0, left: 0, right: 0, height: '20%' },
  vignetteBottom: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%' },

  // Grid
  gridLineH: { position: 'absolute', left: 0, right: 0, height: StyleSheet.hairlineWidth, opacity: 0.5 },
  gridLineV: { position: 'absolute', top: 0, bottom: 0, width: StyleSheet.hairlineWidth, opacity: 0.5 },
});
