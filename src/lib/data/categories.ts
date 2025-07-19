import { db } from '@/db';
import { categories, products } from '@/db/schema';
import { eq, and, isNull, count, asc } from 'drizzle-orm';

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
  private static buildCategoryTree(categories: CategoryWithStats[]): CategoryWithStats[] {
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

// Convenience functions
export const categoryQueries = {
  getAll: CategoryQueryUtils.getAllCategoriesWithStats,
  getTree: CategoryQueryUtils.getCategoryTree,
  getRoots: CategoryQueryUtils.getRootCategories,
  getBySlug: CategoryQueryUtils.getCategoryBySlug,
  getSubcategories: CategoryQueryUtils.getSubcategories,
  getBreadcrumb: CategoryQueryUtils.getCategoryBreadcrumb,
};