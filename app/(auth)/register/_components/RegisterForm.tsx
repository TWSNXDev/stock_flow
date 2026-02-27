"use client"

import FloatingInput from "@/components/FloatingInput"
import { registerUser } from "@/app/actions/register"
import { RegisterInput, registerSchema } from "@/validation/register"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"

export default function RegisterForm() {
    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(registerSchema),
        mode: "onBlur",
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        }
    })

    const onSubmit = async (data: RegisterInput) => {
        setError(null)
        setMessage(null)
        const result = await registerUser(data);
        if(result && result.error){
            setError(result.error)
        }else if(result) {
            setMessage("User created successfully")
            reset()
        }
    }

    return (
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {error && <p className="text-sm text-error">{error}</p>}
            {message && <p className="text-sm text-success">{message}</p>}
            <FloatingInput<RegisterInput> label="Name" name="name" register={register} error={errors?.name?.message}/>
            <FloatingInput<RegisterInput> label="Email" name="email" register={register} error={errors?.email?.message}/>
            <FloatingInput<RegisterInput> label="Password" name="password" register={register} type="password" error={errors?.password?.message}/>
            <FloatingInput<RegisterInput> label="Confirm Password" name="confirmPassword" register={register} type="password" error={errors?.confirmPassword?.message}/>
            <button type="submit" disabled={isSubmitting} className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-hover transition-colors cursor-pointer">
                {isSubmitting ? "Registering..." : "Register"}
            </button>
        </form>
    )
}