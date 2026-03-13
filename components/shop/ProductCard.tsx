import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Zap } from "lucide-react";
import AddToCartButton from "./AddToCartButton";
import { ProductType } from "@/validation/product";

export default function ProductCard({ product }: { product: ProductType }) {
  const price = Number(product.price);
  const inStock = Number(product.stock) > 0;

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-surface transition-all hover:shadow-md hover:-translate-y-0.5">
      {/* Image */}
      <Link href={`/products/${product.id}`} className="relative aspect-square overflow-hidden bg-neutral-100">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-neutral-300">
            <ShoppingCart size={48} strokeWidth={1} />
          </div>
        )}

        {/* Stock Badge */}
        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-950/40">
            <span className="rounded-full bg-error px-3 py-1 text-xs font-bold text-white">
              Out of Stock
            </span>
          </div>
        )}

        {/* New badge – show for products created within last 7 days */}
        {inStock && isNew(product) && (
          <span className="absolute top-2 left-2 rounded-full bg-success px-2.5 py-0.5 text-xs font-semibold text-white">
            New
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-sm font-semibold text-neutral-800 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {product.description && (
          <p className="text-xs text-neutral-500 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-primary">
            ฿{price.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
          </span>

          {inStock ? (
            <span className="text-xs text-success font-medium">In Stock</span>
          ) : (
            <span className="text-xs text-error font-medium">Sold Out</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-2">
          <AddToCartButton product={product} />
          <button
            disabled={!inStock}
            className="flex items-center justify-center gap-1.5 rounded-lg cursor-pointer bg-primary py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-hover disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed"
          >
            <Zap size={14} />
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

function isNew(product: ProductType): boolean {
  // Products with createdAt within 7 days are "new"
  const createdAt = (product as { createdAt?: Date | string }).createdAt;
  if (!createdAt) return false;
  const diff = Date.now() - new Date(createdAt).getTime();
  return diff < 7 * 24 * 60 * 60 * 1000;
}
