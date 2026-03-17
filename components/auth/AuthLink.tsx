"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { ReactNode, useMemo } from "react"

type AuthLinkProps = {
    mode: "login" | "register"
    className?: string
    children: ReactNode
    onClick?: () => void
}

export default function AuthLink({ mode, className, children, onClick }: AuthLinkProps) {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const href = useMemo(() => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("auth", mode)
        const query = params.toString()
        return query ? `${pathname}?${query}` : pathname
    }, [mode, pathname, searchParams])

    return (
        <Link href={href} scroll={false} className={className} onClick={onClick}>
            {children}
        </Link>
    )
}
