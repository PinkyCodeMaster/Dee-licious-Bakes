import type {
  Product,
  ProductWithDetails,
  Cart,
  CartWithItems,
  Order,
  OrderWithDetails,
  OrderStatus,
  PaymentStatus,
  MessageThreadStatus,
  CustomRequestStatus,
} from '@/lib/types';

/**
 * Type guard to check if a product has details (relationships loaded)
 */
export function isProductWithDetails(product: Product | ProductWithDetails): product is ProductWithDetails {
  return 'category' in product || 'variants' in product || 'images' in product;
}

/**
 * Type guard to check if a cart has items loaded
 */
export function isCartWithItems(cart: Cart | CartWithItems): cart is CartWithItems {
  return 'items' in cart && Array.isArray(cart.items);
}

/**
 * Type guard to check if an order has details loaded
 */
export function isOrderWithDetails(order: Order | OrderWithDetails): order is OrderWithDetails {
  return 'items' in order || 'statusHistory' in order;
}

/**
 * Type guard for order status
 */
export function isValidOrderStatus(status: string): status is OrderStatus {
  return ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'].includes(status);
}

/**
 * Type guard for payment status
 */
export function isValidPaymentStatus(status: string): status is PaymentStatus {
  return ['pending', 'processing', 'completed', 'failed', 'refunded'].includes(status);
}

/**
 * Type guard for message thread status
 */
export function isValidMessageThreadStatus(status: string): status is MessageThreadStatus {
  return ['open', 'closed', 'pending'].includes(status);
}

/**
 * Type guard for custom request status
 */
export function isValidCustomRequestStatus(status: string): status is CustomRequestStatus {
  return ['pending', 'reviewing', 'quoted', 'approved', 'declined', 'completed'].includes(status);
}

/**
 * Helper function to check if an order can be cancelled
 */
export function canCancelOrder(order: Order): boolean {
  return ['pending', 'confirmed'].includes(order.status);
}

/**
 * Helper function to check if an order can be modified
 */
export function canModifyOrder(order: Order): boolean {
  return ['pending'].includes(order.status);
}

/**
 * Helper function to check if a product is available for purchase
 */
export function isProductAvailable(product: Product): boolean {
  return Boolean(product.isActive) && (product.stockQuantity === null || product.stockQuantity > 0);
}

/**
 * Helper function to check if a cart is empty
 */
export function isCartEmpty(cart: CartWithItems): boolean {
  return !cart.items || cart.items.length === 0;
}

/**
 * Helper function to get cart total item count
 */
export function getCartItemCount(cart: CartWithItems): number {
  if (!cart.items) return 0;
  return cart.items.reduce((total, item) => total + item.quantity, 0);
}