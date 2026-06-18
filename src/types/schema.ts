import type { ActionSchema } from './actions';
import type { ThemeConfig, CampaignOverlay } from './theme';

// ─── Primitive Data Types ────────────────────────────────────────────────────

export type ProductItem = {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  imageUrl: string;
  badgeLabel?: string;
  inStock: boolean;
  action: ActionSchema;
};

export type CollectionItem = {
  id: string;
  title: string;
  imageUrl: string;
  subtitle?: string;
  action: ActionSchema;
};

// ─── Block Types (registered components) ─────────────────────────────────────

export type BannerHeroBlock = {
  id: string;
  type: 'BANNER_HERO';
  imageUrl: string;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  action: ActionSchema;
};

export type ProductGrid2x2Block = {
  id: string;
  type: 'PRODUCT_GRID_2X2';
  sectionTitle: string;
  items: ProductItem[];
};

export type DynamicCollectionBlock = {
  id: string;
  type: 'DYNAMIC_COLLECTION';
  sectionTitle: string;
  themeTag?: string;
  items: CollectionItem[];
};

export type UnknownBlock = {
  id: string;
  type: string;
  [key: string]: unknown;
};

export type KnownBlockType =
  | 'BANNER_HERO'
  | 'PRODUCT_GRID_2X2'
  | 'DYNAMIC_COLLECTION';

export type BlockNode =
  | BannerHeroBlock
  | ProductGrid2x2Block
  | DynamicCollectionBlock
  | UnknownBlock;

// ─── Root Payload ─────────────────────────────────────────────────────────────

export type HomepagePayload = {
  version: string;
  requestId: string;
  theme: ThemeConfig;
  campaign?: {
    id: string;
    name: string;
    overlay?: CampaignOverlay;
  };
  blocks: BlockNode[];
};
