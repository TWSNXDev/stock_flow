import { z } from "zod"

export const productSchema = z.object({
    name: z.string().min(1, { message: "Product name is required" }),
    description: z.string().optional(),
    price: z.coerce.number().min(0, { message: "Price must be a positive number" }),
    stock: z.coerce.number().min(0, { message: "Stock must be a positive number"}),
    image: z.instanceof(File, { message: "Product image is required" }).optional(),
})

export type ProductInput = z.infer<typeof productSchema>