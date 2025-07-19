// Export all schema modules with namespace
export * as authschema from './auth'
export * as productsschema from './products'
export * as cartschema from './cart'
export * as ordersschema from './orders'
export * as messagesschema from './messages'

// Export individual tables for direct access
export { user, session, account, verification } from './auth'

export {
    categories,
    products,
    productVariants,
    productImages,
    tags,
    productTags,
    allergens,
    productAllergens,
    categoriesRelations,
    productsRelations,
    productVariantsRelations,
    productImagesRelations,
    tagsRelations,
    productTagsRelations,
    allergensRelations,
    productAllergensRelations
} from './products'

export {
    carts,
    cartItems,
    wishlists,
    wishlistItems,
    cartsRelations,
    cartItemsRelations,
    wishlistsRelations,
    wishlistItemsRelations
} from './cart'

export {
    orders,
    orderItems,
    orderStatusHistory,
    ordersRelations,
    orderItemsRelations,
    orderStatusHistoryRelations
} from './orders'

export {
    messageThreads,
    messages,
    customRequests,
    messageThreadsRelations,
    messagesRelations,
    customRequestsRelations
} from './messages'