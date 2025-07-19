import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { carts, cartItems, wishlists, wishlistItems } from "@/db/schema/cart";
import { Product, ProductVariant } from "./products";
import { User } from "./auth";

// Cart types
export type Cart = InferSelectModel<typeof carts>;
export type NewCart = InferInsertModel<typeof carts>;

// Cart item types
export type CartItem = InferSelectModel<typeof cartItems>;
export type NewCartItem = InferInsertModel<typeof cartItems>;

// Wishlist types
export type Wishlist = InferSelectModel<typeof wishlists>;
export type NewWishlist = InferInsertModel<typeof wishlists>;

// Wishlist item types
export type WishlistItem = InferSelectModel<typeof wishlistItems>;
export type NewWishlistItem = InferInsertModel<typeof wishlistItems>;

// Extended types with relationships
export type CartWithItems = Cart & {
  items?: CartItemWithDetails[];
  user?: User | null;
};

export type CartItemWithDetails = CartItem & {
  product?: Product;
  variant?: ProductVariant | null;
  cart?: Cart;
};

export type WishlistWithItems = Wishlist & {
  items?: WishlistItemWithDetails[];
  user?: User;
};

export type WishlistItemWithDetails = WishlistItem & {
  product?: Product;
  variant?: ProductVariant | null;
  wishlist?: Wishlist;
};

// Customization types for JSON fields
export type CartItemCustomizations = {
  customText?: string;
  decorations?: {
    color?: string;
    design?: string;
    message?: string;
  };
  specialInstructions?: string;
  giftWrap?: boolean;
  deliveryInstructions?: string;
  customOptions?: Record<string, unknown>;
};

// Cart summary types
export type CartSummary = {
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  itemCount: number;
};