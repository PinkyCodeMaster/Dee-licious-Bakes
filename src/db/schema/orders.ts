import { pgTable, text, timestamp, decimal, integer, jsonb, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth";
import { products, productVariants } from "./products";

// Orders table
export const orders = pgTable("orders", {
    id: text('id').primaryKey(),
    orderNumber: text('order_number').notNull().unique(),
    userId: text('user_id').references(() => user.id),
    status: text('status').notNull().default('pending'), // pending, confirmed, preparing, ready, delivered, cancelled
    totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
    subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
    taxAmount: decimal('tax_amount', { precision: 10, scale: 2 }).default('0'),
    deliveryFee: decimal('delivery_fee', { precision: 10, scale: 2 }).default('0'),
    specialInstructions: text('special_instructions'),
    deliveryDate: timestamp('delivery_date'),
    deliveryAddress: jsonb('delivery_address'),
    paymentStatus: text('payment_status').default('pending'), // pending, processing, completed, failed, refunded
    stripePaymentIntentId: text('stripe_payment_intent_id'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
}, (table) => ({
    orderNumberIdx: index('orders_order_number_idx').on(table.orderNumber),
    userIdIdx: index('orders_user_id_idx').on(table.userId),
    statusIdx: index('orders_status_idx').on(table.status),
    paymentStatusIdx: index('orders_payment_status_idx').on(table.paymentStatus),
    deliveryDateIdx: index('orders_delivery_date_idx').on(table.deliveryDate),
    createdAtIdx: index('orders_created_at_idx').on(table.createdAt),
}));

// Order items table
export const orderItems = pgTable("order_items", {
    id: text('id').primaryKey(),
    orderId: text('order_id').references(() => orders.id, { onDelete: 'cascade' }).notNull(),
    productId: text('product_id').references(() => products.id).notNull(),
    variantId: text('variant_id').references(() => productVariants.id),
    quantity: integer('quantity').notNull(),
    unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
    totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
    customizations: jsonb('customizations'), // Custom decorations, text, special instructions
    createdAt: timestamp('created_at').defaultNow()
}, (table) => ({
    orderIdIdx: index('order_items_order_id_idx').on(table.orderId),
    productIdIdx: index('order_items_product_id_idx').on(table.productId),
    variantIdIdx: index('order_items_variant_id_idx').on(table.variantId),
}));

// Order status history table
export const orderStatusHistory = pgTable("order_status_history", {
    id: text('id').primaryKey(),
    orderId: text('order_id').references(() => orders.id, { onDelete: 'cascade' }).notNull(),
    status: text('status').notNull(),
    notes: text('notes'),
    createdBy: text('created_by').references(() => user.id),
    createdAt: timestamp('created_at').defaultNow()
}, (table) => ({
    orderIdIdx: index('order_status_history_order_id_idx').on(table.orderId),
    statusIdx: index('order_status_history_status_idx').on(table.status),
    createdAtIdx: index('order_status_history_created_at_idx').on(table.createdAt),
    createdByIdx: index('order_status_history_created_by_idx').on(table.createdBy),
}));

// Define relationships
export const ordersRelations = relations(orders, ({ one, many }) => ({
    user: one(user, {
        fields: [orders.userId],
        references: [user.id],
    }),
    items: many(orderItems),
    statusHistory: many(orderStatusHistory),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
    order: one(orders, {
        fields: [orderItems.orderId],
        references: [orders.id],
    }),
    product: one(products, {
        fields: [orderItems.productId],
        references: [products.id],
    }),
    variant: one(productVariants, {
        fields: [orderItems.variantId],
        references: [productVariants.id],
    }),
}));

export const orderStatusHistoryRelations = relations(orderStatusHistory, ({ one }) => ({
    order: one(orders, {
        fields: [orderStatusHistory.orderId],
        references: [orders.id],
    }),
    createdByUser: one(user, {
        fields: [orderStatusHistory.createdBy],
        references: [user.id],
    }),
}));