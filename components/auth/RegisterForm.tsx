"use client"

import FloatingInput from "@/components/ui/FloatingInput"
import { registerUser } from "@/app/actions/register-action"
import { RegisterInput, registerSchema } from "@/validation/register"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"

type RegisterFormProps = {
    onSuccess?: () => void
    onSwitchToLogin?: () => void
}

export default function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<RegisterInput>({
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

        const result = await registerUser(data)
        if (result?.error) {
            setError(result.error)
            return
        }

        setMessage("Account created successfully. You can login now.")
        reset()

        if (onSwitchToLogin) {
            window.setTimeout(() => {
                onSwitchToLogin()
                onSuccess?.()
            }, 900)
        }
    }

    return (
        <div className="space-y-4">
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                {error && <p className="text-sm text-error">{error}</p>}
                {message && <p className="text-sm text-success">{message}</p>}
                <FloatingInput<RegisterInput> label="Name" name="name" register={register} error={errors?.name?.message}/>
                <FloatingInput<RegisterInput> label="Email" name="email" register={register} error={errors?.email?.message}/>
                <FloatingInput<RegisterInput> label="Password" name="password" register={register} type="password" error={errors?.password?.message}/>
                <FloatingInput<RegisterInput> label="Confirm Password" name="confirmPassword" register={register} type="password" error={errors?.confirmPassword?.message}/>
                <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70">
                    {isSubmitting ? "Registering..." : "Create Account"}
                </button>
            </form>

            {onSwitchToLogin && (
                <p className="text-center text-sm text-neutral-500">
                    Already have an account?{" "}
                    <button
                        type="button"
                        onClick={onSwitchToLogin}
                        className="font-semibold text-primary transition-colors hover:text-primary-hover"
                    >
                        Login
                    </button>
                </p>
            )}
        </div>
    )
}
