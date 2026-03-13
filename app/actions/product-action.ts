"use server";
import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/prisma";
import { productServerSchema } from "@/validation/product";
import { revalidatePath } from "next/cache";

export async function getInventoryStats() {
  try {
    const [totalItems, inStock, outOfStock] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { stock: { gt: 0 } } }),
      prisma.product.count({ where: { stock: 0 } }),
    ]);

    return {
      totalItems,
      inStock,
      outOfStock,
    };
  } catch (error) {
    console.error("Failed to fetch inventory stats:", error);
    return { totalItems: 0, inStock: 0, outOfStock: 0, error: "Failed to fetch inventory stats" };
  }
}

export const createProduct = async (formData: FormData) => {
    const rawData = Object.fromEntries(formData);
    const result = productServerSchema.safeParse(rawData)
    const image = result.data?.image as File | undefined

    if (!result.success) {
        return { error: "Invalid product data" }
    }

    const { name, description, price, stock } = result.data
    try {
        let uploadResult: { secure_url: string, public_id: string } | undefined;
        if(image){const arrayBuffer = await image.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        uploadResult = await new Promise<{ secure_url: string, public_id: string }>((resolve, reject) => {
            cloudinary.uploader.upload_stream({
                folder: "stock_flow/products",
                resource_type: "image",
                quality: "auto",
                fetch_format: "auto",
                use_asset_folder_as_public_id_prefix: true,
            }, (error, result) => {
                if (error) reject(error)
                resolve(result as { secure_url: string, public_id: string })
            }).end(buffer);
        })}

        try {
            await prisma.product.create({
                data: {
                    name,
                    description,
                    price,
                    stock,
                    imageUrl: uploadResult?.secure_url,
                }
            })
            revalidatePath("/admin/products");
        } catch (error) {
            if (uploadResult?.public_id) {
                await cloudinary.uploader.destroy(uploadResult.public_id)
            }
            console.error("Error creating product in database:", error);
            return { error: "Failed to create product in database" };
        }
        revalidatePath("/admin/products");
        return { message: "Product created successfully" }
    } catch (error) {
        console.error("Error creating product:", error);
        return { error: "Failed to create product" };
    }
}

export const getProducts = async () => {
    try {
        const products = await prisma.product.findMany()
        return { products, message: "Products fetched successfully" }
    } catch (error) {
        console.error("Error fetching products:", error)
        return { error: "Failed to fetch products" }
    }
}

export const getFilteredProducts = async (params: {
    query?: string;
    stock?: string;
    sort?: string;
    pageSize: number;
    skip: number;
}) => {
    try {
        const { query, stock, sort, pageSize, skip } = params;

        // Build where clause
        const where: Record<string, unknown> = {};

        if (query) {
            where.OR = [
                { name: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
            ];
        }

        if (stock === "in_stock") {
            where.stock = { gt: 0 };
        } else if (stock === "out_of_stock") {
            where.stock = 0;
        }

        // Build orderBy
        let orderBy: Record<string, string> = { createdAt: "desc" };
        switch (sort) {
            case "oldest":
                orderBy = { createdAt: "asc" };
                break;
            case "price_asc":
                orderBy = { price: "asc" };
                break;
            case "price_desc":
                orderBy = { price: "desc" };
                break;
            case "name_asc":
                orderBy = { name: "asc" };
                break;
            case "name_desc":
                orderBy = { name: "desc" };
                break;
            case "stock_asc":
                orderBy = { stock: "asc" };
                break;
            case "stock_desc":
                orderBy = { stock: "desc" };
                break;
        }

        const products = await prisma.product.findMany({
            where,
            orderBy,
            take: pageSize,
            skip: skip,
        });
        const totalCount = await prisma.product.count({ where });
        return { products, totalCount, message: "Products fetched successfully" };
    } catch (error) {
        console.error("Error fetching filtered products:", error);
        return { error: "Failed to fetch products" };
    }
}

export const getProductById = async (id: string) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id }
        })
        return { product, message: "Product fetched successfully" }
    } catch (error) {
        console.error("Error fetching product:", error)
        return { error: "Failed to fetch product" }
    }
}

export const updateProduct = async (id: string, formData: FormData) => {
    const rawData = Object.fromEntries(formData);
    const result = productServerSchema.safeParse(rawData)
    if (!result.success) {
        return { error: "Invalid product data" }
    }
    const { name, description, price, stock } = result.data

    try {
        let newImageUrl: string | undefined;
        const image = result.data?.image as File | undefined;
        if (image) {
            const arrayBuffer = await image.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
                cloudinary.uploader.upload_stream({
                    resource_type: "image",
                    folder: "stock_flow/products",
                }, (error, result) => {
                    if (error) reject(error)
                    resolve(result as { secure_url: string })
                }).end(buffer);
            })
            newImageUrl = uploadResult.secure_url
            const oldProduct = await prisma.product.findUnique({ where: { id } });
            if (oldProduct?.imageUrl) {
                // ดึง public_id จาก url เพื่อลบ
                const publicId = oldProduct.imageUrl.split('/').pop()?.split('.')[0];
                if (publicId) {
                    await cloudinary.uploader.destroy(`stock_flow/products/${publicId}`);
                }
            }
        }
        await prisma.product.update({
            where: { id },
            data: {
                name,
                description,
                price,
                stock,
                imageUrl: newImageUrl
            }
        })
        revalidatePath("/admin/products");
        return { message: "Product updated successfully" }
    } catch (error) {
        console.error("Error updating product:", error)
        return { error: "Failed to update product" }
    }
}

export const deleteProduct = async (id: string) => {
    try {
        const product = await prisma.product.findUnique({ where: { id } });
        if(!product){
            return { error: "Product not found" }
        }
        await prisma.product.delete({
            where: { id }
        })
        if (product?.imageUrl) {
            const publicId = product.imageUrl.split('/').pop()?.split('.')[0];
            if (publicId) {
                await cloudinary.uploader.destroy(`stock_flow/products/${publicId}`);
            }
        }
        revalidatePath("/admin/products");
        return { message: "Product deleted successfully" }
    } catch (error) {
        console.error("Error deleting product:", error)
        return { error: "Failed to delete product" }
    }
}