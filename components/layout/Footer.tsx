import { Package } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t border-neutral-200 bg-surface">
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
                    {/* Brand */}
                    <div className="col-span-2 sm:col-span-1">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                                <Package size={16} strokeWidth={2.5} />
                            </div>
                            <span className="text-lg font-bold text-neutral-800">
                                Stock<span className="text-primary">Flow</span>
                            </span>
                        </div>
                        <p className="text-sm text-neutral-500 leading-relaxed">
                            Quality products, fast delivery, and excellent service.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-sm font-semibold text-neutral-800 mb-3">Shop</h4>
                        <ul className="space-y-2 text-sm text-neutral-500">
                            <li><Link href="/products" className="hover:text-primary transition-colors">All Products</Link></li>
                            <li><Link href="/products" className="hover:text-primary transition-colors">New Arrivals</Link></li>
                            <li><Link href="/products" className="hover:text-primary transition-colors">Best Sellers</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-neutral-800 mb-3">Account</h4>
                        <ul className="space-y-2 text-sm text-neutral-500">
                            <li><Link href="/login" className="hover:text-primary transition-colors">Login</Link></li>
                            <li><Link href="/register" className="hover:text-primary transition-colors">Register</Link></li>
                            <li><Link href="/orders" className="hover:text-primary transition-colors">My Orders</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-neutral-800 mb-3">Support</h4>
                        <ul className="space-y-2 text-sm text-neutral-500">
                            <li><Link href="/" className="hover:text-primary transition-colors">Help Center</Link></li>
                            <li><Link href="/" className="hover:text-primary transition-colors">Contact Us</Link></li>
                            <li><Link href="/" className="hover:text-primary transition-colors">Returns</Link></li>
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