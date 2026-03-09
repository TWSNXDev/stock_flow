"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    });
    return { categories };
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return { categories: [], error: "Failed to fetch categories" };
  }
}

export async function createCategory(name: string) {
  if (!name || name.trim().length === 0) {
    return { error: "Category name is required" };
  }

  try {
    const existing = await prisma.category.findFirst({
      where: { name: { equals: name.trim(), mode: "insensitive" } },
    });

    if (existing) {
      return { error: "Category already exists" };
    }

    await prisma.category.create({ data: { name: name.trim() } });
    revalidatePath("/admin/category");
    return { message: "Category created successfully" };
  } catch (error) {
    console.error("Failed to create category:", error);
    return { error: "Failed to create category" };
  }
}

export async function updateCategory(id: string, name: string) {
  if (!name || name.trim().length === 0) {
    return { error: "Category name is required" };
  }

  try {
    const existing = await prisma.category.findFirst({
      where: { name: { equals: name.trim(), mode: "insensitive" }, NOT: { id } },
    });

    if (existing) {
      return { error: "Category name already exists" };
    }

    await prisma.category.update({ where: { id }, data: { name: name.trim() } });
    revalidatePath("/admin/category");
    return { message: "Category updated successfully" };
  } catch (error) {
    console.error("Failed to update category:", error);
    return { error: "Failed to update category" };
  }
}

export async function deleteCategory(id: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });

    if (!category) {
      return { error: "Category not found" };
    }

    if (category._count.products > 0) {
      return { error: `Cannot delete: ${category._count.products} products are using this category` };
    }

    await prisma.category.delete({ where: { id } });
    revalidatePath("/admin/category");
    return { message: "Category deleted successfully" };
  } catch (error) {
    console.error("Failed to delete category:", error);
    return { error: "Failed to delete category" };
  }
}
