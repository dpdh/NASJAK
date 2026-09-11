import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { useAppStore } from '../../store/appStore';
import { Colors, BorderRadius, Shadows } from '../../constants/theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
}

export default function GlassCard({ children, style, intensity = 20 }: GlassCardProps) {
  const theme = useAppStore((s) => s.theme);
  const colors = Colors[theme];

  return (
    <View style={[styles.wrapper, { borderColor: colors.border }, Shadows.md, style]}>
      <BlurView intensity={intensity} tint={theme === 'dark' ? 'dark' : 'light'} style={styles.blur}>
        <View style={[styles.inner, { backgroundColor: theme === 'dark' ? 'rgba(17,34,64,0.7)' : 'rgba(255,255,255,0.7)' }]}>
          {children}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
  },
  blur: {
    overflow: 'hidden',
    borderRadius: BorderRadius.lg,
  },
  inner: {
    padding: 16,
    borderRadius: BorderRadius.lg,
  },
});
