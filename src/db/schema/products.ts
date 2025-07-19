import { pgTable, text, timestamp, boolean, decimal, integer, index, primaryKey, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Categories table with hierarchical support
export const categories = pgTable("categories", {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    description: text('description'),
    parentId: text('parent_id'),
    sortOrder: integer('sort_order').default(0),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
}, (table) => ({
    slugIdx: index('categories_slug_idx').on(table.slug),
    parentIdIdx: index('categories_parent_id_idx').on(table.parentId),
    activeIdx: index('categories_active_idx').on(table.isActive),
}));

// Main products table
export const products = pgTable("products", {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    description: text('description'),
    shortDescription: text('short_description'),
    categoryId: text('category_id').references(() => categories.id),
    basePrice: decimal('base_price', { precision: 10, scale: 2 }).notNull(),
    isActive: boolean('is_active').default(true),
    stockQuantity: integer('stock_quantity').default(0),
    minSlices: integer('min_slices'),
    maxSlices: integer('max_slices'),
    servingSize: text('serving_size'),
    preparationTime: text('preparation_time'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
}, (table) => ({
    slugIdx: index('products_slug_idx').on(table.slug),
    categoryIdIdx: index('products_category_id_idx').on(table.categoryId),
    activeIdx: index('products_active_idx').on(table.isActive),
    priceIdx: index('products_price_idx').on(table.basePrice),
    nameIdx: index('products_name_idx').on(table.name),
}));

// Product variants (sizes, flavors, types, etc.)
export const productVariants = pgTable("product_variants", {
    id: text('id').primaryKey(),
    productId: text('product_id').references(() => products.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    sku: text('sku').unique(),
    price: decimal('price', { precision: 10, scale: 2 }).notNull(),
    stockQuantity: integer('stock_quantity').default(0),
    isDefault: boolean('is_default').default(false),
    flavor: text('flavor'),
    size: text('size'),
    type: text('type'),
    attributes: jsonb('attributes'),
    description: text('description'),
    isAvailable: boolean('is_available').default(true),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
}, (table) => ({
    productIdIdx: index('product_variants_product_id_idx').on(table.productId),
    skuIdx: index('product_variants_sku_idx').on(table.sku),
    availableIdx: index('product_variants_available_idx').on(table.isAvailable),
    priceIdx: index('product_variants_price_idx').on(table.price),
    defaultIdx: index('product_variants_default_idx').on(table.isDefault),
}));

// Product images
export const productImages = pgTable("product_images", {
    id: text('id').primaryKey(),
    productId: text('product_id').references(() => products.id, { onDelete: 'cascade' }),
    url: text('url').notNull(),
    altText: text('alt_text'),
    sortOrder: integer('sort_order').default(0),
    isMain: boolean('is_main').default(false),
    createdAt: timestamp('created_at').defaultNow()
}, (table) => ({
    productIdIdx: index('product_images_product_id_idx').on(table.productId),
    mainIdx: index('product_images_main_idx').on(table.isMain),
}));

// Tags for filtering and categorization
export const tags = pgTable("tags", {
    id: text('id').primaryKey(),
    name: text('name').notNull().unique(),
    type: text('type').notNull(),
    color: text('color'),
    createdAt: timestamp('created_at').defaultNow()
}, (table) => ({
    nameIdx: index('tags_name_idx').on(table.name),
    typeIdx: index('tags_type_idx').on(table.type),
}));

// Product-tag relationships
export const productTags = pgTable("product_tags", {
    productId: text('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
    tagId: text('tag_id').references(() => tags.id, { onDelete: 'cascade' }).notNull()
}, (table) => ({
    pk: primaryKey({ columns: [table.productId, table.tagId] }),
    productIdIdx: index('product_tags_product_id_idx').on(table.productId),
    tagIdIdx: index('product_tags_tag_id_idx').on(table.tagId),
}));

// Allergen information
export const allergens = pgTable("allergens", {
    id: text('id').primaryKey(),
    name: text('name').notNull().unique(),
    description: text('description'),
    severity: text('severity'),
    createdAt: timestamp('created_at').defaultNow()
}, (table) => ({
    nameIdx: index('allergens_name_idx').on(table.name),
}));

// Product-allergen relationships
export const productAllergens = pgTable("product_allergens", {
    productId: text('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
    allergenId: text('allergen_id').references(() => allergens.id, { onDelete: 'cascade' }).notNull(),
    containsAllergen: boolean('contains_allergen').notNull(),
    mayContain: boolean('may_contain').default(false)
}, (table) => ({
    pk: primaryKey({ columns: [table.productId, table.allergenId] }),
    productIdIdx: index('product_allergens_product_id_idx').on(table.productId),
    allergenIdIdx: index('product_allergens_allergen_id_idx').on(table.allergenId),
}));

// Define relationships
export const categoriesRelations = relations(categories, ({ one, many }) => ({
    parent: one(categories, {
        fields: [categories.parentId],
        references: [categories.id],
        relationName: "categoryParent"
    }),
    children: many(categories, {
        relationName: "categoryParent"
    }),
    products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
    category: one(categories, {
        fields: [products.categoryId],
        references: [categories.id],
    }),
    variants: many(productVariants),
    images: many(productImages),
    allergens: many(productAllergens),
    tags: many(productTags),
}));

export const productVariantsRelations = relations(productVariants, ({ one }) => ({
    product: one(products, {
        fields: [productVariants.productId],
        references: [products.id],
    }),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
    product: one(products, {
        fields: [productImages.productId],
        references: [products.id],
    }),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
    products: many(productTags),
}));

export const productTagsRelations = relations(productTags, ({ one }) => ({
    product: one(products, {
        fields: [productTags.productId],
        references: [products.id],
    }),
    tag: one(tags, {
        fields: [productTags.tagId],
        references: [tags.id],
    }),
}));

export const allergensRelations = relations(allergens, ({ many }) => ({
    products: many(productAllergens),
}));

export const productAllergensRelations = relations(productAllergens, ({ one }) => ({
    product: one(products, {
        fields: [productAllergens.productId],
        references: [products.id],
    }),
    allergen: one(allergens, {
        fields: [productAllergens.allergenId],
        references: [allergens.id],
    }),
}));