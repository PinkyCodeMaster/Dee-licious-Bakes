"use server";

import { createAdminCategorySchema, updateAdminCategorySchema, reorderCategoriesSchema } from "@/lib/validations/catalog";
import { adminCategoryQueries } from "@/lib/data/categories";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import type { z } from "zod";

type CreateCategoryData = z.infer<typeof createAdminCategorySchema>;
type UpdateCategoryData = z.infer<typeof updateAdminCategorySchema>;
type ReorderCategoriesData = z.infer<typeof reorderCategoriesSchema>;

export async function createCategory(data: CreateCategoryData) {
  try {
    // Validate the data
    const validatedData = createAdminCategorySchema.parse(data);
    
    // Generate a unique ID
    const id = nanoid();
    
    // Create the category
    const category = await adminCategoryQueries.create({
      id,
      ...validatedData,
    });
    
    // Revalidate the categories page
    revalidatePath("/admin/catalog/categories");
    
    return { success: true, category };
  } catch (error) {
    console.error("Failed to create category:", error);
    throw new Error("Failed to create category");
  }
}

export async function updateCategory(id: string, data: UpdateCategoryData) {
  try {
    // Validate the data
    const validatedData = updateAdminCategorySchema.parse(data);
    
    // Update the category
    const category = await adminCategoryQueries.update(id, validatedData);
    
    // Revalidate the categories page
    revalidatePath("/admin/catalog/categories");
    
    return { success: true, category };
  } catch (error) {
    console.error("Failed to update category:", error);
    throw new Error("Failed to update category");
  }
}

export async function deleteCategory(id: string) {
  try {
    // Delete the category (this includes dependency checking)
    const result = await adminCategoryQueries.delete(id);
    
    if (result.success) {
      // Revalidate the categories page
      revalidatePath("/admin/catalog/categories");
    }
    
    return result;
  } catch (error) {
    console.error("Failed to delete category:", error);
    return {
      success: false,
      message: "Failed to delete category",
    };
  }
}

export async function reorderCategories(data: ReorderCategoriesData) {
  try {
    // Validate the data
    const validatedData = reorderCategoriesSchema.parse(data);
    
    // Reorder the categories
    await adminCategoryQueries.reorder(validatedData.categories);
    
    // Revalidate the categories page
    revalidatePath("/admin/catalog/categories");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to reorder categories:", error);
    throw new Error("Failed to reorder categories");
  }
}

export async function getAllCategoriesForAdmin() {
  try {
    return await adminCategoryQueries.getAll();
  } catch (error) {
    console.error("Failed to get categories:", error);
    throw new Error("Failed to get categories");
  }
}

export async function getCategoryById(id: string) {
  try {
    return await adminCategoryQueries.getById(id);
  } catch (error) {
    console.error("Failed to get category:", error);
    throw new Error("Failed to get category");
  }
}