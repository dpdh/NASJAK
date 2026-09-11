import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function AnasAvatar({ size = 44 }: { size?: number }) {
  const eyeSize = Math.max(3, size * 0.1);
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
      <View style={[styles.cap, { width: size * 0.68, height: size * 0.2, borderRadius: size * 0.1, top: -size * 0.04 }]} />
      <View style={styles.face}>
        <View style={styles.eyes}>
          <View style={[styles.eye, { width: eyeSize, height: eyeSize }]} />
          <View style={[styles.eye, { width: eyeSize, height: eyeSize }]} />
        </View>
        <Text style={[styles.smile, { fontSize: size * 0.25 }]}>⌣</Text>
      </View>
      <Text style={[styles.initial, { fontSize: size * 0.22 }]}>A</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: { backgroundColor: '#FFD166', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#FFF' },
  cap: { position: 'absolute', backgroundColor: '#0077B6' },
  face: { width: '62%', height: '46%', borderRadius: 20, backgroundColor: '#FFF1D6', alignItems: 'center', justifyContent: 'center' },
  eyes: { flexDirection: 'row', gap: 8 },
  eye: { borderRadius: 9, backgroundColor: '#16324F' },
  smile: { color: '#16324F', lineHeight: 12, marginTop: -2 },
  initial: { position: 'absolute', bottom: 2, color: '#0077B6', fontWeight: '900' },
});