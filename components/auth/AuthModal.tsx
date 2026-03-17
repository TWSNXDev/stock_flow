"use client"

import { useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Package, ShieldCheck, Sparkles, X } from "lucide-react"
import LoginForm from "@/components/auth/LoginForm"
import RegisterForm from "@/components/auth/RegisterForm"

type AuthMode = "login" | "register"

export default function AuthModal() {
    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()
    const authParam = searchParams.get("auth")
    const mode: AuthMode | null = authParam === "login" || authParam === "register" ? authParam : null

    const closeModal = () => {
        const params = new URLSearchParams(searchParams.toString())
        params.delete("auth")
        const query = params.toString()
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
    }

    useEffect(() => {
        if (!mode) {
            return
        }

        const previousOverflow = document.body.style.overflow
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                const params = new URLSearchParams(searchParams.toString())
                params.delete("auth")
                const query = params.toString()
                router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
            }
        }

        document.body.style.overflow = "hidden"
        window.addEventListener("keydown", onKeyDown)

        return () => {
            document.body.style.overflow = previousOverflow
            window.removeEventListener("keydown", onKeyDown)
        }
    }, [mode, pathname, router, searchParams])

    if (!mode) {
        return null
    }

    const switchMode = (nextMode: AuthMode) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("auth", nextMode)
        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }

    return (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 sm:p-6">
            <button
                type="button"
                aria-label="Close authentication modal"
                onClick={closeModal}
                className="absolute inset-0 bg-neutral-950/55 backdrop-blur-sm"
            />

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="auth-modal-title"
                className="relative grid w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/60 bg-white shadow-2xl lg:grid-cols-[1.05fr_0.95fr]"
            >
                <div className="relative hidden min-h-155 overflow-hidden bg-linear-to-br from-sky-700 via-primary to-cyan-500 p-10 text-white lg:block">
                    <div className="absolute -left-16 top-12 h-40 w-40 rounded-full bg-white/10 blur-xl" />
                    <div className="absolute bottom-8 right-6 h-48 w-48 rounded-full bg-cyan-200/20 blur-2xl" />

                    <div className="relative flex h-full flex-col justify-between">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/14 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
                                <Sparkles size={14} />
                                Welcome back to StockFlow
                            </div>
                            <h2 id="auth-modal-title" className="mt-6 max-w-sm text-4xl font-bold leading-tight">
                                {mode === "login" ? "Sign in and continue shopping." : "Create your account in a minute."}
                            </h2>
                            <p className="mt-4 max-w-md text-sm leading-6 text-sky-50/90">
                                Save your cart, track orders, and move through checkout faster with a cleaner account flow.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 rounded-2xl bg-white/12 p-4 backdrop-blur-sm">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/18">
                                    <Package size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">Live order tracking</p>
                                    <p className="text-sm text-sky-50/80">Follow purchase status from checkout to delivery.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 rounded-2xl bg-white/12 p-4 backdrop-blur-sm">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/18">
                                    <ShieldCheck size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">Secure account access</p>
                                    <p className="text-sm text-sky-50/80">Credentials stay inside your protected session flow.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative max-h-[90vh] overflow-y-auto bg-linear-to-b from-neutral-50 to-white p-5 sm:p-8 lg:p-10">
                    <button
                        type="button"
                        onClick={closeModal}
                        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500 transition-colors hover:border-primary/20 hover:text-primary"
                    >
                        <X size={18} />
                    </button>

                    <div className="pr-12">
                        <div className="inline-flex items-center gap-2 rounded-full bg-primary/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                            Account access
                        </div>
                        <h3 className="mt-4 text-3xl font-bold text-neutral-900">
                            {mode === "login" ? "Login" : "Register"}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-neutral-500">
                            {mode === "login"
                                ? "Access your account without leaving the page."
                                : "Set up a new account and start checking out faster."}
                        </p>
                    </div>

                    <div className="mt-8 inline-flex w-full rounded-2xl bg-neutral-100 p-1">
                        <button
                            type="button"
                            onClick={() => switchMode("login")}
                            className={`flex-1 rounded-[14px] px-4 py-3 text-sm font-semibold transition-all ${mode === "login" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-800"}`}
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            onClick={() => switchMode("register")}
                            className={`flex-1 rounded-[14px] px-4 py-3 text-sm font-semibold transition-all ${mode === "register" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-800"}`}
                        >
                            Register
                        </button>
                    </div>

                    <div className="mt-8">
                        {mode === "login" ? (
                            <LoginForm
                                onSuccess={closeModal}
                                onSwitchToRegister={() => switchMode("register")}
                            />
                        ) : (
                            <RegisterForm
                                onSwitchToLogin={() => switchMode("login")}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
