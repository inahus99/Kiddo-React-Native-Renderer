# Kidoo — Server-Driven UI Engine for React Native

A production-ready, configuration-driven homepage renderer for Kidoo — a Q-commerce platform for kids & baby essentials. The app delivers zero App Store / Play Store release cycles by making the React Native client a pure rendering engine that interprets a JSON payload from the backend.

---

## High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                          BACKEND / MOCK                                  │
│                                                                          │
│   src/mocks/homepage_payload.json                                        │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │  { version, requestId, theme{}, campaign{}, blocks[] }          │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│   src/campaigns/   (3 campaign overlays — swapped at runtime)            │
│      back_to_school.json  |  summer_playhouse.json  |  mystery_gift.json │
└────────────────────────────────────┬─────────────────────────────────────┘
                                     │ JSON payload
                                     ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         TYPE LAYER  (src/types/)                         │
│                                                                          │
│  HomepagePayload → BlockNode (discriminated union)                       │
│  ActionSchema → ADD_TO_CART | DEEP_LINK | APPLY_MYSTERY_GIFT_COUPON      │
│  ThemeConfig    CampaignOverlay                                          │
└────────────────────────────────────┬─────────────────────────────────────┘
                                     │ typed blocks[]
                                     ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                  COMPONENT REGISTRY  (src/registry/)                     │
│                                                                          │
│  Hash-map: Record<KnownBlockType, ComponentType>                         │
│  ┌──────────────────┬─────────────────┬──────────────────────────────┐  │
│  │  BANNER_HERO     │ PRODUCT_GRID_2X2│  DYNAMIC_COLLECTION          │  │
│  │  → BannerHero    │ → ProductGrid   │  → DynamicCollection         │  │
│  └──────────────────┴─────────────────┴──────────────────────────────┘  │
│                                                                          │
│  resolveBlock(type) → Component | null                                   │
│  Unknown type → null → BlockRenderer drops it silently                   │
└────────────────────────────────────┬─────────────────────────────────────┘
                                     │ resolved component
                                     ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                      SDUI ENGINE  (src/engine/)                          │
│                                                                          │
│  HomeFeed.tsx                                                            │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  @shopify/FlashList (vertical, getItemType → view recycling pool)  │ │
│  │                                                                    │ │
│  │  item → BlockRenderer (React.memo, reference equality comparator) │ │
│  │            │                                                       │ │
│  │            ├─ BlockErrorBoundary (per-block fault isolation)       │ │
│  │            │     └─ BannerHero         (React.memo)                │ │
│  │            │     └─ ProductGrid2x2     (React.memo)                │ │
│  │            │     └─ DynamicCollection  (React.memo)                │ │
│  │            │           └─ horizontal FlatList (nestedScrollEnabled)│ │
│  │            │                └─ CollectionTile  (React.memo)        │ │
│  │            └─ unknown type → null (silent drop, DEV warning)       │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  FullScreenOverlay (position:absolute, pointerEvents="none")             │
│    └─ LottieView (campaign animation, auto-dismiss after duration_ms)    │
└───────────────────────┬──────────────────────────┬───────────────────────┘
                        │                          │
          ┌─────────────▼──────────┐  ┌────────────▼──────────────┐
          │  ACTION DISPATCHER     │  │  CONTEXT LAYER             │
          │  (src/dispatcher/)     │  │                            │
          │                        │  │  ThemeContext              │
          │  dispatch(action)       │  │    useMemo(theme) → stable │
          │  Handler hash-map:      │  │    ref, child re-renders   │
          │   ADD_TO_CART          │  │    only on color change     │
          │     → CartStore.add    │  │                            │
          │   DEEP_LINK            │  │  CartContext (Zustand)      │
          │     → Linking / Router │  │    useCartItem(id)          │
          │   APPLY_MYSTERY_GIFT   │  │    granular per-item        │
          │     → promo API        │  │    selector — card A update │
          │   OPEN_EVENT_BOOKING   │  │    does NOT re-render B..Z  │
          │     → booking screen   │  │                            │
          └────────────────────────┘  └────────────────────────────┘
```

---

## How It Works

### 1. Payload Ingestion
`App.tsx` imports the mock JSON (production: fetched from a gateway API) and passes it to `<HomeFeed payload={payload} />`. The root wraps the tree in `<ThemeProvider>` and `<CartProvider>`, injecting the OTA theme and cart store globally.

### 2. Component Registry (Factory Pattern)
`src/registry/ComponentRegistry.ts` exposes a `registerBlock(type, Component)` function. All three block types are registered once at module load in `HomeFeed.tsx`:

```ts
registerBlock('BANNER_HERO', BannerHero);
registerBlock('PRODUCT_GRID_2X2', ProductGrid2x2);
registerBlock('DYNAMIC_COLLECTION', DynamicCollection);
```

`resolveBlock(type)` looks up the map and returns `null` for unregistered types. Adding a new block type requires **zero changes to the engine** — register it and ship the payload.

### 3. Resilience
`BlockRenderer` calls `resolveBlock(block.type)`. If `null`, the block is silently dropped and the surrounding feed remains fully stable. Each rendered block is additionally wrapped in a `BlockErrorBoundary`; a runtime crash in one component returns `null` and logs to console without breaking the session.

### 4. Nested Scroll (DynamicCollection)
`DynamicCollection` renders a **horizontal FlatList nested inside the vertical FlashList**. `nestedScrollEnabled` passes touch disambiguation to the native scroll driver. On iOS, `decelerationRate="fast"` snaps the horizontal list. `getItemLayout` pre-computes tile offsets so no layout measurements happen at scroll time.

### 5. OTA Theming
The payload's `theme{}` object flows into `ThemeContext`. Every block reads `useTheme()`. Swapping a campaign payload (e.g. from `back_to_school.json`) changes the entire app's color skin without a build — buttons, badges, backgrounds, and borders all respond.

### 6. Cart State — Zero Cross-Card Re-renders
Zustand's `useCartItem(productId)` subscribes a `ProductCard` only to its own `quantity` key in the store. Adding item A to cart triggers a state update that touches only the selector for item A — Zustand's equality check skips re-rendering items B through Z in the same grid.

### 7. Campaign Overlays
When `payload.campaign.overlay` is present, `FullScreenOverlay` renders a Lottie animation absolutely positioned over the full screen. `pointerEvents="none"` is the critical property: taps, scrolls, and swipes **pass through** to the underlying feed entirely. The overlay auto-dismisses on animation finish or after `duration_ms`.

---

## Campaign Profiles

| Campaign | Theme | Overlay Animation | Special Component |
|---|---|---|---|
| Back to School Mega-Sale | Yellow + Primary Blue | Paper airplanes / pencils (Lottie) | Lunchboxes & Bags collection row |
| Summer Playhouse Festival | Ocean Blue | Water splash / beach ball (Lottie) | Petting Zoo Tickets booking |
| Mystery Gift Carnival | Carnival Red | Confetti burst (Lottie) | APPLY_MYSTERY_GIFT_COUPON action |

---

## Tech Stack

| Concern | Technology |
|---|---|
| Framework | React Native (Expo Managed Workflow) |
| Language | TypeScript (strict mode) |
| List rendering | @shopify/flash-list |
| Animations | lottie-react-native |
| State management | Zustand (granular selectors) + React Context |
| Type system | Discriminated union block/action schemas |

---

## Project Structure

```
src/
├── types/              # All TypeScript interfaces — schema, actions, theme
├── registry/           # Component Factory Registry (hash-map)
├── engine/             # HomeFeed (FlashList) + BlockRenderer + ErrorBoundary
├── components/
│   ├── blocks/         # BANNER_HERO · PRODUCT_GRID_2X2 · DYNAMIC_COLLECTION
│   ├── primitives/     # ProductCard · CollectionTile (leaf components)
│   └── overlays/       # FullScreenOverlay · CampaignBanner
├── context/            # ThemeContext · CartContext (Zustand)
├── dispatcher/         # ActionDispatcher (centralized handler map)
├── campaigns/          # Three campaign JSON profiles
└── mocks/              # homepage_payload.json (simulates production API)
```

---

## Getting Started

```bash
# Install dependencies
npm install --legacy-peer-deps

# Run in browser (web)
npm run web
# then open http://localhost:8081

# Start the Expo development server (QR code for Expo Go)
npm start

# Run on Android
npm run android

# Run on iOS (macOS required)
npm run ios
```

> **Node / npm version:** Tested with Node 20 LTS. React is pinned to `19.0.0` — both `react` and `react-dom` must be the exact same version; the lock file enforces this.

> **Switching campaigns:** In `App.tsx`, swap the import line to any of the three full campaign payloads:
> ```ts
> // Active campaign (default)
> import homepagePayload from '@/mocks/homepage_payload.json';        // Mystery Gift Carnival
>
> // Switch to other campaigns:
> import homepagePayload from '@/campaigns/back_to_school.json';      // yellow+blue, Lunchboxes & Bags
> import homepagePayload from '@/campaigns/summer_playhouse.json';    // ocean blue, Petting Zoo Tickets
> import homepagePayload from '@/campaigns/mystery_gift_carnival.json'; // carnival red, confetti overlay
> ```
> Each file is a complete `HomepagePayload` — theme, overlay, and campaign-specific blocks all change instantly.

---

## Evaluation Checklist

| Criterion | Implementation |
|---|---|
| Architectural Cleanliness | Factory Registry via hash-map; no switch statements |
| Sustained Frame Performance | FlashList + getItemType recycling; getItemLayout pre-computation; React.memo on all blocks |
| TypeScript Strategy | Strict mode; discriminated union BlockNode and ActionSchema; no `any` |
| System Defensive Resilience | resolveBlock() null-check silently drops unknown blocks; per-block ErrorBoundary isolates render crashes |
| Nested Scroll | nestedScrollEnabled + native scroll axis disambiguation; no vertical momentum stutter |
| OTA Theming | ThemeContext at root; useMemo stable reference; all children respond to theme key |
| Cart Isolation | useCartItem(id) Zustand selector; card A update does not re-render cards B–Z |
| Campaign Overlays | pointerEvents="none"; Lottie over full screen; auto-dismiss |
