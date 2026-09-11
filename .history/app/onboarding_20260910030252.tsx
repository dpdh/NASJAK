import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
    Animated,
    Easing,
    FlatList,
    Image,
    Platform,
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
const useNativeDriver = Platform.OS !== 'web';

const ICON_MAP: Record<string, React.ComponentProps<typeof Ionicons>['name']> = {
  heart: 'heart',
  book: 'book',
  people: 'people',
  'shield-checkmark': 'shield-checkmark',
};

// Slide-specific gradient themes
const SLIDE_THEMES: { bg: [string, string, string]; orbs: string[]; accent: string }[] = [
  { bg: ['#020C14', '#071C2A', '#0F2B3D'], orbs: ['#9FD8FF', '#D4EEFF', '#E7D2A2'], accent: '#9FD8FF' },
  { bg: ['#020D16', '#0A1F2C', '#15384A'], orbs: ['#AFD9FF', '#E3F4FF', '#EAD3A2'], accent: '#AFD9FF' },
  { bg: ['#020E18', '#0A2431', '#123C4A'], orbs: ['#ACF0E1', '#D9F7EE', '#F1D7A0'], accent: '#ACF0E1' },
  { bg: ['#030D19', '#0A1E2E', '#163A55'], orbs: ['#D9F0FF', '#EFF8FF', '#F7D7A4'], accent: '#F7D7A4' },
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
        Animated.timing(animY, { toValue: -18, duration: duration * 0.5, easing: Easing.inOut(Easing.sin), useNativeDriver }),
        Animated.timing(animY, { toValue: 10, duration: duration * 0.5, easing: Easing.inOut(Easing.sin), useNativeDriver }),
      ]),
    );
    const xLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(animX, { toValue: 8, duration: duration * 0.7, easing: Easing.inOut(Easing.sin), useNativeDriver }),
        Animated.timing(animX, { toValue: -8, duration: duration * 0.7, easing: Easing.inOut(Easing.sin), useNativeDriver }),
      ]),
    );
    const fadeIn = Animated.timing(animOpacity, { toValue: 0.2, duration: 900, delay, useNativeDriver });
    const scaleIn = Animated.timing(animScale, { toValue: 0.95, duration: 1000, delay, easing: Easing.out(Easing.ease), useNativeDriver });

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
          Animated.timing(animScale, { toValue: 1.5, duration: 3000, easing: Easing.out(Easing.ease), useNativeDriver }),
          Animated.sequence([
            Animated.timing(animOpacity, { toValue: 0.3, duration: 800, useNativeDriver }),
            Animated.timing(animOpacity, { toValue: 0, duration: 2200, useNativeDriver }),
          ]),
        ]),
        Animated.timing(animScale, { toValue: 0.5, duration: 0, useNativeDriver }),
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
          Animated.timing(animY, { toValue: containerHeight, duration: 4000, easing: Easing.inOut(Easing.ease), useNativeDriver }),
          Animated.sequence([
            Animated.timing(animOpacity, { toValue: 0.15, duration: 500, useNativeDriver }),
            Animated.timing(animOpacity, { toValue: 0.15, duration: 3000, useNativeDriver }),
            Animated.timing(animOpacity, { toValue: 0, duration: 500, useNativeDriver }),
          ]),
        ]),
        Animated.timing(animY, { toValue: -10, duration: 0, useNativeDriver }),
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
    Animated.timing(animOpacity, { toValue: 1, duration: 2000, useNativeDriver }).start();
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
    { size: 100, color: theme.orbs[0], startX: width * 0.08, startY: height * 0.14, delay: 0, duration: 7000 },
    { size: 72, color: theme.orbs[1], startX: width * 0.72, startY: height * 0.14, delay: 250, duration: 8000 },
    { size: 88, color: theme.orbs[2], startX: width * 0.72, startY: height * 0.58, delay: 500, duration: 7500 },
    { size: 56, color: theme.orbs[1], startX: width * 0.12, startY: height * 0.68, delay: 700, duration: 9000 },
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
      <PulsingRing size={180} color={theme.orbs[0]} x={width * 0.32} y={height * 0.2} delay={0} />

      {/* Scan line */}
      <ScanLine color={theme.accent} height={height} />

      {/* Top vignette */}
      <LinearGradient
        colors={['rgba(255,255,255,0.22)', 'transparent']}
        style={styles.vignetteTop}
      />
      {/* Bottom vignette */}
      <LinearGradient
        colors={['transparent', 'rgba(92,113,120,0.18)']}
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
  const logoPulse = useRef(new Animated.Value(1)).current;
  const logoGlow = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    titleOpacity.setValue(0);
    titleTranslateY.setValue(20);
    Animated.parallel([
      Animated.timing(titleOpacity, { toValue: 1, duration: 600, delay: 200, useNativeDriver }),
      Animated.timing(titleTranslateY, { toValue: 0, duration: 600, delay: 200, easing: Easing.out(Easing.back(1.5)), useNativeDriver }),
    ]).start();

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(logoPulse, { toValue: 1.12, duration: 1100, easing: Easing.inOut(Easing.ease), useNativeDriver }),
          Animated.timing(logoGlow, { toValue: 1, duration: 1100, easing: Easing.inOut(Easing.ease), useNativeDriver }),
        ]),
        Animated.parallel([
          Animated.timing(logoPulse, { toValue: 0.94, duration: 1100, easing: Easing.inOut(Easing.ease), useNativeDriver }),
          Animated.timing(logoGlow, { toValue: 0.4, duration: 1100, easing: Easing.inOut(Easing.ease), useNativeDriver }),
        ]),
        Animated.parallel([
          Animated.timing(logoPulse, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver }),
          Animated.timing(logoGlow, { toValue: 0.75, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver }),
        ]),
      ]),
    );

    pulseLoop.start();
    return () => pulseLoop.stop();
  }, [activeIndex, logoGlow, logoPulse]);

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index != null) {
      setActiveIndex(viewableItems[0].index);
    }
  }, []);

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const handleNext = useCallback(() => {
    if (activeIndex < ONBOARDING_SLIDES.length - 1) {
      const nextIndex = activeIndex + 1;
      setActiveIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    } else {
      setOnboarded(true);
      router.replace('/(auth)/login' as any);
    }
  }, [activeIndex, isOnboarded, setOnboarded]);

  const handleSkip = useCallback(() => {
    if (isOnboarded) {
      router.back();
    } else {
      setOnboarded(true);
      router.replace('/(auth)/login' as any);
    }
  }, [setOnboarded, isOnboarded]);

  const activeTheme = SLIDE_THEMES[activeIndex % SLIDE_THEMES.length];
  const activeSlide = ONBOARDING_SLIDES[activeIndex];

  const renderSlide = useCallback(
    ({ item, index }: { item: (typeof ONBOARDING_SLIDES)[0]; index: number }) => (
      <View style={[styles.slide, { width }]}>
        {/* Animated background per slide */}
        <SlideBackground slideIndex={index} width={width} height={height} />

        {/* Content */}
        <Animated.View
          style={[
            styles.slideContent,
            { opacity: titleOpacity, transform: [{ translateY: titleTranslateY }] },
          ]}
        >
          {/* Glowing icon */}
          <View style={styles.iconOuter}>
            <View style={[styles.iconGlow, { backgroundColor: SLIDE_THEMES[index % 4].accent + '30' }]}>
              <LinearGradient
                colors={[SLIDE_THEMES[index % 4].accent + '40', SLIDE_THEMES[index % 4].accent + '10']}
                style={styles.iconGlowInner}
              >
                <Ionicons name={ICON_MAP[item.icon] || 'heart'} size={44} color={SLIDE_THEMES[index % 4].accent} />
              </LinearGradient>
            </View>
          </View>

          <View style={styles.logoBlock}>
            <Animated.View
              style={[
                styles.logoHalo,
                { opacity: logoGlow, backgroundColor: activeTheme.accent + '18' },
                { transform: [{ scale: logoPulse }] },
              ]}
            />
            <Animated.View style={[styles.logoFrame, { transform: [{ scale: logoPulse }] }]}>
              <Image source={LOGO_SPLASH} style={styles.logo} resizeMode="contain" />
            </Animated.View>
            <Text style={styles.brandText}>NASUHA</Text>
            <Text style={styles.brandTagline}>Bersahabat di Dunia Bertetangga di Surga</Text>
          </View>

          <Text style={styles.slideTitle}>{item.title}</Text>

          <View style={styles.subtitleRow}>
            <View style={[styles.subtitleLine, { backgroundColor: SLIDE_THEMES[index % 4].accent }]} />
            <Text style={[styles.slideSub, { color: SLIDE_THEMES[index % 4].accent }]}>{item.subtitle}</Text>
            <View style={[styles.subtitleLine, { backgroundColor: SLIDE_THEMES[index % 4].accent }]} />
          </View>

          <Text style={styles.slideDesc}>{item.description}</Text>
        </Animated.View>
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

      {Platform.OS === 'web' ? (
        <View style={styles.webSlide}>
          {renderSlide({ item: activeSlide, index: activeIndex })}
        </View>
      ) : (
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
          getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
          bounces={false}
        />
      )}

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
                  boxShadow: i === activeIndex ? `0px 0px 6px ${activeTheme.accent}` : 'none',
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
  container: { flex: 1, backgroundColor: '#050F17' },
  skipBtn: { position: 'absolute', top: 56, right: Spacing.lg, zIndex: 10 },
  skipPill: { backgroundColor: 'rgba(255,255,255,0.06)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: BorderRadius.full, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  skipText: { fontSize: FontSize.sm, fontWeight: '600', color: '#EAFBFF' },

  slide: { flex: 1, overflow: 'hidden' },
  webSlide: { flex: 1, overflow: 'hidden' },
  slideContent: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.xl, zIndex: 5 },

  // Glowing icon
  iconOuter: { marginBottom: Spacing.lg },
  iconGlow: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center', boxShadow: '0px 0px 10px rgba(157,216,255,0.16)', elevation: 5 },
  iconGlowInner: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.04)' },

  logoBlock: { alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md, width: '100%', overflow: 'visible' },
  logoHalo: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    shadowColor: '#F7D88E',
    shadowOpacity: 0.22,
    shadowRadius: 34,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
    backgroundColor: 'rgba(247, 216, 142, 0.1)',
  },
  logoFrame: {
    width: 250,
    height: 210,
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    overflow: 'visible',
    shadowColor: '#F7D88E',
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  logo: { width: 220, height: 180, resizeMode: 'contain' },
  brandText: {
    marginTop: 8,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 3.2,
    color: '#F9D77A',
    textTransform: 'uppercase',
    textShadowColor: 'rgba(255, 214, 102, 0.75)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 18,
  },
  brandTagline: {
    marginTop: 5,
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.45,
    color: '#F7E1A1',
    textAlign: 'center',
    maxWidth: 300,
    opacity: 0.95,
  },
  slideTitle: { fontSize: 34, fontWeight: '900', textAlign: 'center', color: '#EDF8FF', letterSpacing: 0.5, marginTop: Spacing.sm },
  subtitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: Spacing.sm },
  subtitleLine: { width: 24, height: 2, borderRadius: 1, opacity: 0.8 },
  slideSub: { fontSize: FontSize.lg, fontWeight: '700', textAlign: 'center', color: '#DFF3FF' },
  slideDesc: { fontSize: FontSize.md, textAlign: 'center', lineHeight: 24, marginTop: Spacing.md, color: '#CFE7F5', maxWidth: 320 },

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
