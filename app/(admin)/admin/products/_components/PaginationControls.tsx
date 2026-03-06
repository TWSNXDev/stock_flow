'use client';
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function PaginationControls({ hasNextPage, hasPrevPage, currentPage }: { hasNextPage: boolean, hasPrevPage: boolean, currentPage: number }) {
    const { replace } = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const changePage = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());
        replace(`${pathname}?${params.toString()}`);
    }

    return (
        <div className="flex items-center gap-1">
            <button
                disabled={!hasPrevPage}
                onClick={() => changePage(currentPage - 1)}
                className="px-3 py-1.5 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                Previous
            </button>
            <button className="px-3 py-1.5 text-xs font-medium text-white bg-primary rounded-lg transition-colors">
                1
            </button>
            <button
                disabled={!hasNextPage}
                onClick={() => changePage(currentPage + 1)}
                className="px-3 py-1.5 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                Next
            </button>
        </div>
    )
}