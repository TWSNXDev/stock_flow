"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  Tag,
  Package,
  ChevronRight,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } =
    useCartStore();

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = totalPrice();
  const shipping = subtotal >= 1000 ? 0 : 60;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center gap-6 py-20 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-neutral-100">
              <ShoppingCart size={40} className="text-neutral-300" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-neutral-800">Your cart is empty</h1>
              <p className="mt-2 text-sm text-neutral-500">
                Looks like you haven&apos;t added anything yet.
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
            >
              <Package size={16} />
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link
              href="/products"
              className="mb-3 inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-primary"
            >
              <ArrowLeft size={15} />
              Continue Shopping
            </Link>
            <h1 className="text-2xl font-bold text-neutral-800 sm:text-3xl">
              Shopping Cart
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              {cartCount} {cartCount === 1 ? "item" : "items"} in your cart
            </p>
          </div>
          <button
            onClick={clearCart}
            className="hidden items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-2 text-xs font-medium text-neutral-500 transition-colors hover:border-error/40 hover:bg-red-50 hover:text-error sm:flex cursor-pointer"
          >
            <Trash2 size={13} />
            Clear cart
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">

          {/* ── Item List ── */}
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 rounded-2xl border border-neutral-200 bg-surface p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5"
              >
                {/* Image */}
                <Link
                  href={`/products/${item.id}`}
                  className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-neutral-100 sm:h-28 sm:w-28"
                >
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                      sizes="112px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ShoppingCart size={28} className="text-neutral-300" strokeWidth={1.5} />
                    </div>
                  )}
                </Link>

                {/* Details */}
                <div className="flex flex-1 flex-col justify-between min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link href={`/products/${item.id}`}>
                        <p className="font-semibold text-neutral-800 truncate transition-colors hover:text-primary">
                          {item.name}
                        </p>
                      </Link>
                      <p className="mt-0.5 text-xs text-neutral-400">
                        {item.stock > 0 ? (
                          <span className="text-success font-medium">In Stock</span>
                        ) : (
                          <span className="text-error font-medium">Out of Stock</span>
                        )}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-neutral-300 transition-colors hover:bg-red-50 hover:text-error cursor-pointer"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    {/* Quantity */}
                    <div className="flex items-center overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        disabled={item.quantity <= 1}
                        className="flex h-9 w-9 items-center justify-center text-neutral-500 transition-colors hover:bg-neutral-200 active:bg-neutral-300 disabled:cursor-not-allowed disabled:text-neutral-200 cursor-pointer"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 select-none text-center text-sm font-bold text-neutral-800 tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, Math.min(item.stock, item.quantity + 1))
                        }
                        disabled={item.quantity >= item.stock}
                        className="flex h-9 w-9 items-center justify-center text-neutral-500 transition-colors hover:bg-neutral-200 active:bg-neutral-300 disabled:cursor-not-allowed disabled:text-neutral-200 cursor-pointer"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Line total */}
                    <div className="text-right">
                      <p className="text-base font-bold text-neutral-800">
                        ฿{(item.price * item.quantity).toLocaleString("th-TH", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-neutral-400">
                          ฿{item.price.toLocaleString("th-TH", { minimumFractionDigits: 2 })} each
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Mobile clear cart */}
            <div className="flex justify-end sm:hidden">
              <button
                onClick={clearCart}
                className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-2 text-xs font-medium text-neutral-500 transition-colors hover:border-error/40 hover:bg-red-50 hover:text-error cursor-pointer"
              >
                <Trash2 size={13} />
                Clear cart
              </button>
            </div>
          </div>

          {/* ── Order Summary ── */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="rounded-2xl border border-neutral-200 bg-surface p-6 shadow-sm">
              <h2 className="mb-5 flex items-center gap-2 text-base font-bold text-neutral-800">
                <Tag size={16} className="text-primary" />
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between text-neutral-600">
                  <span>
                    Subtotal ({cartCount} {cartCount === 1 ? "item" : "items"})
                  </span>
                  <span className="font-semibold text-neutral-800">
                    ฿{subtotal.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex items-center justify-between text-neutral-600">
                  <span>Shipping</span>
                  {shipping === 0 ? (
                    <span className="font-semibold text-success">FREE</span>
                  ) : (
                    <span className="font-semibold text-neutral-800">
                      ฿{shipping.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
                    </span>
                  )}
                </div>

                {shipping > 0 && (
                  <div className="rounded-xl bg-primary-light px-3 py-2.5 text-xs text-primary">
                    Add ฿{(1000 - subtotal).toLocaleString("th-TH", { minimumFractionDigits: 2 })} more to get free shipping!
                  </div>
                )}
              </div>

              <div className="my-5 border-t border-dashed border-neutral-200" />

              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-neutral-800">Total</span>
                <span className="text-xl font-bold text-primary">
                  ฿{total.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
                </span>
              </div>

              <button
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover active:scale-[0.98] cursor-pointer"
              >
                Proceed to Checkout
                <ChevronRight size={16} />
              </button>

              <Link
                href="/products"
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-neutral-200 py-3 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50"
              >
                <ArrowLeft size={14} />
                Continue Shopping
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              {[
                { icon: "🚚", text: "Free delivery over ฿1,000" },
                { icon: "🔒", text: "Secure checkout" },
                { icon: "↩️", text: "Easy returns" },
                { icon: "💬", text: "24/7 support" },
              ].map((badge) => (
                <div
                  key={badge.text}
                  className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-surface px-3 py-2.5 text-xs text-neutral-500"
                >
                  <span>{badge.icon}</span>
                  <span>{badge.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
