import React, { memo, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import type { ProductItem } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { useCartItem } from '@/context/CartContext';
import { dispatch } from '@/dispatcher/ActionDispatcher';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

type Props = {
  item: ProductItem;
};

function ProductCardComponent({ item }: Props) {
  const { theme } = useTheme();
  const quantity = useCartItem(item.id);

  const handleAddToCart = useCallback(() => {
    dispatch(item.action);
  }, [item.action]);

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />
        {item.badgeLabel ? (
          <View style={[styles.badge, { backgroundColor: theme.primary }]}>
            <Text style={styles.badgeText}>{item.badgeLabel}</Text>
          </View>
        ) : null}
        {!item.inStock && (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockText}>Out of Stock</Text>
          </View>
        )}
      </View>

      <View style={styles.details}>
        <Text style={[styles.brand, { color: theme.textSecondary }]} numberOfLines={1}>
          {item.brand}
        </Text>
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={2}>
          {item.name}
        </Text>

        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: theme.text }]}>₹{item.price}</Text>
          {item.originalPrice ? (
            <Text style={[styles.originalPrice, { color: theme.textSecondary }]}>
              ₹{item.originalPrice}
            </Text>
          ) : null}
          {item.discountPercent ? (
            <Text style={[styles.discount, { color: theme.primary }]}>
              {item.discountPercent}% off
            </Text>
          ) : null}
        </View>

        <TouchableOpacity
          style={[
            styles.addButton,
            {
              backgroundColor: item.inStock ? theme.primary : theme.border,
              borderColor: item.inStock ? theme.primary : theme.border,
            },
          ]}
          onPress={handleAddToCart}
          disabled={!item.inStock}
          accessibilityRole="button"
          accessibilityLabel={`Add ${item.name} to cart`}
        >
          <Text style={[styles.addButtonText, { color: item.inStock ? '#FFFFFF' : theme.textSecondary }]}>
            {quantity > 0 ? `In Cart (${quantity})` : 'Add to Cart'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  imageContainer: {
    position: 'relative',
    height: CARD_WIDTH * 0.85,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  outOfStockOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  details: {
    padding: 10,
    gap: 3,
  },
  brand: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 17,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
    flexWrap: 'wrap',
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
  },
  originalPrice: {
    fontSize: 11,
    textDecorationLine: 'line-through',
  },
  discount: {
    fontSize: 11,
    fontWeight: '600',
  },
  addButton: {
    marginTop: 8,
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});

export const ProductCard = memo(ProductCardComponent);
