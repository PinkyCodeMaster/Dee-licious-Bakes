import { db } from '@/db';
import { categories, products } from '@/db/schema';
import { eq, and, isNull, count, asc } from 'drizzle-orm';
import { BAKERY_CATEGORIES, getCategoryBySlug as getBakeryCategory } from './bakery-categories';

export interface CategoryWithStats {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  sortOrder: number | null;
  isActive: boolean | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  productCount: number;
  children?: CategoryWithStats[];
}

/**
 * Category query utilities for hierarchical category management
 */
export class CategoryQueryUtils {
  /**
   * Get all active categories with product counts
   */
  static async getAllCategoriesWithStats(): Promise<CategoryWithStats[]> {
    const categoriesWithCounts = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        description: categories.description,
        parentId: categories.parentId,
        sortOrder: categories.sortOrder,
        isActive: categories.isActive,
        createdAt: categories.createdAt,
        updatedAt: categories.updatedAt,
        productCount: count(products.id),
      })
      .from(categories)
      .leftJoin(products, and(
        eq(categories.id, products.categoryId),
        eq(products.isActive, true)
      ))
      .where(eq(categories.isActive, true))
      .groupBy(
        categories.id,
        categories.name,
        categories.slug,
        categories.description,
        categories.parentId,
        categories.sortOrder,
        categories.isActive,
        categories.createdAt,
        categories.updatedAt
      )
      .orderBy(asc(categories.sortOrder), asc(categories.name));

    return categoriesWithCounts;
  }

  /**
   * Get hierarchical category tree with product counts
   */
  static async getCategoryTree(): Promise<CategoryWithStats[]> {
    const allCategories = await CategoryQueryUtils.getAllCategoriesWithStats();
    return CategoryQueryUtils.buildCategoryTree(allCategories);
  }

  /**
   * Get root categories (categories without parent)
   */
  static async getRootCategories(): Promise<CategoryWithStats[]> {
    const categoriesWithCounts = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        description: categories.description,
        parentId: categories.parentId,
        sortOrder: categories.sortOrder,
        isActive: categories.isActive,
        createdAt: categories.createdAt,
        updatedAt: categories.updatedAt,
        productCount: count(products.id),
      })
      .from(categories)
      .leftJoin(products, and(
        eq(categories.id, products.categoryId),
        eq(products.isActive, true)
      ))
      .where(and(
        eq(categories.isActive, true),
        isNull(categories.parentId)
      ))
      .groupBy(
        categories.id,
        categories.name,
        categories.slug,
        categories.description,
        categories.parentId,
        categories.sortOrder,
        categories.isActive,
        categories.createdAt,
        categories.updatedAt
      )
      .orderBy(asc(categories.sortOrder), asc(categories.name));

    return categoriesWithCounts;
  }

  /**
   * Get category by slug with stats
   */
  static async getCategoryBySlug(slug: string): Promise<CategoryWithStats | null> {
    const result = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        description: categories.description,
        parentId: categories.parentId,
        sortOrder: categories.sortOrder,
        isActive: categories.isActive,
        createdAt: categories.createdAt,
        updatedAt: categories.updatedAt,
        productCount: count(products.id),
      })
      .from(categories)
      .leftJoin(products, and(
        eq(categories.id, products.categoryId),
        eq(products.isActive, true)
      ))
      .where(and(
        eq(categories.slug, slug),
        eq(categories.isActive, true)
      ))
      .groupBy(
        categories.id,
        categories.name,
        categories.slug,
        categories.description,
        categories.parentId,
        categories.sortOrder,
        categories.isActive,
        categories.createdAt,
        categories.updatedAt
      )
      .limit(1);

    return result[0] || null;
  }

  /**
   * Get bakery-specific categories for navigation and filtering
   */
  static getBakeryCategories() {
    return BAKERY_CATEGORIES;
  }

  /**
   * Get bakery category information by slug
   */
  static getBakeryCategoryBySlug(slug: string) {
    return getBakeryCategory(slug);
  }

  /**
   * Get subcategories of a parent category
   */
  static async getSubcategories(parentId: string): Promise<CategoryWithStats[]> {
    const subcategories = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        description: categories.description,
        parentId: categories.parentId,
        sortOrder: categories.sortOrder,
        isActive: categories.isActive,
        createdAt: categories.createdAt,
        updatedAt: categories.updatedAt,
        productCount: count(products.id),
      })
      .from(categories)
      .leftJoin(products, and(
        eq(categories.id, products.categoryId),
        eq(products.isActive, true)
      ))
      .where(and(
        eq(categories.parentId, parentId),
        eq(categories.isActive, true)
      ))
      .groupBy(
        categories.id,
        categories.name,
        categories.slug,
        categories.description,
        categories.parentId,
        categories.sortOrder,
        categories.isActive,
        categories.createdAt,
        categories.updatedAt
      )
      .orderBy(asc(categories.sortOrder), asc(categories.name));

    return subcategories;
  }

  /**
   * Get category breadcrumb path
   */
  static async getCategoryBreadcrumb(categoryId: string): Promise<CategoryWithStats[]> {
    const breadcrumb: CategoryWithStats[] = [];
    let currentId: string | null = categoryId;

    while (currentId) {
      const category = await db
        .select({
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          description: categories.description,
          parentId: categories.parentId,
          sortOrder: categories.sortOrder,
          isActive: categories.isActive,
          createdAt: categories.createdAt,
          updatedAt: categories.updatedAt,
          productCount: count(products.id),
        })
        .from(categories)
        .leftJoin(products, and(
          eq(categories.id, products.categoryId),
          eq(products.isActive, true)
        ))
        .where(eq(categories.id, currentId))
        .groupBy(
          categories.id,
          categories.name,
          categories.slug,
          categories.description,
          categories.parentId,
          categories.sortOrder,
          categories.isActive,
          categories.createdAt,
          categories.updatedAt
        )
        .limit(1);

      if (!category[0]) break;

      breadcrumb.unshift(category[0]);
      currentId = category[0].parentId;
    }

    return breadcrumb;
  }

  /**
   * Build hierarchical category tree from flat array
   */
  static buildCategoryTree(categories: CategoryWithStats[]): CategoryWithStats[] {
    const categoryMap = new Map<string, CategoryWithStats>();
    const rootCategories: CategoryWithStats[] = [];

    // Create a map for quick lookup
    categories.forEach(category => {
      categoryMap.set(category.id, { ...category, children: [] });
    });

    // Build the tree
    categories.forEach(category => {
      const categoryWithChildren = categoryMap.get(category.id)!;
      
      if (category.parentId) {
        const parent = categoryMap.get(category.parentId);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(categoryWithChildren);
        }
      } else {
        rootCategories.push(categoryWithChildren);
      }
    });

    return rootCategories;
  }
}

/**
 * Admin-specific category management functions
 */
export class AdminCategoryUtils {
  /**
   * Get all categories including inactive ones for admin management
   */
  static async getAllCategoriesForAdmin(): Promise<CategoryWithStats[]> {
    const categoriesWithCounts = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        description: categories.description,
        parentId: categories.parentId,
        sortOrder: categories.sortOrder,
        isActive: categories.isActive,
        createdAt: categories.createdAt,
        updatedAt: categories.updatedAt,
        productCount: count(products.id),
      })
      .from(categories)
      .leftJoin(products, eq(categories.id, products.categoryId))
      .groupBy(
        categories.id,
        categories.name,
        categories.slug,
        categories.description,
        categories.parentId,
        categories.sortOrder,
        categories.isActive,
        categories.createdAt,
        categories.updatedAt
      )
      .orderBy(asc(categories.sortOrder), asc(categories.name));

    return categoriesWithCounts;
  }

  /**
   * Get category by ID for admin editing
   */
  static async getCategoryById(id: string): Promise<CategoryWithStats | null> {
    const result = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        description: categories.description,
        parentId: categories.parentId,
        sortOrder: categories.sortOrder,
        isActive: categories.isActive,
        createdAt: categories.createdAt,
        updatedAt: categories.updatedAt,
        productCount: count(products.id),
      })
      .from(categories)
      .leftJoin(products, eq(categories.id, products.categoryId))
      .where(eq(categories.id, id))
      .groupBy(
        categories.id,
        categories.name,
        categories.slug,
        categories.description,
        categories.parentId,
        categories.sortOrder,
        categories.isActive,
        categories.createdAt,
        categories.updatedAt
      )
      .limit(1);

    return result[0] || null;
  }

  /**
   * Create a new category
   */
  static async createCategory(data: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    parentId?: string;
    sortOrder?: number;
    isActive?: boolean;
  }) {
    const result = await db
      .insert(categories)
      .values({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return result[0];
  }

  /**
   * Update an existing category
   */
  static async updateCategory(
    id: string,
    data: Partial<{
      name: string;
      slug: string;
      description: string;
      parentId: string;
      sortOrder: number;
      isActive: boolean;
    }>
  ) {
    const result = await db
      .update(categories)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(categories.id, id))
      .returning();

    return result[0];
  }

  /**
   * Delete a category (only if no products are assigned)
   */
  static async deleteCategory(id: string): Promise<{ success: boolean; message: string }> {
    // Check if category has products
    const productCount = await db
      .select({ count: count() })
      .from(products)
      .where(eq(products.categoryId, id));

    if (productCount[0]?.count > 0) {
      return {
        success: false,
        message: `Cannot delete category with ${productCount[0].count} assigned products`,
      };
    }

    // Check if category has subcategories
    const subcategoryCount = await db
      .select({ count: count() })
      .from(categories)
      .where(eq(categories.parentId, id));

    if (subcategoryCount[0]?.count > 0) {
      return {
        success: false,
        message: `Cannot delete category with ${subcategoryCount[0].count} subcategories`,
      };
    }

    await db.delete(categories).where(eq(categories.id, id));

    return {
      success: true,
      message: 'Category deleted successfully',
    };
  }

  /**
   * Reorder categories by updating sort order
   */
  static async reorderCategories(categoryOrders: { id: string; sortOrder: number }[]) {
    const updates = categoryOrders.map(({ id, sortOrder }) =>
      db
        .update(categories)
        .set({ sortOrder, updatedAt: new Date() })
        .where(eq(categories.id, id))
    );

    await Promise.all(updates);
  }

  /**
   * Get category hierarchy for admin tree view
   */
  static async getCategoryHierarchyForAdmin(): Promise<CategoryWithStats[]> {
    const allCategories = await AdminCategoryUtils.getAllCategoriesForAdmin();
    return CategoryQueryUtils.buildCategoryTree(allCategories);
  }
}

// Convenience functions
export const categoryQueries = {
  getAll: CategoryQueryUtils.getAllCategoriesWithStats,
  getTree: CategoryQueryUtils.getCategoryTree,
  getRoots: CategoryQueryUtils.getRootCategories,
  getBySlug: CategoryQueryUtils.getCategoryBySlug,
  getSubcategories: CategoryQueryUtils.getSubcategories,
  getBreadcrumb: CategoryQueryUtils.getCategoryBreadcrumb,
  getBakeryCategories: CategoryQueryUtils.getBakeryCategories,
  getBakeryCategoryBySlug: CategoryQueryUtils.getBakeryCategoryBySlug,
};

// Admin convenience functions
export const adminCategoryQueries = {
  getAll: AdminCategoryUtils.getAllCategoriesForAdmin,
  getById: AdminCategoryUtils.getCategoryById,
  create: AdminCategoryUtils.createCategory,
  update: AdminCategoryUtils.updateCategory,
  delete: AdminCategoryUtils.deleteCategory,
  reorder: AdminCategoryUtils.reorderCategories,
  getHierarchy: AdminCategoryUtils.getCategoryHierarchyForAdmin,
};