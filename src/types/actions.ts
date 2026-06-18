export type AddToCartPayload = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
};

export type DeepLinkPayload = {
  url: string;
};

export type ApplyMysteryGiftPayload = {
  couponCode: string;
  productId: string;
};

export type OpenEventBookingPayload = {
  eventId: string;
  eventName: string;
};

export type ActionType =
  | 'ADD_TO_CART'
  | 'DEEP_LINK'
  | 'APPLY_MYSTERY_GIFT_COUPON'
  | 'OPEN_EVENT_BOOKING';

export type ActionSchema =
  | { type: 'ADD_TO_CART'; payload: AddToCartPayload }
  | { type: 'DEEP_LINK'; payload: DeepLinkPayload }
  | { type: 'APPLY_MYSTERY_GIFT_COUPON'; payload: ApplyMysteryGiftPayload }
  | { type: 'OPEN_EVENT_BOOKING'; payload: OpenEventBookingPayload };
