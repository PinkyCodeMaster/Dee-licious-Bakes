import { db } from '@/db';
import {
  products,
  productVariants,
  categories,
  productImages,
  tags,
  productTags,
  allergens,
  productAllergens,
} from '@/db/schema';
import { 
  eq, 
  and, 
  or, 
  gte, 
  lte, 
  ilike, 
  inArray, 
  desc, 
  asc, 
  sql,
  count,
  isNull
} from 'drizzle-orm';

// Types for query parameters
export interface ProductFilters {
  categoryId?: string;
  categorySlug?: string;
  priceMin?: number;
  priceMax?: number;
  minSlices?: number;
  maxSlices?: number;
  tags?: string[];
  allergenFree?: string[]; // Allergen IDs to exclude
  inStock?: boolean;
  isActive?: boolean;
  flavor?: string;
  size?: string;
  type?: string;
}

export interface ProductSortOptions {
  field: 'price' | 'name' | 'createdAt' | 'popularity';
  direction: 'asc' | 'desc';
}

export interface ProductSearchOptions {
  query?: string;
  filters?: ProductFilters;
  sort?: ProductSortOptions;
  limit?: number;
  offset?: number;
  includeVariants?: boolean;
  includeImages?: boolean;
  includeTags?: boolean;
  includeAllergens?: boolean;
}

// Product query utilities
export class ProductQueryUtils {
  /**
   * Search products with comprehensive filtering and sorting
   */
  static async searchProducts(options: ProductSearchOptions = {}) {
    const {
      query,
      filters = {},
      sort = { field: 'createdAt', direction: 'desc' },
      limit = 20,
      offset = 0,
      includeVariants = true,
      includeImages = true,
      includeTags = false,
      includeAllergens = false,
    } = options;

    // Apply filters
    const conditions = ProductQueryUtils.buildFilterConditions(filters, query);

    // Build the base query with conditions
    const baseQuery = db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        description: products.description,
        shortDescription: products.shortDescription,
        categoryId: products.categoryId,
        basePrice: products.basePrice,
        isActive: products.isActive,
        stockQuantity: products.stockQuantity,
        minSlices: products.minSlices,
        maxSlices: products.maxSlices,
        servingSize: products.servingSize,
        preparationTime: products.preparationTime,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        // Include category info
        categoryName: categories.name,
        categorySlug: categories.slug,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    // Apply sorting
    const sortedQuery = ProductQueryUtils.applySorting(baseQuery, sort);

    // Apply pagination
    const results = await sortedQuery.limit(limit).offset(offset);

    // Enhance results with additional data if requested
    const enhancedResults = await ProductQueryUtils.enhanceProductResults(results, {
      includeVariants,
      includeImages,
      includeTags,
      includeAllergens,
    });

    return enhancedResults;
  }

  /**
   * Get products by category with filtering
   */
  static async getProductsByCategory(
    categorySlug: string,
    options: Omit<ProductSearchOptions, 'filters'> & { filters?: Omit<ProductFilters, 'categorySlug'> } = {}
  ) {
    return ProductQueryUtils.searchProducts({
      ...options,
      filters: {
        ...options.filters,
        categorySlug,
      },
    });
  }

  /**
   * Get featured or popular products
   */
  static async getFeaturedProducts(limit: number = 8) {
    return ProductQueryUtils.searchProducts({
      limit,
      sort: { field: 'popularity', direction: 'desc' },
      filters: { isActive: true, inStock: true },
      includeVariants: true,
      includeImages: true,
    });
  }

  /**
   * Search products by text query
   */
  static async searchProductsByText(
    searchQuery: string,
    options: Omit<ProductSearchOptions, 'query'> = {}
  ) {
    return ProductQueryUtils.searchProducts({
      ...options,
      query: searchQuery,
    });
  }

  /**
   * Get product recommendations based on tags and category
   */
  static async getRecommendedProducts(
    productId: string,
    limit: number = 4
  ) {
    // First get the product's category and tags
    const productInfo = await db
      .select({
        categoryId: products.categoryId,
        tags: sql<string[]>`array_agg(${tags.id})`.as('tags'),
      })
      .from(products)
      .leftJoin(productTags, eq(products.id, productTags.productId))
      .leftJoin(tags, eq(productTags.tagId, tags.id))
      .where(eq(products.id, productId))
      .groupBy(products.id, products.categoryId)
      .limit(1);

    if (!productInfo.length) return [];

    const { categoryId, tags: productTagIds } = productInfo[0];

    // Find similar products
    return ProductQueryUtils.searchProducts({
      filters: {
        categoryId: categoryId || undefined,
        tags: productTagIds?.filter(Boolean) || undefined,
        isActive: true,
        inStock: true,
      },
      limit: limit + 1, // Get one extra to exclude the original product
      sort: { field: 'popularity', direction: 'desc' },
      includeVariants: true,
      includeImages: true,
    }).then(results => 
      results.filter((product: unknown) => (product as { id: string }).id !== productId).slice(0, limit)
    );
  }

  /**
   * Get products with specific dietary requirements
   */
  static async getProductsByDietaryNeeds(
    allergenFreeIds: string[],
    tagIds: string[] = [],
    options: Omit<ProductSearchOptions, 'filters'> = {}
  ) {
    return ProductQueryUtils.searchProducts({
      ...options,
      filters: {
        allergenFree: allergenFreeIds,
        tags: tagIds,
        isActive: true,
      },
    });
  }

  /**
   * Get product count for filters (useful for faceted search)
   */
  static async getProductCount(filters: ProductFilters = {}, query?: string) {
    const conditions = ProductQueryUtils.buildFilterConditions(filters, query);
    
    const result = await db
      .select({ count: count() })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    return result[0]?.count || 0;
  }

  /**
   * Build filter conditions for WHERE clause
   */
  private static buildFilterConditions(filters: ProductFilters, searchQuery?: string) {
    const conditions = [];

    // Text search
    if (searchQuery) {
      const searchTerm = `%${searchQuery.toLowerCase()}%`;
      conditions.push(
        or(
          ilike(products.name, searchTerm),
          ilike(products.description, searchTerm),
          ilike(products.shortDescription, searchTerm)
        )
      );
    }

    // Category filters
    if (filters.categoryId) {
      conditions.push(eq(products.categoryId, filters.categoryId));
    }
    if (filters.categorySlug) {
      conditions.push(eq(categories.slug, filters.categorySlug));
    }

    // Price filters
    if (filters.priceMin !== undefined) {
      conditions.push(gte(products.basePrice, filters.priceMin.toString()));
    }
    if (filters.priceMax !== undefined) {
      conditions.push(lte(products.basePrice, filters.priceMax.toString()));
    }

    // Slice count filters
    if (filters.minSlices !== undefined) {
      conditions.push(
        or(
          isNull(products.minSlices),
          gte(products.minSlices, filters.minSlices)
        )
      );
    }
    if (filters.maxSlices !== undefined) {
      conditions.push(
        or(
          isNull(products.maxSlices),
          lte(products.maxSlices, filters.maxSlices)
        )
      );
    }

    // Stock and active filters
    if (filters.inStock) {
      conditions.push(gte(products.stockQuantity, 1));
    }
    if (filters.isActive !== undefined) {
      conditions.push(eq(products.isActive, filters.isActive));
    }

    return conditions;
  }

  /**
   * Apply sorting to query
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static applySorting(query: any, sort: ProductSortOptions): any {
    const { field, direction } = sort;
    const orderFn = direction === 'asc' ? asc : desc;

    switch (field) {
      case 'price':
        return query.orderBy(orderFn(products.basePrice));
      case 'name':
        return query.orderBy(orderFn(products.name));
      case 'createdAt':
        return query.orderBy(orderFn(products.createdAt));
      case 'popularity':
        // For now, use creation date as proxy for popularity
        // In a real app, you'd have a popularity score or sales count
        return query.orderBy(orderFn(products.createdAt));
      default:
        return query.orderBy(desc(products.createdAt));
    }
  }

  /**
   * Enhance product results with additional data
   */
  private static async enhanceProductResults(
    products: unknown[],
    options: {
      includeVariants?: boolean;
      includeImages?: boolean;
      includeTags?: boolean;
      includeAllergens?: boolean;
    }
  ) {
    if (products.length === 0) return products;

    const productIds = products.map((p: unknown) => (p as { id: string }).id);
    const enhancements: Record<string, unknown> = {};

    // Get variants
    if (options.includeVariants) {
      const variants = await db
        .select()
        .from(productVariants)
        .where(inArray(productVariants.productId, productIds));
      
      enhancements.variants = variants.reduce((acc, variant) => {
        const productId = variant.productId;
        if (productId) {
          if (!acc[productId]) acc[productId] = [];
          acc[productId].push(variant);
        }
        return acc;
      }, {} as Record<string, unknown[]>);
    }

    // Get images
    if (options.includeImages) {
      const images = await db
        .select()
        .from(productImages)
        .where(inArray(productImages.productId, productIds))
        .orderBy(desc(productImages.isMain), asc(productImages.sortOrder));
      
      enhancements.images = images.reduce((acc, image) => {
        const productId = image.productId;
        if (productId) {
          if (!acc[productId]) acc[productId] = [];
          acc[productId].push(image);
        }
        return acc;
      }, {} as Record<string, unknown[]>);
    }

    // Get tags
    if (options.includeTags) {
      const productTagsData = await db
        .select({
          productId: productTags.productId,
          tagId: tags.id,
          tagName: tags.name,
          tagType: tags.type,
          tagColor: tags.color,
        })
        .from(productTags)
        .innerJoin(tags, eq(productTags.tagId, tags.id))
        .where(inArray(productTags.productId, productIds));
      
      enhancements.tags = productTagsData.reduce((acc, item) => {
        if (!acc[item.productId]) acc[item.productId] = [];
        acc[item.productId].push({
          id: item.tagId,
          name: item.tagName,
          type: item.tagType,
          color: item.tagColor,
        });
        return acc;
      }, {} as Record<string, unknown[]>);
    }

    // Get allergens
    if (options.includeAllergens) {
      const productAllergenData = await db
        .select({
          productId: productAllergens.productId,
          allergenId: allergens.id,
          allergenName: allergens.name,
          allergenDescription: allergens.description,
          allergenSeverity: allergens.severity,
          containsAllergen: productAllergens.containsAllergen,
          mayContain: productAllergens.mayContain,
        })
        .from(productAllergens)
        .innerJoin(allergens, eq(productAllergens.allergenId, allergens.id))
        .where(inArray(productAllergens.productId, productIds));
      
      enhancements.allergens = productAllergenData.reduce((acc, item) => {
        if (!acc[item.productId]) acc[item.productId] = [];
        acc[item.productId].push({
          id: item.allergenId,
          name: item.allergenName,
          description: item.allergenDescription,
          severity: item.allergenSeverity,
          containsAllergen: item.containsAllergen,
          mayContain: item.mayContain,
        });
        return acc;
      }, {} as Record<string, unknown[]>);
    }

    // Merge enhancements with products
    return products.map((product: unknown) => {
      const p = product as { id: string };
      return {
        ...p,
        variants: (enhancements.variants as Record<string, unknown[]>)?.[p.id] || [],
        images: (enhancements.images as Record<string, unknown[]>)?.[p.id] || [],
        tags: (enhancements.tags as Record<string, unknown[]>)?.[p.id] || [],
        allergens: (enhancements.allergens as Record<string, unknown[]>)?.[p.id] || [],
      };
    });
  }
}

/**
 * Admin-specific product management functions
 */
export class AdminProductUtils {
  /**
   * Get all products for admin management (including inactive)
   */
  static async getAllProductsForAdmin(options: {
    limit?: number;
    offset?: number;
    includeInactive?: boolean;
    sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'price';
    sortOrder?: 'asc' | 'desc';
  } = {}) {
    const {
      limit = 50,
      offset = 0,
      includeInactive = true,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = options;

    const conditions = [];
    if (!includeInactive) {
      conditions.push(eq(products.isActive, true));
    }

    const orderFn = sortOrder === 'asc' ? asc : desc;
    let orderBy;
    switch (sortBy) {
      case 'name':
        orderBy = orderFn(products.name);
        break;
      case 'price':
        orderBy = orderFn(products.basePrice);
        break;
      case 'updatedAt':
        orderBy = orderFn(products.updatedAt);
        break;
      default:
        orderBy = orderFn(products.createdAt);
    }

    const result = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        description: products.description,
        shortDescription: products.shortDescription,
        categoryId: products.categoryId,
        basePrice: products.basePrice,
        isActive: products.isActive,
        stockQuantity: products.stockQuantity,
        minSlices: products.minSlices,
        maxSlices: products.maxSlices,
        servingSize: products.servingSize,
        preparationTime: products.preparationTime,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        categoryName: categories.name,
        categorySlug: categories.slug,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    return result;
  }

  /**
   * Get product by ID for admin editing
   */
  static async getProductById(id: string) {
    const result = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        description: products.description,
        shortDescription: products.shortDescription,
        categoryId: products.categoryId,
        basePrice: products.basePrice,
        isActive: products.isActive,
        stockQuantity: products.stockQuantity,
        minSlices: products.minSlices,
        maxSlices: products.maxSlices,
        servingSize: products.servingSize,
        preparationTime: products.preparationTime,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        categoryName: categories.name,
        categorySlug: categories.slug,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.id, id))
      .limit(1);

    return result[0] || null;
  }

  /**
   * Create a new product
   */
  static async createProduct(data: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    shortDescription?: string;
    categoryId?: string;
    basePrice: string;
    isActive?: boolean;
    stockQuantity?: number;
    minSlices?: number;
    maxSlices?: number;
    servingSize?: string;
    preparationTime?: string;
  }) {
    const result = await db
      .insert(products)
      .values({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return result[0];
  }

  /**
   * Update an existing product
   */
  static async updateProduct(
    id: string,
    data: Partial<{
      name: string;
      slug: string;
      description: string;
      shortDescription: string;
      categoryId: string;
      basePrice: string;
      isActive: boolean;
      stockQuantity: number;
      minSlices: number;
      maxSlices: number;
      servingSize: string;
      preparationTime: string;
    }>
  ) {
    const result = await db
      .update(products)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(products.id, id))
      .returning();

    return result[0];
  }

  /**
   * Delete a product
   */
  static async deleteProduct(id: string): Promise<{ success: boolean; message: string }> {
    try {
      await db.delete(products).where(eq(products.id, id));
      return {
        success: true,
        message: 'Product deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to delete product: ' + (error as Error).message,
      };
    }
  }

  /**
   * Bulk update products
   */
  static async bulkUpdateProducts(
    productIds: string[],
    updates: Partial<{
      isActive: boolean;
      categoryId: string;
      basePrice: string;
    }>
  ) {
    const result = await db
      .update(products)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(inArray(products.id, productIds))
      .returning();

    return result;
  }

  /**
   * Get product statistics for admin dashboard
   */
  static async getProductStats() {
    const totalProducts = await db
      .select({ count: count() })
      .from(products);

    const activeProducts = await db
      .select({ count: count() })
      .from(products)
      .where(eq(products.isActive, true));

    const lowStockProducts = await db
      .select({ count: count() })
      .from(products)
      .where(and(
        eq(products.isActive, true),
        lte(products.stockQuantity, 5)
      ));

    const outOfStockProducts = await db
      .select({ count: count() })
      .from(products)
      .where(and(
        eq(products.isActive, true),
        eq(products.stockQuantity, 0)
      ));

    return {
      total: totalProducts[0]?.count || 0,
      active: activeProducts[0]?.count || 0,
      lowStock: lowStockProducts[0]?.count || 0,
      outOfStock: outOfStockProducts[0]?.count || 0,
    };
  }
}

// Convenience functions for common operations
export const productQueries = {
  search: ProductQueryUtils.searchProducts,
  getByCategory: ProductQueryUtils.getProductsByCategory,
  getFeatured: ProductQueryUtils.getFeaturedProducts,
  searchByText: ProductQueryUtils.searchProductsByText,
  getRecommended: ProductQueryUtils.getRecommendedProducts,
  getByDietaryNeeds: ProductQueryUtils.getProductsByDietaryNeeds,
  getCount: ProductQueryUtils.getProductCount,
};

// Admin convenience functions
export const adminProductQueries = {
  getAll: AdminProductUtils.getAllProductsForAdmin,
  getById: AdminProductUtils.getProductById,
  create: AdminProductUtils.createProduct,
  update: AdminProductUtils.updateProduct,
  delete: AdminProductUtils.deleteProduct,
  bulkUpdate: AdminProductUtils.bulkUpdateProducts,
  getStats: AdminProductUtils.getProductStats,
};