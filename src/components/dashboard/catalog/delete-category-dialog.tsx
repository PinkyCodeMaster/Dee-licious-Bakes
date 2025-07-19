"use client";

import { useState } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { deleteCategory } from "./category-actions";
import type { CategoryWithStats } from "@/lib/data/categories";

interface DeleteCategoryDialogProps {
  category: CategoryWithStats;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteCategoryDialog({ 
  category, 
  open, 
  onOpenChange 
}: DeleteCategoryDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const hasProducts = category.productCount > 0;
  const hasChildren = category.children && category.children.length > 0;
  const canDelete = !hasProducts && !hasChildren;

  const handleDelete = async () => {
    if (!canDelete) return;

    setIsLoading(true);
    try {
      const result = await deleteCategory(category.id);
      
      if (result.success) {
        toast.success("Category deleted successfully");
        onOpenChange(false);
        // Refresh the page to show updated data
        window.location.reload();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Failed to delete category:", error);
      toast.error("Failed to delete category");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Category
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the category &quot;{category.name}&quot;?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!canDelete && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This category cannot be deleted because:
                <ul className="mt-2 list-disc list-inside space-y-1">
                  {hasProducts && (
                    <li>It has {category.productCount} assigned products</li>
                  )}
                  {hasChildren && (
                    <li>It has {category.children?.length} subcategories</li>
                  )}
                </ul>
                <p className="mt-2 text-sm">
                  Please move or delete the associated items first.
                </p>
              </AlertDescription>
            </Alert>
          )}

          {canDelete && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This action cannot be undone. The category will be permanently deleted.
              </AlertDescription>
            </Alert>
          )}

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Category Details:</h4>
            <div className="space-y-1 text-sm">
              <div><strong>Name:</strong> {category.name}</div>
              <div><strong>Slug:</strong> {category.slug}</div>
              <div><strong>Products:</strong> {category.productCount}</div>
              <div><strong>Subcategories:</strong> {category.children?.length || 0}</div>
              <div><strong>Status:</strong> {category.isActive ? "Active" : "Inactive"}</div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={!canDelete || isLoading}
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Delete Category
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}