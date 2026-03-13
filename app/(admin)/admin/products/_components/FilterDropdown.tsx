"use client";
import { useState, useRef, useEffect } from "react";
import { Filter, ChevronDown, ArrowUpDown, PackageCheck, PackageX, Layers, X, Check } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

const stockOptions = [
    { value: "all", label: "All Products", icon: Layers, color: "text-gray-600", bg: "bg-gray-50" },
    { value: "in_stock", label: "In Stock", icon: PackageCheck, color: "text-green-600", bg: "bg-green-50" },
    { value: "out_of_stock", label: "Out of Stock", icon: PackageX, color: "text-red-600", bg: "bg-red-50" },
];

const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "price_asc", label: "Price: Low → High" },
    { value: "price_desc", label: "Price: High → Low" },
    { value: "name_asc", label: "Name: A → Z" },
    { value: "name_desc", label: "Name: Z → A" },
    { value: "stock_asc", label: "Stock: Low → High" },
    { value: "stock_desc", label: "Stock: High → Low" },
];

export default function FilterDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const currentStock = searchParams.get("stock") || "all";
    const currentSort = searchParams.get("sort") || "newest";

    const activeFilterCount =
        (currentStock !== "all" ? 1 : 0) + (currentSort !== "newest" ? 1 : 0);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const applyFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if ((key === "stock" && value === "all") || (key === "sort" && value === "newest")) {
            params.delete(key);
        } else {
            params.set(key, value);
        }
        replace(`${pathname}?${params.toString()}`);
    };

    const clearFilters = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("stock");
        params.delete("sort");
        replace(`${pathname}?${params.toString()}`);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                    activeFilterCount > 0
                        ? "text-primary bg-primary/5 border border-primary/20 hover:bg-primary/10"
                        : "text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                }`}
            >
                <Filter className={`size-4 ${activeFilterCount > 0 ? "text-primary" : "text-gray-500"}`} />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                    <span className="flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-primary rounded-full">
                        {activeFilterCount}
                    </span>
                )}
                <ChevronDown className={`size-3.5 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div className="absolute right-0 z-50 mt-2 w-72 origin-top-right animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="rounded-xl border border-gray-200 bg-white shadow-lg shadow-gray-200/50 overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                            <span className="text-sm font-semibold text-gray-800">Filters</span>
                            {activeFilterCount > 0 && (
                                <button
                                    onClick={clearFilters}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                                >
                                    <X className="size-3" />
                                    Clear all
                                </button>
                            )}
                        </div>

                        <div className="p-3 space-y-4">
                            {/* Stock Status Section */}
                            <div>
                                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
                                    Stock Status
                                </p>
                                <div className="grid grid-cols-1 gap-1">
                                    {stockOptions.map((option) => {
                                        const Icon = option.icon;
                                        const isActive = currentStock === option.value;
                                        return (
                                            <button
                                                key={option.value}
                                                onClick={() => applyFilter("stock", option.value)}
                                                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm transition-all duration-150 cursor-pointer ${
                                                    isActive
                                                        ? "bg-primary/5 text-primary font-medium ring-1 ring-primary/20"
                                                        : "text-gray-600 hover:bg-gray-50"
                                                }`}
                                            >
                                                <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${isActive ? "bg-primary/10" : option.bg}`}>
                                                    <Icon className={`size-4 ${isActive ? "text-primary" : option.color}`} />
                                                </div>
                                                <span>{option.label}</span>
                                                {isActive && (
                                                    <Check className="size-4 text-primary ml-auto" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-gray-100" />

                            {/* Sort Section */}
                            <div>
                                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1 flex items-center gap-1.5">
                                    <ArrowUpDown className="size-3" />
                                    Sort By
                                </p>
                                <div className="grid grid-cols-1 gap-0.5">
                                    {sortOptions.map((option) => {
                                        const isActive = currentSort === option.value;
                                        return (
                                            <button
                                                key={option.value}
                                                onClick={() => applyFilter("sort", option.value)}
                                                className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-all duration-150 cursor-pointer ${
                                                    isActive
                                                        ? "bg-primary/5 text-primary font-medium"
                                                        : "text-gray-600 hover:bg-gray-50"
                                                }`}
                                            >
                                                <div className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-primary" : "bg-gray-300"}`} />
                                                <span>{option.label}</span>
                                                {isActive && (
                                                    <Check className="size-3.5 text-primary ml-auto" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
