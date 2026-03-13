"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, X, Plus, Minus, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

interface CartDrawerProps {
    open: boolean;
    onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
    const { items, removeItem, updateQuantity, totalPrice } = useCartStore();
    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-100 pointer-events-none">
            {/* Overlay – covers entire screen */}
            <div
                className="absolute inset-0 bg-overlay pointer-events-auto transition-opacity"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="absolute right-0 top-0 h-screen w-full max-w-md bg-surface shadow-xl flex flex-col pointer-events-auto animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
                    <h2 className="text-lg font-bold text-neutral-800 flex items-center gap-2">
                        <ShoppingCart size={20} />
                        Cart
                        {cartCount > 0 && (
                            <span className="text-sm font-medium text-neutral-500">
                                ({cartCount} items)
                            </span>
                        )}
                    </h2>
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800 cursor-pointer"
                        aria-label="Close cart"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto px-5 py-4">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-neutral-300">
                            <ShoppingCart size={48} strokeWidth={1.5} />
                            <p className="mt-3 text-sm font-medium">Your cart is empty</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex gap-3 rounded-lg border border-neutral-200 p-3"
                                >
                                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-neutral-50">
                                        {item.image ? <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        /> :
                                            <ShoppingCart className="h-full w-full text-gray-400 p-4" />}
                                    </div>
                                    <div className="flex flex-1 flex-col justify-between min-w-0">
                                        <div>
                                            <p className="text-sm font-semibold text-neutral-800 truncate">
                                                {item.name}
                                            </p>
                                            <p className="text-sm font-medium text-primary">
                                                ฿{item.price.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.id,
                                                            Math.max(1, item.quantity - 1)
                                                        )
                                                    }
                                                    className="flex h-7 w-7 items-center justify-center rounded-md border border-neutral-200 text-neutral-500 transition-colors hover:bg-neutral-100 cursor-pointer"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="w-8 text-center text-sm font-medium text-neutral-800">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.id,
                                                            Math.min(item.stock, item.quantity + 1)
                                                        )
                                                    }
                                                    className="flex h-7 w-7 items-center justify-center rounded-md border border-neutral-200 text-neutral-500 transition-colors hover:bg-neutral-100 cursor-pointer"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="flex h-7 w-7 items-center justify-center rounded-md text-error transition-colors hover:bg-red-50 cursor-pointer"
                                                aria-label="Remove item"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t border-neutral-200 px-5 py-4">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-neutral-500">Total</span>
                            <span className="text-lg font-bold text-neutral-800">
                                ฿{totalPrice().toLocaleString()}
                            </span>
                        </div>
                        <Link
                            href="/cart"
                            onClick={onClose}
                            className="block w-full rounded-lg bg-primary py-3 text-center text-sm font-medium text-white transition-colors hover:bg-primary-hover"
                        >
                            View Cart & Checkout
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
