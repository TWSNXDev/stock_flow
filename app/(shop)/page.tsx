import Link from "next/link";
import prisma from "@/lib/prisma";
import ProductCard from "@/components/shop/ProductCard";
import {
  Truck,
  ShieldCheck,
  Headphones,
  ArrowRight,
  Package,
  TrendingUp,
  Sparkles,
} from "lucide-react";

export default async function Home() {
  // Fetch latest 8 products that are in stock
  const latestProducts = await prisma.product.findMany({
    where: { stock: { gt: 0 } },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  // Fetch popular products (highest stock = most available)
  const popularProducts = await prisma.product.findMany({
    orderBy: { stock: "desc" },
    take: 4,
  });

  return (
    <div className="min-h-screen bg-neutral-50">

      {/* ═══════════════ Hero Section ═══════════════ */}
      <section className="relative overflow-hidden bg-linear-to-br from-primary via-blue-700 to-blue-900">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white" />
          <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-white" />
          <div className="absolute top-1/2 left-0 h-48 w-48 rounded-full bg-white" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
              <Sparkles size={14} />
              Welcome to StockFlow
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Shop Smarter,
              <br />
              <span className="text-blue-200">Live Better.</span>
            </h1>

            <p className="mt-5 text-lg text-blue-100 max-w-lg leading-relaxed">
              Discover quality products at great prices. Fast delivery, secure payments, and excellent customer service.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-primary shadow-md transition-all hover:bg-blue-50 hover:shadow-lg"
              >
                Browse Products
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10"
              >
                View Deals
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="mt-12 flex gap-8">
              {[
                { value: "500+", label: "Products" },
                { value: "10k+", label: "Customers" },
                { value: "4.9★", label: "Rating" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-blue-200">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ Trust Badges ═══════════════ */}
      <section className="border-b border-neutral-200 bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                icon: <Truck size={24} />,
                title: "Free Delivery",
                desc: "On orders over ฿1,000",
              },
              {
                icon: <ShieldCheck size={24} />,
                title: "Secure Payment",
                desc: "100% protected transactions",
              },
              {
                icon: <Headphones size={24} />,
                title: "24/7 Support",
                desc: "We're always here to help",
              },
            ].map((badge) => (
              <div
                key={badge.title}
                className="flex items-center gap-4 rounded-lg border border-neutral-200 px-5 py-4 transition-colors hover:border-primary/30 hover:bg-primary-light"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
                  {badge.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-800">{badge.title}</p>
                  <p className="text-xs text-neutral-500">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ Latest Products ═══════════════ */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 text-primary mb-1">
              <Sparkles size={18} />
              <span className="text-sm font-semibold uppercase tracking-wide">Just Arrived</span>
            </div>
            <h2 className="text-2xl font-bold text-neutral-800 sm:text-3xl">
              Latest Products
            </h2>
          </div>
          <Link
            href="/products"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary-hover"
          >
            View All
            <ArrowRight size={16} />
          </Link>
        </div>

        {latestProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6">
            {latestProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-200 py-16">
            <Package size={48} className="text-neutral-300 mb-3" />
            <p className="text-neutral-500 text-sm">No products available yet.</p>
          </div>
        )}

        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary-hover"
          >
            View All Products
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ═══════════════ Popular / Trending ═══════════════ */}
      {popularProducts.length > 0 && (
        <section className="bg-surface border-y border-neutral-200">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <div className="flex items-center gap-2 text-warning mb-1">
                  <TrendingUp size={18} />
                  <span className="text-sm font-semibold uppercase tracking-wide">Trending</span>
                </div>
                <h2 className="text-2xl font-bold text-neutral-800 sm:text-3xl">
                  Popular Products
                </h2>
              </div>
              <Link
                href="/products"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary-hover"
              >
                View All
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
              {popularProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════ CTA Banner ═══════════════ */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-primary to-blue-700 px-6 py-12 sm:px-12 sm:py-16 text-center">
          {/* Decorative circles */}
          <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-10 -right-10 h-52 w-52 rounded-full bg-white/10" />

          <div className="relative">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Ready to start shopping?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-blue-100">
              Create an account today and get exclusive access to deals, fast checkout, and order tracking.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-primary shadow-md transition-all hover:bg-blue-50 hover:shadow-lg"
              >
                Create Account
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10"
              >
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}