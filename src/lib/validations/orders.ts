import { z } from "zod";

// Order status validation
export const orderStatusSchema = z.enum([
  'pending',
  'confirmed',
  'preparing',
  'ready',
  'delivered',
  'cancelled'
]);

// Payment status validation
export const paymentStatusSchema = z.enum([
  'pending',
  'processing',
  'completed',
  'failed',
  'refunded'
]);

// Delivery address validation
export const deliveryAddressSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50, "First name too long"),
  lastName: z.string().min(1, "Last name is required").max(50, "Last name too long"),
  company: z.string().max(100, "Company name too long").optional(),
  addressLine1: z.string().min(1, "Address line 1 is required").max(100, "Address line 1 too long"),
  addressLine2: z.string().max(100, "Address line 2 too long").optional(),
  city: z.string().min(1, "City is required").max(50, "City name too long"),
  state: z.string().min(1, "State is required").max(50, "State name too long"),
  postalCode: z.string().min(1, "Postal code is required").max(20, "Postal code too long"),
  country: z.string().min(1, "Country is required").max(50, "Country name too long"),
  phone: z.string().max(20, "Phone number too long").optional(),
  deliveryInstructions: z.string().max(500, "Delivery instructions too long").optional(),
});

// Order item customizations validation
export const orderItemCustomizationsSchema = z.object({
  customText: z.string().max(500, "Custom text too long").optional(),
  decorations: z.object({
    color: z.string().max(50, "Color too long").optional(),
    design: z.string().max(100, "Design too long").optional(),
    message: z.string().max(200, "Message too long").optional(),
    frosting: z.string().max(50, "Frosting type too long").optional(),
  }).optional(),
  specialInstructions: z.string().max(1000, "Special instructions too long").optional(),
  giftWrap: z.boolean().optional(),
  customOptions: z.record(z.string(), z.any()).optional(),
}).optional();

// Order validation schemas
export const orderSchema = z.object({
  id: z.string().min(1, "Order ID is required"),
  orderNumber: z.string().min(1, "Order number is required").max(50, "Order number too long"),
  userId: z.string().optional(),
  status: orderStatusSchema,
  totalAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid total amount format").transform(val => parseFloat(val)),
  subtotal: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid subtotal format").transform(val => parseFloat(val)),
  taxAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid tax amount format").transform(val => parseFloat(val)).optional().default(0),
  deliveryFee: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid delivery fee format").transform(val => parseFloat(val)).optional().default(0),
  specialInstructions: z.string().max(1000, "Special instructions too long").optional(),
  deliveryDate: z.date().optional(),
  deliveryAddress: deliveryAddressSchema.optional(),
  paymentStatus: paymentStatusSchema,
  stripePaymentIntentId: z.string().optional(),
});

export const createOrderSchema = orderSchema.omit({ 
  id: true,
  orderNumber: true, // Generated automatically
});

export const updateOrderSchema = z.object({
  status: orderStatusSchema.optional(),
  specialInstructions: z.string().max(1000, "Special instructions too long").optional(),
  deliveryDate: z.date().optional(),
  deliveryAddress: deliveryAddressSchema.optional(),
  paymentStatus: paymentStatusSchema.optional(),
  stripePaymentIntentId: z.string().optional(),
});

// Order item validation schemas
export const orderItemSchema = z.object({
  id: z.string().min(1, "Order item ID is required"),
  orderId: z.string().min(1, "Order ID is required"),
  productId: z.string().min(1, "Product ID is required"),
  variantId: z.string().optional(),
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(100, "Quantity too large"),
  unitPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid unit price format").transform(val => parseFloat(val)),
  totalPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid total price format").transform(val => parseFloat(val)),
  customizations: orderItemCustomizationsSchema,
});

export const createOrderItemSchema = orderItemSchema.omit({ 
  id: true,
});

export const updateOrderItemSchema = z.object({
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(100, "Quantity too large").optional(),
  customizations: orderItemCustomizationsSchema,
});

// Order status history validation
export const orderStatusHistorySchema = z.object({
  id: z.string().min(1, "Status history ID is required"),
  orderId: z.string().min(1, "Order ID is required"),
  status: orderStatusSchema,
  notes: z.string().max(1000, "Notes too long").optional(),
  createdBy: z.string().optional(),
});

export const createOrderStatusHistorySchema = orderStatusHistorySchema.omit({ 
  id: true,
});

// Checkout validation
export const checkoutSchema = z.object({
  cartId: z.string().min(1, "Cart ID is required"),
  deliveryAddress: deliveryAddressSchema,
  deliveryDate: z.date().min(new Date(), "Delivery date must be in the future").optional(),
  specialInstructions: z.string().max(1000, "Special instructions too long").optional(),
  paymentMethodId: z.string().min(1, "Payment method is required"),
});

// Order filtering validation
export const orderFilterSchema = z.object({
  status: z.array(orderStatusSchema).optional(),
  paymentStatus: z.array(paymentStatusSchema).optional(),
  userId: z.string().optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  minAmount: z.number().min(0).optional(),
  maxAmount: z.number().min(0).optional(),
  search: z.string().max(255).optional(),
}).refine(data => {
  if (data.dateFrom && data.dateTo) {
    return data.dateFrom <= data.dateTo;
  }
  return true;
}, {
  message: "From date must be before or equal to to date",
  path: ["dateFrom"],
}).refine(data => {
  if (data.minAmount && data.maxAmount) {
    return data.minAmount <= data.maxAmount;
  }
  return true;
}, {
  message: "Minimum amount must be less than or equal to maximum amount",
  path: ["minAmount"],
});

// Order sorting validation
export const orderSortSchema = z.enum([
  'created-desc',
  'created-asc',
  'total-desc',
  'total-asc',
  'status',
  'delivery-date'
]);

// Bulk order operations validation
export const bulkOrderUpdateSchema = z.object({
  orderIds: z.array(z.string().min(1)).min(1, "At least one order ID is required"),
  updates: z.object({
    status: orderStatusSchema.optional(),
    paymentStatus: paymentStatusSchema.optional(),
  }).refine(data => Object.keys(data).length > 0, {
    message: "At least one field must be updated",
  }),
});