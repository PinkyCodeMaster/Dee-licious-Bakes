import { z } from "zod";

// Cart validation schemas
export const cartSchema = z.object({
  id: z.string().min(1, "Cart ID is required"),
  userId: z.string().optional(),
  sessionId: z.string().optional(),
}).refine(data => data.userId || data.sessionId, {
  message: "Either userId or sessionId must be provided",
  path: ["userId"],
});

export const createCartSchema = cartSchema.omit({ 
  id: true,
});

// Cart item customizations validation
export const cartItemCustomizationsSchema = z.object({
  customText: z.string().max(500, "Custom text too long").optional(),
  decorations: z.object({
    color: z.string().max(50, "Color too long").optional(),
    design: z.string().max(100, "Design too long").optional(),
    message: z.string().max(200, "Message too long").optional(),
  }).optional(),
  specialInstructions: z.string().max(1000, "Special instructions too long").optional(),
  giftWrap: z.boolean().optional(),
  deliveryInstructions: z.string().max(500, "Delivery instructions too long").optional(),
  customOptions: z.record(z.string(), z.any()).optional(),
}).optional();

// Cart item validation schemas
export const cartItemSchema = z.object({
  id: z.string().min(1, "Cart item ID is required"),
  cartId: z.string().min(1, "Cart ID is required"),
  productId: z.string().min(1, "Product ID is required"),
  variantId: z.string().optional(),
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(100, "Quantity too large"),
  customizations: cartItemCustomizationsSchema,
  unitPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format").transform(val => parseFloat(val)),
});

export const createCartItemSchema = cartItemSchema.omit({ 
  id: true,
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(100, "Quantity too large").optional(),
  customizations: cartItemCustomizationsSchema,
});

// Add to cart validation
export const addToCartSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  variantId: z.string().optional(),
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(100, "Quantity too large").default(1),
  customizations: cartItemCustomizationsSchema,
});

// Wishlist validation schemas
export const wishlistSchema = z.object({
  id: z.string().min(1, "Wishlist ID is required"),
  userId: z.string().min(1, "User ID is required"),
  name: z.string().min(1, "Wishlist name is required").max(100, "Wishlist name too long").default("My Wishlist"),
  isDefault: z.boolean().default(true),
});

export const createWishlistSchema = wishlistSchema.omit({ 
  id: true,
});

export const updateWishlistSchema = z.object({
  name: z.string().min(1, "Wishlist name is required").max(100, "Wishlist name too long").optional(),
  isDefault: z.boolean().optional(),
});

// Wishlist item validation schemas
export const wishlistItemSchema = z.object({
  id: z.string().min(1, "Wishlist item ID is required"),
  wishlistId: z.string().min(1, "Wishlist ID is required"),
  productId: z.string().min(1, "Product ID is required"),
  variantId: z.string().optional(),
  notes: z.string().max(500, "Notes too long").optional(),
});

export const createWishlistItemSchema = wishlistItemSchema.omit({ 
  id: true,
});

export const updateWishlistItemSchema = z.object({
  notes: z.string().max(500, "Notes too long").optional(),
});

// Add to wishlist validation
export const addToWishlistSchema = z.object({
  wishlistId: z.string().min(1, "Wishlist ID is required"),
  productId: z.string().min(1, "Product ID is required"),
  variantId: z.string().optional(),
  notes: z.string().max(500, "Notes too long").optional(),
});

// Move from wishlist to cart validation
export const moveToCartSchema = z.object({
  wishlistItemId: z.string().min(1, "Wishlist item ID is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(100, "Quantity too large").default(1),
  customizations: cartItemCustomizationsSchema,
});

// Bulk cart operations validation
export const bulkCartUpdateSchema = z.object({
  items: z.array(z.object({
    id: z.string().min(1, "Cart item ID is required"),
    quantity: z.number().int().min(1, "Quantity must be at least 1").max(100, "Quantity too large"),
  })).min(1, "At least one item is required"),
});

export const bulkCartRemoveSchema = z.object({
  itemIds: z.array(z.string().min(1, "Cart item ID is required")).min(1, "At least one item ID is required"),
});

// Cart summary validation (for display purposes)
export const cartSummarySchema = z.object({
  subtotal: z.number().min(0),
  tax: z.number().min(0),
  deliveryFee: z.number().min(0),
  total: z.number().min(0),
  itemCount: z.number().int().min(0),
});