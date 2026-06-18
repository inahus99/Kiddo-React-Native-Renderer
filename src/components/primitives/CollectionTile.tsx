import React, { memo, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import type { CollectionItem } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { dispatch } from '@/dispatcher/ActionDispatcher';

type Props = {
  item: CollectionItem;
};

function CollectionTileComponent({ item }: Props) {
  const { theme } = useTheme();

  const handlePress = useCallback(() => {
    dispatch(item.action);
  }, [item.action]);

  return (
    <TouchableOpacity
      style={[styles.tile, { backgroundColor: theme.surface, borderColor: theme.border }]}
      onPress={handlePress}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={item.title}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />
      <View style={styles.label}>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
          {item.title}
        </Text>
        {item.subtitle ? (
          <Text style={[styles.subtitle, { color: theme.primary }]} numberOfLines={1}>
            {item.subtitle}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: 110,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    marginRight: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
  },
  image: {
    width: '100%',
    height: 90,
  },
  label: {
    padding: 8,
    gap: 2,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '500',
  },
});

export const CollectionTile = memo(CollectionTileComponent);
