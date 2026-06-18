import React, { memo, useEffect, useRef, Component } from 'react';
import { View, StyleSheet, Animated, Dimensions, Text } from 'react-native';
import type { CampaignOverlay } from '@/types';

const { width: W, height: H } = Dimensions.get('window');
const DEFAULT_DURATION_MS = 3000;

// ─── Confetti particle (pure RN Animated, no native deps) ────────────────────

type ParticleProps = { x: number; color: string; delay: number };

function Particle({ x, color, delay }: ParticleProps) {
  const y = useRef(new Animated.Value(-20)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(y, { toValue: H + 20, duration: 2800, useNativeDriver: true }),
        Animated.timing(rotate, { toValue: 1, duration: 2800, useNativeDriver: true }),
      ]),
    ]).start();
  }, [delay, opacity, y, rotate]);

  const spin = rotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '720deg'] });

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: x,
          backgroundColor: color,
          opacity,
          transform: [{ translateY: y }, { rotate: spin }],
        },
      ]}
    />
  );
}

// ─── Error boundary so a crash here never kills the feed ─────────────────────

type BState = { crashed: boolean };
class OverlayBoundary extends Component<{ children: React.ReactNode }, BState> {
  state: BState = { crashed: false };
  static getDerivedStateFromError(): BState { return { crashed: true }; }
  render() { return this.state.crashed ? null : this.props.children; }
}

// ─── Main overlay ─────────────────────────────────────────────────────────────

const COLORS = ['#FF6B35', '#FFD166', '#06D6A0', '#118AB2', '#EF476F', '#FF9F1C'];
const PARTICLE_COUNT = 28;

function FullScreenOverlayWebInner({ overlay }: { overlay: CampaignOverlay }) {
  const fadeOut = useRef(new Animated.Value(1)).current;
  const duration = overlay.duration_ms ?? DEFAULT_DURATION_MS;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeOut, { toValue: 0, duration: 600, useNativeDriver: true }).start();
    }, duration - 600);
    return () => clearTimeout(timer);
  }, [duration, fadeOut]);

  const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    x: (W / PARTICLE_COUNT) * i + Math.random() * (W / PARTICLE_COUNT),
    color: COLORS[i % COLORS.length],
    delay: Math.random() * 1200,
  }));

  return (
    <Animated.View style={[styles.container, { opacity: fadeOut }]} pointerEvents="none">
      {particles.map((p, i) => (
        <Particle key={i} x={p.x} color={p.color} delay={p.delay} />
      ))}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>🎉 Live Campaign</Text>
      </View>
    </Animated.View>
  );
}

function FullScreenOverlayWebComponent({ overlay }: { overlay: CampaignOverlay }) {
  return (
    <OverlayBoundary>
      <FullScreenOverlayWebInner overlay={overlay} />
    </OverlayBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0, left: 0,
    width: W, height: H,
    zIndex: 9999,
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
    top: -20,
    width: 10,
    height: 10,
    borderRadius: 3,
  },
  badge: {
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
});

export const FullScreenOverlay = memo(FullScreenOverlayWebComponent);
