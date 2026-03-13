import Link from "next/link";
import ProductCard from "@/components/shop/ProductCard";
import { getFilteredProducts } from "@/app/actions/product-action";
import ShopSearch from "./_components/ShopSearch";
import ShopSortSelect from "./_components/ShopSortSelect";
import ShopPagination from "./_components/ShopPagination";
import {
  Package,
  SlidersHorizontal,
  SearchX,
} from "lucide-react";

const PAGE_SIZE = 12;

export default async function ProductPage({ searchParams }: {
  searchParams: Promise<{
    page?: string;
    q?: string;
    sort?: string;
    stock?: string;
  }>;
}) {
  const { page, q, sort, stock } = await searchParams;
  const currentPage = Number(page) || 1;
  const skip = (currentPage - 1) * PAGE_SIZE;

  const data = await getFilteredProducts({
    query: q,
    stock: stock,
    sort: sort || "newest",
    pageSize: PAGE_SIZE,
    skip,
  });

  const products = data.products || [];
  const totalCount = data.totalCount || 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const hasFilters = q || sort || stock;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* ── Page Header ── */}
      <div className="border-b border-neutral-200 bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-4 flex items-center gap-1.5 text-xs text-neutral-500">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-neutral-800 font-medium">Products</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-neutral-800 sm:text-3xl">
                All Products
              </h1>
              <p className="mt-1 text-sm text-neutral-500">
                {totalCount} {totalCount === 1 ? "product" : "products"} found
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filters Bar ── */}
      <div className="sticky top-16 z-30 border-b border-neutral-200 bg-surface/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <ShopSearch defaultValue={q} />

            {/* Right side filters */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={16} className="hidden sm:block text-neutral-400" />

              {/* Stock filter pills */}
              <div className="flex items-center gap-1.5">
                <StockPill href={buildUrl({ q, sort })} active={!stock} label="All" />
                <StockPill
                  href={buildUrl({ q, sort, stock: "in_stock" })}
                  active={stock === "in_stock"}
                  label="In Stock"
                />
                <StockPill
                  href={buildUrl({ q, sort, stock: "out_of_stock" })}
                  active={stock === "out_of_stock"}
                  label="Out of Stock"
                />
              </div>

              {/* Sort */}
              <ShopSortSelect current={sort} q={q} stock={stock} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Product Grid ── */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={{
                  id: product.id,
                  name: product.name,
                  description: product.description || undefined,
                  price: Number(product.price),
                  stock: Number(product.stock),
                  imageUrl: product.imageUrl,
                }} 
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <ShopPagination
                currentPage={currentPage}
                totalPages={totalPages}
                q={q}
                sort={sort}
                stock={stock}
              />
            )}
          </>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-200 py-20">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 mb-4">
              {hasFilters ? (
                <SearchX size={28} className="text-neutral-400" />
              ) : (
                <Package size={28} className="text-neutral-400" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-neutral-800">
              {hasFilters ? "No products match your filters" : "No products yet"}
            </h3>
            <p className="mt-1 text-sm text-neutral-500 max-w-sm text-center">
              {hasFilters
                ? "Try adjusting your search or filter criteria."
                : "Check back later for new products."}
            </p>
            {hasFilters && (
              <Link
                href="/products"
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
              >
                Clear Filters
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Helper: Stock filter pill ── */
function StockPill({
  href,
  active,
  label,
}: {
  href: string;
  active: boolean;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
        active
          ? "bg-primary text-white"
          : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-800"
      }`}
    >
      {label}
    </Link>
  );
}

/* ── Helper: Build URL with params ── */
function buildUrl(params: Record<string, string | undefined>) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v) sp.set(k, v);
  });
  const qs = sp.toString();
  return `/products${qs ? `?${qs}` : ""}`;
}