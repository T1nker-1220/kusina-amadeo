// Menu Categories
export const CATEGORIES = ['All', 'Budget Meals', 'Silog Meals', 'Ala Carte', 'Beverages'];

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
} as const;

// Price Range Defaults
export const PRICE_RANGE = {
  MIN: 0,
  MAX: 1000,
} as const;

// Product Status
export const PRODUCT_STATUS = {
  AVAILABLE: 'available',
  UNAVAILABLE: 'unavailable',
} as const;
