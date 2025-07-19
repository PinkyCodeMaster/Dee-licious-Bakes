import { pgTable, text, timestamp, integer, decimal, jsonb, boolean, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth";
import { products, productVariants } from "./products";

// Shopping cart table
export const carts = pgTable("carts", {
    id: text('id').primaryKey(),
    userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
    sessionId: text('session_id'), // For anonymous users
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
}, (table) => ({
    userIdIdx: index('carts_user_id_idx').on(table.userId),
    sessionIdIdx: index('carts_session_id_idx').on(table.sessionId),
}));

// Cart items table
export const cartItems = pgTable("cart_items", {
    id: text('id').primaryKey(),
    cartId: text('cart_id').references(() => carts.id, { onDelete: 'cascade' }).notNull(),
    productId: text('product_id').references(() => products.id).notNull(),
    variantId: text('variant_id').references(() => productVariants.id),
    quantity: integer('quantity').notNull().default(1),
    customizations: jsonb('customizations'), // Custom text, decorations, etc.
    unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
}, (table) => ({
    cartIdIdx: index('cart_items_cart_id_idx').on(table.cartId),
    productIdIdx: index('cart_items_product_id_idx').on(table.productId),
    variantIdIdx: index('cart_items_variant_id_idx').on(table.variantId),
}));

// Wishlist table
export const wishlists = pgTable("wishlists", {
    id: text('id').primaryKey(),
    userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }).notNull(),
    name: text('name').default('My Wishlist'),
    isDefault: boolean('is_default').default(true),
    createdAt: timestamp('created_at').defaultNow()
}, (table) => ({
    userIdIdx: index('wishlists_user_id_idx').on(table.userId),
    defaultIdx: index('wishlists_default_idx').on(table.isDefault),
}));

// Wishlist items table
export const wishlistItems = pgTable("wishlist_items", {
    id: text('id').primaryKey(),
    wishlistId: text('wishlist_id').references(() => wishlists.id, { onDelete: 'cascade' }).notNull(),
    productId: text('product_id').references(() => products.id).notNull(),
    variantId: text('variant_id').references(() => productVariants.id),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow()
}, (table) => ({
    wishlistIdIdx: index('wishlist_items_wishlist_id_idx').on(table.wishlistId),
    productIdIdx: index('wishlist_items_product_id_idx').on(table.productId),
    variantIdIdx: index('wishlist_items_variant_id_idx').on(table.variantId),
}));

// Define relationships
export const cartsRelations = relations(carts, ({ one, many }) => ({
    user: one(user, {
        fields: [carts.userId],
        references: [user.id],
    }),
    items: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
    cart: one(carts, {
        fields: [cartItems.cartId],
        references: [carts.id],
    }),
    product: one(products, {
        fields: [cartItems.productId],
        references: [products.id],
    }),
    variant: one(productVariants, {
        fields: [cartItems.variantId],
        references: [productVariants.id],
    }),
}));

export const wishlistsRelations = relations(wishlists, ({ one, many }) => ({
    user: one(user, {
        fields: [wishlists.userId],
        references: [user.id],
    }),
    items: many(wishlistItems),
}));

export const wishlistItemsRelations = relations(wishlistItems, ({ one }) => ({
    wishlist: one(wishlists, {
        fields: [wishlistItems.wishlistId],
        references: [wishlists.id],
    }),
    product: one(products, {
        fields: [wishlistItems.productId],
        references: [products.id],
    }),
    variant: one(productVariants, {
        fields: [wishlistItems.variantId],
        references: [productVariants.id],
    }),
}));