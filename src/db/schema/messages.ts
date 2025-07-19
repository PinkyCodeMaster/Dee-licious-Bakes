import { pgTable, text, timestamp, boolean, decimal, jsonb, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth";
import { orders } from "./orders";

// Message threads table
export const messageThreads = pgTable("message_threads", {
    id: text('id').primaryKey(),
    userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
    subject: text('subject').notNull(),
    status: text('status').default('open'), // open, closed, pending
    priority: text('priority').default('normal'), // low, normal, high, urgent
    orderId: text('order_id').references(() => orders.id), // Optional order reference
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
}, (table) => ({
    userIdIdx: index('message_threads_user_id_idx').on(table.userId),
    statusIdx: index('message_threads_status_idx').on(table.status),
    priorityIdx: index('message_threads_priority_idx').on(table.priority),
    orderIdIdx: index('message_threads_order_id_idx').on(table.orderId),
    createdAtIdx: index('message_threads_created_at_idx').on(table.createdAt),
    updatedAtIdx: index('message_threads_updated_at_idx').on(table.updatedAt),
}));

// Individual messages table
export const messages = pgTable("messages", {
    id: text('id').primaryKey(),
    threadId: text('thread_id').references(() => messageThreads.id, { onDelete: 'cascade' }).notNull(),
    senderId: text('sender_id').references(() => user.id),
    content: text('content').notNull(),
    isFromCustomer: boolean('is_from_customer').notNull(),
    isRead: boolean('is_read').default(false),
    attachments: jsonb('attachments'), // File attachments with URLs and metadata
    createdAt: timestamp('created_at').defaultNow()
}, (table) => ({
    threadIdIdx: index('messages_thread_id_idx').on(table.threadId),
    senderIdIdx: index('messages_sender_id_idx').on(table.senderId),
    isFromCustomerIdx: index('messages_is_from_customer_idx').on(table.isFromCustomer),
    isReadIdx: index('messages_is_read_idx').on(table.isRead),
    createdAtIdx: index('messages_created_at_idx').on(table.createdAt),
}));

// Custom product requests table (for special orders not in catalog)
export const customRequests = pgTable("custom_requests", {
    id: text('id').primaryKey(),
    userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }).notNull(),
    requestType: text('request_type').notNull(), // 'custom_cake', 'custom_cookies', 'special_flavor', etc.
    title: text('title').notNull(),
    description: text('description').notNull(),
    specifications: jsonb('specifications'), // Size, flavor, design details, etc.
    referenceImages: jsonb('reference_images'), // URLs to inspiration images
    budgetRange: text('budget_range'), // e.g., "$50-100", "Under $75"
    eventDate: timestamp('event_date'),
    status: text('status').default('pending'), // pending, reviewing, quoted, approved, declined, completed
    adminNotes: text('admin_notes'),
    quotedPrice: decimal('quoted_price', { precision: 10, scale: 2 }),
    orderId: text('order_id').references(() => orders.id), // If converted to actual order
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
}, (table) => ({
    userIdIdx: index('custom_requests_user_id_idx').on(table.userId),
    requestTypeIdx: index('custom_requests_request_type_idx').on(table.requestType),
    statusIdx: index('custom_requests_status_idx').on(table.status),
    eventDateIdx: index('custom_requests_event_date_idx').on(table.eventDate),
    orderIdIdx: index('custom_requests_order_id_idx').on(table.orderId),
    createdAtIdx: index('custom_requests_created_at_idx').on(table.createdAt),
    updatedAtIdx: index('custom_requests_updated_at_idx').on(table.updatedAt),
}));

// Define relationships
export const messageThreadsRelations = relations(messageThreads, ({ one, many }) => ({
    user: one(user, {
        fields: [messageThreads.userId],
        references: [user.id],
    }),
    order: one(orders, {
        fields: [messageThreads.orderId],
        references: [orders.id],
    }),
    messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
    thread: one(messageThreads, {
        fields: [messages.threadId],
        references: [messageThreads.id],
    }),
    sender: one(user, {
        fields: [messages.senderId],
        references: [user.id],
    }),
}));

export const customRequestsRelations = relations(customRequests, ({ one }) => ({
    user: one(user, {
        fields: [customRequests.userId],
        references: [user.id],
    }),
    order: one(orders, {
        fields: [customRequests.orderId],
        references: [orders.id],
    }),
}));