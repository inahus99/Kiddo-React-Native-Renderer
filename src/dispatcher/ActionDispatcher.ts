import { Alert, Linking } from 'react-native';
import type {
  ActionSchema,
  AddToCartPayload,
  DeepLinkPayload,
  ApplyMysteryGiftPayload,
  OpenEventBookingPayload,
} from '@/types';
import { useCartStore } from '@/context/CartContext';

// ─── Handler Implementations ─────────────────────────────────────────────────

function handleAddToCart(payload: AddToCartPayload): void {
  useCartStore.getState().addItem(payload);
}

function handleDeepLink(payload: DeepLinkPayload): void {
  // In production this integrates with a navigation router (e.g. Expo Router,
  // React Navigation) via a registered deep-link handler. For this demo we
  // log the destination and attempt to open an external URL if it is absolute.
  console.log('[ActionDispatcher] DEEP_LINK →', payload.url);
  if (payload.url.startsWith('http')) {
    void Linking.openURL(payload.url);
  }
}

function handleApplyMysteryGift(payload: ApplyMysteryGiftPayload): void {
  Alert.alert(
    '🎉 Mystery Gift Applied!',
    `Coupon "${payload.couponCode}" has been applied to your cart.`,
    [{ text: 'Awesome!', style: 'default' }],
  );
}

function handleOpenEventBooking(payload: OpenEventBookingPayload): void {
  Alert.alert(
    '🎪 Book Your Spot',
    `Opening booking for "${payload.eventName}". Redirecting to the event page.`,
    [{ text: 'Continue', style: 'default' }],
  );
}

// ─── Handler Registry (hash-map) ─────────────────────────────────────────────

type HandlerMap = {
  [K in ActionSchema['type']]: (
    payload: Extract<ActionSchema, { type: K }>['payload'],
  ) => void;
};

const handlers: HandlerMap = {
  ADD_TO_CART: handleAddToCart,
  DEEP_LINK: handleDeepLink,
  APPLY_MYSTERY_GIFT_COUPON: handleApplyMysteryGift,
  OPEN_EVENT_BOOKING: handleOpenEventBooking,
};

// ─── Public Dispatcher ────────────────────────────────────────────────────────

export function dispatch(action: ActionSchema): void {
  const handler = handlers[action.type];
  if (!handler) {
    console.warn('[ActionDispatcher] Unregistered action type:', action.type);
    return;
  }
  // TypeScript narrowing via the discriminated union ensures payload type-safety
  (handler as (p: typeof action.payload) => void)(action.payload);
}
