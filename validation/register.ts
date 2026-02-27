import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(1, {message : "Name is required"}),
    email: z.email({ message: "Invalid email address" }),
    password: z.string().min(10, { message: "Password must be at least 10 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[@$!%*?&]/, { message: "Password must contain at least one special character (@$!%*?&)" }),
    confirmPassword: z.string().min(10, { message: "Confirm Password must be at least 10 characters" }),
}).refine((data)=> data.password === data.confirmPassword,{
    message: "Passwords do not match",
    path: ["confirmPassword"]
})

export type RegisterInput = z.infer<typeof registerSchema>