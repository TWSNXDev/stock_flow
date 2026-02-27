import Link from "next/link";
import { LayoutDashboard, Package, ChevronRight } from "lucide-react"; // แนะนำให้ลง lucide-react

export default function AdminSidebar() {
  const baseLinkClasses = "px-4 h-11 w-full rounded-md font-medium flex items-center gap-3 transition-all duration-200";

  const inactiveClasses = "text-neutral-300 hover:bg-neutral-800 hover:text-white";

  const activeClasses = "bg-primary text-white shadow-md";

  const isActive = false;

  return (
    <div className="w-64 bg-neutral-950 h-screen p-4 flex flex-col border-r border-neutral-800">
      <div className="text-2xl pt-2 pb-8 font-bold text-white flex items-center justify-center gap-2">
        <Package className="size-7 text-primary" />
        <span className="tracking-tight">Admin<span className="text-primary">Panel</span></span>
      </div>
      
      <nav className="flex flex-col gap-2">
        <Link href="/admin" className={`${baseLinkClasses} ${isActive ? activeClasses : inactiveClasses}`}>
          <LayoutDashboard className="size-5" />
          Dashboard
        </Link>
        
        <Link href="/admin/products" className={`${baseLinkClasses} ${isActive ? activeClasses : inactiveClasses}`}>
          <Package className="size-5" />
          Products
          <ChevronRight className="size-4 ml-auto text-neutral-500" />
        </Link>
      </nav>

      <div className="mt-auto bg-neutral-900 p-4 rounded-lg text-center">
        <p className="text-sm text-neutral-400">Logged in as</p>
        <p className="text-white font-semibold">Admin User</p>
      </div>
    </div>
  );
}