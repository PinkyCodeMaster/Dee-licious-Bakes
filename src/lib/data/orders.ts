import { db } from '@/db';
import { orders, orderItems, orderStatusHistory, products, productVariants } from '@/db/schema';
import { eq, and, desc, asc, gte, lte, count, sum, sql, inArray } from 'drizzle-orm';
import type { OrderWithDetails, OrderStatus } from '@/lib/types';

/**
 * Order query utilities
 */
export class OrderQueryUtils {
  /**
   * Get order by ID with full details
   */
  static async getOrderById(orderId: string): Promise<OrderWithDetails | null> {
    const order = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!order.length) return null;

    // Get order items
    const items = await db
      .select({
        id: orderItems.id,
        orderId: orderItems.orderId,
        productId: orderItems.productId,
        variantId: orderItems.variantId,
        quantity: orderItems.quantity,
        unitPrice: orderItems.unitPrice,
        totalPrice: orderItems.totalPrice,
        customizations: orderItems.customizations,
        createdAt: orderItems.createdAt,
        // Product info
        productName: products.name,
        productSlug: products.slug,
        // Variant info
        variantName: productVariants.name,
        variantSku: productVariants.sku,
      })
      .from(orderItems)
      .leftJoin(products, eq(orderItems.productId, products.id))
      .leftJoin(productVariants, eq(orderItems.variantId, productVariants.id))
      .where(eq(orderItems.orderId, orderId))
      .orderBy(asc(orderItems.createdAt));

    // Get status history
    const statusHistory = await db
      .select()
      .from(orderStatusHistory)
      .where(eq(orderStatusHistory.orderId, orderId))
      .orderBy(desc(orderStatusHistory.createdAt));

    return {
      ...order[0],
      items,
      statusHistory,
    };
  }

  /**
   * Get orders for a user with pagination
   */
  static async getUserOrders(
    userId: string,
    options: {
      limit?: number;
      offset?: number;
      status?: OrderStatus[];
      dateFrom?: Date;
      dateTo?: Date;
    } = {}
  ) {
    const { limit = 20, offset = 0, status, dateFrom, dateTo } = options;

    // Apply filters
    const conditions = [eq(orders.userId, userId)];

    if (status && status.length > 0) {
      conditions.push(inArray(orders.status, status));
    }

    if (dateFrom) {
      conditions.push(gte(orders.createdAt, dateFrom));
    }

    if (dateTo) {
      conditions.push(lte(orders.createdAt, dateTo));
    }

    const query = db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        status: orders.status,
        totalAmount: orders.totalAmount,
        paymentStatus: orders.paymentStatus,
        deliveryDate: orders.deliveryDate,
        createdAt: orders.createdAt,
        updatedAt: orders.updatedAt,
        itemCount: count(orderItems.id),
      })
      .from(orders)
      .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
      .where(and(...conditions));

    const results = await query
      .groupBy(
        orders.id,
        orders.orderNumber,
        orders.status,
        orders.totalAmount,
        orders.paymentStatus,
        orders.deliveryDate,
        orders.createdAt,
        orders.updatedAt
      )
      .orderBy(desc(orders.createdAt))
      .limit(limit)
      .offset(offset);

    return results;
  }

  /**
   * Get order statistics for a user
   */
  static async getUserOrderStats(userId: string) {
    const stats = await db
      .select({
        totalOrders: count(orders.id),
        totalSpent: sum(orders.totalAmount),
        completedOrders: sql<number>`COUNT(CASE WHEN ${orders.status} = 'delivered' THEN 1 END)`,
        pendingOrders: sql<number>`COUNT(CASE WHEN ${orders.status} IN ('pending', 'confirmed', 'preparing') THEN 1 END)`,
      })
      .from(orders)
      .where(eq(orders.userId, userId));

    return stats[0] || {
      totalOrders: 0,
      totalSpent: 0,
      completedOrders: 0,
      pendingOrders: 0,
    };
  }

  /**
   * Get recent orders (admin view)
   */
  static async getRecentOrders(limit: number = 10) {
    return db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        userId: orders.userId,
        status: orders.status,
        totalAmount: orders.totalAmount,
        paymentStatus: orders.paymentStatus,
        deliveryDate: orders.deliveryDate,
        createdAt: orders.createdAt,
        itemCount: count(orderItems.id),
      })
      .from(orders)
      .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
      .groupBy(
        orders.id,
        orders.orderNumber,
        orders.userId,
        orders.status,
        orders.totalAmount,
        orders.paymentStatus,
        orders.deliveryDate,
        orders.createdAt
      )
      .orderBy(desc(orders.createdAt))
      .limit(limit);
  }

  /**
   * Get orders by status
   */
  static async getOrdersByStatus(
    status: OrderStatus,
    options: {
      limit?: number;
      offset?: number;
    } = {}
  ) {
    const { limit = 20, offset = 0 } = options;

    return db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        userId: orders.userId,
        status: orders.status,
        totalAmount: orders.totalAmount,
        paymentStatus: orders.paymentStatus,
        deliveryDate: orders.deliveryDate,
        specialInstructions: orders.specialInstructions,
        createdAt: orders.createdAt,
        updatedAt: orders.updatedAt,
        itemCount: count(orderItems.id),
      })
      .from(orders)
      .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
      .where(eq(orders.status, status))
      .groupBy(
        orders.id,
        orders.orderNumber,
        orders.userId,
        orders.status,
        orders.totalAmount,
        orders.paymentStatus,
        orders.deliveryDate,
        orders.specialInstructions,
        orders.createdAt,
        orders.updatedAt
      )
      .orderBy(asc(orders.deliveryDate), desc(orders.createdAt))
      .limit(limit)
      .offset(offset);
  }

  /**
   * Get orders for a specific delivery date
   */
  static async getOrdersByDeliveryDate(deliveryDate: Date) {
    return db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        userId: orders.userId,
        status: orders.status,
        totalAmount: orders.totalAmount,
        deliveryAddress: orders.deliveryAddress,
        specialInstructions: orders.specialInstructions,
        createdAt: orders.createdAt,
        itemCount: count(orderItems.id),
      })
      .from(orders)
      .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
      .where(eq(orders.deliveryDate, deliveryDate))
      .groupBy(
        orders.id,
        orders.orderNumber,
        orders.userId,
        orders.status,
        orders.totalAmount,
        orders.deliveryAddress,
        orders.specialInstructions,
        orders.createdAt
      )
      .orderBy(asc(orders.createdAt));
  }

  /**
   * Get order analytics/dashboard data
   */
  static async getOrderAnalytics(dateFrom?: Date, dateTo?: Date) {
    const conditions = [];
    
    if (dateFrom) {
      conditions.push(gte(orders.createdAt, dateFrom));
    }
    
    if (dateTo) {
      conditions.push(lte(orders.createdAt, dateTo));
    }

    const analytics = await db
      .select({
        totalOrders: count(orders.id),
        totalRevenue: sum(orders.totalAmount),
        averageOrderValue: sql<number>`AVG(${orders.totalAmount})`,
        pendingOrders: sql<number>`COUNT(CASE WHEN ${orders.status} = 'pending' THEN 1 END)`,
        confirmedOrders: sql<number>`COUNT(CASE WHEN ${orders.status} = 'confirmed' THEN 1 END)`,
        preparingOrders: sql<number>`COUNT(CASE WHEN ${orders.status} = 'preparing' THEN 1 END)`,
        readyOrders: sql<number>`COUNT(CASE WHEN ${orders.status} = 'ready' THEN 1 END)`,
        deliveredOrders: sql<number>`COUNT(CASE WHEN ${orders.status} = 'delivered' THEN 1 END)`,
        cancelledOrders: sql<number>`COUNT(CASE WHEN ${orders.status} = 'cancelled' THEN 1 END)`,
        completedPayments: sql<number>`COUNT(CASE WHEN ${orders.paymentStatus} = 'completed' THEN 1 END)`,
        pendingPayments: sql<number>`COUNT(CASE WHEN ${orders.paymentStatus} = 'pending' THEN 1 END)`,
      })
      .from(orders)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    return analytics[0] || {
      totalOrders: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
      pendingOrders: 0,
      confirmedOrders: 0,
      preparingOrders: 0,
      readyOrders: 0,
      deliveredOrders: 0,
      cancelledOrders: 0,
      completedPayments: 0,
      pendingPayments: 0,
    };
  }

  /**
   * Get popular products from orders
   */
  static async getPopularProducts(limit: number = 10, dateFrom?: Date, dateTo?: Date) {
    const conditions = [];
    
    if (dateFrom) {
      conditions.push(gte(orders.createdAt, dateFrom));
    }
    
    if (dateTo) {
      conditions.push(lte(orders.createdAt, dateTo));
    }

    return db
      .select({
        productId: orderItems.productId,
        productName: products.name,
        productSlug: products.slug,
        totalQuantity: sum(orderItems.quantity),
        totalRevenue: sum(orderItems.totalPrice),
        orderCount: count(sql`DISTINCT ${orders.id}`),
      })
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .groupBy(orderItems.productId, products.name, products.slug)
      .orderBy(desc(sum(orderItems.quantity)))
      .limit(limit);
  }
}

// Convenience functions
export const orderQueries = {
  getById: OrderQueryUtils.getOrderById,
  getUserOrders: OrderQueryUtils.getUserOrders,
  getUserStats: OrderQueryUtils.getUserOrderStats,
  getRecent: OrderQueryUtils.getRecentOrders,
  getByStatus: OrderQueryUtils.getOrdersByStatus,
  getByDeliveryDate: OrderQueryUtils.getOrdersByDeliveryDate,
  getAnalytics: OrderQueryUtils.getOrderAnalytics,
  getPopularProducts: OrderQueryUtils.getPopularProducts,
};