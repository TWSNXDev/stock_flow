"use server"

import bcrypt from "bcryptjs"
import prisma from "../../lib/prisma"
import { RegisterInput, registerSchema } from "@/validation/register"
import { Prisma } from "@/app/generated/prisma/client"

export const registerUser = async (values : RegisterInput) => {
    const result = registerSchema.safeParse(values)
    if(!result.success) {
        return { error: "Invalid user data" }
    }
    
    const { name, email, password, confirmPassword } = result.data
    
    if(password !== confirmPassword) {
        return { error: "Passwords do not match" }
    }

    try{
        const passwordHashed = await bcrypt.hash(password, 10)
        await prisma.user.create({
            data: {
                name,
                email,
                password: passwordHashed,
            }
        })
        return { message: "User created successfully" }
    } catch(error) {
        console.error("Error creating user:", error)
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            return { error: "Email already exists" }
        }
        return { error: "Failed to create user" }
    }
}