import { z } from "zod";

// Message thread status validation
export const messageThreadStatusSchema = z.enum([
  'open',
  'closed',
  'pending'
]);

// Message thread priority validation
export const messageThreadPrioritySchema = z.enum([
  'low',
  'normal',
  'high',
  'urgent'
]);

// Custom request status validation
export const customRequestStatusSchema = z.enum([
  'pending',
  'reviewing',
  'quoted',
  'approved',
  'declined',
  'completed'
]);

// Custom request type validation
export const customRequestTypeSchema = z.enum([
  'custom_cake',
  'custom_cookies',
  'special_flavor',
  'custom_decoration',
  'bulk_order',
  'other'
]);

// Message attachments validation
export const messageAttachmentsSchema = z.object({
  files: z.array(z.object({
    url: z.string().url("Invalid file URL"),
    name: z.string().min(1, "File name is required").max(255, "File name too long"),
    size: z.number().int().min(1, "File size must be positive"),
    type: z.string().min(1, "File type is required").max(100, "File type too long"),
  })).optional(),
  images: z.array(z.object({
    url: z.string().url("Invalid image URL"),
    alt: z.string().max(255, "Alt text too long").optional(),
    width: z.number().int().positive().optional(),
    height: z.number().int().positive().optional(),
  })).optional(),
}).optional();

// Custom request specifications validation
export const customRequestSpecificationsSchema = z.object({
  size: z.string().max(100, "Size description too long").optional(),
  servings: z.number().int().min(1, "Servings must be at least 1").max(1000, "Servings too large").optional(),
  flavors: z.array(z.string().max(100, "Flavor name too long")).optional(),
  decorations: z.object({
    theme: z.string().max(100, "Theme too long").optional(),
    colors: z.array(z.string().max(50, "Color name too long")).optional(),
    text: z.string().max(200, "Decoration text too long").optional(),
    design: z.string().max(500, "Design description too long").optional(),
  }).optional(),
  dietary: z.object({
    glutenFree: z.boolean().optional(),
    vegan: z.boolean().optional(),
    sugarFree: z.boolean().optional(),
    nutFree: z.boolean().optional(),
    dairyFree: z.boolean().optional(),
  }).optional(),
  delivery: z.object({
    date: z.string().optional(),
    time: z.string().optional(),
    location: z.string().max(200, "Location too long").optional(),
  }).optional(),
  customOptions: z.record(z.string(), z.any()).optional(),
}).optional();

// Custom request reference images validation
export const customRequestReferenceImagesSchema = z.object({
  images: z.array(z.object({
    url: z.string().url("Invalid image URL"),
    description: z.string().max(500, "Image description too long").optional(),
    source: z.string().max(200, "Image source too long").optional(),
  })).optional(),
}).optional();

// Message thread validation schemas
export const messageThreadSchema = z.object({
  id: z.string().min(1, "Message thread ID is required"),
  userId: z.string().optional(),
  subject: z.string().min(1, "Subject is required").max(200, "Subject too long"),
  status: messageThreadStatusSchema,
  priority: messageThreadPrioritySchema,
  orderId: z.string().optional(),
});

export const createMessageThreadSchema = messageThreadSchema.omit({ 
  id: true,
});

export const updateMessageThreadSchema = z.object({
  subject: z.string().min(1, "Subject is required").max(200, "Subject too long").optional(),
  status: messageThreadStatusSchema.optional(),
  priority: messageThreadPrioritySchema.optional(),
});

// Message validation schemas
export const messageSchema = z.object({
  id: z.string().min(1, "Message ID is required"),
  threadId: z.string().min(1, "Thread ID is required"),
  senderId: z.string().optional(),
  content: z.string().min(1, "Message content is required").max(5000, "Message content too long"),
  isFromCustomer: z.boolean(),
  isRead: z.boolean().default(false),
  attachments: messageAttachmentsSchema,
});

export const createMessageSchema = messageSchema.omit({ 
  id: true,
  isRead: true, // Set automatically
});

export const updateMessageSchema = z.object({
  content: z.string().min(1, "Message content is required").max(5000, "Message content too long").optional(),
  isRead: z.boolean().optional(),
});

// Custom request validation schemas
export const customRequestSchema = z.object({
  id: z.string().min(1, "Custom request ID is required"),
  userId: z.string().min(1, "User ID is required"),
  requestType: customRequestTypeSchema,
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().min(1, "Description is required").max(2000, "Description too long"),
  specifications: customRequestSpecificationsSchema,
  referenceImages: customRequestReferenceImagesSchema,
  budgetRange: z.string().max(50, "Budget range too long").optional(),
  eventDate: z.date().min(new Date(), "Event date must be in the future").optional(),
  status: customRequestStatusSchema,
  adminNotes: z.string().max(1000, "Admin notes too long").optional(),
  quotedPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid quoted price format").transform(val => parseFloat(val)).optional(),
  orderId: z.string().optional(),
});

export const createCustomRequestSchema = customRequestSchema.omit({ 
  id: true,
  status: true, // Set to 'pending' automatically
  adminNotes: true,
  quotedPrice: true,
  orderId: true,
});

export const updateCustomRequestSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long").optional(),
  description: z.string().min(1, "Description is required").max(2000, "Description too long").optional(),
  specifications: customRequestSpecificationsSchema,
  referenceImages: customRequestReferenceImagesSchema,
  budgetRange: z.string().max(50, "Budget range too long").optional(),
  eventDate: z.date().min(new Date(), "Event date must be in the future").optional(),
});

// Admin update custom request schema
export const adminUpdateCustomRequestSchema = z.object({
  status: customRequestStatusSchema.optional(),
  adminNotes: z.string().max(1000, "Admin notes too long").optional(),
  quotedPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid quoted price format").transform(val => parseFloat(val)).optional(),
  orderId: z.string().optional(),
});

// Message thread filtering validation
export const messageThreadFilterSchema = z.object({
  status: z.array(messageThreadStatusSchema).optional(),
  priority: z.array(messageThreadPrioritySchema).optional(),
  userId: z.string().optional(),
  hasOrder: z.boolean().optional(),
  unreadOnly: z.boolean().optional(),
  search: z.string().max(255).optional(),
});

// Message thread sorting validation
export const messageThreadSortSchema = z.enum([
  'updated-desc',
  'updated-asc',
  'created-desc',
  'created-asc',
  'priority',
  'status'
]);

// Custom request filtering validation
export const customRequestFilterSchema = z.object({
  status: z.array(customRequestStatusSchema).optional(),
  requestType: z.array(customRequestTypeSchema).optional(),
  userId: z.string().optional(),
  hasQuote: z.boolean().optional(),
  eventDateFrom: z.date().optional(),
  eventDateTo: z.date().optional(),
  search: z.string().max(255).optional(),
}).refine(data => {
  if (data.eventDateFrom && data.eventDateTo) {
    return data.eventDateFrom <= data.eventDateTo;
  }
  return true;
}, {
  message: "From date must be before or equal to to date",
  path: ["eventDateFrom"],
});

// Custom request sorting validation
export const customRequestSortSchema = z.enum([
  'created-desc',
  'created-asc',
  'updated-desc',
  'updated-asc',
  'event-date',
  'status'
]);

// Bulk message operations validation
export const bulkMessageUpdateSchema = z.object({
  messageIds: z.array(z.string().min(1)).min(1, "At least one message ID is required"),
  updates: z.object({
    isRead: z.boolean().optional(),
  }).refine(data => Object.keys(data).length > 0, {
    message: "At least one field must be updated",
  }),
});

export const bulkThreadUpdateSchema = z.object({
  threadIds: z.array(z.string().min(1)).min(1, "At least one thread ID is required"),
  updates: z.object({
    status: messageThreadStatusSchema.optional(),
    priority: messageThreadPrioritySchema.optional(),
  }).refine(data => Object.keys(data).length > 0, {
    message: "At least one field must be updated",
  }),
});