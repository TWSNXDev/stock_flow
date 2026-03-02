"use server";
import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/prisma";
import { ProductInput, productSchema } from "@/validation/product";

export const createProduct = async (values: ProductInput) => {
    const result = productSchema.safeParse(values)
    const image = result.data?.image as File | undefined
    if (!image) return { error: "Product image is required" };

    if (!result.success) {
        return { error: "Invalid product data" }
    }

    const { name, description, price, stock } = result.data
    try {
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

        await prisma.product.create({
            data: {
                name,
                description,
                price,
                stock,
                imageUrl: uploadResult.secure_url,
            }
        })
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

export const updateProduct = async (id: string, values: ProductInput) => {
    const result = productSchema.safeParse(values)
    if (!result.success) {
        return { error: "Invalid product data" }
    }
    const { name, description, price, stock, image } = result.data

    try {
        let newImageUrl: string | undefined;
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
                    await cloudinary.uploader.destroy(`ecommerce_products/${publicId}`);
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
        return { message: "Product updated successfully" }
    } catch (error) {
        console.error("Error updating product:", error)
        return { error: "Failed to update product" }
    }
}

export const deleteProduct = async (id: string) => {
    try {
        await prisma.product.delete({
            where: { id }
        })
        return { message: "Product deleted successfully" }
    } catch (error) {
        console.error("Error deleting product:", error)
        return { error: "Failed to delete product" }
    }
}