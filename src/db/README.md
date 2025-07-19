# Database Seeding

This directory contains the database seeding script for populating the cake e-commerce database with sample data for testing and development.

## Seed Data Overview

The seed script creates comprehensive test data including:

### Categories (7 total)
- **Cakes** (parent category)
  - Birthday Cakes (child)
  - Cheesecakes (child)
- **Cupcakes**
- **Cookies**
- **Muffins**
- **Doughnuts**

### Products (6 total)
- Classic Cheesecake
- Chocolate Birthday Cake
- Assorted Cupcakes
- Chocolate Chip Cookies
- Blueberry Muffins
- Glazed Doughnuts

### Product Variants
- Multiple size options (Small, Large, Individual)
- Different flavors (Strawberry, Chocolate, Vanilla, etc.)
- Various quantities (Half Dozen, Dozen)

### Tags (18 total)
- **Dietary**: Gluten-Free, Vegan, Sugar-Free, Dairy-Free, Nut-Free
- **Occasion**: Birthday, Wedding, Anniversary, Holiday, Corporate
- **Flavor**: Chocolate, Vanilla, Strawberry, Lemon, Caramel
- **Special**: Best Seller, New, Seasonal

### Allergens (7 total)
- Gluten, Dairy, Eggs, Nuts, Peanuts, Soy, Sesame
- Each with severity levels (mild, moderate, severe)

### Relationships
- Product-Tag associations for filtering
- Product-Allergen mappings for safety information
- Product images (main and detail views)

## Usage

### Prerequisites
1. Ensure your database is set up and migrations are run:
   ```bash
   pnpm db:migrate
   ```

2. Make sure your `.env` file contains a valid `DATABASE_URL`

### Running the Seed Script

```bash
# Run the seed script
pnpm db:seed
```

### Alternative Methods

```bash
# Run directly with tsx
npx tsx src/db/seed.ts

# Or if tsx is installed globally
tsx src/db/seed.ts
```

## What Gets Created

The seed script will create:
- 7 categories with hierarchical relationships
- 6 products with detailed descriptions and specifications
- Multiple product variants with different sizes, flavors, and prices
- 18 tags for filtering and categorization
- 7 allergens with severity information
- Product images (placeholder URLs)
- Relationship mappings between products, tags, and allergens

## Sample Data Details

### Price Range
- Individual items: $4.99 - $8.99
- Small cakes/dozens: $11.99 - $28.99
- Large cakes: $32.99 - $36.99

### Stock Quantities
- High-volume items (cookies, doughnuts): 100-200 units
- Medium-volume items (cupcakes, muffins): 50-100 units
- Low-volume items (cakes): 10-50 units

### Preparation Times
- Quick items (cookies): 1 hour
- Medium items (cupcakes, muffins): 1.5-2 hours
- Complex items (doughnuts): 3 hours
- Specialty items (cakes): 4-24 hours

## Testing the Data

After seeding, you can:

1. **View in Drizzle Studio**:
   ```bash
   pnpm db:studio
   ```

2. **Query the data** in your application to test:
   - Category hierarchies
   - Product filtering by tags
   - Allergen information display
   - Variant selection
   - Image loading

## Resetting Data

To clear and re-seed the database:

1. Drop and recreate tables (if needed)
2. Run migrations again
3. Run the seed script

**Note**: The seed script uses unique IDs generated at runtime, so running it multiple times will create duplicate data unless you clear the tables first.