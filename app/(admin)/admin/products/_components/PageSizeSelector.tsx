"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function PageSizeSelector() {
    const searchParams = useSearchParams();
    const { replace } = useRouter();
    const pathname = usePathname();

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSize = e.target.value;
        const params = new URLSearchParams(searchParams.toString());
        params.set('size', newSize.toString());
        params.set('page', '1');
        replace(`${pathname}?${params.toString()}`);
    }

    return (
        <div className="flex items-center gap-2">
            <label htmlFor="pageSize" className="text-sm font-medium text-neutral-600 whitespace-nowrap">
                Items per page:
            </label>
            <select
                id="pageSize"
                name="pageSize"
                defaultValue={new URLSearchParams(searchParams.toString()).get('size') || '2'}
                onChange={handlePageSizeChange}
                className="px-4 py-2 rounded-md border border-gray-300 appearance-none text-center text-sm outline-none cursor-pointer"
            >
                <option value="2">2</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
            </select>
        </div>
    )
}