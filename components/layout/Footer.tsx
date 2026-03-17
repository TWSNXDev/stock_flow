import AuthLink from "@/components/auth/AuthLink";
import { Package } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t border-neutral-200 bg-surface">
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
                    {/* Brand */}
                    <div className="col-span-2 sm:col-span-1">
                        <div className="mb-3 flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                                <Package size={16} strokeWidth={2.5} />
                            </div>
                            <span className="text-lg font-bold text-neutral-800">
                                Stock<span className="text-primary">Flow</span>
                            </span>
                        </div>
                        <p className="text-sm leading-relaxed text-neutral-500">
                            Quality products, fast delivery, and excellent service.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="mb-3 text-sm font-semibold text-neutral-800">Shop</h4>
                        <ul className="space-y-2 text-sm text-neutral-500">
                            <li><Link href="/products" className="transition-colors hover:text-primary">All Products</Link></li>
                            <li><Link href="/products" className="transition-colors hover:text-primary">New Arrivals</Link></li>
                            <li><Link href="/products" className="transition-colors hover:text-primary">Best Sellers</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-3 text-sm font-semibold text-neutral-800">Account</h4>
                        <ul className="space-y-2 text-sm text-neutral-500">
                            <li><AuthLink mode="login" className="transition-colors hover:text-primary">Login</AuthLink></li>
                            <li><AuthLink mode="register" className="transition-colors hover:text-primary">Register</AuthLink></li>
                            <li><Link href="/orders" className="transition-colors hover:text-primary">My Orders</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-3 text-sm font-semibold text-neutral-800">Support</h4>
                        <ul className="space-y-2 text-sm text-neutral-500">
                            <li><Link href="/" className="transition-colors hover:text-primary">Help Center</Link></li>
                            <li><Link href="/" className="transition-colors hover:text-primary">Contact Us</Link></li>
                            <li><Link href="/" className="transition-colors hover:text-primary">Returns</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 border-t border-neutral-200 pt-6 text-center text-xs text-neutral-500">
                    &copy; {new Date().getFullYear()} StockFlow. All rights reserved.
                </div>
            </div>
        </footer>
    )
};