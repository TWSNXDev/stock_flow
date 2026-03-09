"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ArrowUpDown } from "lucide-react";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "name_asc", label: "Name: A → Z" },
  { value: "name_desc", label: "Name: Z → A" },
];

export default function ShopSortSelect({
  current,
  q,
  stock,
}: {
  current?: string;
  q?: string;
  stock?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (stock) params.set("stock", stock);
    if (e.target.value && e.target.value !== "newest") {
      params.set("sort", e.target.value);
    }
    params.delete("page");
    const qs = params.toString();
    startTransition(() => {
      router.push(`/products${qs ? `?${qs}` : ""}`);
    });
  };

  return (
    <div className="relative">
      <ArrowUpDown
        size={14}
        className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400"
      />
      <select
        value={current || "newest"}
        onChange={handleChange}
        disabled={isPending}
        className={`appearance-none rounded-lg border border-neutral-200 bg-neutral-50 py-2 pl-8 pr-8 text-xs font-medium text-neutral-800 outline-none transition-all cursor-pointer hover:border-neutral-300 focus:border-primary focus:ring-2 focus:ring-primary/20 ${
          isPending ? "opacity-60" : ""
        }`}
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
