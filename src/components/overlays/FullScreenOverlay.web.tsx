import React, { memo, useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Player } from '@lottiefiles/react-lottie-player';
import type { CampaignOverlay } from '@/types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const DEFAULT_DURATION_MS = 4000;

type Props = {
  overlay: CampaignOverlay;
};

function FullScreenOverlayWebComponent({ overlay }: Props) {
  const [visible, setVisible] = useState(true);
  const duration = overlay.duration_ms ?? DEFAULT_DURATION_MS;

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      <Player
        autoplay
        loop={false}
        src={overlay.animation_url}
        style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
        onEvent={(event) => {
          if (event === 'complete') setVisible(false);
        }}
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
});

export const FullScreenOverlay = memo(FullScreenOverlayWebComponent);
