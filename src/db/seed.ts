#!/usr/bin/env tsx
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import { env } from '../lib/env';
import {
    categories,
    products,
    productVariants,
    productImages,
    tags,
    productTags,
    allergens,
    productAllergens
} from './schema/products';

const db = drizzle(env.DATABASE_URL);

// Generate unique IDs
function generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

async function seedDatabase() {
    console.log('🌱 Starting database seeding...');

    try {
        // 1. Seed Categories
        console.log('📁 Seeding categories...');
        const categoryData = [
            {
                id: generateId('cat'),
                name: 'Cakes',
                slug: 'cakes',
                description: 'Delicious cakes for all occasions',
                parentId: null,
                sortOrder: 1,
                isActive: true
            },
            {
                id: generateId('cat'),
                name: 'Birthday Cakes',
                slug: 'birthday-cakes',
                description: 'Special cakes for birthday celebrations',
                parentId: null, // Will be updated after inserting parent
                sortOrder: 1,
                isActive: true
            },
            {
                id: generateId('cat'),
                name: 'Cupcakes',
                slug: 'cupcakes',
                description: 'Individual portion cupcakes',
                parentId: null,
                sortOrder: 2,
                isActive: true
            },
            {
                id: generateId('cat'),
                name: 'Cookies',
                slug: 'cookies',
                description: 'Freshly baked cookies',
                parentId: null,
                sortOrder: 3,
                isActive: true
            },
            {
                id: generateId('cat'),
                name: 'Cheesecakes',
                slug: 'cheesecakes',
                description: 'Rich and creamy cheesecakes',
                parentId: null, // Will be updated to be under Cakes
                sortOrder: 1,
                isActive: true
            },
            {
                id: generateId('cat'),
                name: 'Muffins',
                slug: 'muffins',
                description: 'Soft and fluffy muffins',
                parentId: null,
                sortOrder: 4,
                isActive: true
            },
            {
                id: generateId('cat'),
                name: 'Doughnuts',
                slug: 'doughnuts',
                description: 'Glazed and filled doughnuts',
                parentId: null,
                sortOrder: 5,
                isActive: true
            }
        ];

        const insertedCategories = await db.insert(categories).values(categoryData).returning();
        
        // Update parent relationships
        const cakesCategory = insertedCategories.find(c => c.slug === 'cakes');
        const birthdayCategory = insertedCategories.find(c => c.slug === 'birthday-cakes');
        const cheesecakeCategory = insertedCategories.find(c => c.slug === 'cheesecakes');
        
        if (cakesCategory && birthdayCategory) {
            await db.update(categories)
                .set({ parentId: cakesCategory.id })
                .where(eq(categories.id, birthdayCategory.id));
        }
        
        if (cakesCategory && cheesecakeCategory) {
            await db.update(categories)
                .set({ parentId: cakesCategory.id })
                .where(eq(categories.id, cheesecakeCategory.id));
        }

        console.log(`✅ Inserted ${insertedCategories.length} categories`);

        // 2. Seed Tags
        console.log('🏷️ Seeding tags...');
        const tagData = [
            // Dietary tags
            { id: generateId('tag'), name: 'Gluten-Free', type: 'dietary', color: '#10B981' },
            { id: generateId('tag'), name: 'Vegan', type: 'dietary', color: '#059669' },
            { id: generateId('tag'), name: 'Sugar-Free', type: 'dietary', color: '#0D9488' },
            { id: generateId('tag'), name: 'Dairy-Free', type: 'dietary', color: '#0891B2' },
            { id: generateId('tag'), name: 'Nut-Free', type: 'dietary', color: '#0284C7' },
            
            // Occasion tags
            { id: generateId('tag'), name: 'Birthday', type: 'occasion', color: '#DC2626' },
            // { id: generateId('tag'), name: 'Wedding', type: 'occasion', color: '#DB2777' },
            { id: generateId('tag'), name: 'Anniversary', type: 'occasion', color: '#C026D3' },
            { id: generateId('tag'), name: 'Holiday', type: 'occasion', color: '#9333EA' },
            { id: generateId('tag'), name: 'Corporate', type: 'occasion', color: '#7C3AED' },
            
            // Flavor tags
            { id: generateId('tag'), name: 'Chocolate', type: 'flavor', color: '#92400E' },
            { id: generateId('tag'), name: 'Vanilla', type: 'flavor', color: '#F59E0B' },
            { id: generateId('tag'), name: 'Strawberry', type: 'flavor', color: '#EF4444' },
            { id: generateId('tag'), name: 'Lemon', type: 'flavor', color: '#EAB308' },
            { id: generateId('tag'), name: 'Caramel', type: 'flavor', color: '#D97706' },
            
            // Special tags
            { id: generateId('tag'), name: 'Best Seller', type: 'special', color: '#F59E0B' },
            { id: generateId('tag'), name: 'New', type: 'special', color: '#10B981' },
            { id: generateId('tag'), name: 'Seasonal', type: 'special', color: '#8B5CF6' }
        ];

        const insertedTags = await db.insert(tags).values(tagData).returning();
        console.log(`✅ Inserted ${insertedTags.length} tags`);

        // 3. Seed Allergens
        console.log('⚠️ Seeding allergens...');
        const allergenData = [
            { id: generateId('allergen'), name: 'Gluten', description: 'Contains wheat, barley, rye, or oats', severity: 'moderate' },
            { id: generateId('allergen'), name: 'Dairy', description: 'Contains milk or milk products', severity: 'moderate' },
            { id: generateId('allergen'), name: 'Eggs', description: 'Contains eggs or egg products', severity: 'mild' },
            { id: generateId('allergen'), name: 'Nuts', description: 'Contains tree nuts', severity: 'severe' },
            { id: generateId('allergen'), name: 'Peanuts', description: 'Contains peanuts or peanut products', severity: 'severe' },
            { id: generateId('allergen'), name: 'Soy', description: 'Contains soy or soy products', severity: 'mild' },
            { id: generateId('allergen'), name: 'Sesame', description: 'Contains sesame seeds', severity: 'moderate' }
        ];

        const insertedAllergens = await db.insert(allergens).values(allergenData).returning();
        console.log(`✅ Inserted ${insertedAllergens.length} allergens`);

        // 4. Seed Products
        console.log('🍰 Seeding products...');
        const productData = [
            // Cheesecakes
            {
                id: generateId('prod'),
                name: 'Classic Cheesecake',
                slug: 'classic-cheesecake',
                description: 'Rich and creamy New York style cheesecake with a graham cracker crust. Made with premium cream cheese and vanilla.',
                shortDescription: 'Rich and creamy New York style cheesecake',
                categoryId: cheesecakeCategory?.id || insertedCategories[0].id,
                basePrice: '24.99',
                isActive: true,
                stockQuantity: 50,
                minSlices: 8,
                maxSlices: 12,
                servingSize: '8-12 slices',
                preparationTime: '24 hours'
            },
            {
                id: generateId('prod'),
                name: 'Chocolate Birthday Cake',
                slug: 'chocolate-birthday-cake',
                description: 'Decadent three-layer chocolate cake with rich chocolate buttercream frosting. Perfect for birthday celebrations.',
                shortDescription: 'Three-layer chocolate cake with buttercream',
                categoryId: birthdayCategory?.id || insertedCategories[1].id,
                basePrice: '32.99',
                isActive: true,
                stockQuantity: 30,
                minSlices: 10,
                maxSlices: 16,
                servingSize: '10-16 slices',
                preparationTime: '4 hours'
            },
            {
                id: generateId('prod'),
                name: 'Assorted Cupcakes',
                slug: 'assorted-cupcakes',
                description: 'A delightful mix of our most popular cupcake flavors including vanilla, chocolate, and strawberry.',
                shortDescription: 'Mix of vanilla, chocolate, and strawberry cupcakes',
                categoryId: insertedCategories.find(c => c.slug === 'cupcakes')?.id || insertedCategories[2].id,
                basePrice: '18.99',
                isActive: true,
                stockQuantity: 100,
                minSlices: 6,
                maxSlices: 12,
                servingSize: '6-12 cupcakes',
                preparationTime: '2 hours'
            },
            {
                id: generateId('prod'),
                name: 'Chocolate Chip Cookies',
                slug: 'chocolate-chip-cookies',
                description: 'Freshly baked chocolate chip cookies with premium chocolate chips. Soft and chewy texture.',
                shortDescription: 'Soft and chewy chocolate chip cookies',
                categoryId: insertedCategories.find(c => c.slug === 'cookies')?.id || insertedCategories[3].id,
                basePrice: '12.99',
                isActive: true,
                stockQuantity: 200,
                minSlices: 12,
                maxSlices: 24,
                servingSize: '12-24 cookies',
                preparationTime: '1 hour'
            },
            {
                id: generateId('prod'),
                name: 'Blueberry Muffins',
                slug: 'blueberry-muffins',
                description: 'Fluffy muffins packed with fresh blueberries and a hint of lemon zest.',
                shortDescription: 'Fresh blueberry muffins with lemon zest',
                categoryId: insertedCategories.find(c => c.slug === 'muffins')?.id || insertedCategories[5].id,
                basePrice: '15.99',
                isActive: true,
                stockQuantity: 80,
                minSlices: 6,
                maxSlices: 12,
                servingSize: '6-12 muffins',
                preparationTime: '1.5 hours'
            },
            {
                id: generateId('prod'),
                name: 'Glazed Doughnuts',
                slug: 'glazed-doughnuts',
                description: 'Light and airy yeast doughnuts with a sweet glaze. Made fresh daily.',
                shortDescription: 'Fresh glazed yeast doughnuts',
                categoryId: insertedCategories.find(c => c.slug === 'doughnuts')?.id || insertedCategories[6].id,
                basePrice: '8.99',
                isActive: true,
                stockQuantity: 150,
                minSlices: 6,
                maxSlices: 12,
                servingSize: '6-12 doughnuts',
                preparationTime: '3 hours'
            }
        ];

        const insertedProducts = await db.insert(products).values(productData).returning();
        console.log(`✅ Inserted ${insertedProducts.length} products`);

        // 5. Seed Product Variants
        console.log('🎯 Seeding product variants...');
        const variantData = [];
        
        // Cheesecake variants
        const cheesecakeProduct = insertedProducts.find(p => p.slug === 'classic-cheesecake');
        if (cheesecakeProduct) {
            variantData.push(
                {
                    id: generateId('variant'),
                    productId: cheesecakeProduct.id,
                    name: 'Strawberry Cheesecake - Small',
                    sku: 'CHEESE-STRAW-SM',
                    price: '22.99',
                    stockQuantity: 20,
                    isDefault: false,
                    flavor: 'Strawberry',
                    size: 'Small',
                    type: 'Classic',
                    description: 'Small strawberry cheesecake (6-8 slices)',
                    isAvailable: true
                },
                {
                    id: generateId('variant'),
                    productId: cheesecakeProduct.id,
                    name: 'Chocolate Cheesecake - Large',
                    sku: 'CHEESE-CHOC-LG',
                    price: '28.99',
                    stockQuantity: 15,
                    isDefault: false,
                    flavor: 'Chocolate',
                    size: 'Large',
                    type: 'Premium',
                    description: 'Large chocolate cheesecake (10-12 slices)',
                    isAvailable: true
                },
                {
                    id: generateId('variant'),
                    productId: cheesecakeProduct.id,
                    name: 'Classic Cheesecake - Individual',
                    sku: 'CHEESE-CLASSIC-IND',
                    price: '4.99',
                    stockQuantity: 50,
                    isDefault: true,
                    flavor: 'Classic',
                    size: 'Individual',
                    type: 'Classic',
                    description: 'Individual classic cheesecake slice',
                    isAvailable: true
                }
            );
        }

        // Cookie variants
        const cookieProduct = insertedProducts.find(p => p.slug === 'chocolate-chip-cookies');
        if (cookieProduct) {
            variantData.push(
                {
                    id: generateId('variant'),
                    productId: cookieProduct.id,
                    name: 'Chocolate Chip Cookies - Dozen',
                    sku: 'COOKIE-CHOC-12',
                    price: '12.99',
                    stockQuantity: 100,
                    isDefault: true,
                    flavor: 'Chocolate Chip',
                    size: 'Dozen',
                    type: 'Classic',
                    description: '12 chocolate chip cookies',
                    isAvailable: true
                },
                {
                    id: generateId('variant'),
                    productId: cookieProduct.id,
                    name: 'Oatmeal Cookies - Half Dozen',
                    sku: 'COOKIE-OATMEAL-6',
                    price: '7.99',
                    stockQuantity: 80,
                    isDefault: false,
                    flavor: 'Oatmeal',
                    size: 'Half Dozen',
                    type: 'Classic',
                    description: '6 oatmeal raisin cookies',
                    isAvailable: true
                },
                {
                    id: generateId('variant'),
                    productId: cookieProduct.id,
                    name: 'Sugar Cookies - Dozen',
                    sku: 'COOKIE-SUGAR-12',
                    price: '11.99',
                    stockQuantity: 60,
                    isDefault: false,
                    flavor: 'Sugar',
                    size: 'Dozen',
                    type: 'Classic',
                    description: '12 decorated sugar cookies',
                    isAvailable: true
                }
            );
        }

        // Birthday cake variants
        const birthdayCakeProduct = insertedProducts.find(p => p.slug === 'chocolate-birthday-cake');
        if (birthdayCakeProduct) {
            variantData.push(
                {
                    id: generateId('variant'),
                    productId: birthdayCakeProduct.id,
                    name: 'Chocolate Birthday Cake - Small',
                    sku: 'BDAY-CHOC-SM',
                    price: '28.99',
                    stockQuantity: 15,
                    isDefault: false,
                    flavor: 'Chocolate',
                    size: 'Small',
                    type: 'Birthday',
                    description: 'Small chocolate birthday cake (8-10 slices)',
                    isAvailable: true
                },
                {
                    id: generateId('variant'),
                    productId: birthdayCakeProduct.id,
                    name: 'Vanilla Birthday Cake - Large',
                    sku: 'BDAY-VAN-LG',
                    price: '36.99',
                    stockQuantity: 10,
                    isDefault: false,
                    flavor: 'Vanilla',
                    size: 'Large',
                    type: 'Birthday',
                    description: 'Large vanilla birthday cake (12-16 slices)',
                    isAvailable: true
                }
            );
        }

        const insertedVariants = await db.insert(productVariants).values(variantData).returning();
        console.log(`✅ Inserted ${insertedVariants.length} product variants`);

        // 6. Seed Product Images
        console.log('🖼️ Seeding product images...');
        const imageData = [];
        
        for (const product of insertedProducts) {
            imageData.push({
                id: generateId('img'),
                productId: product.id,
                url: `/images/products/${product.slug}-main.jpg`,
                altText: `${product.name} main image`,
                sortOrder: 0,
                isMain: true
            });
            
            // Add a secondary image for each product
            imageData.push({
                id: generateId('img'),
                productId: product.id,
                url: `/images/products/${product.slug}-detail.jpg`,
                altText: `${product.name} detail view`,
                sortOrder: 1,
                isMain: false
            });
        }

        const insertedImages = await db.insert(productImages).values(imageData).returning();
        console.log(`✅ Inserted ${insertedImages.length} product images`);

        // 7. Seed Product-Tag relationships
        console.log('🔗 Seeding product-tag relationships...');
        const productTagData = [];
        
        // Get tag references
        const chocolateTag = insertedTags.find(t => t.name === 'Chocolate');
        const vanillaTag = insertedTags.find(t => t.name === 'Vanilla');
        const birthdayTag = insertedTags.find(t => t.name === 'Birthday');
        const bestSellerTag = insertedTags.find(t => t.name === 'Best Seller');
        const newTag = insertedTags.find(t => t.name === 'New');

        // Assign tags to products
        for (const product of insertedProducts) {
            if (product.slug === 'classic-cheesecake') {
                if (bestSellerTag) productTagData.push({ productId: product.id, tagId: bestSellerTag.id });
                if (vanillaTag) productTagData.push({ productId: product.id, tagId: vanillaTag.id });
            }
            
            if (product.slug === 'chocolate-birthday-cake') {
                if (chocolateTag) productTagData.push({ productId: product.id, tagId: chocolateTag.id });
                if (birthdayTag) productTagData.push({ productId: product.id, tagId: birthdayTag.id });
                if (bestSellerTag) productTagData.push({ productId: product.id, tagId: bestSellerTag.id });
            }
            
            if (product.slug === 'chocolate-chip-cookies') {
                if (chocolateTag) productTagData.push({ productId: product.id, tagId: chocolateTag.id });
                if (newTag) productTagData.push({ productId: product.id, tagId: newTag.id });
            }
            
            if (product.slug === 'blueberry-muffins') {
                if (newTag) productTagData.push({ productId: product.id, tagId: newTag.id });
            }
        }

        if (productTagData.length > 0) {
            await db.insert(productTags).values(productTagData);
            console.log(`✅ Inserted ${productTagData.length} product-tag relationships`);
        }

        // 8. Seed Product-Allergen relationships
        console.log('⚠️ Seeding product-allergen relationships...');
        const productAllergenData = [];
        
        // Get allergen references
        const glutenAllergen = insertedAllergens.find(a => a.name === 'Gluten');
        const dairyAllergen = insertedAllergens.find(a => a.name === 'Dairy');
        const eggsAllergen = insertedAllergens.find(a => a.name === 'Eggs');
        const nutsAllergen = insertedAllergens.find(a => a.name === 'Nuts');

        // Assign allergens to products
        for (const product of insertedProducts) {
            // Most baked goods contain gluten, dairy, and eggs
            if (glutenAllergen) {
                productAllergenData.push({
                    productId: product.id,
                    allergenId: glutenAllergen.id,
                    containsAllergen: true,
                    mayContain: false
                });
            }
            
            if (dairyAllergen) {
                productAllergenData.push({
                    productId: product.id,
                    allergenId: dairyAllergen.id,
                    containsAllergen: true,
                    mayContain: false
                });
            }
            
            if (eggsAllergen) {
                productAllergenData.push({
                    productId: product.id,
                    allergenId: eggsAllergen.id,
                    containsAllergen: true,
                    mayContain: false
                });
            }
            
            // Some products may contain nuts
            if (nutsAllergen && (product.slug === 'chocolate-chip-cookies' || product.slug === 'blueberry-muffins')) {
                productAllergenData.push({
                    productId: product.id,
                    allergenId: nutsAllergen.id,
                    containsAllergen: false,
                    mayContain: true
                });
            }
        }

        if (productAllergenData.length > 0) {
            await db.insert(productAllergens).values(productAllergenData);
            console.log(`✅ Inserted ${productAllergenData.length} product-allergen relationships`);
        }

        console.log('🎉 Database seeding completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`- Categories: ${insertedCategories.length}`);
        console.log(`- Products: ${insertedProducts.length}`);
        console.log(`- Product Variants: ${insertedVariants.length}`);
        console.log(`- Product Images: ${insertedImages.length}`);
        console.log(`- Tags: ${insertedTags.length}`);
        console.log(`- Allergens: ${insertedAllergens.length}`);
        console.log(`- Product-Tag relationships: ${productTagData.length}`);
        console.log(`- Product-Allergen relationships: ${productAllergenData.length}`);

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
    seedDatabase()
        .then(() => {
            console.log('✅ Seeding completed');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Seeding failed:', error);
            process.exit(1);
        });
}

export { seedDatabase };