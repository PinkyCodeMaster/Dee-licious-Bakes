import { Suspense } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryTable } from "@/components/dashboard/catalog/category-table";
import { CategoryDialog } from "@/components/dashboard/catalog/category-dialog";
import { adminCategoryQueries } from "@/lib/data/categories";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories",
  description: "Manage your catalog categories",
};

export default async function CategoriesPage() {
  const categories = await adminCategoryQueries.getHierarchy();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">
            Organize your catalog with hierarchical categories
          </p>
        </div>
        <CategoryDialog>
          <Button>
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        </CategoryDialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Management</CardTitle>
          <CardDescription>
            Create, edit, and organize your product categories. Drag and drop to reorder.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading categories...</div>}>
            <CategoryTable categories={categories} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}