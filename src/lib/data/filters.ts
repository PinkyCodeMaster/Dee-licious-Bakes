import { products, productVariants, categories, tags, productTags, allergens, productAllergens, } from '@/db/schema';
import { eq, and, count, min, max, desc, asc, sql, isNotNull, SQL } from 'drizzle-orm';
import { db } from '@/db';

export interface FilterOption {
  id: string;
  name: string;
  count: number;
  type?: string;
  color?: string;
}

export interface PriceRange {
  min: number;
  max: number;
}

export interface FilterFacets {
  categories: FilterOption[];
  tags: FilterOption[];
  allergens: FilterOption[];
  priceRange: PriceRange;
  flavors: FilterOption[];
  sizes: FilterOption[];
  types: FilterOption[];
}

/**
 * Filter and faceted search utilities
 */
export class FilterQueryUtils {
  /**
   * Get all available filter facets for products
   */
  static async getFilterFacets(categoryId?: string): Promise<FilterFacets> {
    const baseConditions = categoryId
      ? [eq(products.categoryId, categoryId), eq(products.isActive, true)]
      : [eq(products.isActive, true)];

    const [
      categoriesData,
      tagsData,
      allergensData,
      priceRangeData,
      flavorsData,
      sizesData,
      typesData,
    ] = await Promise.all([
      this.getCategoryFacets(baseConditions),
      this.getTagFacets(baseConditions),
      this.getAllergenFacets(baseConditions),
      this.getPriceRange(baseConditions),
      this.getVariantFacets('flavor', baseConditions),
      this.getVariantFacets('size', baseConditions),
      this.getVariantFacets('type', baseConditions),
    ]);

    return {
      categories: categoriesData,
      tags: tagsData,
      allergens: allergensData,
      priceRange: priceRangeData,
      flavors: flavorsData,
      sizes: sizesData,
      types: typesData,
    };
  }

  /**
   * Get category filter options with product counts
   */
  static async getCategoryFacets(baseConditions: SQL[] = []): Promise<FilterOption[]> {
    const result = await db
      .select({
        id: categories.id,
        name: categories.name,
        count: count(products.id),
      })
      .from(categories)
      .innerJoin(products, eq(categories.id, products.categoryId))
      .where(and(...baseConditions))
      .groupBy(categories.id, categories.name)
      .having(sql`count(${products.id}) > 0`)
      .orderBy(desc(count(products.id)), asc(categories.name));

    return result.map(item => ({
      id: item.id,
      name: item.name,
      count: item.count,
    }));
  }

  /**
   * Get tag filter options with product counts
   */
  static async getTagFacets(baseConditions: SQL[] = []): Promise<FilterOption[]> {
    const result = await db
      .select({
        id: tags.id,
        name: tags.name,
        type: tags.type,
        color: tags.color,
        count: count(products.id),
      })
      .from(tags)
      .innerJoin(productTags, eq(tags.id, productTags.tagId))
      .innerJoin(products, eq(productTags.productId, products.id))
      .where(and(...baseConditions))
      .groupBy(tags.id, tags.name, tags.type, tags.color)
      .having(sql`count(${products.id}) > 0`)
      .orderBy(asc(tags.type), desc(count(products.id)), asc(tags.name));

    return result.map(item => ({
      id: item.id,
      name: item.name,
      count: item.count,
      type: item.type,
      color: item.color || undefined,
    }));
  }

  /**
   * Get allergen filter options with product counts
   */
  static async getAllergenFacets(baseConditions: SQL[] = []): Promise<FilterOption[]> {
    const result = await db
      .select({
        id: allergens.id,
        name: allergens.name,
        count: count(products.id),
      })
      .from(allergens)
      .innerJoin(productAllergens, eq(allergens.id, productAllergens.allergenId))
      .innerJoin(products, eq(productAllergens.productId, products.id))
      .where(and(...baseConditions, eq(productAllergens.containsAllergen, true)))
      .groupBy(allergens.id, allergens.name)
      .having(sql`count(${products.id}) > 0`)
      .orderBy(desc(count(products.id)), asc(allergens.name));

    return result.map(item => ({
      id: item.id,
      name: item.name,
      count: item.count,
    }));
  }

  /**
   * Get price range for products
   */
  static async getPriceRange(baseConditions: SQL[] = []): Promise<PriceRange> {
    const result = await db
      .select({
        minPrice: min(products.basePrice),
        maxPrice: max(products.basePrice),
      })
      .from(products)
      .where(and(...baseConditions));

    const minPrice = parseFloat(result[0]?.minPrice || '0');
    const maxPrice = parseFloat(result[0]?.maxPrice || '0');

    return {
      min: minPrice,
      max: maxPrice,
    };
  }

  /**
   * Get variant-based filter options (flavor, size, type)
   */
  static async getVariantFacets(
    field: 'flavor' | 'size' | 'type',
    baseConditions: SQL[] = []
  ): Promise<FilterOption[]> {
    const fieldColumn = productVariants[field];
    
    const result = await db
      .select({
        value: fieldColumn,
        count: count(sql`DISTINCT ${products.id}`),
      })
      .from(productVariants)
      .innerJoin(products, eq(productVariants.productId, products.id))
      .where(and(...baseConditions, isNotNull(fieldColumn), eq(productVariants.isAvailable, true)))
      .groupBy(fieldColumn)
      .having(sql`count(DISTINCT ${products.id}) > 0`)
      .orderBy(desc(count(sql`DISTINCT ${products.id}`)), asc(fieldColumn));

    return result
      .filter(item => item.value)
      .map(item => ({
        id: item.value!,
        name: item.value!,
        count: item.count,
      }));
  }

  /**
   * Get popular tags (most used across products)
   */
  static async getPopularTags(limit: number = 10): Promise<FilterOption[]> {
    const result = await db
      .select({
        id: tags.id,
        name: tags.name,
        type: tags.type,
        color: tags.color,
        count: count(products.id),
      })
      .from(tags)
      .innerJoin(productTags, eq(tags.id, productTags.tagId))
      .innerJoin(products, and(
        eq(productTags.productId, products.id),
        eq(products.isActive, true)
      ))
      .groupBy(tags.id, tags.name, tags.type, tags.color)
      .orderBy(desc(count(products.id)))
      .limit(limit);

    return result.map(item => ({
      id: item.id,
      name: item.name,
      count: item.count,
      type: item.type,
      color: item.color || undefined,
    }));
  }

  /**
   * Get dietary tags (gluten-free, vegan, etc.)
   */
  static async getDietaryTags(): Promise<FilterOption[]> {
    const result = await db
      .select({
        id: tags.id,
        name: tags.name,
        color: tags.color,
        count: count(products.id),
      })
      .from(tags)
      .innerJoin(productTags, eq(tags.id, productTags.tagId))
      .innerJoin(products, and(
        eq(productTags.productId, products.id),
        eq(products.isActive, true)
      ))
      .where(eq(tags.type, 'dietary'))
      .groupBy(tags.id, tags.name, tags.color)
      .orderBy(desc(count(products.id)), asc(tags.name));

    return result.map(item => ({
      id: item.id,
      name: item.name,
      count: item.count,
      type: 'dietary',
      color: item.color || undefined,
    }));
  }

  /**
   * Get occasion tags (birthday, wedding, etc.)
   */
  static async getOccasionTags(): Promise<FilterOption[]> {
    const result = await db
      .select({
        id: tags.id,
        name: tags.name,
        color: tags.color,
        count: count(products.id),
      })
      .from(tags)
      .innerJoin(productTags, eq(tags.id, productTags.tagId))
      .innerJoin(products, and(
        eq(productTags.productId, products.id),
        eq(products.isActive, true)
      ))
      .where(eq(tags.type, 'occasion'))
      .groupBy(tags.id, tags.name, tags.color)
      .orderBy(desc(count(products.id)), asc(tags.name));

    return result.map(item => ({
      id: item.id,
      name: item.name,
      count: item.count,
      type: 'occasion',
      color: item.color || undefined,
    }));
  }

  /**
   * Get filter suggestions based on current filters
   */
  static async getFilterSuggestions(
    currentFilters: {
      categoryId?: string;
      tagIds?: string[];
      allergenFreeIds?: string[];
    },
    limit: number = 5
  ): Promise<{
    suggestedTags: FilterOption[];
    relatedCategories: FilterOption[];
  }> {
    const baseConditions = [eq(products.isActive, true)];
    
    if (currentFilters.categoryId) {
      baseConditions.push(eq(products.categoryId, currentFilters.categoryId));
    }

    // Get suggested tags based on products that match current filters
    const suggestedTags = await this.getTagFacets(baseConditions);
    
    // Filter out already selected tags
    const filteredTags = currentFilters.tagIds 
      ? suggestedTags.filter(tag => !currentFilters.tagIds!.includes(tag.id))
      : suggestedTags;

    // Get related categories
    const relatedCategories = currentFilters.categoryId 
      ? [] // Don't suggest other categories if one is already selected
      : await this.getCategoryFacets(baseConditions);

    return {
      suggestedTags: filteredTags.slice(0, limit),
      relatedCategories: relatedCategories.slice(0, limit),
    };
  }
}

// Convenience functions
export const filterQueries = {
  getFacets: FilterQueryUtils.getFilterFacets,
  getCategoryFacets: FilterQueryUtils.getCategoryFacets,
  getTagFacets: FilterQueryUtils.getTagFacets,
  getAllergenFacets: FilterQueryUtils.getAllergenFacets,
  getPriceRange: FilterQueryUtils.getPriceRange,
  getVariantFacets: FilterQueryUtils.getVariantFacets,
  getPopularTags: FilterQueryUtils.getPopularTags,
  getDietaryTags: FilterQueryUtils.getDietaryTags,
  getOccasionTags: FilterQueryUtils.getOccasionTags,
  getSuggestions: FilterQueryUtils.getFilterSuggestions,
};