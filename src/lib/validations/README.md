# Validation Schemas Documentation

This directory contains Zod validation schemas for input validation throughout the cake e-commerce application.

## Structure

### Core Validation Modules
- **`products.ts`** - Product catalog validation (products, categories, variants, images, tags, allergens)
- **`cart.ts`** - Shopping cart and wishlist validation
- **`orders.ts`** - Order management and checkout validation
- **`messages.ts`** - Customer messaging and custom request validation

### Usage

Import validation schemas from the main index file:

```typescript
import { 
  createProductSchema, 
  updateProductSchema,
  addToCartSchema,
  checkoutSchema 
} from '@/lib/validations';
```

Or import from specific modules:

```typescript
import { productSchema, categorySchema } from '@/lib/validations/products';
import { cartItemSchema } from '@/lib/validations/cart';
```

## Schema Categories

### CRUD Schemas
- **Base schemas** - Full object validation (e.g., `productSchema`)
- **Create schemas** - For new record creation (e.g., `createProductSchema`)
- **Update schemas** - For partial updates (e.g., `updateProductSchema`)

### Action Schemas
- **`addToCartSchema`** - Adding items to cart
- **`checkoutSchema`** - Order checkout process
- **`addToWishlistSchema`** - Adding items to wishlist

### Filter & Sort Schemas
- **`productFilterSchema`** - Product filtering options
- **`orderFilterSchema`** - Order filtering options
- **`productSortSchema`** - Product sorting options

### Bulk Operation Schemas
- **`bulkProductUpdateSchema`** - Bulk product updates
- **`bulkCartUpdateSchema`** - Bulk cart operations

## Usage Examples

### Form Validation
```typescript
import { createProductSchema } from '@/lib/validations';

const result = createProductSchema.safeParse(formData);
if (!result.success) {
  console.error(result.error.issues);
}
```

### API Route Validation
```typescript
import { updateOrderSchema } from '@/lib/validations';

export async function PUT(request: Request) {
  const body = await request.json();
  const validation = updateOrderSchema.safeParse(body);
  
  if (!validation.success) {
    return Response.json({ error: validation.error }, { status: 400 });
  }
  
  // Process validated data
  const validatedData = validation.data;
}
```

### React Hook Form Integration
```typescript
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { createProductSchema } from '@/lib/validations';

const form = useForm({
  resolver: zodResolver(createProductSchema),
});
```

## Best Practices

1. **Always validate user input** at API boundaries
2. **Use appropriate schema types** (create/update/base) for different operations
3. **Leverage TypeScript inference** with `z.infer<typeof schema>`
4. **Handle validation errors gracefully** with proper error messages
5. **Import from index** for better organization and tree-shaking