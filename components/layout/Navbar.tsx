"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  Package,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import CartDrawer from "@/components/shop/CartDrawer";

export default function Navbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const cartCount = useCartStore((s) => s.items.reduce((sum, item) => sum + item.quantity, 0));

  // Close user dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/orders", label: "Orders" },
  ];

  return (
    <>
    <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-neutral-200 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white transition-transform group-hover:scale-105">
              <Package size={20} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold text-neutral-800 tracking-tight hidden sm:block">
              Stock<span className="text-primary">Flow</span>
            </span>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-3 py-2 text-sm font-medium text-neutral-500 rounded-lg transition-colors hover:text-primary hover:bg-primary-light"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ── Search Bar (Desktop) ── */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-300" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-2 pl-9 pr-4 text-sm text-neutral-800 placeholder:text-neutral-300 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-surface"
              />
            </div>
          </div>

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-2">

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-primary"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-primary cursor-pointer"
              aria-label="Cart"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-error text-[10px] font-bold text-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>

            {/* ── User Area ── */}
            {session?.user ? (
              <div ref={userMenuRef} className="relative hidden md:block">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-100"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <User size={16} />
                  </div>
                  <span className="max-w-25 truncate">{session.user.name ?? "User"}</span>
                  <ChevronDown
                    size={14}
                    className={`text-neutral-400 transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 origin-top-right rounded-lg border border-neutral-200 bg-surface py-1.5 shadow-md animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3.5 py-2 border-b border-neutral-200">
                      <p className="text-sm font-semibold text-neutral-800 truncate">{session.user.name}</p>
                      <p className="text-xs text-neutral-500 truncate">{session.user.email}</p>
                    </div>

                    {session.user.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-neutral-500 transition-colors hover:text-primary hover:bg-primary-light"
                      >
                        <LayoutDashboard size={16} />
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={() => signOut()}
                      className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-error transition-colors hover:bg-red-50 cursor-pointer"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/login"
                  className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-100"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-primary"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* ── Mobile Search (collapsible) ── */}
        {searchOpen && (
          <div className="md:hidden pb-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-300" />
              <input
                type="text"
                placeholder="Search products..."
                autoFocus
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-2 pl-9 pr-4 text-sm text-neutral-800 placeholder:text-neutral-300 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-surface"
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Mobile Navigation Drawer ── */}
      {mobileOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-surface">
          <nav className="flex flex-col px-4 py-3 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-500 transition-colors hover:text-primary hover:bg-primary-light"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="border-t border-neutral-200 px-4 py-3">
            {session?.user ? (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <User size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-neutral-800 truncate">{session.user.name}</p>
                    <p className="text-xs text-neutral-500 truncate">{session.user.email}</p>
                  </div>
                </div>

                {session.user.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-500 transition-colors hover:text-primary hover:bg-primary-light"
                  >
                    <LayoutDashboard size={16} />
                    Admin Dashboard
                  </Link>
                )}

                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-error transition-colors hover:bg-red-50 cursor-pointer"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg border border-neutral-200 px-4 py-2.5 text-center text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-100"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-primary-hover"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}