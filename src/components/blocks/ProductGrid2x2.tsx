import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { ProductGrid2x2Block } from '@/types';
import type { BlockComponentProps } from '@/registry';
import { useTheme } from '@/context/ThemeContext';
import { ProductCard } from '@/components/primitives/ProductCard';

function ProductGrid2x2Component({ block }: BlockComponentProps<ProductGrid2x2Block>) {
  const { theme } = useTheme();

  const rows: [typeof block.items[number], typeof block.items[number] | undefined][] = [];
  for (let i = 0; i < block.items.length; i += 2) {
    rows.push([block.items[i], block.items[i + 1]]);
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        {block.sectionTitle}
      </Text>
      {rows.map(([left, right], rowIndex) => (
        <View key={`row_${rowIndex}`} style={styles.row}>
          <ProductCard item={left} />
          {right ? <ProductCard item={right} /> : <View style={styles.phantom} />}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: 0.1,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  phantom: {
    flex: 1,
  },
});

export const ProductGrid2x2 = memo(ProductGrid2x2Component);
