import React, { useCallback, useMemo, Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
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

registerBlock('BANNER_HERO', BannerHero);
registerBlock('PRODUCT_GRID_2X2', ProductGrid2x2);
registerBlock('DYNAMIC_COLLECTION', DynamicCollection);

class AppErrorBoundary extends Component<
  { children: React.ReactNode },
  { error: string | null }
> {
  state = { error: null };
  static getDerivedStateFromError(e: Error) { return { error: e.message }; }
  render() {
    if (this.state.error) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <Text style={{ color: '#C62828', fontSize: 14 }}>
            Render error: {this.state.error}
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

type Props = {
  payload: HomepagePayload;
};

export function HomeFeed({ payload }: Props) {
  const { theme } = useTheme();
  const cartTotal = useCartTotal();

  const renderBlock = useCallback((block: BlockNode) => (
    <BlockRenderer key={block.id} block={block} />
  ), []);

  const listHeader = useMemo(() => {
    if (!payload.campaign) return null;
    return <CampaignBanner campaignName={payload.campaign.name} />;
  }, [payload.campaign]);

  return (
    <AppErrorBoundary>
      <View style={[styles.root, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
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

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40, backgroundColor: theme.background }}
        >
          {listHeader}
          {payload.blocks.map(renderBlock)}
        </ScrollView>

        {payload.campaign?.overlay ? (
          <FullScreenOverlay overlay={payload.campaign.overlay} />
        ) : null}
      </View>
    </AppErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  logoText: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  cartButton: { padding: 6, position: 'relative' },
  cartIcon: { fontSize: 24 },
  cartBadge: {
    position: 'absolute', top: 2, right: 2,
    minWidth: 18, height: 18, borderRadius: 9,
    justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4,
  },
  cartBadgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
});
