"use client"
import FloatingInput from '@/components/ui/FloatingInput'
import { LoginInput, loginSchema } from '@/validation/login'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

function LoginForm() {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)
    const { register,handleSubmit,reset , formState: { errors , isSubmitting} } = useForm({
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
        if(!validatedFields.success) {
            setError("Invalid login data")
            return
        }
        try{
            const res = await signIn("credentials",{
                ...data,
                redirect: false,
            })
            console.log("SignIn response:", res)
            if(res?.error) {
                if(res.status === 401) {
                    setError("Invalid email or password")
                } else {                    
                    setError(res.error)
                }
            } else {
                setMessage("Login successful! Redirecting...")
                reset()
                setTimeout(() => {
                    router.push("/")
                }, 1500)
            }
        }catch(error) {
            console.error("Login error:", error)
            setError("An error occurred during login")
            return
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            {error && <p className="text-red-500">{error}</p>}
            {message && <p className="text-green-500">{message}</p>}
            <FloatingInput<LoginInput> label='Email' name='email' register={register} error={errors?.email?.message} />
            <FloatingInput<LoginInput> label='Password' name='password' register={register} type="password" error={errors?.password?.message} />
            <button type='submit' disabled={isSubmitting} className='w-full bg-primary text-white py-2 rounded-md hover:bg-primary-hover transition-colors cursor-pointer'>
                {isSubmitting ? "Logging in..." : "Login"}
            </button>
        </form>
    )
}

export default LoginForm