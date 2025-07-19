"use client";

import { useState } from "react";
import { MoreHorizontal, Edit, Trash2, Plus, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CategoryDialog } from "./category-dialog";
import { DeleteCategoryDialog } from "./delete-category-dialog";
import type { CategoryWithStats } from "@/lib/data/categories";

interface CategoryTableProps {
  categories: CategoryWithStats[];
}

export function CategoryTable({ categories }: CategoryTableProps) {
  const [editingCategory, setEditingCategory] = useState<CategoryWithStats | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<CategoryWithStats | null>(null);

  const renderCategoryRow = (category: CategoryWithStats, level: number = 0) => {
    const rows = [];
    
    // Main category row
    rows.push(
      <TableRow key={category.id}>
        <TableCell>
          <div className="flex items-center gap-2" style={{ paddingLeft: `${level * 24}px` }}>
            <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
            <span className="font-medium">{category.name}</span>
          </div>
        </TableCell>
        <TableCell>
          <code className="text-xs bg-muted px-2 py-1 rounded">
            {category.slug}
          </code>
        </TableCell>
        <TableCell>
          <span className="text-sm text-muted-foreground line-clamp-2">
            {category.description || "No description"}
          </span>
        </TableCell>
        <TableCell>
          <Badge variant="secondary">
            {category.productCount} products
          </Badge>
        </TableCell>
        <TableCell>
          <Badge variant={category.isActive ? "default" : "secondary"}>
            {category.isActive ? "Active" : "Inactive"}
          </Badge>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <CategoryDialog category={category}>
              <Button variant="ghost" size="sm">
                <Plus className="h-4 w-4" />
                Add Child
              </Button>
            </CategoryDialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditingCategory(category)}>
                  <Edit className="h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setDeletingCategory(category)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TableCell>
      </TableRow>
    );

    // Render children recursively
    if (category.children && category.children.length > 0) {
      category.children.forEach(child => {
        rows.push(...renderCategoryRow(child, level + 1));
      });
    }

    return rows;
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[200px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="text-muted-foreground">
                    No categories found. Create your first category to get started.
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              categories.flatMap(category => renderCategoryRow(category))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Category Dialog */}
      {editingCategory && (
        <CategoryDialog
          category={editingCategory}
          open={true}
          onOpenChange={(open) => !open && setEditingCategory(null)}
        />
      )}

      {/* Delete Category Dialog */}
      {deletingCategory && (
        <DeleteCategoryDialog
          category={deletingCategory}
          open={true}
          onOpenChange={(open) => !open && setDeletingCategory(null)}
        />
      )}
    </>
  );
}