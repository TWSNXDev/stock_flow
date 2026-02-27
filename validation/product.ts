import { z } from "zod"

export const productSchema = z.object({
    name: z.string().min(1, { message: "Product name is required" }),
    description: z.string().optional(),
    price: z.number().min(0, { message: "Price must be a positive number" }),
    stock: z.number().min(0, { message: "Stock must be a positive number"}),
    imageUrl: z.string().optional()
})

export type ProductInput = z.infer<typeof productSchema>