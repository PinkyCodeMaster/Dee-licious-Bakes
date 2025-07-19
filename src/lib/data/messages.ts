import { db } from '@/db';
import { messageThreads, messages, customRequests } from '@/db/schema';
import { eq, and, desc, asc, count, sql, inArray, isNull, isNotNull } from 'drizzle-orm';
import type { 
  MessageThreadWithDetails, 
  CustomRequestWithDetails,
  MessageThreadStatus,
  MessageThreadPriority,
  CustomRequestStatus 
} from '@/lib/types';

/**
 * Message and custom request query utilities
 */
export class MessageQueryUtils {
  /**
   * Get message thread by ID with messages
   */
  static async getThreadById(threadId: string): Promise<MessageThreadWithDetails | null> {
    const thread = await db
      .select()
      .from(messageThreads)
      .where(eq(messageThreads.id, threadId))
      .limit(1);

    if (!thread.length) return null;

    const threadMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.threadId, threadId))
      .orderBy(asc(messages.createdAt));

    // Get unread count
    const unreadCount = await db
      .select({ count: count() })
      .from(messages)
      .where(and(
        eq(messages.threadId, threadId),
        eq(messages.isRead, false)
      ));

    return {
      ...thread[0],
      messages: threadMessages,
      unreadCount: unreadCount[0]?.count || 0,
    };
  }

  /**
   * Get message threads for a user
   */
  static async getUserThreads(
    userId: string,
    options: {
      limit?: number;
      offset?: number;
      status?: MessageThreadStatus[];
      priority?: MessageThreadPriority[];
      unreadOnly?: boolean;
    } = {}
  ) {
    const { limit = 20, offset = 0, status, priority, unreadOnly } = options;

    const conditions = [eq(messageThreads.userId, userId)];

    if (status && status.length > 0) {
      conditions.push(inArray(messageThreads.status, status));
    }

    if (priority && priority.length > 0) {
      conditions.push(inArray(messageThreads.priority, priority));
    }

    const query = db
      .select({
        id: messageThreads.id,
        userId: messageThreads.userId,
        subject: messageThreads.subject,
        status: messageThreads.status,
        priority: messageThreads.priority,
        orderId: messageThreads.orderId,
        createdAt: messageThreads.createdAt,
        updatedAt: messageThreads.updatedAt,
        messageCount: count(messages.id),
        unreadCount: sql<number>`COUNT(CASE WHEN ${messages.isRead} = false THEN 1 END)`,
        lastMessageAt: sql<Date>`MAX(${messages.createdAt})`,
      })
      .from(messageThreads)
      .leftJoin(messages, eq(messageThreads.id, messages.threadId))
      .where(and(...conditions))
      .groupBy(
        messageThreads.id,
        messageThreads.userId,
        messageThreads.subject,
        messageThreads.status,
        messageThreads.priority,
        messageThreads.orderId,
        messageThreads.createdAt,
        messageThreads.updatedAt
      );

    const results = await query
      .orderBy(desc(sql`MAX(${messages.createdAt})`), desc(messageThreads.updatedAt))
      .limit(limit)
      .offset(offset);

    // Filter for unread only if requested
    if (unreadOnly) {
      return results.filter(thread => thread.unreadCount > 0);
    }

    return results;
  }

  /**
   * Get all message threads (admin view)
   */
  static async getAllThreads(
    options: {
      limit?: number;
      offset?: number;
      status?: MessageThreadStatus[];
      priority?: MessageThreadPriority[];
      search?: string;
    } = {}
  ) {
    const { limit = 20, offset = 0, status, priority, search } = options;

    const conditions = [];

    if (status && status.length > 0) {
      conditions.push(inArray(messageThreads.status, status));
    }

    if (priority && priority.length > 0) {
      conditions.push(inArray(messageThreads.priority, priority));
    }

    if (search) {
      conditions.push(
        sql`${messageThreads.subject} ILIKE ${`%${search}%`} OR EXISTS (
          SELECT 1 FROM ${messages} 
          WHERE ${messages.threadId} = ${messageThreads.id} 
          AND ${messages.content} ILIKE ${`%${search}%`}
        )`
      );
    }

    const results = await db
      .select({
        id: messageThreads.id,
        userId: messageThreads.userId,
        subject: messageThreads.subject,
        status: messageThreads.status,
        priority: messageThreads.priority,
        orderId: messageThreads.orderId,
        createdAt: messageThreads.createdAt,
        updatedAt: messageThreads.updatedAt,
        messageCount: count(messages.id),
        unreadCount: sql<number>`COUNT(CASE WHEN ${messages.isRead} = false THEN 1 END)`,
        lastMessageAt: sql<Date>`MAX(${messages.createdAt})`,
      })
      .from(messageThreads)
      .leftJoin(messages, eq(messageThreads.id, messages.threadId))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .groupBy(
        messageThreads.id,
        messageThreads.userId,
        messageThreads.subject,
        messageThreads.status,
        messageThreads.priority,
        messageThreads.orderId,
        messageThreads.createdAt,
        messageThreads.updatedAt
      )
      .orderBy(desc(sql`MAX(${messages.createdAt})`), desc(messageThreads.updatedAt))
      .limit(limit)
      .offset(offset);

    return results;
  }

  /**
   * Get custom request by ID
   */
  static async getCustomRequestById(requestId: string): Promise<CustomRequestWithDetails | null> {
    const request = await db
      .select()
      .from(customRequests)
      .where(eq(customRequests.id, requestId))
      .limit(1);

    return request[0] || null;
  }

  /**
   * Get custom requests for a user
   */
  static async getUserCustomRequests(
    userId: string,
    options: {
      limit?: number;
      offset?: number;
      status?: CustomRequestStatus[];
    } = {}
  ) {
    const { limit = 20, offset = 0, status } = options;

    const conditions = [eq(customRequests.userId, userId)];

    if (status && status.length > 0) {
      conditions.push(inArray(customRequests.status, status));
    }

    return db
      .select()
      .from(customRequests)
      .where(and(...conditions))
      .orderBy(desc(customRequests.createdAt))
      .limit(limit)
      .offset(offset);
  }

  /**
   * Get all custom requests (admin view)
   */
  static async getAllCustomRequests(
    options: {
      limit?: number;
      offset?: number;
      status?: CustomRequestStatus[];
      hasQuote?: boolean;
      search?: string;
    } = {}
  ) {
    const { limit = 20, offset = 0, status, hasQuote, search } = options;

    const conditions = [];

    if (status && status.length > 0) {
      conditions.push(inArray(customRequests.status, status));
    }

    if (hasQuote !== undefined) {
      if (hasQuote) {
        conditions.push(isNotNull(customRequests.quotedPrice));
      } else {
        conditions.push(isNull(customRequests.quotedPrice));
      }
    }

    if (search) {
      conditions.push(
        sql`${customRequests.title} ILIKE ${`%${search}%`} OR ${customRequests.description} ILIKE ${`%${search}%`}`
      );
    }

    return db
      .select()
      .from(customRequests)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(customRequests.createdAt))
      .limit(limit)
      .offset(offset);
  }

  /**
   * Get message statistics
   */
  static async getMessageStats() {
    const stats = await db
      .select({
        totalThreads: count(messageThreads.id),
        openThreads: sql<number>`COUNT(CASE WHEN ${messageThreads.status} = 'open' THEN 1 END)`,
        closedThreads: sql<number>`COUNT(CASE WHEN ${messageThreads.status} = 'closed' THEN 1 END)`,
        pendingThreads: sql<number>`COUNT(CASE WHEN ${messageThreads.status} = 'pending' THEN 1 END)`,
        highPriorityThreads: sql<number>`COUNT(CASE WHEN ${messageThreads.priority} = 'high' THEN 1 END)`,
        urgentThreads: sql<number>`COUNT(CASE WHEN ${messageThreads.priority} = 'urgent' THEN 1 END)`,
      })
      .from(messageThreads);

    const messageStats = await db
      .select({
        totalMessages: count(messages.id),
        unreadMessages: sql<number>`COUNT(CASE WHEN ${messages.isRead} = false THEN 1 END)`,
        customerMessages: sql<number>`COUNT(CASE WHEN ${messages.isFromCustomer} = true THEN 1 END)`,
        adminMessages: sql<number>`COUNT(CASE WHEN ${messages.isFromCustomer} = false THEN 1 END)`,
      })
      .from(messages);

    const customRequestStats = await db
      .select({
        totalRequests: count(customRequests.id),
        pendingRequests: sql<number>`COUNT(CASE WHEN ${customRequests.status} = 'pending' THEN 1 END)`,
        reviewingRequests: sql<number>`COUNT(CASE WHEN ${customRequests.status} = 'reviewing' THEN 1 END)`,
        quotedRequests: sql<number>`COUNT(CASE WHEN ${customRequests.status} = 'quoted' THEN 1 END)`,
        approvedRequests: sql<number>`COUNT(CASE WHEN ${customRequests.status} = 'approved' THEN 1 END)`,
        completedRequests: sql<number>`COUNT(CASE WHEN ${customRequests.status} = 'completed' THEN 1 END)`,
      })
      .from(customRequests);

    return {
      threads: stats[0] || {},
      messages: messageStats[0] || {},
      customRequests: customRequestStats[0] || {},
    };
  }

  /**
   * Get unread message count for user
   */
  static async getUnreadCount(userId: string): Promise<number> {
    const result = await db
      .select({ count: count() })
      .from(messages)
      .innerJoin(messageThreads, eq(messages.threadId, messageThreads.id))
      .where(and(
        eq(messageThreads.userId, userId),
        eq(messages.isRead, false),
        eq(messages.isFromCustomer, false) // Only count admin messages as unread for customer
      ));

    return result[0]?.count || 0;
  }

  /**
   * Get recent activity (messages and custom requests)
   */
  static async getRecentActivity(limit: number = 10) {
    // Get recent messages
    const recentMessages = await db
      .select({
        type: sql<string>`'message'`,
        id: messages.id,
        threadId: messages.threadId,
        subject: messageThreads.subject,
        content: messages.content,
        isFromCustomer: messages.isFromCustomer,
        createdAt: messages.createdAt,
      })
      .from(messages)
      .innerJoin(messageThreads, eq(messages.threadId, messageThreads.id))
      .orderBy(desc(messages.createdAt))
      .limit(limit);

    // Get recent custom requests
    const recentRequests = await db
      .select({
        type: sql<string>`'custom_request'`,
        id: customRequests.id,
        title: customRequests.title,
        status: customRequests.status,
        requestType: customRequests.requestType,
        createdAt: customRequests.createdAt,
      })
      .from(customRequests)
      .orderBy(desc(customRequests.createdAt))
      .limit(limit);

    // Combine and sort by date
    const combined = [
      ...recentMessages.map(m => ({ ...m, activityType: 'message' as const })),
      ...recentRequests.map(r => ({ ...r, activityType: 'custom_request' as const }))
    ].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    return combined.slice(0, limit);
  }
}

// Convenience functions
export const messageQueries = {
  getThreadById: MessageQueryUtils.getThreadById,
  getUserThreads: MessageQueryUtils.getUserThreads,
  getAllThreads: MessageQueryUtils.getAllThreads,
  getCustomRequestById: MessageQueryUtils.getCustomRequestById,
  getUserCustomRequests: MessageQueryUtils.getUserCustomRequests,
  getAllCustomRequests: MessageQueryUtils.getAllCustomRequests,
  getStats: MessageQueryUtils.getMessageStats,
  getUnreadCount: MessageQueryUtils.getUnreadCount,
  getRecentActivity: MessageQueryUtils.getRecentActivity,
};