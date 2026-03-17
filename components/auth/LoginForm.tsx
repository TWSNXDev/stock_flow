"use client"

import FloatingInput from '@/components/ui/FloatingInput'
import { LoginInput, loginSchema } from '@/validation/login'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

type LoginFormProps = {
    onSuccess?: () => void
    onSwitchToRegister?: () => void
}

function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<LoginInput>({
        defaultValues: {
            email: "",
            password: "",
        },
        resolver: zodResolver(loginSchema),
        mode: "onSubmit"
    })

    const onSubmit = async (data: LoginInput) => {
        setError(null)
        setMessage(null)

        const validatedFields = loginSchema.safeParse(data)
        if (!validatedFields.success) {
            setError("Invalid login data")
            return
        }

        try {
            const res = await signIn("credentials", {
                ...data,
                redirect: false,
            })

            if (res?.error) {
                if (res.status === 401) {
                    setError("Invalid email or password")
                } else {
                    setError(res.error)
                }
                return
            }

            setMessage("Login successful")
            reset()
            router.refresh()

            if (onSuccess) {
                onSuccess()
                return
            }

            router.push("/")
        } catch (error) {
            console.error("Login error:", error)
            setError("An error occurred during login")
        }
    }

    return (
        <div className='space-y-4'>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                {error && <p className="text-sm text-error">{error}</p>}
                {message && <p className="text-sm text-success">{message}</p>}
                <FloatingInput<LoginInput> label='Email' name='email' register={register} error={errors?.email?.message} />
                <FloatingInput<LoginInput> label='Password' name='password' register={register} type="password" error={errors?.password?.message} />
                <button type='submit' disabled={isSubmitting} className='w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70'>
                    {isSubmitting ? "Logging in..." : "Login"}
                </button>
            </form>

            {onSwitchToRegister && (
                <p className="text-center text-sm text-neutral-500">
                    Don&apos;t have an account?{" "}
                    <button
                        type="button"
                        onClick={onSwitchToRegister}
                        className="font-semibold text-primary transition-colors hover:text-primary-hover"
                    >
                        Register
                    </button>
                </p>
            )}
        </div>
    )
}

export default LoginForm