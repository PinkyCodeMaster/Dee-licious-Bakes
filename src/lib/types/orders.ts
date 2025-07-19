import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { orders, orderItems, orderStatusHistory } from "@/db/schema/orders";
import { Product, ProductVariant } from "./products";
import { User } from "./auth";

// Order types
export type Order = InferSelectModel<typeof orders>;
export type NewOrder = InferInsertModel<typeof orders>;

// Order item types
export type OrderItem = InferSelectModel<typeof orderItems>;
export type NewOrderItem = InferInsertModel<typeof orderItems>;

// Order status history types
export type OrderStatusHistory = InferSelectModel<typeof orderStatusHistory>;
export type NewOrderStatusHistory = InferInsertModel<typeof orderStatusHistory>;

// Extended types with relationships
export type OrderWithDetails = Order & {
  items?: OrderItemWithDetails[];
  statusHistory?: OrderStatusHistoryWithUser[];
  user?: User | null;
};

export type OrderItemWithDetails = OrderItem & {
  product?: Product;
  variant?: ProductVariant | null;
  order?: Order;
};

export type OrderStatusHistoryWithUser = OrderStatusHistory & {
  order?: Order;
  createdByUser?: User | null;
};

// Order status enum
export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'delivered'
  | 'cancelled';

// Payment status enum
export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded';

// Delivery address type for JSON field
export type DeliveryAddress = {
  firstName: string;
  lastName: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  deliveryInstructions?: string;
};

// Order item customizations type for JSON field
export type OrderItemCustomizations = {
  customText?: string;
  decorations?: {
    color?: string;
    design?: string;
    message?: string;
    frosting?: string;
  };
  specialInstructions?: string;
  giftWrap?: boolean;
  customOptions?: Record<string, unknown>;
};

// Order filtering and sorting types
export type OrderSortOption = 
  | 'created-desc'
  | 'created-asc'
  | 'total-desc'
  | 'total-asc'
  | 'status'
  | 'delivery-date';

export type OrderFilterOptions = {
  status?: OrderStatus[];
  paymentStatus?: PaymentStatus[];
  userId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
};