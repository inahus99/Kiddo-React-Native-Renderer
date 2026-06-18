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

// ─── Hero variant — full bleed, dark scrim, bottom-left CTA ──────────────────

function HeroBanner({ block, theme }: { block: BannerHeroBlock; theme: ReturnType<typeof useTheme>['theme'] }) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => dispatch(block.action)}
      style={heroStyles.container}
      accessibilityRole="button"
      accessibilityLabel={block.title ?? 'Promotional banner'}
    >
      <Image source={{ uri: block.imageUrl }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
      <View style={heroStyles.scrimTop} />
      <View style={heroStyles.scrimBottom} />
      {block.badgeLabel ? (
        <View style={[heroStyles.badge, { backgroundColor: block.accentColor ?? theme.primary }]}>
          <Text style={heroStyles.badgeText}>{block.badgeLabel}</Text>
        </View>
      ) : null}
      <View style={heroStyles.content}>
        {block.title ? (
          <Text style={heroStyles.title} numberOfLines={2}>{block.title}</Text>
        ) : null}
        {block.subtitle ? (
          <Text style={heroStyles.subtitle} numberOfLines={1}>{block.subtitle}</Text>
        ) : null}
        {block.ctaLabel ? (
          <View style={[heroStyles.cta, { backgroundColor: block.accentColor ?? theme.primary }]}>
            <Text style={heroStyles.ctaText}>{block.ctaLabel} →</Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const heroStyles = StyleSheet.create({
  container: {
    marginHorizontal: 16, marginVertical: 8,
    borderRadius: 20, overflow: 'hidden',
    height: SCREEN_WIDTH * 0.54,
    elevation: 5,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18, shadowRadius: 10,
  },
  scrimTop: {
    position: 'absolute', top: 0, left: 0, right: 0, height: '45%',
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  scrimBottom: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%',
    backgroundColor: 'rgba(0,0,0,0.48)',
  },
  badge: {
    position: 'absolute', top: 14, left: 14,
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20,
  },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '700', letterSpacing: 0.4 },
  content: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16 },
  title: { fontSize: 20, fontWeight: '800', color: '#fff', letterSpacing: 0.1, marginBottom: 3 },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.82)', marginBottom: 10 },
  cta: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 22,
  },
  ctaText: { color: '#fff', fontSize: 13, fontWeight: '700', letterSpacing: 0.2 },
});

// ─── Offer variant — split: text left, image right, accent stripe ─────────────

function OfferBanner({ block, theme }: { block: BannerHeroBlock; theme: ReturnType<typeof useTheme>['theme'] }) {
  const accent = block.accentColor ?? theme.secondary;
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => dispatch(block.action)}
      style={[offerStyles.container, { backgroundColor: theme.surface }]}
      accessibilityRole="button"
      accessibilityLabel={block.title ?? 'Offer banner'}
    >
      <View style={[offerStyles.stripe, { backgroundColor: accent }]} />
      <View style={offerStyles.textBlock}>
        {block.badgeLabel ? (
          <View style={[offerStyles.pricePill, { backgroundColor: accent + '22', borderColor: accent }]}>
            <Text style={[offerStyles.priceText, { color: accent }]}>{block.badgeLabel}</Text>
          </View>
        ) : null}
        {block.title ? (
          <Text style={[offerStyles.title, { color: theme.text }]} numberOfLines={2}>{block.title}</Text>
        ) : null}
        {block.subtitle ? (
          <Text style={[offerStyles.subtitle, { color: theme.textSecondary }]} numberOfLines={2}>{block.subtitle}</Text>
        ) : null}
        {block.ctaLabel ? (
          <View style={[offerStyles.cta, { backgroundColor: accent }]}>
            <Text style={offerStyles.ctaText}>{block.ctaLabel}</Text>
          </View>
        ) : null}
      </View>
      <Image source={{ uri: block.imageUrl }} style={offerStyles.image} resizeMode="cover" />
    </TouchableOpacity>
  );
}

const offerStyles = StyleSheet.create({
  container: {
    marginHorizontal: 16, marginVertical: 8,
    borderRadius: 18, overflow: 'hidden',
    flexDirection: 'row', alignItems: 'center',
    height: SCREEN_WIDTH * 0.38,
    elevation: 3,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 6,
  },
  stripe: { width: 6, height: '100%' },
  textBlock: { flex: 1, paddingHorizontal: 14, paddingVertical: 12, justifyContent: 'center' },
  pricePill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 12, borderWidth: 1, marginBottom: 6,
  },
  priceText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.4 },
  title: { fontSize: 16, fontWeight: '700', marginBottom: 3 },
  subtitle: { fontSize: 12, lineHeight: 16, marginBottom: 10 },
  cta: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 14,
  },
  ctaText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  image: { width: SCREEN_WIDTH * 0.34, height: '100%' },
});

// ─── Campaign variant — centered, deep overlay, live badge, confetti dots ─────

function CampaignBannerBlock({ block, theme }: { block: BannerHeroBlock; theme: ReturnType<typeof useTheme>['theme'] }) {
  const accent = block.accentColor ?? theme.accent;
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => dispatch(block.action)}
      style={campaignStyles.container}
      accessibilityRole="button"
      accessibilityLabel={block.title ?? 'Campaign banner'}
    >
      <Image source={{ uri: block.imageUrl }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
      <View style={campaignStyles.overlay} />
      {block.badgeLabel ? (
        <View style={campaignStyles.liveBadge}>
          <Text style={campaignStyles.liveBadgeText}>{block.badgeLabel}</Text>
        </View>
      ) : null}
      <View style={campaignStyles.content}>
        {block.title ? (
          <Text style={campaignStyles.title} numberOfLines={2}>{block.title}</Text>
        ) : null}
        {block.subtitle ? (
          <Text style={campaignStyles.subtitle} numberOfLines={1}>{block.subtitle}</Text>
        ) : null}
        {block.ctaLabel ? (
          <View style={[campaignStyles.cta, { backgroundColor: accent }]}>
            <Text style={campaignStyles.ctaText}>{block.ctaLabel} 🎁</Text>
          </View>
        ) : null}
      </View>
      {[...Array(6)].map((_, i) => (
        <View
          key={i}
          style={[
            campaignStyles.dot,
            {
              top: 14 + (i % 3) * 18,
              left: 18 + i * 28,
              backgroundColor: [accent, '#FF6B35', '#06D6A0', '#EF476F', '#118AB2', '#fff'][i],
              width: 7 + (i % 2) * 4,
              height: 7 + (i % 2) * 4,
            },
          ]}
        />
      ))}
    </TouchableOpacity>
  );
}

const campaignStyles = StyleSheet.create({
  container: {
    marginHorizontal: 16, marginVertical: 8,
    borderRadius: 20, overflow: 'hidden',
    height: SCREEN_WIDTH * 0.48,
    elevation: 6,
    shadowColor: '#9B2335', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(30,0,60,0.52)',
  },
  liveBadge: {
    position: 'absolute', top: 14, right: 14,
    backgroundColor: '#EF4444',
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12,
  },
  liveBadgeText: { color: '#fff', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  content: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16,
  },
  title: {
    fontSize: 22, fontWeight: '900', color: '#fff',
    textAlign: 'center', letterSpacing: 0.3, marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 13, color: 'rgba(255,255,255,0.88)',
    textAlign: 'center', marginBottom: 14,
  },
  cta: { paddingHorizontal: 24, paddingVertical: 10, borderRadius: 24 },
  ctaText: { color: '#1a1a1a', fontSize: 14, fontWeight: '800', letterSpacing: 0.3 },
  dot: { position: 'absolute', borderRadius: 4, opacity: 0.7 },
});

// ─── Router ───────────────────────────────────────────────────────────────────

function BannerHeroComponent({ block }: BlockComponentProps<BannerHeroBlock>) {
  const { theme } = useTheme();
  const variant = block.variant ?? 'hero';
  if (variant === 'offer') return <OfferBanner block={block} theme={theme} />;
  if (variant === 'campaign') return <CampaignBannerBlock block={block} theme={theme} />;
  return <HeroBanner block={block} theme={theme} />;
}

export const BannerHero = memo(BannerHeroComponent);
