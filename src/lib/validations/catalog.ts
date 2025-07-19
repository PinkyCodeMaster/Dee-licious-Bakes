import { z } from "zod";

// Recipe validation schemas
export const recipeIngredientSchema = z.object({
  name: z.string().min(1, "Ingredient name is required").max(255, "Ingredient name too long"),
  amount: z.string().max(100, "Amount too long").optional(),
  unit: z.string().max(50, "Unit too long").optional(),
  notes: z.string().max(500, "Notes too long").optional(),
});

export const recipeInstructionSchema = z.object({
  step: z.number().int().min(1, "Step number must be positive"),
  instruction: z.string().min(1, "Instruction is required").max(2000, "Instruction too long"),
  duration: z.string().max(100, "Duration too long").optional(),
  temperature: z.string().max(100, "Temperature too long").optional(),
  notes: z.string().max(500, "Notes too long").optional(),
});

export const recipeSchema = z.object({
  id: z.string().min(1, "Recipe ID is required"),
  title: z.string().min(1, "Recipe title is required").max(255, "Recipe title too long"),
  description: z.string().max(2000, "Description too long").optional(),
  ingredients: z.array(recipeIngredientSchema).min(1, "At least one ingredient is required"),
  instructions: z.array(recipeInstructionSchema).min(1, "At least one instruction is required"),
  prepTime: z.number().int().min(0, "Prep time cannot be negative").optional(),
  cookTime: z.number().int().min(0, "Cook time cannot be negative").optional(),
  totalTime: z.number().int().min(0, "Total time cannot be negative").optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  servings: z.number().int().min(1, "Servings must be at least 1").optional(),
  notes: z.string().max(2000, "Notes too long").optional(),
  isPrivate: z.boolean().default(true),
  createdBy: z.string().optional(),
}).refine(data => {
  if (data.prepTime && data.cookTime && data.totalTime) {
    return data.totalTime >= (data.prepTime + data.cookTime);
  }
  return true;
}, {
  message: "Total time should be at least the sum of prep and cook time",
  path: ["totalTime"],
});

export const createRecipeSchema = recipeSchema.omit({ 
  id: true,
});

export const updateRecipeSchema = recipeSchema.partial().omit({ 
  id: true,
});

// Recipe image validation schemas
export const recipeImageSchema = z.object({
  id: z.string().min(1, "Image ID is required"),
  recipeId: z.string().min(1, "Recipe ID is required"),
  url: z.string().url("Invalid image URL"),
  altText: z.string().max(255, "Alt text too long").optional(),
  sortOrder: z.number().int().min(0).default(0),
});

export const createRecipeImageSchema = recipeImageSchema.omit({ 
  id: true,
});

export const updateRecipeImageSchema = recipeImageSchema.partial().omit({ 
  id: true,
});

// Product-recipe relationship validation
export const productRecipeSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  recipeId: z.string().min(1, "Recipe ID is required"),
  isMainRecipe: z.boolean().default(false),
});

// Recipe filtering validation
export const recipeFilterSchema = z.object({
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  maxPrepTime: z.number().int().min(0).optional(),
  maxCookTime: z.number().int().min(0).optional(),
  maxTotalTime: z.number().int().min(0).optional(),
  minServings: z.number().int().min(1).optional(),
  maxServings: z.number().int().min(1).optional(),
  isPrivate: z.boolean().optional(),
  createdBy: z.string().optional(),
  hasProducts: z.boolean().optional(),
  search: z.string().max(255).optional(),
}).refine(data => {
  if (data.minServings && data.maxServings) {
    return data.minServings <= data.maxServings;
  }
  return true;
}, {
  message: "Minimum servings must be less than or equal to maximum servings",
  path: ["minServings"],
});

// Recipe sorting validation
export const recipeSortSchema = z.enum([
  'title-asc',
  'title-desc',
  'created-asc',
  'created-desc',
  'updated-asc',
  'updated-desc',
  'time-asc',
  'time-desc',
  'difficulty-asc',
  'difficulty-desc'
]);

// Recipe duplication validation
export const duplicateRecipeSchema = z.object({
  originalId: z.string().min(1, "Original recipe ID is required"),
  title: z.string().min(1, "New recipe title is required").max(255, "Recipe title too long"),
  createdBy: z.string().optional(),
});

// Extended category validation for admin management
export const adminCategorySchema = z.object({
  id: z.string().min(1, "Category ID is required"),
  name: z.string().min(1, "Category name is required").max(255, "Category name too long"),
  slug: z.string().min(1, "Category slug is required").max(255, "Category slug too long")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  description: z.string().max(2000, "Description too long").optional(),
  parentId: z.string().optional(),
  sortOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const createAdminCategorySchema = adminCategorySchema.omit({ 
  id: true,
});

export const updateAdminCategorySchema = adminCategorySchema.partial().omit({ 
  id: true,
});

// Category reordering validation
export const reorderCategoriesSchema = z.object({
  categories: z.array(z.object({
    id: z.string().min(1, "Category ID is required"),
    sortOrder: z.number().int().min(0, "Sort order cannot be negative"),
  })).min(1, "At least one category is required"),
});

// Extended product validation for admin management
export const adminProductSchema = z.object({
  id: z.string().min(1, "Product ID is required"),
  name: z.string().min(1, "Product name is required").max(255, "Product name too long"),
  slug: z.string().min(1, "Product slug is required").max(255, "Product slug too long")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  description: z.string().max(10000, "Description too long").optional(),
  shortDescription: z.string().max(1000, "Short description too long").optional(),
  categoryId: z.string().optional(),
  basePrice: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format").transform(val => parseFloat(val)),
  isActive: z.boolean().default(true),
  stockQuantity: z.number().int().min(0).default(0),
  minSlices: z.number().int().min(1).optional(),
  maxSlices: z.number().int().min(1).optional(),
  servingSize: z.string().max(200, "Serving size too long").optional(),
  preparationTime: z.string().max(200, "Preparation time too long").optional(),
}).refine(data => {
  if (data.minSlices && data.maxSlices) {
    return data.minSlices <= data.maxSlices;
  }
  return true;
}, {
  message: "Minimum slices must be less than or equal to maximum slices",
  path: ["minSlices"],
});

export const createAdminProductSchema = adminProductSchema.omit({ 
  id: true,
});

export const updateAdminProductSchema = adminProductSchema.partial().omit({ 
  id: true,
});

// Bulk product operations validation
export const bulkProductOperationSchema = z.object({
  productIds: z.array(z.string().min(1)).min(1, "At least one product ID is required"),
  operation: z.enum(['activate', 'deactivate', 'delete', 'update-category', 'update-price']),
  data: z.object({
    isActive: z.boolean().optional(),
    categoryId: z.string().optional(),
    basePrice: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format").optional(),
  }).optional(),
}).refine(data => {
  // Validate that required data is provided for specific operations
  if (data.operation === 'update-category' && !data.data?.categoryId) {
    return false;
  }
  if (data.operation === 'update-price' && !data.data?.basePrice) {
    return false;
  }
  return true;
}, {
  message: "Required data missing for the selected operation",
  path: ["data"],
});

// Image upload validation
export const imageUploadSchema = z.object({
  file: z.instanceof(File, { message: "File is required" }),
  altText: z.string().max(255, "Alt text too long").optional(),
  sortOrder: z.number().int().min(0).default(0),
}).refine(data => {
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  return allowedTypes.includes(data.file.type);
}, {
  message: "Invalid file type. Only JPEG, PNG, and WebP images are allowed",
  path: ["file"],
}).refine(data => {
  // Validate file size (5MB max)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  return data.file.size <= maxSize;
}, {
  message: "File size must be less than 5MB",
  path: ["file"],
});

// Catalog search validation
export const catalogSearchSchema = z.object({
  query: z.string().max(255, "Search query too long").optional(),
  type: z.enum(['all', 'categories', 'products', 'recipes']).default('all'),
  filters: z.object({
    categoryId: z.string().optional(),
    isActive: z.boolean().optional(),
    isPrivate: z.boolean().optional(),
    difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
    priceMin: z.number().min(0).optional(),
    priceMax: z.number().min(0).optional(),
  }).optional(),
  sort: z.object({
    field: z.enum(['name', 'title', 'createdAt', 'updatedAt', 'price']),
    direction: z.enum(['asc', 'desc']).default('desc'),
  }).optional(),
  pagination: z.object({
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(100).default(20),
  }).optional(),
});

// Export/import validation
export const catalogExportSchema = z.object({
  type: z.enum(['categories', 'products', 'recipes', 'all']),
  format: z.enum(['json', 'csv']).default('json'),
  includeInactive: z.boolean().default(false),
  includeImages: z.boolean().default(true),
  filters: z.object({
    categoryIds: z.array(z.string()).optional(),
    dateFrom: z.date().optional(),
    dateTo: z.date().optional(),
  }).optional(),
});

export const catalogImportSchema = z.object({
  file: z.instanceof(File, { message: "File is required" }),
  type: z.enum(['categories', 'products', 'recipes']),
  options: z.object({
    overwriteExisting: z.boolean().default(false),
    skipDuplicates: z.boolean().default(true),
    validateOnly: z.boolean().default(false),
  }).default({
    overwriteExisting: false,
    skipDuplicates: true,
    validateOnly: false,
  }),
}).refine(data => {
  // Validate file type based on import type
  const allowedTypes = ['application/json', 'text/csv', 'application/vnd.ms-excel'];
  return allowedTypes.includes(data.file.type);
}, {
  message: "Invalid file type. Only JSON and CSV files are allowed",
  path: ["file"],
});

// Audit log filtering validation
export const auditLogFilterSchema = z.object({
  entityType: z.enum(['category', 'product', 'recipe']).optional(),
  entityId: z.string().optional(),
  userId: z.string().optional(),
  action: z.enum(['create', 'update', 'delete', 'activate', 'deactivate']).optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  limit: z.number().int().min(1).max(1000).default(100),
  offset: z.number().int().min(0).default(0),
});