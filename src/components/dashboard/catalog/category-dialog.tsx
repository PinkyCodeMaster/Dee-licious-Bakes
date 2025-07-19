"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { createAdminCategorySchema, updateAdminCategorySchema } from "@/lib/validations/catalog";
import { createCategory, updateCategory, getAllCategoriesForAdmin } from "./category-actions";
import type { CategoryWithStats } from "@/lib/data/categories";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { z } from "zod";

type CreateCategoryData = z.infer<typeof createAdminCategorySchema>;
type UpdateCategoryData = z.infer<typeof updateAdminCategorySchema>;

// Helper function to check if a category is a descendant of another
const isDescendantOf = (potentialDescendant: CategoryWithStats, ancestor: CategoryWithStats, allCategories: CategoryWithStats[]): boolean => {
  if (potentialDescendant.parentId === ancestor.id) return true;
  if (!potentialDescendant.parentId) return false;

  const parent = allCategories.find(cat => cat.id === potentialDescendant.parentId);
  return parent ? isDescendantOf(parent, ancestor, allCategories) : false;
};

interface CategoryDialogProps {
  category?: CategoryWithStats;
  parentCategory?: CategoryWithStats;
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CategoryDialog({
  category,
  parentCategory,
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange
}: CategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [availableParents, setAvailableParents] = useState<CategoryWithStats[]>([]);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : open;
  const setIsOpen = isControlled ? controlledOnOpenChange || (() => { }) : setOpen;

  const isEditing = !!category;
  const isAddingChild = !!parentCategory;

  const form = useForm<CreateCategoryData | UpdateCategoryData>({
    resolver: zodResolver(isEditing ? updateAdminCategorySchema : createAdminCategorySchema),
    defaultValues: {
      name: category?.name || "",
      slug: category?.slug || "",
      description: category?.description || "",
      parentId: category?.parentId || parentCategory?.id || "",
      sortOrder: category?.sortOrder || 0,
      isActive: category?.isActive ?? true,
    },
  });

  // Load available parent categories
  useEffect(() => {
    const loadParentCategories = async () => {
      try {
        const categories = await getAllCategoriesForAdmin();
        // Filter out the current category and its descendants to prevent circular references
        const filtered = categories.filter(cat => {
          if (!category) return true;
          return cat.id !== category.id && !isDescendantOf(cat, category, categories);
        });
        setAvailableParents(filtered);
      } catch (error) {
        console.error("Failed to load parent categories:", error);
      }
    };

    if (isOpen) {
      loadParentCategories();
    }
  }, [isOpen, category]);





  // Auto-generate slug from name
  const watchName = form.watch("name");
  useEffect(() => {
    if (watchName && !isEditing) {
      const slug = watchName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      form.setValue("slug", slug);
    }
  }, [watchName, form, isEditing]);

  const onSubmit = async (data: CreateCategoryData | UpdateCategoryData) => {
    setIsLoading(true);
    try {
      if (isEditing && category) {
        await updateCategory(category.id, data as UpdateCategoryData);
        toast.success("Category updated successfully");
      } else {
        await createCategory(data as CreateCategoryData);
        toast.success("Category created successfully");
      }

      form.reset();
      setIsOpen(false);
      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error("Failed to save category:", error);
      toast.error(isEditing ? "Failed to update category" : "Failed to create category");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset();
    }
    setIsOpen(newOpen);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? "Edit Category"
              : isAddingChild
                ? `Add Subcategory to ${parentCategory?.name}`
                : "Create Category"
            }
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the category information below."
              : "Create a new category to organize your products."
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Category name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="category-slug" {...field} />
                    </FormControl>
                    <FormDescription>
                      URL-friendly version of the name
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Category description (optional)"
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="parentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select parent (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">No parent (root category)</SelectItem>
                        {availableParents.map((parent) => (
                          <SelectItem key={parent.id} value={parent.id}>
                            {parent.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sortOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sort Order</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      Lower numbers appear first
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active</FormLabel>
                    <FormDescription>
                      Active categories are visible to users
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {isEditing ? "Update Category" : "Create Category"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}