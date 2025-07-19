import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import {
  categories,
  products,
  productVariants,
  productImages,
  tags,
  productTags,
  allergens,
  productAllergens,
} from "@/db/schema/products";

// Category types
export type Category = InferSelectModel<typeof categories>;
export type NewCategory = InferInsertModel<typeof categories>;

// Product types
export type Product = InferSelectModel<typeof products>;
export type NewProduct = InferInsertModel<typeof products>;

// Product variant types
export type ProductVariant = InferSelectModel<typeof productVariants>;
export type NewProductVariant = InferInsertModel<typeof productVariants>;

// Product image types
export type ProductImage = InferSelectModel<typeof productImages>;
export type NewProductImage = InferInsertModel<typeof productImages>;

// Tag types
export type Tag = InferSelectModel<typeof tags>;
export type NewTag = InferInsertModel<typeof tags>;

// Product tag relationship types
export type ProductTag = InferSelectModel<typeof productTags>;
export type NewProductTag = InferInsertModel<typeof productTags>;

// Allergen types
export type Allergen = InferSelectModel<typeof allergens>;
export type NewAllergen = InferInsertModel<typeof allergens>;

// Product allergen relationship types
export type ProductAllergen = InferSelectModel<typeof productAllergens>;
export type NewProductAllergen = InferInsertModel<typeof productAllergens>;

// Extended types with relationships
export type ProductWithDetails = Product & {
  category?: Category | null;
  variants?: ProductVariant[];
  images?: ProductImage[];
  tags?: (ProductTag & { tag: Tag })[];
  allergens?: (ProductAllergen & { allergen: Allergen })[];
};

export type CategoryWithChildren = Category & {
  children?: Category[];
  parent?: Category | null;
  products?: Product[];
};

export type ProductVariantWithProduct = ProductVariant & {
  product?: Product;
};

// Filtering and sorting types
export type ProductSortOption = 
  | 'name-asc'
  | 'name-desc'
  | 'price-asc'
  | 'price-desc'
  | 'created-asc'
  | 'created-desc'
  | 'popularity';

export type ProductFilterOptions = {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  allergens?: string[];
  excludeAllergens?: string[];
  minSlices?: number;
  maxSlices?: number;
  isActive?: boolean;
  search?: string;
};

// Variant attribute types for JSON fields
export type VariantAttributes = {
  weight?: string;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    sugar?: number;
  };
  ingredients?: string[];
  customOptions?: Record<string, unknown>;
};