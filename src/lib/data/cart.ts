import { db } from '@/db';
import { carts, cartItems, wishlists, wishlistItems, products, productVariants } from '@/db/schema';
import { eq, and, desc, count, sum, sql } from 'drizzle-orm';
import type { CartWithItems, WishlistWithItems } from '@/lib/types';

/**
 * Cart and wishlist query utilities
 */
export class CartQueryUtils {
  /**
   * Get cart with items for a user
   */
  static async getCartByUserId(userId: string): Promise<CartWithItems | null> {
    const cart = await db
      .select()
      .from(carts)
      .where(eq(carts.userId, userId))
      .limit(1);

    if (!cart.length) return null;

    const items = await db
      .select({
        id: cartItems.id,
        cartId: cartItems.cartId,
        productId: cartItems.productId,
        variantId: cartItems.variantId,
        quantity: cartItems.quantity,
        customizations: cartItems.customizations,
        unitPrice: cartItems.unitPrice,
        createdAt: cartItems.createdAt,
        updatedAt: cartItems.updatedAt,
        // Product info
        productName: products.name,
        productSlug: products.slug,
        productImage: products.description, // You might want to join with images table
        // Variant info
        variantName: productVariants.name,
        variantPrice: productVariants.price,
        variantSku: productVariants.sku,
      })
      .from(cartItems)
      .leftJoin(products, eq(cartItems.productId, products.id))
      .leftJoin(productVariants, eq(cartItems.variantId, productVariants.id))
      .where(eq(cartItems.cartId, cart[0].id))
      .orderBy(desc(cartItems.createdAt));

    return {
      ...cart[0],
      items,
    };
  }

  /**
   * Get cart by session ID (for anonymous users)
   */
  static async getCartBySessionId(sessionId: string): Promise<CartWithItems | null> {
    const cart = await db
      .select()
      .from(carts)
      .where(eq(carts.sessionId, sessionId))
      .limit(1);

    if (!cart.length) return null;

    const items = await db
      .select({
        id: cartItems.id,
        cartId: cartItems.cartId,
        productId: cartItems.productId,
        variantId: cartItems.variantId,
        quantity: cartItems.quantity,
        customizations: cartItems.customizations,
        unitPrice: cartItems.unitPrice,
        createdAt: cartItems.createdAt,
        updatedAt: cartItems.updatedAt,
        // Product info
        productName: products.name,
        productSlug: products.slug,
        // Variant info
        variantName: productVariants.name,
        variantPrice: productVariants.price,
        variantSku: productVariants.sku,
      })
      .from(cartItems)
      .leftJoin(products, eq(cartItems.productId, products.id))
      .leftJoin(productVariants, eq(cartItems.variantId, productVariants.id))
      .where(eq(cartItems.cartId, cart[0].id))
      .orderBy(desc(cartItems.createdAt));

    return {
      ...cart[0],
      items,
    };
  }

  /**
   * Get cart summary (totals, counts)
   */
  static async getCartSummary(cartId: string) {
    const result = await db
      .select({
        itemCount: count(cartItems.id),
        totalItems: sum(cartItems.quantity),
        subtotal: sql<number>`SUM(${cartItems.quantity} * ${cartItems.unitPrice})`,
      })
      .from(cartItems)
      .where(eq(cartItems.cartId, cartId))
      .groupBy();

    const summary = result[0] || {
      itemCount: 0,
      totalItems: 0,
      subtotal: 0,
    };

    // Calculate tax and total (you can customize these calculations)
    const taxRate = 0.08; // 8% tax
    const tax = summary.subtotal * taxRate;
    const total = summary.subtotal + tax;

    return {
      itemCount: summary.itemCount,
      totalItems: Number(summary.totalItems) || 0,
      subtotal: Number(summary.subtotal) || 0,
      tax: Number(tax.toFixed(2)),
      total: Number(total.toFixed(2)),
    };
  }

  /**
   * Get user's wishlists
   */
  static async getUserWishlists(userId: string): Promise<WishlistWithItems[]> {
    const userWishlists = await db
      .select()
      .from(wishlists)
      .where(eq(wishlists.userId, userId))
      .orderBy(desc(wishlists.isDefault), desc(wishlists.createdAt));

    const wishlistsWithItems = await Promise.all(
      userWishlists.map(async (wishlist) => {
        const items = await db
          .select({
            id: wishlistItems.id,
            wishlistId: wishlistItems.wishlistId,
            productId: wishlistItems.productId,
            variantId: wishlistItems.variantId,
            notes: wishlistItems.notes,
            createdAt: wishlistItems.createdAt,
            // Product info
            productName: products.name,
            productSlug: products.slug,
            productPrice: products.basePrice,
            // Variant info
            variantName: productVariants.name,
            variantPrice: productVariants.price,
            variantSku: productVariants.sku,
          })
          .from(wishlistItems)
          .leftJoin(products, eq(wishlistItems.productId, products.id))
          .leftJoin(productVariants, eq(wishlistItems.variantId, productVariants.id))
          .where(eq(wishlistItems.wishlistId, wishlist.id))
          .orderBy(desc(wishlistItems.createdAt));

        return {
          ...wishlist,
          items,
        };
      })
    );

    return wishlistsWithItems;
  }

  /**
   * Get default wishlist for user
   */
  static async getDefaultWishlist(userId: string): Promise<WishlistWithItems | null> {
    const wishlist = await db
      .select()
      .from(wishlists)
      .where(and(eq(wishlists.userId, userId), eq(wishlists.isDefault, true)))
      .limit(1);

    if (!wishlist.length) return null;

    const items = await db
      .select({
        id: wishlistItems.id,
        wishlistId: wishlistItems.wishlistId,
        productId: wishlistItems.productId,
        variantId: wishlistItems.variantId,
        notes: wishlistItems.notes,
        createdAt: wishlistItems.createdAt,
        // Product info
        productName: products.name,
        productSlug: products.slug,
        productPrice: products.basePrice,
        // Variant info
        variantName: productVariants.name,
        variantPrice: productVariants.price,
        variantSku: productVariants.sku,
      })
      .from(wishlistItems)
      .leftJoin(products, eq(wishlistItems.productId, products.id))
      .leftJoin(productVariants, eq(wishlistItems.variantId, productVariants.id))
      .where(eq(wishlistItems.wishlistId, wishlist[0].id))
      .orderBy(desc(wishlistItems.createdAt));

    return {
      ...wishlist[0],
      items,
    };
  }

  /**
   * Check if product is in user's wishlist
   */
  static async isProductInWishlist(
    userId: string,
    productId: string,
    variantId?: string
  ): Promise<boolean> {
    const userWishlists = await db
      .select({ id: wishlists.id })
      .from(wishlists)
      .where(eq(wishlists.userId, userId));

    if (!userWishlists.length) return false;

    const wishlistIds = userWishlists.map(w => w.id);

    const conditions = [
      eq(wishlistItems.productId, productId),
      sql`${wishlistItems.wishlistId} = ANY(${wishlistIds})`
    ];

    if (variantId) {
      conditions.push(eq(wishlistItems.variantId, variantId));
    }

    const result = await db
      .select({ id: wishlistItems.id })
      .from(wishlistItems)
      .where(and(...conditions))
      .limit(1);

    return result.length > 0;
  }

  /**
   * Get recently added cart items
   */
  static async getRecentCartItems(cartId: string, limit: number = 5) {
    return db
      .select({
        id: cartItems.id,
        productId: cartItems.productId,
        variantId: cartItems.variantId,
        quantity: cartItems.quantity,
        unitPrice: cartItems.unitPrice,
        createdAt: cartItems.createdAt,
        // Product info
        productName: products.name,
        productSlug: products.slug,
        // Variant info
        variantName: productVariants.name,
      })
      .from(cartItems)
      .leftJoin(products, eq(cartItems.productId, products.id))
      .leftJoin(productVariants, eq(cartItems.variantId, productVariants.id))
      .where(eq(cartItems.cartId, cartId))
      .orderBy(desc(cartItems.createdAt))
      .limit(limit);
  }
}

// Convenience functions
export const cartQueries = {
  getByUserId: CartQueryUtils.getCartByUserId,
  getBySessionId: CartQueryUtils.getCartBySessionId,
  getSummary: CartQueryUtils.getCartSummary,
  getUserWishlists: CartQueryUtils.getUserWishlists,
  getDefaultWishlist: CartQueryUtils.getDefaultWishlist,
  isProductInWishlist: CartQueryUtils.isProductInWishlist,
  getRecentItems: CartQueryUtils.getRecentCartItems,
};