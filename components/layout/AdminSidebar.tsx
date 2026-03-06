'use client';

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ChevronRight, ListChecks, Plus } from "lucide-react";

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  {
    href: "/admin/products",
    label: "Products",
    icon: Package,
    hasSubmenu: false,
    submenu: [
      { href: "/admin/products", label: "All Products", icon: ListChecks },
      { href: "/admin/products/create", label: "Add Product", icon: Plus },
    ],
  },
];

export default function AdminSidebar({ isOpen, isMobile = false }: { isOpen: boolean; isMobile?: boolean }) {
  const pathname = usePathname();
  const [expandedSubmenu, setExpandedSubmenu] = useState<string | null>("/admin/products");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  const handleSubmenuToggle = (href: string) => {
    setExpandedSubmenu(expandedSubmenu === href ? null : href);
  };

  // On mobile, always show expanded when open
  const shouldExpand = isMobile ? true : (isOpen || isSidebarHovered);

  return (
    <aside 
      onMouseEnter={() => !isMobile && setIsSidebarHovered(true)}
      onMouseLeave={() => !isMobile && setIsSidebarHovered(false)}
      className={`${shouldExpand ? "w-64" : "w-20"} bg-neutral-950 min-h-screen h-full flex flex-col border-r border-neutral-800/60 transition-all duration-300`}>
      {/* Logo */}
      <div className={`pt-6 pb-8 transition-all duration-300 ${shouldExpand ? "px-6" : "px-3"}`}>
        <div className={`flex items-center rounded-lg p-2 transition-all duration-300 ${shouldExpand ? "gap-3" : "justify-center"}`}>
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 shadow-lg shadow-primary/5 shrink-0">
            <Package className="size-6 text-primary" />
          </div>
          {shouldExpand && <div>
            <h1 className="text-lg font-bold text-white tracking-tight leading-tight">
              Admin<span className="text-primary">Panel</span>
            </h1>
            <p className="text-[10px] text-neutral-500 font-medium uppercase tracking-widest">Stock Flow</p>
          </div>}
        </div>
      </div>

      {/* Divider */}
      {shouldExpand && <div className="mx-5 h-px bg-linear-to-r from-transparent via-neutral-800 to-transparent"></div>}

      {/* Navigation */}
      <nav className="flex-1 px-3 pt-6 space-y-1 overflow-y-auto">
        {shouldExpand && <p className="px-3 mb-3 text-[10px] font-semibold text-neutral-500 uppercase tracking-widest">Menu</p>}

        {menuItems.map((item) => {
          const isActive = item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);
          const isSubmenuOpen = expandedSubmenu === item.href;
          const isItemHovered = hoveredItem === item.href;

          return (
            <div key={item.href}>
              {/* Menu Item - Link for items without submenu, Button for items with submenu */}
              {!item.hasSubmenu ? (
                <Link
                  href={item.href}
                  className={`group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "text-neutral-400 hover:bg-white/5 hover:text-white"
                  } ${!shouldExpand ? "justify-center" : ""}`}
                  title={!shouldExpand ? item.label : ""}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1.5 w-1 h-5 bg-primary rounded-full shadow-md shadow-primary/50"></span>
                  )}

                  <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-200 shrink-0 ${
                    isActive
                      ? "bg-white/20"
                      : "bg-neutral-800/50 group-hover:bg-neutral-800"
                  }`}>
                    <item.icon className="size-4.5" />
                  </div>

                  {shouldExpand && <span>{item.label}</span>}
                </Link>
              ) : (
                <button
                  onMouseEnter={() => !shouldExpand && setHoveredItem(item.href)}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={() => handleSubmenuToggle(item.href)}
                  className={`group relative cursor-pointer w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "text-neutral-400 hover:bg-white/5 hover:text-white"
                  } ${!shouldExpand ? "justify-center" : ""}`}
                  title={!shouldExpand ? item.label : ""}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1.5 w-1 h-5 bg-primary rounded-full shadow-md shadow-primary/50"></span>
                  )}

                  <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-200 shrink-0 ${
                    isActive
                      ? "bg-white/20"
                      : "bg-neutral-800/50 group-hover:bg-neutral-800"
                  }`}>
                    <item.icon className="size-4.5" />
                  </div>

                  {shouldExpand && <span>{item.label}</span>}

                  {item.hasSubmenu && shouldExpand && (
                    <ChevronRight className={`size-4 ml-auto transition-all duration-300 ${
                      isSubmenuOpen ? "rotate-90" : ""
                    } ${isActive ? "text-white/70" : "text-neutral-600 group-hover:text-neutral-400"}`} />
                  )}

                  {/* Hover Tooltip (only when closed) */}
                  {!shouldExpand && isItemHovered && (
                    <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 whitespace-nowrap text-xs text-white z-50 shadow-xl pointer-events-none">
                      {item.label}
                      <div className="absolute right-full mr-1 top-1/2 -translate-y-1/2 border-4 border-transparent border-r-neutral-900"></div>
                    </div>
                  )}
                </button>
              )}

              {/* Submenu */}
              {item.hasSubmenu && isSubmenuOpen && shouldExpand && (
                <div className="mt-1 space-y-1 ml-2 pl-3 border-l border-neutral-800/50">
                  {item.submenu?.map((subitem) => {
                    const isSubActive = pathname === subitem.href;
                    return (
                      <Link
                        key={subitem.href}
                        href={subitem.href}
                        className={`group/sub relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                          isSubActive
                            ? "bg-primary/20 text-primary"
                            : "text-neutral-500 hover:text-neutral-300 hover:bg-white/5"
                        }`}
                      >
                        <div className={`flex items-center justify-center w-6 h-6 rounded-md transition-colors duration-200 shrink-0 ${
                          isSubActive
                            ? "bg-primary/30"
                            : "bg-neutral-800/30 group-hover/sub:bg-neutral-800/50"
                        }`}>
                          <subitem.icon className="size-3.5" />
                        </div>
                        <span>{subitem.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom Section */}
      {shouldExpand && <div className="px-4 pb-6 ">
        <div className="rounded-xl bg-linear-to-br from-primary/20 to-primary/5 border border-primary/10 p-4">
          <p className="text-xs font-semibold text-white mb-1">Stock Flow v1.0</p>
          <p className="text-[11px] text-neutral-400 leading-relaxed">Warehouse Management System</p>
        </div>
      </div>}
    </aside>
  );
}