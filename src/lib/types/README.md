# Types Documentation

This directory contains TypeScript type definitions generated from Drizzle schema definitions for the cake e-commerce application.

## Structure

### Core Types
- **`auth.ts`** - Authentication and user-related types
- **`products.ts`** - Product catalog types (products, categories, variants, images, tags, allergens)
- **`cart.ts`** - Shopping cart and wishlist types
- **`orders.ts`** - Order management and order history types
- **`messages.ts`** - Customer messaging and custom request types

### Usage

Import types from the main index file:

```typescript
import { 
  Product, 
  ProductWithDetails, 
  Cart, 
  CartWithItems, 
  Order, 
  OrderWithDetails 
} from '@/lib/types';
```

Or import from specific modules:

```typescript
import { Product, Category } from '@/lib/types/products';
import { Cart, CartItem } from '@/lib/types/cart';
```

## Type Categories

### Base Types
Generated directly from Drizzle schema using `InferSelectModel` and `InferInsertModel`:
- `Product`, `NewProduct`
- `Category`, `NewCategory`
- `Cart`, `NewCart`
- etc.

### Extended Types
Enhanced types with relationships and additional properties:
- `ProductWithDetails` - Product with category, variants, images, tags, and allergens
- `CartWithItems` - Cart with populated cart items and user
- `OrderWithDetails` - Order with items, status history, and user

### Utility Types
Enums and filter/sort types:
- `ProductSortOption`, `OrderStatus`, `PaymentStatus`
- `ProductFilterOptions`, `OrderFilterOptions`
- JSON field types like `VariantAttributes`, `DeliveryAddress`

## Best Practices

1. **Use extended types** for components that need relationship data
2. **Use base types** for simple CRUD operations
3. **Import from index** for better tree-shaking and cleaner imports
4. **Leverage utility types** for consistent filtering and sorting interfaces