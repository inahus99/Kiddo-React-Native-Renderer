import React, { memo } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import type { BannerHeroBlock } from '@/types';
import type { BlockComponentProps } from '@/registry';
import { useTheme } from '@/context/ThemeContext';
import { dispatch } from '@/dispatcher/ActionDispatcher';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_HEIGHT = SCREEN_WIDTH * 0.48;

function BannerHeroComponent({ block }: BlockComponentProps<BannerHeroBlock>) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={() => dispatch(block.action)}
      style={styles.container}
      accessibilityRole="button"
      accessibilityLabel={block.title ?? 'Promotional banner'}
    >
      <Image
        source={{ uri: block.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        {block.title ? (
          <Text style={styles.title} numberOfLines={2}>
            {block.title}
          </Text>
        ) : null}
        {block.subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {block.subtitle}
          </Text>
        ) : null}
        {block.ctaLabel ? (
          <View style={[styles.ctaButton, { backgroundColor: theme.primary }]}>
            <Text style={styles.ctaText}>{block.ctaLabel}</Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
    height: BANNER_HEIGHT,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.32)',
    justifyContent: 'flex-end',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 10,
  },
  ctaButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});

export const BannerHero = memo(BannerHeroComponent);
