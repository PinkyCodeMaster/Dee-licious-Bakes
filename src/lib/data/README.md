# Data Query Utilities Documentation

This directory contains all database query utilities for the cake e-commerce application, organized by domain.

## Structure

### Query Modules
- **`products.ts`** - Product catalog queries (search, filtering, recommendations)
- **`categories.ts`** - Category hierarchy and navigation queries
- **`filters.ts`** - Faceted search and filter option queries
- **`cart.ts`** - Shopping cart and wishlist queries
- **`orders.ts`** - Order management and analytics queries
- **`messages.ts`** - Customer messaging and custom request queries

### Usage

Import query utilities from the main index file:

```typescript
import { 
  productQueries, 
  categoryQueries, 
  cartQueries, 
  orderQueries 
} from '@/lib/data';
```

Or import from specific modules:

```typescript
import { productQueries } from '@/lib/data/products';
import { categoryQueries } from '@/lib/data/categories';
```

## Query Categories

### Product Queries (`products.ts`)
- **Search & Filtering**: Complex product search with multiple filters
- **Recommendations**: Related and recommended products
- **Categorization**: Products by category with filtering
- **Text Search**: Full-text search across product fields

### Category Queries (`categories.ts`)
- **Hierarchy Management**: Category trees and breadcrumbs
- **Statistics**: Product counts per category
- **Navigation**: Root categories and subcategories

### Filter Queries (`filters.ts`)
- **Faceted Search**: Dynamic filter options with counts
- **Price Ranges**: Min/max price calculations
- **Tag Management**: Popular and categorized tags
- **Suggestions**: Smart filter recommendations

### Cart Queries (`cart.ts`)
- **Cart Management**: User and session-based carts
- **Wishlist Operations**: Multiple wishlists per user
- **Summaries**: Cart totals and item counts
- **Recent Activity**: Recently added items

### Order Queries (`orders.ts`)
- **Order Management**: Full order details with items
- **User Orders**: Order history with filtering
- **Analytics**: Sales statistics and popular products
- **Status Tracking**: Orders by status and delivery date

### Message Queries (`messages.ts`)
- **Thread Management**: Message threads with unread counts
- **Custom Requests**: Special order requests and quotes
- **Activity Tracking**: Recent messages and requests
- **Statistics**: Message and request analytics

## Usage Examples

### Product Search
```typescript
import { productQueries } from '@/lib/data';

// Search products with filters
const products = await productQueries.search({
  query: 'chocolate cake',
  filters: {
    categorySlug: 'cakes',
    priceMin: 20,
    priceMax: 100,
    tags: ['gluten-free'],
  },
  sort: { field: 'price', direction: 'asc' },
  limit: 20,
  includeVariants: true,
  includeImages: true,
});

// Get featured products
const featured = await productQueries.getFeatured(8);

// Get recommendations
const recommended = await productQueries.getRecommended(productId, 4);
```

### Category Navigation
```typescript
import { categoryQueries } from '@/lib/data';

// Get category tree
const categoryTree = await categoryQueries.getTree();

// Get category with stats
const category = await categoryQueries.getBySlug('wedding-cakes');

// Get breadcrumb path
const breadcrumb = await categoryQueries.getBreadcrumb(categoryId);
```

### Cart Operations
```typescript
import { cartQueries } from '@/lib/data';

// Get user's cart
const cart = await cartQueries.getByUserId(userId);

// Get cart summary
const summary = await cartQueries.getSummary(cartId);

// Get user's wishlists
const wishlists = await cartQueries.getUserWishlists(userId);
```

### Order Management
```typescript
import { orderQueries } from '@/lib/data';

// Get order details
const order = await orderQueries.getById(orderId);

// Get user's orders
const userOrders = await orderQueries.getUserOrders(userId, {
  limit: 10,
  status: ['delivered', 'preparing'],
});

// Get order analytics
const analytics = await orderQueries.getAnalytics(dateFrom, dateTo);
```

### Filter Facets
```typescript
import { filterQueries } from '@/lib/data';

// Get all filter options
const facets = await filterQueries.getFacets();

// Get popular tags
const popularTags = await filterQueries.getPopularTags(10);

// Get dietary options
const dietaryTags = await filterQueries.getDietaryTags();
```

## Best Practices

1. **Use appropriate query methods** for your use case (search vs. specific getters)
2. **Include only needed data** using the include options to avoid over-fetching
3. **Implement pagination** for large result sets
4. **Cache frequently accessed data** like categories and popular products
5. **Use transactions** for operations that modify multiple tables
6. **Handle errors gracefully** with proper error boundaries
7. **Optimize queries** by adding appropriate database indexes

## Performance Considerations

- **Indexes**: All query utilities assume proper database indexes are in place
- **Pagination**: Always use limit/offset for large datasets
- **Joins**: Complex queries with multiple joins are optimized for readability over performance
- **Caching**: Consider implementing query result caching for frequently accessed data
- **Batch Operations**: Use batch queries when fetching related data for multiple items

## Database Schema Dependencies

These queries depend on the following database tables:
- `products`, `product_variants`, `product_images`
- `categories` (hierarchical)
- `tags`, `product_tags`
- `allergens`, `product_allergens`
- `carts`, `cart_items`
- `wishlists`, `wishlist_items`
- `orders`, `order_items`, `order_status_history`
- `message_threads`, `messages`, `custom_requests`

All queries use Drizzle ORM for type safety and are compatible with PostgreSQL.