import React, { memo, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ListRenderItemInfo,
} from 'react-native';
import type { DynamicCollectionBlock, CollectionItem } from '@/types';
import type { BlockComponentProps } from '@/registry';
import { useTheme } from '@/context/ThemeContext';
import { CollectionTile } from '@/components/primitives/CollectionTile';

// Stable key extractor — avoids remounting tiles on re-render
const keyExtractor = (item: CollectionItem) => item.id;

// Item separator rendered between tiles
const ItemSeparator = () => <View style={styles.separator} />;

function DynamicCollectionComponent({ block }: BlockComponentProps<DynamicCollectionBlock>) {
  const { theme } = useTheme();

  // Persist scroll offset so the list restores position across
  // parent list recycling cycles
  const scrollOffset = useRef(0);

  const handleScrollBeginDrag = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollOffset.current = e.nativeEvent.contentOffset.x;
    },
    [],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<CollectionItem>) => <CollectionTile item={item} />,
    [],
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {block.sectionTitle}
        </Text>
        {block.themeTag ? (
          <View style={[styles.tag, { backgroundColor: theme.accent }]}>
            <Text style={[styles.tagText, { color: theme.text }]}>
              {block.themeTag}
            </Text>
          </View>
        ) : null}
      </View>

      <FlatList
        data={block.items}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={ItemSeparator}
        /*
         * nestedScrollEnabled allows this horizontal list to co-exist inside
         * the outer vertical FlashList without gesture conflicts. The Android
         * native driver handles touch event disambiguation at the scroll axis
         * level, preserving vertical momentum when the user swipes diagonally.
         */
        nestedScrollEnabled
        onScrollBeginDrag={handleScrollBeginDrag}
        removeClippedSubviews
        maxToRenderPerBatch={6}
        windowSize={5}
        initialNumToRender={4}
        getItemLayout={(_data, index) => ({
          length: 122,
          offset: 122 * index,
          index,
        })}
        decelerationRate="fast"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingRight: 8,
  },
  separator: {
    width: 12,
  },
});

export const DynamicCollection = memo(DynamicCollectionComponent);
