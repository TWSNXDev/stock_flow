"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Search, X } from "lucide-react";

export default function ShopSearch({ defaultValue }: { defaultValue?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue || "");
  const [isPending, startTransition] = useTransition();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(window.location.search);
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    params.delete("page"); // reset to page 1
    startTransition(() => {
      router.push(`/products?${params.toString()}`);
    });
  }, 400);

  const handleClear = () => {
    setValue("");
    const params = new URLSearchParams(window.location.search);
    params.delete("q");
    params.delete("page");
    startTransition(() => {
      router.push(`/products?${params.toString()}`);
    });
  };

  return (
    <div className="relative flex-1 max-w-md">
      <Search
        size={16}
        className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
          isPending ? "text-primary animate-pulse" : "text-neutral-300"
        }`}
      />
      <input
        type="text"
        placeholder="Search products..."
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          handleSearch(e.target.value);
        }}
        className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-2 pl-9 pr-9 text-sm text-neutral-800 placeholder:text-neutral-300 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-surface"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
