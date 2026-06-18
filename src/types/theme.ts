export type ThemeConfig = {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  accent: string;
  border: string;
};

export type CampaignOverlay = {
  type: 'FULL_SCREEN_OVERLAY';
  animation_url: string;
  duration_ms?: number;
};

export type CampaignTheme = {
  id: string;
  name: string;
  theme: ThemeConfig;
  overlay?: CampaignOverlay;
};
