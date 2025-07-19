import { z } from "zod";

// Category validation schemas
export const categorySchema = z.object({
  id: z.string().min(1, "Category ID is required"),
  name: z.string().min(1, "Category name is required").max(255, "Category name too long"),
  slug: z.string().min(1, "Category slug is required").max(255, "Category slug too long")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  description: z.string().max(1000, "Description too long").optional(),
  parentId: z.string().optional(),
  sortOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const createCategorySchema = categorySchema.omit({ 
  id: true,
});

export const updateCategorySchema = categorySchema.partial().omit({ 
  id: true,
});

// Product validation schemas
export const productSchema = z.object({
  id: z.string().min(1, "Product ID is required"),
  name: z.string().min(1, "Product name is required").max(255, "Product name too long"),
  slug: z.string().min(1, "Product slug is required").max(255, "Product slug too long")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  description: z.string().max(5000, "Description too long").optional(),
  shortDescription: z.string().max(500, "Short description too long").optional(),
  categoryId: z.string().optional(),
  basePrice: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format").transform(val => parseFloat(val)),
  isActive: z.boolean().default(true),
  stockQuantity: z.number().int().min(0).default(0),
  minSlices: z.number().int().min(1).optional(),
  maxSlices: z.number().int().min(1).optional(),
  servingSize: z.string().max(100, "Serving size too long").optional(),
  preparationTime: z.string().max(100, "Preparation time too long").optional(),
}).refine(data => {
  if (data.minSlices && data.maxSlices) {
    return data.minSlices <= data.maxSlices;
  }
  return true;
}, {
  message: "Minimum slices must be less than or equal to maximum slices",
  path: ["minSlices"],
});

export const createProductSchema = productSchema.omit({ 
  id: true,
});

export const updateProductSchema = productSchema.partial().omit({ 
  id: true,
});

// Product variant validation schemas
export const variantAttributesSchema = z.object({
  weight: z.string().optional(),
  dimensions: z.object({
    length: z.number().positive().optional(),
    width: z.number().positive().optional(),
    height: z.number().positive().optional(),
  }).optional(),
  nutritionalInfo: z.object({
    calories: z.number().min(0).optional(),
    protein: z.number().min(0).optional(),
    carbs: z.number().min(0).optional(),
    fat: z.number().min(0).optional(),
    sugar: z.number().min(0).optional(),
  }).optional(),
  ingredients: z.array(z.string()).optional(),
  customOptions: z.record(z.string(), z.any()).optional(),
}).optional();

export const productVariantSchema = z.object({
  id: z.string().min(1, "Variant ID is required"),
  productId: z.string().min(1, "Product ID is required"),
  name: z.string().min(1, "Variant name is required").max(255, "Variant name too long"),
  sku: z.string().max(100, "SKU too long").optional(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format").transform(val => parseFloat(val)),
  stockQuantity: z.number().int().min(0).default(0),
  isDefault: z.boolean().default(false),
  flavor: z.string().max(100, "Flavor too long").optional(),
  size: z.string().max(100, "Size too long").optional(),
  type: z.string().max(100, "Type too long").optional(),
  attributes: variantAttributesSchema,
  description: z.string().max(1000, "Description too long").optional(),
  isAvailable: z.boolean().default(true),
});

export const createProductVariantSchema = productVariantSchema.omit({ 
  id: true,
});

export const updateProductVariantSchema = productVariantSchema.partial().omit({ 
  id: true,
});

// Product image validation schemas
export const productImageSchema = z.object({
  id: z.string().min(1, "Image ID is required"),
  productId: z.string().min(1, "Product ID is required"),
  url: z.string().url("Invalid image URL"),
  altText: z.string().max(255, "Alt text too long").optional(),
  sortOrder: z.number().int().min(0).default(0),
  isMain: z.boolean().default(false),
});

export const createProductImageSchema = productImageSchema.omit({ 
  id: true,
});

export const updateProductImageSchema = productImageSchema.partial().omit({ 
  id: true,
});

// Tag validation schemas
export const tagSchema = z.object({
  id: z.string().min(1, "Tag ID is required"),
  name: z.string().min(1, "Tag name is required").max(100, "Tag name too long"),
  type: z.enum(['dietary', 'occasion', 'flavor', 'texture', 'style', 'other']),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format").optional(),
});

export const createTagSchema = tagSchema.omit({ 
  id: true,
});

export const updateTagSchema = tagSchema.partial().omit({ 
  id: true,
});

// Allergen validation schemas
export const allergenSchema = z.object({
  id: z.string().min(1, "Allergen ID is required"),
  name: z.string().min(1, "Allergen name is required").max(100, "Allergen name too long"),
  description: z.string().max(500, "Description too long").optional(),
  severity: z.enum(['mild', 'moderate', 'severe']).optional(),
});

export const createAllergenSchema = allergenSchema.omit({ 
  id: true,
});

export const updateAllergenSchema = allergenSchema.partial().omit({ 
  id: true,
});

// Product-tag relationship validation
export const productTagSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  tagId: z.string().min(1, "Tag ID is required"),
});

// Product-allergen relationship validation
export const productAllergenSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  allergenId: z.string().min(1, "Allergen ID is required"),
  containsAllergen: z.boolean(),
  mayContain: z.boolean().default(false),
});

// Product filtering validation
export const productFilterSchema = z.object({
  categoryId: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  tags: z.array(z.string()).optional(),
  allergens: z.array(z.string()).optional(),
  excludeAllergens: z.array(z.string()).optional(),
  minSlices: z.number().int().min(1).optional(),
  maxSlices: z.number().int().min(1).optional(),
  isActive: z.boolean().optional(),
  search: z.string().max(255).optional(),
}).refine(data => {
  if (data.minPrice && data.maxPrice) {
    return data.minPrice <= data.maxPrice;
  }
  return true;
}, {
  message: "Minimum price must be less than or equal to maximum price",
  path: ["minPrice"],
}).refine(data => {
  if (data.minSlices && data.maxSlices) {
    return data.minSlices <= data.maxSlices;
  }
  return true;
}, {
  message: "Minimum slices must be less than or equal to maximum slices",
  path: ["minSlices"],
});

// Product sorting validation
export const productSortSchema = z.enum([
  'name-asc',
  'name-desc',
  'price-asc',
  'price-desc',
  'created-asc',
  'created-desc',
  'popularity'
]);

// Bulk operations validation
export const bulkProductUpdateSchema = z.object({
  productIds: z.array(z.string().min(1)).min(1, "At least one product ID is required"),
  updates: z.object({
    isActive: z.boolean().optional(),
    categoryId: z.string().optional(),
    basePrice: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format").optional(),
  }).refine(data => Object.keys(data).length > 0, {
    message: "At least one field must be updated",
  }),
});