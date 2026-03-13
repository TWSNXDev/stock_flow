'use client';
import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { ProductType } from "@/validation/product";
import { ShoppingCart, Plus, Minus, Check } from "lucide-react";

export default function AddToCartButton({ product }: { product: ProductType }) {
    const { addItem } = useCartStore();
    const [qty, setQty] = useState(1);
    const [added, setAdded] = useState(false);
    const outOfStock = product.stock < 1;

    const handleAdd = () => {
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.imageUrl || "",
            quantity: qty,
            stock: product.stock,
        });
        setQty(1);
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    };

    return (
        <div className="flex flex-1 items-center gap-1.5">
            {/* Quantity selector */}
            <div className="flex items-center overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50">
                <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={outOfStock || qty <= 1}
                    className="flex h-8 w-8 items-center justify-center text-neutral-500 transition-colors hover:bg-neutral-200 active:bg-neutral-300 cursor-pointer disabled:text-neutral-200 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                >
                    <Minus size={14} />
                </button>
                <span className="w-6 text-center text-xs font-bold text-neutral-800 tabular-nums select-none">
                    {qty}
                </span>
                <button
                    type="button"
                    onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                    disabled={outOfStock || qty >= product.stock}
                    className="flex h-8 w-8 items-center justify-center text-neutral-500 transition-colors hover:bg-neutral-200 active:bg-neutral-300 cursor-pointer disabled:text-neutral-200 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                >
                    <Plus size={14} />
                </button>
            </div>

            {/* Add to cart button */}
            <button
                onClick={handleAdd}
                disabled={outOfStock || added}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all cursor-pointer disabled:cursor-not-allowed ${
                    added
                        ? "border border-success bg-success/10 text-success"
                        : outOfStock
                            ? "border border-neutral-200 text-neutral-300"
                            : "border border-primary text-primary hover:bg-primary hover:text-white active:scale-95"
                }`}
            >
                {added ? (
                    <>
                        <Check size={14} />
                        Added!
                    </>
                ) : (
                    <>
                        <ShoppingCart size={14} />
                        Add
                    </>
                )}
            </button>
        </div>
    );
}