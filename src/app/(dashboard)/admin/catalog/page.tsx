import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderTree, Package, ChefHat, AlertTriangle, Eye, EyeOff } from "lucide-react";
import { adminCategoryQueries, adminProductQueries, recipeQueries } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Suspense } from "react";
import Link from "next/link";

async function getCatalogStats() {
  try {
    // Get category stats
    const categories = await adminCategoryQueries.getAll();
    const activeCategories = categories.filter(cat => cat.isActive);
    const inactiveCategories = categories.filter(cat => !cat.isActive);

    // Get product stats
    const productStats = await adminProductQueries.getStats();

    // Get recipe stats
    const recipeStats = await recipeQueries.getStats();

    // Get recent activity

    const recentProducts = await adminProductQueries.getAll({
      limit: 5,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });

    const recentRecipes = await recipeQueries.search({
      limit: 5,
      sort: { field: 'createdAt', direction: 'desc' },
      includeCreator: true
    });

    return {
      categories: {
        total: categories.length,
        active: activeCategories.length,
        inactive: inactiveCategories.length,
      },
      products: productStats,
      recipes: recipeStats,
      recentProducts: recentProducts.slice(0, 5),
      recentRecipes: recentRecipes.slice(0, 5),
    };
  } catch (error) {
    console.error("Error fetching catalog stats:", error);
    return {
      categories: { total: 0, active: 0, inactive: 0 },
      products: { total: 0, active: 0, lowStock: 0, outOfStock: 0 },
      recipes: { total: 0, private: 0, public: 0, withProducts: 0 },
      recentProducts: [],
      recentRecipes: [],
    };
  }
}

function StatsCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16 mb-1" />
        <Skeleton className="h-3 w-32" />
      </CardContent>
    </Card>
  );
}

function RecentActivitySkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-8 w-8 rounded" />
                <div>
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
              <Skeleton className="h-5 w-16" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

async function CatalogStats() {
  const stats = await getCatalogStats();

  return (
    <>
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <FolderTree className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.categories.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.categories.active} active, {stats.categories.inactive} inactive
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.products.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.products.active} active
              {stats.products.lowStock > 0 && (
                <span className="text-amber-600 ml-1">
                  • {stats.products.lowStock} low stock
                </span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recipes</CardTitle>
            <ChefHat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recipes.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.recipes.public} public, {stats.recipes.private} private
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {stats.products.lowStock + stats.products.outOfStock}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.products.outOfStock} out of stock
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common catalog management tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <Button asChild className="h-auto p-4 flex-col space-y-2">
              <Link href="/admin/catalog/categories/new">
                <FolderTree className="h-6 w-6" />
                <span>Add Category</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex-col space-y-2">
              <Link href="/admin/catalog/products/new">
                <Package className="h-6 w-6" />
                <span>Add Product</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex-col space-y-2">
              <Link href="/admin/catalog/recipes/new">
                <ChefHat className="h-6 w-6" />
                <span>Add Recipe</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Recent Products
            </CardTitle>
            <CardDescription>
              Latest product additions and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recentProducts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No recent products
              </div>
            ) : (
              <div className="space-y-4">
                {stats.recentProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-muted">
                        <Package className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.categoryName || "No category"} • ${product.basePrice}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!product.isActive && (
                        <Badge variant="secondary" className="text-xs">
                          <EyeOff className="w-3 h-3 mr-1" />
                          Inactive
                        </Badge>
                      )}
                      {product.stockQuantity !== null && product.stockQuantity <= 5 && product.stockQuantity > 0 && (
                        <Badge variant="outline" className="text-xs text-amber-600">
                          Low Stock
                        </Badge>
                      )}
                      {product.stockQuantity === 0 && (
                        <Badge variant="destructive" className="text-xs">
                          Out of Stock
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="h-5 w-5" />
              Recent Recipes
            </CardTitle>
            <CardDescription>
              Latest recipe additions and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recentRecipes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No recent recipes
              </div>
            ) : (
              <div className="space-y-4">
                {stats.recentRecipes.map((recipe) => (
                  <div key={recipe.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-muted">
                        <ChefHat className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{recipe.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {recipe.creatorName || "Unknown"} •
                          {recipe.difficulty && ` ${recipe.difficulty}`}
                          {recipe.totalTime && ` • ${recipe.totalTime}min`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {recipe.isPrivate ? (
                        <Badge variant="secondary" className="text-xs">
                          <EyeOff className="w-3 h-3 mr-1" />
                          Private
                        </Badge>
                      ) : (
                        <Badge variant="default" className="text-xs">
                          <Eye className="w-3 h-3 mr-1" />
                          Public
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default function CatalogDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Catalog Management</h1>
          <p className="text-muted-foreground">
            Manage your bakery&apos;s categories, products, and recipes
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button asChild variant="outline">
            <Link href="/admin/catalog/categories">
              <FolderTree className="h-4 w-4 mr-2" />
              Categories
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/catalog/products">
              <Package className="h-4 w-4 mr-2" />
              Products
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/catalog/recipes">
              <ChefHat className="h-4 w-4 mr-2" />
              Recipes
            </Link>
          </Button>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatsCardSkeleton />
              <StatsCardSkeleton />
              <StatsCardSkeleton />
              <StatsCardSkeleton />
            </div>
            <RecentActivitySkeleton />
            <div className="grid gap-6 md:grid-cols-2">
              <RecentActivitySkeleton />
              <RecentActivitySkeleton />
            </div>
          </div>
        }
      >
        <CatalogStats />
      </Suspense>
    </div>
  );
}