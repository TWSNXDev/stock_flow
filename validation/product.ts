import { z } from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const baseProductSchema = {
  name: z.string().min(1, { message: "Product name is required" }),
  description: z.string().optional(),
};

export const productFormSchema = z.object({
  ...baseProductSchema,
  price: z.number().min(0, { message: "Price must be a positive number" }),
  stock: z.number().min(0, { message: "Stock must be a positive number" }),
  image: z
    .any()
    .optional()
    .refine((files) => {
      if (!files || files.length === 0) return true;
      return files?.[0]?.size <= MAX_FILE_SIZE;
    }, { message: "Max file size is 2MB." })
    .refine((files) => {
      if (!files || files.length === 0) return true;
      return ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type);
    }, {
      message: ".jpg, .jpeg, .png and .webp files are accepted.",
    }),
});

export const productServerSchema = z.object({
  ...baseProductSchema,
  price: z.coerce.number().min(0, { message: "Price must be a positive number" }),
  stock: z.coerce.number().min(0, { message: "Stock must be a positive number" }),
  image: z
    .instanceof(File, { message: "Invalid file type" })
    .optional()
    .refine((file) => {
      if (!file) return true;
      return file.size <= MAX_FILE_SIZE;
    }, { message: "Max file size is 2MB." })
    .refine((file) => {
      if (!file) return true;
      return ACCEPTED_IMAGE_TYPES.includes(file.type);
    }, {
      message: ".jpg, .jpeg, .png and .webp files are accepted.",
    })
});

export interface ProductType {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl: string | null;
  createdAt?: string;
  updatedAt?: string;
}
export type ProductInput = z.infer<typeof productFormSchema>;
export type ProductServerInput = z.infer<typeof productServerSchema>;