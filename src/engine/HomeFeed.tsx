import React, { useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { HomepagePayload, BlockNode } from '@/types';
import { registerBlock } from '@/registry';
import { useTheme } from '@/context/ThemeContext';
import { useCartTotal } from '@/context/CartContext';
import { BlockRenderer } from './BlockRenderer';
import { BannerHero } from '@/components/blocks/BannerHero';
import { ProductGrid2x2 } from '@/components/blocks/ProductGrid2x2';
import { DynamicCollection } from '@/components/blocks/DynamicCollection';
import { FullScreenOverlay } from '@/components/overlays/FullScreenOverlay';
import { CampaignBanner } from '@/components/overlays/CampaignBanner';

// ─── Register all blocks into the factory registry ───────────────────────────
// Registration happens once at module load time. Any new block type is added
// here and immediately available to the renderer without modifying engine code.

registerBlock('BANNER_HERO', BannerHero);
registerBlock('PRODUCT_GRID_2X2', ProductGrid2x2);
registerBlock('DYNAMIC_COLLECTION', DynamicCollection);

// ─── Estimated item heights for FlashList's layout pre-computation ────────────
// Over-estimates are safe; under-estimates cause scroll position jumps.

const BLOCK_ESTIMATED_HEIGHT: Record<string, number> = {
  BANNER_HERO: 220,
  PRODUCT_GRID_2X2: 380,
  DYNAMIC_COLLECTION: 190,
};
const DEFAULT_ESTIMATED_HEIGHT = 200;

type Props = {
  payload: HomepagePayload;
};

export function HomeFeed({ payload }: Props) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const cartTotal = useCartTotal();

  // Stable key extractor by block id — prevents FlashList from remounting
  // components when the list updates or the component re-renders
  const keyExtractor = useCallback((item: BlockNode) => item.id, []);

  const estimatedItemSize = useCallback((item: BlockNode) => {
    return BLOCK_ESTIMATED_HEIGHT[item.type] ?? DEFAULT_ESTIMATED_HEIGHT;
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: BlockNode }) => <BlockRenderer block={item} />,
    [],
  );

  const listHeader = useMemo(() => {
    if (!payload.campaign) return null;
    return <CampaignBanner campaignName={payload.campaign.name} />;
  }, [payload.campaign]);

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      {/* Cart header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.surface,
            borderBottomColor: theme.border,
            paddingTop: insets.top + 8,
          },
        ]}
      >
        <Text style={[styles.logoText, { color: theme.primary }]}>kiddo</Text>
        <TouchableOpacity style={styles.cartButton} accessibilityRole="button" accessibilityLabel="Cart">
          <Text style={styles.cartIcon}>🛒</Text>
          {cartTotal > 0 && (
            <View style={[styles.cartBadge, { backgroundColor: theme.primary }]}>
              <Text style={styles.cartBadgeText}>{cartTotal > 99 ? '99+' : cartTotal}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Main feed — single FlashList driving all block types */}
      <FlashList
        data={payload.blocks}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        estimatedItemSize={240}
        getItemType={(item) => item.type}
        overrideItemLayout={(layout, item) => {
          layout.size = estimatedItemSize(item);
        }}
        ListHeaderComponent={listHeader}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 24,
          backgroundColor: theme.background,
        }}
        showsVerticalScrollIndicator={false}
        /*
         * drawDistance controls how far beyond the visible area FlashList
         * pre-renders content. A larger value trades memory for smoother
         * fast-scroll at the cost of initial render work.
         */
        drawDistance={Platform.OS === 'android' ? 500 : 250}
        removeClippedSubviews={Platform.OS === 'android'}
      />

      {/* Campaign overlay — absolutely positioned, pointerEvents=none */}
      {payload.campaign?.overlay ? (
        <FullScreenOverlay overlay={payload.campaign.overlay} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  logoText: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  cartButton: {
    padding: 6,
    position: 'relative',
  },
  cartIcon: {
    fontSize: 24,
  },
  cartBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
});
