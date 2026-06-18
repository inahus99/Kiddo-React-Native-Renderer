import React, { memo, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import type { CampaignOverlay } from '@/types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const DEFAULT_DURATION_MS = 4000;

type Props = {
  overlay: CampaignOverlay;
};

function FullScreenOverlayComponent({ overlay }: Props) {
  const animationRef = useRef<LottieView>(null);
  const [visible, setVisible] = useState(true);
  const duration = overlay.duration_ms ?? DEFAULT_DURATION_MS;

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    /*
     * pointerEvents="none" is the critical constraint: the overlay floats
     * above all content but passes all touch events through to the underlying
     * interactive layout. Users can tap product cards, scroll the feed, and
     * interact normally while the animation plays.
     */
    <View style={styles.container} pointerEvents="none">
      <LottieView
        ref={animationRef}
        source={{ uri: overlay.animation_url }}
        autoPlay
        loop={false}
        style={styles.lottie}
        resizeMode="cover"
        onAnimationFinish={() => setVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    zIndex: 9999,
  },
  lottie: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
});

export const FullScreenOverlay = memo(FullScreenOverlayComponent);
