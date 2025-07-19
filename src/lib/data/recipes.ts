import { recipes, productRecipes, recipeImages, products, user, } from '@/db/schema';
import { eq, and, or, ilike, inArray, desc, asc, count, isNull } from 'drizzle-orm';
import { db } from '@/db';

// Types for recipe queries
export interface RecipeFilters {
  difficulty?: 'easy' | 'medium' | 'hard';
  maxPrepTime?: number;
  maxCookTime?: number;
  maxTotalTime?: number;
  minServings?: number;
  maxServings?: number;
  isPrivate?: boolean;
  createdBy?: string;
  hasProducts?: boolean;
}

export interface RecipeSearchOptions {
  query?: string;
  filters?: RecipeFilters;
  sort?: {
    field: 'title' | 'createdAt' | 'updatedAt' | 'totalTime' | 'difficulty';
    direction: 'asc' | 'desc';
  };
  limit?: number;
  offset?: number;
  includeImages?: boolean;
  includeProducts?: boolean;
  includeCreator?: boolean;
}

export interface RecipeWithDetails {
  id: string;
  title: string;
  description: string | null;
  ingredients: unknown; // JSON array
  instructions: unknown; // JSON array
  prepTime: number | null;
  cookTime: number | null;
  totalTime: number | null;
  difficulty: string | null;
  servings: number | null;
  notes: string | null;
  isPrivate: boolean | null;
  createdBy: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  creatorName?: string | null;
  creatorEmail?: string | null;
  images?: Array<{
    id: string;
    url: string;
    altText: string | null;
    sortOrder: number | null;
  }>;
  products?: Array<{
    id: string;
    name: string;
    slug: string;
    isMainRecipe: boolean | null;
  }>;
}

/**
 * Recipe query utilities for catalog management
 */
export class RecipeQueryUtils {
  /**
   * Search recipes with comprehensive filtering and sorting
   */
  static async searchRecipes(options: RecipeSearchOptions = {}): Promise<RecipeWithDetails[]> {
    const {
      query,
      filters = {},
      sort = { field: 'createdAt', direction: 'desc' },
      limit = 20,
      offset = 0,
      includeImages = false,
      includeProducts = false,
    } = options;

    // Build filter conditions
    const conditions = RecipeQueryUtils.buildFilterConditions(filters, query);

    // Build base query
    const baseQuery = db
      .select({
        id: recipes.id,
        title: recipes.title,
        description: recipes.description,
        ingredients: recipes.ingredients,
        instructions: recipes.instructions,
        prepTime: recipes.prepTime,
        cookTime: recipes.cookTime,
        totalTime: recipes.totalTime,
        difficulty: recipes.difficulty,
        servings: recipes.servings,
        notes: recipes.notes,
        isPrivate: recipes.isPrivate,
        createdBy: recipes.createdBy,
        createdAt: recipes.createdAt,
        updatedAt: recipes.updatedAt,
        creatorName: user.name,
        creatorEmail: user.email,
      })
      .from(recipes)
      .leftJoin(user, eq(recipes.createdBy, user.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    // Apply sorting
    const sortedQuery = RecipeQueryUtils.applySorting(baseQuery, sort);

    // Apply pagination
    const results = await sortedQuery.limit(limit).offset(offset);

    // Enhance results with additional data if requested
    const enhancedResults = await RecipeQueryUtils.enhanceRecipeResults(results, {
      includeImages,
      includeProducts,
    });

    return enhancedResults;
  }

  /**
   * Get recipe by ID with full details
   */
  static async getRecipeById(
    id: string,
    options: {
      includeImages?: boolean;
      includeProducts?: boolean;
      includeCreator?: boolean;
    } = {}
  ): Promise<RecipeWithDetails | null> {
    const results = await RecipeQueryUtils.searchRecipes({
      filters: {},
      limit: 1,
      offset: 0,
      ...options,
    });

    const recipe = results.find(r => r.id === id);
    return recipe || null;
  }

  /**
   * Get recipes by product ID
   */
  static async getRecipesByProduct(productId: string): Promise<RecipeWithDetails[]> {
    const recipeIds = await db
      .select({ recipeId: productRecipes.recipeId })
      .from(productRecipes)
      .where(eq(productRecipes.productId, productId));

    if (recipeIds.length === 0) return [];

    return RecipeQueryUtils.searchRecipes({
      filters: {},
      limit: 100,
      includeImages: true,
      includeProducts: true,
      includeCreator: true,
    }).then(results =>
      results.filter(recipe =>
        recipeIds.some(r => r.recipeId === recipe.id)
      )
    );
  }

  /**
   * Get recipe statistics for admin dashboard
   */
  static async getRecipeStats() {
    const totalRecipes = await db
      .select({ count: count() })
      .from(recipes);

    const privateRecipes = await db
      .select({ count: count() })
      .from(recipes)
      .where(eq(recipes.isPrivate, true));

    const publicRecipes = await db
      .select({ count: count() })
      .from(recipes)
      .where(eq(recipes.isPrivate, false));

    const recipesWithProducts = await db
      .select({ count: count() })
      .from(recipes)
      .innerJoin(productRecipes, eq(recipes.id, productRecipes.recipeId));

    return {
      total: totalRecipes[0]?.count || 0,
      private: privateRecipes[0]?.count || 0,
      public: publicRecipes[0]?.count || 0,
      withProducts: recipesWithProducts[0]?.count || 0,
    };
  }

  /**
   * Build filter conditions for WHERE clause
   */
  private static buildFilterConditions(filters: RecipeFilters, searchQuery?: string) {
    const conditions = [];

    // Text search
    if (searchQuery) {
      const searchTerm = `%${searchQuery.toLowerCase()}%`;
      conditions.push(
        or(
          ilike(recipes.title, searchTerm),
          ilike(recipes.description, searchTerm),
          ilike(recipes.notes, searchTerm)
        )
      );
    }

    // Difficulty filter
    if (filters.difficulty) {
      conditions.push(eq(recipes.difficulty, filters.difficulty));
    }

    // Time filters
    if (filters.maxPrepTime !== undefined) {
      conditions.push(
        or(
          isNull(recipes.prepTime),
          eq(recipes.prepTime, filters.maxPrepTime)
        )
      );
    }
    if (filters.maxCookTime !== undefined) {
      conditions.push(
        or(
          isNull(recipes.cookTime),
          eq(recipes.cookTime, filters.maxCookTime)
        )
      );
    }
    if (filters.maxTotalTime !== undefined) {
      conditions.push(
        or(
          isNull(recipes.totalTime),
          eq(recipes.totalTime, filters.maxTotalTime)
        )
      );
    }

    // Serving filters
    if (filters.minServings !== undefined) {
      conditions.push(
        or(
          isNull(recipes.servings),
          eq(recipes.servings, filters.minServings)
        )
      );
    }
    if (filters.maxServings !== undefined) {
      conditions.push(
        or(
          isNull(recipes.servings),
          eq(recipes.servings, filters.maxServings)
        )
      );
    }

    // Privacy filter
    if (filters.isPrivate !== undefined) {
      conditions.push(eq(recipes.isPrivate, filters.isPrivate));
    }

    // Creator filter
    if (filters.createdBy) {
      conditions.push(eq(recipes.createdBy, filters.createdBy));
    }

    return conditions;
  }

  /**
   * Apply sorting to query
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static applySorting(query: any, sort: RecipeSearchOptions['sort']): any {
    if (!sort) return query.orderBy(desc(recipes.createdAt));

    const { field, direction } = sort;
    const orderFn = direction === 'asc' ? asc : desc;

    switch (field) {
      case 'title':
        return query.orderBy(orderFn(recipes.title));
      case 'updatedAt':
        return query.orderBy(orderFn(recipes.updatedAt));
      case 'totalTime':
        return query.orderBy(orderFn(recipes.totalTime));
      case 'difficulty':
        return query.orderBy(orderFn(recipes.difficulty));
      case 'createdAt':
      default:
        return query.orderBy(orderFn(recipes.createdAt));
    }
  }

  /**
   * Enhance recipe results with additional data
   */
  private static async enhanceRecipeResults(
    recipes: unknown[],
    options: {
      includeImages?: boolean;
      includeProducts?: boolean;
    }
  ): Promise<RecipeWithDetails[]> {
    if (recipes.length === 0) return recipes as RecipeWithDetails[];

    const recipeIds = recipes.map((r: unknown) => (r as { id: string }).id);

    // Define proper types for enhancements
    const imageEnhancements: Record<string, Array<{
      id: string;
      url: string;
      altText: string | null;
      sortOrder: number | null;
    }>> = {};

    const productEnhancements: Record<string, Array<{
      id: string;
      name: string;
      slug: string;
      isMainRecipe: boolean | null;
    }>> = {};

    // Get images
    if (options.includeImages) {
      const images = await db
        .select({
          id: recipeImages.id,
          recipeId: recipeImages.recipeId,
          url: recipeImages.url,
          altText: recipeImages.altText,
          sortOrder: recipeImages.sortOrder,
        })
        .from(recipeImages)
        .where(inArray(recipeImages.recipeId, recipeIds))
        .orderBy(asc(recipeImages.sortOrder));

      images.forEach(image => {
        const recipeId = image.recipeId;
        if (recipeId) {
          if (!imageEnhancements[recipeId]) imageEnhancements[recipeId] = [];
          imageEnhancements[recipeId].push({
            id: image.id,
            url: image.url,
            altText: image.altText,
            sortOrder: image.sortOrder,
          });
        }
      });
    }

    // Get products
    if (options.includeProducts) {
      const productData = await db
        .select({
          recipeId: productRecipes.recipeId,
          productId: products.id,
          productName: products.name,
          productSlug: products.slug,
          isMainRecipe: productRecipes.isMainRecipe,
        })
        .from(productRecipes)
        .innerJoin(products, eq(productRecipes.productId, products.id))
        .where(inArray(productRecipes.recipeId, recipeIds));

      productData.forEach(item => {
        if (!productEnhancements[item.recipeId]) productEnhancements[item.recipeId] = [];
        productEnhancements[item.recipeId].push({
          id: item.productId,
          name: item.productName,
          slug: item.productSlug,
          isMainRecipe: item.isMainRecipe,
        });
      });
    }

    // Merge enhancements with recipes
    return recipes.map((recipe: unknown) => {
      const r = recipe as RecipeWithDetails;
      return {
        ...r,
        images: imageEnhancements[r.id] || [],
        products: productEnhancements[r.id] || [],
      };
    });
  }
}

/**
 * Admin-specific recipe management functions
 */
export class AdminRecipeUtils {
  /**
   * Create a new recipe
   */
  static async createRecipe(data: {
    id: string;
    title: string;
    description?: string;
    ingredients: unknown; // JSON array
    instructions: unknown; // JSON array
    prepTime?: number;
    cookTime?: number;
    totalTime?: number;
    difficulty?: string;
    servings?: number;
    notes?: string;
    isPrivate?: boolean;
    createdBy?: string;
  }) {
    const result = await db
      .insert(recipes)
      .values({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return result[0];
  }

  /**
   * Update an existing recipe
   */
  static async updateRecipe(
    id: string,
    data: Partial<{
      title: string;
      description: string;
      ingredients: unknown;
      instructions: unknown;
      prepTime: number;
      cookTime: number;
      totalTime: number;
      difficulty: string;
      servings: number;
      notes: string;
      isPrivate: boolean;
    }>
  ) {
    const result = await db
      .update(recipes)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(recipes.id, id))
      .returning();

    return result[0];
  }

  /**
   * Delete a recipe
   */
  static async deleteRecipe(id: string): Promise<{ success: boolean; message: string }> {
    try {
      // Check if recipe is linked to products
      const linkedProducts = await db
        .select({ count: count() })
        .from(productRecipes)
        .where(eq(productRecipes.recipeId, id));

      if (linkedProducts[0]?.count > 0) {
        return {
          success: false,
          message: `Cannot delete recipe linked to ${linkedProducts[0].count} products`,
        };
      }

      await db.delete(recipes).where(eq(recipes.id, id));
      return {
        success: true,
        message: 'Recipe deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to delete recipe: ' + (error as Error).message,
      };
    }
  }

  /**
   * Link recipe to product
   */
  static async linkRecipeToProduct(
    recipeId: string,
    productId: string,
    isMainRecipe: boolean = false
  ) {
    const result = await db
      .insert(productRecipes)
      .values({
        recipeId,
        productId,
        isMainRecipe,
      })
      .returning();

    return result[0];
  }

  /**
   * Unlink recipe from product
   */
  static async unlinkRecipeFromProduct(recipeId: string, productId: string) {
    await db
      .delete(productRecipes)
      .where(
        and(
          eq(productRecipes.recipeId, recipeId),
          eq(productRecipes.productId, productId)
        )
      );
  }

  /**
   * Add image to recipe
   */
  static async addRecipeImage(data: {
    id: string;
    recipeId: string;
    url: string;
    altText?: string;
    sortOrder?: number;
  }) {
    const result = await db
      .insert(recipeImages)
      .values({
        ...data,
        createdAt: new Date(),
      })
      .returning();

    return result[0];
  }

  /**
   * Remove image from recipe
   */
  static async removeRecipeImage(imageId: string) {
    await db.delete(recipeImages).where(eq(recipeImages.id, imageId));
  }

  /**
   * Duplicate a recipe
   */
  static async duplicateRecipe(
    originalId: string,
    newData: {
      id: string;
      title: string;
      createdBy?: string;
    }
  ) {
    // Get original recipe
    const original = await RecipeQueryUtils.getRecipeById(originalId, {
      includeImages: true,
    });

    if (!original) {
      throw new Error('Original recipe not found');
    }

    // Create new recipe
    const newRecipe = await AdminRecipeUtils.createRecipe({
      id: newData.id,
      title: newData.title,
      description: original.description || undefined,
      ingredients: original.ingredients,
      instructions: original.instructions,
      prepTime: original.prepTime || undefined,
      cookTime: original.cookTime || undefined,
      totalTime: original.totalTime || undefined,
      difficulty: original.difficulty || undefined,
      servings: original.servings || undefined,
      notes: original.notes || undefined,
      isPrivate: true, // Always create duplicates as private
      createdBy: newData.createdBy,
    });

    // Copy images if any
    if (original.images && original.images.length > 0) {
      for (const image of original.images) {
        await AdminRecipeUtils.addRecipeImage({
          id: `${newData.id}-img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          recipeId: newRecipe.id,
          url: image.url,
          altText: image.altText || undefined,
          sortOrder: image.sortOrder || undefined,
        });
      }
    }

    return newRecipe;
  }
}

// Convenience functions
export const recipeQueries = {
  search: RecipeQueryUtils.searchRecipes,
  getById: RecipeQueryUtils.getRecipeById,
  getByProduct: RecipeQueryUtils.getRecipesByProduct,
  getStats: RecipeQueryUtils.getRecipeStats,
};

// Admin convenience functions
export const adminRecipeQueries = {
  create: AdminRecipeUtils.createRecipe,
  update: AdminRecipeUtils.updateRecipe,
  delete: AdminRecipeUtils.deleteRecipe,
  linkToProduct: AdminRecipeUtils.linkRecipeToProduct,
  unlinkFromProduct: AdminRecipeUtils.unlinkRecipeFromProduct,
  addImage: AdminRecipeUtils.addRecipeImage,
  removeImage: AdminRecipeUtils.removeRecipeImage,
  duplicate: AdminRecipeUtils.duplicateRecipe,
};