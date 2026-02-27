import prisma from "@/lib/prisma";
import { ProductInput, productSchema } from "@/validation/product";

export const createProduct = async (values: ProductInput) => {
    const result = productSchema.safeParse(values)
    if(!result.success) {
        return { error: "Invalid product data" }
    }
    const { name, description, price, stock, imageUrl } = result.data
    try{
        await prisma.product.create({
            data: {
                name,
                description,
                price,
                stock,
                imageUrl
            }
        })
        return { message: "Product created successfully" }
    } catch (error) {
        console.error("Error creating product:", error)
        return { error: "Failed to create product" }
    }
}

export const getProducts = async () => {
    try{
        const products = await prisma.product.findMany()
        return { products, message: "Products fetched successfully" }
    }catch(error){
        console.error("Error fetching products:", error)
        return { error: "Failed to fetch products" }
    }
}

export const getProductById = async ( id: string ) => {
    try{
        const product = await prisma.product.findUnique({
            where: { id }
        })
        return { product, message: "Product fetched successfully" }
    }catch(error){
        console.error("Error fetching product:", error)
        return { error: "Failed to fetch product" }
    }
}

export const updateProduct = async ( id: string, values: ProductInput ) => {
    const result = productSchema.safeParse(values)
    if(!result.success){
        return { error: "Invalid product data" }
    }
    const { name, description, price, stock, imageUrl } = result.data
    try{
        await prisma.product.update({
            where: { id },
            data: {
                name,
                description,
                price,
                stock,
                imageUrl
            }
        })
        return { message: "Product updated successfully" }
    }catch(error){
        console.error("Error updating product:", error)
        return { error: "Failed to update product" }
    }
}

export const deleteProduct = async ( id: string ) => {
    try{
        await prisma.product.delete({
            where: { id}
        })
        return { message: "Product deleted successfully" }
    }catch(error){
        console.error("Error deleting product:", error)
        return { error: "Failed to delete product" }
    }
}