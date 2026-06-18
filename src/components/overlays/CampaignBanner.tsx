import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

type Props = {
  campaignName: string;
};

function CampaignBannerComponent({ campaignName }: Props) {
  const { theme } = useTheme();

  return (
    <View style={[styles.banner, { backgroundColor: theme.primary }]}>
      <Text style={styles.icon}>🎉</Text>
      <Text style={styles.text} numberOfLines={1}>
        {campaignName} — Live Now!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  icon: {
    fontSize: 16,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
    flex: 1,
  },
});

export const CampaignBanner = memo(CampaignBannerComponent);
