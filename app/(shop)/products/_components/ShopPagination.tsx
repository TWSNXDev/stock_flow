import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ShopPagination({
  currentPage,
  totalPages,
  q,
  sort,
  stock,
}: {
  currentPage: number;
  totalPages: number;
  q?: string;
  sort?: string;
  stock?: string;
}) {
  function buildHref(page: number) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (sort) params.set("sort", sort);
    if (stock) params.set("stock", stock);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return `/products${qs ? `?${qs}` : ""}`;
  }

  // Generate visible page numbers (show max 5 around current)
  const pages = getVisiblePages(currentPage, totalPages);

  return (
    <div className="mt-10 flex items-center justify-center gap-1">
      {/* Prev */}
      {currentPage > 1 ? (
        <Link
          href={buildHref(currentPage - 1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </Link>
      ) : (
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-300 cursor-not-allowed">
          <ChevronLeft size={16} />
        </span>
      )}

      {/* Page Numbers */}
      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="flex h-9 w-9 items-center justify-center text-xs text-neutral-400"
          >
            ...
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(p as number)}
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
              p === currentPage
                ? "bg-primary text-white shadow-sm"
                : "border border-neutral-200 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
            }`}
          >
            {p}
          </Link>
        )
      )}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={buildHref(currentPage + 1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </Link>
      ) : (
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-300 cursor-not-allowed">
          <ChevronRight size={16} />
        </span>
      )}
    </div>
  );
}

function getVisiblePages(current: number, total: number): (number | "...")[] {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [];

  if (current <= 3) {
    pages.push(1, 2, 3, 4, "...", total);
  } else if (current >= total - 2) {
    pages.push(1, "...", total - 3, total - 2, total - 1, total);
  } else {
    pages.push(1, "...", current - 1, current, current + 1, "...", total);
  }

  return pages;
}
